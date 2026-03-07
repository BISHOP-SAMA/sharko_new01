// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

interface IxSHACKToken {
    function mint(address to, uint256 amount) external;
}

contract ShackoStaking is Ownable, ReentrancyGuard, Pausable, ERC721Holder {

    IERC721 public immutable shackoNFT;
    IxSHACKToken public immutable xShackToken;

    enum Duration { SEVEN, FOURTEEN, THIRTY, SIXTY }

    struct StakeInfo {
        address owner;
        uint256 stakedAt;
        uint256 lastClaim;
        uint256 unlockTime;
        uint8 rarity;
        bool staked;
    }

    mapping(uint256 => StakeInfo) public stakes;
    mapping(address => uint256[]) public userStakes;

    // rarity → reward per day
    mapping(uint8 => uint256) public dailyReward;

    event Staked(address indexed user, uint256 tokenId, uint256 unlockTime);
    event Unstaked(address indexed user, uint256 tokenId);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor(address _nft, address _xshack) Ownable(msg.sender) {
        shackoNFT = IERC721(_nft);
        xShackToken = IxSHACKToken(_xshack);

        dailyReward[0] = 10 ether; // Common
        dailyReward[1] = 15 ether; // Uncommon
        dailyReward[2] = 20 ether; // Rare
        dailyReward[3] = 40 ether; // Epic
        dailyReward[4] = 70 ether; // Legendary
    }

    function stake(uint256 tokenId, uint8 rarity, Duration duration) external whenNotPaused nonReentrant {
        require(shackoNFT.ownerOf(tokenId) == msg.sender, "Not owner");
        require(!stakes[tokenId].staked, "Already staked");

        uint256 lockDays = getDurationDays(duration);
        uint256 unlock = block.timestamp + (lockDays * 1 days);

        shackoNFT.safeTransferFrom(msg.sender, address(this), tokenId);

        stakes[tokenId] = StakeInfo({
            owner: msg.sender,
            stakedAt: block.timestamp,
            lastClaim: block.timestamp,
            unlockTime: unlock,
            rarity: rarity,
            staked: true
        });

        userStakes[msg.sender].push(tokenId);

        emit Staked(msg.sender, tokenId, unlock);
    }

    function claim(uint256 tokenId) public nonReentrant {
        StakeInfo storage s = stakes[tokenId];

        require(s.owner == msg.sender, "Not owner");
        require(s.staked, "Not staked");

        uint256 reward = pendingRewards(tokenId);
        require(reward > 0, "No rewards");

        s.lastClaim = block.timestamp;

        xShackToken.mint(msg.sender, reward);

        emit RewardsClaimed(msg.sender, reward);
    }

    function claimAll() external nonReentrant {
        uint256[] storage tokens = userStakes[msg.sender];
        uint256 total;

        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 tokenId = tokens[i];

            StakeInfo storage s = stakes[tokenId];

            uint256 reward = pendingRewards(tokenId);

            if (reward > 0) {
                s.lastClaim = block.timestamp;
                total += reward;
            }
        }

        require(total > 0, "No rewards");

        xShackToken.mint(msg.sender, total);

        emit RewardsClaimed(msg.sender, total);
    }

    function unstake(uint256 tokenId) external nonReentrant {
        StakeInfo storage s = stakes[tokenId];

        require(s.owner == msg.sender, "Not owner");
        require(block.timestamp >= s.unlockTime, "Still locked");

        claim(tokenId);

        s.staked = false;

        _removeUserStake(msg.sender, tokenId);

        shackoNFT.safeTransferFrom(address(this), msg.sender, tokenId);

        emit Unstaked(msg.sender, tokenId);
    }

    function pendingRewards(uint256 tokenId) public view returns (uint256) {
        StakeInfo memory s = stakes[tokenId];

        if (!s.staked) return 0;

        uint256 rate = dailyReward[s.rarity];
        uint256 time = block.timestamp - s.lastClaim;

        return (rate * time) / 1 days;
    }

    function getDurationDays(Duration duration) public pure returns (uint256) {
        if (duration == Duration.SEVEN) return 7;
        if (duration == Duration.FOURTEEN) return 14;
        if (duration == Duration.THIRTY) return 30;
        if (duration == Duration.SIXTY) return 60;

        return 7;
    }

    function getUserStakes(address user) external view returns (uint256[] memory) {
        return userStakes[user];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _removeUserStake(address user, uint256 tokenId) internal {
        uint256[] storage list = userStakes[user];

        for (uint256 i = 0; i < list.length; i++) {
            if (list[i] == tokenId) {
                list[i] = list[list.length - 1];
                list.pop();
                break;
            }
        }
    }
}