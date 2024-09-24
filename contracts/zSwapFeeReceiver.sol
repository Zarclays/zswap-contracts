// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NotEnoughBalance();
contract zSwapFeeReceiver is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    enum CoinType{
        Native,
        ERC20,
        ERC721
    }

    // Event emitted when ETH is received
    event ETHReceived(address indexed sender, uint256 amount);

    // // Event emitted when ERC20 tokens are received
    // event ERC20Received(address indexed sender, address indexed token, uint256 amount);

    // // Event emitted when NFTs are received
    // event NFTReceived(address indexed sender, address indexed token, uint256 tokenId);

    // Event emitted when admin withdraws funds
    event Withdrawal(address indexed tokenAddress,address indexed to, uint256 amount, CoinType coinType);

    event NFTWithdrawal(address indexed tokenAddress,address indexed to, uint256 tokenId, CoinType coinType);

    constructor() {

    }
    // Receive ETH
    receive() external payable {
        emit ETHReceived(msg.sender, msg.value);
    }

    

    // Admin withdrawal function
    function withdraw(uint256 amount, address payable to) public onlyOwner nonReentrant{
        require(address(this).balance >= amount, NotEnoughBalance());
        to.transfer(amount);
        emit Withdrawal(address(0), to, amount, CoinType.Native );
    }

    // Withdraw ERC20 tokens
    function withdrawERC20(IERC20 token, uint256 amount, address to) public onlyOwner nonReentrant {
        require(token.balanceOf(address(this)) >= amount, NotEnoughBalance());
        token.safeTransfer(to, amount);
        emit Withdrawal(address(token), to, amount, CoinType.ERC20 );
    }

    // Withdraw NFTs
    function withdrawNFT(IERC721 token, uint256 tokenId, address to) public onlyOwner nonReentrant {
        
        token.safeTransferFrom(address(this), to, tokenId);
        emit Withdrawal(address(token), to, tokenId, CoinType.Native );
    }
}
