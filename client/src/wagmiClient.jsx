import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// Configure wagmi for Base
export const config = getDefaultConfig({
  appName: 'SHACKO Staking',
  projectId: '5393dc3f086ed3291abbe5c3a7901d04',
  chains: [base, baseSepolia],
  ssr: false,
});

// Create query client
const queryClient = new QueryClient();

// Wrapper component
export const WagmiWrapper = ({ children }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);