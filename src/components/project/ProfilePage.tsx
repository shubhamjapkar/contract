import React, {useState, useEffect} from 'react';
import HeaderFooter from "../lp/HeaderFooter.tsx";
import first_bg from "../../assets/lp/first_bg.png";
import CopyIcon from "../Icons/CopyIcon.tsx";
import {apiHandler} from "../../services/apiHandler.ts";

// Types
interface NFTCollection {
    id: string;
    name: string;
    category: string;
    totalNFTs: number;
    silver: number;
    gold: number;
    platinum: number;
    nextMaturity: number;
    estimatedPayout: number;
    totalInvested: number;
    currentValue: number;
    unrealisedGains: number;
    avgAPYRate: number;
    image: string;
}

interface UserProfile {
    name: string;
    userId: string;
    avatar: string;
    totalPortfolioValue: number;
    dailyAccrual: number;
    averageROI: number;
    totalNFTs: number;
    nftBreakdown: {
        silver: number;
        gold: number;
        platinum: number;
    };
    maturingSoon: number;
    walletBalance: number;
}

// API functions - Single call to get all profile data
const fetchCompleteProfileData = async () => {
    const walletId = 'wallet_005_alice';
    const data = await apiHandler.getCompleteProfileData(walletId);

    // Map API response to UserProfile interface
    const userProfile: UserProfile = {
        name: data.userProfile.name,
        userId: data.userProfile.wallet_id,
        avatar: data.userProfile.avatar,
        totalPortfolioValue: data.userProfile.total_portfolio_value || 0,
        dailyAccrual: data.userProfile.daily_accrual || 0,
        averageROI: data.userProfile.average_roi || 0,
        totalNFTs: data.userProfile.total_nfts || 0,
        nftBreakdown: {
            silver: data.userProfile.nft_breakdown?.silver || 0,
            gold: data.userProfile.nft_breakdown?.gold || 0,
            platinum: data.userProfile.nft_breakdown?.platinum || 0
        },
        maturingSoon: data.userProfile.maturing_soon || 0,
        walletBalance: data.userProfile.wallet_balance || 0
    };

    return {
        userProfile,
        nftCollections: data.nftCollections
    };
};

