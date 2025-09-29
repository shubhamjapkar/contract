import { useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { useAccount,  useWalletClient } from 'wagmi';
import { CONTRACTS, USDC_ABI, CINEFI_NFT_ABI } from './contracts.ts';
import type { MintResult } from '../../interface/IContracts.ts';
import { providers } from 'ethers';

function walletClientToSigner(walletClient: any ) {
  if (!walletClient) return null;
  
  const { account, chain, transport } = walletClient;
  const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

export const useMinting = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  // const { data: signer } = useSigner();
  const { data: walletClient } = useWalletClient();
  const signer = useMemo(
    () => walletClientToSigner(walletClient),
    [walletClient]
);

  const mintNFT = async (quantity: number, tokenURIs: string[]): Promise<MintResult> => {
    if (!signer || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      // Validate inputs
      if (quantity <= 0 || quantity !== tokenURIs.length) {
        throw new Error('Invalid quantity or token URIs mismatch');
      }

      const cineFiContract = new ethers.Contract(CONTRACTS.CINEFI_NFT, CINEFI_NFT_ABI, signer);
      const usdcContract = new ethers.Contract(CONTRACTS.USDC, USDC_ABI, signer);

      // Check mint price
      const mintPrice = await cineFiContract.mintPrice();
      const totalCost = mintPrice.mul(quantity);
      const totalCostFormatted = (ethers as any).utils.formatUnits(totalCost, 6);

      // Check USDC balance
      const balance = await usdcContract.balanceOf(address);
      if (balance.lt(totalCost)) {
        throw new Error(`Insufficient USDC balance. Need ${totalCostFormatted} USDC`);
      }

      // Check allowance
      const allowance = await usdcContract.allowance(address, CONTRACTS.CINEFI_NFT);
      if (allowance.lt(totalCost)) {
        throw new Error(`Insufficient USDC allowance. Please approve ${totalCostFormatted} USDC`);
      }

      // Mint NFTs
      const tx = await cineFiContract.mintWithUSDC(address, quantity, tokenURIs);
      const receipt = await tx.wait();

      // Extract token IDs from events
      const tokenIds = receipt.events
          ?.filter((event: any) => event.event === 'Transfer')
          .map((event: any) => event.args.tokenId.toString()) || [];

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        tokenIds
      };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { mintNFT, loading, error };
};