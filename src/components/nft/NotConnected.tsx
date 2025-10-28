import React, {useEffect, useState} from "react";
import moment from "moment";
import {useWallet} from "../provider/WalletProvider.tsx";
import {adminAPI} from "../../services/adminAPI.ts";
import {formatNumber, formatUSDC} from "../../utils/numberFormatting.ts";
import {MintPhase} from "../../interface/api.ts";
import {getContractService} from "../../services/blockchain/contractService.ts";
import {CONFIG} from "../../config/environment.ts";
import CineFiNFTABI from '../../abi/cinefi-nft-abi.json';
import {IWhitelistValidation} from "../../interface/IContracts.ts";
import {useAccount, useContractReads} from "wagmi";

function GetTitleAndTime() {
    const [countdown, setCountdown] = useState("0d : 0hr : 0m : 0s");
    const {activeProject, mintStatus, currentPhase} = useWallet()

    const startDate = activeProject.startData;
    const endDate = activeProject.endDate;


    useEffect(() => {
        const updateCountdown = () => {
            const now = moment();
            let targetDate: moment.Moment;

            if (mintStatus === 1) {
                targetDate = moment(startDate, "DD/MM/YYYY");
            } else if (mintStatus === 2) {
                targetDate = moment(endDate, "DD/MM/YYYY");
            } else {
                setCountdown(moment(endDate, "DD/MM/YYYY").format("DD/MM/YYYY"));
                return;
            }

            const duration = moment.duration(targetDate.diff(now));

            if (duration.asSeconds() <= 0) {
                setCountdown(moment(endDate, "DD/MM/YYYY").format("DD/MM/YYYY"));
                return;
            }

            const days = Math.floor(duration.asDays());
            const hours = duration.hours();
            const minutes = duration.minutes();
            const seconds = duration.seconds();

            setCountdown(`${days}d : ${hours}hr : ${minutes}m : ${seconds}s`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [startDate, endDate, mintStatus]);

    if (mintStatus === 1) {
        return <div className={"flex w-full gap-2 items-center"}>
            <div className={"flex gap-1"}>
                Phase {currentPhase} Mint Starts In:
            </div>
            <div
                className="flex pt-[6px] pr-[6px] pb-[6px] pl-[6px] gap-[10px] justify-center items-center shrink-0  bg-[rgba(22,161,73,0.24)]">
                          <span
                              className="h-[18px] shrink-0 basis-auto text-[16px] font-bold leading-[17.6px] text-[#16a149] text-left ">
                            {countdown}
                          </span>
            </div>
        </div>
    } else if (mintStatus === 2) {
        return <div className={"flex w-full gap-2 items-center"}>
            <div className={"flex gap-1"}>
                Phase {currentPhase} Mint Ends In:
            </div>
            <div
                className="flex pt-[6px] pr-[6px] pb-[6px] pl-[6px] gap-[10px] justify-center items-center shrink-0  bg-[#ff4c4c3d]">
                          <span
                              className="h-[18px] shrink-0 basis-auto text-[16px] font-bold leading-[17.6px] text-[#FF4C4C] text-left ">
                            {countdown}
                          </span>
            </div>
        </div>
    } else {
        return <div className={"flex w-full gap-2 items-center"}>
            <div className={"flex gap-1"}>
                Phase {currentPhase} Mint Has Ended
            </div>
            <div
                className="flex pt-[6px] pr-[6px] pb-[6px] pl-[6px] gap-[10px] justify-center items-center shrink-0  bg-[#ff4c4c3d]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M15.8333 4.16669H4.16667C3.24619 4.16669 2.5 4.91288 2.5 5.83335V16.6667C2.5 17.5872 3.24619 18.3334 4.16667 18.3334H15.8333C16.7538 18.3334 17.5 17.5872 17.5 16.6667V5.83335C17.5 4.91288 16.7538 4.16669 15.8333 4.16669Z"
                        stroke="#D4C3C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5.83333 1.66669V4.16669M14.1667 1.66669V4.16669M2.5 8.33335H17.5" stroke="#D4C3C3"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span
                    className="h-[18px] shrink-0 basis-auto text-[16px] font-bold leading-[17.6px] text-[#FF4C4C] text-left ">
                            {countdown}
                          </span>
            </div>
        </div>
    }
}

function Tier({tier}) {

    if (tier?.tierId === 1) {
        return <div className="flex gap-2 pt-[8px] pr-0 pb-[8px] pl-0 items-center self-stretch shrink-0">
            <div style={{
                background: "linear-gradient(180deg, rgba(221, 221, 221, 0.24) 0%, rgba(77, 77, 77, 0.24) 100%)"
            }} className="flex p-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33"
                     fill="none">
                    <path
                        d="M11.3332 16.5C12.0404 16.5 12.7187 16.219 13.2188 15.7189C13.7189 15.2188 13.9998 14.5406 13.9998 13.8333C13.9998 13.1261 13.7189 12.4478 13.2188 11.9477C12.7187 11.4476 12.0404 11.1666 11.3332 11.1666C10.6259 11.1666 9.94765 11.4476 9.44755 11.9477C8.94746 12.4478 8.66651 13.1261 8.66651 13.8333C8.66651 14.5406 8.94746 15.2188 9.44755 15.7189C9.94765 16.219 10.6259 16.5 11.3332 16.5ZM15.3332 1.83331L27.9998 9.16665V23.8333L15.3332 31.1667L2.6665 23.8333V9.16665L15.3332 1.83331ZM5.33317 10.704V22.296L8.49584 24.1266L19.2598 16.2333L25.3332 19.8787V10.7053L15.3332 4.91331L5.33317 10.704Z"
                        fill="white"/>
                </svg>
            </div>
            <div
                className="flex flex-col gap-[6px] justify-center items-start shrink-0 flex-nowrap relative z-[7]">
                                    <span
                                        className="shrink-0 basis-auto  text-[16px] font-bold leading-[19px] text-[#fff] relative text-left whitespace-nowrap z-[8]">
                                      {tier.name} Tier
                                    </span>
                <div
                    className="flex w-[165px] gap-[6px] items-start shrink-0 flex-nowrap relative z-[9]">
                              <span
                                  className="h-[17px] shrink-0 basis-auto  text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left whitespace-nowrap z-10">
                                Available: {formatNumber(tier.remaining)},
                              </span>
                    <span
                        className="h-[17px] shrink-0 basis-auto  text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left whitespace-nowrap z-[11]">
                                ${formatUSDC(tier.price)} each
                              </span>
                </div>
                <div
                    className="flex w-[82px] pt-[6px] pr-[8px] pb-[6px] pl-[8px] gap-[10px] justify-center items-center shrink-0 flex-nowrap bg-[rgba(0,163,255,0.24)] rounded-[2px] relative z-[12]">
                              <span
                                  className="h-[14px] shrink-0 basis-auto  text-[12px] font-medium leading-[14px] text-[#00a3ff] relative text-left uppercase whitespace-nowrap z-[13]">
                                rarity: 2%
                              </span>
                </div>
            </div>
        </div>
    } else if (tier?.tierId === 2) {
        return <div className="flex gap-2 pt-[8px] pr-0 pb-[8px] pl-0 items-center self-stretch shrink-0">
            <div style={{
                background: "linear-gradient(180deg, rgba(255, 201, 115, 0.24) 0%, rgba(153, 117, 60, 0.24) 100%)"
            }} className="flex p-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33"
                     fill="none">
                    <path
                        d="M11.3332 16.5C12.0404 16.5 12.7187 16.219 13.2188 15.7189C13.7189 15.2188 13.9998 14.5406 13.9998 13.8333C13.9998 13.1261 13.7189 12.4478 13.2188 11.9477C12.7187 11.4476 12.0404 11.1666 11.3332 11.1666C10.6259 11.1666 9.94765 11.4476 9.44755 11.9477C8.94746 12.4478 8.66651 13.1261 8.66651 13.8333C8.66651 14.5406 8.94746 15.2188 9.44755 15.7189C9.94765 16.219 10.6259 16.5 11.3332 16.5ZM15.3332 1.83331L27.9998 9.16665V23.8333L15.3332 31.1667L2.6665 23.8333V9.16665L15.3332 1.83331ZM5.33317 10.704V22.296L8.49584 24.1266L19.2598 16.2333L25.3332 19.8787V10.7053L15.3332 4.91331L5.33317 10.704Z"
                        fill="white"/>
                </svg>
            </div>
            <div
                className="flex flex-col gap-[6px] justify-center items-start shrink-0 flex-nowrap relative z-[7]">
                                    <span
                                        className="shrink-0 basis-auto  text-[16px] font-bold leading-[19px] text-[#fff] relative text-left">
                                      {tier.name} Tier
                                    </span>
                <div
                    className="flex w-[165px] gap-[6px] items-start shrink-0 flex-nowrap relative z-[9]">
                              <span
                                  className="h-[17px] shrink-0 basis-auto  text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left whitespace-nowrap z-10">
                                Available: {formatNumber(tier.remaining)},
                              </span>
                    <span
                        className="h-[17px] shrink-0 basis-auto  text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left whitespace-nowrap z-[11]">
                                ${formatUSDC(tier.price)} each
                              </span>
                </div>
                <div
                    className="flex w-[82px] pt-[6px] pr-[8px] pb-[6px] pl-[8px] gap-[10px] justify-center items-center shrink-0 flex-nowrap bg-[#ff8a003d] rounded-[2px] relative z-[12]">
                              <span
                                  className="h-[14px] shrink-0 basis-auto  text-[12px] font-medium leading-[14px] text-[#FF8A00] relative text-left uppercase whitespace-nowrap z-[13]">
                                rarity: 2%
                              </span>
                </div>
            </div>
        </div>
    } else if (tier?.tierId === 3) {
        return <div className="flex gap-2 pt-[8px] pr-0 pb-[8px] pl-0 items-center self-stretch shrink-0">
            <div style={{
                background: "linear-gradient(rgb(255 251 251 / 82%) 0%, rgba(77, 77, 77, 0.24) 100%)"
            }} className="flex p-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33"
                     fill="none">
                    <path
                        d="M11.3332 16.5C12.0404 16.5 12.7187 16.219 13.2188 15.7189C13.7189 15.2188 13.9998 14.5406 13.9998 13.8333C13.9998 13.1261 13.7189 12.4478 13.2188 11.9477C12.7187 11.4476 12.0404 11.1666 11.3332 11.1666C10.6259 11.1666 9.94765 11.4476 9.44755 11.9477C8.94746 12.4478 8.66651 13.1261 8.66651 13.8333C8.66651 14.5406 8.94746 15.2188 9.44755 15.7189C9.94765 16.219 10.6259 16.5 11.3332 16.5ZM15.3332 1.83331L27.9998 9.16665V23.8333L15.3332 31.1667L2.6665 23.8333V9.16665L15.3332 1.83331ZM5.33317 10.704V22.296L8.49584 24.1266L19.2598 16.2333L25.3332 19.8787V10.7053L15.3332 4.91331L5.33317 10.704Z"
                        fill="white"/>
                </svg>
            </div>
            <div
                className="flex flex-col gap-[6px] justify-center items-start shrink-0 flex-nowrap relative z-[7]">
                                    <span
                                        className="shrink-0 basis-auto  text-[16px] font-bold leading-[19px] text-[#fff] relative text-left whitespace-nowrap z-[8]">
                                      {tier.name} Tier
                                    </span>
                <div
                    className="flex w-[165px] gap-[6px] items-start shrink-0 flex-nowrap relative z-[9]">
                              <span
                                  className="h-[17px] shrink-0 basis-auto  text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left whitespace-nowrap z-10">
                                Available: {formatNumber(tier.remaining)},
                              </span>
                    <span
                        className="h-[17px] shrink-0 basis-auto  text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left whitespace-nowrap z-[11]">
                                ${formatUSDC(tier.price)} each
                              </span>
                </div>
                <div
                    className="flex w-[82px] pt-[6px] pr-[8px] pb-[6px] pl-[8px] gap-[10px] justify-center items-center shrink-0 flex-nowrap bg-[#a8a8a8cc] rounded-[2px] relative z-[12]">
                              <span
                                  className="h-[14px] shrink-0 basis-auto  text-[12px] font-medium leading-[14px] text-[#ffffffcc] relative text-left uppercase whitespace-nowrap z-[13]">
                                rarity: 4%
                              </span>
                </div>
            </div>
        </div>
    }
}

function GetTiers({whitelistedTiers}) {
    if (!whitelistedTiers) {
        return <div>Loading...</div>
    }

    const [open, setOpen] = useState(false);

    const tierReadContracts = whitelistedTiers.entries.map(entry => ({
        address: CONFIG.CINEFI_NFT_ADDRESS as `0x${string}`,
        abi: CineFiNFTABI,
        functionName: 'getTier',
        args: [entry.tierId],
    }));

    const {data: tierData} = useContractReads({
        contracts: tierReadContracts as any,
        enabled: whitelistedTiers.entries.length > 0,
    });

    if (!tierData) {
        return <div>Loading...</div>
    }

    const phasesName = ["Claim Phase", "Guaranteed Phase", "FCFS Phase"];
    const tierIds = [1, 2, 3];
    const phaseIds = [1, 2, 3];
    const entries = whitelistedTiers.entries.map((e, i) => {
        if (tierData[i].status === "success") {
            return {
                ...e,
                ...(tierData[i]?.result as any || {})
            };
        }
        return null;
    })?.filter(Boolean) || [];

    const getTier = (phaseId, tierId) => {
        return entries.find((t) => t.phaseId === phaseId && t.tierId === tierId)
    };

    return (
        <div>
            <table className="min-w-full border border-[#ffffff4d] ">
                <thead>
                <tr>
                    {phasesName.map((p) => (
                        <th key={p}
                            className="text-[#909093] text-[12px] leading-[15px] font-medium  border border-[#ffffff4d] px-[16px] py-2.5 text-center">
                            Phase {p}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {tierIds.map((tier) => (
                    <tr key={tier}>
                        {phaseIds.map((phase) => {
                            const t = getTier(phase, tier);
                            const remaining = t?.remaining ? formatNumber(t.remaining) : 0;

                            return (
                                <td key={phase}
                                    className="border border-[#ffffff4d] text-[12px] text-[#FFF] px-4 py-2 text-center font-semibold">
                                    {t ? (
                                        <>
                                            {remaining} {t.name}
                                        </>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>

            <div>
                <div onClick={() => {
                    setOpen(e => !e)
                }} className="flex flex-row gap-2 text-[14px] font-medium leading-[21px] py-[16px] text-[#909093] cursor-pointer">
                    <span>What are phases?</span>

                    <span className={`flex items-center transform transition-transform duration-300 ${open ? "rotate-0" : "rotate-180"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M7.67442 6.48366L2.77442 11.3837C2.60775 11.5503 2.41331 11.631 2.19108 11.6257C1.96886 11.6203 1.77442 11.5341 1.60775 11.367C1.44108 11.1999 1.35775 11.0054 1.35775 10.7837C1.35775 10.5619 1.44108 10.3674 1.60775 10.2003L6.72442 5.06699C6.85775 4.93366 7.00775 4.83366 7.17442 4.76699C7.34109 4.70033 7.50775 4.66699 7.67442 4.66699C7.84109 4.66699 8.00775 4.70033 8.17442 4.76699C8.34109 4.83366 8.49109 4.93366 8.62442 5.06699L13.7578 10.2003C13.9244 10.367 14.0051 10.5643 13.9998 10.7923C13.9944 11.0203 13.9082 11.2174 13.7411 11.3837C13.574 11.5499 13.3795 11.6332 13.1578 11.6337C12.936 11.6341 12.7415 11.5508 12.5744 11.3837L7.67442 6.48366Z"
                                fill="#D4C3C3"/>
                        </svg>
                    </span>
                </div>

                <div
                    className={`flex gap-4.5 p-2 flex-col justify-between items-start bg-[rgba(57,56,56,0.3)] rounded-[8px] transition-all duration-500 ease-in-out overflow-hidden  ${open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 mt-3"}`}>
                    <div className="flex flex-col gap-[8px] items-start self-stretch shrink-0">
                    <span
                        className="shrink-0 basis-auto  text-[14px] font-medium leading-[18px] text-[#d4c3c3] relative text-left whitespace-nowrap z-[1]">
                      Claim Phase
                    </span>
                        <span
                            className=" self-stretch shrink-0 basis-auto  text-[14px] font-medium leading-[21px] text-[#909093] relative text-left">
                      User can claim free NFTs available on their whitelisted address.
                    </span>
                    </div>
                    <div className={"w-full h-[1px] bg-[#fff3]"}></div>
                    <div
                        className="flex flex-col gap-[8px] items-start self-stretch shrink-0 flex-nowrap relative z-[4]">
                    <span
                        className="h-[18px] shrink-0 basis-auto  text-[14px] font-medium leading-[18px] text-[#d4c3c3] relative text-left">
                      Guaranteed Phase
                    </span>
                        <span
                            className=" self-stretch shrink-0 basis-auto  text-[14px] font-medium leading-[21px] text-[#909093] relative text-left">
                      User can Available Mint NFTs on their whitelisted address.
                    </span>
                    </div>
                    <div className={"w-full h-[1px] bg-[#fff3]"}></div>
                    <div
                        className="flex flex-col gap-[8px] items-start self-stretch shrink-0 flex-nowrap relative z-[8]">
                    <span
                        className="h-[18px] shrink-0 basis-auto  text-[14px] font-medium leading-[18px] text-[#d4c3c3] relative text-left">
                      FCFS Phase
                    </span>
                        <span
                            className="self-stretch shrink-0 basis-auto  text-[14px] font-medium leading-[21px] text-[#909093] relative text-left ">
                      User can Available Mint NFTs on their whitelisted address.
                    </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function NotConnected() {
    const [inputDisable, setInputDisable] = useState(false)
    const [whitelistedTiers, setWhitelistedTiers] = useState<any>(null);
    const [whiteListedStatus, setWhiteListedStatus] = useState(0); // 0
    const {activeProject, provider, mintStatus} = useWallet()
    const {address} = useAccount();

    const isConnected = !!address;

    async function checkWhitelisted(address: string) {
        try {
            setInputDisable(true)
            const [status] = await Promise.all([
                adminAPI.getWhitelistStatus(address)
            ]);

            const phasesEntries = status?.entries

            if (!phasesEntries || phasesEntries?.length === 0) {
                setWhiteListedStatus(-1)
            } else {
                setWhiteListedStatus(1)
                setInputDisable(false)

                const validationData: IWhitelistValidation = {
                    isWhitelisted: phasesEntries.length > 0,
                    entries: [],
                };

                for (const entry of phasesEntries) {
                    let alreadyMinted = 0;

                    try {
                        if (entry.phaseId === MintPhase.CLAIM) {
                            alreadyMinted = await getContractService(provider).getClaimedPerTier(address, entry.tierId);
                        } else if (entry.phaseId === MintPhase.GUARANTEED) {
                            alreadyMinted = await getContractService(provider).getMintedPerTierPerPhase(address, entry.tierId, entry.phaseId);
                        } else if (entry.phaseId === MintPhase.FCFS) {
                            alreadyMinted = await getContractService(provider).getMintedPerTierPerPhase(address, entry.tierId, entry.phaseId);
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
            }
        } catch (e) {
            setWhiteListedStatus(-1)
            setInputDisable(false)
        }
    }

    useEffect(() => {
        if (address) {
            checkWhitelisted(address)
        }
    }, [address])

    if (!activeProject || mintStatus === -1) {
        return null
    }

    return <div
        className="flex flex-col sticky top-[132px] self-start max-w-[450px] w-full h-full xl:h-[650px] xl:max-h-[calc(100svh_-_172px)] bg-[#161616]  pt-6 items-start backdrop-blur-[20px] mx-auto overflow-y-scroll no-scrollbar">
        <div className="px-4 pb-[16px] border-b-[1px] border-b-[#fff3] w-full">
            <div className="text-[22px] font-bold leading-[24px] text-[#d4c3c3] text-left">
                Mint
            </div>
            <GetTitleAndTime/>
        </div>

        <div className="flex justify-between grow px-4 flex-col gap-[16px] items-center overflow-y-scroll no-scrollbar w-full py-4 ">
            {mintStatus === 3 ? <div className={"flex flex-col gap-2 justify-center items-center h-full w-full"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path
                        d="M17 24C18.0609 24 19.0783 23.5786 19.8284 22.8284C20.5786 22.0783 21 21.0609 21 20C21 18.9391 20.5786 17.9217 19.8284 17.1716C19.0783 16.4214 18.0609 16 17 16C15.9391 16 14.9217 16.4214 14.1716 17.1716C13.4214 17.9217 13 18.9391 13 20C13 21.0609 13.4214 22.0783 14.1716 22.8284C14.9217 23.5786 15.9391 24 17 24ZM23 2L42 13V35L23 46L4 35V13L23 2ZM8 15.306V32.694L12.744 35.44L28.89 23.6L38 29.068V15.308L23 6.62L8 15.306Z"
                        fill="#D4C3C3"/>
                </svg>
                <div>
                    You didn’t mint any NFT for this project.
                </div>
            </div> : <div className="flex grow flex-col gap-[16px] items-center self-stretch shrink-0">
                <div className="flex flex-col gap-[16px] w-full">
                    <div
                        className="flex py-3.5 px-[16px] gap-[6px] items-center self-stretch shrink-0 border border-[#4d4d53] relative rounded">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="16"
                            viewBox="0 0 22 20"
                            fill="none"
                        >
                            <path
                                d="M19.8 4.44444V2.22222C19.8 0.996667 18.8133 0 17.6 0H3.3C1.4806 0 0 1.49556 0 3.33333V16.6667C0 19.1122 1.9734 20 3.3 20H19.8C21.0133 20 22 19.0033 22 17.7778V6.66667C22 5.44111 21.0133 4.44444 19.8 4.44444ZM17.6 14.4444H15.4V10H17.6V14.4444ZM3.3 4.44444C3.01677 4.43165 2.74935 4.30899 2.5534 4.10202C2.35746 3.89505 2.24811 3.61971 2.24811 3.33333C2.24811 3.04696 2.35746 2.77162 2.5534 2.56465C2.74935 2.35767 3.01677 2.23502 3.3 2.22222H17.6V4.44444H3.3Z"
                                fill="#D4C3C3"
                            />
                        </svg>

                        <input
                            disabled={inputDisable || isConnected}
                            value={address}
                            type="text"
                            maxLength={42}
                            placeholder="Input Ethereum Wallet Address"
                            onChange={(e) => {
                                setWhiteListedStatus(0)
                                setWhitelistedTiers(null)
                                if (e.target.value.length === 42) {
                                    checkWhitelisted(e.target.value || "");
                                }
                            }}
                            className="bg-transparent outline-none text-[14px] text-[#efefef] disabled:text-[#808080] placeholder:opacity-40 leading-[16.8px] w-full"
                        />
                    </div>

                    {(whiteListedStatus === 0) && <span
                        className="flex justify-start items-start self-stretch shrink-0 text-[16px] font-normal leading-[24px] text-[rgba(212,195,195,0.9)] text-left">
                    Input your Ethereum address to check if you are eligible for the NFT
                    mint or simply connect your wallet to check.
                  </span>}

                    {(whiteListedStatus === -1) && <div className={"flex gap-2 justify-center items-center"}>
                    <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                              d="M8 1C4.1 1 1 4.1 1 8C1 11.9 4.1 15 8 15C11.9 15 15 11.9 15 8C15 4.1 11.9 1 8 1ZM10.7 11.5L8 8.8L5.3 11.5L4.5 10.7L7.2 8L4.5 5.3L5.3 4.5L8 7.2L10.7 4.5L11.5 5.3L8.8 8L11.5 10.7L10.7 11.5Z"
                              fill="#F1476A"/>
                        </svg>
                        </span>
                        <span
                            className="flex justify-start items-start text-[16px] font-normal leading-[24px] text-[rgba(212,195,195,0.9)] text-left">
                    Your wallet is not whitelisted. Contact us for future opportunities to invest
                  </span>
                    </div>}

                    {(whiteListedStatus === 1) && <>
                        <div className={"flex flex-col gap-4 w-full"}>
                            <div className={"flex gap-2 items-center"}>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"
                                         fill="none">
                                      <g clipPath="url(#clip0_630_16650)">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M0 7.5C0 5.51088 0.790176 3.60322 2.1967 2.1967C3.60322 0.790176 5.51088 0 7.5 0C9.48912 0 11.3968 0.790176 12.8033 2.1967C14.2098 3.60322 15 5.51088 15 7.5C15 9.48912 14.2098 11.3968 12.8033 12.8033C11.3968 14.2098 9.48912 15 7.5 15C5.51088 15 3.60322 14.2098 2.1967 12.8033C0.790176 11.3968 0 9.48912 0 7.5ZM7.072 10.71L11.39 5.312L10.61 4.688L6.928 9.289L4.32 7.116L3.68 7.884L7.072 10.71Z"
                                              fill="#16A149"/>
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_630_16650">
                                          <rect width="15" height="15" fill="white"/>
                                        </clipPath>
                                      </defs>
                                    </svg>
                                </span>
                                <span className={"text-[#909093] text-[14px] font-medium leading-[21px]"}>
                                    Your wallet is whitelisted and can mint the following number of NFTs across phases
                                </span>
                            </div>
                        </div>

                        <GetTiers whitelistedTiers={whitelistedTiers}/>
                    </>}
                </div>
            </div>}
        </div>

        <div className="flex w-full pt-[16px] pr-[24px] pb-[16px] pl-[24px] flex-col gap-[17px] items-start shrink-0 border-t-[1px] border-t-[#fff3]">
            {mintStatus === 1 && <div onClick={() => {
                window.open("https://calendar.google.com/calendar/u/0/r/eventedit?text=Team+Sync&dates=20251014T153000Z/20251014T160000Z&details=Weekly+sync+with+team&location=Google+Meet", "_blank")
            }}
                  className={"flex justify-center items-center gap-2 border border-[#ffffff4d] py-2.5 w-full cursor-pointer"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <g clipPath="url(#clip0_630_16625)">
                        <path
                            d="M15.8333 4.41663H4.16667C3.24619 4.41663 2.5 5.16282 2.5 6.08329V16.9166C2.5 17.8371 3.24619 18.5833 4.16667 18.5833H15.8333C16.7538 18.5833 17.5 17.8371 17.5 16.9166V6.08329C17.5 5.16282 16.7538 4.41663 15.8333 4.41663Z"
                            stroke="#D4C3C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.83333 1.91663V4.41663M14.1667 1.91663V4.41663M2.5 8.58329H17.5" stroke="#D4C3C3"
                              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_630_16625">
                            <rect width="20" height="20" fill="white" transform="translate(0 0.25)"/>
                        </clipPath>
                    </defs>
                </svg>
                <span className={"text-[12px] text-[#EFEFEF] leading-[14.4px]"}>Add to calendar</span>
            </div>}
            <div className="flex gap-[4px] justify-center items-center self-stretch shrink-0">
                <svg width="30" height="24" viewBox="0 0 30 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="24" fill="url(#pattern0_119_1388)"/>
                    <defs>
                        <pattern id="pattern0_119_1388" patternContentUnits="objectBoundingBox"
                                 width="1" height="1">
                            <use href="#image0_119_1388"
                                 transform="matrix(0.0178571 0 0 0.0223214 0 -0.00223214)"/>
                        </pattern>
                        <image id="image0_119_1388" width="56" height="45" preserveAspectRatio="none"
                               href="data:image/png;base64,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"/>
                    </defs>
                </svg>

                <span
                    className="h-[13px] shrink-0 basis-auto  text-[11px] font-normal leading-[13px] text-[#c7c5c4] text-left uppercase">
                         powerd by redacted
                    </span>
            </div>
        </div>
    </div>
}