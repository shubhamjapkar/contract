import React from 'react';
import { useNetwork } from 'wagmi';
import { CONFIG } from '../../config/environment.ts';

export const SystemHealth: React.FC = () => {
    const { chain } = useNetwork();

    const isCorrectNetwork = chain?.id === CONFIG.CHAIN_ID;

    return (
        <div className="fixed top-4 left-4 z-40">
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${
                    isCorrectNetwork ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span className="text-gray-300">
          {chain?.name || 'Not Connected'}
        </span>
            </div>
        </div>
    );
};