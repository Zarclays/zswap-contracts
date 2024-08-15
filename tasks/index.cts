

import "./token.cts";
import { types, task, subtask } from "hardhat/config.js";
import { accounts} from "./accounts.cjs";
import {generateMnemonic} from "./generate-mnemonic.cjs"

import {pkFromMnemonic} from "./pk-from-mnemonic.cjs"
import { ecsign } from "ethereumjs-util"
// import  { MINICHEF_ADDRESS } from "@zarclays/zswap-core-sdk";
let MINICHEF_ADDRESS: any;
import("@zarclays/zswap-core-sdk").then((zswapCore)=>{
  //@ts-ignore
  MINICHEF_ADDRESS = zswapCore.MINICHEF_ADDRESS;
  console.log('MINICHEF_ADDRESS:', MINICHEF_ADDRESS);
  
});

// import { ethers } from "ethers";
// import tsort from "tsort";

import fs from "fs";
import { SignerWithAddress as SignerWithAddressNomicLabs } from "@nomiclabs/hardhat-ethers/signers.js";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers.js";

import {MaxUint256, ethers } from "ethers";
import { getApprovalDigest } from "./utilities.cjs";
// const fs = require("fs");
// const MaxUint256 = ethers.constants.MaxUint256;


// function getSortedFiles(dependenciesGraph: any) {
//   const tsort = require("tsort");
//   const graph = tsort();

//   const filesMap: any = {};
//   const resolvedFiles = dependenciesGraph.getResolvedFiles();
//   resolvedFiles.forEach((f) => (filesMap[f.sourceName] = f));

//   for (const [from, deps] of dependenciesGraph.entries()) {
//     for (const to of deps) {
//       graph.add(to.sourceName, from.sourceName);
//     }
//   }

//   const topologicalSortedNames = graph.sort();

//   // If an entry has no dependency it won't be included in the graph, so we
//   // add them and then dedup the array
//   const withEntries = topologicalSortedNames.concat(
//     resolvedFiles.map((f) => f.sourceName)
//   );

//   const sortedNames = [...new Set(withEntries)];
//   return sortedNames.map((n: any) => filesMap[n]);
// }

// function getFileWithoutImports(resolvedFile) {
//   const IMPORT_SOLIDITY_REGEX = /^\s*import(\s+)[\s\S]*?;\s*$/gm;

//   return resolvedFile.content.rawContent
//     .replace(IMPORT_SOLIDITY_REGEX, "")
//     .trim();
// }

// subtask(
//   "flat:get-flattened-sources",
//   "Returns all contracts and their dependencies flattened"
// )
//   .addOptionalParam("files", undefined, undefined, types.any)
//   .addOptionalParam("output", undefined, undefined, types.string)
//   .setAction(async ({ files, output }, { run }) => {
//     const dependencyGraph = await run("flat:get-dependency-graph", { files });
//     console.log(dependencyGraph);

//     let flattened = "";

//     if (dependencyGraph.getResolvedFiles().length === 0) {
//       return flattened;
//     }

//     const sortedFiles = getSortedFiles(dependencyGraph);

//     let isFirst = true;
//     for (const file of sortedFiles) {
//       if (!isFirst) {
//         flattened += "\n";
//       }
//       flattened += `// File ${file.getVersionedName()}\n`;
//       flattened += `${getFileWithoutImports(file)}\n`;

//       isFirst = false;
//     }

//     // Remove every line started with "// SPDX-License-Identifier:"
//     flattened = flattened.replace(
//       /SPDX-License-Identifier:/gm,
//       "License-Identifier:"
//     );

//     flattened = `// SPDX-License-Identifier: MIXED\n\n${flattened}`;

//     // Remove every line started with "pragma experimental ABIEncoderV2;" except the first one
//     flattened = flattened.replace(
//       /pragma experimental ABIEncoderV2;\n/gm,
//       (
//         (i) => (m) =>
//           !i++ ? m : ""
//       )(0)
//     );

//     flattened = flattened.trim();
//     if (output) {
//       console.log("Writing to", output);
//       fs.writeFileSync(output, flattened);
//       return "";
//     }
//     return flattened;
//   });

