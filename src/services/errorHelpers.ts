import { ethers } from 'ethers';

export interface ErrorDetails {
    type: 'validation' | 'network' | 'contract' | 'api' | 'user' | 'unknown';
    code: string;
    message: string;
    originalError?: Error;
    metadata?: Record<string, any>;
}

export function parseError(error: unknown): ErrorDetails {
    if (error instanceof Error) {
        return parseErrorInstance(error);
    }

    return {
        type: 'unknown',
        code: 'UNKNOWN_ERROR',
        message: String(error) || 'An unknown error occurred',
        originalError: undefined
    };
}

function parseErrorInstance(error: Error): ErrorDetails {
    // Ethers.js errors
    if (error.message.includes('user rejected') || error.message.includes('User rejected')) {
        return {
            type: 'user',
            code: 'USER_REJECTED',
            message: 'Transaction was rejected by user',
            originalError: error
        };
    }

    if (error.message.includes('insufficient funds')) {
        return {
            type: 'validation',
            code: 'INSUFFICIENT_FUNDS',
            message: 'Insufficient funds for transaction',
            originalError: error
        };
    }

    if (error.message.includes('gas')) {
        return {
            type: 'contract',
            code: 'GAS_ERROR',
            message: 'Transaction failed due to gas issues',
            originalError: error
        };
    }

    // Contract execution errors
    if (error.message.includes('revert')) {
        return parseContractRevertError(error);
    }

    // Network errors
    if (error.message.includes('network') || error.message.includes('connection')) {
        return {
            type: 'network',
            code: 'NETWORK_ERROR',
            message: 'Network connection failed',
            originalError: error
        };
    }

    return {
        type: 'unknown',
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred',
        originalError: error
    };
}

function parseContractRevertError(error: Error): ErrorDetails {
    const message = error.message.toLowerCase();

    if (message.includes('exceeded') || message.includes('exceed')) {
        return {
            type: 'validation',
            code: 'ALLOCATION_EXCEEDED',
            message: 'Minting would exceed your allocated amount',
            originalError: error
        };
    }

    if (message.includes('phase')) {
        return {
            type: 'validation',
            code: 'WRONG_PHASE',
            message: 'Minting not available in current phase',
            originalError: error
        };
    }

    if (message.includes('proof')) {
        return {
            type: 'validation',
            code: 'INVALID_PROOF',
            message: 'Invalid whitelist proof',
            originalError: error
        };
    }

    if (message.includes('supply')) {
        return {
            type: 'validation',
            code: 'INSUFFICIENT_SUPPLY',
            message: 'Insufficient supply available',
            originalError: error
        };
    }

    return {
        type: 'contract',
        code: 'CONTRACT_REVERT',
        message: 'Transaction failed during execution',
        originalError: error
    };
}

export function getUserFriendlyMessage(errorDetails: ErrorDetails): string {
    switch (errorDetails.code) {
        case 'USER_REJECTED':
            return 'Transaction was cancelled. You can try again anytime.';

        case 'INSUFFICIENT_FUNDS':
            return 'You don\'t have enough ETH to cover gas fees. Please add more ETH to your wallet.';

        case 'ALLOCATION_EXCEEDED':
            return 'This would exceed your whitelist allocation. Please reduce the quantity and try again.';

        case 'WRONG_PHASE':
            return 'Minting is not available in the current phase. Please check the phase status and try again.';

        case 'INVALID_PROOF':
            return 'Whitelist verification failed. Please refresh the page and try again.';

        case 'INSUFFICIENT_SUPPLY':
            return 'Not enough NFTs available in this tier. Please reduce quantity or try a different tier.';

        case 'NETWORK_ERROR':
            return 'Network connection failed. Please check your internet connection and try again.';

        case 'GAS_ERROR':
            return 'Transaction failed due to gas estimation issues. Please try again.';

        default:
            return 'An unexpected error occurred. Please refresh the page and try again.';
    }
}