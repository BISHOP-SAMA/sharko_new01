// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract xSHACKToken is ERC20, Ownable {
    mapping(address => bool) public minters;
    mapping(address => bool) public burners;
    
    constructor() ERC20("SHACKO XP Token", "xSHACK") Ownable(msg.sender) {}
    
    // Override transfer functions to make non-transferable
    function transfer(address, uint256) public pure override returns (bool) {
        revert("xSHACK: token is non-transferable");
    }
    
    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("xSHACK: token is non-transferable");
    }
    
    // Allow minting by authorized contracts (staking)
    function addMinter(address _minter) external onlyOwner {
        minters[_minter] = true;
    }
    
    function removeMinter(address _minter) external onlyOwner {
        minters[_minter] = false;
    }
    
    function mint(address to, uint256 amount) external {
        require(minters[msg.sender], "Not authorized to mint");
        _mint(to, amount);
    }
    
    // Allow burning by authorized contracts (converter)
    function addBurner(address _burner) external onlyOwner {
        burners[_burner] = true;
    }
    
    function removeBurner(address _burner) external onlyOwner {
        burners[_burner] = false;
    }
    
    function burn(address from, uint256 amount) external {
        require(burners[msg.sender] || from == msg.sender, "Not authorized to burn");
        _burn(from, amount);
    }
}