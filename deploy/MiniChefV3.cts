// import { ZSWAPTOKEN_ADDRESS } from "@zarclays/zswap-core-sdk";

import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { formatEther, parseEther } from 'ethers';
import { AddressMap } from '@zarclays/zswap-core-sdk';

let ZSWAPTOKEN_ADDRESS: AddressMap;
const zswapCore = import("@zarclays/zswap-core-sdk").then((zswapCore)=>{
  ZSWAPTOKEN_ADDRESS = zswapCore.ZSWAPTOKEN_ADDRESS;


});

/***
To adopt a rewards program similar to Sushi MiniChef for your decentralized exchange (DEX) across multiple chains, I'll walk you through the process step by step. Here's how you can achieve this with your 100 million tokens distributed over 2 years on 5 different chains:

Smart Contract Development:

Develop a MiniChef-style smart contract for each of the 5 chains.
Ensure the contracts can handle token distribution and reward calculations.


Token Allocation:

Divide your 100 million tokens among the 5 chains. For example, 20 million tokens per chain.
Calculate the daily distribution rate: 20 million / (2 years * 365 days) ≈ 27,397 tokens per day per chain.


Pool Selection:

Choose the pools you want to incentivize on each chain.
Assign allocation points to each pool based on their importance or desired incentive level.


Deployment:

Deploy the MiniChef contracts on each of the 5 chains.
Set up the initial parameters, including the daily token distribution rate and pool allocations.


User Interface:

Create a user interface for users to stake their liquidity provider (LP) tokens and claim rewards.
Ensure the interface can connect to all 5 chains.
*/

//APY

/*
To calculate the APY (Annual Percentage Yield) in terms of the reward token itself rather than its dollar value, you can adjust the formula to focus on the accumulation of the reward tokens over time, ignoring their fiat value. Here's how you can do it:

1. Calculate the Pool’s Reward Rate in Tokens
   Reward Per Second for the Pool:
   Reward_per_second_for_pool = (rewardPerSecond * allocPoint_for_Pool) / totalAllocPoint

2. Estimate the Daily Rewards in Tokens
   Daily Reward in Tokens:
   Daily_Reward = Reward_per_second_for_pool * 86400

3. Calculate the Pool's Total Staked Amount
   Total LP Tokens Staked in Pool:
   Total_LP_Tokens_Staked = LP_Tokens_in_Pool

4. Calculate the Daily Yield in Tokens
   Daily Yield in Tokens:
   Daily_Yield = Daily_Reward / Total_LP_Tokens_Staked

5. Annualize the Yield
   APY in Reward Tokens:
   APY_in_reward_tokens = (1 + Daily_Yield)^365 - 1



*/
 // Assuming you have the pool ID (_pid) and the MiniChefV3 contract instance (miniChef)
// uint256 totalLpTokensInPool = miniChef.lpToken(_pid).balanceOf(address(miniChef));




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


    const zswapTokenContract = await ethers.getContract("ZSwapToken");

    await(await zswapTokenContract.mint((await deployments.get("MiniChefV3")).address, parseEther('1000000'))).wait();
    // await(await zswapTokenContract.mint(lp2.address, parseEther('100000'))).wait();

    // console.log('Balance: ',formatEther( await zswapTokenContract.balanceOf((await deployments.get("MiniChefV3")).address)), (await deployments.get("MiniChefV3")).address )

    // console.log('Addreess: ', (await deployments.get("ZSwapToken")).address)

    // console.log('Reward: ',await miniChefV3.REWARD())
  }

};
export default func;
func.dependencies = ["ZSwapToken", "UniswapV2Factory", "UniswapV2Router02"]
func.tags = ['MiniChefV3'];
