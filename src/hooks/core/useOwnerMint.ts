import { useState, useCallback, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ethers } from 'ethers';
import { useNotifications } from '../infrastructure/useNotifications.tsx';

// @ts-ignore - ABI import
import CineFiNFTABI from '../../../src/abi/cinefi-nft-abi.json';
import {MintPhase} from "../../interface/api.ts";
import {CONFIG} from "../../config/environment.ts";

export interface OwnerMintParams {
    recipient: string;
    tierIds: number[];
    quantities: number[];
}

export function useOwnerMint() {
    const { address } = useAccount();
    const { success, error: notifyError, info } = useNotifications();
    const [loading, setLoading] = useState(false);

    // Check if current user is owner
    const { data: owner } = useContractRead({
        address: CONFIG.CINEFI_NFT_ADDRESS as `0x${string}`,
        abi: CineFiNFTABI,
        functionName: 'owner',
    });

    const isOwner = address && owner &&
        address.toLowerCase() === (owner as string).toLowerCase();

    // Get current phase
    const { data: currentPhaseData } = useContractRead({
        address: CONFIG.CINEFI_NFT_ADDRESS as `0x${string}`,
        abi: CineFiNFTABI,
        functionName: 'getCurrentPhase',
    });

    const currentPhase = currentPhaseData as MintPhase || MintPhase.CLOSED;

    // Phase update preparation
    const { config: phaseUpdateConfig } = usePrepareContractWrite({
        address: CONFIG.CINEFI_NFT_ADDRESS as `0x${string}`,
        abi: CineFiNFTABI,
        functionName: 'setCurrentPhase',
        args: [0], // Will be updated dynamically
        enabled: isOwner,
    });

    const { writeAsync: writePhaseUpdate } = useContractWrite(phaseUpdateConfig);

    // Owner mint preparation
    const { config: ownerMintConfig } = usePrepareContractWrite({
        address: CONFIG.CINEFI_NFT_ADDRESS as `0x${string}`,
        abi: CineFiNFTABI,
        functionName: 'ownerMint',
        args: ['0x0000000000000000000000000000000000000000', [], []], // Will be updated dynamically
        enabled: isOwner,
    });

    const { writeAsync: writeOwnerMint } = useContractWrite(ownerMintConfig);

    const updatePhase = useCallback(async (newPhase: MintPhase): Promise<boolean> => {
        if (!isOwner || !writePhaseUpdate) {
            notifyError('Access Denied', 'Only contract owner can update phase');
            return false;
        }

        setLoading(true);

        try {
            info('Updating Phase', `Changing mint phase to ${newPhase}...`);

            // @ts-ignore
            const tx = await writePhaseUpdate({
                recklesslySetUnpreparedArgs: [newPhase]
            });

            info('Transaction Submitted', 'Waiting for phase update confirmation...');

            // @ts-ignore
            const receipt = await tx.wait();

            if (receipt.status !== 1) {
                throw new Error('Phase update transaction failed');
            }

            success(
                'Phase Updated',
                `Successfully changed mint phase to ${newPhase}`,
                {
                    actions: [{
                        label: 'View Transaction',
                        action: () => window.open(`${CONFIG.BLOCK_EXPLORER}/tx/${tx.hash}`, '_blank'),
                    }]
                }
            );

            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Phase update failed';
            notifyError('Phase Update Failed', message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [isOwner, writePhaseUpdate, success, notifyError, info]);

    const ownerMint = useCallback(async (params: OwnerMintParams): Promise<boolean> => {
        if (!isOwner || !writeOwnerMint) {
            notifyError('Access Denied', 'Only contract owner can perform owner mint');
            return false;
        }

        const { recipient, tierIds, quantities } = params;

        setLoading(true);

        try {
            // Validate inputs
            if (!ethers.utils.isAddress(recipient)) {
                throw new Error('Invalid recipient address');
            }

            if (tierIds.length !== quantities.length) {
                throw new Error('Tier IDs and quantities arrays must have same length');
            }

            if (tierIds.length === 0) {
                throw new Error('At least one tier must be specified');
            }

            info('Owner Mint', 'Executing owner mint transaction...');

            // @ts-ignore
            const tx = await writeOwnerMint({
                recklesslySetUnpreparedArgs: [recipient, tierIds, quantities]
            });

            info('Transaction Submitted', 'Waiting for owner mint confirmation...');

            // @ts-ignore
            const receipt = await tx.wait();

            if (receipt.status !== 1) {
                throw new Error('Owner mint transaction failed');
            }

            const totalQuantity = quantities.reduce((sum, qty) => sum + qty, 0);

            success(
                'Owner Mint Successful',
                `Successfully minted ${totalQuantity} NFT${totalQuantity > 1 ? 's' : ''} to ${recipient}`,
                {
                    duration: 10000,
                    actions: [{
                        label: 'View Transaction',
                        action: () => window.open(`${CONFIG.BLOCK_EXPLORER}/tx/${tx.hash}`, '_blank'),
                    }]
                }
            );

            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Owner mint failed';
            notifyError('Owner Mint Failed', message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [isOwner, writeOwnerMint, success, notifyError, info]);

    return {
        isOwner: !!isOwner,
        loading,
        currentPhase,
        ownerMint,
        updatePhase
    };
}
