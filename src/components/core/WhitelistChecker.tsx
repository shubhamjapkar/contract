import React from 'react';
import {useAccount} from 'wagmi';
import { useWhitelist } from '../../hooks/core/useWhitelist.ts';
import { PHASE_CONFIG } from '../../constants/phases.ts';
import { formatNumber } from '../../utils/numberFormatting.ts';
import { formatRelativeTime } from '../../utils/dateFormatting.ts';
import { MintPhase } from '../../interface/api.ts';

export const WhitelistChecker: React.FC = () => {
    const { address, isConnected } = useAccount();
    const { validation, loading, error, lastFetch, refetch } = useWhitelist();

    if (!isConnected) {
        return (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 pt-[100px]">
                <h2 className="text-2xl font-bold text-white mb-4">Whitelist Status</h2>
                <p className="text-gray-400">Connect your wallet to check whitelist status</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 pt-[100px]">
                <h2 className="text-2xl font-bold text-white mb-4">Whitelist Status</h2>
                <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <p className="text-gray-400">Checking whitelist status...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">Whitelist Status</h2>
                <div className="bg-red-900 border border-red-600 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <span className="text-red-400 text-xl">❌</span>
                        <div className="flex-1">
                            <h4 className="text-red-400 font-semibold">Error Loading Whitelist</h4>
                            <p className="text-red-200 text-sm mt-1">{error}</p>
                            <button
                                onClick={() => refetch()}
                                className="mt-3 px-4 py-2 bg-red-800 hover:bg-red-700 text-red-200 rounded-lg text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!validation) {
        return (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">Whitelist Status</h2>
                <p className="text-gray-400">No whitelist data available</p>
            </div>
        );
    }

    const phaseConfig = PHASE_CONFIG[validation.currentPhase];
    const totalRemaining = validation.entries.reduce((sum, entry) => sum + entry.remaining, 0);

    return (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Whitelist Status</h2>
                <div className="flex items-center gap-3">
                    {lastFetch > 0 && (
                        <span className="text-xs text-gray-500">
              Updated {formatRelativeTime(lastFetch)}
            </span>
                    )}
                    <button
                        onClick={() => refetch()}
                        className="p-2 text-gray-400 hover:text-white"
                        title="Refresh whitelist status"
                    >
                        🔄
                    </button>
                </div>
            </div>

            {/* Whitelist Status Summary */}
            <div className={`p-4 rounded-lg border mb-6 ${
                validation.isWhitelisted
                    ? 'bg-green-900 border-green-600'
                    : 'bg-red-900 border-red-600'
            }`}>
                <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">
            {validation.isWhitelisted ? '✅' : '❌'}
          </span>
                    <div>
                        <h3 className={`text-lg font-semibold ${
                            validation.isWhitelisted ? 'text-green-400' : 'text-red-400'
                        }`}>
                            {validation.isWhitelisted ? 'Whitelisted' : 'Not Whitelisted'}
                        </h3>
                        <p className={`text-sm ${
                            validation.isWhitelisted ? 'text-green-200' : 'text-red-200'
                        }`}>
                            {validation.isWhitelisted
                                ? `You can mint ${formatNumber(totalRemaining)} NFT${totalRemaining !== 1 ? 's' : ''} in current phase`
                                : `You are not whitelisted for the current phase (${phaseConfig.name})`
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Tier Allocations */}
            {validation.isWhitelisted && validation.entries.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Your Allocations</h4>

                    {validation.entries.map((entry, index) => (
                        <div
                            key={`${entry.tierId}-${entry.phaseId}`}
                            className="bg-gray-800 rounded-lg p-4 border border-gray-600"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-white">Tier {entry.tierId}</h5>
                                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                      entry.remaining > 0
                          ? 'bg-green-900 text-green-400'
                          : 'bg-gray-700 text-gray-400'
                  }`}>
                    {entry.remaining > 0 ? 'Available' : 'Exhausted'}
                  </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-400">Allocated</p>
                                    <p className="text-white font-medium">
                                        {formatNumber(entry.allowedQuantity)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">
                                        {validation.currentPhase === MintPhase.CLAIM ? 'Claimed' : 'Minted'}
                                    </p>
                                    <p className="text-white font-medium">
                                        {formatNumber(entry.alreadyMinted)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Remaining</p>
                                    <p className="text-white font-medium">
                                        {formatNumber(entry.remaining)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};