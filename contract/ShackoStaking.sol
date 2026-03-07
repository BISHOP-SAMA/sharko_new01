// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

interface IxSHACKToken {
    function mint(address to, uint256 amount) external;
}

contract ShackoStaking is Ownable, ReentrancyGuard, Pausable {
    
    IERC721 public shackoNFT;
    IxSHACKToken public xShackToken;
    
    // Base rate: 10 xSHACK per day (in wei per second)
    uint256 public constant BASE_RATE = 10 * 1e18 / 1 days;
    
    enum Duration { SEVEN, FOURTEEN, THIRTY, SIXTY }
    
    struct StakeInfo {
        address owner;
        uint256 stakedAt;
        Duration duration;
        uint256 unlockTime;
        uint256 lastClaimTime;
        bool isStaked;
    }
    
    mapping(uint256 => StakeInfo) public stakes;
    mapping(address => uint256[]) public userStakes;
    mapping(uint256 => uint256) public rarityMultipliers;
    
    event Staked(address indexed user, uint256 indexed tokenId, Duration duration, uint256 unlockTime);
    event Unstaked(address indexed user, uint256 indexed tokenId, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 indexed tokenId, uint256 amount);
    event EmergencyUnstake(address indexed user, uint256 indexed tokenId);
    
    constructor(address _shackoNFT, address _xShackToken) Ownable(msg.sender) {
        shackoNFT = IERC721(_shackoNFT);
        xShackToken = IxSHACKToken(_xShackToken);
    }
    
    function stake(uint256 tokenId, Duration duration) external nonReentrant whenNotPaused {
        require(shackoNFT.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(!stakes[tokenId].isStaked, "Already staked");
        
        shackoNFT.transferFrom(msg.sender, address(this), tokenId);
        
        uint256 durationDays = getDurationInDays(duration);
        uint256 unlockTime = block.timestamp + (durationDays * 1 days);
        
        stakes[tokenId] = StakeInfo({
            owner: msg.sender,
            stakedAt: block.timestamp,
            duration: duration,
            unlockTime: unlockTime,
            lastClaimTime: block.timestamp,
            isStaked: true
        });
        
        userStakes[msg.sender].push(tokenId);
        
        emit Staked(msg.sender, tokenId, duration, unlockTime);
    }
    
    function unstake(uint256 tokenId) external nonReentrant {
        StakeInfo storage stakeInfo = stakes[tokenId];
        require(stakeInfo.isStaked, "Not staked");
        require(stakeInfo.owner == msg.sender, "Not stake owner");
        require(block.timestamp >= stakeInfo.unlockTime, "Still locked");
        
        uint256 rewards = calculateRewards(tokenId);
        
        stakeInfo.isStaked = false;
        _removeUserStake(msg.sender, tokenId);
        
        shackoNFT.transferFrom(address(this), msg.sender, tokenId);
        
        if (rewards > 0) {
            xShackToken.mint(msg.sender, rewards);
        }
        
        emit Unstaked(msg.sender, tokenId, rewards);
    }
    
    function claimRewards(uint256 tokenId) external nonReentrant {
        StakeInfo storage stakeInfo = stakes[tokenId];
        require(stakeInfo.isStaked, "Not staked");
        require(stakeInfo.owner == msg.sender, "Not stake owner");
        
        uint256 rewards = calculateRewards(tokenId);
        require(rewards > 0, "No rewards to claim");
        
        stakeInfo.lastClaimTime = block.timestamp;
        
        xShackToken.mint(msg.sender, rewards);
        
        emit RewardsClaimed(msg.sender, tokenId, rewards);
    }
    
    function emergencyUnstake(uint256 tokenId) external nonReentrant {
        StakeInfo storage stakeInfo = stakes[tokenId];
        require(stakeInfo.isStaked, "Not staked");
        require(stakeInfo.owner == msg.sender, "Not stake owner");
        
        stakeInfo.isStaked = false;
        _removeUserStake(msg.sender, tokenId);
        
        shackoNFT.transferFrom(address(this), msg.sender, tokenId);
        
        emit EmergencyUnstake(msg.sender, tokenId);
    }
    
    function calculateRewards(uint256 tokenId) public view returns (uint256) {
        StakeInfo memory stakeInfo = stakes[tokenId];
        if (!stakeInfo.isStaked) return 0;
        
        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimTime;
        uint256 rarityMult = getRarityMultiplier(tokenId);
        uint256 durationMult = getDurationMultiplier(stakeInfo.duration);
        
        uint256 rewards = (BASE_RATE * timeStaked * rarityMult * durationMult) / 10000;
        
        return rewards;
    }
    
    function getUserStakes(address user) external view returns (uint256[] memory) {
        return userStakes[user];
    }
    
    function getStakeInfo(uint256 tokenId) external view returns (
        address owner,
        uint256 stakedAt,
        uint256 unlockTime,
        uint256 pendingRewards,
        bool isStaked
    ) {
        StakeInfo memory info = stakes[tokenId];
        return (
            info.owner,
            info.stakedAt,
            info.unlockTime,
            calculateRewards(tokenId),
            info.isStaked
        );
    }
    
    function getRarityMultiplier(uint256 tokenId) public view returns (uint256) {
        if (rarityMultipliers[tokenId] > 0) {
            return rarityMultipliers[tokenId];
        }
        
        // 1/1s (#1-7) get 5.0x
        if (tokenId <= 7) {
            return 500;
        }
        
        return 100; // 1.0x default
    }
    
    function getDurationMultiplier(Duration duration) public pure returns (uint256) {
        if (duration == Duration.SEVEN) return 100;      // 1.0x
        if (duration == Duration.FOURTEEN) return 125;   // 1.25x
        if (duration == Duration.THIRTY) return 150;     // 1.5x
        if (duration == Duration.SIXTY) return 200;      // 2.0x
        return 100;
    }
    
    function getDurationInDays(Duration duration) public pure returns (uint256) {
        if (duration == Duration.SEVEN) return 7;
        if (duration == Duration.FOURTEEN) return 14;
        if (duration == Duration.THIRTY) return 30;
        if (duration == Duration.SIXTY) return 60;
        return 7;
    }
    
    function setRarityMultiplier(uint256 tokenId, uint256 multiplier) external onlyOwner {
        rarityMultipliers[tokenId] = multiplier;
    }
    
    function batchSetRarityMultipliers(
        uint256[] calldata tokenIds,
        uint256[] calldata multipliers
    ) external onlyOwner {
        require(tokenIds.length == multipliers.length, "Length mismatch");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            rarityMultipliers[tokenIds[i]] = multipliers[i];
        }
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function _removeUserStake(address user, uint256 tokenId) internal {
        uint256[] storage stakesList = userStakes[user];
        for (uint256 i = 0; i < stakesList.length; i++) {
            if (stakesList[i] == tokenId) {
                stakesList[i] = stakesList[stakesList.length - 1];
                stakesList.pop();
                break;
            }
        }
    }
}