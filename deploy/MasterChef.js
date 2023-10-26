module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  console.log('deployer, dev ', deployer, dev)

  const sushi = await ethers.getContract("ZSwapToken")
  
  const { address } = await deploy("MasterChef", {
    from: deployer,
    args: [sushi.address, dev, "10000000000000000000", "0", "1000000000000000000000"],
    log: true,
    deterministicDeployment: false
  })

  // if (await sushi.owner() !== address) {
  if (await sushi.isAdmin( address) ) {  
    //isAdmin
    // Give Mint Role to Chef
    console.log("Give Mint role Ownership to Chef")
    await (await sushi.transferOwnership(address)).wait()
  }

  const masterChef = await ethers.getContract("MasterChef")
  if (await masterChef.owner() !== dev) {
    // Transfer ownership of MasterChef to dev
    console.log("Transfer ownership of MasterChef to dev")
    await (await masterChef.transferOwnership(dev)).wait()
  }
}

module.exports.tags = ["MasterChef"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02", "ZSwapToken"]
