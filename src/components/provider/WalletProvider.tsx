import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { RainbowKitProvider, getDefaultWallets, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit';
import { injectedWallet, metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';

import '@rainbow-me/rainbowkit/styles.css';
import { CONFIG, baseSepolia } from '../../config/environment.ts';
import {ethers} from "ethers";
import {getContractService} from "../../services/blockchain/contractService.ts";
import moment from "moment/moment";
import {MintPhase} from "../../interface/api.ts";

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

const WalletContext = createContext<{
    nftLoading: boolean,
    setNftLoading: (arg: boolean) => void,
    activeProject: any | null;
    setActiveProject: (arg: any) => void;
    provider: any;
    currentPhase: MintPhase,
    refetchCurrentPhase: () => void,
    mintStatus: number,
    setMintStatus: (arg: number) => void
}>(undefined);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
    const [nftLoading, setNftLoading] = useState(true);
    const [activeProject, setActiveProject] = useState(null);
    const [currentPhase, setCurrentPhase] = useState<MintPhase | null>(null)
    const [mintStatus, setMintStatus] = useState(-1)
    const today = moment();

    const provider = useRef(
        new ethers.providers.JsonRpcProvider(
            import.meta.env.VITE_RPC_URL || ''
        )
    ).current;


    async function refetchCurrentPhase() {
        setCurrentPhase(await getContractService(provider).getCurrentPhase())
    }

    useEffect(() => {
        if (provider) {
            refetchCurrentPhase()
        }
    }, [provider])


    useEffect(() => {
        if (!activeProject || !setMintStatus) {
            return;
        }

        const start = moment(activeProject.startData, "DD/MM/YYYY");
        const end = moment(activeProject.endDate, "DD/MM/YYYY");

        if (today.isBefore(start, "day")) {
            setMintStatus(1);
        } else if (today.isAfter(end, "day")) {
            setMintStatus(3);
        } else {
            setMintStatus(2);
        }
    }, [activeProject, setMintStatus])

    useEffect(() => {
        if (activeProject && currentPhase !== null) {
            setNftLoading(false)
        } else {
            setNftLoading(true)
        }
    }, [activeProject, currentPhase]);

    return (
        <WalletContext value={{
            nftLoading,
            setNftLoading,
            activeProject,
            setActiveProject,
            provider,
            currentPhase,
            refetchCurrentPhase,
            mintStatus,
            setMintStatus
        }}>
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
        </WalletContext>
    );
};
