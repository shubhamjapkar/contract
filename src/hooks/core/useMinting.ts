import { useState, useCallback, useRef } from 'react';
import {
    useAccount,
    useContractRead,
    usePublicClient,
    useWalletClient,
} from 'wagmi';
import { ethers, Contract, providers, BigNumber } from 'ethers';
import { useWhitelist } from './useWhitelist';
import { toast } from 'sonner';
import { CONFIG } from '../../config/environment';
import CineFiNFTABI from '../../../src/abi/cinefi-nft-abi.json';
import USDCABI from '../../../src/abi/usdc-abi.json'
import { MintPhase, MintTransaction } from '../../interface/api';
import { parseNFTMintTransaction } from '../../services/blockchain/transactionParser.ts';
import { utils } from 'ethers';
import { getContractService } from '../../services/blockchain/contractService';
import { adminAPI } from '../../services/adminAPI';
import {useWallet} from "../../components/provider/WalletProvider.tsx";

/** Try to parse a revert into something human-readable */
function decodeRevert(abi: any[], err: any): string | null {
    //   const iface = new Interface(abi as any);
    const iface = new utils.Interface(CineFiNFTABI);

    // ethers v5 error shapes can vary; try common spots
    const data: string | undefined =
        err?.error?.data || err?.data || err?.receipt?.revertReason || err?.reason;

    // console.log(err);

    if (!data || typeof data !== 'string' || !data.startsWith('0x')) return null;

    // Standard Error(string)
    if (data.startsWith('0x08c379a0')) {
        try {
            const [reason] = utils.defaultAbiCoder.decode(['string'], '0x' + data.slice(10));
            return String(reason);
        } catch { }
    }

    // Panic(uint256)
    if (data.startsWith('0x4e487b71')) {
        try {
            const [code] = utils.defaultAbiCoder.decode(['uint256'], '0x' + data.slice(10));
            return `Panic(${BigNumber.from(code).toString()})`;
        } catch { }
    }

    // Custom error (with or without args)
    try {
        const parsed = iface.parseError(data as any);
        if (!parsed) return null;
        const args =
            parsed.args && parsed.args.length
                ? '(' + parsed.args.map((a: any) => (typeof a === 'object' ? a.toString() : String(a))).join(', ') + ')'
                : '()';
        return `${parsed.name}${args}`;
    } catch {
        // Sometimes ABI doesn’t include custom errors; fallback to selector
        return `CustomError ${data.slice(0, 10)}`;
    }
}
export interface MintParams {
    tierIds: number[];
    quantities: number[];
    merkleProofs: string[][];
    allocations: number[];
    tierPrices?: ethers.BigNumber[]; // for paid phases (USDC)
}

export function toBN(x: any | undefined): BigNumber {
    if (x == null) return BigNumber.from(0);
    if (BigNumber.isBigNumber(x)) return x;
    if (typeof x === 'bigint') return BigNumber.from(x.toString());
    if (typeof x === 'number') return BigNumber.from(x);
    if (typeof x === 'string') return BigNumber.from(x);
    // last resort
    try {
        return BigNumber.from(String(x));
    } catch {
        return BigNumber.from(0);
    }
}

function walletClientToSigner(walletClient: any): ethers.Signer | null {
    if (!walletClient) return null;

    // Prefer the underlying EIP-1193 provider if present, else fallback to window.ethereum
    const eip1193 =
        (walletClient.transport as any)?.provider ??
        (typeof window !== 'undefined' ? (window as any).ethereum : undefined);

    if (!eip1193) return null;

    const provider = new providers.Web3Provider(eip1193);
    return provider.getSigner(walletClient.account.address);
}

