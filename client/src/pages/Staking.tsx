"use client";

import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi, formatEther, parseEther } from 'viem';
import { useState, useEffect, useMemo } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { Wallet, Zap, TrendingUp, Trophy, Clock, X, AlertTriangle, ChevronRight, Layers } from "lucide-react";

// ── MAINNET CONTRACTS ───────────────────────────────────────────────────────
const SHACKO_NFT = '0x7f30f4b6d5C98D29E32cf013558A01443c87C013' as const;
const STAKING_CONTRACT = '0xCb5EA03fdEF2FfC793d2fF4811477f3c20d4Fda5' as const;
const SHACK_TOKEN = '0x2FbCa943BbD81FCCeaedFAdbb324Bba51Fc6A2E3' as const;

// ── ALCHEMY SETUP ───────────────────────────────────────────────────────────
const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
  network: Network.BASE_MAINNET,
});

// ── IPFS ──────────────────────────────────────────────────────────────────────
const IPFS_METADATA_BASE = 'https://gateway.lighthouse.storage/ipfs/bafybeifbjqcpmzdp7cu7elgegetznctxiwdibjdsjmlz7ck2lkfy3gzaey';

// ── ABIs ──────────────────────────────────────────────────────────────────────
const NFT_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function setApprovalForAll(address operator, bool approved)',
]);

const STAKING_ABI = parseAbi([
  'function stake(uint256 tokenId, uint8 duration) payable',
  'function stakeAll(uint256[] tokenIds, uint8 duration) payable',
  'function unstake(uint256 tokenId)',
  'function emergencyUnstake(uint256 tokenId) payable',
  'function claimRewards(uint256 tokenId)',
  'function claimAllRewards()',
  'function getUserStakes(address user) view returns (uint256[])',
  'function getStakeInfo(uint256 tokenId) view returns (address, uint256, uint8, uint256, uint256, bool)',
  'function tokenRarity(uint256 tokenId) view returns (string)',
  'function stakeFee() view returns (uint256)',
]);

const SHACK_ABI = parseAbi(['function balanceOf(address account) view returns (uint256)']);

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const rarityColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  'Common':    { bg: 'bg-slate-500/20',   text: 'text-slate-300',   border: 'border-slate-500/40',   glow: '' },
  'Uncommon':  { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40', glow: 'shadow-emerald-500/20' },
  'Rare':      { bg: 'bg-blue-500/20',    text: 'text-blue-300',    border: 'border-blue-500/40',    glow: 'shadow-blue-500/20' },
  'Epic':      { bg: 'bg-purple-500/20',  text: 'text-purple-300',  border: 'border-purple-500/40',  glow: 'shadow-purple-500/20' },
  'Legendary': { bg: 'bg-amber-500/20',   text: 'text-amber-300',   border: 'border-amber-500/40',   glow: 'shadow-amber-500/30' },
  'OneOfOne':  { bg: 'bg-rose-500/20',    text: 'text-rose-300',    border: 'border-rose-500/40',    glow: 'shadow-rose-500/30' },
};

const baseRateMap: Record<string, number> = {
  'Common': 10, 'Uncommon': 15, 'Rare': 20,
  'Epic': 40,   'Legendary': 70, 'OneOfOne': 100,
};

const rarityMultMap: Record<string, number> = {
  'Common': 100, 'Uncommon': 125, 'Rare': 150,
  'Epic': 200,   'Legendary': 300, 'OneOfOne': 500,
};

const DURATIONS = [
  { label: '7 Days',  multiplier: '1.0x',  icon: Zap,        mult: 100, value: 0 },
  { label: '14 Days', multiplier: '1.25x', icon: TrendingUp, mult: 125, value: 1 },
  { label: '30 Days', multiplier: '1.5x',  icon: Trophy,     mult: 150, value: 2 },
  { label: '60 Days', multiplier: '2.0x',  icon: Clock,      mult: 200, value: 3 },
];

