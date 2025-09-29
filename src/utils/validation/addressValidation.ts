import { ethers } from 'ethers';

export function isValidAddress(address: string): boolean {
    if (!address || typeof address !== 'string') {
        return false;
    }

    try {
        return ethers.utils.isAddress(address);
    } catch {
        return false;
    }
}

export function normalizeAddress(address: string): string {
    if (!isValidAddress(address)) {
        throw new Error('Invalid address format');
    }

    return ethers.utils.getAddress(address);
}

export function addressesEqual(addr1: string, addr2: string): boolean {
    if (!isValidAddress(addr1) || !isValidAddress(addr2)) {
        return false;
    }

    return addr1.toLowerCase() === addr2.toLowerCase();
}

export function shortenAddress(
    address: string,
    startChars: number = 6,
    endChars: number = 4
): string {
    if (!isValidAddress(address)) {
        return address;
    }

    if (address.length <= startChars + endChars) {
        return address;
    }

    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

export function validateAddressInput(input: string): {
    isValid: boolean;
    address: string | null;
    error: string | null;
} {
    if (!input || typeof input !== 'string') {
        return {
            isValid: false,
            address: null,
            error: 'Address is required'
        };
    }

    const trimmed = input.trim();

    if (!trimmed) {
        return {
            isValid: false,
            address: null,
            error: 'Address cannot be empty'
        };
    }

    if (!trimmed.startsWith('0x')) {
        return {
            isValid: false,
            address: null,
            error: 'Address must start with 0x'
        };
    }

    if (trimmed.length !== 42) {
        return {
            isValid: false,
            address: null,
            error: 'Address must be 42 characters long'
        };
    }

    if (!isValidAddress(trimmed)) {
        return {
            isValid: false,
            address: null,
            error: 'Invalid address format'
        };
    }

    try {
        const checksumAddress = normalizeAddress(trimmed);
        return {
            isValid: true,
            address: checksumAddress,
            error: null
        };
    } catch (error) {
        return {
            isValid: false,
            address: null,
            error: 'Failed to validate address'
        };
    }
}