const func = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const sushi = await deployments.get("ZSwapToken")

  await deploy("SushiBar", {
    from: deployer,
    args: [sushi.address],
    log: true,
    deterministicDeployment: false
  })
}

func.tags = ["SushiBar"]
func.dependencies = ["UniswapV2Factory", "UniswapV2Router02", "ZSwapToken"]
export default func