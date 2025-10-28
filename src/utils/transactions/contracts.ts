import CineFiNFTABI from '../../abi/cinefi-nft-abi.json';
import USDCABI from '../../abi/usdc-abi.json';

export const CONTRACTS = {
    CINEFI_NFT: import.meta.env.VITE_NFT_CONTRACT_ADDRESS || "",
    USDC: import.meta.env.VITE_USDC_ADDRESS || ""
} as const;

export const CINEFI_NFT_ABI = CineFiNFTABI;
export const USDC_ABI = USDCABI;