function ActiveTabCom({tab}: { tab: string }) {
    if (tab === 'MY NFT\'S') {
        return <div className={"flex flex-col gap-2 pt-4"}>
            <div className="flex flex-col items-start relative overflow-x-scroll no-scrollbar">
                <div className={"bg-[#121214] border-solid border border-[rgba(255,255,255,0.2)] w-auto min-w-full"}>
                    <div className="grid grid-cols-[200px_150px_200px_200px] px-6 py-3 items-center w-full  relative">
                        <div className="flex gap-[8px] items-center flex-nowrap">
                            <div
                                className="w-[48px] h-[48px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-10-27/6OcbiOuGjC.png)] bg-cover bg-no-repeat relative z-[2]"/>
                            <div
                                className="flex w-[64px] flex-col gap-[8px] justify-center items-start shrink-0 flex-nowrap relative z-[3]">
                        <span
                            className="h-[17px] shrink-0 basis-auto  text-[14px] font-semibold leading-[16.8px] text-[#fff] relative text-left whitespace-nowrap z-[4]">
                          Silver Tier
                        </span>
                                <div
                                    className="flex w-[59px] h-[24px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[6px] justify-center items-center shrink-0 flex-nowrap bg-[#121214] rounded-[51px] border-solid border border-[rgba(255,255,255,0.2)] relative overflow-hidden z-[5]">
                              <span
                                  className="h-[14px] shrink-0 basis-auto  text-[12px] font-normal leading-[14px] text-[#fff] relative text-left uppercase whitespace-nowrap z-[6]">
                                2 nft’S
                              </span>
                                </div>
                            </div>
                        </div>

                        <span
                            className="flex justify-start items-start  text-[14px] font-semibold leading-[16.8px] text-[#f99d51] text-left whitespace-nowrap">
                      Un-revealed
                </span>

                        <div
                            className="flex h-fit p-[6px] gap-[10px] justify-center items-center flex-nowrap bg-[rgba(22,161,73,0.24)]">
                    <span className="text-[14px] font-bold leading-[18px] text-[#16a149] relative text-left">
                            2d : 12hr : 15m : 30s
                          </span>
                        </div>

                        <button className={"cursor-pointer bg-[#2D2D2F] absolute top-1/2 right-6 -translate-y-1/2"}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none">
                                <rect width="24" height="24" transform="translate(24 1.04907e-06) rotate(90)"
                                      fill="#2D2D2F"/>
                                <path
                                    d="M11.9951 10.1544L6.56881 15.5806C6.38425 15.7652 6.16892 15.8545 5.92283 15.8486C5.67674 15.8427 5.46142 15.7472 5.27685 15.5621C5.09228 15.3771 5 15.1618 5 14.9162C5 14.6706 5.09228 14.4552 5.27685 14.2702L10.943 8.58554C11.0907 8.43788 11.2568 8.32715 11.4414 8.25332C11.6259 8.17949 11.8105 8.14258 11.9951 8.14258C12.1796 8.14258 12.3642 8.17949 12.5488 8.25332C12.7333 8.32715 12.8994 8.43789 13.0471 8.58554L18.7317 14.2702C18.9163 14.4547 19.0056 14.6733 18.9997 14.9258C18.9938 15.1782 18.8983 15.3965 18.7133 15.5806C18.5282 15.7647 18.3129 15.857 18.0673 15.8575C17.8217 15.8579 17.6064 15.7657 17.4213 15.5806L11.9951 10.1544Z"
                                    fill="#D4C3C3"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="w-auto min-w-full shrink-0 bg-[#1e1e1e] relative pb-[24px]">
                    <div className={"grid px-[24px] py-2 grid-cols-[200px_150px_200px_200px]"}>
                        <div className={"flex gap-1 items-center text-[#d4c3c3b3]"}>
                            Received date
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                 fill="none">
                                <path
                                    d="M7.33398 11.3333H8.66732V7.33325H7.33398V11.3333ZM8.00065 5.99992C8.18954 5.99992 8.34798 5.93592 8.47598 5.80792C8.60398 5.67992 8.66776 5.5217 8.66732 5.33325C8.66687 5.14481 8.60287 4.98659 8.47532 4.85859C8.34776 4.73059 8.18954 4.66659 8.00065 4.66659C7.81176 4.66659 7.65354 4.73059 7.52598 4.85859C7.39843 4.98659 7.33443 5.14481 7.33398 5.33325C7.33354 5.5217 7.39754 5.68014 7.52598 5.80859C7.65443 5.93703 7.81265 6.00081 8.00065 5.99992ZM8.00065 14.6666C7.07843 14.6666 6.21176 14.4915 5.40065 14.1413C4.58954 13.791 3.88399 13.3161 3.28399 12.7166C2.68399 12.117 2.2091 11.4115 1.85932 10.5999C1.50954 9.78836 1.33443 8.9217 1.33399 7.99992C1.33354 7.07814 1.50865 6.21147 1.85932 5.39992C2.20999 4.58836 2.68487 3.88281 3.28399 3.28325C3.8831 2.6837 4.58865 2.20881 5.40065 1.85859C6.21265 1.50836 7.07932 1.33325 8.00065 1.33325C8.92198 1.33325 9.78865 1.50836 10.6007 1.85859C11.4127 2.20881 12.1182 2.6837 12.7173 3.28325C13.3164 3.88281 13.7915 4.58836 14.1427 5.39992C14.4938 6.21147 14.6687 7.07814 14.6673 7.99992C14.666 8.9217 14.4909 9.78836 14.142 10.5999C13.7931 11.4115 13.3182 12.117 12.7173 12.7166C12.1164 13.3161 11.4109 13.7913 10.6007 14.1419C9.79043 14.4926 8.92376 14.6675 8.00065 14.6666ZM8.00065 13.3333C9.48954 13.3333 10.7507 12.8166 11.784 11.7833C12.8173 10.7499 13.334 9.48881 13.334 7.99992C13.334 6.51103 12.8173 5.24992 11.784 4.21659C10.7507 3.18325 9.48954 2.66659 8.00065 2.66659C6.51176 2.66659 5.25065 3.18325 4.21732 4.21659C3.18399 5.24992 2.66732 6.51103 2.66732 7.99992C2.66732 9.48881 3.18399 10.7499 4.21732 11.7833C5.25065 12.8166 6.51176 13.3333 8.00065 13.3333Z"
                                    fill="#D4C3C3" fill-opacity="0.7"/>
                            </svg>
                        </div>
                        <div className={"flex gap-1 items-center text-[#d4c3c3b3]"}>
                            source
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                 fill="none">
                                <path
                                    d="M7.33398 11.3333H8.66732V7.33325H7.33398V11.3333ZM8.00065 5.99992C8.18954 5.99992 8.34798 5.93592 8.47598 5.80792C8.60398 5.67992 8.66776 5.5217 8.66732 5.33325C8.66687 5.14481 8.60287 4.98659 8.47532 4.85859C8.34776 4.73059 8.18954 4.66659 8.00065 4.66659C7.81176 4.66659 7.65354 4.73059 7.52598 4.85859C7.39843 4.98659 7.33443 5.14481 7.33398 5.33325C7.33354 5.5217 7.39754 5.68014 7.52598 5.80859C7.65443 5.93703 7.81265 6.00081 8.00065 5.99992ZM8.00065 14.6666C7.07843 14.6666 6.21176 14.4915 5.40065 14.1413C4.58954 13.791 3.88399 13.3161 3.28399 12.7166C2.68399 12.117 2.2091 11.4115 1.85932 10.5999C1.50954 9.78836 1.33443 8.9217 1.33399 7.99992C1.33354 7.07814 1.50865 6.21147 1.85932 5.39992C2.20999 4.58836 2.68487 3.88281 3.28399 3.28325C3.8831 2.6837 4.58865 2.20881 5.40065 1.85859C6.21265 1.50836 7.07932 1.33325 8.00065 1.33325C8.92198 1.33325 9.78865 1.50836 10.6007 1.85859C11.4127 2.20881 12.1182 2.6837 12.7173 3.28325C13.3164 3.88281 13.7915 4.58836 14.1427 5.39992C14.4938 6.21147 14.6687 7.07814 14.6673 7.99992C14.666 8.9217 14.4909 9.78836 14.142 10.5999C13.7931 11.4115 13.3182 12.117 12.7173 12.7166C12.1164 13.3161 11.4109 13.7913 10.6007 14.1419C9.79043 14.4926 8.92376 14.6675 8.00065 14.6666ZM8.00065 13.3333C9.48954 13.3333 10.7507 12.8166 11.784 11.7833C12.8173 10.7499 13.334 9.48881 13.334 7.99992C13.334 6.51103 12.8173 5.24992 11.784 4.21659C10.7507 3.18325 9.48954 2.66659 8.00065 2.66659C6.51176 2.66659 5.25065 3.18325 4.21732 4.21659C3.18399 5.24992 2.66732 6.51103 2.66732 7.99992C2.66732 9.48881 3.18399 10.7499 4.21732 11.7833C5.25065 12.8166 6.51176 13.3333 8.00065 13.3333Z"
                                    fill="#D4C3C3" fill-opacity="0.7"/>
                            </svg>
                        </div>
                        <div className={"flex gap-1 items-center text-[#d4c3c3b3]"}>
                            source
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                 fill="none">
                                <path
                                    d="M7.33398 11.3333H8.66732V7.33325H7.33398V11.3333ZM8.00065 5.99992C8.18954 5.99992 8.34798 5.93592 8.47598 5.80792C8.60398 5.67992 8.66776 5.5217 8.66732 5.33325C8.66687 5.14481 8.60287 4.98659 8.47532 4.85859C8.34776 4.73059 8.18954 4.66659 8.00065 4.66659C7.81176 4.66659 7.65354 4.73059 7.52598 4.85859C7.39843 4.98659 7.33443 5.14481 7.33398 5.33325C7.33354 5.5217 7.39754 5.68014 7.52598 5.80859C7.65443 5.93703 7.81265 6.00081 8.00065 5.99992ZM8.00065 14.6666C7.07843 14.6666 6.21176 14.4915 5.40065 14.1413C4.58954 13.791 3.88399 13.3161 3.28399 12.7166C2.68399 12.117 2.2091 11.4115 1.85932 10.5999C1.50954 9.78836 1.33443 8.9217 1.33399 7.99992C1.33354 7.07814 1.50865 6.21147 1.85932 5.39992C2.20999 4.58836 2.68487 3.88281 3.28399 3.28325C3.8831 2.6837 4.58865 2.20881 5.40065 1.85859C6.21265 1.50836 7.07932 1.33325 8.00065 1.33325C8.92198 1.33325 9.78865 1.50836 10.6007 1.85859C11.4127 2.20881 12.1182 2.6837 12.7173 3.28325C13.3164 3.88281 13.7915 4.58836 14.1427 5.39992C14.4938 6.21147 14.6687 7.07814 14.6673 7.99992C14.666 8.9217 14.4909 9.78836 14.142 10.5999C13.7931 11.4115 13.3182 12.117 12.7173 12.7166C12.1164 13.3161 11.4109 13.7913 10.6007 14.1419C9.79043 14.4926 8.92376 14.6675 8.00065 14.6666ZM8.00065 13.3333C9.48954 13.3333 10.7507 12.8166 11.784 11.7833C12.8173 10.7499 13.334 9.48881 13.334 7.99992C13.334 6.51103 12.8173 5.24992 11.784 4.21659C10.7507 3.18325 9.48954 2.66659 8.00065 2.66659C6.51176 2.66659 5.25065 3.18325 4.21732 4.21659C3.18399 5.24992 2.66732 6.51103 2.66732 7.99992C2.66732 9.48881 3.18399 10.7499 4.21732 11.7833C5.25065 12.8166 6.51176 13.3333 8.00065 13.3333Z"
                                    fill="#D4C3C3" fill-opacity="0.7"/>
                            </svg>
                        </div>
                        <div className={"flex gap-1 items-center text-[#d4c3c3b3]"}>
                            transaction hash

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                 fill="none">
                                <path
                                    d="M7.33398 11.3333H8.66732V7.33325H7.33398V11.3333ZM8.00065 5.99992C8.18954 5.99992 8.34798 5.93592 8.47598 5.80792C8.60398 5.67992 8.66776 5.5217 8.66732 5.33325C8.66687 5.14481 8.60287 4.98659 8.47532 4.85859C8.34776 4.73059 8.18954 4.66659 8.00065 4.66659C7.81176 4.66659 7.65354 4.73059 7.52598 4.85859C7.39843 4.98659 7.33443 5.14481 7.33398 5.33325C7.33354 5.5217 7.39754 5.68014 7.52598 5.80859C7.65443 5.93703 7.81265 6.00081 8.00065 5.99992ZM8.00065 14.6666C7.07843 14.6666 6.21176 14.4915 5.40065 14.1413C4.58954 13.791 3.88399 13.3161 3.28399 12.7166C2.68399 12.117 2.2091 11.4115 1.85932 10.5999C1.50954 9.78836 1.33443 8.9217 1.33399 7.99992C1.33354 7.07814 1.50865 6.21147 1.85932 5.39992C2.20999 4.58836 2.68487 3.88281 3.28399 3.28325C3.8831 2.6837 4.58865 2.20881 5.40065 1.85859C6.21265 1.50836 7.07932 1.33325 8.00065 1.33325C8.92198 1.33325 9.78865 1.50836 10.6007 1.85859C11.4127 2.20881 12.1182 2.6837 12.7173 3.28325C13.3164 3.88281 13.7915 4.58836 14.1427 5.39992C14.4938 6.21147 14.6687 7.07814 14.6673 7.99992C14.666 8.9217 14.4909 9.78836 14.142 10.5999C13.7931 11.4115 13.3182 12.117 12.7173 12.7166C12.1164 13.3161 11.4109 13.7913 10.6007 14.1419C9.79043 14.4926 8.92376 14.6675 8.00065 14.6666ZM8.00065 13.3333C9.48954 13.3333 10.7507 12.8166 11.784 11.7833C12.8173 10.7499 13.334 9.48881 13.334 7.99992C13.334 6.51103 12.8173 5.24992 11.784 4.21659C10.7507 3.18325 9.48954 2.66659 8.00065 2.66659C6.51176 2.66659 5.25065 3.18325 4.21732 4.21659C3.18399 5.24992 2.66732 6.51103 2.66732 7.99992C2.66732 9.48881 3.18399 10.7499 4.21732 11.7833C5.25065 12.8166 6.51176 13.3333 8.00065 13.3333Z"
                                    fill="#D4C3C3" fill-opacity="0.7"/>
                            </svg>
                        </div>
                    </div>


                    {[1, 1].map(() => {
                        return <div className={"grid px-[24px] py-2 grid-cols-[200px_150px_200px_200px]"}>
                    <span
                        className="flex justify-start items-start text-[14px] font-semibold leading-[16.8px] text-[#fff] text-left whitespace-nowrap">
                            Oct 12, 2025, 7:20 PM
                          </span>
                            <span
                                className="flex justify-start items-start text-[14px] font-semibold leading-[16.8px] text-[#d4c3c3] text-left">
                            Minted
                          </span>
                            <span
                                className="flex justify-start items-start text-[14px] font-semibold leading-[16.8px] text-[#d4c3c3] text-left">
                            1
                          </span>
                            <span
                                className="flex justify-start items-start text-[14px] font-semibold leading-[16.8px] text-[#d4c3c3] text-left underline">
                            #TXN123
                          </span>
                        </div>
                    })}

                </div>
            </div>
            <div className="flex flex-col items-start relative overflow-x-scroll no-scrollbar">
                <div className={"bg-[#121214] border-solid border border-[rgba(255,255,255,0.2)] w-auto min-w-full"}>
                    <div className="grid grid-cols-[200px_150px_200px_200px] px-6 py-3 items-center w-full  relative">
                        <div className="flex gap-[8px] items-center flex-nowrap">
                            <div
                                className="w-[48px] h-[48px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-10-27/6OcbiOuGjC.png)] bg-cover bg-no-repeat relative z-[2]"/>
                            <div
                                className="flex w-[64px] flex-col gap-[8px] justify-center items-start shrink-0 flex-nowrap relative z-[3]">
                        <span
                            className="h-[17px] shrink-0 basis-auto  text-[14px] font-semibold leading-[16.8px] text-[#fff] relative text-left whitespace-nowrap z-[4]">
                          Silver Tier
                        </span>
                                <div
                                    className="flex w-[59px] h-[24px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[6px] justify-center items-center shrink-0 flex-nowrap bg-[#121214] rounded-[51px] border-solid border border-[rgba(255,255,255,0.2)] relative overflow-hidden z-[5]">
                              <span
                                  className="h-[14px] shrink-0 basis-auto  text-[12px] font-normal leading-[14px] text-[#fff] relative text-left uppercase whitespace-nowrap z-[6]">
                                2 nft’S
                              </span>
                                </div>
                            </div>
                        </div>

                        <span
                            className="flex justify-start items-start  text-[14px] font-semibold leading-[16.8px] text-[#f99d51] text-left whitespace-nowrap">
                      Un-revealed
                </span>

                        <div
                            className="flex h-fit p-[6px] gap-[10px] justify-center items-center flex-nowrap bg-[rgba(22,161,73,0.24)]">
                    <span className="text-[14px] font-bold leading-[18px] text-[#16a149] relative text-left">
                            2d : 12hr : 15m : 30s
                          </span>
                        </div>

                        <button className={"cursor-pointer bg-[#2D2D2F] absolute top-1/2 right-6 -translate-y-1/2"}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none">
                                <rect width="24" height="24" transform="translate(24 1.04907e-06) rotate(90)"
                                      fill="#2D2D2F"/>
                                <path
                                    d="M11.9951 10.1544L6.56881 15.5806C6.38425 15.7652 6.16892 15.8545 5.92283 15.8486C5.67674 15.8427 5.46142 15.7472 5.27685 15.5621C5.09228 15.3771 5 15.1618 5 14.9162C5 14.6706 5.09228 14.4552 5.27685 14.2702L10.943 8.58554C11.0907 8.43788 11.2568 8.32715 11.4414 8.25332C11.6259 8.17949 11.8105 8.14258 11.9951 8.14258C12.1796 8.14258 12.3642 8.17949 12.5488 8.25332C12.7333 8.32715 12.8994 8.43789 13.0471 8.58554L18.7317 14.2702C18.9163 14.4547 19.0056 14.6733 18.9997 14.9258C18.9938 15.1782 18.8983 15.3965 18.7133 15.5806C18.5282 15.7647 18.3129 15.857 18.0673 15.8575C17.8217 15.8579 17.6064 15.7657 17.4213 15.5806L11.9951 10.1544Z"
                                    fill="#D4C3C3"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="w-auto min-w-full shrink-0 bg-[#1e1e1e] relative pb-[24px]">
                    <div className={"grid px-[24px] py-2 grid-cols-[200px_150px_200px_200px]"}>
                        <div className={"flex gap-1 items-center text-[#d4c3c3b3]"}>
                            Received date
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                 fill="none">
                                <path
                                    d="M7.33398 11.3333H8.66732V7.33325H7.33398V11.3333ZM8.00065 5.99992C8.18954 5.99992 8.34798 5.93592 8.47598 5.80792C8.60398 5.67992 8.66776 5.5217 8.66732 5.33325C8.66687 5.14481 8.60287 4.98659 8.47532 4.85859C8.34776 4.73059 8.18954 4.66659 8.00065 4.66659C7.81176 4.66659 7.65354 4.73059 7.52598 4.85859C7.39843 4.98659 7.33443 5.14481 7.33398 5.33325C7.33354 5.5217 7.39754 5.68014 7.52598 5.80859C7.65443 5.93703 7.81265 6.00081 8.00065 5.99992ZM8.00065 14.6666C7.07843 14.6666 6.21176 14.4915 5.40065 14.1413C4.58954 13.791 3.88399 13.3161 3.28399 12.7166C2.68399 12.117 2.2091 11.4115 1.85932 10.5999C1.50954 9.78836 1.33443 8.9217 1.33399 7.99992C1.33354 7.07814 1.50865 6.21147 1.85932 5.39992C2.20999 4.58836 2.68487 3.88281 3.28399 3.28325C3.8831 2.6837 4.58865 2.20881 5.40065 1.85859C6.21265 1.50836 7.07932 1.33325 8.00065 1.33325C8.92198 1.33325 9.78865 1.50836 10.6007 1.85859C11.4127 2.20881 12.1182 2.6837 12.7173 3.28325C13.3164 3.88281 13.7915 4.58836 14.1427 5.39992C14.4938 6.21147 14.6687 7.07814 14.6673 7.99992C14.666 8.9217 14.4909 9.78836 14.142 10.5999C13.7931 11.4115 13.3182 12.117 12.7173 12.7166C12.1164 13.3161 11.4109 13.7913 10.6007 14.1419C9.79043 14.4926 8.92376 14.6675 8.00065 14.6666ZM8.00065 13.3333C9.48954 13.3333 10.7507 12.8166 11.784 11.7833C12.8173 10.7499 13.334 9.48881 13.334 7.99992C13.334 6.51103 12.8173 5.24992 11.784 4.21659C10.7507 3.18325 9.48954 2.66659 8.00065 2.66659C6.51176 2.66659 5.25065 3.18325 4.21732 4.21659C3.18399 5.24992 2.66732 6.51103 2.66732 7.99992C2.66732 9.48881 3.18399 10.7499 4.21732 11.7833C5.25065 12.8166 6.51176 13.3333 8.00065 13.3333Z"
                                    fill="#D4C3C3" fill-opacity="0.7"/>
                            </svg>
                        </div>
                        <div className={"flex gap-1 items-center text-[#d4c3c3b3]"}>
                            source
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                 fill="none">
                                <path
                                    d="M7.33398 11.3333H8.66732V7.33325H7.33398V11.3333ZM8.00065 5.99992C8.18954 5.99992 8.34798 5.93592 8.47598 5.80792C8.60398 5.67992 8.66776 5.5217 8.66732 5.33325C8.66687 5.14481 8.60287 4.98659 8.47532 4.85859C8.34776 4.73059 8.18954 4.66659 8.00065 4.66659C7.81176 4.66659 7.65354 4.73059 7.52598 4.85859C7.39843 4.98659 7.33443 5.14481 7.33398 5.33325C7.33354 5.5217 7.39754 5.68014 7.52598 5.80859C7.65443 5.93703 7.81265 6.00081 8.00065 5.99992ZM8.00065 14.6666C7.07843 14.6666 6.21176 14.4915 5.40065 14.1413C4.58954 13.791 3.88399 13.3161 3.28399 12.7166C2.68399 12.117 2.2091 11.4115 1.85932 10.5999C1.50954 9.78836 1.33443 8.9217 1.33399 7.99992C1.33354 7.07814 1.50865 6.21147 1.85932 5.39992C2.20999 4.58836 2.68487 3.88281 3.28399 3.28325C3.8831 2.6837 4.58865 2.20881 5.40065 1.85859C6.21265 1.50836 7.07932 1.33325 8.00065 1.33325C8.92198 1.33325 9.78865 1.50836 10.6007 1.85859C11.4127 2.20881 12.1182 2.6837 12.7173 3.28325C13.3164 3.88281 13.7915 4.58836 14.1427 5.39992C14.4938 6.21147 14.6687 7.07814 14.6673 7.99992C14.666 8.9217 14.4909 9.78836 14.142 10.5999C13.7931 11.4115 13.3182 12.117 12.7173 12.7166C12.1164 13.3161 11.4109 13.7913 10.6007 14.1419C9.79043 14.4926 8.92376 14.6675 8.00065 14.6666ZM8.00065 13.3333C9.48954 13.3333 10.7507 12.8166 11.784 11.7833C12.8173 10.7499 13.334 9.48881 13.334 7.99992C13.334 6.51103 12.8173 5.24992 11.784 4.21659C10.7507 3.18325 9.48954 2.66659 8.00065 2.66659C6.51176 2.66659 5.25065 3.18325 4.21732 4.21659C3.18399 5.24992 2.66732 6.51103 2.66732 7.99992C2.66732 9.48881 3.18399 10.7499 4.21732 11.7833C5.25065 12.8166 6.51176 13.3333 8.00065 13.3333Z"
                                    fill="#D4C3C3" fill-opacity="0.7"/>
                            </svg>
                        </div>
                        <div className={"flex gap-1 items-center text-[#d4c3c3b3]"}>
                            source
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                 fill="none">
                                <path
                                    d="M7.33398 11.3333H8.66732V7.33325H7.33398V11.3333ZM8.00065 5.99992C8.18954 5.99992 8.34798 5.93592 8.47598 5.80792C8.60398 5.67992 8.66776 5.5217 8.66732 5.33325C8.66687 5.14481 8.60287 4.98659 8.47532 4.85859C8.34776 4.73059 8.18954 4.66659 8.00065 4.66659C7.81176 4.66659 7.65354 4.73059 7.52598 4.85859C7.39843 4.98659 7.33443 5.14481 7.33398 5.33325C7.33354 5.5217 7.39754 5.68014 7.52598 5.80859C7.65443 5.93703 7.81265 6.00081 8.00065 5.99992ZM8.00065 14.6666C7.07843 14.6666 6.21176 14.4915 5.40065 14.1413C4.58954 13.791 3.88399 13.3161 3.28399 12.7166C2.68399 12.117 2.2091 11.4115 1.85932 10.5999C1.50954 9.78836 1.33443 8.9217 1.33399 7.99992C1.33354 7.07814 1.50865 6.21147 1.85932 5.39992C2.20999 4.58836 2.68487 3.88281 3.28399 3.28325C3.8831 2.6837 4.58865 2.20881 5.40065 1.85859C6.21265 1.50836 7.07932 1.33325 8.00065 1.33325C8.92198 1.33325 9.78865 1.50836 10.6007 1.85859C11.4127 2.20881 12.1182 2.6837 12.7173 3.28325C13.3164 3.88281 13.7915 4.58836 14.1427 5.39992C14.4938 6.21147 14.6687 7.07814 14.6673 7.99992C14.666 8.9217 14.4909 9.78836 14.142 10.5999C13.7931 11.4115 13.3182 12.117 12.7173 12.7166C12.1164 13.3161 11.4109 13.7913 10.6007 14.1419C9.79043 14.4926 8.92376 14.6675 8.00065 14.6666ZM8.00065 13.3333C9.48954 13.3333 10.7507 12.8166 11.784 11.7833C12.8173 10.7499 13.334 9.48881 13.334 7.99992C13.334 6.51103 12.8173 5.24992 11.784 4.21659C10.7507 3.18325 9.48954 2.66659 8.00065 2.66659C6.51176 2.66659 5.25065 3.18325 4.21732 4.21659C3.18399 5.24992 2.66732 6.51103 2.66732 7.99992C2.66732 9.48881 3.18399 10.7499 4.21732 11.7833C5.25065 12.8166 6.51176 13.3333 8.00065 13.3333Z"
                                    fill="#D4C3C3" fill-opacity="0.7"/>
                            </svg>
                        </div>
                        <div className={"flex gap-1 items-center text-[#d4c3c3b3]"}>
                            transaction hash

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                 fill="none">
                                <path
                                    d="M7.33398 11.3333H8.66732V7.33325H7.33398V11.3333ZM8.00065 5.99992C8.18954 5.99992 8.34798 5.93592 8.47598 5.80792C8.60398 5.67992 8.66776 5.5217 8.66732 5.33325C8.66687 5.14481 8.60287 4.98659 8.47532 4.85859C8.34776 4.73059 8.18954 4.66659 8.00065 4.66659C7.81176 4.66659 7.65354 4.73059 7.52598 4.85859C7.39843 4.98659 7.33443 5.14481 7.33398 5.33325C7.33354 5.5217 7.39754 5.68014 7.52598 5.80859C7.65443 5.93703 7.81265 6.00081 8.00065 5.99992ZM8.00065 14.6666C7.07843 14.6666 6.21176 14.4915 5.40065 14.1413C4.58954 13.791 3.88399 13.3161 3.28399 12.7166C2.68399 12.117 2.2091 11.4115 1.85932 10.5999C1.50954 9.78836 1.33443 8.9217 1.33399 7.99992C1.33354 7.07814 1.50865 6.21147 1.85932 5.39992C2.20999 4.58836 2.68487 3.88281 3.28399 3.28325C3.8831 2.6837 4.58865 2.20881 5.40065 1.85859C6.21265 1.50836 7.07932 1.33325 8.00065 1.33325C8.92198 1.33325 9.78865 1.50836 10.6007 1.85859C11.4127 2.20881 12.1182 2.6837 12.7173 3.28325C13.3164 3.88281 13.7915 4.58836 14.1427 5.39992C14.4938 6.21147 14.6687 7.07814 14.6673 7.99992C14.666 8.9217 14.4909 9.78836 14.142 10.5999C13.7931 11.4115 13.3182 12.117 12.7173 12.7166C12.1164 13.3161 11.4109 13.7913 10.6007 14.1419C9.79043 14.4926 8.92376 14.6675 8.00065 14.6666ZM8.00065 13.3333C9.48954 13.3333 10.7507 12.8166 11.784 11.7833C12.8173 10.7499 13.334 9.48881 13.334 7.99992C13.334 6.51103 12.8173 5.24992 11.784 4.21659C10.7507 3.18325 9.48954 2.66659 8.00065 2.66659C6.51176 2.66659 5.25065 3.18325 4.21732 4.21659C3.18399 5.24992 2.66732 6.51103 2.66732 7.99992C2.66732 9.48881 3.18399 10.7499 4.21732 11.7833C5.25065 12.8166 6.51176 13.3333 8.00065 13.3333Z"
                                    fill="#D4C3C3" fill-opacity="0.7"/>
                            </svg>
                        </div>
                    </div>


                    {[1, 1].map(() => {
                        return <div className={"grid px-[24px] py-2 grid-cols-[200px_150px_200px_200px]"}>
                    <span
                        className="flex justify-start items-start text-[14px] font-semibold leading-[16.8px] text-[#fff] text-left whitespace-nowrap">
                            Oct 12, 2025, 7:20 PM
                          </span>
                            <span
                                className="flex justify-start items-start text-[14px] font-semibold leading-[16.8px] text-[#d4c3c3] text-left">
                            Minted
                          </span>
                            <span
                                className="flex justify-start items-start text-[14px] font-semibold leading-[16.8px] text-[#d4c3c3] text-left">
                            1
                          </span>
                            <span
                                className="flex justify-start items-start text-[14px] font-semibold leading-[16.8px] text-[#d4c3c3] text-left underline">
                            #TXN123
                          </span>
                        </div>
                    })}

                </div>
            </div>
        </div>
    }

    return <div className={"flex flex-col gap-2 pt-4"}>
        <div className="flex flex-col items-start overflow-x-scroll no-scrollbar">
            <div className="relative flex justify-between items-center w-full py-2 px-6 border-solid border border-[rgba(255,255,255,0.2)]">
                <div className={"flex gap-5 justify-between grow"}>
                    <div className={"flex items-center"}>
                        <div className="w-[7px] h-full bg-[#6e6e7a] absolute top-0 left-[-1px]"/>
                        <div className="flex gap-[8px] items-center pr-12">
                            <div className="flex flex-col gap-[8px] justify-center relative">
                                <span
                                    className="text-[16px] font-semibold leading-[24px] text-[#fff] relative text-left">
                                  Common Silver
                                </span>
                                <div className="flex gap-[8px] items-start">
                                    <div
                                        className="flex p-2 gap-[6px] justify-center items-center bg-[#121214] rounded-[51px] border-solid border border-[rgba(255,255,255,0.2)]">
                                        <span
                                            className="text-[12px] font-normal leading-[14px] text-[#fff] relative text-left uppercase whitespace-nowrap">
                                          2 nft’S
                                        </span>
                                    </div>
                                    <div
                                        className="flex p-2 gap-[6px] justify-center items-center shrink-0 flex-nowrap bg-[#121214] rounded-[51px] border-solid border border-[rgba(255,255,255,0.2)]">
                                        <span
                                            className="text-[12px] font-normal leading-[14px] text-[#16a149] relative text-left uppercase whitespace-nowrap">
                                          30% APY
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-[4px]">
                              <span
                                  className="self-stretch text-[14px] font-semibold leading-[16.8px] text-[#626fff] text-left">
                                Revealed
                              </span>
                            <span
                                className="self-stretch whitespace-nowrap text-[12px] font-medium leading-[15px] text-[#d4c3c3] text-left">
                            Oct 12, 2025, 7:20 PM
                          </span>
                        </div>
                    </div>
                    <div className={"flex items-center"}>
                        <div className="flex gap-8 md:gap-[73px] items-center">
                            <div className="flex flex-col gap-[10px] items-start">
                    <span
                        className="text-[12px] font-normal leading-[14px] text-[rgba(212,195,195,0.7)] relative text-left uppercase whitespace-nowrap z-[15]">
                      total value
                    </span>
                                <span
                                    className="text-[14px] font-semibold leading-[18px] text-[#fff] relative text-left whitespace-nowrap z-[16]">
                          +$200.00
                        </span>
                            </div>
                            <div className="flex flex-col gap-[10px] items-start shrink-0 flex-nowrap relative z-[17]">
                        <span
                            className="text-[12px] font-normal leading-[14px] text-[rgba(212,195,195,0.7)] relative text-left uppercase whitespace-nowrap z-[18]">
                          total gain
                        </span>
                                <span
                                    className="text-[14px] font-semibold leading-[18px] text-[#16a149] relative text-left whitespace-nowrap z-[19]">
                          +$130.00
                        </span>
                            </div>
                            <div className="flex flex-col gap-[10px] items-start shrink-0 flex-nowrap relative z-20">
                        <span
                            className="text-[12px] font-normal leading-[14px] text-[rgba(212,195,195,0.7)] relative text-left uppercase whitespace-nowrap z-[21]">
                          avg. roi
                        </span>
                                <span
                                    className="text-[14px] font-semibold leading-[18px] text-[#16a149] relative text-left whitespace-nowrap z-[22]">
                          +10.00%
                        </span>
                            </div>
                        </div>
                    </div>
                </div>

                <button className={"cursor-pointer bg-[#2D2D2F] h-fit w-fit ml-2 md:ml-[75px]"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                         fill="none">
                        <rect width="24" height="24" transform="translate(24 1.04907e-06) rotate(90)"
                              fill="#2D2D2F"/>
                        <path
                            d="M11.9951 10.1544L6.56881 15.5806C6.38425 15.7652 6.16892 15.8545 5.92283 15.8486C5.67674 15.8427 5.46142 15.7472 5.27685 15.5621C5.09228 15.3771 5 15.1618 5 14.9162C5 14.6706 5.09228 14.4552 5.27685 14.2702L10.943 8.58554C11.0907 8.43788 11.2568 8.32715 11.4414 8.25332C11.6259 8.17949 11.8105 8.14258 11.9951 8.14258C12.1796 8.14258 12.3642 8.17949 12.5488 8.25332C12.7333 8.32715 12.8994 8.43789 13.0471 8.58554L18.7317 14.2702C18.9163 14.4547 19.0056 14.6733 18.9997 14.9258C18.9938 15.1782 18.8983 15.3965 18.7133 15.5806C18.5282 15.7647 18.3129 15.857 18.0673 15.8575C17.8217 15.8579 17.6064 15.7657 17.4213 15.5806L11.9951 10.1544Z"
                            fill="#D4C3C3"/>
                    </svg>
                </button>
            </div>

            <div className="bg-[#1e1e1e] pb-2 w-full">
                <div
                    className="border-solid border-t border-t-[rgba(255,255,255,0.2)]">
                    <div
                        className="flex justify-between items-center flex-nowrap px-6 py-2">

                        <div className="flex gap-[4px] items-center flex-nowrap">
                          <span
                              className="text-[12px] font-normal leading-[14px] text-[rgba(212,195,195,0.7)] relative text-left uppercase">
                            nft
                          </span>
                        </div>


                        <div className="flex gap-[4px] items-center shrink-0 flex-nowrap relative z-30">
                            <span
                                className="text-[12px] font-normal leading-[14px] text-[rgba(212,195,195,0.7)] relative text-left uppercase">
                              gain/loss
                            </span>
                        </div>
                        <div className="flex gap-[4px] items-center shrink-0 flex-nowrap relative z-[33]">
                            <span
                                className="text-[12px] font-normal leading-[14px] text-[rgba(212,195,195,0.7)] relative text-left uppercase">
                              current
                            </span>
                        </div>
                        <div className="flex gap-[4px] items-center shrink-0 flex-nowrap relative z-[36]">
                            <span
                                className="text-[12px] font-normal leading-[14px] text-[rgba(212,195,195,0.7)] relative text-left uppercase">
                              target
                            </span>
                        </div>
                        <div className="flex gap-[4px] items-center shrink-0 flex-nowrap relative z-[39]">
                            <span
                                className="shrink-0 basis-auto  text-[12px] font-normal leading-[14px] text-[rgba(212,195,195,0.7)] relative text-left uppercase whitespace">
                              progress
                            </span>
                        </div>
                        <div className="flex w-[111px] gap-[4px] items-center shrink-0 flex-nowrap relative z-[42]">
                            <span
                                className="h-[14px] shrink-0 basis-auto  text-[12px] font-normal leading-[14px] text-[rgba(212,195,195,0.7)] relative text-left uppercase">
                              next maturity
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex pt-[12px] px-[24px]">
                    <div className="flex gap-[8px] items-center flex-nowrap">
                        <div className="flex flex-col gap-[8px] justify-center items-start">
                        <span className="text-[14px] font-semibold leading-[16.8px] text-[#fff] relative text-left">
                          Common Silver #1
                        </span>
                            <span className="self-stretch shrink-0 basis-auto  text-[12px] font-medium leading-[15px] text-[rgba(212,195,195,0.7)] relative text-left">
                              Minted
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[4px] items-center flex-nowrap">
                          <span
                              className="self-stretch shrink-0 basis-auto  text-[14px] font-semibold leading-[18px] text-[#16a149] relative text-left whitespace-nowrap z-[46]">
                            +$20.00
                          </span>
                        <span
                            className="self-stretch shrink-0 basis-auto  text-[12px] font-medium leading-[15px] text-[#16a149] relative text-left whitespace-nowrap z-[47]">
                            +2.50%
                          </span>
                    </div>
                    <div className="flex flex-col gap-[4px] items-start flex-nowrap">
                          <span
                              className="self-stretch shrink-0 basis-auto  text-[14px] font-semibold leading-[18px] text-[#fff] relative text-left whitespace-nowrap z-[68]">
                            50%
                          </span>
                        <div className="self-stretch shrink-0 bg-[#121214] relative overflow-hidden z-[69]">
                            <div
                                className="bg-[#fe3d5b] relative overflow-hidden z-[70] mt-0 mr-0 mb-0 ml-0"/>
                        </div>
                    </div>
                    <span className="flex justify-start items-start  text-[14px] font-semibold leading-[18px] text-[#fff] text-left">
                          +$100.00
                    </span>
                    <span className="flex justify-start items-start  text-[14px] font-semibold leading-[18px] text-[#fff] text-left">
                          +$130.00
                        </span>
                    <span className="flex justify-start items-start  text-[14px] font-semibold leading-[18px] text-[#fff] text-left">
                          140 days
                    </span>
                </div>
            </div>
        </div>
    </div>
}

const NFTPortfolioDashboard: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [nftCollections, setNFTCollections] = useState<NFTCollection[]>([]);
    const [activeTab, setActiveTab] = useState('MY NFT\'S');
    const [loading, setLoading] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');

    const handleEditClick = () => {
        if (userProfile) {
            setTempName(userProfile.name);
            setIsEditingName(true);
        }
    };

    const handleSaveName = async () => {
        if (!tempName.trim() || !userProfile) return;

        try {
            // Call API to update name
            await apiHandler.updateUserName(userProfile.userId, tempName.trim());

            // Update user profile in state
            setUserProfile({
                ...userProfile,
                name: tempName.trim()
            });

            setIsEditingName(false);
            setTempName('');
        } catch (error) {
            console.error('Error updating name:', error);
            // Optionally show error to user
        }
    };

    const handleCancelEdit = () => {
        setIsEditingName(false);
        setTempName('');
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const {userProfile, nftCollections} = await fetchCompleteProfileData();
                setUserProfile(userProfile);
                setNFTCollections(nftCollections);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center">
                <div className="text-white text-xl">Error loading profile</div>
            </div>
        );
    }

    return <HeaderFooter isFixedHeader={true} isFixedFooter={true}>
        <div className="w-full mx-auto flex flex-col items-center text-[#D4C3C3] px-4 md:px-0" style={{
            minHeight: "100vh",
            paddingBottom: "4rem",
            background: `url(${first_bg}) no-repeat`,
            backgroundSize: "cover",
            top: "0px",
            backgroundPosition: "center",
            backgroundPositionY: "top"
        }}>
            {/* User Profile Section */}
            <div className="w-full flex justify-center">
                <div className="text-left w-full max-w-7xl mt-20 md:mt-40">
                    <h1 className="text-3xl font-bold mb-8">User Profile</h1>

                    <div className="flex flex-col items-center mb-8">
                        <img
                            src={userProfile.avatar}
                            alt={userProfile.name}
                            className="w-20 h-20 rounded-full mb-4 border-[1px] border-gray-600"
                        />
                        {isEditingName ? (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    style={{
                                        border: "1px solid #4D4D53"
                                    }}
                                    className="text-[15px] font-[600] bg-transparent border-b-2 text-[#EFEFEF] focus:outline-none p-[4px]"
                                    autoFocus
                                />
                                <button onClick={handleSaveName}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24"
                                         fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M4 12C4 9.61305 4.94821 7.32387 6.63604 5.63604C8.32387 3.94821 10.6131 3 13 3C15.3869 3 17.6761 3.94821 19.364 5.63604C21.0518 7.32387 22 9.61305 22 12C22 14.3869 21.0518 16.6761 19.364 18.364C17.6761 20.0518 15.3869 21 13 21C10.6131 21 8.32387 20.0518 6.63604 18.364C4.94821 16.6761 4 14.3869 4 12ZM12.4864 15.852L17.668 9.3744L16.732 8.6256L12.3136 14.1468L9.184 11.5392L8.416 12.4608L12.4864 15.852Z"
                                              fill="#16A149"/>
                                    </svg>
                                </button>
                                <button onClick={handleCancelEdit}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24"
                                         fill="none">
                                        <path
                                            d="M13 3C7.98571 3 4 6.98571 4 12C4 17.0143 7.98571 21 13 21C18.0143 21 22 17.0143 22 12C22 6.98571 18.0143 3 13 3ZM16.4714 16.5L13 13.0286L9.52857 16.5L8.5 15.4714L11.9714 12L8.5 8.52857L9.52857 7.5L13 10.9714L16.4714 7.5L17.5 8.52857L14.0286 12L17.5 15.4714L16.4714 16.5Z"
                                            fill="#F1476A"/>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <h2 className="text-2xl font-bold flex items-center space-x-2">
                                <span className={"text-[24px]"}>{userProfile.name}</span>
                                <button onClick={handleEditClick}
                                        className="text-[#D4C3C3] hover:text-white cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20"
                                         fill="none">
                                        <path
                                            d="M6.53583 14.9975H3V11.4617L12.5292 1.93253C12.6854 1.7763 12.8974 1.68854 13.1183 1.68854C13.3393 1.68854 13.5512 1.7763 13.7075 1.93253L16.065 4.28919C16.1425 4.36659 16.2039 4.45849 16.2459 4.55966C16.2878 4.66082 16.3094 4.76926 16.3094 4.87878C16.3094 4.98829 16.2878 5.09673 16.2459 5.19789C16.2039 5.29906 16.1425 5.39096 16.065 5.46836L6.53583 14.9975ZM3 16.6642H18V18.3309H3V16.6642Z"
                                            fill="currentColor"/>
                                    </svg>
                                </button>
                            </h2>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="22"
                                 viewBox="0 0 31 28" fill="none">
                                <path
                                    d="M27.1862 6.59255V3.62959C27.1862 1.99551 25.8573 0.666626 24.2232 0.666626H4.96398C2.51361 0.666626 0.519531 2.6607 0.519531 5.11107V22.8888C0.519531 26.1496 3.17731 27.3333 4.96398 27.3333H27.1862C28.8203 27.3333 30.1492 26.0044 30.1492 24.3703V9.55551C30.1492 7.92144 28.8203 6.59255 27.1862 6.59255ZM24.2232 19.9259H21.2603V14H24.2232V19.9259ZM4.96398 6.59255C4.58252 6.57549 4.22235 6.41195 3.95846 6.13599C3.69456 5.86002 3.54728 5.4929 3.54728 5.11107C3.54728 4.72924 3.69456 4.36212 3.95846 4.08616C4.22235 3.81019 4.58252 3.64665 4.96398 3.62959H24.2232V6.59255H4.96398Z"
                                    fill="#D4C3C3"/>
                            </svg>
                            <span className={"text-white text-[16px] font-bold"}>{userProfile.userId}</span>
                            <CopyIcon textToCopy={userProfile.userId}/>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8" style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.20)"
                    }}>
                        <div className="rounded-xl p-4 flex items-start gap-3.5" style={{
                            backgroundImage: `rgba(22, 22, 22, 0.10)`,
                            border: "1px solid #4D4D53",
                        }}>

                            <div className={"h-[48px] py-1"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="100%" viewBox="0 0 38 44"
                                     fill="none">
                                    <path
                                        d="M13 22C14.0609 22 15.0783 21.5786 15.8284 20.8284C16.5786 20.0783 17 19.0609 17 18C17 16.9391 16.5786 15.9217 15.8284 15.1716C15.0783 14.4214 14.0609 14 13 14C11.9391 14 10.9217 14.4214 10.1716 15.1716C9.42143 15.9217 9 16.9391 9 18C9 19.0609 9.42143 20.0783 10.1716 20.8284C10.9217 21.5786 11.9391 22 13 22ZM19 0L38 11V33L19 44L0 33V11L19 0ZM4 13.306V30.694L8.744 33.44L24.89 21.6L34 27.068V13.308L19 4.62L4 13.306Z"
                                        fill="#D4C3C3"/>
                                </svg>
                            </div>

                            <div className={"flex flex-col gap-1.5"}>
                                <span className="text-sm">Total NFT’s</span>
                                <div className="text-white text-2xl font-bold">2</div>
                                <div className="text-gray-400 text-xs">2 revealed, 5 unrevealed</div>
                            </div>
                        </div>

                        <div className="rounded-xl p-4 flex items-start gap-3.5" style={{
                            backgroundImage: `rgba(22, 22, 22, 0.10)`,
                            border: "1px solid #4D4D53",
                        }}>
                            <div className={"h-[48px] py-1"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="100%" viewBox="0 0 31 35"
                                     fill="none">
                                    <path
                                        d="M8.59055 19.8575V31.5254C8.59055 32.2232 8.32013 32.8923 7.83879 33.3857C7.35745 33.8791 6.70461 34.1562 6.02388 34.1562H3.00722C2.66876 34.1585 2.3332 34.0921 2.01988 33.9609C1.70655 33.8297 1.42163 33.6363 1.18152 33.3918C0.94142 33.1472 0.750869 32.8565 0.620841 32.5362C0.490813 32.2158 0.423875 31.8723 0.423883 31.5254V19.8575C0.421668 19.5091 0.486977 19.1638 0.616017 18.8415C0.745057 18.5192 0.93526 18.2264 1.17559 17.9801C1.41591 17.7337 1.70158 17.5388 2.016 17.4065C2.33043 17.2743 2.66735 17.2073 3.00722 17.2096H6.02388C6.36235 17.2096 6.69748 17.2782 7.00997 17.4115C7.32246 17.5447 7.60615 17.7401 7.84471 17.9862C8.08326 18.2323 8.27198 18.5243 8.39998 18.8455C8.52798 19.1666 8.59275 19.5106 8.59055 19.8575ZM19.7572 3.49167V31.5254C19.7572 31.8723 19.6903 32.2158 19.5603 32.5362C19.4302 32.8565 19.2397 33.1472 18.9996 33.3918C18.7595 33.6363 18.4746 33.8297 18.1612 33.9609C17.8479 34.0921 17.5123 34.1585 17.1739 34.1562H14.1572C13.475 34.1563 12.8204 33.8796 12.3364 33.3867C11.8524 32.8939 11.5783 32.2247 11.5739 31.5254V3.49167C11.5783 2.79078 11.8518 2.11987 12.3354 1.62426C12.8189 1.12864 13.4734 0.848229 14.1572 0.84375H17.1739C17.859 0.84375 18.5161 1.12273 19.0006 1.61931C19.485 2.11589 19.7572 2.7894 19.7572 3.49167ZM30.9072 12.3408V31.5254C30.9072 32.2232 30.6368 32.8923 30.1555 33.3857C29.6741 33.8791 29.0213 34.1562 28.3405 34.1562H25.3239C24.9854 34.1585 24.6499 34.0921 24.3365 33.9609C24.0232 33.8297 23.7383 33.6363 23.4982 33.3918C23.2581 33.1472 23.0675 32.8565 22.9375 32.5362C22.8075 32.2158 22.7405 31.8723 22.7406 31.5254V12.3408C22.7406 11.9931 22.8074 11.6488 22.9372 11.3275C23.067 11.0063 23.2573 10.7144 23.4972 10.4685C23.7371 10.2226 24.0219 10.0275 24.3353 9.89448C24.6487 9.76141 24.9846 9.69292 25.3239 9.69292H28.4072C29.0778 9.7151 29.7137 10.0038 30.1803 10.498C30.6469 10.9922 30.9076 11.6531 30.9072 12.3408Z"
                                        fill="#D4C3C3"/>
                                </svg>
                            </div>
                            <div className={"flex flex-col gap-1.5"}>
                                <span className="text-sm">Current Value</span>
                                <div className="text-[#D4C3C3] text-[24px] font-bold leading-7">$4,680</div>
                            </div>
                        </div>

                        <div className="rounded-xl p-4 flex items-start gap-3.5" style={{
                            backgroundImage: `rgba(22, 22, 22, 0.10)`,
                            border: "1px solid #4D4D53",
                        }}>

                            <div className={"h-[48px] py-1"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="41" height="100%" viewBox="0 0 41 40"
                                     fill="none">
                                    <path
                                        d="M3.19141 20C3.19141 10.5321 10.8664 2.85712 20.3343 2.85712C29.8021 2.85712 37.4771 10.5321 37.4771 20C37.4771 29.4678 29.8021 37.1428 20.3343 37.1428C10.8664 37.1428 3.19141 29.4678 3.19141 20ZM20.7435 21.2457C22.8678 21.7685 23.5043 22.4614 23.5043 23.6314C23.5043 24.8471 22.6864 25.7671 20.7435 25.915V21.2457ZM19.46 18.6221C17.6428 18.1671 16.9607 17.4064 16.9607 16.3721C16.9607 15.3378 17.8243 14.3957 19.4607 14.1914L19.46 18.6221ZM20.7435 18.9285V14.1914C22.1978 14.3728 23.22 15.2021 23.3678 16.6343H25.7307C25.64 14.0557 23.5835 12.3514 20.7435 12.1235V10.2043H19.46V12.1235C16.5971 12.34 14.5528 14.0207 14.5528 16.5657C14.5528 18.8714 16.1093 20.1671 18.9943 20.8371L19.46 20.9507V25.9035C17.6314 25.7107 16.7678 24.7335 16.5635 23.4043H14.2121C14.2907 26.1307 16.575 27.755 19.46 27.9714V29.8793H20.7435V27.9714C23.6407 27.7664 25.9128 26.1878 25.9128 23.4043C25.9128 20.985 24.2771 19.7578 21.2893 19.065L20.7435 18.9285Z"
                                        fill="#D4C3C3"/>
                                </svg>
                            </div>

                            <div>
                                <span className="text-sm">Total Gains</span>
                                <div
                                    className={`${userProfile.averageROI === 0 ? 'text-[#FAFAFA]' : 'text-[#16A149]'} text-2xl font-bold`}>{userProfile.averageROI}%
                                </div>
                                <div className="text-[#D4C3C3] text-xs">% Gain/Loss:</div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="overflow-x-auto mt-6" style={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.20)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.20)",
                        background: "rgba(0, 0, 0, 0.10)",
                        backdropFilter: "blur(20px)"
                    }}>
                        <div className="flex gap-2 py-3 min-w-max">
                            {['MY NFT\'S', 'RECENT ACTIVITY'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-3 px-4 md:py-4 md:px-10 transition-colors azeret-mono text-[11px] md:text-[12px] font-[500] whitespace-nowrap`}
                                    style={{
                                        color: activeTab === tab ? "#FFFFFF" : "#EFEFEF",
                                        border: activeTab === tab ? "1px solid rgba(255, 255, 255, 0.20)" : "none",
                                        background: activeTab === tab ? "#3E3E3E" : "none",
                                        opacity: activeTab === tab ? "1" : "0.6",
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl">
                {/* NFT Info */}
                <p className="text-sm md:text-base py-[16px]">You can sell these NFTs in any NFT marketplace of your
                    choice.</p>

                <div className={"flex gap-2 items-center"}>
                    <span className={"uppercase text-[12px] font-normal leading-[14px] text-[#D4C3C3]"}>
                        project:
                    </span>

                    <div
                        className={"flex items-center w-fit gap-1.5 py-1 px-3.5 border-[1px] border-[#ffffff99] bg-[#393939] rounded-[8px]"}>
                        <img className={"w-[32px] h-[32px] rounded-[38px]"}
                             src={"https://unlu-general.s3.ap-south-1.amazonaws.com/contest/Swari+Agra+Poster.jpg"}
                             alt={""}/>
                        Swari agra
                    </div>
                </div>

                <ActiveTabCom tab={activeTab}/>

                {/*<div className="w-fit">*/}
                {/*    <div className="h-[100px] bg-blue-400 w-full"></div>*/}
                {/*    <div className="h-[100px] bg-red-700 inline-flex">*/}
                {/*        <div className="w-[200vw] bg-red-700/80"></div>*/}
                {/*        <div className="w-[200vw] bg-red-700/80"></div>*/}
                {/*        <div className="w-[200vw] bg-red-700/80"></div>*/}
                {/*        <div className="w-[200vw] bg-red-700/80"></div>*/}
                {/*    </div>*/}
                {/*</div>*/}

            </div>
        </div>
    </HeaderFooter>
};

export default NFTPortfolioDashboard;