 const func = async function ({ethers, getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  console.log('TestToken deployer is ', deployer)

  await deploy("USDTTestToken2", {
    contract: 'TestToken2',
    from: deployer,
    log: true,
    deterministicDeployment: false,
    args:[deployer, "Tether (USDT)","USDT"]
  })


  await deploy("LoveTestToken2", {
    contract: 'TestToken2',
    from: deployer,
    log: true,
    deterministicDeployment: false,
    args:[deployer, "Love","LOVE"]
  })

  // const router = await ethers.getContract("UniswapV2Router"); 
  //   await run("erc20:approve", { token: tokenA, spender: router.getAddress() });
  //   await run("erc20:approve", { token: tokenB, spender: router.getAddress()});
  //   await (
  //     await router
  //       .connect(await getNamedSigner("dev"))
  //       //@ts-ignore
  //       .addLiquidity(
  //         tokenA,
  //         tokenB,
  //         tokenADesired,
  //         tokenBDesired,
  //         tokenAMinimum,
  //         tokenBMinimum,
  //         to,
  //         deadline
  //       )
  //   ).wait();
   console.log('dedaline: a', new Date().getTime()/1000)
   console.log('dedaline: b', new Date(2024,11,30,1,1,1).getTime()/1000)
   console.log('parsed: b', ethers.parseEther('100000'))
   console.log('parsed: b', ethers.parseEther('60000'))
}

func.tags = ["usdt"]
// module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]

export default func
