export default function InvestmentOpportunity({data}) {
    return <div id={"opportunities"} className="flex flex-col py-16 gap-2.5">
        <div className="flex  flex-col gap-6">
            <div className="flex flex-col gap-4 items-start self-stretch shrink-0">
                    <span className="text-[32px] font-semibold leading-[35px] text-[#d4c3c3] text-left">
                        Investment Opportunities
                    </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="flex flex-col flex-1 py-8 gap-2 items-center bg-[#000009] border border-white/20">
                    <div className="flex flex-col gap-3 items-center">
                        <div
                            className="flex w-16 h-16 p-4 items-center bg-[#fe3d5b] rounded-full border border-white/10 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"
                                 fill="none">
                                <path
                                    d="M16 2.66663V29.3333M22.6667 6.66663H12.6667C11.429 6.66663 10.242 7.15829 9.36684 8.03346C8.49167 8.90863 8 10.0956 8 11.3333C8 12.571 8.49167 13.758 9.36684 14.6331C10.242 15.5083 11.429 16 12.6667 16H19.3333C20.571 16 21.758 16.4916 22.6332 17.3668C23.5083 18.242 24 19.4289 24 20.6666C24 21.9043 23.5083 23.0913 22.6332 23.9665C21.758 24.8416 20.571 25.3333 19.3333 25.3333H8"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="flex flex-col gap-3 items-center self-stretch">
                                    <span
                                        className="h-6 text-[22px] font-bold leading-6 text-white text-left whitespace-nowrap">
                                        {data.target.title}
                                    </span>
                            <span
                                className="h-[14px] text-[12px] font-normal leading-[14px] text-[#efefef] uppercase whitespace-nowrap">
                                        target raise
                                    </span>
                            <span
                                className="h-6 text-base font-normal leading-6 text-[#d4c3c3]/90 text-center whitespace-nowrap">
                                        Raised by successful projects
                                    </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col flex-1 px-4 py-8 gap-2 items-center bg-[#000009] border border-white/20">
                    <div className="flex flex-col gap-3 items-center self-stretch">
                        <div
                            className="flex w-16 h-16 p-4 items-center bg-[#fe3d5b] rounded-full border border-white/10 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"
                                 fill="none">
                                <path
                                    d="M5.99967 22C3.99967 23.68 3.33301 28.6667 3.33301 28.6667C3.33301 28.6667 8.31967 28 9.99967 26C10.9463 24.88 10.933 23.16 9.87967 22.12C9.36142 21.6254 8.67873 21.3396 7.96264 21.3174C7.24655 21.2953 6.54751 21.5384 5.99967 22ZM15.9997 20L11.9997 16C12.7092 14.1593 13.6026 12.3948 14.6663 10.7334C16.2199 8.24936 18.3832 6.20411 20.9503 4.79217C23.5175 3.38022 26.4032 2.64854 29.333 2.66671C29.333 6.29338 28.293 12.6667 21.333 17.3334C19.6486 18.398 17.862 19.2913 15.9997 20Z"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path
                                    d="M11.9997 15.9999H5.33301C5.33301 15.9999 6.06634 11.9599 7.99967 10.6666C10.1597 9.22661 14.6663 10.6666 14.6663 10.6666M15.9997 19.9999V26.6666C15.9997 26.6666 20.0397 25.9333 21.333 23.9999C22.773 21.8399 21.333 17.3333 21.333 17.3333"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="flex flex-col gap-3 items-center self-stretch">
                                    <span className="h-6 text-[22px] font-bold leading-6 text-white whitespace-nowrap">
                                        {data.raised.title}
                                    </span>
                            <span
                                className="h-[14px] text-[12px] leading-[14px] text-[#efefef] uppercase whitespace-nowrap">
                                        raised so far
                                    </span>

                            {/* Progress Bar */}
                            <div className="h-6 self-stretch">
                                <div className="w-full h-2 bg-[#1f1f23] mt-2">
                                    <div className={`w-[${data.raised.progress}] h-2 bg-[#f1476a]`}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col h-full flex-1 p-6 gap-4  bg-black/30 border border-white/20">
                    <div className="flex flex-col gap-4 items-start self-stretch">
                                <span className="h-6 text-[22px] font-bold leading-6 text-[#d4c3c3] whitespace-nowrap">
                                    Revenue Distribution Model
                                </span>

                        <div className="flex flex-col gap-3 items-start self-stretch">
                            {data.revenue_distribution.map((e, i)=> {
                                return <div key={i}>
                                    <div className="flex justify-between items-center self-stretch">
                                        <div className="flex gap-1.5">
                                            <span
                                                className=" text-sm leading-[16px] text-[#d4c3c3]">
                                                {e.key}
                                            </span>
                                        </div>
                                    </div>

                                    {((data.revenue_distribution.length - 1) > i) ? <div className="h-px self-stretch bg-cover bg-[#fff3]"/> : ""}
                                </div>
                            })}

                        </div>
                    </div>
                </div>

                <div className="flex flex-col flex-1 p-6 gap-4 items-start bg-black/30 border border-white/20">
                    <div className="flex flex-col gap-4 items-start self-stretch">
                                <span className="h-6 text-[22px] font-bold leading-6 text-[#d4c3c3] whitespace-nowrap">
                                    Transparency Features
                                </span>
                        <div className="flex flex-col gap-3 items-start self-stretch">
                            <div className="flex w-[222px] gap-1.5">
                                        <span
                                            className="text-sm leading-[21px] text-[#d4c3c3] whitespace-nowrap">
                                            Real time on-chain revenue tracking
                                        </span>
                            </div>
                            <div
                                className="h-px self-stretch bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-15/6ofhyTbgc4.png')] bg-cover bg-no-repeat"/>

                            <div className="flex w-[237px] gap-1.5">
                                        <span
                                            className="text-sm leading-[21px] text-[#d4c3c3] whitespace-nowrap">
                                            Automated smart contract distribution
                                        </span>
                            </div>
                            <div
                                className="h-px self-stretch bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-15/VDeFkzVVRu.png')] bg-cover bg-no-repeat"/>

                            <div className="flex w-[174px] gap-1.5">
                                        <span
                                            className="text-sm leading-[21px] text-[#d4c3c3] whitespace-nowrap">
                                            Quarterly financial response
                                        </span>
                            </div>
                            <div
                                className="h-px self-stretch bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-15/KL6GfpC9JZ.png')] bg-cover bg-no-repeat"/>

                            <div className="flex w-[174px] gap-1.5">
                                        <span
                                            className="text-sm leading-[21px] text-[#d4c3c3] whitespace-nowrap">
                                            Full audit trail on blockchain
                                        </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}