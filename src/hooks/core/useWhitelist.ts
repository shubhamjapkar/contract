import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { adminAPI } from '../../services/adminAPI';
import { getContractService } from '../../services/blockchain/contractService';
import { toast } from 'sonner';
import { MintPhase, WhitelistStatus, WhitelistEntry } from '../../interface/api';
import {IWhitelistValidation} from "../../interface/IContracts.ts";

export function useWhitelist() {
    const { address, isConnected } = useAccount();

    const [whitelistStatus, setWhitelistStatus] = useState<WhitelistStatus | null>(null);
    const [validation, setValidation] = useState<IWhitelistValidation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastFetch, setLastFetch] = useState<number>(0);

    // Cache to avoid redundant API calls
    const cacheRef = useRef<Map<string, { data: WhitelistStatus; timestamp: number }>>(new Map());
    const CACHE_DURATION = 30000; // 30 seconds

    // Create provider for read-only contract operations
    const provider = useRef(
        new ethers.providers.JsonRpcProvider(
            import.meta.env.VITE_RPC_URL || ''
        )
    ).current;

    /**
     * Fetch whitelist status with caching
     */
    const fetchWhitelistStatus = useCallback(async (forceRefresh = false) => {
        if (!address) return;

        // Check cache first (unless forcing refresh)
        if (!forceRefresh) {
            const cached = cacheRef.current.get(address);
            if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                setWhitelistStatus(cached.data);
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            // Fetch both whitelist status and current phase in parallel
            const [status, currentPhase] = await Promise.all([
                adminAPI.getWhitelistStatus(address),
                getContractService(provider).getCurrentPhase()
            ]);

            // Cache the result
            cacheRef.current.set(address, {
                data: status,
                timestamp: Date.now()
            });

            setWhitelistStatus(status);
            setLastFetch(Date.now());

            // Filter entries for current phase
            const currentPhaseEntries = status.entries.filter(
                entry => entry.phaseId === currentPhase
            );

            // Calculate remaining allocations
            const validationData: IWhitelistValidation = {
                isWhitelisted: currentPhaseEntries.length > 0,
                currentPhase,
                entries: [],
            };

            for (const entry of currentPhaseEntries) {
                let alreadyMinted = 0;

                try {
                    if (entry.phaseId === MintPhase.CLAIM) {
                        alreadyMinted = await getContractService(provider).getClaimedPerTier(address, entry.tierId);
                    } else if (entry.phaseId === MintPhase.GUARANTEED) {
                        alreadyMinted = await getContractService(provider).getMintedPerTierPerPhase(address, entry.tierId, entry.phaseId);
                    } else if (entry.phaseId === MintPhase.FCFS) {
                        alreadyMinted = await getContractService(provider).getMintedPerTierPerPhase(address, entry.tierId, entry.phaseId);
                    }
                } catch (err) {
                    console.warn(`Failed to get minted count for tier ${entry.tierId}:`, err);
                    // Continue with 0 if we can't get the count
                }

                validationData.entries.push({
                    ...entry,
                    alreadyMinted,
                    remaining: Math.max(0, entry.allowedQuantity - alreadyMinted)
                });
            }

            setValidation(validationData);
        } catch (err) {
            console.log(err, "____err____")
            const message = err instanceof Error ? err.message : 'Failed to fetch whitelist status';
            setError(message);
            toast.error('Whitelist Check Failed', { description: message });
            console.error('Whitelist fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [address, provider]);

    /**
     * Get merkle proof with validation
     */
    const getMerkleProof = useCallback(async (
        tierId: number,
        phaseId: number,
        allowedQuantity: number
    ): Promise<string[]> => {
        if (!address) {
            throw new Error('Wallet not connected');
        }

        try {
            return await adminAPI.getMerkleProof(address, tierId, phaseId, allowedQuantity);
        } catch (error) {
            toast.error('Proof Generation Failed', { description: 'Failed to generate merkle proof for minting' });
            throw error;
        }
    }, [address]);

    /**
     * Check if user can mint specific quantities
     */
    const canMint = useCallback((tierQuantities: Map<number, number>): {
        canMint: boolean;
        errors: string[];
        totalQuantity: number;
    } => {
        const errors: string[] = [];
        let totalQuantity = 0;

        if (!validation?.isWhitelisted) {
            errors.push('Not whitelisted for current phase');
            return { canMint: false, errors, totalQuantity };
        }

        for (const [tierId, quantity] of tierQuantities) {
            const entry = validation.entries.find(e => e.tierId === tierId);

            if (!entry) {
                errors.push(`Not whitelisted for tier ${tierId}`);
                continue;
            }

            if (quantity > entry.remaining) {
                errors.push(`Insufficient allocation for tier ${tierId}: ${quantity} requested, ${entry.remaining} available`);
                continue;
            }

            totalQuantity += quantity;
        }

        return {
            canMint: errors.length === 0 && totalQuantity > 0,
            errors,
            totalQuantity,
        };
    }, [validation]);

    // Auto-fetch on address change
    useEffect(() => {
        if (isConnected && address) {
            fetchWhitelistStatus();
        } else {
            setWhitelistStatus(null);
            setValidation(null);
            setError(null);
        }
    }, [address, isConnected, fetchWhitelistStatus]);

    // Auto-refresh every 5 minutes
    useEffect(() => {
        if (!address) return;

        const interval = setInterval(() => {
            fetchWhitelistStatus();
        }, 300000); // 5 minutes

        return () => clearInterval(interval);
    }, [address, fetchWhitelistStatus]);

    return {
        whitelistStatus,
        validation,
        loading,
        error,
        lastFetch,
        canMint,
        refetch: () => fetchWhitelistStatus(true),
        getMerkleProof,
    };
}