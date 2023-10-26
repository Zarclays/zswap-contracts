// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// SushiBar is the coolest bar in town. You come in with some Sushi, and leave with more! The longer you stay, the more Sushi you get.
//
// This contract handles swapping to and from xZswap, SushiSwap's staking token.
contract SushiBar is ERC20("SushiBar", "xZswap"){
    // using SafeMath for uint256;
    IERC20 public sushi;

    // Define the Sushi token contract
    constructor(IERC20 _sushi) public {
        sushi = _sushi;
    }

    // Enter the bar. Pay some SUSHIs. Earn some shares.
    // Locks Sushi and mints xZswap
    function enter(uint256 _amount) public {
        // Gets the amount of Sushi locked in the contract
        uint256 totalSushi = sushi.balanceOf(address(this));
        // Gets the amount of xZswap in existence
        uint256 totalShares = totalSupply();
        // If no xZswap exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || totalSushi == 0) {
            _mint(msg.sender, _amount);
        } 
        // Calculate and mint the amount of xZswap the Sushi is worth. The ratio will change overtime, as xZswap is burned/minted and Sushi deposited + gained from fees / withdrawn.
        else {
            // uint256 what = _amount.mul(totalShares).div(totalSushi);
            uint256 what = (_amount*totalShares)/totalSushi;
            _mint(msg.sender, what);
        }
        // Lock the Sushi in the contract
        sushi.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your SUSHIs.
    // Unlocks the staked + gained Sushi and burns xZswap
    function leave(uint256 _share) public {
        // Gets the amount of xZswap in existence
        uint256 totalShares = totalSupply();
        // Calculates the amount of Sushi the xZswap is worth
        uint256 what = (_share*sushi.balanceOf(address(this)))/totalShares;
        // uint256 what = _share.mul(sushi.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        sushi.transfer(msg.sender, what);
    }
}
