// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ISHACKToken {
    function balanceOf(address account) external view returns (uint256);
    function burn(address from, uint256 amount) external;
}

/**
 * @title ShackoMultiRaffle
 * @notice Multiple simultaneous NFT raffles with auto-draw when full
 * @dev Each raffle fills independently, 1 entry per person, auto-picks winner at max entries
 */
contract ShackoMultiRaffle is Ownable, ReentrancyGuard {
    
    ISHACKToken public shackToken;
    
    // Raffle struct
    struct Raffle {
        uint256 id;
        address nftContract;      // NFT contract address
        uint256 tokenId;          // NFT token ID
        uint256 maxEntries;       // Max entries (50, 100, etc.)
        uint256 entryCost;        // Cost in $SHACK (e.g., 100 * 1e18)
        uint256 currentEntries;   // Current entry count
        address[] participants;   // All entries
        mapping(address => bool) hasEntered;  // Track if user entered
        address winner;           // Winner address
        bool isActive;            // Open for entries
        bool isComplete;          // Winner picked
        uint256 createdAt;        // Creation timestamp
    }
    
    // Storage
    uint256 public raffleCounter;
    mapping(uint256 => Raffle) public raffles;
    
    // Events
    event RaffleCreated(
        uint256 indexed raffleId,
        address indexed nftContract,
        uint256 tokenId,
        uint256 maxEntries,
        uint256 entryCost
    );
    event RaffleEntered(
        uint256 indexed raffleId,
        address indexed participant,
        uint256 entryNumber
    );
    event RaffleFilled(uint256 indexed raffleId, uint256 totalEntries);
    event WinnerPicked(
        uint256 indexed raffleId,
        address indexed winner,
        address nftContract,
        uint256 tokenId
    );
    event RaffleCancelled(uint256 indexed raffleId);
    
    constructor(address _shackToken) Ownable(msg.sender) {
        shackToken = ISHACKToken(_shackToken);
        raffleCounter = 1;
    }
    
    /**
     * @notice Create a new NFT raffle
     * @param nftContract Address of NFT contract (must be on Base)
     * @param tokenId Token ID to raffle
     * @param maxEntries Maximum entries (e.g., 50, 100)
     * @param entryCost Cost per entry in $SHACK (in wei, e.g., 100 * 1e18)
     */
    function createRaffle(
        address nftContract,
        uint256 tokenId,
        uint256 maxEntries,
        uint256 entryCost
    ) external onlyOwner returns (uint256) {
        require(nftContract != address(0), "Invalid NFT contract");
        require(maxEntries > 0 && maxEntries <= 1000, "Invalid max entries");
        require(entryCost > 0, "Invalid entry cost");
        
        // Verify NFT ownership and transfer to contract
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        nft.transferFrom(msg.sender, address(this), tokenId);
        
        // Create raffle
        uint256 raffleId = raffleCounter++;
        Raffle storage raffle = raffles[raffleId];
        
        raffle.id = raffleId;
        raffle.nftContract = nftContract;
        raffle.tokenId = tokenId;
        raffle.maxEntries = maxEntries;
        raffle.entryCost = entryCost;
        raffle.currentEntries = 0;
        raffle.isActive = true;
        raffle.isComplete = false;
        raffle.createdAt = block.timestamp;
        
        emit RaffleCreated(raffleId, nftContract, tokenId, maxEntries, entryCost);
        
        return raffleId;
    }
    
    /**
     * @notice Enter a raffle (burns $SHACK)
     * @param raffleId ID of raffle to enter
     */
    function enterRaffle(uint256 raffleId) external nonReentrant {
        Raffle storage raffle = raffles[raffleId];
        
        require(raffle.isActive, "Raffle not active");
        require(!raffle.isComplete, "Raffle already complete");
        require(!raffle.hasEntered[msg.sender], "Already entered this raffle");
        require(raffle.currentEntries < raffle.maxEntries, "Raffle full");
        require(
            shackToken.balanceOf(msg.sender) >= raffle.entryCost,
            "Insufficient $SHACK"
        );
        
        // Burn $SHACK entry cost
        shackToken.burn(msg.sender, raffle.entryCost);
        
        // Add entry
        raffle.participants.push(msg.sender);
        raffle.hasEntered[msg.sender] = true;
        raffle.currentEntries++;
        
        emit RaffleEntered(raffleId, msg.sender, raffle.currentEntries);
        
        // Check if raffle is now full
        if (raffle.currentEntries == raffle.maxEntries) {
            _drawWinner(raffleId);
        }
    }
    
    /**
     * @notice Internal function to pick winner and transfer NFT
     * @param raffleId ID of raffle to draw
     */
    function _drawWinner(uint256 raffleId) internal {
        Raffle storage raffle = raffles[raffleId];
        
        require(raffle.currentEntries == raffle.maxEntries, "Not full yet");
        require(!raffle.isComplete, "Already drawn");
        
        emit RaffleFilled(raffleId, raffle.currentEntries);
        
        // Generate pseudo-random number
        // NOTE: For production, use Chainlink VRF for true randomness
        uint256 randomIndex = _generateRandom(raffleId) % raffle.currentEntries;
        address winner = raffle.participants[randomIndex];
        
        // Update state
        raffle.winner = winner;
        raffle.isActive = false;
        raffle.isComplete = true;
        
        // Transfer NFT to winner
        IERC721(raffle.nftContract).transferFrom(
            address(this),
            winner,
            raffle.tokenId
        );
        
        emit WinnerPicked(raffleId, winner, raffle.nftContract, raffle.tokenId);
    }
    
    /**
     * @notice Generate pseudo-random number
     * @dev NOT cryptographically secure - use Chainlink VRF for production
     */
    function _generateRandom(uint256 raffleId) internal view returns (uint256) {
        return uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    raffleId,
                    raffles[raffleId].currentEntries
                )
            )
        );
    }
    
    /**
     * @notice Get raffle details
     */
    function getRaffleInfo(uint256 raffleId) external view returns (
        address nftContract,
        uint256 tokenId,
        uint256 maxEntries,
        uint256 currentEntries,
        uint256 entryCost,
        bool isActive,
        bool isComplete,
        address winner
    ) {
        Raffle storage raffle = raffles[raffleId];
        return (
            raffle.nftContract,
            raffle.tokenId,
            raffle.maxEntries,
            raffle.currentEntries,
            raffle.entryCost,
            raffle.isActive,
            raffle.isComplete,
            raffle.winner
        );
    }
    
    /**
     * @notice Check if user has entered a specific raffle
     */
    function hasUserEntered(uint256 raffleId, address user) external view returns (bool) {
        return raffles[raffleId].hasEntered[user];
    }
    
    /**
     * @notice Get all participants for a raffle
     */
    function getRaffleParticipants(uint256 raffleId) external view returns (address[] memory) {
        return raffles[raffleId].participants;
    }
    
    /**
     * @notice Get all active raffle IDs
     * @dev Returns array of active raffle IDs (for frontend)
     */
    function getActiveRaffles() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active raffles
        for (uint256 i = 1; i < raffleCounter; i++) {
            if (raffles[i].isActive && !raffles[i].isComplete) {
                activeCount++;
            }
        }
        
        // Build array
        uint256[] memory activeIds = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i < raffleCounter; i++) {
            if (raffles[i].isActive && !raffles[i].isComplete) {
                activeIds[index] = i;
                index++;
            }
        }
        
        return activeIds;
    }
    
    /**
     * @notice Get all completed raffle IDs
     */
    function getCompletedRaffles() external view returns (uint256[] memory) {
        uint256 completedCount = 0;
        
        // Count completed raffles
        for (uint256 i = 1; i < raffleCounter; i++) {
            if (raffles[i].isComplete) {
                completedCount++;
            }
        }
        
        // Build array
        uint256[] memory completedIds = new uint256[](completedCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i < raffleCounter; i++) {
            if (raffles[i].isComplete) {
                completedIds[index] = i;
                index++;
            }
        }
        
        return completedIds;
    }
    
    // Admin functions
    
    /**
     * @notice Cancel a raffle and return NFT to owner (emergency only)
     * @param raffleId ID of raffle to cancel
     */
    function cancelRaffle(uint256 raffleId) external onlyOwner {
        Raffle storage raffle = raffles[raffleId];
        
        require(raffle.isActive, "Raffle not active");
        require(!raffle.isComplete, "Already complete");
        require(raffle.currentEntries == 0, "Cannot cancel with entries");
        
        // Return NFT to owner
        IERC721(raffle.nftContract).transferFrom(
            address(this),
            owner(),
            raffle.tokenId
        );
        
        raffle.isActive = false;
        
        emit RaffleCancelled(raffleId);
    }
    
    /**
     * @notice Update $SHACK token address (if needed)
     */
    function setShackToken(address _shackToken) external onlyOwner {
        require(_shackToken != address(0), "Invalid address");
        shackToken = ISHACKToken(_shackToken);
    }
    
    /**
     * @notice Emergency withdraw stuck NFTs (only if raffle cancelled)
     */
    function emergencyWithdrawNFT(
        address nftContract,
        uint256 tokenId
    ) external onlyOwner {
        IERC721(nftContract).transferFrom(address(this), owner(), tokenId);
    }
}
