import React, { useState } from 'react';
import { useOwnerMint } from '../../hooks/core/useOwnerMint.ts';
import { MintPhase, PHASE_NAMES } from '../../interface/api.ts';
import { validateAddressInput } from '../../utils/validation/addressValidation.ts';
import { parseNumberInput } from '../../utils/numberFormatting.ts';
import { CONFIG } from '../../config/environment.ts';

export const OwnerInterface: React.FC = () => {
    const { isOwner, loading, currentPhase, ownerMint, updatePhase } = useOwnerMint();

    const [recipient, setRecipient] = useState('');
    const [tierSelections, setTierSelections] = useState<Map<number, number>>(new Map());
    const [newPhase, setNewPhase] = useState<MintPhase>(currentPhase);

    // Alternative: Could read available tiers from contract using useContractRead
    // const { data: maxTiers } = useContractRead({
    //   address: CONFIG.CINEFI_NFT_ADDRESS,
    //   abi: CineFiNFTABI,
    //   functionName: 'getMaxTierId', // If such function exists
    // });
    // const availableTiers = Array.from({ length: maxTiers || 5 }, (_, i) => i + 1);

    if (!isOwner) {
        return (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">Owner Interface</h2>
                <p className="text-gray-400">Access denied. You are not the contract owner.</p>
            </div>
        );
    }

    const handleTierQuantityChange = (tierId: number, quantity: string) => {
        const parsed = parseNumberInput(quantity);
        if (parsed.isValid && parsed.value !== null) {
            setTierSelections(prev => new Map(prev.set(tierId, parsed.value)));
        } else if (quantity === '') {
            setTierSelections(prev => {
                const newMap = new Map(prev);
                newMap.delete(tierId);
                return newMap;
            });
        }
    };

    const handleOwnerMint = async () => {
        const addressValidation = validateAddressInput(recipient);
        if (!addressValidation.isValid) {
            alert(addressValidation.error);
            return;
        }

        if (tierSelections.size === 0) {
            alert('Please select at least one tier with quantity');
            return;
        }

        const tierIds = Array.from(tierSelections.keys());
        const quantities = Array.from(tierSelections.values());

        await ownerMint({
            recipient: addressValidation.address!,
            tierIds,
            quantities
        });

        // Clear form on success
        setRecipient('');
        setTierSelections(new Map());
    };

    const handlePhaseUpdate = async () => {
        if (newPhase === currentPhase) {
            alert('Phase is already set to this value');
            return;
        }

        await updatePhase(newPhase);
    };

    return (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 space-y-6">
            <h2 className="text-2xl font-bold text-white">Owner Interface</h2>

            {/* Phase Management */}
            <div className="border border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Phase Management</h3>

                <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Current Phase</p>
                    <p className="text-white font-medium text-lg">
                        {PHASE_NAMES[currentPhase]} (Phase {currentPhase})
                    </p>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">
                        New Phase
                    </label>
                    <select
                        value={newPhase}
                        onChange={(e) => setNewPhase(parseInt(e.target.value) as MintPhase)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    >
                        <option value={MintPhase.CLOSED}>CLOSED (0)</option>
                        <option value={MintPhase.CLAIM}>CLAIM (1)</option>
                        <option value={MintPhase.GUARANTEED}>GUARANTEED (2)</option>
                        <option value={MintPhase.FCFS}>FCFS (3)</option>
                    </select>

                    <button
                        onClick={handlePhaseUpdate}
                        disabled={loading || newPhase === currentPhase}
                        className="w-full p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold"
                    >
                        {loading ? 'Updating...' : 'Update Phase'}
                    </button>
                </div>
            </div>

            {/* Owner Mint */}
            <div className="border border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Owner Mint</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Recipient Address
                        </label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="0x..."
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Tier Quantities
                        </label>
                        {/* Dynamic tier list - add/remove tiers in CONFIG.AVAILABLE_TIERS */}
                        <div className="grid grid-cols-2 gap-4">
                            {CONFIG.AVAILABLE_TIERS.map(tierId => (
                                <div key={tierId} className="space-y-1">
                                    <label className="text-xs text-gray-400">Tier {tierId}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={tierSelections.get(tierId) || ''}
                                        onChange={(e) => handleTierQuantityChange(tierId, e.target.value)}
                                        placeholder="0"
                                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleOwnerMint}
                        disabled={loading || !recipient || tierSelections.size === 0}
                        className="w-full p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-semibold"
                    >
                        {loading ? 'Minting...' : 'Execute Owner Mint'}
                    </button>
                </div>
            </div>
        </div>
    );
};