// subtask("flat:get-dependency-graph")
//   .addOptionalParam("files", undefined, undefined, types.any)
//   .setAction(async ({ files }, { run }) => {
//     const sourcePaths =
//       files === undefined
//         ? await run("compile:solidity:get-source-paths")
//         : files.map((f) => fs.realpathSync(f));

//     const sourceNames = await run("compile:solidity:get-source-names", {
//       sourcePaths,
//     });

//     const dependencyGraph = await run("compile:solidity:get-dependency-graph", {
//       sourceNames,
//     });

//     return dependencyGraph;
//   });

// task("flat", "Flattens and prints contracts and their dependencies")
//   .addOptionalVariadicPositionalParam(
//     "files",
//     "The files to flatten",
//     undefined,
//     types.inputFile
//   )
//   .addOptionalParam(
//     "output",
//     "Specify the output file",
//     undefined,
//     types.string
//   )
//   .setAction(async ({ files, output }, { run }) => {
//     console.log(
//       await run("flat:get-flattened-sources", {
//         files,
//         output,
//       })
//     );
//   });


task("accounts", "Prints the list of accounts", accounts);
task("gas-price", "Prints gas price").setAction(async function (
  { address },
  { ethers }
) {
  //@ts-ignore
  console.log("Gas price", (await ethers.provider.getGasPrice()).toString());
});

task("bytecode", "Prints bytecode").setAction(async function (
  { address },
  { ethers }
) {
  console.log("Bytecode", await ethers.provider.getCode(address));
});

task("feeder:feed", "Feed").setAction(async function (
  { feedDev },
  { getNamedAccounts, ethers, getChainId }
) {
  const { deployer, dev } = await getNamedAccounts();

  const feeder = new ethers.Wallet(
    process.env.FEEDER_PRIVATE_KEY!,
    ethers.getDefaultProvider()
  );
  
  await (
    await feeder.sendTransaction({
      to: deployer,
      value: BigInt(1) * ( BigInt(10)**BigInt(18)),
    })
  ).wait();
});

// async function getNamedSigners(ethers: any, getNamedAccounts: () => Promise<{
//   [name: string]: string;
// }>){
//   // First, retrieve the named accounts using the hardhat-deploy plugin
//   const namedAccounts = await getNamedAccounts();
//   const keys = Object.keys(namedAccounts)

//   const signers: {
//     [name: string]: SignerWithAddress;
//   }  = {}
//   for(let i=0;i<keys.length; i++){
//     signers[ keys[i] ]=(await ethers.getSigner(namedAccounts[keys[i]]))
//   }
//   // keys.map(k=> await ethers.getSigner(namedAccounts.deployer))
//   // // Now, use ethers to get the signer for the 'deployer' named account
//   // // namedAccounts.deployer returns the address for the deployer named account
//   // const deployer = await ethers.getSigner(namedAccounts.deployer);
//   return signers
// }

// async function getNamedSigner(ethers: any, getNamedAccounts: () => Promise<{
//   [name: string]: string;
// }>, name: string){
//   // First, retrieve the named accounts using the hardhat-deploy plugin
//   const namedAccounts = await getNamedAccounts();
  
//   // keys.map(k=> await ethers.getSigner(namedAccounts.deployer))
//   // // Now, use ethers to get the signer for the 'deployer' named account
//   // // namedAccounts.deployer returns the address for the deployer named account
//   // const deployer = await ethers.getSigner(namedAccounts.deployer);
//   return await ethers.getSigner(namedAccounts[name])
// }

task("feeder:return", "Return funds to feeder").setAction(async function (
  { address },
  { ethers, getNamedAccounts }
) {
  // const c: SignerWithAddress = await ethers.getSigner("")
  // c.provider
  
  const { deployer, dev } = await ethers.getNamedSigners();
  
  await (
    await deployer.sendTransaction({
      to: process.env.FEEDER_PUBLIC_KEY,
      value: await ethers.provider.getBalance(deployer.address),
    })
  ).wait();

  await (
    await dev.sendTransaction({
      to: process.env.FEEDER_PUBLIC_KEY,
      value: await  ethers.provider.getBalance(dev.address) ,
    })
  ).wait();
});

