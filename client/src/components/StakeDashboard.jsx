import React, { useEffect, useState } from 'react';
import { useAccount, useSigner, useProvider } from 'wagmi';
import { ethers } from 'ethers';
import ShackoStakingABI from '../abis/ShackoStaking.json';
import SHACKTokenABI from '../abis/SHACKToken.json';

// Use env variables for contract addresses
const STAKING_ADDRESS = import.meta.env.VITE_STAKING_ADDRESS;
const SHACK_TOKEN_ADDRESS = import.meta.env.VITE_SHACK_TOKEN_ADDRESS;

export default function StakeDashboard() {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();

  const [userStakes, setUserStakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tokenIdInput, setTokenIdInput] = useState('');
  const [durationInput, setDurationInput] = useState(0);

  const stakingContract = new ethers.Contract(
    STAKING_ADDRESS,
    ShackoStakingABI,
    signer || provider
  );

  const shackTokenContract = new ethers.Contract(
    SHACK_TOKEN_ADDRESS,
    SHACKTokenABI,
    signer || provider
  );

  // Fetch user stakes
  const fetchUserStakes = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const stakes = await stakingContract.getUserStakes(address);
      setUserStakes(stakes.map(id => id.toNumber()));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserStakes();
  }, [address]);

  // Stake NFT
  const handleStake = async () => {
    if (!tokenIdInput || durationInput < 0) return alert('Invalid input');
    try {
      const tx = await stakingContract.stake(tokenIdInput, durationInput);
      await tx.wait();
      alert('NFT staked!');
      fetchUserStakes();
    } catch (err) {
      console.error(err);
      alert('Stake failed');
    }
  };

  // Claim rewards
  const handleClaim = async (tokenId) => {
    try {
      const tx = await stakingContract.claimRewards(tokenId);
      await tx.wait();
      alert('$SHACK claimed!');
    } catch (err) {
      console.error(err);
      alert('Claim failed');
    }
  };

  // Unstake NFT
  const handleUnstake = async (tokenId) => {
    try {
      const tx = await stakingContract.unstake(tokenId);
      await tx.wait();
      alert('NFT unstaked!');
      fetchUserStakes();
    } catch (err) {
      console.error(err);
      alert('Unstake failed');
    }
  };

  if (!isConnected) return <div>Please connect your wallet.</div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Shacko Staking Dashboard</h2>

      <div className="border p-4 rounded space-y-2">
        <h3 className="font-semibold">Stake a new NFT</h3>
        <input
          type="number"
          placeholder="Token ID"
          value={tokenIdInput}
          onChange={e => setTokenIdInput(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <select
          value={durationInput}
          onChange={e => setDurationInput(parseInt(e.target.value))}
          className="border p-2 rounded"
        >
          <option value={0}>7 days</option>
          <option value={1}>14 days</option>
          <option value={2}>30 days</option>
          <option value={3}>60 days</option>
        </select>
        <button
          onClick={handleStake}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Stake
        </button>
      </div>

      <div className="border p-4 rounded space-y-2">
        <h3 className="font-semibold">Your Staked NFTs</h3>
        {loading ? <p>Loading...</p> : userStakes.length === 0 ? <p>No NFTs staked.</p> :
          userStakes.map(tokenId => (
            <div key={tokenId} className="flex items-center justify-between border p-2 rounded">
              <span>NFT #{tokenId}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleClaim(tokenId)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Claim $SHACK
                </button>
                <button
                  onClick={() => handleUnstake(tokenId)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Unstake
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}