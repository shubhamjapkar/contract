import {useEffect, useRef, useState} from "react";
import projectData from "../../data/project-data.json";
import {useAccount, useBalance} from "wagmi";
import {useParams} from "react-router-dom";
import PageNotFound from "../../NotFound.tsx";
import moment from "moment";
import {MintingInterface} from "../core/MintingInterface.tsx";

const tabs = [
    {id: "hero-section", label: "Overview"},
    {id: "project-overview", label: "Project Overview"},
    {id: "opportunities", label: "Opportunities"},
    {id: "creative-team", label: "Creative Team"},
    {id: "track-record", label: "Proven Track Record"},
    // {id: "success-analysis", label: "AI Success Analysis"},
    {id: "project-updates", label: "Project Updates"},
    // {id: "community-discussion", label: "Community Discussion"},
    {id: "faq", label: "FAQ"}
];

// connected wallet
function WalletConnectedInputAddress() {
    const [focused, setFocused] = useState(false);

    return <div
        className="hidden xl:flex xl:flex-col sticky top-[132px] self-start max-w-[450px] w-full h-[650px] max-h-[calc(100svh_-_172px)] bg-[#161616]  pt-6 gap-4 items-start  border-l border-white/20 backdrop-blur-[20px] mx-auto">
        <div className="self-stretch shrink-0 px-6 border-b border-b-[#fff3] pb-[16px]">
             <span
                 className="shrink-0 basis-auto text-[22px] font-bold leading-[24px] text-[#d4c3c3] text-left whitespace-nowrap z-[2]">
                    Mint
                  </span>
                    <div className="flex w-[235px] gap-[8px] justify-end items-center shrink-0 ">
                            <span
                                className="h-[18px] shrink-0 basis-auto text-[16px] font-medium opacity-80 leading-[17.6px] text-[#d4c3c3] text-left">
                              Starts In:
                            </span>
                        <div
                            className="flex w-[162px] pt-[6px] pr-[6px] pb-[6px] pl-[6px] gap-[10px] justify-center items-center shrink-0  bg-[rgba(22,161,73,0.24)]">
                                  <span
                                      className="h-[18px] shrink-0 basis-auto text-[16px] font-bold leading-[17.6px] text-[#16a149] text-left ">
                                    2d : 12hr : 15m : 30s
                                  </span>
                        </div>
                    </div>
        </div>

        <div className="flex justify-between grow px-6 flex-col gap-[16px] items-center overflow-y-scroll w-full">
            <div className="flex flex-col grow justify-between gap-[16px] items-center self-stretch shrink-0">
                <div className={"w-full flex flex-col gap-[16px]"}>
                    <div
                        className="flex py-3.5 px-[16px] gap-[6px] items-center self-stretch shrink-0 border border-[#4d4d53] relative overflow-hidden z-[15] rounded">
                        {!focused && (
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
                        )}

                        <input
                            type="text"
                            placeholder="Input Ethereum Wallet Address"
                            onFocus={() => setFocused(true)}
                            onBlur={(e) => {
                                if (!e.target.value) setFocused(false);
                            }}
                            className="bg-transparent outline-none text-[14px] text-[#efefef] placeholder:opacity-40 leading-[16.8px] w-full"
                        />
                    </div>

                    <div className={"flex flex-col gap-4 w-full"}>
                        <div className={"flex gap-2 items-center"}>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"
                                 fill="none">
                              <g clip-path="url(#clip0_630_16650)">
                                <path fill-rule="evenodd" clip-rule="evenodd"
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
                            <span className={"text-[#909093] text-[14px] font-medium leading-[21px]"}>Your wallet is whitelisted</span>
                        </div>
                        <div className={"flex gap-2 items-center"}>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"
                                 fill="none">
                              <g clip-path="url(#clip0_630_16650)">
                                <path fill-rule="evenodd" clip-rule="evenodd"
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
                            <span className={"text-[#909093] text-[14px] font-medium leading-[21px]"}>You can mint the below nft’s once minting goes live</span>
                        </div>
                    </div>

                </div>

                <div className="flex w-full flex-col gap-[16px] items-start">
                    <div className="flex  gap-[10px] justify-center items-center">
                        <span
                            className=" shrink-0 basis-auto  text-[18px] font-semibold leading-[19.8px] text-[#d4c3c3] relative text-left whitespace-nowrap z-[1]">
                          Available to mint
                        </span>
                    </div>
                    <div className="flex gap-2 pt-[8px] pr-0 pb-[8px] pl-0 items-center self-stretch shrink-0">
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
                                      Silver Tier
                                    </span>
                            <div
                                className="flex w-[165px] gap-[6px] items-start shrink-0 flex-nowrap relative z-[9]">
                              <span
                                  className="h-[17px] shrink-0 basis-auto  text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left whitespace-nowrap z-10">
                                Available: 3,
                              </span>
                                <span
                                    className="h-[17px] shrink-0 basis-auto  text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left whitespace-nowrap z-[11]">
                                $100.00 each
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

                    <div className="flex gap-2 pt-[8px] pr-0 pb-[8px] pl-0 items-center self-stretch shrink-0">
                        <div style={{
                            background: "linear-gradient(180deg, rgba(255, 201, 115, 0.24) 0%, rgba(153, 117, 60, 0.24) 100%)"
                        }} className="flex items-center p-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33"
                                 fill="none">
                                <path
                                    d="M11.3332 16.5C12.0404 16.5 12.7187 16.2191 13.2188 15.719C13.7189 15.2189 13.9998 14.5406 13.9998 13.8334C13.9998 13.1261 13.7189 12.4479 13.2188 11.9478C12.7187 11.4477 12.0404 11.1667 11.3332 11.1667C10.6259 11.1667 9.94765 11.4477 9.44755 11.9478C8.94746 12.4479 8.66651 13.1261 8.66651 13.8334C8.66651 14.5406 8.94746 15.2189 9.44755 15.719C9.94765 16.2191 10.6259 16.5 11.3332 16.5ZM15.3332 1.83337L27.9998 9.16671V23.8334L15.3332 31.1667L2.6665 23.8334V9.16671L15.3332 1.83337ZM5.33317 10.704V22.296L8.49584 24.1267L19.2598 16.2334L25.3332 19.8787V10.7054L15.3332 4.91337L5.33317 10.704Z"
                                    fill="white"/>
                            </svg>
                        </div>
                        <div
                            className="flex flex-col gap-[6px] justify-center items-start shrink-0 flex-nowrap relative z-[7]">
                                    <span
                                        className="shrink-0 basis-auto  text-[16px] font-bold leading-[19px] text-[#fff] relative text-left whitespace-nowrap z-[8]">
                                      Gold Tier
                                    </span>
                            <div
                                className="flex gap-[6px] items-start shrink-0 flex-nowrap relative z-[9]">
                                      <span
                                          className="h-[17px] shrink-0 basis-auto  text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left whitespace-nowrap z-10">
                                        Available: 2, $500.00 each
                                      </span>
                            </div>
                            <div
                                className="flex pt-[6px] pr-[8px] pb-[6px] pl-[8px] gap-[10px] justify-center items-center shrink-0 flex-nowrap bg-[#ff8a003d] rounded-[2px] relative z-[12]">
                                      <span
                                          className="shrink-0 basis-auto  text-[12px] font-medium leading-[14px] text-[#FF8A00] relative text-left uppercase whitespace-nowrap z-[13]">
                                        rarity: 2.5%
                                      </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex w-full pt-[16px] pr-[24px] pb-[16px] pl-[24px] flex-col gap-[17px] items-start shrink-0">
            <button className={"flex justify-center items-center gap-2 border border-[#ffffff4d] py-2.5 w-full"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <g clip-path="url(#clip0_630_16625)">
                        <path
                            d="M15.8333 4.41663H4.16667C3.24619 4.41663 2.5 5.16282 2.5 6.08329V16.9166C2.5 17.8371 3.24619 18.5833 4.16667 18.5833H15.8333C16.7538 18.5833 17.5 17.8371 17.5 16.9166V6.08329C17.5 5.16282 16.7538 4.41663 15.8333 4.41663Z"
                            stroke="#D4C3C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5.83333 1.91663V4.41663M14.1667 1.91663V4.41663M2.5 8.58329H17.5" stroke="#D4C3C3"
                              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_630_16625">
                            <rect width="20" height="20" fill="white" transform="translate(0 0.25)"/>
                        </clipPath>
                    </defs>
                </svg>
                <span className={"text-[12px] text-[#EFEFEF] leading-[14.4px]"}>Add to calendar</span>
            </button>
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

function WalletConnectedMint() {
    const [focused, setFocused] = useState(false);

    return <div
        className="hidden xl:flex xl:flex-col sticky top-[132px] self-start max-w-[450px] w-full h-[650px] max-h-[calc(100svh_-_172px)] bg-[#161616]  pt-6 gap-4 items-start  border-l border-white/20 backdrop-blur-[20px] mx-auto">
        <div className="self-stretch shrink-0 px-6 border-b border-b-[#fff3] pb-[16px]">
             <span
                 className="shrink-0 basis-auto text-[22px] font-bold leading-[24px] text-[#d4c3c3] text-left whitespace-nowrap z-[2]">
                    Mint
                  </span>
            <div className="flex gap-[8px] items-center shrink-0 ">
                    <span
                        className="shrink-0 basis-auto text-[16px] font-medium opacity-80 leading-[17.6px] text-[#d4c3c3] text-left">
                      Ends In:
                    </span>
                <div
                    className="flex w-[162px] pt-[6px] pr-[6px] pb-[6px] pl-[6px] gap-[10px] justify-center items-center shrink-0  bg-[#ff4c4c3d]">
                          <span
                              className="h-[18px] shrink-0 basis-auto text-[16px] font-bold leading-[17.6px] text-[#FF4C4C] text-left ">
                            2d : 12hr : 15m : 30s
                          </span>
                </div>
            </div>
        </div>

        <div className="flex justify-between grow px-6 flex-col gap-[16px] items-center overflow-y-scroll w-full">
            <div className="flex flex-col grow justify-between gap-[16px] items-center self-stretch shrink-0">
                <div className={"w-full flex flex-col gap-[16px]"}>
                    <div
                        className="flex py-3.5 px-[16px] gap-[6px] items-center self-stretch shrink-0 border border-[#4d4d53] relative overflow-hidden z-[15] rounded">
                        {!focused && (
                            <img src={"https://unlu-general.s3.ap-south-1.amazonaws.com/contest/USDC.png"}
                                 className={'w-[16px] h-[16px]'} alt={""}/>
                        )}

                        <input
                            type="text"
                            placeholder="Enter USDC Spending Cap"
                            onFocus={() => setFocused(true)}
                            onBlur={(e) => {
                                if (!e.target.value) setFocused(false);
                            }}
                            className="bg-transparent outline-none text-[14px] text-[#efefef] placeholder:opacity-40 leading-[16.8px] w-full"
                        />
                    </div>

                    <div className={"flex items-center gap-2"}>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                 fill="none">
                              <g clip-path="url(#clip0_630_20274)">
                                <path
                                    d="M8.9817 1.56601C8.88271 1.39358 8.73998 1.25031 8.56791 1.15069C8.39584 1.05106 8.20053 0.998596 8.0017 0.998596C7.80287 0.998596 7.60756 1.05106 7.43549 1.15069C7.26343 1.25031 7.12069 1.39358 7.0217 1.56601L0.164702 13.233C-0.292298 14.011 0.255702 15 1.1447 15H14.8577C15.7467 15 16.2957 14.01 15.8377 13.233L8.9817 1.56601ZM7.9997 5.00001C8.5347 5.00001 8.9537 5.46201 8.8997 5.99501L8.5497 9.50201C8.53794 9.63978 8.4749 9.76813 8.37306 9.86165C8.27121 9.95517 8.13797 10.0071 7.9997 10.0071C7.86143 10.0071 7.72819 9.95517 7.62635 9.86165C7.5245 9.76813 7.46146 9.63978 7.4497 9.50201L7.0997 5.99501C7.08713 5.86925 7.10105 5.74224 7.14055 5.62218C7.18005 5.50212 7.24426 5.39166 7.32905 5.29792C7.41383 5.20419 7.51731 5.12925 7.63282 5.07794C7.74833 5.02663 7.87331 5.00008 7.9997 5.00001ZM8.0017 11C8.26692 11 8.52127 11.1054 8.70881 11.2929C8.89634 11.4804 9.0017 11.7348 9.0017 12C9.0017 12.2652 8.89634 12.5196 8.70881 12.7071C8.52127 12.8947 8.26692 13 8.0017 13C7.73649 13 7.48213 12.8947 7.2946 12.7071C7.10706 12.5196 7.0017 12.2652 7.0017 12C7.0017 11.7348 7.10706 11.4804 7.2946 11.2929C7.48213 11.1054 7.73649 11 8.0017 11Z"
                                    fill="#FFC464"/>
                              </g>
                              <defs>
                                <clipPath id="clip0_630_20274">
                                  <rect width="16" height="16" fill="white"/>
                                </clipPath>
                              </defs>
                            </svg>
                        </span>
                        <span className={"text-[#909093] leading-[21px] font-medium"}>
                            Allow a minimum spending cap in your wallet or enter a custom one to mint NFTs
                        </span>
                    </div>

                    <div className={"flex gap-4"}>
                        <div
                            className="flex w-fit pt-[4px] pr-[8px] pb-[4px] pl-[8px] gap-[8px] justify-center bg-[#000009] rounded-[4px] border-solid border-[0.5px] border-[rgba(255,255,255,0.3)]">
                            <span
                                className="flex w-[32px] h-[18px] justify-center items-start shrink-0 text-[12px] font-normal leading-[18px] text-[#d4c3c3] text-center">
                                Min:
                              </span>

                            <span
                                className="flex justify-center items-start shrink-0 text-[12px] font-normal leading-[18px] text-[#d4c3c3]  text-center ">
                                1 USDC
                              </span>
                        </div>

                        <div
                            className="flex w-fit pt-[4px] pr-[8px] pb-[4px] pl-[8px] gap-[8px] justify-center bg-[#000009] rounded-[4px] border-solid border-[0.5px] border-[rgba(255,255,255,0.3)]">
                            <span
                                className="flex w-[32px] h-[18px] justify-center items-start shrink-0 text-[12px] font-normal leading-[18px] text-[#d4c3c3] text-center">
                                Min:
                              </span>

                            <span
                                className="flex justify-center items-start shrink-0 text-[12px] font-normal leading-[18px] text-[#d4c3c3]  text-center ">
                                1 USDC
                              </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            className="flex w-full pt-[16px] pr-[24px] pb-[16px] pl-[24px] flex-col gap-[17px] items-start shrink-0 border-t border-t-[#ffffff33]">
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
                     1200 USDC
                </span>
            </div>
            <button className={"flex justify-center items-center gap-2 bg-[#FE3D5B] py-3.5 w-full"}>
                <span className={"text-[12px] text-[#EFEFEF] leading-[14.4px]"}>Approve spending cap</span>
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

function UserCanMint() {
    const [cost, setCost] = useState({
        silver: 0,
        gold: 0
    })

    return <div
        className="hidden xl:flex xl:flex-col sticky top-[132px] self-start max-w-[450px] w-full h-[650px] max-h-[calc(100svh_-_172px)] bg-[#161616]  pt-6 gap-4 items-start  border-l border-white/20 backdrop-blur-[20px] mx-auto">
        <div className="self-stretch shrink-0 px-4 border-b border-b-[#ffffff33] pb-4">
             <span
                 className="shrink-0 basis-auto text-[22px] font-bold leading-[24px] text-[#d4c3c3] text-left whitespace-nowrap z-[2]">
                    Mint
                  </span>
            <div className="flex gap-[8px] items-center shrink-0 ">
                    <span
                        className="shrink-0 basis-auto text-[16px] font-medium opacity-80 leading-[17.6px] text-[#d4c3c3] text-left">
                      Ends In:
                    </span>
                <div
                    className="flex w-[162px] pt-[6px] pr-[6px] pb-[6px] pl-[6px] gap-[10px] justify-center items-center shrink-0  bg-[#ff4c4c3d]">
                          <span
                              className="h-[18px] shrink-0 basis-auto text-[16px] font-bold leading-[17.6px] text-[#FF4C4C] text-left ">
                            2d : 12hr : 15m : 30s
                          </span>
                </div>
            </div>
        </div>

        <div className="flex grow px-4 flex-col gap-[16px] overflow-y-scroll w-full border-[1px] border-[#ffffff1a]">
            <div className="flex flex-row justify-between items-center gap-2 pt-[8px] pr-0 pb-[8px] pl-0">
                <div className={"flex gap-2"}>
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
                                      Silver Tier
                                    </span>
                        <div
                            className="flex w-[165px] gap-[6px] items-start shrink-0 flex-nowrap relative z-[9]">
                              <span
                                  className="h-[17px] shrink-0 basis-auto  text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left whitespace-nowrap z-10">
                                Available: 3,
                              </span>
                            <span
                                className="h-[17px] shrink-0 basis-auto  text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left whitespace-nowrap z-[11]">
                                $100.00 each
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
                <div>
                    <div className="flex gap-[15px] items-center">
                        <button
                            onClick={() => {
                                if (cost.silver > 0) {
                                    setCost(e => ({...e, silver: (e.silver - 1)}))
                                }
                            }}
                            className="flex p-1 justify-center items-center bg-[#333] opacity-40  border border-[#333] cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"
                                 fill="none">
                                <path d="M13.2857 13.7857H21V11.2143H13.2857H10.7143H3V13.7857H10.7143H13.2857Z"
                                      fill="white"/>
                            </svg>
                        </button>
                        <span className="h-6 text-[20px] font-bold leading-6 text-white">
                            {cost.silver}
                          </span>
                        <button
                            onClick={() => {
                                setCost(e => ({...e, silver: (e.silver + 1)}))
                            }}
                            className="flex p-1 justify-center items-center bg-[#333] opacity-40 border border-[#333] cursor-pointer">
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

            <div className="flex flex-row justify-between items-center gap-2 pt-[8px] pr-0 pb-[8px] pl-0">
                <div className={"flex gap-2"}>
                    <div style={{
                        background: "linear-gradient(180deg, rgba(255, 201, 115, 0.24) 0%, rgba(153, 117, 60, 0.24) 100%)"
                    }} className="flex items-center p-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33"
                             fill="none">
                            <path
                                d="M11.3332 16.5C12.0404 16.5 12.7187 16.2191 13.2188 15.719C13.7189 15.2189 13.9998 14.5406 13.9998 13.8334C13.9998 13.1261 13.7189 12.4479 13.2188 11.9478C12.7187 11.4477 12.0404 11.1667 11.3332 11.1667C10.6259 11.1667 9.94765 11.4477 9.44755 11.9478C8.94746 12.4479 8.66651 13.1261 8.66651 13.8334C8.66651 14.5406 8.94746 15.2189 9.44755 15.719C9.94765 16.2191 10.6259 16.5 11.3332 16.5ZM15.3332 1.83337L27.9998 9.16671V23.8334L15.3332 31.1667L2.6665 23.8334V9.16671L15.3332 1.83337ZM5.33317 10.704V22.296L8.49584 24.1267L19.2598 16.2334L25.3332 19.8787V10.7054L15.3332 4.91337L5.33317 10.704Z"
                                fill="white"/>
                        </svg>
                    </div>
                    <div
                        className="flex flex-col gap-[6px] justify-center items-start shrink-0 flex-nowrap relative z-[7]">
                                    <span
                                        className="shrink-0 basis-auto  text-[16px] font-bold leading-[19px] text-[#fff] relative text-left whitespace-nowrap z-[8]">
                                      Gold Tier
                                    </span>
                        <div
                            className="flex gap-[6px] items-start shrink-0 flex-nowrap relative z-[9]">
                                      <span
                                          className="h-[17px] shrink-0 basis-auto  text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left whitespace-nowrap z-10">
                                        Available: 2, $500.00 each
                                      </span>
                        </div>
                        <div
                            className="flex pt-[6px] pr-[8px] pb-[6px] pl-[8px] gap-[10px] justify-center items-center shrink-0 flex-nowrap bg-[#ff8a003d] rounded-[2px] relative z-[12]">
                                      <span
                                          className="shrink-0 basis-auto  text-[12px] font-medium leading-[14px] text-[#FF8A00] relative text-left uppercase whitespace-nowrap z-[13]">
                                        rarity: 2.5%
                                      </span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex gap-[15px] items-center">
                        <button
                            onClick={() => {
                                if (cost.gold > 0) {
                                    setCost(e => ({...e, gold: (e.gold - 1)}))
                                }
                            }}
                            className="flex p-1 justify-center items-center bg-[#333] opacity-40  border border-[#333] cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"
                                 fill="none">
                                <path d="M13.2857 13.7857H21V11.2143H13.2857H10.7143H3V13.7857H10.7143H13.2857Z"
                                      fill="white"/>
                            </svg>
                        </button>
                        <span className="h-6 text-[20px] font-bold leading-6 text-white">
                            {cost.gold}
                          </span>
                        <button
                            onClick={() => {
                                setCost(e => ({...e, gold: (e.gold + 1)}))
                            }}
                            className="flex p-1 justify-center items-center bg-[#333] opacity-40 border border-[#333] cursor-pointer">
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

            <div
                className="flex flex-col gap-[12px] items-start ">
                <div className="flex justify-between items-center self-stretch shrink-0 ">
                    <div className="flex gap-[6px] items-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                            <path
                                d="M9.99935 2.16669C14.6018 2.16669 18.3327 5.89752 18.3327 10.5C18.3327 15.1025 14.6018 18.8334 9.99935 18.8334C5.39685 18.8334 1.66602 15.1025 1.66602 10.5C1.66602 5.89752 5.39685 2.16669 9.99935 2.16669ZM9.99935 3.83335C8.23124 3.83335 6.53555 4.53573 5.2853 5.78598C4.03506 7.03622 3.33268 8.73191 3.33268 10.5C3.33268 12.2681 4.03506 13.9638 5.2853 15.2141C6.53555 16.4643 8.23124 17.1667 9.99935 17.1667C11.7675 17.1667 13.4632 16.4643 14.7134 15.2141C15.9636 13.9638 16.666 12.2681 16.666 10.5C16.666 8.73191 15.9636 7.03622 14.7134 5.78598C13.4632 4.53573 11.7675 3.83335 9.99935 3.83335ZM9.99935 5.50002C10.2035 5.50005 10.4005 5.57498 10.553 5.71062C10.7055 5.84625 10.803 6.03314 10.8268 6.23585L10.8327 6.33335V10.155L13.0885 12.4109C13.238 12.5608 13.3247 12.762 13.3312 12.9737C13.3377 13.1853 13.2633 13.3914 13.1233 13.5503C12.9833 13.7091 12.7881 13.8086 12.5773 13.8287C12.3665 13.8488 12.156 13.7879 11.9885 13.6584L11.9102 13.5892L9.41018 11.0892C9.28066 10.9596 9.19748 10.7909 9.17352 10.6092L9.16602 10.5V6.33335C9.16602 6.11234 9.25381 5.90038 9.41009 5.7441C9.56637 5.58782 9.77833 5.50002 9.99935 5.50002Z"
                                fill="#D4C3C3"/>
                        </svg>
                        <span
                            className=" shrink-0 basis-auto  text-[12px] font-normal leading-[14px] text-[#d4c3c3] relative text-left uppercase whitespace-nowrap z-[3]">
                            Maturity time
                          </span>
                    </div>
                    <div className="flex gap-[6px] items-start shrink-0 flex-nowrap relative z-[4]">
                      <span
                          className=" shrink-0 basis-auto  text-[14px] font-medium leading-[21px] text-[#f2f2f2] relative text-left whitespace-nowrap z-[5]">
                        6 - 8 months
                      </span>
                    </div>
                </div>
                <div className="h-px w-full bg-[#ffffff1a]"/>
                <div className="flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[7]">
                    <div className="flex gap-[6px] items-center shrink-0 flex-nowrap relative z-[8]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                            <path
                                d="M7.08268 10.5C7.52471 10.5 7.94863 10.3244 8.2612 10.0119C8.57376 9.69933 8.74935 9.2754 8.74935 8.83338C8.74935 8.39135 8.57376 7.96743 8.2612 7.65486C7.94863 7.3423 7.52471 7.16671 7.08268 7.16671C6.64066 7.16671 6.21673 7.3423 5.90417 7.65486C5.59161 7.96743 5.41602 8.39135 5.41602 8.83338C5.41602 9.2754 5.59161 9.69933 5.90417 10.0119C6.21673 10.3244 6.64066 10.5 7.08268 10.5ZM9.58268 1.33337L17.4994 5.91671V15.0834L9.58268 19.6667L1.66602 15.0834V5.91671L9.58268 1.33337ZM3.33268 6.87754V14.1225L5.30935 15.2667L12.0369 10.3334L15.8327 12.6117V6.87838L9.58268 3.25837L3.33268 6.87754Z"
                                fill="#D4C3C3"/>
                        </svg>
                        <span
                            className=" shrink-0 basis-auto  text-[12px] font-normal leading-[14px] text-[#d4c3c3] relative text-left uppercase whitespace-nowrap z-[11]">
                            silver nft (3)
                          </span>
                    </div>
                    <div className="flex  gap-[6px] items-start shrink-0 flex-nowrap relative z-[12]">
                      <span
                          className=" shrink-0 basis-auto  text-[14px] font-medium leading-[21px] text-[#f2f2f2] relative text-left whitespace-nowrap z-[13]">
                        $300.00
                      </span>
                    </div>
                </div>
                <div className="h-px w-full bg-[#ffffff1a]"/>
                <div className="flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[15]">
                    <div className="flex  gap-[6px] items-center shrink-0 flex-nowrap relative z-[16]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M9.16667 12.0834C9.16667 13.2334 11.0325 14.1667 13.3333 14.1667C15.6342 14.1667 17.5 13.2334 17.5 12.0834M2.5 7.91675C2.5 9.06675 4.36583 10.0001 6.66667 10.0001C7.605 10.0001 8.47083 9.84508 9.16667 9.58341M2.5 10.8334C2.5 11.9834 4.36583 12.9167 6.66667 12.9167C7.605 12.9167 8.47 12.7617 9.16667 12.5001M13.3333 10.8334C11.0325 10.8334 9.16667 9.90008 9.16667 8.75008C9.16667 7.60008 11.0325 6.66675 13.3333 6.66675C15.6342 6.66675 17.5 7.60008 17.5 8.75008C17.5 9.90008 15.6342 10.8334 13.3333 10.8334Z"
                                stroke="#D4C3C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path
                                d="M2.5 4.5835V13.7502C2.5 14.9002 4.36583 15.8335 6.66667 15.8335C7.605 15.8335 8.47 15.6785 9.16667 15.4168M9.16667 15.4168V8.75016M9.16667 15.4168C9.16667 16.5668 11.0325 17.5002 13.3333 17.5002C15.6342 17.5002 17.5 16.5668 17.5 15.4168V8.75016M10.8333 7.0835V4.5835"
                                stroke="#D4C3C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path
                                d="M6.66667 6.66679C4.36583 6.66679 2.5 5.73346 2.5 4.58346C2.5 3.43346 4.36583 2.50012 6.66667 2.50012C8.9675 2.50012 10.8333 3.43346 10.8333 4.58346C10.8333 5.73346 8.9675 6.66679 6.66667 6.66679Z"
                                stroke="#D4C3C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span
                            className="shrink-0 basis-auto  text-[12px] font-normal leading-[14px] text-[#d4c3c3] relative text-left uppercase whitespace-nowrap z-[18]">
            total
          </span>
                    </div>
                    <div className="flex gap-[6px] items-start shrink-0 flex-nowrap relative z-[19]">
          <span
              className="shrink-0 basis-auto  text-[16px] font-bold leading-[24px] text-[#fff] relative text-left whitespace-nowrap z-20">
            $300.00
          </span>
                    </div>
                </div>
            </div>
        </div>

        <div
            className="flex w-full pt-[16px] pr-[24px] pb-[16px] pl-[24px] flex-col gap-[17px] items-start shrink-0 border-t border-t-[#ffffff33]">
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
                     ${(cost.silver * 100) + (cost.gold * 500)} USDC
                </span>
            </div>
            <button className={"flex justify-center items-center gap-2 bg-[#FE3D5B] py-3.5 w-full"}>
                <span className={"text-[12px] text-[#EFEFEF] leading-[14.4px]"}>Approve spending cap</span>
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
                               href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAtCAYAAAD7nag2AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAOKADAAQAAAABAAAALQAAAAClV3ChAAAFYUlEQVRoBe1ZO2wcRRj+Zu/Or8NEPhMkIEIEEclARwAhBJKhAFFBlZKOgoaSFihIh0SJUqVFFgUUSAiEaAiKsIVQEiGQY8BvY58P3/tub+fnmz2ZZHe8Z+/e01LGmlvvv7Mz/zf/ewe41+7twOnZARFJnx5uT8apCg+T1cvv4uCXt+Bka+Fnfb0XOHBUDeIVoJGHkj1SttBib+6t4+LXK0opicuDDfDak/sYm53hQnHn6n58m30XCkVAbXPCZSj1K6RyHer5b9WzV9y4i9gqmZmh5JwZKCfuXN2PVxD+GRA1gqzwyq7qQKaJiw/Hlp5hyEYh2qaZkYNoQlhGp6iLBEo+xFwVPF4TNluCwA7cvVmoVKIdS8hH+zUt2pecoEwbLNMmKUGpwc27WHiqe37oRbNdMTiCL4fVsTWCPB7LEgUTqcIBFaXqN2T9s0/oll+Bk2ocO/MgBvh2KRV46gCOLgDeHh3gDm1zi32D/uhvsrEaxUoAoD9o7dO3GQMfoO5HvTMEuhiYTfqcEhffpftZg5bbvL8Fb8fF+cwa6UcybANM55pQNnkIqO4s6YcPRfMRgkSDzofapXl1mvAapH9AcB/eGX/XfzYS7aXhGPKRG3LXqwP811iYSIrxgx1kzk8p0xDN3iDtI3/EURzZACfPLaJVeAFIjZDDYahwQPWUfQL9hxLcYKa1xvi4DT3OrCdaggHQ9EZTAcIpuenkRcNhQo8qpk4gOiXhARXlwLr88f4XaOXn6WiGoaJNhoF/ucl7dAFb9Jx/wvWWocu3aGeLpMd2DAGAvvTy37yMdDaXYK7uhd9mn2miyhHKfYx39J+aiXdxHUszxsHE1jAbYDrLcsUmd8/9CWbww4EvJU2nYsAwN015kElJWk3YSKSSAYaUkrariRQhkgfTJQNx2JtGeomaDfD+V7+iGbzGnRtsqtYuj7im5ImE6ZiYVGwNyluBFHdIi62e1o7QU41bxBEhdPKinVgMhwlbop3e7vEzAyIKSKdQ0IkNq8yQG5euwy08w4yoe5WIWtmsqjU/RWiqIkOB6Jv8OvETcnNfqvNXSe9dsyVW++tROOPM8Xq3SMRMiinXJNeZonVN+M6kuJnYmUSsYRLXUFNGctxiS7ahcd3fcgvNIn4pZD429aXZAN39CaQGESb8imCSQX3KlyKzZqQPer6tNsBz73wMt/QGq4me2sL/4mkLzfwWoPQ2hbhBFV2FV1nBhSzXZFbWr0YPZgPu12IDmjccJsYGtG7sZaLCx3ETBSTGWFOVn1/6nQXvhaF8F2UpwZBhTIMfl7BN/7NMT3sT9f1FLCx8T1rs84QAwPZueNPIzBob6bnBt+fv8Ouna/x0r8y5Ad0qiwlCUsgy2X78O6NtsQGGVdTg6pPD7gDs8JGpJkxj5PCb5vWQlvBswpZgfWsKqaGZIuH4+TBrQXWGSNkxTQ87gaXNRBplvSSbn78OVXoRMuBqwhy0KH4S9HSJSlRk6DjAmFOAx65KefXQe7ttsXbxS091hMp2MeEIvBpW0QxBeji4MQ2d7V+ynRS47Apyj9HRrNM4Z8lfi9cneP2B13nNKGDxbKvotbl16vwjQzkAPQ64yViV8bJSglamEtlgv81zi994CryEnfkf1aWFgKcNS5AfCnIKYw8et9SwnjNO0k4VqnRCZTqkEnuF4aSKet3F2acpsIUAb6fP5g7DRgBG9I0twcY2azRzTG5pb/Qsg3tCfs0hLY+4FX2FgFkPj9VEn4GuT9AWLU4CKPxku7k4h3L+OahMf6oJi4WTEkzd6NT4JcCcKvGsgucVXqvKc8wq0o0qaq2KOvumOV6LbkkT2ugZh//kP1LXA8Hyb7nJAAAAAElFTkSuQmCC"/>
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

function YourMintNft() {
    const [cost] = useState({
        silver: 0,
        gold: 0
    })

    return <div
        className="hidden xl:flex xl:flex-col sticky top-[132px] self-start max-w-[450px] w-full h-[650px] max-h-[calc(100svh_-_172px)] bg-[#161616]  pt-6 gap-4 items-start  border-l border-white/20 backdrop-blur-[20px] mx-auto">
        <div className="self-stretch shrink-0 px-3.5 border-b border-b-[#ffffff33] pb-4">
             <span
                 className="shrink-0 basis-auto text-[22px] font-bold leading-[24px] text-[#d4c3c3] text-left whitespace-nowrap z-[2]">
                    Mint
                  </span>
            <div className="flex gap-[8px] items-center shrink-0 ">
                    <span
                        className="shrink-0 basis-auto text-[16px] font-medium opacity-80 leading-[17.6px] text-[#d4c3c3] text-left">
                      Ends In:
                    </span>
                <div
                    className="flex w-[162px] pt-[6px] pr-[6px] pb-[6px] pl-[6px] gap-[10px] justify-center items-center shrink-0  bg-[#ff4c4c3d]">
                          <span
                              className="shrink-0 basis-auto text-[16px] font-bold leading-[17.6px] text-[#FF4C4C] text-left ">
                            2d : 12hr : 15m : 30s
                          </span>
                </div>
            </div>
        </div>

        <div className="flex grow px-3.5 flex-col  overflow-y-scroll w-full">
            <div className={"flex flex-col gap-[16px] p-3.5 border border-[#ffffff1a]"}>
                <div className="flex gap-[8px] items-start self-stretch">
                    <div
                        className="flex flex-col gap-[16px] justify-center items-start grow shrink-0 basis-0">
                        <div
                            className="flex flex-col gap-[6px] items-start shrink-0">
                        <span
                            className="shrink-0  text-[20px] font-bold leading-[24px] text-[#fff] relative text-left">
                          Swari Agra
                        </span>
                            <div
                                className="flex  pt-[4px] pr-[8px] pb-[4px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap bg-[#000009] rounded-[100px] border-solid border-[0.5px] border-[rgba(255,255,255,0.3)] relative box-content z-[4]">
                          <span
                              className="flex  justify-center items-start shrink-0 basis-auto  text-[12px] font-normal leading-[18px] text-[#d4c3c3]">
                            IP Film
                          </span>
                            </div>
                        </div>
                        <span
                            className="text-[14px] font-semibold leading-[16.8px] text-[#d4c3c3]">
                        Total NFTs: 6
                      </span>
                        <div
                            className="flex w-[95px] flex-col gap-[4px] justify-center items-start">
                            <div
                                className="flex w-[95px] pt-[4px] pr-[8px] pb-[4px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap bg-[rgba(179,179,179,0.4)] rounded-[100px] border-solid border-[0.5px] border-[#dadada] relative box-content z-[8]">
                          <span
                              className="flex  justify-center items-start shrink-0 basis-auto  text-[12px] font-normal leading-[18px] text-[#fff] relative text-center whitespace-nowrap z-[9]">
                            Silver (2)
                          </span>
                            </div>
                        </div>
                        <div
                            className="flex flex-col gap-[4px] justify-center items-start shrink-0 flex-nowrap relative z-10">
                            <div
                                className="flex pt-[4px] pr-[8px] pb-[4px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap bg-[rgba(255,195,100,0.24)] rounded-[100px] border-solid border-[0.5px] border-[#dadada] relative box-content z-[11]">
                          <span
                              className="flexjustify-center items-start shrink-0 basis-auto  text-[12px] font-normal leading-[18px] text-[#fff] relative text-center whitespace-nowrap z-[12]">
                            Gold (2)
                          </span>
                            </div>
                        </div>
                        <div
                            className="flex w-[110px] flex-col gap-[4px] justify-center items-start shrink-0 flex-nowrap relative z-[13]">
                            <div
                                className="flex w-[110px] pt-[4px] pr-[8px] pb-[4px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap bg-[rgba(179,179,179,0.4)] rounded-[100px] border-solid border-[0.5px] border-[#dadada] relative box-content z-[14]">
                          <span
                              className="flex w-[94px]  justify-center items-start shrink-0 basis-auto  text-[12px] font-normal leading-[18px] text-[#fff] relative text-center whitespace-nowrap z-[15]">
                            Platinum (2)
                          </span>
                            </div>
                        </div>
                    </div>

                    <img src={"https://unlu-general.s3.ap-south-1.amazonaws.com/contest/shivaji+maharaj.png"}
                         className="w-[231px] h-[231px] shrink-0" alt={""}/>
                </div>
                <div className={"h-[1px] w-full bg-[#fff3]"}></div>

                <div className="flex flex-col gap-[8px] items-start self-stretch shrink-0 flex-nowrap relative z-[18]">
                    <div
                        className="flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[19]">
                      <span
                          className=" shrink-0 basis-auto  text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] relative text-left uppercase whitespace-nowrap z-20">
                        portfolio progress
                      </span>
                        <span
                            className=" shrink-0 basis-auto  text-[16px] font-bold leading-[24px] text-[#16a149] relative text-left">
                        +$400.28
                      </span>
                    </div>
                    <span
                        className="self-stretch shrink-0 basis-auto  text-[14px] font-normal leading-[21px] text-[rgba(250,250,250,0.9)] relative text-left">
                          Next maturity: 89 days, Estimated Payout: $1560.00
                        </span>
                    <div
                        className="flex flex-col self-stretch shrink-0">
                        <span className={'w-[63px] h-2 bg-[#16a149]'}></span>
                    </div>
                </div>
            </div>
        </div>

        <div
            className="flex w-full pt-[16px] pr-[24px] pb-[16px] pl-[24px] flex-col gap-[17px] items-start shrink-0 border-t border-t-[#ffffff33]">
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
                     ${(cost.silver * 100) + (cost.gold * 500)} USDC
                </span>
            </div>
            <button className={"flex justify-center items-center gap-2 bg-[#FE3D5B] py-3.5 w-full"}>
                <span className={"text-[12px] text-[#EFEFEF] leading-[14.4px]"}>Approve spending cap</span>
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
                    className="shrink-0 basis-auto  text-[11px] font-normal leading-[13px] text-[#c7c5c4] text-left uppercase">
                         powerd by redacted
                    </span>
            </div>
        </div>
    </div>
}

function YourDintMintNft({activeProject}) {
    const [timeLeft, setTimeLeft] = useState("0d : 0hr : 0m : 0s");

    useEffect(() => {
        const targetDate = moment("2025-09-20T00:00:00");

        const interval = setInterval(() => {
            const now = moment();
            const diff = moment.duration(now.diff(targetDate));

            const days = Math.floor(diff.asDays())
            const hours = diff.hours();
            const minutes = diff.minutes();
            const seconds = diff.seconds();

            setTimeLeft(`${days}d : ${hours}hr : ${minutes}m : ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    return <div
        className="hidden xl:flex xl:flex-col sticky top-[132px] self-start max-w-[450px] w-full h-[650px] max-h-[calc(100svh_-_172px)] bg-[#161616]  pt-6 gap-4 items-start  border-l border-white/20 backdrop-blur-[20px] mx-auto">
        <div className="flex flex-col gap-1.5 self-stretch shrink-0 px-3.5 border-b border-b-[#ffffff33] pb-4">
                 <div
                     className="shrink-0 basis-auto text-[22px] font-bold leading-[24px] text-[#d4c3c3] text-left whitespace-nowrap z-[2]">
                    Your Minted NFT’s
                  </div>
                    <div className="flex gap-[8px] items-center shrink-0 ">
                            <span
                                className="shrink-0 basis-auto text-[16px] font-medium opacity-80 leading-[17.6px] text-[#d4c3c3] text-left">
                              Minting Ended on:
                            </span>
                        <div
                            className="flex gap-[10px] justify-center items-center shrink-0  bg-[#ff4c4c3d]">
                                  <span
                                      className="flex gap-2.5 shrink-0 basis-auto text-[16px] font-bold p-1.5 text-[#FF4C4C] text-left ">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                          <path d="M15.8333 4.16669H4.16667C3.24619 4.16669 2.5 4.91288 2.5 5.83335V16.6667C2.5 17.5872 3.24619 18.3334 4.16667 18.3334H15.8333C16.7538 18.3334 17.5 17.5872 17.5 16.6667V5.83335C17.5 4.91288 16.7538 4.16669 15.8333 4.16669Z" stroke="#D4C3C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M5.83333 1.66669V4.16669M14.1667 1.66669V4.16669M2.5 8.33335H17.5" stroke="#D4C3C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                     {activeProject.endDate}
                                  </span>
                        </div>
                    </div>
        </div>

        <div className="flex gap-[16px] justify-center items-center grow px-3.5 flex-col  overflow-y-scroll w-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M17 24C18.0609 24 19.0783 23.5786 19.8284 22.8284C20.5786 22.0783 21 21.0609 21 20C21 18.9391 20.5786 17.9217 19.8284 17.1716C19.0783 16.4214 18.0609 16 17 16C15.9391 16 14.9217 16.4214 14.1716 17.1716C13.4214 17.9217 13 18.9391 13 20C13 21.0609 13.4214 22.0783 14.1716 22.8284C14.9217 23.5786 15.9391 24 17 24ZM23 2L42 13V35L23 46L4 35V13L23 2ZM8 15.306V32.694L12.744 35.44L28.89 23.6L38 29.068V15.308L23 6.62L8 15.306Z" fill="#D4C3C3"/>
            </svg>

            <span className={"text-[#d4c3c3e6]"}>

            </span>
            You didn’t mint any NFT for this project.
        </div>
    </div>
}

// non connected wallet
function WalletNotConnected() {
    const [focused, setFocused] = useState(false);

    return <div
        className="hidden xl:flex xl:flex-col sticky top-[132px] self-start max-w-[450px] w-full h-[650px] max-h-[calc(100svh_-_172px)] bg-[#161616]  pt-6 gap-4 items-start  border-l border-white/20 backdrop-blur-[20px] mx-auto">
        <div className="self-stretch shrink-0 px-6 pb-[16px] border-b-[1px] border-b-[#fff3]">
             <span
                 className="shrink-0 basis-auto text-[22px] font-bold leading-[24px] text-[#d4c3c3] text-left whitespace-nowrap z-[2]">
                    Mint
                  </span>
            <div className="flex w-[235px] gap-[8px] justify-end items-center shrink-0 ">
                    <span
                        className="h-[18px] shrink-0 basis-auto text-[16px] font-medium opacity-80 leading-[17.6px] text-[#d4c3c3] text-left">
                      Starts In:
                    </span>
                <div
                    className="flex w-[162px] pt-[6px] pr-[6px] pb-[6px] pl-[6px] gap-[10px] justify-center items-center shrink-0  bg-[rgba(22,161,73,0.24)]">
                          <span
                              className="h-[18px] shrink-0 basis-auto text-[16px] font-bold leading-[17.6px] text-[#16a149] text-left ">
                            2d : 12hr : 15m : 30s
                          </span>
                </div>
            </div>
        </div>

        <div className="flex grow px-6 flex-col gap-[16px] items-center self-stretch shrink-0">
            <div className="flex flex-col gap-[16px]">
                <div
                    className="flex py-3.5 px-[16px] gap-[6px] items-center self-stretch shrink-0 border border-[#4d4d53] relative overflow-hidden z-[15] rounded">
                    {!focused && (
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
                    )}

                    <input
                        type="text"
                        placeholder="Input Ethereum Wallet Address"
                        onFocus={() => setFocused(true)}
                        onBlur={(e) => {
                            if (!e.target.value) setFocused(false);
                        }}
                        className="bg-transparent outline-none text-[14px] text-[#efefef] placeholder:opacity-40 leading-[16.8px] w-full"
                    />
                </div>
                <span
                    className="flex justify-start items-start self-stretch shrink-0 text-[16px] font-normal leading-[24px] text-[rgba(212,195,195,0.9)] text-left">
                    Input your Ethereum address to check if you are eligible for the NFT
                    mint or simply connect your wallet to check.
                  </span>
            </div>
        </div>
        <div className="flex w-full pt-[16px] pr-[24px] pb-[16px] pl-[24px] flex-col gap-[17px] items-start shrink-0">
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

function RightSideBar({activeProject}) {
    const [paymentState] = useState(4);
    // const [cost, setCost] = useState({
    //     silver: 0,
    //     gold: 0
    // })

    const {isConnected} = useAccount();

    // const {data} = useBalance({
    //     address
    // })

    if (isConnected || true) {
        if (paymentState === 0) {
            return <WalletConnectedInputAddress/>
        } else if (paymentState === 1) {
            return <WalletConnectedMint/>
        } else if (paymentState === 2) {
            return <UserCanMint/>
        } else if (paymentState === 3) {
            return <YourMintNft/>
        } else if (paymentState === 4) {
            return <YourDintMintNft activeProject={activeProject}/>
        }
    }

    return <WalletNotConnected/>

    // if (isConnected) {
    //     return <div
    //         className="hidden xl:flex xl:flex-col sticky top-[132px] self-start max-w-[450px] w-full h-[650px] max-h-[calc(100svh_-_172px)] bg-[#161616]  p-6 gap-4 items-start  border-l border-white/20 backdrop-blur-[20px] mx-auto">
    //         {/* Header */}
    //         <div className={"flex flex-col justify-between grow w-full overflow-scroll no-scrollbar"}>
    //             <div>
    //                 <div className="flex min-w-0 flex-col gap-4 items-start self-stretch">
    //               <span className="h-6 text-[22px] font-bold leading-6 text-[#d4c3c3] text-left ">
    //                 Quick Invest
    //               </span>
    //                 </div>
    //
    //                 {/* Tiers */}
    //                 <div className="flex min-w-0 flex-col gap-4 items-start self-stretch py-6">
    //                     {/* Silver Tier */}
    //                     <div
    //                         className="flex p-4 justify-between items-center self-stretch border border-[#4d4d53] relative overflow-hidden">
    //                         <div className="flex gap-2 items-center">
    //                             <div className="p-3.5 bg-[#b3b3b3]">
    //                                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    //                                     <path d="M11.3337 16C12.0409 16 12.7192 15.719 13.2193 15.2189C13.7194 14.7189 14.0003 14.0406 14.0003 13.3333C14.0003 12.6261 13.7194 11.9478 13.2193 11.4477C12.7192 10.9476 12.0409 10.6667 11.3337 10.6667C10.6264 10.6667 9.94814 10.9476 9.44804 11.4477C8.94795 11.9478 8.66699 12.6261 8.66699 13.3333C8.66699 14.0406 8.94795 14.7189 9.44804 15.2189C9.94814 15.719 10.6264 16 11.3337 16ZM15.3337 1.33333L28.0003 8.66666V23.3333L15.3337 30.6667L2.66699 23.3333V8.66666L15.3337 1.33333ZM5.33366 10.204V21.796L8.49633 23.6267L19.2603 15.7333L25.3337 19.3787V10.2053L15.3337 4.41333L5.33366 10.204Z" fill="black"/>
    //                                 </svg>
    //                             </div>
    //                             <div className="flex flex-col gap-1.5 justify-center items-start">
    //                         <span className="text-base font-bold leading-[19px] text-white">
    //                           Silver Tier
    //                         </span>
    //                                 <span className="text-sm font-normal leading-[16.8px] text-[#d4c3c3]">
    //                           Total: {cost.silver}
    //                         </span>
    //                                 <span className="text-sm font-normal leading-[16.8px] text-[#d4c3c3] whitespace-nowrap">
    //                           $100.00 each
    //                         </span>
    //                             </div>
    //                         </div>
    //                         <div className="flex gap-[15px] items-center">
    //                             <button
    //                                 onClick={() => {
    //                                     if (cost.silver > 0) {
    //                                         setCost(e=> ({...e, silver: (e.silver - 1)}))
    //                                     }
    //                                 }}
    //                                 className={`flex p-1 justify-center items-center bg-[#333] ${(cost.silver === 0) ? "opacity-40" : "opacity-100"}  border border-[#333] cursor-pointer`}>
    //                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
    //                                     <path d="M13.2857 13.7857H21V11.2143H13.2857H10.7143H3V13.7857H10.7143H13.2857Z" fill="white"/>
    //                                 </svg>
    //                             </button>
    //                             <span className="h-6 text-[20px] font-bold leading-6 text-white">
    //                         {cost.silver}
    //                       </span>
    //                             <button
    //                                 onClick={() => {
    //                                     setCost(e=> ({...e, silver: (e.silver + 1)}))
    //                                 }}
    //                                 className="flex p-1 justify-center items-center bg-[#333] opacity-100 border border-[#333] cursor-pointer">
    //                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
    //                                     <path d="M21 13.7857H13.2857V21.5H10.7143V13.7857H3V11.2143H10.7143V3.5H13.2857V11.2143H21V13.7857Z" fill="white"/>
    //                                 </svg>
    //                             </button>
    //                         </div>
    //                     </div>
    //
    //                     {/* Gold Tier */}
    //                     <div
    //                         className="flex p-4 justify-between items-center self-stretch border border-[#4d4d53] relative overflow-hidden">
    //                         <div className="flex gap-2 items-center">
    //                             <div className="p-3.5 bg-[#ffc364]">
    //                                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    //                                     <path d="M11.3337 16C12.0409 16 12.7192 15.7191 13.2193 15.219C13.7194 14.7189 14.0003 14.0406 14.0003 13.3333C14.0003 12.6261 13.7194 11.9478 13.2193 11.4477C12.7192 10.9476 12.0409 10.6667 11.3337 10.6667C10.6264 10.6667 9.94814 10.9476 9.44804 11.4477C8.94795 11.9478 8.66699 12.6261 8.66699 13.3333C8.66699 14.0406 8.94795 14.7189 9.44804 15.219C9.94814 15.7191 10.6264 16 11.3337 16ZM15.3337 1.33334L28.0003 8.66668V23.3333L15.3337 30.6667L2.66699 23.3333V8.66668L15.3337 1.33334ZM5.33366 10.204V21.796L8.49633 23.6267L19.2603 15.7333L25.3337 19.3787V10.2053L15.3337 4.41334L5.33366 10.204Z" fill="black"/>
    //                                 </svg>
    //                             </div>
    //                             <div className="flex w-[84px] flex-col gap-1.5 justify-center items-start">
    //                     <span className="h-[19px] text-base font-bold leading-[19px] text-white">
    //                       Gold Tier
    //                     </span>
    //                                 <span className="h-[17px] text-sm font-normal leading-[16.8px] text-[#d4c3c3] whitespace-nowrap">
    //                       Total: {cost.gold}
    //                     </span>
    //                                 <span className="h-[17px] text-sm font-normal leading-[16.8px] text-[#d4c3c3] whitespace-nowrap">
    //                       $100.00 each
    //                     </span>
    //                             </div>
    //                         </div>
    //                         <div className="flex gap-[15px] items-center">
    //                             <button
    //                                 onClick={()=> {
    //                                     if (cost.gold > 0) {
    //                                         setCost(e=> ({...e, gold: (e.gold - 1)}))
    //                                     }
    //                                 }}
    //                                 className={`flex p-1 justify-center items-center bg-[#333] ${(cost.gold === 0) ? "opacity-40" : "opacity-100"} border border-[#333] cursor-pointer`}>
    //                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
    //                                     <path d="M13.2857 13.7857H21V11.2143H13.2857H10.7143H3V13.7857H10.7143H13.2857Z" fill="white"/>
    //                                 </svg>
    //                             </button>
    //                             <span className="h-6 text-[20px] font-bold leading-6 text-white">
    //                             {cost.gold}
    //                           </span>
    //                             <button
    //                                 onClick={()=>{
    //                                     setCost(e=> ({...e, gold: (e.gold + 1)}))
    //                                 }}
    //                                 className={`flex p-1 justify-center items-center bg-[#333] opacity-100} border border-[#333] cursor-pointer`}>
    //                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
    //                                     <path d="M21 13.7857H13.2857V21.5H10.7143V13.7857H3V11.2143H10.7143V3.5H13.2857V11.2143H21V13.7857Z" fill="white"/>
    //                                 </svg>
    //                             </button>
    //                         </div>
    //                     </div>
    //                 </div>
    //
    //                 {/* Cost Summary */}
    //                 <div className="flex min-w-0 flex-col gap-4 items-start self-stretch">
    //           <span className="h-[18px] text-base font-bold leading-[17.6px] text-[#d4c3c3]">
    //             Cost Summary
    //           </span>
    //                     <div className="flex flex-col gap-3 items-start self-stretch">
    //                         <div className="flex justify-between items-center self-stretch">
    //                   <span className="text-[12px] font-normal leading-[14px] uppercase text-[#d4c3c3]">
    //                     silver nft (3)
    //                   </span>
    //                             <span className="text-sm font-medium leading-[21px] text-[#f2f2f2]">
    //                     ${cost.silver * 100}
    //                   </span>
    //                         </div>
    //                         <div className={"w-full h-[1px] bg-[#ffffff4d]"}></div>
    //                         <div className="flex justify-between items-center self-stretch">
    //                   <span className="text-[12px] font-normal leading-[14px] uppercase text-[#d4c3c3]">
    //                     gold nft (2)
    //                   </span>
    //                             <span className="text-sm font-medium leading-[21px] text-[#f2f2f2]">
    //                   ${cost.gold * 100}
    //               </span>
    //                         </div>
    //                         <div className={"w-full h-[1px] bg-[#ffffff4d]"}></div>
    //                         <div className="flex justify-between items-center self-stretch">
    //               <span className="text-[12px] font-normal leading-[14px] uppercase text-[#d4c3c3]">
    //                 total
    //               </span>
    //                             <span className="text-sm font-bold leading-[21px] text-white">
    //                 ${((cost.silver * 100) + (cost.gold * 100))}
    //               </span>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //
    //
    //             {/* Balance */}
    //             <div className="flex gap-2 items-center">
    //                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
    //                     <path d="M16.2 4.05556V2.27778C16.2 1.29733 15.3927 0.5 14.4 0.5H2.7C1.2114 0.5 0 1.69644 0 3.16667V13.8333C0 15.7898 1.6146 16.5 2.7 16.5H16.2C17.1927 16.5 18 15.7027 18 14.7222V5.83333C18 4.85289 17.1927 4.05556 16.2 4.05556ZM14.4 12.0556H12.6V8.5H14.4V12.0556ZM2.7 4.05556C2.46827 4.04532 2.24946 3.94719 2.08915 3.78162C1.92883 3.61604 1.83936 3.39577 1.83936 3.16667C1.83936 2.93757 1.92883 2.7173 2.08915 2.55172C2.24946 2.38614 2.46827 2.28802 2.7 2.27778H14.4V4.05556H2.7Z" fill="#D4C3C3"/>
    //                 </svg>
    //
    //                 <span className="text-[12px] font-normal leading-[14px] uppercase text-[#d4c3c3]">
    //                 Balance:
    //               </span>
    //                 <span className="text-sm font-medium leading-[21px] text-[#f2f2f2]">
    //             {data?.formatted} {data?.symbol}
    //           </span>
    //             </div>
    //         </div>
    //
    //         <button
    //             className="flex items-center bg-[#fe3d5b] py-3.5 text-center justify-center cursor-pointer w-full">
    //             <span
    //                 className="text-[12px] font-medium leading-[14px] uppercase text-[#efefef] ">
    //                 invest ${((cost.silver * 100) + (cost.gold * 100))}
    //               </span>
    //         </button>
    //     </div>
    //
    // }

    // return <div
    //     className="hidden xl:block sticky top-[132px] self-start min-w-[460px] bg-[#161616] backdrop-blur-[20px]">
    //     <div
    //         className="flex w-full p-6 flex-col gap-6 items-start bg-[#161616] border-l border-l-[#ffffff33] backdrop-blur-[20px]">
    //         <div className="flex min-w-0 flex-col gap-4 items-start self-stretch">
    //           <span className="h-6 text-[22px] font-bold leading-6 text-[#d4c3c3] ">
    //             Quick Invest
    //           </span>
    //         </div>
    //
    //         <div
    //             className="flex min-w-0 h-[482px] max-h-[calc(100vh_-_350px)] px-1 pt-10 pb-1.5 flex-col gap-4 justify-center items-center self-stretch overflow-hidden">
    //             <div className="flex flex-col gap-4 items-center self-stretch">
    //                 <svg xmlns="http://www.w3.org/2000/svg" width="40" height="36" viewBox="0 0 40 36" fill="none">
    //                     <path d="M36 8V4C36 1.794 34.206 0 32 0H6C2.692 0 0 2.692 0 6V30C0 34.402 3.588 36 6 36H36C38.206 36 40 34.206 40 32V12C40 9.794 38.206 8 36 8ZM32 26H28V18H32V26ZM6 8C5.48504 7.97696 4.99881 7.75619 4.64255 7.38364C4.28629 7.01108 4.08747 6.51547 4.08747 6C4.08747 5.48453 4.28629 4.98892 4.64255 4.61636C4.99881 4.24381 5.48504 4.02304 6 4H32V8H6Z" fill="#D4C3C3"/>
    //                 </svg>
    //                 <span
    //                     className="h-6 self-stretch text-base font-normal leading-6 text-[#d4c3c3]/90 text-center ">
    //                   Connect wallet to check investment eligibility
    //                 </span>
    //             </div>
    //         </div>
    //
    //         <button className="flex justify-center items-center w-full bg-[#898989] py-3.5 text-center cursor-not-allowed">
    //                         <span className="text-[12px] font-medium leading-[14px] uppercase text-[#efefef] opacity-40">
    //                             invest now
    //                         </span>
    //         </button>
    //     </div>
    // </div>
}

function MobileInvestNow() {
    const [open, setOpen] = useState(false)
    const [cost, setCose] = useState({
        silver: 0,
        gold: 0
    })

    const {address, isConnected} = useAccount();

    const {data} = useBalance({
        address
    })


    return <div
        className={`fixed flex flex-col xl:hidden bottom-0 right-0 w-dvw z-50 bg-[#00000933] transform duration-1000 ${open ? "h-svh" : "h-[58px]"}`}>

        <div
            className={`flex flex-col justify-between flex-1 bg-[#161616] ${open ? "h-full mt-[52px]" : "h-0"} overflow-scroll border-t border-t-[#ffffff33] px-4`}>
            <div className={""}>
                <div className="flex justify-between items-start pt-6">
              <span className="text-[22px] font-bold leading-6 text-[#d4c3c3] text-left ">
                Quick Invest
              </span>

                    <button onClick={() => {
                        setOpen(false)
                    }}>
                        <svg className={"opacity-40"} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                             viewBox="0 0 24 24" fill="none">
                            <g clip-path="url(#clip0_337_409)">
                                <path
                                    d="M17.4548 19.2731L12 13.8183L6.54518 19.2731L4.7269 17.4548L10.1817 12L4.7269 6.54518L6.54518 4.7269L12 10.1817L17.4548 4.7269L19.2731 6.54518L13.8183 12L19.2731 17.4548L17.4548 19.2731Z"
                                    fill="white"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_337_409">
                                    <rect width="24" height="24" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>

                {/* Tiers */}
                <div className="flex min-w-0 flex-col gap-4 items-start py-6">
                    {/* Silver Tier */}
                    <div
                        className="flex p-4 justify-between items-center self-stretch border border-[#4d4d53] relative overflow-hidden">
                        <div className="flex gap-2 items-center">
                            <div className="p-5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33"
                                     fill="none">
                                    <path
                                        d="M11.3332 16.5C12.0404 16.5 12.7187 16.219 13.2188 15.7189C13.7189 15.2188 13.9998 14.5406 13.9998 13.8333C13.9998 13.1261 13.7189 12.4478 13.2188 11.9477C12.7187 11.4476 12.0404 11.1666 11.3332 11.1666C10.6259 11.1666 9.94765 11.4476 9.44755 11.9477C8.94746 12.4478 8.66651 13.1261 8.66651 13.8333C8.66651 14.5406 8.94746 15.2188 9.44755 15.7189C9.94765 16.219 10.6259 16.5 11.3332 16.5ZM15.3332 1.83331L27.9998 9.16665V23.8333L15.3332 31.1667L2.6665 23.8333V9.16665L15.3332 1.83331ZM5.33317 10.704V22.296L8.49584 24.1266L19.2598 16.2333L25.3332 19.8787V10.7053L15.3332 4.91331L5.33317 10.704Z"
                                        fill="white"/>
                                </svg>
                            </div>
                            <div className="flex flex-col gap-1.5 justify-center items-start">
                            <span className="text-base font-bold leading-[19px] text-white">
                              Silver Tier
                            </span>
                                <span className="text-sm font-normal leading-[16.8px] text-[#d4c3c3]">
                              Total: ${cost.silver}
                            </span>
                                <span className="text-sm font-normal leading-[16.8px] text-[#d4c3c3] whitespace-nowrap">
                              $100.00 each
                            </span>
                            </div>
                        </div>
                        <div className="flex gap-[15px] items-center">
                            <button
                                onClick={() => {
                                    if (cost.silver > 0) {
                                        setCose(e => ({...e, silver: (e.silver - 1)}))
                                    }
                                }}
                                className="flex p-1 justify-center items-center bg-[#333] opacity-40  border border-[#333] cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"
                                     fill="none">
                                    <path d="M13.2857 13.7857H21V11.2143H13.2857H10.7143H3V13.7857H10.7143H13.2857Z"
                                          fill="white"/>
                                </svg>
                            </button>
                            <span className="h-6 text-[20px] font-bold leading-6 text-white">
                            {cost.silver}
                          </span>
                            <button
                                onClick={() => {
                                    setCose(e => ({...e, silver: (e.silver + 1)}))
                                }}
                                className="flex p-1 justify-center items-center bg-[#333] opacity-40 border border-[#333] cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"
                                     fill="none">
                                    <path
                                        d="M21 13.7857H13.2857V21.5H10.7143V13.7857H3V11.2143H10.7143V3.5H13.2857V11.2143H21V13.7857Z"
                                        fill="white"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Gold Tier */}
                    <div
                        className="flex p-4 justify-between items-center self-stretch border border-[#4d4d53] relative overflow-hidden">
                        <div className="flex gap-2 items-center">
                            <div className="p-3.5 bg-[#ffc364]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"
                                     fill="none">
                                    <path
                                        d="M11.3337 16C12.0409 16 12.7192 15.7191 13.2193 15.219C13.7194 14.7189 14.0003 14.0406 14.0003 13.3333C14.0003 12.6261 13.7194 11.9478 13.2193 11.4477C12.7192 10.9476 12.0409 10.6667 11.3337 10.6667C10.6264 10.6667 9.94814 10.9476 9.44804 11.4477C8.94795 11.9478 8.66699 12.6261 8.66699 13.3333C8.66699 14.0406 8.94795 14.7189 9.44804 15.219C9.94814 15.7191 10.6264 16 11.3337 16ZM15.3337 1.33334L28.0003 8.66668V23.3333L15.3337 30.6667L2.66699 23.3333V8.66668L15.3337 1.33334ZM5.33366 10.204V21.796L8.49633 23.6267L19.2603 15.7333L25.3337 19.3787V10.2053L15.3337 4.41334L5.33366 10.204Z"
                                        fill="black"/>
                                </svg>
                            </div>
                            <div className="flex w-[84px] flex-col gap-1.5 justify-center items-start">
                        <span className="h-[19px] text-base font-bold leading-[19px] text-white">
                          Gold Tier
                        </span>
                                <span
                                    className="h-[17px] text-sm font-normal leading-[16.8px] text-[#d4c3c3] whitespace-nowrap">
                          Total: ${cost.gold}
                        </span>
                                <span
                                    className="h-[17px] text-sm font-normal leading-[16.8px] text-[#d4c3c3] whitespace-nowrap">
                          $100.00 each
                        </span>
                            </div>
                        </div>
                        <div className="flex gap-[15px] items-center">
                            <button
                                onClick={() => {
                                    if (cost.gold > 0) {
                                        setCose(e => ({...e, gold: (e.gold - 1)}))
                                    }
                                }}
                                className="flex p-1 justify-center items-center bg-[#333] opacity-40  border border-[#333] cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"
                                     fill="none">
                                    <path d="M13.2857 13.7857H21V11.2143H13.2857H10.7143H3V13.7857H10.7143H13.2857Z"
                                          fill="white"/>
                                </svg>
                            </button>
                            <span className="h-6 text-[20px] font-bold leading-6 text-white">
                        {cost.gold}
                      </span>
                            <button
                                onClick={() => {
                                    setCose(e => ({...e, gold: (e.gold + 1)}))
                                }}
                                className="flex p-1 justify-center items-center bg-[#333] opacity-40 border border-[#333] cursor-pointer">
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

                {/* Cost Summary */}
                <div className="flex min-w-0 flex-col gap-4 items-start self-stretch">
              <span className="h-[18px] text-base font-bold leading-[17.6px] text-[#d4c3c3]">
                Cost Summary
              </span>
                    <div className="flex flex-col gap-3 items-start self-stretch">
                        <div className="flex justify-between items-center self-stretch">
                      <span className="text-[12px] font-normal leading-[14px] uppercase text-[#d4c3c3]">
                        silver nft (3)
                      </span>
                            <span className="text-sm font-medium leading-[21px] text-[#f2f2f2]">
                        ${cost.silver * 100}
                      </span>
                        </div>
                        <div className={"bg-[#ffffff4d] h-[1px] w-full"}></div>
                        <div className="flex justify-between items-center self-stretch">
                      <span className="text-[12px] font-normal leading-[14px] uppercase text-[#d4c3c3]">
                        gold nft (2)
                      </span>
                            <span className="text-sm font-medium leading-[21px] text-[#f2f2f2]">
                      ${cost.gold * 100}
                  </span>
                        </div>
                        <div className={"bg-[#ffffff4d] h-[1px] w-full"}></div>
                        <div className="flex justify-between items-center self-stretch">
                  <span className="text-[12px] font-normal leading-[14px] uppercase text-[#d4c3c3]">
                    total
                  </span>
                            <span className="text-sm font-bold leading-[21px] text-white">
                    ${((cost.silver * 100) + (cost.gold * 100))}
                  </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Balance */}
            <div className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                    <path
                        d="M16.2 4.05556V2.27778C16.2 1.29733 15.3927 0.5 14.4 0.5H2.7C1.2114 0.5 0 1.69644 0 3.16667V13.8333C0 15.7898 1.6146 16.5 2.7 16.5H16.2C17.1927 16.5 18 15.7027 18 14.7222V5.83333C18 4.85289 17.1927 4.05556 16.2 4.05556ZM14.4 12.0556H12.6V8.5H14.4V12.0556ZM2.7 4.05556C2.46827 4.04532 2.24946 3.94719 2.08915 3.78162C1.92883 3.61604 1.83936 3.39577 1.83936 3.16667C1.83936 2.93757 1.92883 2.7173 2.08915 2.55172C2.24946 2.38614 2.46827 2.28802 2.7 2.27778H14.4V4.05556H2.7Z"
                        fill="#D4C3C3"/>
                </svg>

                <span className="text-[12px] font-normal leading-[14px] uppercase text-[#d4c3c3]">
                    Balance:
                  </span>
                <span className="text-sm font-medium leading-[21px] text-[#f2f2f2]">
                {data?.formatted} {data?.symbol}
              </span>
            </div>
        </div>

        <div className={"py-2 px-4 bg-[#161616]"}>
            <button onClick={() => {
                // if (isConnected) {
                //     setOpen(true)
                // }
            }} className={`flex gap-2 justify-center azeret-mono items-center w-full text-[#EFEFEF] bg-[#898989] opacity-40}  py-3.5 text-center cursor-pointer text-[12px] font-medium uppercase  z-[1000]`}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 44 58" fill="none">
                        <path d="M39.75 27.668V17.916C39.75 8.12802 31.79 0.166016 22 0.166016C12.21 0.166016 4.24998 8.12602 4.24998 17.916V27.668H0.0839844V57.834H43.916V27.668H39.75ZM11.25 17.916C11.25 11.988 16.07 7.16602 22 7.16602C27.93 7.16602 32.75 11.986 32.75 17.916V27.668H11.25V17.916ZM26.544 50.912H17.454L19.898 43.578C19.105 43.1885 18.4367 42.585 17.9685 41.8358C17.5002 41.0867 17.2507 40.2215 17.248 39.338C17.248 38.0782 17.7484 36.8701 18.6392 35.9793C19.53 35.0885 20.7382 34.588 21.998 34.588C23.2578 34.588 24.4659 35.0885 25.3567 35.9793C26.2475 36.8701 26.748 38.0782 26.748 39.338C26.748 41.202 25.664 42.798 24.1 43.578L26.544 50.912Z" fill="#D4C3C3"/>
                    </svg>
                </div>
                <div>Funding Closed</div>
            </button>
        </div>
    </div>
}

export default function ProjectCard() {
    const {id} = useParams();
    const activeProject = projectData.find((e) => e.id === id)

    if (!activeProject) {
        return <PageNotFound/>
    }


    return  <MintingInterface />
}