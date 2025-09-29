export const ERROR_MESSAGES = {
    // Wallet errors
    WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
    WRONG_NETWORK: 'Please switch to the correct network',
    WALLET_CONNECTION_FAILED: 'Failed to connect wallet. Please try again.',

    // Validation errors
    INVALID_ADDRESS: 'Invalid wallet address format',
    INVALID_QUANTITY: 'Please enter a valid quantity',
    QUANTITY_EXCEEDS_LIMIT: 'Quantity exceeds maximum allowed',
    INSUFFICIENT_ALLOCATION: 'Insufficient whitelist allocation',
    TIER_NOT_SELECTED: 'Please select at least one tier',

    // Transaction errors
    TRANSACTION_FAILED: 'Transaction failed. Please try again.',
    INSUFFICIENT_FUNDS: 'Insufficient funds for transaction',
    USER_REJECTED: 'Transaction was rejected by user',

    // Contract errors
    CONTRACT_ERROR: 'Smart contract error occurred',
    MINT_PHASE_CLOSED: 'Minting is currently closed',
    SUPPLY_EXHAUSTED: 'No more NFTs available in this tier',
    MERKLE_PROOF_INVALID: 'Whitelist verification failed',

    // API errors
    API_ERROR: 'Server error. Please try again later.',
    WHITELIST_CHECK_FAILED: 'Failed to check whitelist status',
    NETWORK_ERROR: 'Network connection failed',

    // Generic errors
    UNKNOWN_ERROR: 'An unexpected error occurred',
    LOADING_ERROR: 'Failed to load required data'
} as const;

export const ERROR_CODES = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    WRONG_NETWORK: 'WRONG_NETWORK',
    WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
    USER_REJECTED: 'USER_REJECTED',
    CONTRACT_REVERT: 'CONTRACT_REVERT',
    INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
    INVALID_INPUT: 'INVALID_INPUT',
    ALLOCATION_EXCEEDED: 'ALLOCATION_EXCEEDED',
    SUPPLY_INSUFFICIENT: 'SUPPLY_INSUFFICIENT',
    NOT_WHITELISTED: 'NOT_WHITELISTED'
} as const;