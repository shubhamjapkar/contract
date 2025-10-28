import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACTS, CINEFI_NFT_ABI } from './contracts.ts';
import type {ContractInfo} from '../../interface/IContracts.ts';

export const useContractInfo = () => {
  const [info, setInfo] = useState<ContractInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use direct RPC provider for read-only operations
      const rpc = import.meta.env.VITE_RPC_URL || '';
      const provider = new ethers.providers.JsonRpcProvider(rpc);
      const contract = new ethers.Contract(
        CONTRACTS.CINEFI_NFT,
        CINEFI_NFT_ABI,
        provider
      );

      const [totalSupply, mintPrice, maxSupply, maxMintPerWallet] = await Promise.all([
        contract.totalSupply(),
        contract.mintPrice(),
        contract.maxSupply(),
        contract.maxMintPerWallet()
      ]);

      const available = maxSupply.sub(totalSupply);

      setInfo({
        totalSupply: totalSupply.toString(),
        mintPrice: ethers.utils.formatUnits(mintPrice, 6), // USDC has 6 decimals
        maxSupply: maxSupply.toString(),
        maxMintPerWallet: maxMintPerWallet.toString(),
        available: available.toString()
      });
    } catch (err) {
      console.error('Failed to fetch contract info:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return { info, loading, error, refetch: fetchInfo };
};