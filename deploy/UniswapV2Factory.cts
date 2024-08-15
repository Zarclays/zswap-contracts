// Defining bytecode and abi from original contract on mainnet to ensure bytecode matches and it produces the same pair code hash
// const {
//   bytecode,
//   abi,
// } = require("../deployments/mainnet/UniswapV2Factory.json");
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  bytecode,
  abi,
} from "../deployments/mainnet/UniswapV2Factory.json"

import fs from 'fs';

const func = async function ({
  ethers,
  getNamedAccounts,
  deployments,
  getChainId,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;

  
  

  const { deployer, dev } = await getNamedAccounts();

  const chainId = await getChainId();

  const feeToSetter='0x5663b6cdbb0dd72ba348671af5bdb81baaa633df'

  await deploy("UniswapV2Factory", {
    contract: {
      abi,
      bytecode,
    },
    from: deployer,
    args: [deployer],
    log: true,
    deterministicDeployment: false, //"0x034deAdFac",
  });

  console.log(deployer, dev, ethers)

  const factory = await ethers.getContract("UniswapV2Factory");
  const initCodeHash = await factory.pairCodeHash();
  console.log('Init code has is:', initCodeHash);

  fs.appendFile('Init_code_hashes.txt', `Init Code hash for chain ${chainId} -> ${initCodeHash} \n`, 'utf8',(err)=>{
    if(err){
      console.error('Error savng Init code hash')
    }
  })


  // await factory.connect("dev").setFeeTo(feeTo)
  try{
    await factory.connect(await ethers.getNamedSigner("dev")).setFeeTo(feeToSetter)
  }catch{
    
  }
  //// await (
  //   await factory
  //     .connect(await getNamedSigner("dev"))
  //     .setFeeToSetter('feeToSetter')
  // ).wait();
};

func.tags = ["UniswapV2Factory", "AMM"];
export default func;
