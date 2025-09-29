export interface ContractInfo {
    totalSupply: string;
    mintPrice: string;
    maxSupply: string;
    maxMintPerWallet: string;
    available: string;
}

export interface MintResult {
    success: boolean;
    transactionHash: string;
    tokenIds: string[];
}

export interface TokenMetadata {
    name: string;
    description: string;
    image: string;
    animation_url?: string;
    attributes: Array<{
        trait_type: string;
        value: string | number;
    }>;
}
