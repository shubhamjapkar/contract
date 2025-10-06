import { useState, useCallback, useRef } from 'react';
import {
    useAccount,
    useContractRead,
    usePublicClient,
    useWalletClient,
    useContractWrite,
} from 'wagmi';
import { ethers, Contract, providers, BigNumber } from 'ethers';
import { useWhitelist } from './useWhitelist';
import { useNotifications } from '../infrastructure/useNotifications.tsx';
import { CONFIG } from '../../config/environment';
// @ts-ignore
import CineFiNFTABI from '../../../src/abi/cinefi-nft-abi.json';
import USDCABI from '../../abi/usdc-abi.json';
import { MintPhase, MintTransaction } from '../../interface/api';
import { parseNFTMintTransaction } from '../../services/blockchain/transactionParser.ts';
import { getContractService } from '../../services/blockchain/contractService.ts';
import { utils } from 'ethers';

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
function toBN(x: any | undefined): BigNumber {
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
    const { validation, refetch } = useWhitelist();
    const { success, error: notifyError, info, warning } = useNotifications();

    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    // Optional ethers Provider (only used by your getContractService fallback)
    const provider = useRef(
        new ethers.providers.JsonRpcProvider(
            import.meta.env.VITE_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'
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
        args:
            address && CONFIG.CINEFI_NFT_ADDRESS
                ? [address as `0x${string}`, CONFIG.CINEFI_NFT_ADDRESS as `0x${string}`]
                : undefined,
        enabled: !!address,
    });

    // ---- Unprepared write hooks (args supplied at call time) -----------------
    const { writeAsync: approveUSDC } = useContractWrite({
        address: CONFIG.USDC_ADDRESS as `0x${string}`,
        abi: USDCABI,
        functionName: 'approve',
        mode: 'recklesslyUnprepared',
    });

    // Paid mint
    //   const { writeAsync: mintTierWrite } = useContractWrite({
    //     address: CONFIG.CINEFI_NFT_ADDRESS as `0x${string}`,
    //     abi: CineFiNFTABI,
    //     functionName: 'mintTier',
    //     mode: 'recklesslyUnprepared',
    //   });

    // Claim mint (rename to your actual claim fn if different)


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
    const mint = useCallback(
        async (params: MintParams): Promise<MintTransaction> => {
            if (!address || !validation) {
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
            const isClaimPhase = validation.currentPhase === MintPhase.CLAIM;


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



            //   const { writeAsync: claimNFT } = useContractWrite({
            //     address: CONFIG.CINEFI_NFT_ADDRESS as `0x${string}`,
            //     abi: CineFiNFTABI,
            //     functionName: 'claimNFT', // <-- change if your ABI uses another name
            //     mode: 'recklesslyUnprepared',
            //   });

            setTxHash(null);
            setLoading(true);

            let totalCost = calculateTotalCost(tierIds, quantities, tierPrices);
            totalCost = toBN(totalCost);
            console.log("Total Cost", totalCost, quantities, tierPrices);
            // console.log('=== EXACT PARAMETERS ===');
            // console.log('tierIdsBN:', tierIdsBN);
            // console.log('tierIdsBN values:', tierIdsBN.map(t => t.toString()));
            // console.log('tierIdsBN hex:', tierIdsBN.map(t => t.toHexString()));

            // console.log('quantitiesBN:', quantitiesBN);
            // console.log('quantitiesBN values:', quantitiesBN.map(q => q.toString()));

            // console.log('allocationsBN:', allocationsBN);
            // console.log('allocationsBN values:', allocationsBN.map(a => a.toString()));

            // console.log('proofsHex:', proofsHex);
            // console.log('proofsHex count:', proofsHex.length);
            // console.log('Each proof:');
            // proofsHex.forEach((proof, i) => {
            //     console.log(`  [${i}]: ${proof}`);
            //     console.log(`       Length: ${proof.length} (should be 66 for 0x + 64 hex chars)`);
            // });

            // console.log('address:', address);
            // console.log('address checksum:', ethers.utils.getAddress(address));

            try {
                info('Mint Started', 'Preparing your mint transaction…');

                // Handle USDC only for paid phases
                if (!isClaimPhase) {
                    if (!tierPrices || tierPrices.length !== tierIds.length) {
                        throw new Error('Tier prices required for paid minting phases');
                    }

                    // let totalCost = calculateTotalCost(tierIds, quantities, tierPrices);
                    // totalCost = toBN(totalCost);
                    let currentAllowance =
                        (usdcAllowance as ethers.BigNumber | undefined) ?? ethers.BigNumber.from(0);
                    currentAllowance = toBN(currentAllowance);
                    let currentBalance =
                        (usdcBalance as ethers.BigNumber | undefined) ?? ethers.BigNumber.from(0);
                    console.log("Allowance", currentBalance, currentAllowance, totalCost);
                    currentBalance = toBN(currentBalance);
                    if ((currentBalance as ethers.BigNumber).lt(totalCost as ethers.BigNumber)) {
                        throw new Error(
                            `Insufficient USDC balance. Need ${ethers.utils.formatUnits(totalCost, 6)} USDC`
                        );
                    }

                    if (currentAllowance.lt(totalCost)) {
                        if (!approveUSDC) throw new Error('USDC approval function not available');

                        warning(
                            'USDC Approval Required',
                            `Please approve ${ethers.utils.formatUnits(totalCost, 6)} USDC in the next transaction`
                        );

                        info('USDC Approval', 'Approving USDC spending…');

                        const approveTx = await usdc.approve(CONFIG.CINEFI_NFT_ADDRESS, totalCost);// approveUSDC({

                        info('Approval Submitted', 'Waiting for USDC approval confirmation…');
                        const approvalReceipt = await (approveTx as any).wait?.();
                        if (approvalReceipt?.status !== 1) throw new Error('USDC approval failed');

                        success(
                            'USDC Approved',
                            `${ethers.utils.formatUnits(totalCost, 6)} USDC spending approved successfully`
                        );
                    }
                }

                // Execute mint
                let tx: any;
                if (isClaimPhase) {
                    
                    // for (let i = 0; i < tierIds.length; i++) {
                    //     const claimedAmount = await nft.claimReserved(tierIds[i]);
                    //     console.log('Claimable amount', claimedAmount.toNumber() );
                    // }
                    console.log(' Going to Claim NFTs', 'Executing claim transaction…');
                    // try {
                    //     await nft.callStatic.claimNFT(tierIds, quantities, allocations, proofsHex, { from: address });
                    // } catch (error: any) {
                    //     const reason = decodeRevert(CineFiNFTABI as any[], error) || 'execution reverted';
                    //     console.log('Static call failed');
                    //     throw new Error(`In Claim simulation failed: ${reason}`);
                    // }

                    // Estimate gas (helps UX and avoids some wallets underestimating)
                    let gasLimit;
                    try {
                        gasLimit = await nft.estimateGas.claimNFT(tierIds, quantities, allocations, proofsHex);
                    } catch (e: any) {
                        // console.warn('Gas estimation failed, using manual limit');
                        gasLimit = ethers.BigNumber.from('500000'); // Fallback gas limit

                        // Try to get more error details
                        try {
                            await nft.callStatic.claimNFT(
                                tierIdsBN,
                                quantitiesBN,
                                allocationsBN,
                                proofsHex,
                                {
                                    from: address,
                                    gasLimit: gasLimit
                                }
                            );
                        } catch (staticError) {
                            console.error('Static call with gas limit also failed:', staticError);
                            throw staticError;
                        }
                        gasLimit: gasLimit.mul(110).div(100)
                        // const reason = decodeRevert(CineFiNFTABI as any[], e) || 'execution reverted';
                        // throw new Error(`Cannot estimate gas: ${reason}`);
                    }

                    info('Claiming NFTs', 'Executing claim transaction…', { gasLimit });
                    tx = await nft.claimNFT(tierIds, quantities, allocations, proofsHex, { from: address, gasLimit: gasLimit });
                } else {
                    console.log('Minting NFTs', 'Executing mint transaction…');
                    try {
                        await nft.callStatic.mintTier(tierIds, quantities, allocations, proofsHex, { from: address });
                    } catch (e: any) {
                        const reason = decodeRevert(CineFiNFTABI as any[], e) || 'execution reverted';
                        throw new Error(`Claim simulation failed: ${reason}`);
                    }

                    // Estimate gas (helps UX and avoids some wallets underestimating)
                    let gasLimit;
                    try {
                        gasLimit = await nft.estimateGas.mintTier(tierIds, quantities, allocations, proofsHex, { from: address });
                    } catch (e: any) {
                        const reason = decodeRevert(CineFiNFTABI as any[], e) || 'execution reverted';
                        throw new Error(`Cannot estimate gas: ${reason}`);
                    }
                    tx = await nft.mintTier(tierIdsBN, quantitiesBN, allocationsBN, proofsHex, { gasLimit });

                    info('Claiming NFTs', 'Executing claim transaction…');
                }

                setTxHash(tx.hash);

                info(
                    'Transaction Submitted',
                    `Transaction hash: ${tx.hash.slice(0, 10)}…`,
                    {
                        actions: [
                            {
                                label: 'View on Explorer',
                                action: () =>
                                    window.open(`${CONFIG.BLOCK_EXPLORER}/tx/${tx.hash}`, '_blank'),
                            },
                        ],
                    }
                );

                const receipt = await tx.wait();
                if (receipt.status !== 1) throw new Error('Transaction failed during execution');

                const tokenIds = await parseNFTMintTransaction(tx.hash, publicClient);
                await refetch();

                const totalMinted = quantities.reduce((sum, q) => sum + q, 0);
                success(
                    'Mint Successful!',
                    `Successfully ${isClaimPhase ? 'claimed' : 'minted'} ${totalMinted} NFT${totalMinted > 1 ? 's' : ''
                    } across ${tierIds.length} tier${tierIds.length > 1 ? 's' : ''}`,
                    {
                        duration: 10000,
                        actions: [
                            {
                                label: 'View Transaction',
                                action: () =>
                                    window.open(`${CONFIG.BLOCK_EXPLORER}/tx/${tx.hash}`, '_blank'),
                            },
                        ],
                        metadata: { tokenIds },
                    }
                );

                return { success: true, txHash: tx.hash, tokenIds };
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                notifyError('Mint Failed', errorMessage, {
                    duration: 10000,
                    actions: txHash
                        ? [
                            {
                                label: 'View Transaction',
                                action: () =>
                                    window.open(`${CONFIG.BLOCK_EXPLORER}/tx/${txHash}`, '_blank'),
                            },
                        ]
                        : undefined,
                });
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [
            address,
            validation,
            walletClient,
            usdcBalance,
            usdcAllowance,
            approveUSDC,
            //   mintTierWrite,
            //   claimTierWrite,
            calculateTotalCost,
            refetch,
            success,
            notifyError,
            info,
            warning,
            publicClient,
            provider,
        ]
    );

    return {
        mint,
        loading,
        txHash,
        isLoading: loading,
        usdcBalance,
        usdcAllowance,
    };
}