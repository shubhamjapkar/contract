import CineFiNFTABI from '../../abi/cinefi-nft-abi.json';
import USDCABI from '../../abi/usdc-abi.json';

export const CONTRACTS = {
    CINEFI_NFT: '0x4A2FBBB4F943B84e9A587887d59292d58b266459' as const,
    USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const,
} as const;

export const CINEFI_NFT_ABI = CineFiNFTABI;
export const USDC_ABI = USDCABI;



