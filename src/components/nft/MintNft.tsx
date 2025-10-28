import {useWallet} from "../provider/WalletProvider.tsx";
import React, {useEffect, useState} from "react";
import moment from "moment/moment";
import {CONFIG} from "../../config/environment.ts";
import CineFiNFTABI from "../../abi/cinefi-nft-abi.json";
import {useAccount, useContractRead, useContractReads} from "wagmi";
import {formatNumber, formatUSDC} from "../../utils/numberFormatting.ts";
import {ethers} from "ethers";
import USDCABI from "../../abi/usdc-abi.json";
import {useMinting} from "../../hooks/core/useMinting.ts";
import {useWhitelist} from "../../hooks/core/useWhitelist.ts";
import {MintPhase} from "../../interface/api.ts";

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


function getBackground(tierName: string) {
    switch (tierName) {
        case "Silver":
            return "linear-gradient(180deg, rgba(221, 221, 221, 0.24) 0%, rgba(77, 77, 77, 0.24) 100%)"
        case "Gold":
            return "linear-gradient(180deg, rgba(255, 201, 115, 0.24) 0%, rgba(153, 117, 60, 0.24) 100%)"
        case "Platinum":
            return "linear-gradient(rgb(255 251 251 / 82%) 0%, rgba(77, 77, 77, 0.24) 100%)"
    }
}

