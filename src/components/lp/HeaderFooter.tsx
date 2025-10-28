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

            <footer style={{
                background: "#0000001a",
                backdropFilter: "blur(20px)",
            }} className={`${isFixedFooter ? "lg:fixed" : ""} lg:bottom-0 w-svw lg:py-2 border-t border-[#fff3] z-10`}>
                <div
                    className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-between max-w-[1350px] m-auto w-full pt-4 pb-18 lg:pt-0 lg:pb-0  lg:py-0 items-center">
                    <div className="flex flex-col lg:flex-row justify-start items-center gap-4 w-full lg:w-fit">
                        <div className="text-[#ffffffb3] text-xs uppercase leading-none">
                            © 2025 Mugafi
                        </div>
                        <div className="flex justify-center items-center gap-6 lg:gap-2 w-full lg:w-fit">
                            <button onClick={() => {
                                    window.open("https://x.com/mugafi", "_blank")
                                }} data-svg-wrapper data-layer="Frame" className="Frame relative cursor-pointer">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M20 20L13.743 10.6749L13.7537 10.6836L19.3953 4H17.51L12.9142 9.44L9.26456 4H4.32014L10.1617 12.7062L10.161 12.7055L4 20H5.88528L10.9948 13.9476L15.0556 20H20ZM8.51756 5.45455L17.2966 18.5455H15.8026L7.01645 5.45455H8.51756Z"
                                        fill="white" fillOpacity="0.8"/>
                                </svg>
                            </button>

                            <button onClick={() => {
                                window.open("https://www.instagram.com/mugafi", "_blank");
                            }} className="Socials size-6 relative overflow-hidden">
                                <svg fill="#ffffff" width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M20.445 5h-8.891A6.559 6.559 0 0 0 5 11.554v8.891A6.559 6.559 0 0 0 11.554 27h8.891a6.56 6.56 0 0 0 6.554-6.555v-8.891A6.557 6.557 0 0 0 20.445 5zm4.342 15.445a4.343 4.343 0 0 1-4.342 4.342h-8.891a4.341 4.341 0 0 1-4.341-4.342v-8.891a4.34 4.34 0 0 1 4.341-4.341h8.891a4.342 4.342 0 0 1 4.341 4.341l.001 8.891z"/><path d="M16 10.312c-3.138 0-5.688 2.551-5.688 5.688s2.551 5.688 5.688 5.688 5.688-2.551 5.688-5.688-2.55-5.688-5.688-5.688zm0 9.163a3.475 3.475 0 1 1-.001-6.95 3.475 3.475 0 0 1 .001 6.95zM21.7 8.991a1.363 1.363 0 1 1-1.364 1.364c0-.752.51-1.364 1.364-1.364z"/></svg>
                            </button>

                            <button onClick={() => {
                                window.open("https://www.linkedin.com/company/mugafi/posts/?feedView=all", "_blank");
                            }} className="Socials size-6 relative overflow-hidden">
                                <div data-svg-wrapper data-layer="linkedin-in"
                                     className="LinkedinIn left-[4px] top-[4px] absolute">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M4.13766 14.0001H1.23516V4.65318H4.13766V14.0001ZM2.68484 3.37818C1.75672 3.37818 1.00391 2.60943 1.00391 1.6813C1.00391 1.23549 1.181 0.807938 1.49624 0.492701C1.81148 0.177464 2.23903 0.000366211 2.68484 0.000366211C3.13066 0.000366211 3.55821 0.177464 3.87345 0.492701C4.18868 0.807938 4.36578 1.23549 4.36578 1.6813C4.36578 2.60943 3.61266 3.37818 2.68484 3.37818ZM15.0008 14.0001H12.1045V9.45005C12.1045 8.36568 12.0827 6.97505 10.5955 6.97505C9.08641 6.97505 8.85516 8.15318 8.85516 9.37193V14.0001H5.95578V4.65318H8.73953V5.92818H8.78016C9.16766 5.1938 10.1142 4.4188 11.5264 4.4188C14.4639 4.4188 15.0039 6.35318 15.0039 8.86568V14.0001H15.0008Z"
                                            fill="white" fillOpacity="0.8"/>
                                    </svg>
                                </div>
                            </button>

                            <button onClick={() => {
                                window.open("https://www.facebook.com/mugafi.club", "_blank");
                            }} className="Socials relative">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M15.4738 13L15.8886 10.1044H13.2948V8.22531C13.2948 7.43313 13.6572 6.66094 14.8188 6.66094H15.998V4.19563C15.998 4.19563 14.928 4 13.9048 4C11.7687 4 10.3725 5.38688 10.3725 7.8975V10.1044H7.99805V13H10.3725V20H13.2948V13H15.4738Z"
                                        fill="white" fillOpacity="0.8"/>
                                </svg>
                            </button>
                        </div>

                    </div>

                    <div className={"flex gap-1 items-center"}>
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
                        <div
                            className="text-[#ffffffb3] text-xs uppercase leading-none justify-start font-normal">powerd
                            by redacted
                        </div>
                    </div>
                </div>
            </footer>
        </React.Fragment>
    );
}
