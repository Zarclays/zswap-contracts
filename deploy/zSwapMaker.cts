// import { WETH9_ADDRESS, WNATIVE_ADDRESS } from "@zarclays/zswap-core-sdk"

// const zswapCore = await import("@zarclays/zswap-core-sdk");
// const {WETH9_ADDRESS, WNATIVE_ADDRESS } = zswapCore;

import { AddressMap } from '@zarclays/zswap-core-sdk';


let WETH9_ADDRESS: AddressMap;
let WNATIVE_ADDRESS: AddressMap;
const zswapCore = import("@zarclays/zswap-core-sdk").then((zswapCore)=>{
  WETH9_ADDRESS = zswapCore.WETH9_ADDRESS;
  WNATIVE_ADDRESS = zswapCore.WNATIVE_ADDRESS;

});

const func = async function ({ ethers, getNamedAccounts, deployments, getChainId }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const chainId = await getChainId()

  const factory = await ethers.getContract("UniswapV2Factory")
  const bar = await ethers.getContract("SushiBar")
  const sushi = await ethers.getContract("ZSwapToken")
  
  let wethAddress;
  
  if (chainId === '31337' || chainId === '1337') {
    wethAddress = (await deployments.get("WETH9")).address
  } 
  else if (chainId in WETH9_ADDRESS) {
    wethAddress = WETH9_ADDRESS[chainId]
  }
  else if (chainId in WNATIVE_ADDRESS) {
    wethAddress = WNATIVE_ADDRESS[chainId]
  }
  else {
    const weth = await ethers.getContract("WETH9");
    wethAddress = weth.address
    if(!wethAddress){
      throw Error("No WETH!");
    }
  }


  await deploy("zSwapMaker", {
    from: deployer,
    args: [await factory.getAddress(), await bar.getAddress(), await sushi.getAddress(), wethAddress, deployer],
    log: true,
    deterministicDeployment: true
  })

  const maker = await ethers.getContract("zSwapMaker")
  if (await maker.owner() !== dev) {
    console.log("Setting maker owner")
    await (await maker.transferOwnership(dev)).wait()
  }
}

func.tags = ["zSwapMaker"]
func.dependencies = ["UniswapV2Factory","WETH", "UniswapV2Router02", "SushiBar", "ZSwapToken"]

export default func