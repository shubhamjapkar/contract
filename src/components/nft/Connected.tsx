import MintNft from "./MintNft.tsx";
import {adminAPI} from "../../services/adminAPI.ts";
import {IWhitelistValidation} from "../../interface/IContracts.ts";
import {MintPhase} from "../../interface/api.ts";
import {getContractService} from "../../services/blockchain/contractService.ts";
import React, {useEffect, useState} from "react";
import {useAccount} from "wagmi";
import {useWallet} from "../provider/WalletProvider.tsx";
import {NotWhitListed} from "./NotWhitListed.tsx";

export default function Connected() {
    const [whitelistedLoading, setWhitelistedLoading] = useState(true);
    const [whiteListedStatus, setWhiteListedStatus] = useState(false); // 0
    const [whitelistedTiers, setWhitelistedTiers] = useState<any>(null);

    const { address } = useAccount();
    const { currentPhase, provider, refetchCurrentPhase } = useWallet();

    async function checkWhitelisted(newAddress = address) {
        try {
            setWhitelistedLoading(true)
            const [status] = await Promise.all([
                adminAPI.getWhitelistStatus(newAddress)
            ]);

            const currentPhaseEntries = status?.entries;

            if (!currentPhaseEntries || currentPhaseEntries.length === 0) {
                setWhiteListedStatus(false)
                setWhitelistedLoading(false)
            } else {
                setWhiteListedStatus(true)

                const validationData: IWhitelistValidation = {
                    isWhitelisted: currentPhaseEntries.length > 0,
                    currentPhase,
                    entries: [],
                };

                for (const entry of currentPhaseEntries) {
                    let alreadyMinted = 0;

                    try {
                        if (entry.phaseId === MintPhase.CLAIM) {
                            alreadyMinted = await getContractService(provider).getClaimedPerTier(newAddress, entry.tierId);
                        } else if (entry.phaseId === MintPhase.GUARANTEED) {
                            alreadyMinted = await getContractService(provider).getMintedPerTierPerPhase(newAddress, entry.tierId, entry.phaseId);
                        } else if (entry.phaseId === MintPhase.FCFS) {
                            alreadyMinted = await getContractService(provider).getMintedPerTierPerPhase(newAddress, entry.tierId, entry.phaseId);
                        }
                    } catch (err) {
                        console.warn(`Failed to get minted count for tier ${entry.tierId}:`, err);
                    }

                    validationData.entries.push({
                        ...entry,
                        alreadyMinted,
                        remaining: Math.max(0, entry.allowedQuantity - alreadyMinted)
                    });
                }

                setWhitelistedTiers(validationData)
                setWhitelistedLoading(false)
            }
        } catch (e) {
            setWhiteListedStatus(false)
            setWhitelistedLoading(false)
        }
    }

    useEffect(() => {
        if (address && currentPhase !== null) {
            checkWhitelisted(address)
        }

        if (address) {
            refetchCurrentPhase()
        }
    }, [address, currentPhase])

    if (whitelistedLoading) {
        return <div
            className="flex flex-col sticky top-[132px] self-start max-w-[450px] w-full h-full xl:h-[650px] xl:max-h-[calc(100svh_-_172px)] bg-[#161616]  xl:pt-6 gap-4 items-start  xl:border-l xl:border-white/20 backdrop-blur-[20px] mx-auto">
            <div className="flex flex-col h-full w-full justify-center items-center gap-2 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Checking whitelist status...</p>
            </div>
        </div>
    }

    if (whiteListedStatus === false) {
        return <NotWhitListed />
    }

    return <MintNft whitelistedTiers={whitelistedTiers} checkWhitelisted={checkWhitelisted} />
}