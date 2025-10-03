import React, { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { ethers } from 'ethers';
import { CONFIG } from '../../config/environment.ts';
import { useWhitelist } from '../../hooks/core/useWhitelist.ts';
import { useMinting } from '../../hooks/core/useMinting.ts';
import { useNotifications } from '../../hooks/infrastructure/useNotifications.tsx';
import { PHASE_NAMES, PHASE_DESCRIPTIONS } from '../../interface/api.ts';
import { NotificationCenter } from '../feedback/NotificationCenter.tsx';
import { useOwnerMint } from '../../hooks/core/useOwnerMint.ts';
import { SystemHealth } from '../feedback/SystemHealth.tsx';
import { MintForm } from '../forms/MintForm.tsx';
import { OwnerInterface } from './OwnerInterface.tsx';
import { WhitelistChecker } from './WhitelistChecker.tsx';
import apiHandler from "../../services/apiHandler.ts";
import { ConnectButton } from '@rainbow-me/rainbowkit';

function CustomConnect() {
    const [lastConnectedState, setLastConnectedState] = useState<{connected: boolean, account: any, chain: any} | any>(null);
    const [processedAccounts, setProcessedAccounts] = useState<Set<string>>(new Set());

    // Function to check user and create if needed
    const handleUserCheck = async (account: any, chain: any) => {
        if (!account?.address) return;

        const walletId = account.address;

        // Avoid processing the same account multiple times
        if (processedAccounts.has(walletId)) return;
        setProcessedAccounts(prev => new Set(prev).add(walletId));

        console.log('🔍 Checking if user exists in database...');
        console.log('Wallet ID:', walletId);

        try {
            const userExists = await apiHandler.checkUserExists(walletId);

            if (userExists) {
                console.log('✅ User exists in database');
            } else {
                console.log('❌ User not found in database, creating new user...');

                // Extract balance information
                const balanceSymbol = chain?.name === 'Ethereum' ? 'ETH' : 'TOKEN';
                const displayBalance = account.balance || '0';

                console.log('📝 Creating user with data:');
                console.log('- Wallet ID:', walletId);
                console.log('- Balance Symbol:', balanceSymbol);
                console.log('- Display Balance:', displayBalance);

                const userCreated = await apiHandler.createUser(walletId, balanceSymbol, displayBalance);

                if (userCreated) {
                    console.log('🎉 New user created successfully!');
                } else {
                    console.error('💥 Failed to create user');
                }
            }
        } catch (error) {
            console.error('❌ Error during user check/creation:', error);
        }
    };

    return (
        <ConnectButton.Custom>
            {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                // Log wallet connection data when state changes
                const currentState = { connected, account, chain };
                if (JSON.stringify(currentState) !== JSON.stringify(lastConnectedState)) {
                    setLastConnectedState(currentState);

                    if (connected) {
                        console.log('🔗 WALLET CONNECTION DATA:');
                        console.log('==========================================');
                        console.log('Connected:', connected);
                        console.log('Ready:', ready);
                        console.log('Mounted:', mounted);

                        if (account) {
                            console.log('📱 ACCOUNT DATA:');
                            console.log('- Address:', account.address);
                            console.log('- Display Name:', account.displayName);
                            console.log('- ENS Name:', account.ensName);
                            console.log('- ENS Avatar:', account.ensAvatar);
                            console.log('- Has Pending Transactions:', account.hasPendingTransactions);
                            console.log('- Full Account Object:', account);
                        }

                        if (chain) {
                            console.log('⛓️ CHAIN DATA:');
                            console.log('- Chain ID:', chain.id);
                            console.log('- Chain Name:', chain.name);
                            console.log('- Has Icon:', chain.hasIcon);
                            console.log('- Icon URL:', chain.iconUrl);
                            console.log('- Icon Background:', chain.iconBackground);
                            console.log('- Unsupported:', chain.unsupported);
                            console.log('- Full Chain Object:', chain);
                        }

                        console.log('==========================================');

                        // Check user existence and create if needed
                        handleUserCheck(account, chain);
                    } else {
                        console.log('🔴 WALLET DISCONNECTED');
                        // Clear processed accounts when disconnected
                        setProcessedAccounts(new Set());
                    }
                }

                if (connected) {
                    return <button
                        onClick={openAccountModal}
                        className={"text-[12px] leading-[14px] font-medium uppercase py-[14px] px-[18px] text-[#EFEFEF] bg-transparent border border-[#4D4D53] cursor-pointer"}>
                        {account.displayName}
                    </button>
                }

                return <button onClick={openConnectModal} className={"text-[12px] leading-[14px] font-medium uppercase py-[14px] px-[18px] text-[#EFEFEF] bg-[#FE3D5B] whitespace-nowrap flex gap-1"}>
                    Connect
                    <span className={"hidden md:block"}>Wallet</span>
                </button>
            }}
        </ConnectButton.Custom>
    );
}