task("erc20:approve", "ERC20 approve")
  .addParam("token", "Token")
  .addParam("spender", "Spender")
  .addOptionalParam("deadline","Deadline", MaxUint256, types.bigint)
  .setAction(async function (
    { token, spender, deadline },
    { ethers: {  getContractFactory, getNamedSigner }  },
    runSuper
  ) {
    
    
    const erc20 = await getContractFactory("UniswapV2ERC20");

    const slp = erc20.attach(token);

    await (
      //@ts-ignore
      await slp.connect(await getNamedSigner("dev")).approve(spender, deadline)
    ).wait();
  });

task("factory:set-fee-to", "Factory set fee to")
  .addParam("feeTo", "Fee To")
  .setAction(async function (
    { feeTo },
    { ethers, artifacts },
    runSuper
  ) {
    
    const factory = await ethers.getContract("UniswapV2Factory");
    console.log(`Setting factory feeTo to ${feeTo} address`);
    await (
      // await factory.connect(await getNamedSigner("dev")).setFeeTo(feeTo)
      //@ts-ignore
      await factory.connect(await getNamedSigner("dev")).setFeeTo(feeTo)
    ).wait();
  });

task("factory:set-fee-to-setter", "Factory set fee to setter")
  .addParam("feeToSetter", "Fee To Setter")
  .setAction(async function (
    { feeToSetter },
    { ethers },
    runSuper
  ) {
    const factory = await ethers.getContract("UniswapV2Factory");
    console.log(`Setting factory fee to setter to ${feeToSetter} address`);
    await (
      await factory
        .connect(await ethers.getNamedSigner("dev"))
        //@ts-ignore
        .setFeeToSetter(feeToSetter)
    ).wait();
  });

// TODO: Swap?

// TODO: Test
task("router:add-liquidity", "Router add liquidity")
  .addParam("tokenA", "Token A")
  .addParam("tokenB", "Token B")
  .addParam("tokenADesired", "Token A Desired")
  .addParam("tokenBDesired", "Token B Desired")
  .addParam("tokenAMinimum", "Token A Minimum")
  .addParam("tokenBMinimum", "Token B Minimum")
  .addParam("to", "To")
  .addOptionalParam("deadline","deadline", MaxUint256 , types.bigint)
  .setAction(async function (
    {
      tokenA,
      tokenB,
      tokenADesired,
      tokenBDesired,
      tokenAMinimum,
      tokenBMinimum,
      to,
      deadline,
    },
    { ethers: {getContract, getNamedSigner }, run },
    runSuper
  ) {
    const router = await getContract("UniswapV2Router");
    await run("erc20:approve", { token: tokenA, spender: router.getAddress() });
    await run("erc20:approve", { token: tokenB, spender: router.getAddress()});
    await (
      await router
        .connect(await getNamedSigner("dev"))
        //@ts-ignore
        .addLiquidity(
          tokenA,
          tokenB,
          tokenADesired,
          tokenBDesired,
          tokenAMinimum,
          tokenBMinimum,
          to,
          deadline
        )
    ).wait();
  });

// TODO: Test
task("router:add-liquidity-eth", "Router add liquidity eth")
  .addParam("token", "Token")
  .addParam("tokenDesired", "Token Desired")
  .addParam("tokenMinimum", "Token Minimum")
  .addParam("ethMinimum", "ETH Minimum")
  .addParam("to", "To")
  .addOptionalParam("deadline","deadline",  MaxUint256, types.bigint)
  .setAction(async function (
    { token, tokenDesired, tokenMinimum, ethMinimum, to, deadline },
    { ethers: { getNamedSigner, getContract }, run },
    runSuper
  ) {
    const router = await getContract("UniswapV2Router");
    await run("erc20:approve", { token, spender: router.getAddress() });
    await (
      await router
        .connect(await getNamedSigner("dev"))
        //@ts-ignore
        .addLiquidityETH(
          token,
          tokenDesired,
          tokenMinimum,
          ethMinimum,
          to,
          deadline
        )
    ).wait();
  });

