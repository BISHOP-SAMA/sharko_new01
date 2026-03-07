// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract xSHACKToken is ERC20, Ownable {
    mapping(address => bool) public minters;
    
    constructor() ERC20("SHACKO XP", "xSHACK") Ownable(msg.sender) {}
    
    // NON-TRANSFERABLE (users can't sell/trade it)
    function transfer(address, uint256) public pure override returns (bool) {
        revert("xSHACK: non-transferable");
    }
    
    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("xSHACK: non-transferable");
    }
    
    // Only staking contract can mint rewards
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
    
    // Users can burn their own xSHACK (for future converter)
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}