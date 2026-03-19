// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

interface ISHACKToken {
    function mint(address to, uint256 amount) external;
}

/**
 * @title ShackoStaking
 * @notice Stake SHACKO NFTs to earn $SHACK rewards
 * @dev Updated for mainnet with batch functions
 * @dev SHACKO NFT: 0x7f30f4b6d5C98D29E32cf013558A01443c87C013
 */
contract ShackoStaking is Ownable, ReentrancyGuard, Pausable {
    
    IERC721 public shackoNFT;
    ISHACKToken public shackToken;
    address public treasury;
    
    // Staking fees
    uint256 public stakeFee = 0.0001 ether;           // ~$0.30
    uint256 public emergencyUnstakeFee = 0.0002 ether; // ~$0.60
    
    // Duration options
    enum Duration { SEVEN, FOURTEEN, THIRTY, SIXTY }
    
    // Stake info
    struct StakeInfo {
        address owner;
        uint256 stakedAt;
        Duration duration;
        uint256 unlockTime;
        uint256 lastClaimTime;
        bool isStaked;
    }
    
    // Mappings
    mapping(uint256 => StakeInfo) public stakes;
    mapping(address => uint256[]) public userStakes;
    mapping(uint256 => string) public tokenRarity;
    mapping(string => uint256) public baseRates;
    
    // Events
    event Staked(address indexed user, uint256 indexed tokenId, Duration duration, uint256 fee);
    event Unstaked(address indexed user, uint256 indexed tokenId, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 indexed tokenId, uint256 amount);
    event RewardsClaimedBatch(address indexed user, uint256 totalRewards, uint256 nftCount);
    event StakedBatch(address indexed user, uint256[] tokenIds, Duration duration, uint256 totalFee);
    event EmergencyUnstake(address indexed user, uint256 indexed tokenId, uint256 penalty);
    
    constructor(
        address _shackoNFT,
        address _shackToken,
        address _treasury
    ) Ownable(msg.sender) {
        shackoNFT = IERC721(_shackoNFT);
        shackToken = ISHACKToken(_shackToken);
        treasury = _treasury;
        
        // Set base rates (daily rewards in wei)
        baseRates["Common"] = 10 * 1e18;
        baseRates["Uncommon"] = 15 * 1e18;
        baseRates["Rare"] = 20 * 1e18;
        baseRates["Epic"] = 40 * 1e18;
        baseRates["Legendary"] = 70 * 1e18;
        baseRates["OneOfOne"] = 100 * 1e18;
    }
    
    /**
     * @notice Stake a single NFT
     */
    function stake(uint256 tokenId, Duration duration) external payable nonReentrant whenNotPaused {
        require(msg.value >= stakeFee, "Insufficient fee");
        _stake(tokenId, duration);
        
        // Send fee to treasury
        (bool success, ) = treasury.call{value: msg.value}("");
        require(success, "Fee transfer failed");
        
        emit Staked(msg.sender, tokenId, duration, msg.value);
    }
    
    /**
     * @notice Stake multiple NFTs at once
     * @param tokenIds Array of token IDs to stake
     * @param duration Staking duration (same for all)
     */
    function stakeAll(uint256[] calldata tokenIds, Duration duration) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        require(tokenIds.length > 0, "No tokens provided");
        require(tokenIds.length <= 50, "Too many tokens at once");
        require(msg.value >= stakeFee * tokenIds.length, "Insufficient fee");
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _stake(tokenIds[i], duration);
        }
        
        // Send fee to treasury
        (bool success, ) = treasury.call{value: msg.value}("");
        require(success, "Fee transfer failed");
        
        emit StakedBatch(msg.sender, tokenIds, duration, msg.value);
    }
    
    /**
     * @notice Internal stake function
     */
    function _stake(uint256 tokenId, Duration duration) internal {
        require(shackoNFT.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(!stakes[tokenId].isStaked, "Already staked");
        require(bytes(tokenRarity[tokenId]).length > 0, "Rarity not set");
        
        // Transfer NFT to contract
        shackoNFT.transferFrom(msg.sender, address(this), tokenId);
        
        // Calculate unlock time
        uint256 durationInDays = getDurationInDays(duration);
        uint256 unlockTime = block.timestamp + (durationInDays * 1 days);
        
        // Create stake
        stakes[tokenId] = StakeInfo({
            owner: msg.sender,
            stakedAt: block.timestamp,
            duration: duration,
            unlockTime: unlockTime,
            lastClaimTime: block.timestamp,
            isStaked: true
        });
        
        userStakes[msg.sender].push(tokenId);
    }
    
    /**
     * @notice Unstake NFT and claim rewards
     */
    function unstake(uint256 tokenId) external nonReentrant {
        StakeInfo storage stakeInfo = stakes[tokenId];
        require(stakeInfo.isStaked, "Not staked");
        require(stakeInfo.owner == msg.sender, "Not stake owner");
        require(block.timestamp >= stakeInfo.unlockTime, "Still locked");
        
        // Calculate final rewards
        uint256 rewards = calculateRewards(tokenId);
        
        // Update state
        stakeInfo.isStaked = false;
        _removeUserStake(msg.sender, tokenId);
        
        // Return NFT
        shackoNFT.transferFrom(address(this), msg.sender, tokenId);
        
        // Mint rewards if any
        if (rewards > 0) {
            shackToken.mint(msg.sender, rewards);
        }
        
        emit Unstaked(msg.sender, tokenId, rewards);
    }
    
    /**
     * @notice Emergency unstake (forfeit rewards, pay penalty)
     */
    function emergencyUnstake(uint256 tokenId) external payable nonReentrant {
        StakeInfo storage stakeInfo = stakes[tokenId];
        require(stakeInfo.isStaked, "Not staked");
        require(stakeInfo.owner == msg.sender, "Not stake owner");
        require(msg.value >= emergencyUnstakeFee, "Insufficient penalty fee");
        
        // Update state (no rewards)
        stakeInfo.isStaked = false;
        _removeUserStake(msg.sender, tokenId);
        
        // Return NFT
        shackoNFT.transferFrom(address(this), msg.sender, tokenId);
        
        // Send penalty to treasury
        (bool success, ) = treasury.call{value: msg.value}("");
        require(success, "Fee transfer failed");
        
        emit EmergencyUnstake(msg.sender, tokenId, msg.value);
    }
    
    /**
     * @notice Claim rewards for a single NFT
     */
    function claimRewards(uint256 tokenId) external nonReentrant {
        StakeInfo storage stakeInfo = stakes[tokenId];
        require(stakeInfo.isStaked, "Not staked");
        require(stakeInfo.owner == msg.sender, "Not stake owner");
        
        uint256 rewards = calculateRewards(tokenId);
        require(rewards > 0, "No rewards to claim");
        
        // Update claim time
        stakeInfo.lastClaimTime = block.timestamp;
        
        // Mint rewards
        shackToken.mint(msg.sender, rewards);
        
        emit RewardsClaimed(msg.sender, tokenId, rewards);
    }
    
    /**
     * @notice Claim rewards for ALL staked NFTs in one transaction
     */
    function claimAllRewards() external nonReentrant {
        uint256[] memory stakedTokens = userStakes[msg.sender];
        require(stakedTokens.length > 0, "No staked NFTs");
        
        uint256 totalRewards = 0;
        uint256 claimedCount = 0;
        
        // Calculate rewards for all staked NFTs
        for (uint256 i = 0; i < stakedTokens.length; i++) {
            uint256 tokenId = stakedTokens[i];
            StakeInfo storage stakeInfo = stakes[tokenId];
            
            if (stakeInfo.isStaked && stakeInfo.owner == msg.sender) {
                uint256 rewards = calculateRewards(tokenId);
                
                if (rewards > 0) {
                    totalRewards += rewards;
                    stakeInfo.lastClaimTime = block.timestamp;
                    claimedCount++;
                }
            }
        }
        
        require(totalRewards > 0, "No rewards to claim");
        
        // Mint all rewards at once
        shackToken.mint(msg.sender, totalRewards);
        
        emit RewardsClaimedBatch(msg.sender, totalRewards, claimedCount);
    }
    
    /**
     * @notice Calculate pending rewards for a token
     */
    function calculateRewards(uint256 tokenId) public view returns (uint256) {
        StakeInfo memory stakeInfo = stakes[tokenId];
        if (!stakeInfo.isStaked) return 0;
        
        string memory rarity = tokenRarity[tokenId];
        uint256 baseRate = baseRates[rarity];
        if (baseRate == 0) return 0;
        
        // Time staked in seconds
        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimTime;
        
        // Calculate base rewards (per second)
        uint256 rewardsPerSecond = baseRate / 1 days;
        uint256 baseRewards = rewardsPerSecond * timeStaked;
        
        // Apply rarity multiplier
        uint256 rarityMultiplier = getRarityMultiplier(rarity);
        uint256 rewardsAfterRarity = (baseRewards * rarityMultiplier) / 100;
        
        // Apply duration multiplier
        uint256 durationMultiplier = getDurationMultiplier(stakeInfo.duration);
        uint256 finalRewards = (rewardsAfterRarity * durationMultiplier) / 100;
        
        return finalRewards;
    }
    
    /**
     * @notice Get rarity multiplier (percentage)
     */
    function getRarityMultiplier(string memory rarity) public pure returns (uint256) {
        bytes32 rarityHash = keccak256(abi.encodePacked(rarity));
        
        if (rarityHash == keccak256(abi.encodePacked("Common"))) return 100;
        if (rarityHash == keccak256(abi.encodePacked("Uncommon"))) return 125;
        if (rarityHash == keccak256(abi.encodePacked("Rare"))) return 150;
        if (rarityHash == keccak256(abi.encodePacked("Epic"))) return 200;
        if (rarityHash == keccak256(abi.encodePacked("Legendary"))) return 300;
        if (rarityHash == keccak256(abi.encodePacked("OneOfOne"))) return 500;
        
        return 100; // Default
    }
    
    /**
     * @notice Get duration multiplier (percentage)
     */
    function getDurationMultiplier(Duration duration) public pure returns (uint256) {
        if (duration == Duration.SEVEN) return 100;
        if (duration == Duration.FOURTEEN) return 125;
        if (duration == Duration.THIRTY) return 150;
        if (duration == Duration.SIXTY) return 200;
        return 100;
    }
    
    /**
     * @notice Get duration in days
     */
    function getDurationInDays(Duration duration) public pure returns (uint256) {
        if (duration == Duration.SEVEN) return 7;
        if (duration == Duration.FOURTEEN) return 14;
        if (duration == Duration.THIRTY) return 30;
        if (duration == Duration.SIXTY) return 60;
        return 7;
    }
    
    /**
     * @notice Get user's staked token IDs
     */
    function getUserStakes(address user) external view returns (uint256[] memory) {
        return userStakes[user];
    }
    
    /**
     * @notice Remove token from user's stake array
     */
    function _removeUserStake(address user, uint256 tokenId) internal {
        uint256[] storage stakes_array = userStakes[user];
        for (uint256 i = 0; i < stakes_array.length; i++) {
            if (stakes_array[i] == tokenId) {
                stakes_array[i] = stakes_array[stakes_array.length - 1];
                stakes_array.pop();
                break;
            }
        }
    }
    
    // Admin functions
    
    /**
     * @notice Set rarity for a token
     */
    function setTokenRarity(uint256 tokenId, string memory rarity) external onlyOwner {
        tokenRarity[tokenId] = rarity;
    }
    
    /**
     * @notice Batch set rarity for multiple tokens
     */
    function batchSetRarity(uint256[] calldata tokenIds, string[] calldata rarities) external onlyOwner {
        require(tokenIds.length == rarities.length, "Length mismatch");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenRarity[tokenIds[i]] = rarities[i];
        }
    }
    
    /**
     * @notice Update fees
     */
    function setFees(uint256 _stakeFee, uint256 _emergencyFee) external onlyOwner {
        stakeFee = _stakeFee;
        emergencyUnstakeFee = _emergencyFee;
    }
    
    /**
     * @notice Pause/unpause staking
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @notice Receive ETH
     */
    receive() external payable {}
}
