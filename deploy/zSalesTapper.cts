
const func = async function ({ ethers, getNamedAccounts, deployments, getChainId }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const chainId = await getChainId()

  await deploy("zSalesTapper", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: true
  })

  
}

func.tags = ["zSalesTapper"]
func.dependencies = []

export default func