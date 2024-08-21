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

  let zSwapAddress;

  if (chainId === "31337" || chainId === "1337") {
    zSwapAddress = (await deployments.get("ZSwapToken")).address;
  } else if (chainId in ZSWAPTOKEN_ADDRESS) {
    zSwapAddress = ZSWAPTOKEN_ADDRESS[chainId];
  } else {
    const zswap = await ethers.getContract("ZSwapToken")
    zSwapAddress= zswap.address
    // throw Error("No SUSHI!");
  }

  // daily distribution rate: 20 million / (2 years * 365 days) ≈ 27,397 tokens per day per chain.
  const rewardPerSecond = 27397/(24*60*60)

  await deploy("MiniChefV3", {
    from: deployer,
    args: [zSwapAddress, parseEther(rewardPerSecond.toString()), deployer],
    log: true,
    deterministicDeployment: true,
  });

  const miniChefV3 = await ethers.getContract("MiniChefV3");
    
  if ((await miniChefV3.owner()) !== dev) {
    console.log("Transfer ownership of MiniChef to dev");
    await (await miniChefV3.transferOwnership(dev, true, false)).wait();
  }

  console.log("Owner:  ", await miniChefV3.owner());
  console.log("deployer:  ", deployer, ", dev: ", dev);
  if (chainId == '31337') {
    console.log("Adding Lp1 and L2 start ");
    const lp1 = await deploy("TestToken2", {
      from: deployer,
      log: true,
      args: [deployer, 'LP Token 1', 'LPTOKEN1'],
      deterministicDeployment: false
    })
  
    const lp2 = await deploy("TestToken2", {
      from: deployer,
      log: true,
      args: [deployer, 'LP Token 2', 'LPTOKEN2'],
      deterministicDeployment: false
    })
    console.log("Adding Lp1 and L2 - devevve", lp1.address, lp2.address, (await ethers.getNamedSigner("dev")).address);
    await (await miniChefV3.connect(await ethers.getNamedSigner("dev")).add(150, lp1.address, false)).wait();
    await (await miniChefV3.connect(await ethers.getNamedSigner("dev")).add(50, lp2.address, true)).wait();
  }

};
export default func;
func.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]
func.tags = ['MiniChefV3'];
