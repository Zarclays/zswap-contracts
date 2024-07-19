 module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  await deploy("ZSwapToken", {
    from: deployer,
    log: true,
    deterministicDeployment: true
  })
}

module.exports.tags = ["ZSwapToken"]
// module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]
