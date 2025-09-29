import { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import { useAccount, useWalletClient } from 'wagmi';
import { CONTRACTS, USDC_ABI } from './contracts.ts';
import { providers } from 'ethers';

function walletClientToSigner(walletClient: any ) {
    console.log("WalletClient")
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

export const useUSDC = () => {
    const [balance, setBalance] = useState('0');
    const [allowance, setAllowance] = useState('0');
    const [loading, setLoading] = useState(false);
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    // const { data: signer } = useSigner();
    const signer = useMemo(() => {
        console.log("in Use MEMO");
        return walletClientToSigner(walletClient); // ADD RETURN HERE
    }, [walletClient]);


    const fetchBalanceAndAllowance = async () => {
        if (!signer || !address) return;

        try {
            setLoading(true);
            const usdcContract = new ethers.Contract(CONTRACTS.USDC, USDC_ABI, signer);

            const [userBalance, currentAllowance] = await Promise.all([
                usdcContract.balanceOf(address),
                usdcContract.allowance(address, CONTRACTS.CINEFI_NFT)
            ]);

            setBalance((ethers as any).utils.formatUnits(userBalance, 6));
            setAllowance((ethers as any).utils.formatUnits(currentAllowance, 6));
        } catch (error) {
            console.error('Failed to fetch USDC info:', error);
        } finally {
            setLoading(false);
        }
    };

    const approveUSDC = async (amount: ethers.BigNumber) => {
        if (!signer) throw new Error('No signer available');

        const usdcContract = new ethers.Contract(CONTRACTS.USDC, USDC_ABI, signer);
        const tx = await usdcContract.approve(CONTRACTS.CINEFI_NFT, amount);
        await tx.wait();
        await fetchBalanceAndAllowance();
        console.log(tx);
        return tx;
    };

    useEffect(() => {
        fetchBalanceAndAllowance();
    }, [signer, address]);

    return { balance, allowance, loading, approveUSDC, refetch: fetchBalanceAndAllowance };
};