task("migrate", "Migrates liquidity from Uniswap to SushiSwap")
  .addOptionalParam(
    "a",
    "Token A",
    "0xaD6D458402F60fD3Bd25163575031ACDce07538D"
  )
  .addOptionalParam(
    "b",
    "Token B",
    "0xc778417E063141139Fce010982780140Aa0cD5Ab"
  )
  .setAction(async function (
    { tokenA, tokenB },
    { 
      getChainId, 
      ethers: {
        hexlify,
        getNamedSigner,
        MaxUint256,
        Wallet,
        getContract,
        getContractFactory,
      },
      config,
      network
    },
    runSuper
  ) {
    
    console.log("Migrate", config.networks[network.name].accounts)
  
     
    config.networks[network.name].accounts
    //@ts-ignore
    // Dev private key
    const privateKey = Wallet.fromPhrase(config.networks[network.name].accounts.mnemonic, "m/44'/60'/0'/0/1").privateKey
  
    const erc20Contract = await getContractFactory("UniswapV2ERC20")
  
    const token = erc20Contract.attach("0x1c5DEe94a34D795f9EEeF830B68B80e44868d316")
  
    const deadline = MaxUint256
  
    const dev = await getNamedSigner("dev")
  
    //@ts-ignore
    const nonce = await token.connect(dev).nonces(dev.address)
  
    const sushiRoll = await getContract("SushiRoll")
  
    const chainId = await getChainId()
  
    const digest = await getApprovalDigest(
      token,
      chainId,
      {
        owner: dev.address,
        spender: sushiRoll.getAddress(),
        value: await token.balanceOf(dev.address),
      },
      nonce,
      deadline
    )
  
    const { v, r, s } = ecsign(
      Buffer.from(digest.slice(2), "hex"),
      Buffer.from(privateKey.slice(2), "hex")
    )
  
    console.log({ v, r: hexlify(r), s: hexlify(s) })
  
    const migrateTx = await sushiRoll
      .connect(dev)
      //@ts-ignore
      .migrateWithPermit(
        tokenA,
        tokenB,
        await token.balanceOf(dev.address),
        0,
        0,
        deadline,
        v,
        hexlify(r),
        hexlify(s),
        {
          gasLimit: 8000000,
          gasPrice: 100000000000,
        }
      )
  
    await migrateTx.wait()
  
    console.log(migrateTx)
  });

task("masterchef:add", "Add pool to masterchef").setAction(async function (
  taskArguments,
  { ethers: { getNamedSigner, getContract } },
  runSuper
) {
  const masterChef = await getContract("MasterChef");

  await (
    await masterChef
      .connect(await getNamedSigner("dev"))
      //@ts-ignore
      .add(1000, "0x3e78a806b127c02b54419191571d9379819e989c", true)
  ).wait();
});

task("masterchef:deposit", "MasterChef deposit")
  .addParam("pid", "Pool ID")
  .addParam("amount", "Amount")
  .setAction(async function (
    { pid, amount },
    { ethers: { getNamedSigner, getContract }, run },
    runSuper
  ) {
    const masterChef = await getContract("MasterChef");
    //@ts-ignore
    const { lpToken } = await masterChef.poolInfo(pid);

    await run("erc20:approve", { token: lpToken, spender: masterChef.getAddress() });

    await (
      //@ts-ignore
      await masterChef.connect(await getNamedSigner("dev")).deposit(pid, amount)
    ).wait();
  });

task("masterchef:withdraw", "MasterChef withdraw")
  .addParam("pid", "Pool ID")
  .addParam("amount", "Amount")
  .setAction(async function (
    { pid, amount },
    { ethers: { getNamedSigner, getContract }, run },
    runSuper
  ) {
    const masterChef = await getContract("MasterChef");
    //@ts-ignore
    const { lpToken } = await masterChef.poolInfo(pid);

    await run("erc20:approve", { token: lpToken, spender: masterChef.getAddress() });

    await (
      await masterChef
        .connect(await getNamedSigner("dev"))
        //@ts-ignore
        .withdraw(pid, amount)
    ).wait();
  });

task("bar:enter", "SushiBar enter")
  .addParam("amount", "Amount")
  .setAction(async function (
    { amount },
    { ethers: { getNamedSigner,getContract  }, run },
    runSuper
  ) {
    const sushi = await getContract("ZSwapToken");

    const bar = await getContract("SushiBar");

    await run("erc20:approve", { token: sushi.getAddress(), spender: bar.getAddress() });

    //@ts-ignore
    await (await bar.connect(await getNamedSigner("dev")).enter(amount)).wait();
  });

