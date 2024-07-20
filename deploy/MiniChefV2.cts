// import { ZSWAPTOKEN_ADDRESS } from "@zarclays/zswap-core-sdk";

import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { parseEther } from 'ethers';
import { AddressMap } from '@zarclays/zswap-core-sdk';

let ZSWAPTOKEN_ADDRESS: AddressMap;
const zswapCore = import("@zarclays/zswap-core-sdk").then((zswapCore)=>{
  ZSWAPTOKEN_ADDRESS = zswapCore.ZSWAPTOKEN_ADDRESS;


});


//@ts-ignore
const func: DeployFunction = async function ({ ethers, deployments, getNamedAccounts, getChainId }) {
	const { deploy } = deployments;

  const { deployer, dev } = await getNamedAccounts();

  const chainId = await getChainId();

  let sushiAddress;

  if (chainId === "31337" || chainId === "1337") {
    sushiAddress = (await deployments.get("ZSwapToken")).address;
  } else if (chainId in ZSWAPTOKEN_ADDRESS) {
    sushiAddress = ZSWAPTOKEN_ADDRESS[chainId];
  } else {
    const sushi = await ethers.getContract("ZSwapToken")
    sushiAddress= sushi.address
    // throw Error("No SUSHI!");
  }

  await deploy("MiniChefV2", {
    from: deployer,
    args: [sushiAddress, deployer],
    log: true,
    deterministicDeployment: true,
  });

  const miniChefV2 = await ethers.getContract("MiniChefV2");
  if ((await miniChefV2.owner()) !== dev) {
    console.log("Transfer ownership of MiniChef to dev");
    await (await miniChefV2.transferOwnership(dev, true, false)).wait();
  }

};
export default func;
func.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]
func.tags = ['MiniChefV2'];
