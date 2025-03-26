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

  
  if (chainId ==='31337') {
    wethAddress=(await deployments.get("WETH9")).address;
    if(!wethAddress){
      throw Error("No WNATIVE!");
    }
  } 
  else if (chainId in WNATIVE_ADDRESS) {
    wethAddress = WNATIVE_ADDRESS[chainId];
  } 
  else if(chainId=='1115'){
    wethAddress='0x4530f5E2dA67384eC4d86Fa78020602CDb40e7b5'
  }
  else if(chainId=='1313161554'){
    wethAddress='0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB'
  }
  
  else {
    // const weth = await ethers.getContract("WETH9");
    // wethAddress = weth.address
    wethAddress=(await deployments.get("WETH9")).address;
    if(!wethAddress){
      throw Error("No WNATIVE!");
    }
  }

  
  const factoryAddress = (await deployments.get("UniswapV3Factory")).address;


  console.log('deploying router fro deployer address:  ', deployer )

  console.log('wethAddress is ', wethAddress)

  

  const quoter = await deploy('Quoter', {
    from: deployer,
    args: [factoryAddress, wethAddress],
    log: true,
  });

  const nativeCurrencyLabelBytes = ethers.encodeBytes32String("ZSWAP");

  const nftDescriptor = await deploy('NFTDescriptor', {
    from: deployer,
    log: true,
  });

  const nonfungibleTokenPositionDescriptor = await deploy('NonfungibleTokenPositionDescriptor', {
    from: deployer,
    args: [wethAddress, nativeCurrencyLabelBytes],
    libraries: { NFTDescriptor: nftDescriptor.address },
    log: true,
  });

  const nonfungiblePositionManager = await deploy('NonfungiblePositionManager', {
    from: deployer,
    args: [factoryAddress, wethAddress, nonfungibleTokenPositionDescriptor.address],
    log: true,
  });

  const swapRouter = await deploy('SwapRouter', {
    from: deployer,
    args: [factoryAddress, wethAddress],
    log: true,
  });

  const v3Migrator = await deploy('V3Migrator', {
    from: deployer,
    args: [factoryAddress, wethAddress, nonfungiblePositionManager.address],
    log: true,
  });


};

func.tags = ["V3Periphery", "AMM3"];
func.dependencies = ["V3Factory","WETH"];
export default func;