export default function MintNft({whitelistedTiers, checkWhitelisted}) {
    const {getMerkleProof} = useWhitelist();
    const {currentPhase} = useWallet();
    const [cost, setCost] = useState({
        Silver: 0,
        Gold: 0,
        Platinum: 0
    })
    const [selectedTiers, setSelectedTiers] = useState<Map<number, number>>(new Map());
    const [open, setOpen] = useState(false);
    const currentPhaseTiers = whitelistedTiers?.entries?.filter((entry: any) => entry.phaseId === currentPhase);
    const tierReadContracts = currentPhaseTiers.map(entry => ({
        address: CONFIG.CINEFI_NFT_ADDRESS as `0x${string}`,
        abi: CineFiNFTABI,
        functionName: 'getTier',
        args: [entry.tierId],
    }));

    const {data: tierData} = useContractReads({
        contracts: tierReadContracts as any,
        enabled: currentPhaseTiers.length > 0,
    });

    const entries = currentPhaseTiers.map((e, i) => {
        if (tierData?.[i]?.status === "success") {
            return {
                ...e,
                ...(tierData[i]?.result as any || {})
            };
        }
        return null;
    })?.filter(Boolean);

    const isShowAmount = cost.Silver !== 0 || cost.Gold !== 0 || cost.Platinum !== 0;
    const totalAmt = Number(entries.reduce((sum, tier) => {
        const amt = Number(formatUSDC(tier.price));
        return (sum + amt * (cost[tier.name] || 0));
    }, 0).toFixed(2));

    const phasesName = ["Claim Phase", "Guaranteed Phase", "FCFS Phase"];
    const tierIds = [1, 2, 3];

    const [mintingLoading, setMintingLoading] = useState(false);
    const [mintingDisable, setMintingDisable] = useState(true);

    const {address} = useAccount();
    const {mint, txHash} = useMinting();

    const {data: usdcBalance} = useContractRead({
        address: CONFIG.USDC_ADDRESS as `0x${string}`,
        abi: USDCABI,
        functionName: 'balanceOf',
        args: address ? [address as `0x${string}`] : undefined,
        enabled: !!address,
    });

    const currentBalance: number = Number(formatUSDC(usdcBalance as ethers.BigNumber | "0"));

    const getTier = (phaseId, tierId) => {
        return whitelistedTiers?.entries.find((t) => t.phaseId === phaseId && t.tierId === tierId)
    };

    const handleMint = async () => {
        setMintingLoading(true)
        setMintingDisable(true)
        try {
            const tierIds = Array.from(selectedTiers.keys());
            const quantities = Array.from(selectedTiers.values());

            const merkleProofs: string[][] = [];
            const allocations: number[] = [];

            const tierPrices: ethers.BigNumber[] = [];

            tierIds.forEach(tierId => {
                const tierIndex = currentPhaseTiers?.findIndex(e => e.tierId === tierId);
                const tierInfo = tierData?.[tierIndex]?.result as any;
                if (tierInfo?.price) {
                    tierPrices.push(ethers.BigNumber.from(tierInfo.price));
                } else {
                    // Fallback to zero if price not found
                    tierPrices.push(ethers.BigNumber.from(0));
                }
            });

            for (let i = 0; i < tierIds.length; i++) {
                const tierId = tierIds[i];
                const entry = currentPhaseTiers?.find(e => e.tierId === tierId);

                if (!entry) {
                    throw new Error(`No whitelist entry found for tier ${tierId}`);
                }

                const proof = await getMerkleProof(
                    entry.tierId,
                    entry.phaseId,
                    entry.allowedQuantity
                );
                merkleProofs.push(proof);
                allocations.push(entry.allowedQuantity);
            }

            await mint({tierIds, quantities, allocations, merkleProofs, tierPrices});
        } catch (error) {
            console.error('Mint error:', error);
        }

        setSelectedTiers(new Map());

        setCost({
            Silver: 0,
            Gold: 0,
            Platinum: 0
        })
        setMintingLoading(false)
        checkWhitelisted()
    };

    useEffect(() => {
        setMintingDisable((totalAmt === 0) || (totalAmt > currentBalance));
    }, [totalAmt])

    return <div
        className="flex flex-col sticky top-[132px] self-start max-w-[450px] w-full h-full xl:h-[650px] xl:max-h-[calc(100svh_-_172px)] bg-[#161616]  pt-6 items-start  xl:border-l xl:border-white/20 backdrop-blur-[20px] mx-auto">
        <div className="px-4 pb-[16px] border-b-[1px] border-b-[#fff3] w-full">
            <div className="text-[22px] font-bold leading-[24px] text-[#d4c3c3] text-left">
                Mint
            </div>
            <GetTitleAndTime/>
        </div>

        <div className="flex grow px-4 flex-col gap-[16px] overflow-y-scroll no-scrollbar w-full py-4">
            <div>
                {entries?.map((tier, index) => {
                    const remainingAmt = formatNumber(tier.remaining);

                    if (parseInt(remainingAmt) == 0) {
                        return null;
                    }

                    return <div key={index}
                                className="flex flex-row justify-between items-center gap-2 pt-[8px] pr-0 pb-[8px] pl-0">
                        <div className={"flex gap-2"}>
                            <div style={{
                                background: getBackground(tier.name)
                            }} className="flex p-5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33"
                                     fill="none">
                                    <path
                                        d="M11.3332 16.5C12.0404 16.5 12.7187 16.219 13.2188 15.7189C13.7189 15.2188 13.9998 14.5406 13.9998 13.8333C13.9998 13.1261 13.7189 12.4478 13.2188 11.9477C12.7187 11.4476 12.0404 11.1666 11.3332 11.1666C10.6259 11.1666 9.94765 11.4476 9.44755 11.9477C8.94746 12.4478 8.66651 13.1261 8.66651 13.8333C8.66651 14.5406 8.94746 15.2188 9.44755 15.7189C9.94765 16.219 10.6259 16.5 11.3332 16.5ZM15.3332 1.83331L27.9998 9.16665V23.8333L15.3332 31.1667L2.6665 23.8333V9.16665L15.3332 1.83331ZM5.33317 10.704V22.296L8.49584 24.1266L19.2598 16.2333L25.3332 19.8787V10.7053L15.3332 4.91331L5.33317 10.704Z"
                                        fill="white"/>
                                </svg>
                            </div>
                            <div
                                className="flex flex-col gap-[6px] justify-center items-start">
                                    <span
                                        className="shrink-0 basis-auto  text-[16px] font-bold leading-[19px] text-[#fff] relative text-left">
                                      {tier.name} Tier
                                    </span>
                                <div
                                    className="flex flex-wrap gap-[6px] items-start">
                                      <span
                                          className="text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left text-nowrap ">
                                        Available: {remainingAmt},
                                      </span>
                                            <span
                                                className="text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left text-nowrap">
                                        ${formatUSDC(tier.price)} each
                                      </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-[15px] items-center">
                                <button
                                    disabled={(cost[tier.name] <= 0)}
                                    onClick={() => {
                                        if (cost[tier.name] > 0) {
                                            setCost(e => ({...e, [tier.name]: (e[tier.name] - 1)}))
                                            if ((cost[tier.name] - 1) > 0) {
                                                const newSelections = new Map(selectedTiers);
                                                newSelections.set(tier.tierId, (cost[tier.name] - 1));
                                                setSelectedTiers(newSelections);
                                            } else {
                                                const newSelections = new Map(selectedTiers);
                                                newSelections.delete(tier.tierId);
                                                setSelectedTiers(newSelections);
                                            }
                                        }
                                    }}
                                    className="flex p-1 justify-center items-center opacity-100 bg-[#333] disabled:opacity-40  border border-[#333] cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"
                                         fill="none">
                                        <path d="M13.2857 13.7857H21V11.2143H13.2857H10.7143H3V13.7857H10.7143H13.2857Z"
                                              fill="white"/>
                                    </svg>
                                </button>
                                <input
                                    type="text"
                                    className="w-[25px] text-center"
                                    min={0}
                                    max={parseInt(remainingAmt)}
                                    value={cost[tier.name]}
                                    onChange={(e) => {
                                        e.stopPropagation();

                                        let value = Number(e.target.value);

                                        if (!value && value !== 0) {
                                            return;
                                        }

                                        if (value > parseInt(remainingAmt) || value < 0) {
                                            return;
                                        }

                                        setCost({
                                            ...cost,
                                            [tier.name]: value,
                                        });
                                    }}
                                />

                                <button
                                    disabled={(cost[tier.name] >= remainingAmt)}
                                    onClick={() => {
                                        if (((cost[tier.name] + 1) <= remainingAmt)) {
                                            setCost(e => ({...e, [tier.name]: (e[tier.name] + 1)}))

                                            const newSelections = new Map(selectedTiers);
                                            newSelections.set(tier.tierId, (cost[tier.name] + 1));
                                            setSelectedTiers(newSelections);
                                        }
                                    }}
                                    className="flex p-1 justify-center items-center bg-[#333] opacity-100 disabled:opacity-40 border border-[#333] cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"
                                         fill="none">
                                        <path
                                            d="M21 13.7857H13.2857V21.5H10.7143V13.7857H3V11.2143H10.7143V3.5H13.2857V11.2143H21V13.7857Z"
                                            fill="white"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                })}
            </div>

            {isShowAmount && <div className="flex flex-col gap-[12px] items-start ">
                {isShowAmount && Object.keys(cost).map((key, i) => {
                    const tier = entries.find(e => e.name === key);

                    const amt = Number(formatUSDC(tier?.price || "0"));
                    let totalAmt = (amt) * cost[key];

                    if (!tier || totalAmt == 0) {
                        return null
                    }
                    totalAmt = Number(totalAmt.toFixed(2))

                    return <React.Fragment key={i}>
                        <div className="flex justify-between items-center self-stretch shrink-0">
                            <div className="flex gap-[6px] items-center shrink-0 flex-nowrap relative z-[8]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21"
                                     fill="none">
                                    <path
                                        d="M7.08268 10.5C7.52471 10.5 7.94863 10.3244 8.2612 10.0119C8.57376 9.69933 8.74935 9.2754 8.74935 8.83338C8.74935 8.39135 8.57376 7.96743 8.2612 7.65486C7.94863 7.3423 7.52471 7.16671 7.08268 7.16671C6.64066 7.16671 6.21673 7.3423 5.90417 7.65486C5.59161 7.96743 5.41602 8.39135 5.41602 8.83338C5.41602 9.2754 5.59161 9.69933 5.90417 10.0119C6.21673 10.3244 6.64066 10.5 7.08268 10.5ZM9.58268 1.33337L17.4994 5.91671V15.0834L9.58268 19.6667L1.66602 15.0834V5.91671L9.58268 1.33337ZM3.33268 6.87754V14.1225L5.30935 15.2667L12.0369 10.3334L15.8327 12.6117V6.87838L9.58268 3.25837L3.33268 6.87754Z"
                                        fill="#D4C3C3"/>
                                </svg>
                                <span
                                    className=" shrink-0 basis-auto  text-[12px] font-normal leading-[14px] text-[#d4c3c3] relative text-left uppercase whitespace-nowrap z-[11]">
                            {key} nft ({amt})
                          </span>
                            </div>
                            <div className="flex  gap-[6px] items-start shrink-0 flex-nowrap relative z-[12]">
                          <span
                              className=" shrink-0 basis-auto  text-[14px] font-medium leading-[21px] text-[#f2f2f2] relative text-left whitespace-nowrap z-[13]">
                            ${totalAmt}
                          </span>
                            </div>
                        </div>
                        <div className="h-px w-full bg-[#ffffff1a]"/>
                    </React.Fragment>
                })}

                {isShowAmount && <div className="flex justify-between items-center self-stretch shrink-0">
                    <div className="flex  gap-[6px] items-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M9.16667 12.0834C9.16667 13.2334 11.0325 14.1667 13.3333 14.1667C15.6342 14.1667 17.5 13.2334 17.5 12.0834M2.5 7.91675C2.5 9.06675 4.36583 10.0001 6.66667 10.0001C7.605 10.0001 8.47083 9.84508 9.16667 9.58341M2.5 10.8334C2.5 11.9834 4.36583 12.9167 6.66667 12.9167C7.605 12.9167 8.47 12.7617 9.16667 12.5001M13.3333 10.8334C11.0325 10.8334 9.16667 9.90008 9.16667 8.75008C9.16667 7.60008 11.0325 6.66675 13.3333 6.66675C15.6342 6.66675 17.5 7.60008 17.5 8.75008C17.5 9.90008 15.6342 10.8334 13.3333 10.8334Z"
                                stroke="#D4C3C3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path
                                d="M2.5 4.5835V13.7502C2.5 14.9002 4.36583 15.8335 6.66667 15.8335C7.605 15.8335 8.47 15.6785 9.16667 15.4168M9.16667 15.4168V8.75016M9.16667 15.4168C9.16667 16.5668 11.0325 17.5002 13.3333 17.5002C15.6342 17.5002 17.5 16.5668 17.5 15.4168V8.75016M10.8333 7.0835V4.5835"
                                stroke="#D4C3C3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path
                                d="M6.66667 6.66679C4.36583 6.66679 2.5 5.73346 2.5 4.58346C2.5 3.43346 4.36583 2.50012 6.66667 2.50012C8.9675 2.50012 10.8333 3.43346 10.8333 4.58346C10.8333 5.73346 8.9675 6.66679 6.66667 6.66679Z"
                                stroke="#D4C3C3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span
                            className="shrink-0 basis-auto  text-[12px] font-normal leading-[14px] text-[#d4c3c3] relative text-left uppercase whitespace-nowrap z-[18]">
                        total
                      </span>
                    </div>
                    <div className="flex gap-[6px] items-start shrink-0">
                      <span
                          className="shrink-0 basis-auto  text-[16px] font-bold leading-[24px] text-[#fff] relative text-left">
                        ${totalAmt}
                      </span>
                    </div>
                </div>}
            </div>}

            <div>
                <table className="min-w-full border border-[#ffffff4d] mt-[16px]">
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
                            {phasesName.map((_, i: number) => {
                                const phaseId = (i + 1);
                                const t = getTier(phaseId, tier);
                                const remaining = t?.remaining ? formatNumber(t.remaining) : 0;

                                return (
                                    <td key={i}
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
                    }}
                         className="flex flex-row gap-2 text-[14px] font-medium leading-[21px] py-[16px] text-[#909093] cursor-pointer">
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
                        className="shrink-0 basis-auto  text-[14px] font-medium leading-[18px] text-[#d4c3c3] relative text-left z-[1]">
                      Claim Phase
                    </span>
                            <span
                                className=" self-stretch shrink-0 basis-auto  text-[14px] font-medium leading-[21px] text-[#909093] relative text-left z-[2]">
                          User can claim free NFTs available on their whitelisted address.
                        </span>
                        </div>
                        <div className={"w-full h-[1px] bg-[#fff3]"}></div>
                        <div
                            className="flex flex-col gap-[8px] items-start self-stretch shrink-0 flex-nowrap relative z-[4]">
                            <span
                                className="h-[18px] shrink-0 basis-auto  text-[14px] font-medium leading-[18px] text-[#d4c3c3] relative text-left z-[5]">
                              Guaranteed Phase
                            </span>
                            <span
                                className=" self-stretch shrink-0 basis-auto  text-[14px] font-medium leading-[21px] text-[#909093] relative text-left z-[6]">
                                  Users can mint guaranteed NFTs available to their whitelisted address.
                                </span>
                        </div>
                        <div className={"w-full h-[1px] bg-[#fff3]"}></div>
                        <div
                            className="flex flex-col gap-[8px] items-start self-stretch shrink-0 flex-nowrap relative z-[8]">
                                <span
                                    className="h-[18px] shrink-0 basis-auto  text-[14px] font-medium leading-[18px] text-[#d4c3c3] relative text-left whitespace-nowrap z-[9]">
                                  FCFS Phase
                                </span>
                            <span
                                className="self-stretch shrink-0 basis-auto  text-[14px] font-medium leading-[21px] text-[#909093] relative text-left z-10">
                              Users can mint NFTs on a first-come, first-served basis using their whitelisted address.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            className="flex w-full pt-[16px] pr-[24px] pb-[16px] pl-[24px] flex-col gap-[17px] items-start shrink-0 border-t border-t-[#ffffff33]">
            {txHash && (
                <div className="p-2 w-full bg-blue-900 border border-blue-600 rounded-lg">
                    <p className="text-blue-200 text-sm">
                        Transaction submitted:
                        <a
                            href={`${CONFIG.BLOCK_EXPLORER}/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 ml-2 underline"
                        >
                            {txHash.slice(0, 10)}...{txHash.slice(-8)}
                        </a>
                    </p>
                </div>
            )}

            <div className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                    <path
                        d="M16.2 4.05556V2.27778C16.2 1.29733 15.3927 0.5 14.4 0.5H2.7C1.2114 0.5 0 1.69644 0 3.16667V13.8333C0 15.7898 1.6146 16.5 2.7 16.5H16.2C17.1927 16.5 18 15.7027 18 14.7222V5.83333C18 4.85289 17.1927 4.05556 16.2 4.05556ZM14.4 12.0556H12.6V8.5H14.4V12.0556ZM2.7 4.05556C2.46827 4.04532 2.24946 3.94719 2.08915 3.78162C1.92883 3.61604 1.83936 3.39577 1.83936 3.16667C1.83936 2.93757 1.92883 2.7173 2.08915 2.55172C2.24946 2.38614 2.46827 2.28802 2.7 2.27778H14.4V4.05556H2.7Z"
                        fill="#D4C3C3"/>
                </svg>

                <span className="text-[12px] font-normal leading-[14px] uppercase text-[#d4c3c3]">
                     Balance:
                </span>
                <img src={"https://unlu-general.s3.ap-south-1.amazonaws.com/contest/USDC.png"}
                     className={'w-[20px] h-[20px]'} alt={""}/>
                <span className="text-sm font-medium leading-[21px] text-[#FFF]">
                    {currentBalance} USDC
                </span>
            </div>

            <button disabled={mintingDisable && !mintingLoading} onClick={() => {
                handleMint()
            }}
                    className={"flex justify-center items-center gap-2 bg-[#FE3D5B] text-[#EFEFEF] disabled:bg-[#898989] disabled:opacity-80 cursor-pointer disabled:cursor-no-drop py-3.5 w-full "}>
                <span className={"text-[12px] text-[#EFEFEF] leading-[14.4px]"}>
                    {mintingLoading ? <div className={"flex gap-2 items-center justify-center font-bold"}>
                        <div className="animate-spin w-fit rounded-full h-4 min-w-4 border-b-2 border-white"></div>
                        Waiting for Conformation...
                    </div> : mintingDisable ? ((totalAmt > currentBalance) ? "Insufficient Balance" : (currentPhase === MintPhase.CLAIM ? "Select Claim Quantity" : "Select Mint Quantity")) : (currentPhase === MintPhase.CLAIM ? "Claim Free NFT" : "Approve & Mint")}

                </span>
            </button>

            <div className="flex gap-[4px] justify-center items-center self-stretch shrink-0">
                <svg width="30" height="16" viewBox="0 0 30 24" fill="none"
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
