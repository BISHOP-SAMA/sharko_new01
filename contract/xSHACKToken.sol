// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract xSHACKToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 1e18;

    mapping(address => bool) public minters;
    mapping(address => bool) public burners;

    constructor() ERC20("SHACKO XP Token", "xSHACK") Ownable(msg.sender) {}

    // Non-transferable
    function transfer(address, uint256) public pure override returns (bool) {
        revert("xSHACK: token is non-transferable");
    }

    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("xSHACK: token is non-transferable");
    }

    function approve(address, uint256) public pure override returns (bool) {
        revert("xSHACK: approvals disabled");
    }

    // Minter control
    function addMinter(address _minter) external onlyOwner {
        minters[_minter] = true;
    }

    function removeMinter(address _minter) external onlyOwner {
        minters[_minter] = false;
    }

    function mint(address to, uint256 amount) external {
        require(minters[msg.sender], "Not authorized to mint");
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply reached");

        _mint(to, amount);
    }

    // Burner control
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