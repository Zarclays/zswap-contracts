// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;


import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";


//Using https://snapshot.org/#/ gasless for Voting and Governance instead
// Minter Role can also Burn
// Mint and burn can only be called by the owner (MasterChef)

// ZSWAPToken
contract TestToken2 is ERC20PresetMinterPauser {

    constructor(address owner, string memory name, string memory symbol) ERC20PresetMinterPauser(name, symbol) {
        grantMintRole(owner);
        _mint(owner, 1000000*10**18);// Disable for Live 
        _mint(0x4ABda0097D7545dE58608F7E36e0C1cac68b4943, 100000* 10**18);
        _mint(0x8853161EE7A92E2c5c634647b323a7CcB31EF2CD, 100000* 10**18);
    }
    
    function burn(uint256 amount) public override {
        require(hasRole(MINTER_ROLE, _msgSender()), "ERC20PresetMinterPauser: must have minter role to burn");

        _burn(_msgSender(), amount);
    }

    
    function burnFrom(address account, uint256 amount) public override {
        require(hasRole(MINTER_ROLE, _msgSender()), "ERC20PresetMinterPauser: must have minter role to burn");

        _spendAllowance(account, _msgSender(), amount);
        _burn(account, amount);
    }


    function getChainId() internal view returns (uint) {
        uint256 chainId;
        assembly { chainId := chainid() }
        return chainId;
    }

    function isInRole(bytes32 role, address account) public view returns (bool) {
        // uint count = getRoleMemberCount(role);
        // for(uint i=0; i<count; i++){
        //     if(account == getRoleMember(role,i)){
        //         return true;
        //     }
        // }
        // return false;

        return hasRole(role, account);
    }

    function isAdmin(address account) public view returns (bool) {        
        return isInRole(DEFAULT_ADMIN_ROLE, account);
    }

    function grantMintRole(address to) public virtual {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ZSWapToken: must have minter role to mint");
        grantRole(MINTER_ROLE, to);
    }


}