task("bar:leave", "SushiBar leave")
  .addParam("amount", "Amount")
  .setAction(async function (
    { amount },
    { ethers: { getNamedSigner, getContract }, run },
    runSuper
  ) {
    const sushi = await getContract("ZSwapToken");

    const bar = await getContract("SushiBar");

    await run("erc20:approve", { token: sushi.getAddress(), spender: bar.getAddress() });

    //@ts-ignore
    await (await bar.connect(await getNamedSigner("dev")).leave(amount)).wait();
  });

task("maker:serve", "SushiBar serve")
  .addParam("a", "Token A")
  .addParam("b", "Token B")
  .setAction(async function (
    { a, b },
    { ethers: { getNamedSigner, getContract } },
    runSuper
  ) {
    const maker = await getContract("SushiMaker");

    await (
      await maker
        .connect(await getNamedSigner("dev"))
        //@ts-ignore
        .convert(a, b, { gasLimit: 5198000 })
    ).wait();
  });

task("deploy:complex-rewarder", "Deploy ComplexRewarder")
  .addParam("rewardToken", "Reward Token")
  .setAction(async function (
    { rewardToken },
    { ethers: { getNamedSigner, getContract }, getChainId, deployments, getNamedAccounts },
    runSuper
  ) {
    const { deployer, dev } = await  getNamedAccounts();
    const { deploy } = deployments;

    const chainId = await getChainId();

    let miniChefAddress;

    if (chainId === "31337") {
      miniChefAddress = (await deployments.get("MiniChefV2")).address;
    } else if (chainId in MINICHEF_ADDRESS) {
      miniChefAddress = MINICHEF_ADDRESS[+chainId];
    } else {
      throw Error("No MINICHEF!");
    }

    const { address } = await deploy("ComplexRewarderTime", {
      from: deployer,
      args: [rewardToken, 0, miniChefAddress],
      log: true,
      deterministicDeployment: false,
    });

    console.log(`ComplexRewarderTime deployed at ${address}`);

    const complexRewarder = await getContract("ComplexRewarderTime");

    //@ts-ignore
    if ((await complexRewarder.owner()) !== dev) {
      console.log("Transfer ownership of ComplexRewarderTime to dev");
      //@ts-ignore
      await (await complexRewarder.transferOwnership(dev, true, false)).wait();
    }
  });


  task("generate-mnemonic", "Generates a new Mnemonic")
  // .addOptionalParam(
  //   "a",
  //   "Token A",
  //   "0xaD6D458402F60fD3Bd25163575031ACDce07538D"
  // )
  // .addOptionalParam(
  //   "b",
  //   "Token B",
  //   "0xc778417E063141139Fce010982780140Aa0cD5Ab"
  // )
  .setAction(generateMnemonic);

  
  // export default gm;

  task("pk-from-mnemonic", "Outputs Private Key from Mnemonic given")
    .addParam('mnemonic', 'Mnemonic')
    .setAction(pkFromMnemonic);

// task("deploy:clone-rewarder", "Deploy CloneRewarder")
// .addParam("rewardToken", "Reward Token")
// .addParam("lpToken", "LP Token")
// .addOptionalParam("rewardRate", "Reward Rate", 0)
// .setAction(async function ({ rewardToken, lpToken, rewardRate }, { getChainId, deployments }, runSuper) {
//   const { deployer, dev } = await getNamedAccounts();
//   const { deploy } = deployments;

//   const chainId = await getChainId();

//   let miniChefAddress;

//   if (chainId === "31337") {
//     miniChefAddress = (await deployments.get("MiniChefV2")).address;
//   } else if (chainId in MINICHEF_ADDRESS) {
//     miniChefAddress = MINICHEF_ADDRESS[chainId];
//   } else {
//     throw Error("No MINICHEF!");
//   }

//   const { address } = await deploy("CloneRewarderTime", {
//     from: deployer,
//     args: [miniChefAddress],
//     log: true,
//     deterministicDeployment: false,
//   });

//   console.log(`CloneRewarder deployed at ${address}`)

//   const cloneRewarder = await ethers.getContract("CloneRewarderTime");

//   const data = defaultAbiCoder.encode(['address', 'address', 'uint256', 'address'], [rewardToken, dev, rewardRate, lpToken])

//   await (await cloneRewarder.init(data)).wait()

//   if ((await complexRewarder.owner()) !== dev) {
//     console.log("Transfer ownership of CloneRewarderTime to dev");
//     await (await cloneRewarder.transferOwnership(dev, true, false)).wait();
//   }
// });
