// import { WNATIVE_ADDRESS }  from "@zarclays/zswap-core-sdk";

import { AddressMap } from "@zarclays/zswap-core-sdk";

// const zswapCore = await import("@zarclays/zswap-core-sdk");
// const {WETH9_ADDRESS, WNATIVE_ADDRESS } = zswapCore;
let WETH9_ADDRESS: AddressMap;
let WNATIVE_ADDRESS: AddressMap;
const zswapCore = import("@zarclays/zswap-core-sdk").then((zswapCore)=>{
  WETH9_ADDRESS = zswapCore.WETH9_ADDRESS;
  WNATIVE_ADDRESS = zswapCore.WNATIVE_ADDRESS;

});


const func = async function ({ getNamedAccounts, deployments, ethers,getChainId }) {
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const chainId = await getChainId();
  
  let wethAddress;

  if (chainId in WNATIVE_ADDRESS) {
    wethAddress = WNATIVE_ADDRESS[chainId];
  } else {
    const weth = await ethers.getContract("WETH9");
    wethAddress = weth.address
    if(!wethAddress){
      throw Error("No WNATIVE!");
    }
  }

  
  const factoryAddress = (await deployments.get("UniswapV2Factory")).address;

  await deploy("UniswapV2Router02", {
    from: deployer,
    args: [factoryAddress, wethAddress],
    log: true,
    deterministicDeployment: false // "0xdfeac320912098",
  });
};

func.tags = ["UniswapV2Router02", "AMM"];
func.dependencies = ["UniswapV2Factory","WETH", "Mocks"];
export default func;