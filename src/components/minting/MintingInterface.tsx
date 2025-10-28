import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { ethers } from 'ethers';
import { useContractInfo } from '../../utils/transactions/useContractInfo.ts';
import { useUSDC } from '../../utils/transactions/useUSDC.ts';
import { useMinting } from '../../utils/transactions/useMinting.ts';

const MintingInterface: React.FC = () => {
    const [quantity, setQuantity] = useState('1');
    const [tokenURIs, setTokenURIs] = useState<string[]>(['']);
    const [notification, setNotification] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

    const { isConnected } = useAccount();
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();
    const { info } = useContractInfo();
    const { balance, allowance, approveUSDC } = useUSDC();
    const { mintNFT, loading: mintLoading } = useMinting();

    const BASE_SEPOLIA_CHAIN_ID = 43113;
    const isCorrectNetwork = chain?.id === BASE_SEPOLIA_CHAIN_ID;

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const qty = parseInt(e.target.value) || 1;
        setQuantity(qty.toString());

        // Generate metadata URLs for testing
        const newTokenURIs = Array(qty).fill('').map((_, index) => {
            // CineFi Test Metadata: Pre-deployed collection with 50 ready-to-use NFT metadata
            // These point to actual JSON metadata files with images, hosted on Pinata IPFS
            const metadataIndex = index % 50; // Cycle through available metadata if qty > 50
            return `https://chocolate-sparkling-tortoise-742.mypinata.cloud/ipfs/bafybeiegoefdsxewtetocfc6vgppgxk4wthjiuucilttokpr7ne63rjcti/${metadataIndex}.json`;

            // Alternative: Direct IPFS (may require IPFS gateway configuration)
            // return `ipfs://bafybeiegoefdsxewtetocfc6vgppgxk4wthjiuucilttokpr7ne63rjcti/${metadataIndex}.json`;

            // Alternative: Your own metadata
            // return `https://your-domain.com/metadata/${index}.json`;
        });
        setTokenURIs(newTokenURIs);
    };

    /**
     * Test Metadata Available:
     * - 50 pre-configured NFT metadata files (0.json to 49.json)
     * - Hosted on Pinata IPFS with proper CORS headers
     * - Each includes name, description, image, and attributes
     * - Ready for immediate testing without additional setup
     */

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification({ type: null, message: '' }), 5000);
    };

    const handleApproveUSDC = async () => {
        try {
            if (!info) throw new Error('Contract info not loaded');

            const mintPriceBN = (ethers as any).utils.parseUnits(info.mintPrice, 6);
            const quantityBN = (ethers as any).BigNumber.from(parseInt(quantity) || 0);
            const totalCostBN = mintPriceBN.mul(quantityBN);

            await approveUSDC(totalCostBN);
            showNotification('success', 'USDC approval successful!');
        } catch (error) {
            showNotification('error', error instanceof Error ? error.message : 'Approval failed');
        }
    };

    const handleMint = async () => {
        try {
            const result = await mintNFT(parseInt(quantity), tokenURIs);
            showNotification(
                'success',
                `Minting successful! Token IDs: ${result.tokenIds.join(', ')}`
            );
        } catch (error) {
            showNotification('error', error instanceof Error ? error.message : 'Minting failed');
        }
    };

    // Calculate costs using BigNumbers
    const mintPriceBN = (ethers as any).utils.parseUnits(info?.mintPrice || '0', 6);
    const quantityBN = (ethers as any).BigNumber.from(parseInt(quantity) || 0);
    const totalCostBN = mintPriceBN.mul(quantityBN);
    const totalCostFormatted = (ethers as any).utils.formatUnits(totalCostBN, 6);

    const balanceBN = (ethers as any).utils.parseUnits(balance || '0', 6);
    const allowanceBN = (ethers as any).utils.parseUnits(allowance || '0', 6);
    const hasEnoughBalance = balanceBN.gte(totalCostBN);
    const hasEnoughAllowance = allowanceBN.gte(totalCostBN);
    const canMint = hasEnoughBalance && hasEnoughAllowance && isCorrectNetwork;

    return (
        <div className="max-w-2xl mx-auto p-6 mt-[100px] bg-black">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">CineFi NFT Minting</h1>
                <ConnectButton />
            </div>

            {/* Notification */}
            {notification.type && (
                <div className={`mb-4 p-4 rounded-lg ${
                    notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {notification.message}
                </div>
            )}

            {/* Network Warning */}
            {isConnected && !isCorrectNetwork && (
                <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
                    <p className="text-yellow-800 mb-2">Wrong network detected</p>
                    <button
                        onClick={() => switchNetwork?.(BASE_SEPOLIA_CHAIN_ID)}
                        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                        Switch to Base Sepolia
                    </button>
                </div>
            )}

            {/* Contract Info */}
            {info && (
                <div style={{
                    background: "black"
                }} className="mb-6 p-4 bg-gray-100 rounded-lg !bg-black">
                    <h2 className="font-semibold mb-2">Contract Information</h2>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Total Supply: {info.totalSupply}/{info.maxSupply}</div>
                        <div>Available: {info.available}</div>
                        <div>Mint Price: {info.mintPrice} USDC</div>
                        <div>Max per Wallet: {info.maxMintPerWallet}</div>
                    </div>
                </div>
            )}

            {/* User Balance Info */}
            {isConnected && (
                <div style={{
                    background: "black"
                }} className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h2 className="font-semibold mb-2">Your Balances</h2>
                    <div className="space-y-1 text-sm">
                        <div>USDC Balance: {balance} USDC</div>
                        <div>USDC Allowance: {allowance} USDC</div>
                        <div className={hasEnoughBalance ? 'text-green-600' : 'text-red-600'}>
                            Balance Status: {hasEnoughBalance ? '✅ Sufficient' : '❌ Insufficient'}
                        </div>
                    </div>
                </div>
            )}

            {/* Minting Controls */}
            {isConnected && isCorrectNetwork && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Quantity to Mint
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-600">
                            Total Cost: {totalCostFormatted} USDC
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                        {!hasEnoughAllowance && hasEnoughBalance && (
                            <button
                                onClick={handleApproveUSDC}
                                className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                                disabled={!hasEnoughBalance}
                            >
                                Approve {totalCostFormatted} USDC
                            </button>
                        )}

                        <button
                            onClick={handleMint}
                            disabled={!canMint || mintLoading}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {mintLoading ? (
                                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Minting...
                </span>
                            ) : (
                                `Mint ${quantity} NFT${parseInt(quantity) > 1 ? 's' : ''}`
                            )}
                        </button>

                        {!canMint && isConnected && (
                            <p className="text-red-600 text-sm text-center">
                                {!hasEnoughBalance && 'Insufficient USDC balance. '}
                                {!hasEnoughAllowance && hasEnoughBalance && 'USDC approval required. '}
                                {!isCorrectNetwork && 'Wrong network. '}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MintingInterface;
