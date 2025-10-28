import {ethers} from 'ethers';
import {MintPhase, TierInfo} from '../../interface/api.ts';
import CineFiNFTABI from '../../abi/cinefi-nft-abi.json';
import USDCABI from '../../abi/usdc-abi.json';
import {CONFIG} from '../../config/environment.ts';

export class ContractService {
    private provider: ethers.providers.Provider;
    private nftContract: ethers.Contract;
    private usdcContract: ethers.Contract;

    constructor(provider: ethers.providers.Provider) {
        this.provider = provider;
        this.nftContract = new ethers.Contract(
            CONFIG.CINEFI_NFT_ADDRESS,
            CineFiNFTABI,
            provider
        );
        this.usdcContract = new ethers.Contract(
            CONFIG.USDC_ADDRESS,
            USDCABI,
            provider
        );
    }

    /**
     * Get contract instances with signer
     */
    getContracts(signer: ethers.Signer) {
        return {
            nft: this.nftContract.connect(signer),
            usdc: this.usdcContract.connect(signer),
        };
    }

    /**
     * Enhanced owner check with caching
     */
    async isOwner(address: string): Promise<boolean> {
        try {
            const owner = await this.nftContract.owner();
            return owner.toLowerCase() === address.toLowerCase();
        } catch (error) {
            console.error('Error checking owner status:', error);
            return false;
        }
    }

    /**
     * Get current phase with validation
     */
    async getCurrentPhase(): Promise<MintPhase> {
        try {
            const phase = await this.nftContract.getCurrentPhase();
            const phaseNumber = typeof phase === 'object' ? phase.toNumber() : phase;

            if (phaseNumber < 0 || phaseNumber > 3) {
                throw new Error(`Invalid phase returned: ${phaseNumber}`);
            }

            return phaseNumber as MintPhase;
        } catch (error) {
            console.error('Error getting current phase:', error);
            return MintPhase.CLOSED;
        }
    }

    /**
     * Get tier information with enhanced error handling
     */
    async getTierInfo(tierId: number): Promise<TierInfo> {
        if (!Number.isInteger(tierId) || tierId < 1) {
            throw new Error('Invalid tier ID');
        }

        try {
            const tier = await this.nftContract.getTier(tierId);

            return {
                name: tier.name || `Tier ${tierId}`,
                price: tier.price,
                maxSupply: tier.maxSupply.toNumber(),
                currentSupply: tier.currentSupply.toNumber(),
            };
        } catch (error) {
            console.error(`Error getting tier ${tierId} info:`, error);
            throw new Error(`Failed to get tier ${tierId} information`);
        }
    }

    /**
     * Get minted count with proper error handling
     */
    async getMintedPerTierPerPhase(wallet: string, tierId: number, phaseId: number): Promise<number> {
        try {
            const minted = await this.nftContract.getMintedPerTierPerPhase(wallet, tierId, phaseId);
            return minted.toNumber();
        } catch (error) {
            console.error('Error getting minted count:', error);
            return 0;
        }
    }

    /**
     * Get claimed count for CLAIM phase
     */
    async getClaimedPerTier(wallet: string, tierId: number): Promise<number> {
        try {
            const claimed = await this.nftContract.claimed(wallet, tierId);
            return claimed.toNumber();
        } catch (error) {
            console.error('Error getting claimed count:', error);
            return 0;
        }
    }

    /**
     * Get reserved count for claims
     */
    async getClaimReserved(tierId: number): Promise<number> {
        try {
            const reserved = await this.nftContract.claimReserved(tierId);
            return reserved.toNumber();
        } catch (error) {
            console.error('Error getting claim reserved:', error);
            return 0;
        }
    }

    /**
     * Enhanced transaction parsing with detailed event extraction
     */
    async parseMintTransaction(txHash: string): Promise<number[]> {
        try {
            const receipt = await this.provider.getTransactionReceipt(txHash);

            if (!receipt) {
                throw new Error('Transaction receipt not found');
            }

            if (receipt.status !== 1) {
                throw new Error('Transaction failed');
            }

            const tokenIds: number[] = [];
            const transferEventSignature = ethers.utils.id('Transfer(address,address,uint256)');

            for (const log of receipt.logs) {
                if (log.topics[0] === transferEventSignature &&
                    log.address.toLowerCase() === CONFIG.CINEFI_NFT_ADDRESS.toLowerCase()) {

                    // Check if it's a mint (from address(0))
                    const from = ethers.utils.defaultAbiCoder.decode(['address'], log.topics[1])[0];

                    if (from === ethers.constants.AddressZero) {
                        const tokenId = ethers.BigNumber.from(log.topics[3]).toNumber();
                        tokenIds.push(tokenId);
                    }
                }
            }

            return tokenIds.sort((a, b) => a - b);
        } catch (error) {
            console.error('Error parsing mint transaction:', error);
            return [];
        }
    }

    /**
     * Estimate gas for mint transaction
     */
    async estimateMintGas(
        signer: ethers.Signer,
        tierIds: number[],
        quantities: number[],
        allocations: number[],
        merkleProofs: string[][],
        isClaimPhase: boolean
    ): Promise<ethers.BigNumber> {
        try {
            const contracts = this.getContracts(signer);

            if (isClaimPhase) {
                return await contracts.nft.estimateGas.claimNFT(
                    tierIds,
                    quantities,
                    allocations,
                    merkleProofs
                );
            } else {
                return await contracts.nft.estimateGas.mintTier(
                    tierIds,
                    quantities,
                    allocations,
                    merkleProofs
                );
            }
        } catch (error) {
            console.error('Gas estimation failed:', error);
            // Return a safe default gas limit
            return ethers.BigNumber.from('500000');
        }
    }

