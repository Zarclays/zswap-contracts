import {DeployFunction} from 'hardhat-deploy/types';

//@ts-ignore
const func: DeployFunction = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  

  const sushi = await ethers.getContract("ZSwapToken")
  console.log('deployer, dev, sushi ', deployer, dev,await sushi.getAddress())
  const { address } = await deploy("MasterChef", {
    from: deployer,
    args: [await sushi.getAddress(), dev, "10000000000000000000", "0", "1000000000000000000000", deployer],
    log: true,
    deterministicDeployment: true
  })

  // if (await sushi.owner() !== address) {
  if (await sushi.isAdmin( address) ) {  
    //isAdmin
    // Give Mint Role to Chef
    console.log("Give Mint role Ownership to Chef")
    await (await sushi.transferOwnership(address)).wait()
  }

  const masterChef = await ethers.getContract("MasterChef")
  console.log('MatseChef owner:', await masterChef.owner())
  console.log('deployer:', deployer,', dev: ', dev)
  if (await masterChef.owner() !== dev) {
    // Transfer ownership of MasterChef to dev
    console.log("Transfer ownership of MasterChef to dev")
    await (await masterChef.transferOwnership(dev)).wait()
  }
}

export default func;
func.dependencies = ["UniswapV2Factory", "UniswapV2Router02", "ZSwapToken"]
func.tags = ['MasterChef'];