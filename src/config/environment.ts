// export const CONFIG = {
//     // API Configuration
//     ADMIN_API_URL: import.meta.env.VITE_ADMIN_API_URL || '',
//     ADMIN_API_KEY: import.meta.env.VITE_ADMIN_API_KEY || '',
//
//     // Smart Contract Addresses
//     CINEFI_NFT_ADDRESS: import.meta.env.VITE_NFT_CONTRACT_ADDRESS || '',
//     USDC_ADDRESS: import.meta.env.VITE_USDC_ADDRESS || '',
//
//     // Network Configuration (Base Sepolia)
//     CHAIN_ID: 84532,
//     RPC_URL: import.meta.env.VITE_RPC_URL || '',
//     BLOCK_EXPLORER: '',
//
//     // UI Configuration
//     MAX_RETRY_ATTEMPTS: 3,
//     RETRY_DELAY_MS: 1000,
//     NOTIFICATION_DURATION: 5000,
//     CONSISTENCY_CHECK_INTERVAL: 30000,
// } as const;
//
// // Network chain configuration
// import { Chain } from '@rainbow-me/rainbowkit';
//
// export const baseSepolia: Chain = {
//     id: 84532,
//     name: 'Base Sepolia',
//     network: 'base-sepolia',
//     iconUrl: 'https://chainlist.org/unknown-logo.png',
//     iconBackground: '#fff',
//     nativeCurrency: {
//         decimals: 18,
//         name: 'Ethereum',
//         symbol: 'ETH',
//     },
//     rpcUrls: {
//         public: { http: [CONFIG.RPC_URL] },
//         default: { http: [CONFIG.RPC_URL] },
//     },
//     blockExplorers: {
//         default: {
//             name: 'BaseScan',
//             url: CONFIG.BLOCK_EXPLORER
//         },
//     },
//     testnet: true,
// };


// Network configuration for RainbowKit
// REQUIRED ENVIRONMENT VARIABLES:
// - VITE_NFT_CONTRACT_ADDRESS (CineFi NFT contract address)
// - VITE_USDC_ADDRESS (USDC token contract address)
// - VITE_ADMIN_API_URL (Admin API base URL)
// - VITE_ADMIN_API_KEY (Admin API authentication key)
// - VITE_RPC_URL (RPC endpoint for Base Sepolia)
// - VITE_WALLET_CONNECT_PROJECT_ID (WalletConnect project ID from cloud.walletconnect.com)
// - VITE_DEBUG_MODE (optional, 'true' to enable debug logging)

export const CONFIG = {
    // API Configuration
    ADMIN_API_URL: import.meta.env.VITE_ADMIN_API_URL || '',
    ADMIN_API_KEY: import.meta.env.VITE_ADMIN_API_KEY || '',

    // Smart Contract Addresses
    CINEFI_NFT_ADDRESS: import.meta.env.VITE_NFT_CONTRACT_ADDRESS || '',
    USDC_ADDRESS: import.meta.env.VITE_USDC_ADDRESS || '',

    // Network Configuration (Base Sepolia)
    CHAIN_ID: 84532,
    RPC_URL: import.meta.env.VITE_RPC_URL || '',
    BLOCK_EXPLORER: 'https://sepolia.basescan.org/',

    // UI Configuration
    MAX_RETRY_ATTEMPTS: 3,
    RETRY_DELAY_MS: 1000,
    NOTIFICATION_DURATION: 5000,
    CONSISTENCY_CHECK_INTERVAL: 30000,
    CACHE_DURATION: 30000,

    // Validation Limits
    MAX_MINT_QUANTITY: 50,
    MIN_TIER_ID: 1,
    MAX_TIER_ID: 10,

    // Available tiers for owner minting (configurable)
    // Add/remove tier IDs here to change owner interface without code changes
    // Alternative: Could read dynamically from contract if it has a getMaxTierId() function
    AVAILABLE_TIERS: [1, 2, 3, 4, 5], // Can be expanded without code changes

    // Feature Flags
    ENABLE_OWNER_MINT: true,
    ENABLE_METADATA_UPDATE: true,
    ENABLE_DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',

    // WalletConnect/RainbowKit
    WALLET_CONNECT_PROJECT_ID: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '',

    // App Metadata
    APP_NAME: 'CineFi NFT Minting',
    APP_DESCRIPTION: 'Multi-tier NFT collection with exclusive film investment benefits',
    APP_VERSION: '1.0.0',
} as const;

// Base Sepolia Chain Configuration for RainbowKit
export const baseSepolia = {
    id: 84532,
    name: 'Base Sepolia',
    network: 'base-sepolia',
    iconUrl: 'https://chainlist.org/unknown-logo.png',
    iconBackground: '#fff',
    nativeCurrency: {
        decimals: 18,
        name: 'Ethereum',
        symbol: 'ETH',
    },
    rpcUrls: {
        public: { http: [CONFIG.RPC_URL] },
        default: { http: [CONFIG.RPC_URL] },
    },
    blockExplorers: {
        default: {
            name: 'BaseScan',
            url: CONFIG.BLOCK_EXPLORER
        },
    },
    testnet: true,
} as const;

// Validation functions
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!CONFIG.ADMIN_API_URL) {
        errors.push('VITE_ADMIN_API_URL is required');
    }

    if (!CONFIG.ADMIN_API_KEY) {
        errors.push('VITE_ADMIN_API_KEY is required');
    }

    if (!CONFIG.CINEFI_NFT_ADDRESS || !CONFIG.CINEFI_NFT_ADDRESS.startsWith('0x')) {
        errors.push('Valid VITE_NFT_CONTRACT_ADDRESS is required');
    }

    if (!CONFIG.USDC_ADDRESS || !CONFIG.USDC_ADDRESS.startsWith('0x')) {
        errors.push('Valid VITE_USDC_ADDRESS is required');
    }

    if (!CONFIG.RPC_URL || (!CONFIG.RPC_URL.startsWith('http://') && !CONFIG.RPC_URL.startsWith('https://'))) {
        errors.push('Valid VITE_RPC_URL is required');
    }

    if (!CONFIG.WALLET_CONNECT_PROJECT_ID || CONFIG.WALLET_CONNECT_PROJECT_ID.trim() === '') {
        errors.push('VITE_WALLET_CONNECT_PROJECT_ID is required for RainbowKit wallet connections');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}