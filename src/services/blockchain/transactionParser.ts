import { ethers } from 'ethers';
import { CONFIG } from '../../config/environment.ts';

export async function parseNFTMintTransaction(
    txHash: string,
    provider: any // Wagmi public client
): Promise<number[]> {
    try {
        const receipt = await provider.getTransactionReceipt({ hash: txHash as `0x${string}` });

        if (!receipt) {
            throw new Error('Transaction receipt not found');
        }

        if (receipt.status !== 'success') {
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