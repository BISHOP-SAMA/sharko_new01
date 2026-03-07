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
    address public treasury;
    
    // Fees in BASE (wei)
    uint256 public stakeFee = 0.5 ether;           // $0.50 in BASE
    uint256 public emergencyUnstakeFee = 1 ether;  // $1.00 in BASE
    
    // Base rates for each rarity tier (xSHACK per day in wei)
    mapping(string => uint256) public baseRates;
    
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
    
    // Rarity assignment: tokenId => rarity tier
    mapping(uint256 => string) public tokenRarity;
    
    event Staked(address indexed user, uint256 indexed tokenId, Duration duration, uint256 fee);
    event Unstaked(address indexed user, uint256 indexed tokenId, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 indexed tokenId, uint256 amount);
    event EmergencyUnstake(address indexed user, uint256 indexed tokenId, uint256 penalty);
    event FeesUpdated(uint256 stakeFee, uint256 emergencyFee);
    event RaritySet(uint256 indexed tokenId, string rarity);
    
    constructor(
        address _shackoNFT,
        address _xShackToken,
        address _treasury
    ) Ownable(msg.sender) {
        shackoNFT = IERC721(_shackoNFT);
        xShackToken = IxSHACKToken(_xShackToken);
        treasury = _treasury;
        
        // Initialize base rates (xSHACK per day)
        baseRates["Common"] = 10 * 1e18;       // 10 xSHACK/day
        baseRates["Uncommon"] = 15 * 1e18;     // 15 xSHACK/day
        baseRates["Rare"] = 20 * 1e18;         // 20 xSHACK/day
        baseRates["Epic"] = 40 * 1e18;         // 40 xSHACK/day
        baseRates["Legendary"] = 70 * 1e18;    // 70 xSHACK/day
        baseRates["OneOfOne"] = 100 * 1e18;    // 100 xSHACK/day (for 1/1s)
    }
    
    /**
     * @dev Stake NFT with $0.50 BASE fee
     */
    function stake(uint256 tokenId, Duration duration) external payable nonReentrant whenNotPaused {
        require(msg.value >= stakeFee, "Insufficient stake fee");
        require(shackoNFT.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(!stakes[tokenId].isStaked, "Already staked");
        require(bytes(tokenRarity[tokenId]).length > 0, "Rarity not set");
        
        // Transfer NFT to contract
        shackoNFT.transferFrom(msg.sender, address(this), tokenId);
        
        // Send fee to treasury
        (bool success, ) = treasury.call{value: msg.value}("");
        require(success, "Fee transfer failed");
        
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
        
        emit Staked(msg.sender, tokenId, duration, msg.value);
    }
    
    /**
     * @dev Normal unstake (must wait for duration, get all rewards)
     */
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
    
    /**
     * @dev Emergency unstake with $1 BASE penalty (forfeit all rewards)
     */
    function emergencyUnstake(uint256 tokenId) external payable nonReentrant {
        require(msg.value >= emergencyUnstakeFee, "Insufficient penalty fee");
        
        StakeInfo storage stakeInfo = stakes[tokenId];
        require(stakeInfo.isStaked, "Not staked");
        require(stakeInfo.owner == msg.sender, "Not stake owner");
        
        // Send penalty to treasury
        (bool success, ) = treasury.call{value: msg.value}("");
        require(success, "Penalty transfer failed");
        
        stakeInfo.isStaked = false;
        _removeUserStake(msg.sender, tokenId);
        
        // Return NFT but NO rewards
        shackoNFT.transferFrom(address(this), msg.sender, tokenId);
        
        emit EmergencyUnstake(msg.sender, tokenId, msg.value);
    }
    
    /**
     * @dev Claim rewards without unstaking
     */
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
    
    /**
     * @dev Calculate pending rewards
     * Formula: (baseRate × rarityMultiplier × durationMultiplier × timeStaked) / (1 day)
     */
    function calculateRewards(uint256 tokenId) public view returns (uint256) {
        StakeInfo memory stakeInfo = stakes[tokenId];
        if (!stakeInfo.isStaked) return 0;
        
        string memory rarity = tokenRarity[tokenId];
        uint256 baseRate = baseRates[rarity];
        
        // Time staked in seconds since last claim
        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimTime;
        
        // Get multipliers
        uint256 rarityMult = getRarityMultiplier(rarity);
        uint256 durationMult = getDurationMultiplier(stakeInfo.duration);
        
        // Calculate: (baseRate per day) × (time in days) × rarityMult × durationMult
        uint256 rewards = (baseRate * timeStaked * rarityMult * durationMult) / (1 days * 100 * 100);
        
        return rewards;
    }
    
    /**
     * @dev Get rarity multiplier (in basis points: 100 = 1.0x)
     */
    function getRarityMultiplier(string memory rarity) public pure returns (uint256) {
        bytes32 rarityHash = keccak256(abi.encodePacked(rarity));
        
        if (rarityHash == keccak256("Common")) return 100;       // 1.0x
        if (rarityHash == keccak256("Uncommon")) return 125;     // 1.25x
        if (rarityHash == keccak256("Rare")) return 150;         // 1.5x
        if (rarityHash == keccak256("Epic")) return 200;         // 2.0x
        if (rarityHash == keccak256("Legendary")) return 300;    // 3.0x
        if (rarityHash == keccak256("OneOfOne")) return 500;     // 5.0x (special for 1/1s)
        
        return 100; // Default 1.0x
    }
    
    /**
     * @dev Get duration multiplier (in basis points: 100 = 1.0x)
     */
    function getDurationMultiplier(Duration duration) public pure returns (uint256) {
        if (duration == Duration.SEVEN) return 100;       // 1.0x
        if (duration == Duration.FOURTEEN) return 125;    // 1.25x
        if (duration == Duration.THIRTY) return 150;      // 1.5x
        if (duration == Duration.SIXTY) return 200;       // 2.0x
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
    
    /**
     * @dev Get user's staked NFTs
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
        bool isStaked,
        string memory rarity
    ) {
        StakeInfo memory info = stakes[tokenId];
        return (
            info.owner,
            info.stakedAt,
            info.unlockTime,
            calculateRewards(tokenId),
            info.isStaked,
            tokenRarity[tokenId]
        );
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Set rarity for a single token
     */
    function setTokenRarity(uint256 tokenId, string memory rarity) external onlyOwner {
        tokenRarity[tokenId] = rarity;
        emit RaritySet(tokenId, rarity);
    }
    
    /**
     * @dev Batch set rarity for multiple tokens
     */
    function batchSetRarity(
        uint256[] calldata tokenIds,
        string[] calldata rarities
    ) external onlyOwner {
        require(tokenIds.length == rarities.length, "Length mismatch");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenRarity[tokenIds[i]] = rarities[i];
            emit RaritySet(tokenIds[i], rarities[i]);
        }
    }
    
    /**
     * @dev Update fees
     */
    function setFees(uint256 _stakeFee, uint256 _emergencyFee) external onlyOwner {
        stakeFee = _stakeFee;
        emergencyUnstakeFee = _emergencyFee;
        emit FeesUpdated(_stakeFee, _emergencyFee);
    }
    
    /**
     * @dev Update treasury wallet
     */
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid address");
        treasury = _treasury;
    }
    
    /**
     * @dev Update base rate for a rarity tier
     */
    function setBaseRate(string memory rarity, uint256 rate) external onlyOwner {
        baseRates[rarity] = rate;
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
    
    receive() external payable {}
}