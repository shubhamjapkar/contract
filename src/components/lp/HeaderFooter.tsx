import React, {useRef, useState, useEffect} from "react";
import LogoIcon from "../../public/LogoIcon.tsx";
import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useNavigate} from "react-router-dom";
import {apiHandler} from "../../services/apiHandler.ts";


function CustomConnect() {
    const [lastConnectedState, setLastConnectedState] = useState<{connected: boolean, account: any, chain: any} | any>(null);
    const [processedAccounts, setProcessedAccounts] = useState<Set<string>>(new Set());

    // Function to check user and create if needed
    const handleUserCheck = async (account: any, chain: any) => {
        if (!account?.address) return;

        const walletId = account.address;

        // Avoid processing the same account multiple times
        if (processedAccounts.has(walletId)) return;
        setProcessedAccounts(prev => new Set(prev).add(walletId));

        // console.log('🔍 Checking if user exists in database...');
        // console.log('Wallet ID:', walletId);

        try {
            const userExists = await apiHandler.checkUserExists(walletId);

            if (userExists) {
                console.log('✅ User exists in database');
            } else {
                // console.log('❌ User not found in database, creating new user...');

                // Extract balance information
                const balanceSymbol = chain?.name === 'Ethereum' ? 'ETH' : 'TOKEN';
                const displayBalance = account.balance || '0';

                // console.log('📝 Creating user with data:');
                // console.log('- Wallet ID:', walletId);
                // console.log('- Balance Symbol:', balanceSymbol);
                // console.log('- Display Balance:', displayBalance);

                // const userCreated = await apiHandler.createUser(walletId, balanceSymbol, displayBalance);

                // if (userCreated) {
                //     console.log('🎉 New user created successfully!');
                // } else {
                //     console.error('💥 Failed to create user');
                // }
            }
        } catch (error) {
            console.error('❌ Error during user check/creation:', error);
        }
    };

    return (
        <ConnectButton.Custom>
            {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                // Log wallet connection data when state changes
                const currentState = { connected, account, chain };
                if (JSON.stringify(currentState) !== JSON.stringify(lastConnectedState)) {
                    setLastConnectedState(currentState);

                    if (connected) {
                        console.log('🔗 WALLET CONNECTION DATA:');
                        console.log('==========================================');
                        console.log('Connected:', connected);
                        console.log('Ready:', ready);
                        console.log('Mounted:', mounted);

                        if (account) {
                            console.log('📱 ACCOUNT DATA:');
                            console.log('- Address:', account.address);
                            console.log('- Display Name:', account.displayName);
                            console.log('- ENS Name:', account.ensName);
                            console.log('- ENS Avatar:', account.ensAvatar);
                            console.log('- Has Pending Transactions:', account.hasPendingTransactions);
                            console.log('- Full Account Object:', account);
                        }

                        if (chain) {
                            console.log('⛓️ CHAIN DATA:');
                            console.log('- Chain ID:', chain.id);
                            console.log('- Chain Name:', chain.name);
                            console.log('- Has Icon:', chain.hasIcon);
                            console.log('- Icon URL:', chain.iconUrl);
                            console.log('- Icon Background:', chain.iconBackground);
                            console.log('- Unsupported:', chain.unsupported);
                            console.log('- Full Chain Object:', chain);
                        }

                        console.log('==========================================');

                        // Check user existence and create if needed
                        handleUserCheck(account, chain);
                    } else {
                        console.log('🔴 WALLET DISCONNECTED');
                        // Clear processed accounts when disconnected
                        setProcessedAccounts(new Set());
                    }
                }

                if (connected) {
                    return <button
                        onClick={openAccountModal}
                        className={"text-[12px] leading-[14px] font-medium uppercase py-[14px] px-[18px] text-[#EFEFEF] bg-transparent border border-[#4D4D53] cursor-pointer"}>
                        {account.displayName}
                    </button>
                }

                return <button onClick={openConnectModal} className={"text-[12px] leading-[14px] font-medium uppercase py-[14px] px-[18px] text-[#EFEFEF] bg-[#FE3D5B] whitespace-nowrap flex gap-1"}>
                    Connect
                    <span className={"hidden md:block"}>Wallet</span>
                </button>
            }}
        </ConnectButton.Custom>
    );
}


export default function HeaderFooter({children, isFixedHeader, isFixedFooter}: any) {
    const [dropDown, setDropDown] = useState(false);

    const inputRef = useRef<any>(null)
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <header
                style={{
                    background: "#0000001a",
                    backdropFilter: "blur(20px)"
                }}
                className={`${isFixedHeader ? "fixed" : ""} w-full border-b border-b-[#3E3F44] py-[16px] px-6 md:px-[80px] m-auto z-10`}>
                <div className={"flex justify-between max-w-[1800px] m-auto w-full"}>
                    <button onClick={() => {
                        navigate('/');
                    }} className={"flex items-center cursor-pointer"}>
                        <LogoIcon/>
                    </button>

                    <div className={"flex md:gap-[24px]"}>
                        {/*<div*/}
                        {/*    className={"hidden md:flex md:items-center gap-[6px] px-[16px] py-2 border border-[#4D4D53]"}>*/}
                        {/*    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"*/}
                        {/*         fill="none">*/}
                        {/*        <path*/}
                        {/*            d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z"*/}
                        {/*            fill="#D4C3C3"/>*/}
                        {/*    </svg>*/}
                        {/*    <input*/}
                        {/*        className="border-none ring-0 focus:outline-none focus:ring-0"*/}
                        {/*        placeholder="Search projects"*/}
                        {/*    />*/}
                        {/*</div>*/}

                        {/*<div onClick={() => {*/}
                        {/*    setDropDown(true)*/}
                        {/*    inputRef?.current?.focus()*/}
                        {/*}} className={"flex items-center md:hidden gap-[6px] px-[14px] py-2"}>*/}
                        {/*    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"*/}
                        {/*         fill="none">*/}
                        {/*        <path*/}
                        {/*            d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z"*/}
                        {/*            fill="#D4C3C3"/>*/}
                        {/*    </svg>*/}
                        {/*</div>*/}

                        <CustomConnect/>
                    </div>
                </div>

                <div
                    className={`flex gap-2 overflow-hidden  duration-500 ease-in-out ${dropDown ? "max-h-96 pt-1.5" : "max-h-0 pt-0"}`}>
                    <div className={`relative bg-black flex transform transition-all duration-500 ease-in-out ${
                        dropDown ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                    } block md:hidden w-full `}>
                        <input ref={inputRef}
                               placeholder="Search projects"
                               className="placeholder:text-[#ffffff9c] text-white text-sm w-full  border border-[#4D4D53] pl-1.5 pr-6 py-2 ring-0  focus:outline-none focus:ring-0 "/>

                        <button className={"absolute right-0 top-1/2  -translate-y-1/2 pr-2"} onClick={() => {
                            setDropDown(false)
                        }}>
                            <svg fill="white" width="16px" height="16px" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect x="0" fill="none" width="16" height="16"/>
                                <g>
                                    <path
                                        d="M18.36 19.78L12 13.41l-6.36 6.37-1.42-1.42L10.59 12 4.22 5.64l1.42-1.42L12 10.59l6.36-6.36 1.41 1.41L13.41 12l6.36 6.36z"/>
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>

            </header>

            {children}
        </React.Fragment>
    );
}
