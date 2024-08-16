// import { ZSWAPTOKEN_ADDRESS } from "@zarclays/zswap-core-sdk";

import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { parseEther } from 'ethers';
import { AddressMap } from '@zarclays/zswap-core-sdk';

let ZSWAPTOKEN_ADDRESS: AddressMap;
const zswapCore = import("@zarclays/zswap-core-sdk").then((zswapCore)=>{
  ZSWAPTOKEN_ADDRESS = zswapCore.ZSWAPTOKEN_ADDRESS;


});


//@ts-ignore
const func: DeployFunction = async function ({ ethers, deployments, getNamedAccounts, getChainId }) {
	const { deploy } = deployments;

  const { deployer, dev } = await getNamedAccounts();

  const chainId = await getChainId();

  let zSwapAddress;

  if (chainId === "31337" || chainId === "1337") {
    zSwapAddress = (await deployments.get("ZSwapToken")).address;
  } else if (chainId in ZSWAPTOKEN_ADDRESS) {
    zSwapAddress = ZSWAPTOKEN_ADDRESS[chainId];
  } else {
    const zswap = await ethers.getContract("ZSwapToken")
    zSwapAddress= zswap.address
    // throw Error("No SUSHI!");
  }

  // daily distribution rate: 20 million / (2 years * 365 days) ≈ 27,397 tokens per day per chain.
  const rewardPerSecond = 27397/(24*60*60)

  await deploy("MiniChefV3", {
    from: deployer,
    args: [zSwapAddress, parseEther(rewardPerSecond.toString()), deployer],
    log: true,
    deterministicDeployment: true,
  });

  const miniChefV3 = await ethers.getContract("MiniChefV3");
  if ((await miniChefV3.owner()) !== dev) {
    console.log("Transfer ownership of MiniChef to dev");
    await (await miniChefV3.transferOwnership(dev, true, false)).wait();
  }

};
export default func;
func.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]
func.tags = ['MiniChefV3'];
