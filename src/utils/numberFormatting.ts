import { ethers } from 'ethers';

export function formatNumber(num: number | string): string {
    const parsed = typeof num === 'string' ? parseFloat(num) : num;

    if (isNaN(parsed)) {
        return '0';
    }

    return new Intl.NumberFormat('en-US').format(parsed);
}

export function formatUSDC(amountWei: ethers.BigNumber | string | undefined): string {
    try {
        // Handle undefined or null values
        if (amountWei === undefined || amountWei === null) {
            return '0.00';
        }

        const amount = ethers.BigNumber.from(amountWei);
        const formatted = ethers.utils.formatUnits(amount, 6); // USDC has 6 decimals
        const parsed = parseFloat(formatted);

        if (parsed < 0.01 && parsed > 0) {
            return '0.01';
        }

        return `${formatNumber(parsed.toFixed(2))}`;
    } catch (error) {
        console.error('Error formatting USDC:', error);
        return '0.00';
    }
}

export function formatETH(amountWei: ethers.BigNumber | string, decimals: number = 4): string {
    try {
        const amount = ethers.BigNumber.from(amountWei);
        const formatted = ethers.utils.formatEther(amount);
        const parsed = parseFloat(formatted);

        if (parsed < 0.0001 && parsed > 0) {
            return '< 0.0001 ETH';
        }

        return `${parsed.toFixed(decimals)} ETH`;
    } catch (error) {
        console.error('Error formatting ETH:', error);
        return '0 ETH';
    }
}

export function parseNumberInput(input: string): {
    isValid: boolean;
    value: number | null;
    error: string | null;
} {
    if (!input || typeof input !== 'string') {
        return {
            isValid: false,
            value: null,
            error: 'Input is required'
        };
    }

    const trimmed = input.trim();

    if (!trimmed) {
        return {
            isValid: false,
            value: null,
            error: 'Input cannot be empty'
        };
    }

    const parsed = parseFloat(trimmed);

    if (isNaN(parsed)) {
        return {
            isValid: false,
            value: null,
            error: 'Must be a valid number'
        };
    }

    if (parsed < 0) {
        return {
            isValid: false,
            value: null,
            error: 'Cannot be negative'
        };
    }

    if (!Number.isInteger(parsed)) {
        return {
            isValid: false,
            value: null,
            error: 'Must be a whole number'
        };
    }

    return {
        isValid: true,
        value: parsed,
        error: null
    };
}