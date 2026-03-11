// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title xSHACK Token
 * @notice Non-transferable XP token earned through staking SHACKO NFTs
 * @dev This token cannot be transferred between users - only minted/burned by staking contract
 */
contract xSHACKToken is ERC20, Ownable {
    
    // Mapping of authorized minters (staking contracts)
    mapping(address => bool) public authorizedMinters;
    
    // Events
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    
    constructor() ERC20("SHACKO XP", "xSHACK") Ownable(msg.sender) {
        // No initial supply - tokens only minted through staking
    }
    
    /**
     * @notice Authorize an address to mint xSHACK tokens (typically the staking contract)
     * @param minter Address to authorize
     */
    function authorizeMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid minter address");
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }
    
    /**
     * @notice Revoke minter authorization
     * @param minter Address to revoke
     */
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }
    
    /**
     * @notice Mint xSHACK tokens (only callable by authorized minters)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        _mint(to, amount);
    }
    
    /**
     * @notice Burn xSHACK tokens (e.g., when spending on raffles)
     * @param from Address to burn tokens from
     * @param amount Amount of tokens to burn
     */
    function burn(address from, uint256 amount) external {
        require(authorizedMinters[msg.sender], "Not authorized to burn");
        _burn(from, amount);
    }
    
    /**
     * @notice Override transfer to make token non-transferable
     * @dev This prevents users from transferring xSHACK - it can only be earned
     */
    function transfer(address, uint256) public pure override returns (bool) {
        revert("xSHACK is non-transferable");
    }
    
    /**
     * @notice Override transferFrom to make token non-transferable
     */
    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("xSHACK is non-transferable");
    }
    
    /**
     * @notice Override approve to prevent approvals (since non-transferable)
     */
    function approve(address, uint256) public pure override returns (bool) {
        revert("xSHACK is non-transferable");
    }
}