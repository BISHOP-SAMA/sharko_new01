import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { sepolia, mainnet } from 'wagmi/chains';

const { chains, provider } = configureChains(
  [sepolia, mainnet], // Replace sepolia with BaseSepolia if needed
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Shacko Staking',
  chains
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

export const WagmiWrapper = ({ children }) => (
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      {children}
    </RainbowKitProvider>
  </WagmiConfig>
);