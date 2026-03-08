import { motion, AnimatePresence } from "framer-motion";
import { FloatingSharks } from "@/components/FloatingSharks";
import { Footer } from "@/components/Footer";
import MobileMenu from "@/components/MobileMenu";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi, formatEther, parseEther } from 'viem';
import { useState } from "react";

// Contract addresses (UPDATE AFTER DEPLOYMENT)
const SHACKO_NFT = '0x12940C944f56273EA27BA3271A4E7B04db426ca7';
const STAKING_CONTRACT = '0xYourStakingContractAddress'; // ← UPDATE THIS
const XSHACK_TOKEN = '0xYourXShackTokenAddress'; // ← UPDATE THIS

// ABIs
const NFT_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function setApprovalForAll(address operator, bool approved)',
]);

const STAKING_ABI = parseAbi([
  'function stake(uint256 tokenId, uint8 duration) payable',
  'function unstake(uint256 tokenId)',
  'function emergencyUnstake(uint256 tokenId) payable',
  'function claimRewards(uint256 tokenId)',
  'function getUserStakes(address user) view returns (uint256[])',
  'function getStakeInfo(uint256 tokenId) view returns (address owner, uint256 stakedAt, uint256 unlockTime, uint256 pendingRewards, bool isStaked, string rarity)',
  'function stakeFee() view returns (uint256)',
  'function emergencyUnstakeFee() view returns (uint256)',
]);

const XSHACK_ABI = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
]);

