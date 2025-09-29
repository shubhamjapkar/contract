import { useState, useEffect, useCallback } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { useNotifications } from './useNotifications.tsx';
import { CONFIG, baseSepolia } from '../../config/environment';

export function useNetworkRecovery() {
    const { chain } = useNetwork();
    const { switchNetwork, isLoading: isSwitching } = useSwitchNetwork();
    const { warning, error: notifyError, success } = useNotifications();

    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
    const [networkError, setNetworkError] = useState<string | null>(null);

    const checkNetwork = useCallback(() => {
        if (!chain) {
            setIsCorrectNetwork(false);
            setNetworkError('No network detected');
            return false;
        }

        const correct = chain.id === CONFIG.CHAIN_ID;
        setIsCorrectNetwork(correct);

        if (!correct) {
            setNetworkError(`Wrong network: ${chain.name}. Please switch to ${baseSepolia.name}.`);
        } else {
            setNetworkError(null);
        }

        return correct;
    }, [chain]);

    const switchToCorrectNetwork = useCallback(async () => {
        if (!switchNetwork) {
            notifyError(
                'Network Switch Unavailable',
                'Please manually switch to Base Sepolia in your wallet'
            );
            return false;
        }

        try {
            warning(
                'Switching Network',
                'Please approve the network switch in your wallet...'
            );

            await switchNetwork(CONFIG.CHAIN_ID);

            success(
                'Network Switched',
                'Successfully switched to Base Sepolia'
            );

            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to switch network';

            if (message.includes('rejected')) {
                warning(
                    'Network Switch Cancelled',
                    'Please manually switch to Base Sepolia to continue'
                );
            } else {
                notifyError('Network Switch Failed', message);
            }

            return false;
        }
    }, [switchNetwork, success, notifyError, warning]);

    useEffect(() => {
        checkNetwork();
    }, [checkNetwork]);

    return {
        isCorrectNetwork,
        networkError,
        isSwitching,
        switchToCorrectNetwork,
        checkNetwork
    };
}