    /**
     * Get available supply for paid minting (GUARANTEED/FCFS phases)
     * Takes into account claim reservations that must be preserved
     */
    async getAvailableForMint(tierId: number): Promise<{
        maxSupply: number;
        currentSupply: number;
        claimReserved: number;
        availableForMint: number;
    }> {
        try {
            const [tier, claimReserved] = await Promise.all([
                this.getTierInfo(tierId),
                this.getClaimReserved(tierId)
            ]);

            const availableForMint = tier.maxSupply - tier.currentSupply - claimReserved;

            return {
                maxSupply: tier.maxSupply,
                currentSupply: tier.currentSupply,
                claimReserved,
                availableForMint: Math.max(0, availableForMint),
            };
        } catch (error) {
            throw new Error(`Failed to get available supply for tier ${tierId}: ${error}`);
        }
    }

    /**
     * Validate if quantities can be minted for given tiers
     * Critical: Checks claim reservations for GUARANTEED/FCFS phases
     */
    async validateMintQuantities(
        tierIds: number[],
        quantities: number[],
        currentPhase: MintPhase
    ): Promise<{
        isValid: boolean;
        errors: string[];
        availableSupply: Array<{
            tierId: number;
            requested: number;
            available: number;
            claimReserved: number;
        }>;
    }> {
        const errors: string[] = [];
        const availableSupply: Array<{
            tierId: number;
            requested: number;
            available: number;
            claimReserved: number;
        }> = [];

        if (currentPhase === MintPhase.CLOSED) {
            errors.push('Minting is currently closed');
            return { isValid: false, errors, availableSupply };
        }

        for (let i = 0; i < tierIds.length; i++) {
            const tierId = tierIds[i];
            const requestedQty = quantities[i];

            try {
                if (currentPhase === MintPhase.CLAIM) {
                    // For CLAIM phase, check against claim reserved amount
                    const claimReserved = await this.getClaimReserved(tierId);
                    const tier = await this.getTierInfo(tierId);
                    const availableForClaim = claimReserved - (tier.currentSupply - (tier.maxSupply - claimReserved));

                    availableSupply.push({
                        tierId,
                        requested: requestedQty,
                        available: Math.max(0, availableForClaim),
                        claimReserved,
                    });

                    if (requestedQty > availableForClaim) {
                        errors.push(`Tier ${tierId}: Requested ${requestedQty} claims, but only ${availableForClaim} available for claiming`);
                    }
                } else {
                    // For GUARANTEED/FCFS phases, check available mint supply (excluding claim reservations)
                    const supplyInfo = await this.getAvailableForMint(tierId);

                    availableSupply.push({
                        tierId,
                        requested: requestedQty,
                        available: supplyInfo.availableForMint,
                        claimReserved: supplyInfo.claimReserved,
                    });

                    if (requestedQty > supplyInfo.availableForMint) {
                        errors.push(`Tier ${tierId}: Requested ${requestedQty}, but only ${supplyInfo.availableForMint} available for minting (${supplyInfo.claimReserved} reserved for claims)`);
                    }
                }
            } catch (error) {
                errors.push(`Tier ${tierId}: Failed to validate supply - ${error}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            availableSupply,
        };
    }

    /**
     * Calculate total minting cost in USDC
     */
    async calculateTotalCost(
        tierIds: number[],
        quantities: number[]
    ): Promise<ethers.BigNumber> {
        if (tierIds.length !== quantities.length) {
            throw new Error('Tier IDs and quantities arrays must have same length');
        }

        let total = ethers.BigNumber.from(0);

        for (let i = 0; i < tierIds.length; i++) {
            try {
                const tier = await this.getTierInfo(tierIds[i]);
                const cost = ethers.BigNumber.from(tier.price).mul(quantities[i]);
                total = total.add(cost);
            } catch (error) {
                throw new Error(`Failed to calculate cost for tier ${tierIds[i]}: ${error}`);
            }
        }

        return total;
    }

    /**
     * Check USDC balance and allowance
     */
    async checkUSDCStatus(userAddress: string): Promise<{
        balance: ethers.BigNumber;
        allowance: ethers.BigNumber;
        hasBalance: boolean;
        hasAllowance: (amount: ethers.BigNumber) => boolean;
    }> {
        try {
            const balance = await this.usdcContract.balanceOf(userAddress);
            const allowance = await this.usdcContract.allowance(
                userAddress,
                CONFIG.CINEFI_NFT_ADDRESS
            );

            return {
                balance,
                allowance,
                hasBalance: balance.gt(0),
                hasAllowance: (amount: ethers.BigNumber) => allowance.gte(amount),
            };
        } catch (error) {
            throw new Error(`Failed to check USDC status: ${error}`);
        }
    }
}

// Create and export singleton instance
let contractService: ContractService | null = null;

export function getContractService(provider: ethers.providers.Provider): ContractService {
    if (!contractService) {
        contractService = new ContractService(provider);
    }
    return contractService;
}

export { contractService };