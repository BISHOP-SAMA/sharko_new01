// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ASSToken is ERC20, Ownable {
    mapping(address => bool) public minters;
    
    constructor() ERC20("SHACKO Staking Token", "ASS") Ownable(msg.sender) {}
    
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
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}