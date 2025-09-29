import React, { useState, useMemo } from 'react';
import { useContractReads } from 'wagmi';
import {ethers} from 'ethers';
import { MintPhase } from '../../interface/api.ts';
import { CONFIG } from '../../config/environment.ts';
// @ts-ignore - ABI import
import CineFiNFTABI from '../../abi/cinefi-nft-abi.json';
import {formatNumber, formatUSDC} from "../../utils/numberFormatting.ts";
import {validateQuantity} from "../../constants/validation.ts";

interface MintFormProps {
    validation: {
        isWhitelisted: boolean;
        currentPhase: MintPhase;
        entries: Array<{
            tierId: number;
            phaseId: number;
            allowedQuantity: number;
            alreadyMinted: number;
            remaining: number;
        }>;
    };
    selectedTiers: Map<number, number>;
    onTierSelect: (tiers: Map<number, number>) => void;
    onMint: (tierPrices?: ethers.BigNumber[]) => void; // Updated to pass tier prices
    isLoading: boolean;
    txHash: string | null;
}

export const MintForm: React.FC<MintFormProps> = ({
                                                      validation,
                                                      selectedTiers,
                                                      onTierSelect,
                                                      onMint,
                                                      isLoading,
                                                      txHash
                                                  }) => {
    const [errors, setErrors] = useState<Map<number, string>>(new Map());

    // Get tier information from contract
    const tierReadContracts = validation.entries.map(entry => ({
        address: CONFIG.CINEFI_NFT_ADDRESS as `0x${string}`,
        abi: CineFiNFTABI,
        functionName: 'getTier',
        args: [entry.tierId],
    }));

    const { data: tierData } = useContractReads({
        contracts: tierReadContracts as any,
        enabled: validation.entries.length > 0,
    });

    const handleQuantityChange = (tierId: number, value: string) => {
        const newErrors = new Map(errors);

        if (!value) {
            // Remove tier if quantity is empty
            const newSelections = new Map(selectedTiers);
            newSelections.delete(tierId);
            onTierSelect(newSelections);
            newErrors.delete(tierId);
            setErrors(newErrors);
            return;
        }

        const parsed = parseInt(value);
        const quantityValidation = validateQuantity(parsed);

        if (!quantityValidation.isValid) {
            newErrors.set(tierId, quantityValidation.error || 'Invalid quantity');
            setErrors(newErrors);
            return;
        }

        // Check against remaining allocation
        const entry = validation.entries.find(e => e.tierId === tierId);
        if (entry && parsed > entry.remaining) {
            newErrors.set(tierId, `Only ${entry.remaining} remaining`);
            setErrors(newErrors);
            return;
        }

        // Clear error and update selection
        newErrors.delete(tierId);
        setErrors(newErrors);

        const newSelections = new Map(selectedTiers);
        newSelections.set(tierId, parsed);
        onTierSelect(newSelections);
    };

    // Extract tier prices for USDC calculation (returns BigNumbers in same order as selected tiers)
    const getTierPricesForSelected = (): ethers.BigNumber[] => {
        const prices: ethers.BigNumber[] = [];
        const tierIds = Array.from(selectedTiers.keys());

        tierIds.forEach(tierId => {
            const tierIndex = validation.entries.findIndex(e => e.tierId === tierId);
            const tierInfo = tierData?.[tierIndex]?.result as any;
            if (tierInfo?.price) {
                prices.push(ethers.BigNumber.from(tierInfo.price));
            } else {
                // Fallback to zero if price not found
                prices.push(ethers.BigNumber.from(0));
            }
        });
        return prices;
    };

    const totalQuantity = Array.from(selectedTiers.values()).reduce((sum, qty) => sum + qty, 0);

    // Calculate total cost in BigNumber for precision (no format/parse round trip)
    const totalCostBigNumber = useMemo(() => {
        if (!tierData || validation.currentPhase === MintPhase.CLAIM) {
            return ethers.BigNumber.from(0);
        }

        let total = ethers.BigNumber.from(0);
        selectedTiers.forEach((quantity, tierId) => {
            const tierIndex = validation.entries.findIndex(e => e.tierId === tierId);
            const tierInfo = tierData?.[tierIndex]?.result as any;
            if (tierInfo?.price) {
                const cost = ethers.BigNumber.from(tierInfo.price).mul(quantity);
                total = total.add(cost);
            }
        });

        return total;
    }, [selectedTiers, tierData, validation.currentPhase, validation.entries]);

    // Format the BigNumber total for display only at the end
    const totalCostFormatted = useMemo(() => {
        if (totalCostBigNumber.isZero()) return 0;
        return parseFloat(ethers.utils.formatUnits(totalCostBigNumber, 6));
    }, [totalCostBigNumber]);

    const canMint = selectedTiers.size > 0 && errors.size === 0 && !isLoading;

    return (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Mint NFTs</h2>

            <div className="space-y-4 mb-6">
                {validation.entries.map((entry, index) => {
                    const tierInfo = tierData?.[index]?.result as any;
                    const quantity = selectedTiers.get(entry.tierId) || 0;
                    const hasError = errors.has(entry.tierId);

                    return (
                        <div
                            key={entry.tierId}
                            className={`border rounded-lg p-4 ${
                                hasError ? 'border-red-500' : 'border-gray-600'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {tierInfo?.name || `Tier ${entry.tierId}`}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span>Available: {formatNumber(entry.remaining)}</span>
                                        {validation.currentPhase !== MintPhase.CLAIM && tierInfo && (
                                            <span>Price: {formatUSDC(tierInfo.price)}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <input
                                        type="number"
                                        min="0"
                                        max={entry.remaining}
                                        value={quantity || ''}
                                        onChange={(e) => handleQuantityChange(entry.tierId, e.target.value)}
                                        className={`w-20 p-2 bg-gray-800 border rounded text-white text-center ${
                                            hasError ? 'border-red-500' : 'border-gray-600'
                                        }`}
                                        placeholder="0"
                                    />
                                    {hasError && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.get(entry.tierId)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Progress bar showing remaining allocation */}
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{
                                        width: `${((entry.allowedQuantity - entry.remaining) / entry.allowedQuantity) * 100}%`
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>Used: {formatNumber(entry.alreadyMinted)}</span>
                                <span>Total: {formatNumber(entry.allowedQuantity)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary */}
            {totalQuantity > 0 && (
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-2">Summary</h4>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total NFTs:</span>
                            <span className="text-white font-medium">{formatNumber(totalQuantity)}</span>
                        </div>
                        {validation.currentPhase !== MintPhase.CLAIM && totalCostFormatted > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Cost:</span>
                                <span className="text-white font-medium">${formatNumber(totalCostFormatted.toFixed(2))}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-400">Phase:</span>
                            <span className="text-white font-medium">
                {validation.currentPhase === MintPhase.CLAIM ? 'FREE CLAIM' : 'PAID MINT'}
              </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Mint Button */}
            <button
                onClick={() => onMint(getTierPricesForSelected())}
                disabled={!canMint}
                className={`w-full p-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    canMint
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Processing...
                    </div>
                ) : totalQuantity === 0 ? (
                    'Select NFTs to Mint'
                ) : validation.currentPhase === MintPhase.CLAIM ? (
                    `Claim ${totalQuantity} NFT${totalQuantity > 1 ? 's' : ''} (FREE)`
                ) : (
                    `Mint ${totalQuantity} NFT${totalQuantity > 1 ? 's' : ''} (${formatNumber(totalCostFormatted.toFixed(2))})`
                )}
            </button>

            {/* Transaction Hash */}
            {txHash && (
                <div className="mt-4 p-3 bg-blue-900 border border-blue-600 rounded-lg">
                    <p className="text-blue-200 text-sm">
                        Transaction submitted:
                        <a
                            href={`${CONFIG.BLOCK_EXPLORER}/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 ml-2 underline"
                        >
                            {txHash.slice(0, 10)}...{txHash.slice(-8)}
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
};