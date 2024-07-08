 module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  console.log('TestToken deployer is ', deployer)

  await deploy("TestToken2", {
    from: deployer,
    log: true,
    deterministicDeployment: false,
    args:[ "Tether (USDT)","USDT"]
  })
}

module.exports.tags = ["usdt"]
// module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]
