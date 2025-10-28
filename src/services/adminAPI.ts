import {
    WhitelistStatus,
    MerkleProofResponse,
    UpdateMintDateResponse
} from '../interface/api.ts';
import { CONFIG } from '../config/environment.ts';


//fixme need these files
import { apiClient } from './apiClient.ts';
import { withRetry } from './retryHelpers.ts';

export class AdminAPIService {
    private baseURL: string;
    private apiKey: string;

    constructor() {
        this.baseURL = CONFIG.ADMIN_API_URL;
        this.apiKey = CONFIG.ADMIN_API_KEY;
    }

    /**
     * Get whitelist status with automatic retry and validation
     */
    async getWhitelistStatus(wallet: string): Promise<WhitelistStatus> {
        if (!this.validateAddress(wallet)) {
            throw new Error('Invalid wallet address format');
        }

        return withRetry(async () => {
            const req = await apiClient.get(
                `${this.baseURL}/api/whitelist/status/${wallet}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                    },
                }
            );

            const response = await req.json();

            if (req.status === 404) {
                return {
                    wallet,
                    entries: [],
                    totalAllowedQuantity: 0,
                };
            }

            if (!response.success) {
                throw new Error(response.error || 'API request failed');
            }

            return this.validateWhitelistResponse(response.data);
        }, CONFIG.MAX_RETRY_ATTEMPTS);
    }

    /**
     * Get merkle proof with validation and caching
     */
    async getMerkleProof(
        wallet: string,
        tierId: number,
        phaseId: number,
        allowedQuantity: number
    ): Promise<string[]> {
        // Validate inputs
        this.validateMerkleProofParams(wallet, tierId, phaseId, allowedQuantity);

        return withRetry(async () => {
            const params = new URLSearchParams({
                wallet,
                tierId: tierId.toString(),
                phaseId: phaseId.toString(),
                allowedQuantity: allowedQuantity.toString(),
            });

            const req = await apiClient.get(
                `${this.baseURL}/api/whitelist/proof?${params}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                    },
                }
            );

            const response = await req.json();

            if (req.status === 404 || !response.success) {
                throw new Error(response.error || 'Failed to get merkle proof');
            }

            const proof = response.data.proof;

            if (!Array.isArray(proof) || !proof.every(p => typeof p === 'string' && p.startsWith('0x'))) {
                throw new Error('Invalid merkle proof format received');
            }

            return proof;
        }, CONFIG.MAX_RETRY_ATTEMPTS);
    }

    /**
     * Update mint dates with batch processing
     */
    async updateMintDate(tokenIds: number[]): Promise<UpdateMintDateResponse> {
        if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
            throw new Error('Invalid token IDs array');
        }

        try {
            return await withRetry(async () => {
                const req = await apiClient.post(
                    `${this.baseURL}/api/metadata/update-mint-date`,
                    { tokenIds },
                    {
                        headers: {
                            'Authorization': `Bearer ${this.apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const response = await req.json();

                if (!response.success) {
                    throw new Error(response.error || 'Failed to update mint dates');
                }

                return response.data;
            }, 2); // Lower retry count for metadata updates
        } catch (error) {
            console.warn('Mint date update failed:', error);
            // Return failure response instead of throwing
            return {
                success: false,
                updatedTokens: 0,
                errors: [error instanceof Error ? error.message : 'Update failed'],
                results: tokenIds.map(id => ({ tokenId: id, updated: false, error: 'Update failed' })),
            };
        }
    }

    /**
     * Get current merkle root with validation
     */
    async getMerkleRoot(): Promise<string> {
        return withRetry(async () => {
            const req = await apiClient.get(
                `${this.baseURL}/api/whitelist/tree`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                    },
                }
            );

            const response = await req.json();

            if (req.status === 404 || !response.success) {
                throw new Error(response.data.error || 'Failed to fetch merkle root');
            }

            const root = response.data.root;
            if (!root || !root.startsWith('0x') || root.length !== 66) {
                throw new Error('Invalid merkle root format received');
            }

            return root;
        }, CONFIG.MAX_RETRY_ATTEMPTS);
    }

    // Private validation methods
    private validateAddress(address: string): boolean {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }

    private validateMerkleProofParams(
        wallet: string,
        tierId: number,
        phaseId: number,
        allowedQuantity: number
    ): void {
        if (!this.validateAddress(wallet)) {
            throw new Error('Invalid wallet address');
        }
        if (!Number.isInteger(tierId) || tierId < 1) {
            throw new Error('Invalid tier ID');
        }
        if (!Number.isInteger(phaseId) || phaseId < 0) {
            throw new Error('Invalid phase ID');
        }
        if (!Number.isInteger(allowedQuantity) || allowedQuantity < 1) {
            throw new Error('Invalid allowed quantity');
        }
    }

    private validateWhitelistResponse(data: any): WhitelistStatus {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid API response format');
        }

        if (!data.wallet || !Array.isArray(data.entries)) {
            throw new Error('Missing required fields in API response');
        }

        return {
            wallet: data.wallet,
            entries: data.entries,
            totalAllowedQuantity: data.totalAllowedQuantity || 0,
        };
    }
}

export const adminAPI = new AdminAPIService();