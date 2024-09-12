import { ADDRESS_ZERO, advanceBlock, advanceBlockTo, advanceTime, advanceTimeAndBlock, deploy, getBigInt, prepare } from "./utilities/index.cts"
import { assert, expect } from "chai"

import { ethers } from "hardhat"
import {MaxUint256, formatEther, parseEther} from "ethers";
// const { time } = require("@openzeppelin/test-helpers");

describe("Multicall3", function () {
  let receiverContract;
  let erc20Token;
  let nftToken;
  let owner;
  let user1;
  let user2;
  let multicallContractAddress='0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690';
  let MulticallFactory;
  let multicall;

  before(async function () {
    this.signers = await ethers.getSigners()
    owner = this.signers[0]
    user1 = this.signers[1]
    user2= this.signers[2]

    MulticallFactory = await ethers.getContractFactory("Multicall3")
    multicall =  await ethers.getContractAt("Multicall3", multicallContractAddress)
    


  })

  

  

  it("should get Block Number", async function () {
    // Send ETH to the ReceiverContract contract
    console.log('BlockNumber,', await multicall.getBlockNumber())
    
  });

  
  

  

});
