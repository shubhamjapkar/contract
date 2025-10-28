import {useAccount} from "wagmi";
import React, {useEffect, useState} from "react";
import {useWallet} from "../provider/WalletProvider.tsx";
import moment from "moment";

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


export function NotWhitListed() {
    const { address } = useAccount();

    return <div className="flex flex-col sticky top-[132px] self-start max-w-[450px] w-full h-full xl:h-[650px] xl:max-h-[calc(100svh_-_172px)] bg-[#161616]  pt-6 gap-4 items-start  xl:border-l xl:border-white/20 backdrop-blur-[20px] mx-auto overflow-y-scroll no-scrollbar">

        <div className="px-4 pb-[16px] border-b-[1px] border-b-[#fff3] w-full">
            <div className="text-[22px] font-bold leading-[24px] text-[#d4c3c3] text-left">
                Mint
            </div>
            <GetTitleAndTime/>
        </div>

        <div className="flex grow px-4 flex-col gap-[16px] items-center self-stretch shrink-0">
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
                        disabled={true}
                        value={address}
                        type="text"
                        maxLength={42}
                        placeholder="Input Ethereum Wallet Address"
                        className="bg-transparent outline-none text-[14px] text-[#efefef] disabled:text-[#808080] placeholder:opacity-40 leading-[16.8px] w-full"
                    />
                </div>

                <div className={"flex gap-2 justify-center items-center"}>
                    <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                              d="M8 1C4.1 1 1 4.1 1 8C1 11.9 4.1 15 8 15C11.9 15 15 11.9 15 8C15 4.1 11.9 1 8 1ZM10.7 11.5L8 8.8L5.3 11.5L4.5 10.7L7.2 8L4.5 5.3L5.3 4.5L8 7.2L10.7 4.5L11.5 5.3L8.8 8L11.5 10.7L10.7 11.5Z"
                              fill="#F1476A"/>
                        </svg>
                        </span>
                    <span className="flex justify-start items-start text-[16px] font-normal leading-[24px] text-[rgba(212,195,195,0.9)] text-left">
                    Your wallet is not whitelisted. Contact us for future opportunities to invest
                  </span>
                </div>
            </div>
        </div>


        <div className="flex gap-[4px] justify-center items-center self-stretch shrink-0 py-4.5">
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
}