function formatCountdown(secondsLeft: number): string {
  if (secondsLeft <= 0) return 'Unlocked';
  const d = Math.floor(secondsLeft / 86400);
  const h = Math.floor((secondsLeft % 86400) / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = Math.floor(secondsLeft % 60);
  if (d > 0) return `${d}D ${h}H ${m}M`;
  if (h > 0) return `${h}H ${m}M ${s}S`;
  return `${m}M ${s}S`;
}

// DurationModal component (same as before - paste your existing one here if you have it, or use the one from earlier messages)

// ── MAIN STAKING PAGE ───────────────────────────────────────────────────────
export default function Staking() {
  const { address, isConnected } = useAccount();
  const [stakeModalToken, setStakeModalToken] = useState<number | null>(null);
  const [showStakeAllModal, setShowStakeAllModal] = useState(false);

  // wagmi reads
  const { data: isApproved, refetch: refetchApproval } = useReadContract({
    address: SHACKO_NFT, abi: NFT_ABI, functionName: 'isApprovedForAll',
    args: address ? [address, STAKING_CONTRACT] : undefined,
  });

  const { data: stakedNFTs, refetch: refetchStaked } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'getUserStakes',
    args: address ? [address] : undefined,
  });

  const { data: shackBalance, refetch: refetchBalance } = useReadContract({
    address: SHACK_TOKEN, abi: SHACK_ABI, functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: stakeFee } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stakeFee',
  });

  // Alchemy: Auto fetch owned NFTs
  const [ownedTokenIds, setOwnedTokenIds] = useState<number[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);

  useEffect(() => {
    if (!address) {
      setOwnedTokenIds([]);
      return;
    }

    const fetchNFTs = async () => {
      setIsLoadingNFTs(true);
      try {
        const response = await alchemy.nft.getNftsForOwner(address, {
          contractAddresses: [SHACKO_NFT],
        });

        const ids = response.ownedNfts
          .map((nft: any) => Number(nft.tokenId))
          .sort((a: number, b: number) => a - b);

        setOwnedTokenIds(ids);
      } catch (error) {
        console.error("Alchemy NFT fetch error:", error);
        setOwnedTokenIds([]);
      } finally {
        setIsLoadingNFTs(false);
      }
    };

    fetchNFTs();
  }, [address]);

  const stakedSet = useMemo(() => new Set((stakedNFTs ?? []).map(Number)), [stakedNFTs]);
  const unstakedTokenIds = useMemo(() => ownedTokenIds.filter(id => !stakedSet.has(id)), [ownedTokenIds, stakedSet]);

  // Write hooks (add your existing writeContract and waitForTransactionReceipt logic here)

  const refetchAll = () => {
    refetchStaked();
    refetchBalance();
    refetchApproval();
  };

  // ... (handleApprove, handleStake, handleStakeAll, handleUnstake, handleClaim, etc. — use your existing handlers)

  return (
    <div className="min-h-screen bg-[#060b18] overflow-x-hidden">
      <Header />
      <main className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero + Stats Section - you can enhance this later */}
          {/* Staked Cards */}
          {stakedNFTs && stakedNFTs.length > 0 && (
            <div className="mb-12">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Staked SHACKOs ({stakedNFTs.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stakedNFTs.map((id) => (
                  <StakedNFTCard key={Number(id)} tokenId={Number(id)} /* pass your handlers */ />
                ))}
              </div>
            </div>
          )}

          {/* Unstaked Cards */}
          {isApproved && (
            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Available to Stake ({unstakedTokenIds.length})
              </h2>

              {isLoadingNFTs ? (
                <p className="text-gray-400">Loading your SHACKO NFTs...</p>
              ) : unstakedTokenIds.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {unstakedTokenIds.map((tokenId) => (
                    <UnstakedNFTCard
                      key={tokenId}
                      tokenId={tokenId}
                      onStake={(id) => setStakeModalToken(id)}
                      isStaking={false}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No unstaked SHACKO NFTs found in your wallet.</p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Duration Modal */}
      <Footer />
    </div>
  );
}