export default function Staking() {
  const { address, isConnected } = useAccount();
  const [selectedDuration, setSelectedDuration] = useState(0); // 0=7, 1=14, 2=30, 3=60
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);
  const [showStakeModal, setShowStakeModal] = useState(false);

  // Read user's NFT balance
  const { data: nftBalance } = useReadContract({
    address: SHACKO_NFT,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Check if approved
  const { data: isApproved } = useReadContract({
    address: SHACKO_NFT,
    abi: NFT_ABI,
    functionName: 'isApprovedForAll',
    args: address ? [address, STAKING_CONTRACT] : undefined,
  });

  // Get staked NFTs
  const { data: stakedNFTs, refetch: refetchStaked } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'getUserStakes',
    args: address ? [address] : undefined,
  });

  // Get xSHACK balance
  const { data: xShackBalance } = useReadContract({
    address: XSHACK_TOKEN,
    abi: XSHACK_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Get stake fee
  const { data: stakeFee } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'stakeFee',
  });

  // Write functions
  const { writeContract: approveContract, data: approveHash } = useWriteContract();
  const { writeContract: stakeNFT, data: stakeHash } = useWriteContract();
  const { writeContract: unstakeNFT, data: unstakeHash } = useWriteContract();
  const { writeContract: claimNFT, data: claimHash } = useWriteContract();

  // Wait for transactions
  const { isLoading: isApproving } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isStaking } = useWaitForTransactionReceipt({ hash: stakeHash });
  const { isLoading: isUnstaking } = useWaitForTransactionReceipt({ hash: unstakeHash });
  const { isLoading: isClaiming } = useWaitForTransactionReceipt({ hash: claimHash });

  const handleApprove = () => {
    approveContract({
      address: SHACKO_NFT,
      abi: NFT_ABI,
      functionName: 'setApprovalForAll',
      args: [STAKING_CONTRACT, true],
    });
  };

  const handleStake = () => {
    if (selectedNFT === null) return;
    
    stakeNFT({
      address: STAKING_CONTRACT,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [BigInt(selectedNFT), selectedDuration],
      value: stakeFee || parseEther('0.5'),
    });
    
    setShowStakeModal(false);
    setTimeout(() => refetchStaked(), 2000);
  };

  const handleUnstake = (tokenId: number) => {
    unstakeNFT({
      address: STAKING_CONTRACT,
      abi: STAKING_ABI,
      functionName: 'unstake',
      args: [BigInt(tokenId)],
    });
    
    setTimeout(() => refetchStaked(), 2000);
  };

  const handleClaim = (tokenId: number) => {
    claimNFT({
      address: STAKING_CONTRACT,
      abi: STAKING_ABI,
      functionName: 'claimRewards',
      args: [BigInt(tokenId)],
    });
  };

  const durations = [
    { days: 7, multiplier: '1.0x', label: '7 DAYS' },
    { days: 14, multiplier: '1.25x', label: '14 DAYS' },
    { days: 30, multiplier: '1.5x', label: '30 DAYS' },
    { days: 60, multiplier: '2.0x', label: '60 DAYS' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0ea5e9] via-[#38bdf8] to-[#7dd3fc] selection:bg-[#ec4899] selection:text-white overflow-x-hidden">
      <FloatingSharks />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0ea5e9]/90 backdrop-blur-md border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="text-4xl font-bold tracking-tight text-white">SHACKO</span>
          <MobileMenu />
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {!isConnected ? (
            <>
              {/* Header - Not Connected */}
              <div className="text-center mb-12 bg-white border-4 border-black p-8 rounded-3xl comic-shadow">
                <h1 className="text-6xl font-[Bangers] text-[#0ea5e9] text-stroke mb-4">FEED YOUR SHACKO</h1>
                <p className="text-xl font-bold text-slate-600">Stake your NFTs to earn xSHACK tokens!</p>
              </div>

              {/* How it Works */}
              <div className="mb-12 bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] border-4 border-black rounded-3xl p-8 comic-shadow">
                <h2 className="text-4xl font-[Bangers] text-white mb-8 text-center">How it works</h2>
                
                <div className="space-y-4">
                  <div className="bg-[#0f172a]/50 border-2 border-white/10 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#0ea5e9] flex items-center justify-center flex-shrink-0 border-2 border-white/20">
                        <span className="text-2xl font-bold text-white">1</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Choose an NFT</h3>
                        <p className="text-gray-300">Pick rarity, preview daily rate, and start a stake.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0f172a]/50 border-2 border-white/10 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#0ea5e9] flex items-center justify-center flex-shrink-0 border-2 border-white/20">
                        <span className="text-2xl font-bold text-white">2</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Lock duration</h3>
                        <p className="text-gray-300">Select 7, 14, 30, or 60 days. Higher commitment, steadier grind.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0f172a]/50 border-2 border-white/10 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#0ea5e9] flex items-center justify-center flex-shrink-0 border-2 border-white/20">
                        <span className="text-2xl font-bold text-white">3</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Claim anytime</h3>
                        <p className="text-gray-300">Track earned vs claimable and harvest xSHACK when you want.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-[#0ea5e9]/20 border-2 border-[#0ea5e9] rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Pro Tip</h4>
                      <p className="text-gray-300">Connect your wallet to see your active stakes instantly.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connect Wallet CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-4 border-black rounded-3xl p-16 comic-shadow text-center"
              >
                <div className="text-8xl mb-6">🦈</div>
                <h2 className="text-6xl font-[Bangers] text-[#0ea5e9] mb-4">CONNECT TO START STAKING!</h2>
                <p className="text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Connect your wallet to view your SHACKO NFTs and start earning xSHACK tokens!
                </p>
                <ConnectButton />
              </motion.div>
            </>
          ) : (
            <>
              {/* Dashboard Header - Connected */}
              <div className="text-center mb-8 bg-white border-4 border-black p-8 rounded-3xl comic-shadow">
                <h1 className="text-5xl md:text-6xl font-[Bangers] text-[#0ea5e9] text-stroke mb-4">STAKING DASHBOARD</h1>
                <p className="text-xl font-bold text-slate-600">Manage your staked SHACKO NFTs</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border-4 border-black rounded-2xl p-6 comic-shadow">
                  <p className="text-lg font-[Fredoka] text-gray-600 mb-2">Your NFTs</p>
                  <p className="text-5xl font-[Bangers] text-[#0ea5e9]">
                    {nftBalance ? nftBalance.toString() : '0'}
                  </p>
                </div>
                
                <div className="bg-white border-4 border-black rounded-2xl p-6 comic-shadow">
                  <p className="text-lg font-[Fredoka] text-gray-600 mb-2">Staked NFTs</p>
                  <p className="text-5xl font-[Bangers] text-[#ec4899]">
                    {stakedNFTs ? stakedNFTs.length : '0'}
                  </p>
                </div>
                
                <div className="bg-white border-4 border-black rounded-2xl p-6 comic-shadow">
                  <p className="text-lg font-[Fredoka] text-gray-600 mb-2">xSHACK Balance</p>
                  <p className="text-5xl font-[Bangers] text-[#10b981]">
                    {xShackBalance ? Math.floor(Number(formatEther(xShackBalance))) : '0'}
                  </p>
                </div>
              </div>

              {/* Approval Section */}
              {!isApproved && nftBalance && Number(nftBalance) > 0 && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-yellow-100 border-4 border-black rounded-2xl p-8 comic-shadow mb-8"
                >
                  <h3 className="text-3xl font-[Bangers] text-[#0ea5e9] mb-4">
                    ⚡ APPROVAL REQUIRED
                  </h3>
                  <p className="text-lg font-[Fredoka] mb-6">
                    Approve the staking contract to interact with your NFTs (one-time transaction).
                  </p>
                  <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="bg-[#0ea5e9] text-white px-8 py-4 rounded-xl font-[Bangers] text-xl border-4 border-black hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {isApproving ? 'APPROVING...' : 'APPROVE CONTRACT'}
                  </button>
                </motion.div>
              )}

              {/* Staked NFTs Section */}
              {stakedNFTs && stakedNFTs.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-4xl font-[Bangers] text-white text-center mb-6 text-stroke">
                    YOUR STAKED SHACKOS
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stakedNFTs.map((tokenId: bigint) => (
                      <StakedNFTCard 
                        key={tokenId.toString()} 
                        tokenId={Number(tokenId)}
                        onUnstake={handleUnstake}
                        onClaim={handleClaim}
                        isUnstaking={isUnstaking}
                        isClaiming={isClaiming}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Available NFTs Section */}
              {isApproved && nftBalance && Number(nftBalance) > 0 ? (
                <div>
                  <h2 className="text-4xl font-[Bangers] text-white text-center mb-6 text-stroke">
                    STAKE YOUR SHACKOS
                  </h2>
                  <div className="bg-white border-4 border-black rounded-2xl p-8 comic-shadow text-center">
                    <p className="text-2xl font-[Bangers] text-[#0ea5e9] mb-4">
                      NFT Gallery Coming Soon! 🦈
                    </p>
                    <p className="text-lg text-gray-600 mb-6">
                      We're building the NFT display. For now, you can stake using token IDs.
                    </p>
                    <button
                      onClick={() => setShowStakeModal(true)}
                      className="bg-[#0ea5e9] text-white px-8 py-4 rounded-xl font-[Bangers] text-xl border-4 border-black hover:scale-105 transition-transform"
                    >
                      STAKE NFT
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-4 border-black rounded-2xl p-16 comic-shadow text-center">
                  <p className="text-6xl mb-4">🦈</p>
                  <p className="text-3xl font-[Bangers] text-gray-400 mb-4">NO SHACKO NFTs FOUND</p>
                  <p className="text-xl text-gray-600">
                    You need SHACKO NFTs to start staking!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Stake Modal */}
      <AnimatePresence>
        {showStakeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowStakeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              className="bg-white rounded-3xl border-4 border-black comic-shadow-lg max-w-2xl w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-4xl font-[Bangers] text-[#0ea5e9] mb-6">STAKE YOUR SHACKO</h2>
              
              <div className="mb-6">
                <label className="block text-lg font-bold mb-2">Token ID:</label>
                <input
                  type="number"
                  value={selectedNFT || ''}
                  onChange={(e) => setSelectedNFT(Number(e.target.value))}
                  placeholder="Enter NFT Token ID"
                  className="w-full h-14 rounded-xl border-4 border-black px-4 text-xl"
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-bold mb-4">Choose Duration:</label>
                <div className="grid grid-cols-2 gap-4">
                  {durations.map((duration, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDuration(index)}
                      className={`p-4 rounded-xl border-4 border-black font-[Bangers] text-xl transition-all ${
                        selectedDuration === index
                          ? 'bg-[#ec4899] text-white scale-105'
                          : 'bg-white text-black hover:scale-105'
                      }`}
                    >
                      <div>{duration.label}</div>
                      <div className="text-sm opacity-75">{duration.multiplier} Bonus</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border-4 border-yellow-400 rounded-xl p-4 mb-6">
                <p className="text-lg font-bold text-center">
                  💰 Stake Fee: 0.5 BASE
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowStakeModal(false)}
                  className="flex-1 bg-gray-200 text-black px-6 py-4 rounded-xl font-[Bangers] text-xl border-4 border-black hover:scale-105 transition-transform"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleStake}
                  disabled={selectedNFT === null || isStaking}
                  className="flex-1 bg-[#0ea5e9] text-white px-6 py-4 rounded-xl font-[Bangers] text-xl border-4 border-black hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isStaking ? 'STAKING...' : 'STAKE NOW'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// Staked NFT Card Component
function StakedNFTCard({ 
  tokenId, 
  onUnstake, 
  onClaim,
  isUnstaking,
  isClaiming 
}: { 
  tokenId: number;
  onUnstake: (id: number) => void;
  onClaim: (id: number) => void;
  isUnstaking: boolean;
  isClaiming: boolean;
}) {
  const { data: stakeInfo } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'getStakeInfo',
    args: [BigInt(tokenId)],
  });

  if (!stakeInfo) return null;

  const [owner, stakedAt, unlockTime, pendingRewards, isStaked, rarity] = stakeInfo;
  const now = Date.now() / 1000;
  const isUnlocked = Number(unlockTime) <= now;
  const daysLeft = Math.max(0, Math.ceil((Number(unlockTime) - now) / 86400));

  const rarityColors: Record<string, string> = {
    'Common': 'from-gray-400 to-gray-600',
    'Uncommon': 'from-green-400 to-green-600',
    'Rare': 'from-blue-400 to-blue-600',
    'Epic': 'from-purple-400 to-purple-600',
    'Legendary': 'from-yellow-400 to-orange-500',
    'OneOfOne': 'from-pink-400 to-red-500',
  };

  return (
    <div className="bg-white border-4 border-black rounded-2xl p-6 comic-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-2xl font-[Bangers] text-[#0ea5e9]">SHACKO #{tokenId}</p>
          <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold text-white bg-gradient-to-r ${rarityColors[rarity] || rarityColors.Common}`}>
            {rarity}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Rewards</p>
          <p className="text-2xl font-[Bangers] text-[#10b981]">
            {Math.floor(Number(formatEther(pendingRewards)))} xSHACK
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">
          {isUnlocked ? '✅ Unlocked!' : `🔒 ${daysLeft} days remaining`}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-black">
          <div 
            className="bg-[#0ea5e9] h-full rounded-full transition-all"
            style={{ width: `${isUnlocked ? 100 : Math.min(100, ((now - Number(stakedAt)) / (Number(unlockTime) - Number(stakedAt))) * 100)}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onClaim(tokenId)}
          disabled={Number(pendingRewards) === 0 || isClaiming}
          className="flex-1 bg-[#10b981] text-white px-4 py-2 rounded-lg font-[Bangers] border-2 border-black hover:scale-105 transition-transform disabled:opacity-50 text-sm"
        >
          {isClaiming ? 'CLAIMING...' : 'CLAIM'}
        </button>
        <button
          onClick={() => onUnstake(tokenId)}
          disabled={!isUnlocked || isUnstaking}
          className="flex-1 bg-[#ec4899] text-white px-4 py-2 rounded-lg font-[Bangers] border-2 border-black hover:scale-105 transition-transform disabled:opacity-50 text-sm"
        >
          {isUnstaking ? 'UNSTAKING...' : 'UNSTAKE'}
        </button>
      </div>
    </div>
  );
}
