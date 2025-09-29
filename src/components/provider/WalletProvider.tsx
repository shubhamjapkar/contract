import React from 'react';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { RainbowKitProvider, getDefaultWallets, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit';
import { injectedWallet, metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';

import '@rainbow-me/rainbowkit/styles.css';
import { CONFIG, baseSepolia } from '../../config/environment.ts';

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [baseSepolia],
    [publicProvider()]
);

const projectId = CONFIG.WALLET_CONNECT_PROJECT_ID;

const { wallets } = getDefaultWallets({
    appName: CONFIG.APP_NAME,
    projectId,
    chains,
});

const connectors = connectorsForWallets([
    ...wallets,
    {
        groupName: 'Other',
        wallets: [
            injectedWallet({ chains }),
            metaMaskWallet({ projectId, chains }),
            walletConnectWallet({ projectId, chains }),
        ],
    },
]);

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
});

interface WalletProviderProps {
    children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider
                chains={chains}
                theme={darkTheme()}
                appInfo={{
                    appName: CONFIG.APP_NAME,
                    learnMoreUrl: 'https://cinefi.com',
                }}
            >
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
};
