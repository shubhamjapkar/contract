import { configureChains, createConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { getDefaultWallets, connectorsForWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css'


const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('VITE_WALLET_CONNECT_PROJECT_ID is required in .env file');
}

// Custom chain configuration for Base Sepolia
const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
} as const;

// export const config = getDefaultConfig({
//   appName: 'CineFi NFT Platform',
//   projectId,
//   chains: [baseSepolia],
//   ssr: false, // For Vite
// });


const { chains, publicClient, webSocketPublicClient } = configureChains(
  [baseSepolia],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: 'https://sepolia.base.org',
      }),
    }),
    publicProvider(),
  ]
);


const { wallets } = getDefaultWallets({
  appName: 'CineFi NFT Platform',
  projectId,
  chains,
});

const connectors = connectorsForWallets([...wallets]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export default chains;