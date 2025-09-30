import {useState, useCallback, useRef} from 'react';
import {
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useContractRead,
    usePublicClient,
    useWalletClient
} from 'wagmi';
import { ethers } from 'ethers';
import { useWhitelist } from './useWhitelist';
import { useNotifications } from '../infrastructure/useNotifications.tsx';
import { CONFIG } from '../../config/environment';
// @ts-ignore - ABI imports
import CineFiNFTABI from '../../../src/abi/cinefi-nft-abi.json';
import USDCABI from '../../abi/usdc-abi.json';
import {MintPhase, MintTransaction } from '../../interface/api';
import {parseNFTMintTransaction} from "../../services/blockchain/transactionParser.ts";
import {getContractService} from "../../services/blockchain/contractService.ts";

function walletClientToSigner(walletClient: any) {
    if (!walletClient) return null;

    const { account, chain, transport } = walletClient;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new ethers.providers.Web3Provider(transport, network);
    const signer = provider.getSigner(account.address);
    return signer;
}

export interface MintParams {
    tierIds: number[];
    quantities: number[];
    merkleProofs: string[][];
    tierPrices?: ethers.BigNumber[]; // Add tier prices for USDC calculation
}

export function useMinting() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const { validation, getMerkleProof, refetch } = useWhitelist();
    const { success, error: notifyError, info, warning } = useNotifications();

    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    const provider = useRef(
        new ethers.providers.JsonRpcProvider(
            import.meta.env.VITE_BASE_SEPOLIA_RPC || ''
        )
    ).current;

    // Check USDC balance and allowance
    const { data: usdcBalance } = useContractRead({
        address: CONFIG.USDC_ADDRESS as `0x${string}`,
        abi: USDCABI,
        functionName: 'balanceOf',
        args: [address],
        enabled: !!address,
    });

    const { data: usdcAllowance } = useContractRead({
        address: CONFIG.USDC_ADDRESS as `0x${string}`,
        abi: USDCABI,
        functionName: 'allowance',
        args: [address, CONFIG.CINEFI_NFT_ADDRESS],
        enabled: !!address,
    });

    // USDC approval setup (will be configured dynamically)
    const { config: approvalConfig } = usePrepareContractWrite({
        address: CONFIG.USDC_ADDRESS as `0x${string}`,
        abi: USDCABI,
        functionName: 'approve',
        args: [CONFIG.CINEFI_NFT_ADDRESS, ethers.BigNumber.from(0)],
        enabled: false, // Only enabled when needed
    });

    const { writeAsync: approveUSDC } = useContractWrite(approvalConfig);

    // Mint setup (claim)
    const { config: claimConfig } = usePrepareContractWrite({
        address: CONFIG.CINEFI_NFT_ADDRESS as `0x${string}`,
        abi: CineFiNFTABI,
        functionName: 'getTotalTiers',
        args: [address, CONFIG.CINEFI_NFT_ADDRESS],
        enabled: false,
    });


    console.log(claimConfig, "___claimConfig___")
    const { writeAsync: claimNFT } = useContractWrite(claimConfig);

    // Mint setup (paid)
    const { config: mintConfig } = usePrepareContractWrite({
        address: CONFIG.CINEFI_NFT_ADDRESS as `0x${string}`,
        abi: CineFiNFTABI,
        functionName: 'mintTier',
        args: [[], [], []], // Will be set dynamically
        enabled: false, // Only enabled when ready to mint
    });

    const { writeAsync: mintTier } = useContractWrite(mintConfig);

    /**
     * Calculate total cost for paid minting
     */
    const calculateTotalCost = useCallback((tierIds: number[], quantities: number[], tierPrices: ethers.BigNumber[]) => {
        let total = ethers.BigNumber.from(0);

        for (let i = 0; i < tierIds.length; i++) {
            const cost = tierPrices[i].mul(quantities[i]);
            total = total.add(cost);
        }

        return total;
    }, []);

    /**
     * Execute mint with USDC approval handling
     */
    const mint = useCallback(async (params: MintParams): Promise<MintTransaction> => {
        if (!address || !validation) {
            throw new Error('Not ready to mint: wallet not connected or whitelist not loaded');
        }

        const { tierIds, quantities, merkleProofs } = params;
        const isClaimPhase = validation.currentPhase === MintPhase.CLAIM;

        setTxHash(null);
        setLoading(true);

        try {
            info('Mint Started', 'Preparing your mint transaction...');

            // Validate inputs
            if (tierIds.length !== quantities.length || tierIds.length !== merkleProofs.length) {
                throw new Error('Array lengths must match');
            }

            // For paid phases (GUARANTEED/FCFS), handle USDC approval
            if (!isClaimPhase) {
                // Calculate exact total cost from tier prices
                if (!params.tierPrices || params.tierPrices.length !== tierIds.length) {
                    throw new Error('Tier prices required for paid minting phases');
                }

                const totalCost = calculateTotalCost(tierIds, quantities, params.tierPrices);

                const currentAllowance = usdcAllowance as ethers.BigNumber || ethers.BigNumber.from(0);
                const currentBalance = usdcBalance as ethers.BigNumber || ethers.BigNumber.from(0);

                // Check balance
                if (currentBalance.lt(totalCost)) {
                    throw new Error(`Insufficient USDC balance. Need ${ethers.utils.formatUnits(totalCost, 6)} USDC`);
                }

                // Check and handle allowance
                if (currentAllowance.lt(totalCost)) {
                    if (!approveUSDC) {
                        throw new Error('USDC approval not available');
                    }

                    warning(
                        'USDC Approval Required',
                        `Please approve ${ethers.utils.formatUnits(totalCost, 6)} USDC spending in the next transaction`
                    );

                    info('USDC Approval', 'Approving USDC spending...');

                    // @ts-ignore
                    const approveTx = await approveUSDC({
                        recklesslySetUnpreparedArgs: [CONFIG.CINEFI_NFT_ADDRESS, totalCost]
                    });

                    info('Approval Submitted', 'Waiting for USDC approval confirmation...');
                    // @ts-ignore
                    const approvalReceipt = await approveTx.wait();

                    if (approvalReceipt.status !== 1) {
                        throw new Error('USDC approval failed');
                    }

                    success('USDC Approved', `${ethers.utils.formatUnits(totalCost, 6)} USDC spending approved successfully`);
                }
            }

            // Execute the appropriate mint function
            let tx: any;

            if (isClaimPhase) {
                // if (!claimNFT) throw new Error('Claim function not available');

                info('Claiming NFTs', 'Executing claim transaction...');

                // @ts-ignore
                // tx = await claimNFT({
                //     recklesslySetUnpreparedArgs: [tierIds, quantities, merkleProofs]
                // });

                const signer = walletClientToSigner(walletClient);
                if (!signer) throw new Error('Signer not available');

                tx = await getContractService(provider).claimNFT(signer, tierIds, quantities, merkleProofs);
            } else {
                if (!mintTier) throw new Error('Mint function not available');

                info('Minting NFTs', 'Executing mint transaction...');

                // @ts-ignore
                tx = await mintTier({
                    recklesslySetUnpreparedArgs: [tierIds, quantities, merkleProofs]
                });
            }

            setTxHash(tx.hash);

            info('Transaction Submitted', `Transaction hash: ${tx.hash.slice(0, 10)}...`, {
                actions: [{
                    label: 'View on Explorer',
                    action: () => window.open(`${CONFIG.BLOCK_EXPLORER}/tx/${tx.hash}`, '_blank'),
                }],
            });

            // Wait for confirmation
            const receipt = await tx.wait();

            if (receipt.status !== 1) {
                throw new Error('Transaction failed during execution');
            }

            // Parse minted token IDs from transaction logs
            const tokenIds = await parseNFTMintTransaction(tx.hash, publicClient);

            // Refresh whitelist status
            refetch();

            const totalMinted = quantities.reduce((sum, qty) => sum + qty, 0);
            success(
                'Mint Successful!',
                `Successfully ${isClaimPhase ? 'claimed' : 'minted'} ${totalMinted} NFT${totalMinted > 1 ? 's' : ''} across ${tierIds.length} tier${tierIds.length > 1 ? 's' : ''}`,
                {
                    duration: 10000,
                    actions: [{
                        label: 'View Transaction',
                        action: () => window.open(`${CONFIG.BLOCK_EXPLORER}/tx/${tx.hash}`, '_blank'),
                    }],
                    metadata: { tokenIds } // Include token IDs in notification metadata
                }
            );

            return {
                success: true,
                txHash: tx.hash,
                tokenIds, // Return actual parsed token IDs
            };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';

            notifyError(
                'Mint Failed',
                errorMessage,
                {
                    duration: 10000,
                    actions: txHash ? [{
                        label: 'View Transaction',
                        action: () => window.open(`${CONFIG.BLOCK_EXPLORER}/tx/${txHash}`, '_blank'),
                    }] : undefined,
                }
            );

            throw err;
        } finally {
            setLoading(false);
        }
    }, [
        address,
        validation,
        walletClient,
        usdcBalance,
        usdcAllowance,
        approveUSDC,
        claimNFT,
        mintTier,
        calculateTotalCost,
        refetch,
        success,
        notifyError,
        info,
        warning,
        publicClient,
        provider
    ]);

    return {
        mint,
        loading,
        txHash,
        isLoading: loading,
        usdcBalance,
        usdcAllowance
    };
}