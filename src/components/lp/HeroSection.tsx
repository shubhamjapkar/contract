import first_bg from "../../assets/lp/first_bg.png";

export default function HeroSection() {
    return <div style={{
        background: `url(${first_bg}) no-repeat`,
        height: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "top"
    }}>
        <div className={"flex flex-col justify-center min-h-svh max-w-[1350px] m-auto px-4 md:px-0"}>
            <div className=" inline-flex flex-col justify-start items-center gap-6">
                <div className="max-w-[600px] flex flex-col justify-start items-center gap-4">
                    <div className="text-[#D4C3C3] self-stretch text-center justify-start text-high-emphasis text-[40px] md:text-6xl font-bold leading-[56px] md:leading-[61.60px]">
                        Back projects early.
                        Profit as they grow!
                    </div>
                    <div
                        className="text-[#d4c3c3e6] text-center justify-start text-medium-emphasis/90 text-[14px] md:text-[16px] font-normal leading-[18px] md:leading-relaxed">
                        Discover innovative projects, support creators, and earn <br/> rewards as your backed projects succeed in the market.
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 justify-center gap-y-10 gap-x-2 md:gap-0.5 pt-[46px] text-center">
                <div className="inline-flex flex-col justify-start items-center gap-3">
                    <div className="p-4 bg-accent rounded-[88px] shadow-[0 4px 7px 0 rgba(255, 255, 255, 0.25) inset, 0 -3px 7px 0 rgba(0, 0, 0, 0.25) inset] bg-[#fe3d5b] inline-flex justify-start items-center gap-2">
                        <div className="Frame relative">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 2.66669V29.3334M22.6667 6.66669H12.6667C11.429 6.66669 10.242 7.15835 9.36684 8.03352C8.49167 8.90869 8 10.0957 8 11.3334C8 12.571 8.49167 13.758 9.36684 14.6332C10.242 15.5084 11.429 16 12.6667 16H19.3333C20.571 16 21.758 16.4917 22.6332 17.3669C23.5083 18.242 24 19.429 24 20.6667C24 21.9044 23.5083 23.0913 22.6332 23.9665C21.758 24.8417 20.571 25.3334 19.3333 25.3334H8"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-center gap-3">
                        <div className="justify-start text-white text-[20px] font-bold leading-normal">
                            $2.6M
                        </div>
                        <div className="TotalFunded justify-start text-[#EFEFEF] text-xs font-normal uppercase leading-none">total
                            funded
                        </div>
                    </div>
                </div>
                <div className="inline-flex flex-col justify-start items-center gap-3">
                    <div className="size-16 p-4 bg-accent rounded-[88px] shadow-[0 4px 7px 0 rgba(255, 255, 255, 0.25) inset, 0 -3px 7px 0 rgba(0, 0, 0, 0.25) inset] bg-[#fe3d5b] inline-flex justify-start items-center gap-2">
                        <div className="Frame relative">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5.99998 22C3.99998 23.68 3.33331 28.6666 3.33331 28.6666C3.33331 28.6666 8.31998 28 9.99998 26C10.9466 24.88 10.9333 23.16 9.87998 22.12C9.36172 21.6253 8.67904 21.3395 7.96295 21.3174C7.24686 21.2952 6.54782 21.5383 5.99998 22ZM16 20L12 16C12.7095 14.1592 13.6029 12.3947 14.6666 10.7333C16.2202 8.2493 18.3835 6.20405 20.9506 4.79211C23.5178 3.38016 26.4035 2.64848 29.3333 2.66665C29.3333 6.29332 28.2933 12.6667 21.3333 17.3333C19.6489 18.3979 17.8623 19.2912 16 20Z"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path
                                    d="M12 16H5.33331C5.33331 16 6.06665 11.96 7.99998 10.6667C10.16 9.22667 14.6666 10.6667 14.6666 10.6667M16 20V26.6667C16 26.6667 20.04 25.9333 21.3333 24C22.7733 21.84 21.3333 17.3333 21.3333 17.3333"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-center gap-3">
                        <div className="text-[20px] justify-start text-white text-xl font-bold  leading-normal">
                            3
                        </div>
                        <div className="justify-start text-zinc-100 text-xs font-normal  uppercase leading-4">projects
                            launched
                        </div>
                    </div>
                </div>
                <div className="inline-flex flex-col justify-start items-center gap-3">
                    <div className="size-16 p-4 bg-accent rounded-[88px] shadow-[0 4px 7px 0 rgba(255, 255, 255, 0.25) inset, 0 -3px 7px 0 rgba(0, 0, 0, 0.25) inset] bg-[#fe3d5b] inline-flex justify-start items-center gap-2">
                        <div className="Frame relative">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M21.3334 28V25.3333C21.3334 23.9188 20.7714 22.5623 19.7713 21.5621C18.7711 20.5619 17.4145 20 16 20H8.00002C6.58553 20 5.22898 20.5619 4.22878 21.5621C3.22859 22.5623 2.66669 23.9188 2.66669 25.3333V28"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path
                                    d="M12 14.6667C14.9455 14.6667 17.3334 12.2789 17.3334 9.33333C17.3334 6.38781 14.9455 4 12 4C9.0545 4 6.66669 6.38781 6.66669 9.33333C6.66669 12.2789 9.0545 14.6667 12 14.6667Z"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path
                                    d="M29.3333 28V25.3333C29.3324 24.1516 28.9391 23.0037 28.2151 22.0698C27.4911 21.1358 26.4775 20.4688 25.3333 20.1733M21.3333 4.17334C22.4805 4.46707 23.4974 5.13427 24.2235 6.06975C24.9496 7.00523 25.3438 8.15578 25.3438 9.34001C25.3438 10.5242 24.9496 11.6748 24.2235 12.6103C23.4974 13.5457 22.4805 14.2129 21.3333 14.5067"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-center gap-3">
                        <div
                            className="justify-start text-white text-xl font-bold  leading-normal">
                            1,175
                        </div>
                        <div
                            className="Backers justify-start text-zinc-100 text-xs font-normal  uppercase leading-none">backers
                        </div>
                    </div>
                </div>
                <div className="inline-flex flex-col justify-start items-center gap-3">
                    <div className="size-16 p-4 bg-accent rounded-[88px] shadow-[0 4px 7px 0 rgba(255, 255, 255, 0.25) inset, 0 -3px 7px 0 rgba(0, 0, 0, 0.25) inset] bg-[#fe3d5b] inline-flex justify-start items-center gap-2">
                        <div data-svg-wrapper data-layer="Frame" className="Frame relative">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M29.3333 9.33331L18 20.6666L11.3333 14L2.66663 22.6666" stroke="white"
                                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21.3334 9.33331H29.3334V17.3333" stroke="white" strokeWidth="2"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div
                        className="Frame2147224290 self-stretch flex flex-col justify-start items-center gap-3">
                        <div
                            className="justify-start text-white text-xl font-bold  leading-normal">
                            98%
                        </div>
                        <div
                            className="SuccessRate justify-start text-zinc-100 text-xs font-normal  uppercase leading-none">success
                            rate
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}