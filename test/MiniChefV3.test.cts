import { ADDRESS_ZERO, advanceBlock, advanceBlockTo, advanceTime, advanceTimeAndBlock, deploy, getBigInt, prepare } from "./utilities/index.cts"
import { assert, expect } from "chai"

import { ethers } from "hardhat"
import {MaxUint256, formatEther, parseEther} from "ethers";
// const { time } = require("@openzeppelin/test-helpers");

describe("MiniChefV3", function () {
  let MiniChef, RewardToken, LPToken;
  let miniChef, rewardToken, lpToken;
  let owner, user1, user2;

  // daily distribution rate: 20 million / (2 years * 365 days) ≈ 27,397 tokens per day per chain.
  const rewardPerSecond = 27397/(24*60*60)
  console.log('rewardPerSecond: ', rewardPerSecond)
  const REWARD_PER_SECOND = parseEther(rewardPerSecond.toString());
  const INITIAL_REWARD_BALANCE = parseEther("1000000");
  const INITIAL_LP_BALANCE = parseEther("1000");

  before(async function () {
    this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.bob = this.signers[1]
    this.carol = this.signers[2]
    this.dev = this.signers[3]
    this.minter = this.signers[4]

    this.MasterChef = await ethers.getContractFactory("MasterChef")
    this.ZSwapToken = await ethers.getContractFactory("ZSwapToken")
    this.ERC20Mock = await ethers.getContractFactory("ERC20Mock", this.minter)
  })

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    this.zswapToken = await this.ZSwapToken.deploy(this.signers[0].address)
    
    // Deploy RewardToken
    RewardToken = await ethers.getContractFactory("ERC20Mock");
    // RewardToken = await ethers.getContractFactory("ZSwapToken")
    // rewardToken = await RewardToken.deploy(this.signers[0].address)
    rewardToken = await RewardToken.deploy("zSwap Token", "ZSWAP", getBigInt(1000000));
    

    // Deploy LPToken
    LPToken = await ethers.getContractFactory("ERC20Mock");
    lpToken = await LPToken.deploy("LP Token", "LPT", getBigInt(10));
    
    // Deploy MiniChef
    MiniChef = await ethers.getContractFactory("MiniChefV3");
    miniChef = await MiniChef.deploy(await rewardToken.getAddress(), REWARD_PER_SECOND, this.signers[0].address);
    
    
    // Mint initial balances
    await rewardToken.mint(miniChef.getAddress(), INITIAL_REWARD_BALANCE);
    await lpToken.mint(user1.address, INITIAL_LP_BALANCE);
    await lpToken.mint(user2.address, INITIAL_LP_BALANCE);

    // Approve MiniChef to spend LP tokens
    await lpToken.connect(user1).approve(miniChef.getAddress(), MaxUint256);
    await lpToken.connect(user2).approve(miniChef.getAddress(), MaxUint256);
  });

  describe("Deployment", function () {
    it("Should set the correct reward token", async function () {
      expect(await miniChef.REWARD()).to.equal(await rewardToken.getAddress());
    });

    it("Should set the correct reward per second", async function () {
      expect(await miniChef.rewardPerSecond()).to.equal(REWARD_PER_SECOND);
    });
  });

  describe("Pool management", function () {
    it("Should add a new pool", async function () {
      await miniChef.add(100, lpToken.getAddress(), false);
      expect(await miniChef.poolLength()).to.equal(1);
    });

    it("Should update pool allocations", async function () {
      await miniChef.add(100, lpToken.getAddress(), false);
      await miniChef.set(0, 200, false);
      const pool = await miniChef.poolInfo(0);
      expect(pool.allocPoint).to.equal(200);
    });
  });

  describe("User interactions", function () {
    beforeEach(async function () {
      await miniChef.add(100, lpToken.getAddress(), false);
    });

    it("Should allow users to deposit LP tokens", async function () {
      const depositAmount = parseEther("100");
      await miniChef.connect(user1).deposit(0, depositAmount, user1.address);
      const userInfo = await miniChef.userInfo(0, user1.address);
      expect(userInfo.amount).to.equal(depositAmount);
    });

    it("Should allow users to withdraw LP tokens", async function () {
      const depositAmount = parseEther("100");
      await miniChef.connect(user1).deposit(0, depositAmount, user1.address);
      await miniChef.connect(user1).withdraw(0, depositAmount, user1.address);
      const userInfo = await miniChef.userInfo(0, user1.address);
      expect(userInfo.amount).to.equal(0);
    });

    it("Should distribute rewards correctly", async function () {
      const depositAmount = parseEther("100");
      await miniChef.connect(user1).deposit(0, depositAmount, user1.address);
      
      // Advance time by 100 seconds
      await ethers.provider.send("evm_increaseTime", [100]);
      await ethers.provider.send("evm_mine");

      const pendingReward = await miniChef.pendingReward(0, user1.address);
      expect(pendingReward).to.be.closeTo(
        REWARD_PER_SECOND * BigInt(100),
        parseEther("0.01") // Allow for small rounding errors
      );
    });

    it("Should allow users to harvest rewards", async function () {
      const depositAmount = parseEther("100");
      await miniChef.connect(user1).deposit(0, depositAmount, user1.address);
      
      // Advance time by 100 seconds
      //   await ethers.provider.send("evm_increaseTime", [100]);
      //   await ethers.provider.send("evm_mine");

      

      const initialBalance = await rewardToken.balanceOf(user1.address);

      await advanceTime(100)
      await miniChef.connect(user1).harvest(0, user1.address);
      const finalBalance = await rewardToken.balanceOf(user1.address);

      console.log(`Initil ${formatEther(initialBalance)} , final: ${ formatEther(finalBalance) },  TotRew: ${formatEther(REWARD_PER_SECOND* BigInt(100))}`)
      
      expect(finalBalance - initialBalance ).to.be.closeTo(
        REWARD_PER_SECOND* BigInt(100),
        parseEther("0.1") // Allow for small rounding errors
      );
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership correctly", async function () {
      await miniChef.transferOwnership(user1.address, true, false);
      expect(await miniChef.owner()).to.equal(user1.address);
    });

    it("Should use two-step ownership transfer correctly", async function () {
      await miniChef.transferOwnership(user1.address, false, false);
      expect(await miniChef.owner()).to.equal(owner.address);
      expect(await miniChef.pendingOwner()).to.equal(user1.address);
      
      await expect(miniChef.connect(user2).acceptOwnership()).to.be.revertedWith("Ownable: caller != pending owner");
      
      await miniChef.connect(user1).acceptOwnership();
      expect(await miniChef.owner()).to.equal(user1.address);
      expect(await miniChef.pendingOwner()).to.equal(ADDRESS_ZERO);
    });
  });

  describe("Set", function () {
    it("Should revert if invalid pool", async function () {
    //   await expect(miniChef.set(0, 200, false)).to.be.revertedWith("Pool does not exist");
      let err
      try {
        await miniChef.set(0, 200, false)
      } catch (e) {
        err = e
      }
      
      assert.equal(err.toString(), "Error: VM Exception while processing transaction: reverted with panic code 0x32 (Array accessed at an out-of-bounds or negative index)")
    });

    it("Should emit event LogSetPool", async function () {
      await miniChef.add(100, await lpToken.getAddress(), false);
      await expect(miniChef.set(0, 200, false))
        .to.emit(miniChef, "LogSetPool")
        .withArgs(0, 200);
    });
  });

  describe("PendingReward", function () {
    it("Should equal ExpectedReward when time is lastRewardTime", async function () {
      await miniChef.add(100, await lpToken.getAddress(), false);
      const amountDeposited=1
      let log = await miniChef.connect(user1).deposit(0, parseEther(amountDeposited.toString()), await user1.getAddress());
      
      await advanceTime(86400);
     
      let logUpdatePool = await miniChef.updatePool(0)

      let timestampUpdatePool = (await ethers.provider.getBlock(logUpdatePool.blockNumber)).timestamp
      let timestamp = (await ethers.provider.getBlock(log.blockNumber)).timestamp
     
      let expectedReward =   REWARD_PER_SECOND *  BigInt(timestampUpdatePool - timestamp)
    //   const expectedReward = parseEther("0");
      const pendingReward = await miniChef.pendingReward(0, await user1.getAddress());
//       console.log(`REWARD_PER_SECOND ${formatEther(REWARD_PER_SECOND)},peding reward: ${formatEther(pendingReward)}, expected reward: ${formatEther(expectedReward)}`)
      expect(pendingReward).to.be.closeTo(expectedReward, parseEther("0.00001"));
    });
  });

  describe("MassUpdatePools", function () {
    it("Should call updatePool", async function () {
        await miniChef.add(10, await lpToken.getAddress(), false)
        await advanceBlockTo(1)
        await miniChef.massUpdatePools()
        //expect('updatePool').to.be.calledOnContract(); //not suported by hardhat
        //expect('updatePool').to.be.calledOnContractWith(0); //not suported by hardhat
    })
    it("Updating invalid pools should fail", async function () {
        let err
        try {
            await miniChef.massUpdateSelectedPools([0])
        } catch (e) {
            err = e
        }
    
        assert.equal(err.toString(), "Error: VM Exception while processing transaction: reverted with panic code 0x32 (Array accessed at an out-of-bounds or negative index)")
    
    //   await expect(miniChef.massUpdateSelectedPools([0])).to.be.revertedWith("panic code 0x32 (Array accessed at an out-of-bounds or negative index)");
    });
  });

  describe("Add", function () {
    it("Should add pool with reward token multiplier", async function () {
      await expect(miniChef.add(100, await lpToken.getAddress(), false))
        .to.emit(miniChef, "LogPoolAddition")
        .withArgs(0, 100, await lpToken.getAddress());
    });

    it("Should revert if pool with same reward token added twice", async function () {
        let err
        try {
            await miniChef.add(100, await lpToken.getAddress(), false);
            await miniChef.add(100, await lpToken.getAddress(), false);
        } catch (e) {
            err = e
        }
        
        assert.equal(err.toString(), "Error: VM Exception while processing transaction: reverted with custom error 'TokenAlreadyAdded()'")
    
      
        // await expect(miniChef.add(100, await lpToken.getAddress(), false)).to.be.revertedWith("TokenAlreadyAdded()");
    });
  });

  describe("UpdatePool", function () {
    it("Should emit event LogUpdatePool", async function () {
      await miniChef.add(100, await lpToken.getAddress(), false);
      await expect(miniChef.updatePool(0))
        .to.emit(miniChef, "LogUpdatePool")
        .withArgs(
            0, 
            (await miniChef.poolInfo(0)).lastRewardTime + 1n, 
            await lpToken.balanceOf(await miniChef.getAddress()), 
            (await miniChef.poolInfo(0)).accRewardPerShare
        );
    });

    it("Should take else path", async function () {
      await miniChef.add(100, await lpToken.getAddress(), false);
      
      await advanceBlockTo(1)
      await miniChef.batch(
        [miniChef.interface.encodeFunctionData("updatePool", [0]), miniChef.interface.encodeFunctionData("updatePool", [0])],
        true
      )

      // await expect(miniChef.updatePool(0)).to.emit(miniChef, "LogUpdatePool");
    });
  });

  describe("Deposit", function () {
    beforeEach(async function () {
      await miniChef.add(100, await lpToken.getAddress(), false);
    });

    it("Depositing 0 amount should succeed", async function () {
      await expect(miniChef.connect(user1).deposit(0, 0, await user1.getAddress()))
        .to.emit(miniChef, "Deposit")
        .withArgs(await user1.getAddress(), 0, 0, await user1.getAddress());
    });

    it("Depositing into non-existent pool should fail", async function () {
        let err
        try {
            await miniChef.connect(user1).deposit(1, parseEther("100"), await user1.getAddress())
        } catch (e) {
            err = e
        }
        
        assert.equal(err.toString(), "Error: VM Exception while processing transaction: reverted with panic code 0x32 (Array accessed at an out-of-bounds or negative index)")
    
      //await expect(miniChef.connect(user1).deposit(1, parseEther("100"), await user1.getAddress()))
      //  .to.be.revertedWith("Pool does not exist");
    });
  });

  describe("Withdraw", function () {
    beforeEach(async function () {
      await miniChef.add(100, await lpToken.getAddress(), false);
      await miniChef.connect(user1).deposit(0, parseEther("100"), await user1.getAddress());
    });

    it("Withdrawing 0 amount should succeed", async function () {
      await expect(miniChef.connect(user1).withdraw(0, 0, await user1.getAddress()))
        .to.emit(miniChef, "Withdraw")
        .withArgs(await user1.getAddress(), 0, 0, await user1.getAddress());
    });

    it("Withdrawing from non-existent pool should fail", async function () {
        let err
        try {
            await miniChef.connect(user1).withdraw(1, parseEther("100"), await user1.getAddress())
        } catch (e) {
            err = e
        }
        
        assert.equal(err.toString(), "Error: VM Exception while processing transaction: reverted with panic code 0x32 (Array accessed at an out-of-bounds or negative index)")
    
    //   await expect(miniChef.connect(user1).withdraw(1, parseEther("100"), await user1.getAddress()))
    //     .to.be.revertedWith("Pool does not exist");
    });
  });

  describe("Harvest", function () {
    beforeEach(async function () {
      
      
    //   await ethers.provider.send("evm_increaseTime", [100]);
    //   await ethers.provider.send("evm_mine", []);

      advanceTimeAndBlock(100)
    });

    it("Should give back the correct amount of Main Token and reward token", async function () {
      await miniChef.add(100, await lpToken.getAddress(), false);
      expect(await miniChef.lpToken(0)).to.be.equal(await lpToken.getAddress())
      let log = await miniChef.connect(user2).deposit(0, parseEther("1"), await user2.getAddress());      
      await advanceTime(86400)
      let log2 = await miniChef.connect(user2).withdraw(0, getBigInt(1), user2.address)

      let timestamp2 = (await ethers.provider.getBlock(log2.blockNumber)).timestamp
      let timestamp = (await ethers.provider.getBlock(log.blockNumber)).timestamp
      let expectedReward = REWARD_PER_SECOND * BigInt(timestamp2 - timestamp)
    //   console.log( 'REW:: ', formatEther((await miniChef.userInfo(0, user2.address)).rewardDebt))
    //   console.log( 'EXP REW:: ', formatEther(expectedReward))
      expect((await miniChef.userInfo(0, user2.address)).rewardDebt).to.be.closeTo(("-" + expectedReward), parseEther("0.00001"))
    // expect(pendingReward).to.be.closeTo(expectedReward, parseEther("0.00001"));
      await miniChef.connect(user2).harvest(0, user2.address)
      expect(await rewardToken.balanceOf(user2.address))
        .to.be.closeTo(expectedReward, parseEther("0.00001"))
    });

    it("Harvest with empty user balance", async function () {
        await miniChef.add(10, await lpToken.getAddress(), false)
        await miniChef.harvest(0, user2.address)
    })


    
    // // it("Harvest for zSwap-only pool", async function () {
    // //   await miniChef.add(100, await lpToken.getAddress(), false);
    // // //   await miniChef.connect(user1).deposit(1, 0, await user1.getAddress());
    // //   await miniChef.connect(user2).deposit(1, parseEther("100"), await user2.getAddress());
      
    // //   advanceTimeAndBlock(100)

    // //   const initialBalance = await rewardToken.balanceOf(await user1.getAddress());
    // //   await miniChef.connect(user1).harvest(1, await user1.getAddress());
    // //   const finalBalance = await rewardToken.balanceOf(await user1.getAddress());
      
    // //   expect(finalBalance - initialBalance).to.be.closeTo(
    // //     REWARD_PER_SECOND * 100n / 2n, // Divided by 2 because there are two pools now
    // //     parseEther("0.01") // Allow for small rounding errors
    // //   );
    // // });
    
  });

  describe("EmergencyWithdraw", function () {
    beforeEach(async function () {
      
    });

    it("Should emit event EmergencyWithdraw", async function () {
      await miniChef.add(100, await lpToken.getAddress(), false);
      await miniChef.connect(user1).deposit(0, parseEther("100"), await user1.getAddress());
      await expect(miniChef.connect(user1).emergencyWithdraw(0, await user1.getAddress()))
        .to.emit(miniChef, "EmergencyWithdraw")
        .withArgs(await user1.getAddress(), 0, parseEther("100"), await user1.getAddress());
    });
  });


});