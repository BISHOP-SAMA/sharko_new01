// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SHACKToken
 * @notice Transferable reward token for the SHACKO ecosystem
 * @dev Earned by staking SHACKO NFTs, used for raffles and governance
 */
contract SHACKToken is ERC20, Ownable {
    
    // Authorized contracts that can mint/burn tokens
    mapping(address => bool) public authorizedMinters;
    
    // Events
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    
    constructor() ERC20("SHACKO Token", "SHACK") Ownable(msg.sender) {
        // No initial supply - tokens minted through staking
    }
    
    /**
     * @notice Authorize a contract to mint tokens
     * @param minter Address to authorize (staking contract, raffle, etc.)
     */
    function authorizeMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid address");
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }
    
    /**
     * @notice Revoke minting authorization
     * @param minter Address to revoke
     */
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }
    
    /**
     * @notice Mint tokens (only authorized contracts)
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        _mint(to, amount);
    }
    
    /**
     * @notice Burn tokens from an address (only authorized contracts)
     * @param from Address to burn from
     * @param amount Amount to burn
     */
    function burn(address from, uint256 amount) external {
        require(authorizedMinters[msg.sender], "Not authorized to burn");
        _burn(from, amount);
    }
    
    /**
     * @notice Allow users to burn their own tokens
     * @param amount Amount to burn
     */
    function burnOwn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
