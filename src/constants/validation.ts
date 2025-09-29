import { CONFIG } from '../config/environment';

export const VALIDATION_RULES = {
    MIN_QUANTITY: 1,
    MAX_QUANTITY: CONFIG.MAX_MINT_QUANTITY,
    MIN_TIER_ID: CONFIG.MIN_TIER_ID,
    MAX_TIER_ID: CONFIG.MAX_TIER_ID,
    ADDRESS_LENGTH: 42,
    ADDRESS_PREFIX: '0x',
    REQUIRED_CHAIN_ID: CONFIG.CHAIN_ID,
} as const;

export const VALIDATION_PATTERNS = {
    ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
    TRANSACTION_HASH: /^0x[a-fA-F0-9]{64}$/,
    POSITIVE_INTEGER: /^\d+$/,
} as const;

export function validateQuantity(quantity: number): {
    isValid: boolean;
    error?: string;
} {
    if (!Number.isInteger(quantity)) {
        return { isValid: false, error: 'Quantity must be a whole number' };
    }

    if (quantity < VALIDATION_RULES.MIN_QUANTITY) {
        return { isValid: false, error: 'Quantity too low' };
    }

    if (quantity > VALIDATION_RULES.MAX_QUANTITY) {
        return { isValid: false, error: 'Quantity too high' };
    }

    return { isValid: true };
}

export function validateAddress(address: string): {
    isValid: boolean;
    error?: string;
} {
    if (!address) {
        return { isValid: false, error: 'Address is required' };
    }

    if (!VALIDATION_PATTERNS.ETHEREUM_ADDRESS.test(address)) {
        return { isValid: false, error: 'Invalid address format' };
    }

    return { isValid: true };
}