 const func = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  console.log('deployer for zswaptoken:', deployer)

  await deploy("ZSwapToken", {
    from: deployer,
    log: true,
    args:[deployer],
    deterministicDeployment: false,// "0xfeedDAbb"
  })
}

func.tags = ["ZSwapToken"]
// module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]

export default func
