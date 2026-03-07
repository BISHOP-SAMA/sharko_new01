// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

interface IShackToken {
    function mint(address to, uint256 amount) external;
}

contract ShackoStaking is Ownable, ReentrancyGuard, Pausable {
    
    // ============ State Variables ============
    
    IERC721 public shackoNFT;
    IShackToken public shackToken;
    
    // Base rate: 10 $SHACK per day (in wei per second)
    uint256 public constant BASE_RATE = 10 * 1e18 / 1 days;
    
    // Duration options in days
    enum Duration { SEVEN, FOURTEEN, THIRTY, SIXTY }
    
    // Staking info for each NFT
    struct StakeInfo {
        address owner;
        uint256 stakedAt;
        Duration duration;
        uint256 unlockTime;
        uint256 lastClaimTime;
        bool isStaked;
    }
    
    // Token ID => Stake Info
    mapping(uint256 => StakeInfo) public stakes;
    
    // User => Token IDs staked
    mapping(address => uint256[]) public userStakes;
    
    // Rarity multipliers (in basis points: 100 = 1.0x, 300 = 3.0x)
    mapping(uint256 => uint256) public rarityMultipliers;
    
    // ============ Events ============
    
    event Staked(address indexed user, uint256 indexed tokenId, Duration duration, uint256 unlockTime);
    event Unstaked(address indexed user, uint256 indexed tokenId, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 indexed tokenId, uint256 amount);
    event EmergencyUnstake(address indexed user, uint256 indexed tokenId);
    
    // ============ Constructor ============
    
    constructor(
        address _shackoNFT,
        address _shackToken
    ) Ownable(msg.sender) {
        shackoNFT = IERC721(_shackoNFT);
        shackToken = IShackToken(_shackToken);
    }
    
    // ============ Staking Functions ============
    
    /**
     * @dev Stake NFT for a chosen duration
     */
    function stake(uint256 tokenId, Duration duration) external nonReentrant whenNotPaused {
        require(shackoNFT.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(!stakes[tokenId].isStaked, "Already staked");
        
        // Transfer NFT to contract
        shackoNFT.transferFrom(msg.sender, address(this), tokenId);
        
        // Calculate unlock time
        uint256 durationDays = getDurationInDays(duration);
        uint256 unlockTime = block.timestamp + (durationDays * 1 days);
        
        // Store stake info
        stakes[tokenId] = StakeInfo({
            owner: msg.sender,
            stakedAt: block.timestamp,
            duration: duration,
            unlockTime: unlockTime,
            lastClaimTime: block.timestamp,
            isStaked: true
        });
        
        // Add to user's staked tokens
        userStakes[msg.sender].push(tokenId);
        
        emit Staked(msg.sender, tokenId, duration, unlockTime);
    }
    
    /**
     * @dev Unstake NFT and claim all rewards
     */
    function unstake(uint256 tokenId) external nonReentrant {
        StakeInfo storage stakeInfo = stakes[tokenId];
        require(stakeInfo.isStaked, "Not staked");
        require(stakeInfo.owner == msg.sender, "Not stake owner");
        require(block.timestamp >= stakeInfo.unlockTime, "Still locked");
        
        // Calculate final rewards
        uint256 rewards = calculateRewards(tokenId);
        
        // Mark as unstaked
        stakeInfo.isStaked = false;
        
        // Remove from user's stakes
        _removeUserStake(msg.sender, tokenId);
        
        // Transfer NFT back
        shackoNFT.transferFrom(address(this), msg.sender, tokenId);
        
        // Mint rewards
        if (rewards > 0) {
            shackToken.mint(msg.sender, rewards);
        }
        
        emit Unstaked(msg.sender, tokenId, rewards);
    }
    
    /**
     * @dev Claim accumulated rewards without unstaking
     */
    function claimRewards(uint256 tokenId) external nonReentrant {
        StakeInfo storage stakeInfo = stakes[tokenId];
        require(stakeInfo.isStaked, "Not staked");
        require(stakeInfo.owner == msg.sender, "Not stake owner");
        
        uint256 rewards = calculateRewards(tokenId);
        require(rewards > 0, "No rewards to claim");
        
        // Update last claim time
        stakeInfo.lastClaimTime = block.timestamp;
        
        // Mint rewards
        shackToken.mint(msg.sender, rewards);
        
        emit RewardsClaimed(msg.sender, tokenId, rewards);
    }
    
    /**
     * @dev Emergency unstake (forfeits rewards)
     */
    function emergencyUnstake(uint256 tokenId) external nonReentrant {
        StakeInfo storage stakeInfo = stakes[tokenId];
        require(stakeInfo.isStaked, "Not staked");
        require(stakeInfo.owner == msg.sender, "Not stake owner");
        
        // Mark as unstaked
        stakeInfo.isStaked = false;
        
        // Remove from user's stakes
        _removeUserStake(msg.sender, tokenId);
        
        // Transfer NFT back (no rewards)
        shackoNFT.transferFrom(address(this), msg.sender, tokenId);
        
        emit EmergencyUnstake(msg.sender, tokenId);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Calculate pending rewards for a staked NFT
     */
    function calculateRewards(uint256 tokenId) public view returns (uint256) {
        StakeInfo memory stakeInfo = stakes[tokenId];
        if (!stakeInfo.isStaked) return 0;
        
        // Time staked since last claim
        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimTime;
        
        // Get multipliers
        uint256 rarityMult = getRarityMultiplier(tokenId);
        uint256 durationMult = getDurationMultiplier(stakeInfo.duration);
        
        // Calculate rewards: baseRate * time * rarityMult * durationMult / 10000
        uint256 rewards = (BASE_RATE * timeStaked * rarityMult * durationMult) / 10000;
        
        return rewards;
    }
    
    /**
     * @dev Get all staked NFTs for a user
     */
    function getUserStakes(address user) external view returns (uint256[] memory) {
        return userStakes[user];
    }
    
    /**
     * @dev Get stake info for a token
     */
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
    
    /**
     * @dev Get rarity multiplier (default or override)
     */
    function getRarityMultiplier(uint256 tokenId) public view returns (uint256) {
        // Check if custom multiplier set
        if (rarityMultipliers[tokenId] > 0) {
            return rarityMultipliers[tokenId];
        }
        
        // Default: 1/1s (#1-7) get 5.0x, others 1.0x
        if (tokenId <= 7) {
            return 500; // 5.0x
        }
        
        // Will be set based on metadata after reveal
        return 100; // 1.0x default
    }
    
    /**
     * @dev Get duration multiplier
     */
    function getDurationMultiplier(Duration duration) public pure returns (uint256) {
        if (duration == Duration.SEVEN) return 100;      // 1.0x
        if (duration == Duration.FOURTEEN) return 125;   // 1.25x
        if (duration == Duration.THIRTY) return 150;     // 1.5x
        if (duration == Duration.SIXTY) return 200;      // 2.0x
        return 100;
    }
    
    /**
     * @dev Get duration in days
     */
    function getDurationInDays(Duration duration) public pure returns (uint256) {
        if (duration == Duration.SEVEN) return 7;
        if (duration == Duration.FOURTEEN) return 14;
        if (duration == Duration.THIRTY) return 30;
        if (duration == Duration.SIXTY) return 60;
        return 7;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Set rarity multiplier for specific token
     */
    function setRarityMultiplier(uint256 tokenId, uint256 multiplier) external onlyOwner {
        rarityMultipliers[tokenId] = multiplier;
    }
    
    /**
     * @dev Batch set rarity multipliers
     */
    function batchSetRarityMultipliers(
        uint256[] calldata tokenIds,
        uint256[] calldata multipliers
    ) external onlyOwner {
        require(tokenIds.length == multipliers.length, "Length mismatch");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            rarityMultipliers[tokenIds[i]] = multipliers[i];
        }
    }
    
    /**
     * @dev Pause staking
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause staking
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // ============ Internal Functions ============
    
    /**
     * @dev Remove token from user's staked array
     */
    function _removeUserStake(address user, uint256 tokenId) internal {
        uint256[] storage stakes = userStakes[user];
        for (uint256 i = 0; i < stakes.length; i++) {
            if (stakes[i] == tokenId) {
                stakes[i] = stakes[stakes.length - 1];
                stakes.pop();
                break;
            }
        }
    }
}