export function useMinting() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const { refetch } = useWhitelist();
    const { currentPhase } = useWallet()

    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    // Optional ethers Provider (only used by your getContractService fallback)
    const provider = useRef(
        new ethers.providers.JsonRpcProvider(
            import.meta.env.VITE_RPC_URL || ''
        )
    ).current;

    // ---- USDC reads ----------------------------------------------------------
    const { data: usdcBalance } = useContractRead({
        address: CONFIG.USDC_ADDRESS as `0x${string}`,
        abi: USDCABI,
        functionName: 'balanceOf',
        args: address ? [address as `0x${string}`] : undefined,
        enabled: !!address,
    });

    const { data: usdcAllowance } = useContractRead({
        address: CONFIG.USDC_ADDRESS as `0x${string}`,
        abi: USDCABI,
        functionName: 'allowance',
        args: address && CONFIG.CINEFI_NFT_ADDRESS ? [address as `0x${string}`, CONFIG.CINEFI_NFT_ADDRESS as `0x${string}`] : undefined,
        enabled: !!address,
    });

    // ---- Helpers -------------------------------------------------------------
    const calculateTotalCost = useCallback(
        (tierIds: number[], quantities: number[], tierPrices: ethers.BigNumber[]) => {
            let total = ethers.BigNumber.from(0);
            for (let i = 0; i < tierIds.length; i++) {
                total = total.add(tierPrices[i].mul(quantities[i]));
            }
            return total;
        },
        []
    );

    // ---- Main action ---------------------------------------------------------
    const mint =  async (params: MintParams): Promise<MintTransaction> => {

        if (!address) {
            throw new Error('Not ready to mint: wallet not connected or whitelist not loaded');
        }
        if (!walletClient?.chain?.id) {
            throw new Error('Wallet chain not detected. Connect your wallet.');
        }
        const signer = walletClientToSigner(walletClient);
        if (!signer) {
            throw new Error('Signer not available (connect wallet and approve access)');
        }
        const { tierIds, quantities, merkleProofs, tierPrices, allocations } = params;
        const isClaimPhase = currentPhase === MintPhase.CLAIM;

        // Basic arg validation
        if (
            tierIds.length === 0 ||
            quantities.length === 0 ||
            tierIds.length !== quantities.length ||
            merkleProofs.length !== tierIds.length ||
            allocations.length !== tierIds.length
        ) {
            throw new Error('Invalid inputs: mismatched array lengths or empty arrays.');
        }

        const nft = new Contract(CONFIG.CINEFI_NFT_ADDRESS, CineFiNFTABI, signer);
        const usdc = new Contract(CONFIG.USDC_ADDRESS, USDCABI, signer);
        const tierIdsBN = tierIds.map((n) => BigNumber.from(n));
        const quantitiesBN = quantities.map((n) => BigNumber.from(n));
        const proofsHex = merkleProofs as `0x${string}`[][];
        const allocationsBN = allocations.map((n) => BigNumber.from(n));

        setTxHash(null);
        setLoading(true);

        let totalCost = calculateTotalCost(tierIds, quantities, tierPrices);
        totalCost = toBN(totalCost);

        try {
            toast.info('Mint Started', { description: 'Preparing your mint transaction…' });

            // Handle USDC only for paid phases
            if (!isClaimPhase) {
                if (!tierPrices || tierPrices.length !== tierIds.length) {
                    throw new Error('Tier prices required for paid minting phases');
                }

                // Fetch fresh USDC balance and allowance
                let currentBalance: BigNumber;
                let currentAllowance: BigNumber;

                try {
                    currentBalance = toBN(await usdc.balanceOf(address));
                    currentAllowance = toBN(await usdc.allowance(address, CONFIG.CINEFI_NFT_ADDRESS));
                } catch (e) {
                    throw new Error(`Failed to fetch USDC balance/allowance: ${e}`);
                }

                if ((currentBalance as ethers.BigNumber).lt(totalCost as ethers.BigNumber)) {
                    throw new Error(
                        `Insufficient USDC balance. Need ${ethers.utils.formatUnits(totalCost, 6)} USDC`
                    );
                }

                console.log(
                    "Current Allowance:", ethers.utils.formatUnits(currentAllowance, 6), "USDC",
                    "| Total Cost:", ethers.utils.formatUnits(totalCost, 6), "USDC"
                )
                if (currentAllowance.lt(totalCost)) {
                    console.log(
                        "Current Allowance:", ethers.utils.formatUnits(currentAllowance, 6), "USDC",
                        "| Total Cost:", ethers.utils.formatUnits(totalCost, 6), "USDC"
                    )
                    toast.warning('USDC Approval Required', {
                        description: `Please approve ${ethers.utils.formatUnits(totalCost, 6)} USDC in the next transaction`
                    });

                    toast.info('USDC Approval', { description: 'Approving USDC spending…' });

                    // Estimate gas for approval transaction
                    let approveGasLimit: BigNumber;
                    try {
                        approveGasLimit = await usdc.estimateGas.approve(CONFIG.CINEFI_NFT_ADDRESS, totalCost);
                        // Add 10% buffer
                        approveGasLimit = approveGasLimit.mul(110).div(100);
                    } catch (e) {
                        // Fallback to a reasonable default if estimation fails
                        approveGasLimit = BigNumber.from(100000);
                    }

                    const approveTx = await usdc.approve(CONFIG.CINEFI_NFT_ADDRESS, totalCost, {
                        gasLimit: approveGasLimit
                    })

                    toast.info('Approval Submitted', { description: 'Waiting for USDC approval confirmation…' });
                    const approvalReceipt = await (approveTx as any).wait?.();
                    if (approvalReceipt?.status !== 1) throw new Error('USDC approval failed');

                    toast.success('USDC Approved', {
                        description: `${ethers.utils.formatUnits(totalCost, 6)} USDC spending approved successfully`
                    });
                }
            }

            // Execute mint
            let tx: any;
            let gasLimit: BigNumber;

            // Get contract service and estimate gas
            try {
                const contractService = getContractService(provider);
                gasLimit = await contractService.estimateMintGas(
                    signer,
                    tierIds,
                    quantities,
                    allocations,
                    merkleProofs,
                    isClaimPhase
                );
            } catch (e) {
                throw new Error(`EstimateMintGasn failed: ${e}`);
            }

            // Add 10% buffer to gas estimate
            const gasLimitWithBuffer = gasLimit.mul(110).div(100);

            if (isClaimPhase) {
                toast.info('Claiming NFTs', { description: 'Executing claim transaction…' });
                tx = await nft.claimNFT(tierIds, quantities, allocations, proofsHex, {
                    from: address,
                    gasLimit: gasLimitWithBuffer
                });
            } else {
                toast.info('Minting NFTs', { description: 'Executing mint transaction…' });
                tx = await nft.mintTier(tierIdsBN, quantitiesBN, allocationsBN, proofsHex, {
                    gasLimit: gasLimitWithBuffer
                });
            }

            setTxHash(await tx.hash);

            toast.info('Transaction Submitted', {
                description: `Transaction hash: ${tx.hash.slice(0, 10)}…`,
                action: {
                    label: 'View on Explorer',
                    onClick: () => window.open(`${CONFIG.BLOCK_EXPLORER}/tx/${tx.hash}`, '_blank')
                }
            });

            const receipt = await tx.wait();
            if (receipt.status !== 1) {
                throw new Error('Transaction failed during execution');
            }

            const tokenIds = await parseNFTMintTransaction(tx.hash, publicClient);

            // Update mint date for the minted tokens
            if (tokenIds && tokenIds.length > 0) {
                await adminAPI.updateMintDate(tokenIds);
            }

            await refetch();

            const totalMinted = quantities.reduce((sum, q) => sum + q, 0);
            toast.success('Mint Successful!', {
                description: `Successfully ${isClaimPhase ? 'claimed' : 'minted'} ${totalMinted} NFT${totalMinted > 1 ? 's' : ''
                } across ${tierIds.length} tier${tierIds.length > 1 ? 's' : ''}`,
                duration: 10000,
                action: {
                    label: 'View Transaction',
                    onClick: () => window.open(`${CONFIG.BLOCK_EXPLORER}/tx/${tx.hash}`, '_blank')
                }
            });

            return { success: true, txHash: tx.hash, tokenIds };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            toast.error('Mint Failed', {
                description: errorMessage.slice(0, 200),
                duration: 10000,
                action: txHash ? {
                    label: 'View Transaction',
                    onClick: () => window.open(`${CONFIG.BLOCK_EXPLORER}/tx/${txHash}`, '_blank')
                } : undefined
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }


    return {
        mint,
        loading,
        txHash,
        isLoading: loading,
        usdcBalance,
        usdcAllowance
    };
}