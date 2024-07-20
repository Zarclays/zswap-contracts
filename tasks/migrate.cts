import { subtask, task, types } from "hardhat/config";

import { getApprovalDigest } from "./utilities.cts"

import { ecsign } from "ethereumjs-util"

export async function migrate (
  { tokenA, tokenB },
  { 
    getChainId, 
    ethers: {
      getNamedSigner,
      utils: { hexlify },
      constants: { MaxUint256 },
      Wallet,
    },
    hre
  },
  runSuper
) {

  console.log("Migrate", hre.config.networks[hre.network.name].accounts)

   
  //@ts-ignore
  // Dev private key
  const privateKey = Wallet.fromMnemonic(config.networks[hre.network.name].accounts.mnemonic, "m/44'/60'/0'/0/1").privateKey

  const erc20Contract = await hre.ethers.getContractFactory("UniswapV2ERC20")

  const token = erc20Contract.attach("0x1c5DEe94a34D795f9EEeF830B68B80e44868d316")

  const deadline = MaxUint256

  const dev = await getNamedSigner("dev")

  //@ts-ignore
  const nonce = await token.connect(dev).nonces(dev.address)

  const sushiRoll = await hre.ethers.getContract("SushiRoll")

  const chainId = await getChainId()

  const digest = await getApprovalDigest(
    token,
    chainId,
    {
      owner: dev.address,
      spender: sushiRoll.getAddress(),
      value: await token.balanceOf(dev.address),
    },
    nonce,
    deadline
  )

  const { v, r, s } = ecsign(
    Buffer.from(digest.slice(2), "hex"),
    Buffer.from(privateKey.slice(2), "hex")
  )

  console.log({ v, r: hexlify(r), s: hexlify(s) })

  const migrateTx = await sushiRoll
    .connect(dev)
    //@ts-ignore
    .migrateWithPermit(
      tokenA,
      tokenB,
      await token.balanceOf(dev.address),
      0,
      0,
      deadline,
      v,
      hexlify(r),
      hexlify(s),
      {
        gasLimit: 8000000,
        gasPrice: 100000000000,
      }
    )

  await migrateTx.wait()

  console.log(migrateTx)
}
