import { ADDRESS_ZERO, advanceBlock, advanceBlockTo, advanceTime, advanceTimeAndBlock, deploy, getBigInt, prepare } from "./utilities/index.cts"
import { assert, expect } from "chai"

import { ethers } from "hardhat"
import {MaxUint256, formatEther, parseEther} from "ethers";
// const { time } = require("@openzeppelin/test-helpers");

describe("zSwapFeeReceiver", function () {
  let receiverContract;
  let erc20Token;
  let nftToken;
  let owner;
  let user1;
  let user2;
  let receiverContractAddress;

  before(async function () {
    this.signers = await ethers.getSigners()
    owner = this.signers[0]
    user1 = this.signers[1]
    user2= this.signers[2]

    this.TestToken = await ethers.getContractFactory("TestToken")
    this.ZSwapToken = await ethers.getContractFactory("ZSwapToken")
    this.zSwapFeeReceiverContract = await ethers.getContractFactory("zSwapFeeReceiver")

    receiverContract = await this.zSwapFeeReceiverContract.deploy();

    // Deploy the ERC20 token contract
    
    erc20Token = await this.TestToken.deploy(owner.address);

    receiverContractAddress = await receiverContract.getAddress()

    // // Deploy the NFT token contract
    // const NFTToken = await ethers.getContractFactory("NFTToken");
    // nftToken = await NFTToken.deploy("My NFT", "MNFT");

    


  })

  

  

  it("should receive ETH", async function () {
    // Send ETH to the ReceiverContract contract
    console.log('receiverContractAddress,', receiverContractAddress)
    await user1.sendTransaction({
      to: receiverContractAddress,
      value: parseEther("1"),
    });

    // Check the contract's ETH balance
    expect(await ethers.provider.getBalance(receiverContractAddress)).to.equal(
      parseEther("1")
    );
  });

  it("should receive ERC20 tokens", async function () {
    // Mint some ERC20 tokens to user1
    await erc20Token.mint(user1.address, parseEther('100') );

    // Approve the ReceiverContract contract to spend ERC20 tokens on behalf of user1
    // await erc20Token.connect(user1).approve(receiverContractAddress, parseEther('100'));

    await erc20Token.connect(user1).transfer(receiverContractAddress, parseEther('50'))

    // // Transfer ERC20 tokens to the ReceiverContract contract
    // await receiverContract.connect(user1).receiveERC20(erc20Token.address, parseEther('50'));

    // Check the contract's ERC20 token balance
    expect(await erc20Token.balanceOf(receiverContractAddress)).to.equal(parseEther('50'));
  });

  // it("should receive NFTs", async function () {
  //   // Mint an NFT to user1
  //   await nftToken.mint(user1.address, 1);

  //   // Approve the ReceiverContract contract to spend NFTs on behalf of user1
  //   await nftToken.connect(user1).approve(receiverContractAddress, 1);

  //   // Transfer the NFT to the ReceiverContract contract
  //   await receiverContract.connect(user1).onERC721Received(
  //     user1.address,
  //     nftToken.address,
  //     1,
  //     "0x"
  //   );

  //   // Check the contract's NFT balance
  //   expect(await nftToken.ownerOf(1)).to.equal(receiverContractAddress);
  // });

  it("should allow owner to withdraw ETH", async function () {
    // Send ETH to the ReceiverContract contract
    await user1.sendTransaction({
      to: receiverContractAddress,
      value: parseEther("1"),
    });

    const previousBalance = await ethers.provider.getBalance(user2.address)
    // Withdraw ETH as the owner
    await receiverContract.connect(owner).withdraw(parseEther("1"), user2.address);

    // Check the owner's ETH balance
    expect(await ethers.provider.getBalance(user2.address)).to.equal(
      previousBalance + parseEther("1")
    );
  });


  it("should allow owner to withdraw ERC20 tokens", async function () {
    // Mint some ERC20 tokens to user1
    await erc20Token.mint(user1.address, 100);
  
    // Transfer ERC20 tokens to the ReceiverContract contract
    await erc20Token.connect(user1).transfer(receiverContractAddress, 50);
  
    const previousBalance = await erc20Token.balanceOf(user2.address)
    // Withdraw ERC20 tokens as the owner
    await receiverContract.connect(owner).withdrawERC20(await erc20Token.getAddress(), 50, user2.address);
  
    // Check the owner's ERC20 token balance
    expect(await erc20Token.balanceOf(user2.address)).to.equal( previousBalance + BigInt(50));
  });

  

  it("should not allow non-owners to withdraw ETH", async function () {
    // Send ETH to the ReceiverContract contract
    await user1.sendTransaction({
      to: receiverContractAddress,
      value: parseEther("1"),
    });
  
    // Try to withdraw ETH as a non-owner
    await expect(
      receiverContract.connect(user1).withdraw(parseEther("1"), user2.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
  
  it("should not allow non-owners to withdraw ERC20 tokens", async function () {
    // Mint some ERC20 tokens to user1
    await erc20Token.mint(user1.address, 100);
  
    // Transfer ERC20 tokens to the ReceiverContract contract
    await erc20Token.connect(user1).transfer(receiverContractAddress, 50);
  
    // Try to withdraw ERC20 tokens as a non-owner
    await expect(
      receiverContract.connect(user1).withdrawERC20(await erc20Token.getAddress(), 50, user2.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
  

  

});