export const MintingInterface: React.FC = () => {
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { validation, loading: whitelistLoading, error: whitelistError, getMerkleProof } = useWhitelist();
    const { mint, loading: mintLoading, txHash } = useMinting();
    const { isOwner } = useOwnerMint();
    const { error: notifyError } = useNotifications();

    const [selectedTiers, setSelectedTiers] = useState<Map<number, number>>(new Map());
    const [showOwnerInterface, setShowOwnerInterface] = useState(false);

    // Network validation
    const isCorrectNetwork = chain?.id === CONFIG.CHAIN_ID;

    /**
     * Handle mint execution
     */
    const handleMint = async (tierPrices?: ethers.BigNumber[]) => {
        if (!validation || selectedTiers.size === 0) return;

        const tierIds = Array.from(selectedTiers.keys());
        const quantities = Array.from(selectedTiers.values());

        try {
            const merkleProofs: string[][] = [];
            const allocations: number[] = [];

            for (let i = 0; i < tierIds.length; i++) {
                const tierId = tierIds[i];
                const entry = validation.entries.find(e => e.tierId === tierId);

                if (!entry) {
                    throw new Error(`No whitelist entry found for tier ${tierId}`);
                }

                const proof = await getMerkleProof(
                    entry.tierId,
                    entry.phaseId,
                    entry.allowedQuantity
                );
                merkleProofs.push(proof);
                allocations.push(entry.allowedQuantity);
            }

            await mint({ tierIds, quantities, allocations, merkleProofs, tierPrices });
            setSelectedTiers(new Map());
        } catch (error) {
            console.error('Mint error:', error);
        }
    };

    /**
     * Render phase status with enhanced information
     */
    const renderPhaseStatus = () => {
        if (!validation) return null;

        const phaseName = PHASE_NAMES[validation.currentPhase];
        const phaseDescription = PHASE_DESCRIPTIONS[validation.currentPhase];

        const phaseColors = {
            0: 'text-red-400 bg-red-900/50 border-red-600',
            1: 'text-green-400 bg-green-900/50 border-green-600',
            2: 'text-blue-400 bg-blue-900/50 border-blue-600',
            3: 'text-purple-400 bg-purple-900/50 border-purple-600',
        };

        const colorClasses = phaseColors[validation.currentPhase] || phaseColors[0];

        return (
            <div className={`p-6 rounded-lg border ${colorClasses}`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">Current Phase</h3>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                            validation.currentPhase === 0 ? 'bg-red-400' :
                                validation.currentPhase === 1 ? 'bg-green-400 animate-pulse' :
                                    'bg-blue-400'
                        }`} />
                        <span className="text-sm font-medium text-gray-300">
              Phase {validation.currentPhase}
            </span>
                    </div>
                </div>

                <p className={`text-2xl font-bold mb-2 ${
                    validation.currentPhase === 0 ? 'text-red-400' :
                        validation.currentPhase === 1 ? 'text-green-400' :
                            'text-blue-400'
                }`}>
                    {phaseName}
                </p>

                <p className="text-gray-300 text-sm">
                    {phaseDescription}
                </p>

                {validation.currentPhase === 1 && (
                    <div className="mt-3 p-3 bg-green-800/30 rounded border border-green-600/50">
                        <p className="text-green-200 text-sm">
                            💡 Free claiming is active! No USDC payment required during this phase.
                        </p>
                    </div>
                )}
            </div>
        );
    };

    // Network error state
    if (!isCorrectNetwork && isConnected) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-[100px]">
                <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
                    <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-8 max-w-md text-center">
                        <div className="text-yellow-400 text-4xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Wrong Network</h2>
                        <p className="text-yellow-200 mb-6">
                            Please switch to <strong>Base Sepolia</strong> network to continue using CineFi NFT minting.
                        </p>
                        <div className="text-sm text-yellow-300 opacity-75">
                            Current network: {chain?.name || 'Unknown'}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (whitelistLoading && isConnected) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-[100px]">
                <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading whitelist status...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-[100px]">

            <div className={"flex justify-center items-center w-full"}>
                <CustomConnect/>
            </div>

            {/* Notification System */}
            <NotificationCenter />

            {/* System Health Indicator */}
            <SystemHealth />

            <div className="container mx-auto p-6 space-y-6 max-w-4xl">
                {/* Header */}
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
                    <h1 className="text-4xl font-bold text-white mb-3">
                        CineFi NFT Minting
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Multi-tier NFT collection with exclusive film investment benefits
                    </p>

                    {/* Connection status */}
                    {!isConnected && (
                        <div className="mt-4 p-4 bg-blue-900/50 border border-blue-600 rounded-lg">
                            <p className="text-blue-200">
                                Please connect your wallet to check whitelist status and mint NFTs.
                            </p>
                        </div>
                    )}
                </div>

                {/* Owner Controls */}
                {isOwner && (
                    <div className="bg-purple-900/50 border border-purple-600 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
                                    🛠️ Contract Owner Detected
                                </h3>
                                <p className="text-purple-200 text-sm">
                                    You have special owner privileges for administrative minting
                                </p>
                            </div>
                            <button
                                onClick={() => setShowOwnerInterface(!showOwnerInterface)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                    showOwnerInterface
                                        ? 'bg-purple-600 text-white shadow-lg'
                                        : 'bg-purple-800 text-purple-200 hover:bg-purple-700'
                                }`}
                            >
                                {showOwnerInterface ? 'Switch to User View' : 'Owner Interface'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                {showOwnerInterface && isOwner ? (
                    <OwnerInterface />
                ) : (
                    <>
                        {/* Whitelist Status */}
                        <WhitelistChecker />

                        {/* Phase Status */}
                        {renderPhaseStatus()}

                        {/* Minting Form */}
                        {validation && validation.isWhitelisted && validation.currentPhase !== 0 && (
                            <MintForm
                                validation={validation}
                                selectedTiers={selectedTiers}
                                onTierSelect={setSelectedTiers}
                                onMint={handleMint}
                                isLoading={mintLoading}
                                txHash={txHash}
                            />
                        )}

                        {/* Error Display */}
                        {whitelistError && (
                            <div className="bg-red-900/50 border border-red-600 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <span className="text-red-400 text-xl">❌</span>
                                    <div>
                                        <h4 className="text-red-400 font-semibold">Error Loading Whitelist</h4>
                                        <p className="text-red-200 text-sm mt-1">{whitelistError}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};