export default function ProjectOverview({data}: any) {
    return <div id={"project-overview"} className="min-w-0 py-16 items-start self-stretch flex flex-col gap-6 w-full">
        <div className="flex min-w-0 flex-col gap-4 items-start self-stretch shrink-0 ">
              <span
                  className="text-[32px] font-semibold leading-[35px] text-[#d4c3c3] relative text-left whitespace-nowrap">
                Project Overview
              </span>
        </div>

        <div className="flex flex-col md:flex-row min-w-0 gap-6 items-start self-stretch shrink-0 ">
            <div className="flex flex-col gap-6 justify-center items-start grow shrink-0 basis-0">
                <div className="flex flex-col gap-2 items-start self-stretch shrink-0 bg-black/30">
                      <span
                          className="h-[17px] shrink-0 text-sm font-normal leading-[16.8px] text-[#d4c3c3] uppercase whitespace-nowrap">
                        logline
                      </span>
                    <span
                        className="flex justify-start items-start self-stretch shrink-0  text-base font-normal leading-6 text-[#d4c3c3] opacity-80 relative text-left">
                        {data.loglineText}
                    </span>
                </div>

                <div className="flex flex-col gap-2 items-start self-stretch shrink-0 bg-black/30">
                          <span
                              className="h-[17px] shrink-0  text-sm font-normal leading-[16.8px] text-[#d4c3c3] uppercase whitespace-nowrap">
                            synopsis
                          </span>
                    <span
                        className="flex justify-start items-start self-stretch shrink-0  text-base font-normal leading-6 text-[#d4c3c3] opacity-80 relative text-left">
                            {data.synopsisText}
                    </span>
                </div>
            </div>

            <div className="flex gap-6 items-start grow shrink-0 basis-0  w-full">
                <div
                    className="flex p-6 flex-col gap-8 items-start grow shrink-0 basis-0 bg-black/30 border border-white/20">
                    <div className="flex flex-col gap-4 items-start self-stretch shrink-0">
                            <span
                                className="h-6 shrink-0  text-[22px] font-bold leading-6 text-[#d4c3c3] whitespace-nowrap">
                              Production Status
                            </span>

                        <div className="flex flex-col gap-3 items-start self-stretch shrink-0">
                            <div className="flex gap-4 justify-between items-center self-stretch border-b border-b-[#ffffff4d] pb-3">
                                <div className="flex gap-1.5 items-start">
                                  <span
                                      className="h-[14px]  text-[12px] font-normal leading-[14px] text-[#d4c3c3] uppercase whitespace-nowrap"
                                  >
                                    Current Status
                                  </span>
                                </div>

                                <div className={"flex gap-2 flex-wrap"}>
                                    {data.currentStatus.map((e: string, i: number) => {
                                        return <span key={i} className="px-2 py-1 w-fit text-[12px] rounded-xl azeret-mono leading-[18px] border border-[#ffffff4d]">
                                            {e}
                                        </span>
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-between items-center self-stretch border-b border-b-[#ffffff4d] pb-3">
                                <div className="flex  gap-1.5 items-start">
                                  <span
                                      className="h-[14px]  text-[12px] font-normal leading-[14px] text-[#d4c3c3] uppercase whitespace-nowrap">
                                    Release Target
                                  </span>
                                </div>
                                <div className="flex gap-1.5 items-start">
                                  <span
                                      className="h-[21px]  text-sm font-medium leading-[21px] text-[#f2f2f2] whitespace-nowrap">
                                      {data.releaseTarget}
                                  </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center self-stretch">
                                <div className="flex gap-1.5 items-start">
                                  <span
                                      className="h-[14px]  text-[12px] font-normal leading-[14px] text-[#d4c3c3] uppercase whitespace-nowrap"
                                  >
                                    Distribution
                                  </span>
                                </div>
                                <div className="flex gap-1.5 items-start">
                                      <span
                                          className="h-[21px]  text-sm font-medium leading-[21px] text-[#f2f2f2] whitespace-nowrap"
                                      >
                                        {data.distribution}
                                      </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 items-start self-stretch">
                        <span
                            className="h-[17px]  text-sm font-normal leading-[16.8px] text-[#d4c3c3] uppercase whitespace-nowrap"
                        >
                          revenue streams
                        </span>

                        <div
                            className="flex flex-col gap-4 justify-center items-center self-stretch">
                            <div className="flex justify-between items-center self-stretch">
                                <div
                                    className="flex flex-col gap-2 justify-center items-start">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M4 3.00012L6 7.00012H9L7 3.00012H9L11 7.00012H14L12 3.00012H14L16 7.00012H19L17 3.00012H22V21.0001H2V3.00012H4ZM4 9.00012V19.0001H20V9.00012H4ZM8 18.0001H16V17.4501C16 16.7168 15.6333 16.1251 14.9 15.6751C14.1667 15.2251 13.2 15.0001 12 15.0001C10.8 15.0001 9.83333 15.2251 9.1 15.6751C8.36667 16.1251 8 16.7168 8 17.4501V18.0001ZM12 14.0001C12.55 14.0001 13.021 13.8045 13.413 13.4131C13.805 13.0218 14.0007 12.5508 14 12.0001C13.9993 11.4495 13.8037 10.9788 13.413 10.5881C13.0223 10.1975 12.5513 10.0015 12 10.0001C11.4487 9.99879 10.978 10.1948 10.588 10.5881C10.198 10.9815 10.002 11.4521 10 12.0001C9.998 12.5481 10.194 13.0191 10.588 13.4131C10.982 13.8071 11.4527 14.0028 12 14.0001Z" fill="#D4C3C3"/>
                                        </svg>
                                    </div>
                                    <div className="gap-1.5 items-start">
                                        <span
                                            className=" text-sm font-medium leading-[21px] text-[#f2f2f2] whitespace-nowrap">
                                          Box Office
                                        </span>
                                    </div>
                                </div>
                                <div className="flex ] flex-col gap-2 items-end">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M11.4996 14.0001C12.549 14.0001 13.3996 13.1047 13.3996 12.0001C13.3996 10.8956 12.549 10.0001 11.4996 10.0001C10.4503 10.0001 9.59961 10.8956 9.59961 12.0001C9.59961 13.1047 10.4503 14.0001 11.4996 14.0001Z" stroke="#D4C3C3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M7.225 8.00012C6.275 9.00012 5.8 10.5001 5.8 12.0001C5.8 13.5001 6.275 15.0001 7.225 16.0001M4.375 6.00012C2.95 7.50012 2 9.50012 2 12.0001C2 14.5001 2.95 16.5001 4.375 18.0001M15.775 16.0001C16.725 15.0001 17.2 13.5001 17.2 12.0001C17.2 10.5001 16.725 9.00012 15.775 8.00012M18.625 18.0001C20.05 16.5001 21 14.5001 21 12.0001C21 9.50012 20.05 7.50012 18.625 6.00012" stroke="#D4C3C3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <div className="flex ] gap-1.5 items-start">
                                        <span
                                            className="h-[21px]  text-sm font-medium leading-[21px] text-[#f2f2f2] whitespace-nowrap"
                                        >
                                          Streaming Rights
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center self-stretch">
                                <div className="flex flex-col gap-2 justify-center items-start">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M8.5 12.0001C9.03043 12.0001 9.53914 11.7894 9.91421 11.4143C10.2893 11.0393 10.5 10.5306 10.5 10.0001C10.5 9.46969 10.2893 8.96098 9.91421 8.58591C9.53914 8.21084 9.03043 8.00012 8.5 8.00012C7.96957 8.00012 7.46086 8.21084 7.08579 8.58591C6.71071 8.96098 6.5 9.46969 6.5 10.0001C6.5 10.5306 6.71071 11.0393 7.08579 11.4143C7.46086 11.7894 7.96957 12.0001 8.5 12.0001ZM11.5 1.00012L21 6.50012V17.5001L11.5 23.0001L2 17.5001V6.50012L11.5 1.00012ZM4 7.65312V16.3471L6.372 17.7201L14.445 11.8001L19 14.5341V7.65412L11.5 3.31012L4 7.65312Z" fill="#D4C3C3"/>
                                        </svg>
                                    </div>
                                    <div className="flex gap-1.5 items-start">
                                        <span
                                            className="h-[21px]  text-sm font-medium leading-[21px] text-[#f2f2f2] whitespace-nowrap">
                                          NFT Collections
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M23.8399 9.61597L21.4474 4.82909C21.3592 4.65291 21.2372 4.49581 21.0884 4.36676C20.9395 4.23772 20.7667 4.13927 20.5798 4.07702C20.3929 4.01478 20.1955 3.98996 19.999 4.00399C19.8025 4.01802 19.6107 4.07062 19.4345 4.15878L17.103 5.32409L12.1914 4.02472C12.0654 3.99192 11.9331 3.99192 11.807 4.02472L6.89548 5.32409L4.56391 4.15878C4.38774 4.07062 4.19593 4.01802 3.99942 4.00399C3.80292 3.98996 3.60558 4.01478 3.41867 4.07702C3.23175 4.13927 3.05894 4.23772 2.91008 4.36676C2.76122 4.49581 2.63924 4.65291 2.5511 4.82909L0.158602 9.61503C0.0704353 9.7912 0.0178362 9.98302 0.00380791 10.1795C-0.0102204 10.376 0.0145969 10.5734 0.0768426 10.7603C0.139088 10.9472 0.237543 11.12 0.366585 11.2689C0.495626 11.4177 0.652726 11.5397 0.828914 11.6278L3.36016 12.8944L8.56235 16.6097C8.63905 16.6642 8.7252 16.7039 8.81641 16.7269L14.8164 18.2269C14.9421 18.2584 15.0737 18.2568 15.1986 18.2223C15.3235 18.1878 15.4373 18.1216 15.5289 18.03L19.2789 14.28L20.6927 12.8663L23.1695 11.6278C23.5251 11.4498 23.7955 11.1379 23.9212 10.7607C24.0469 10.3834 24.0176 9.97167 23.8399 9.61597ZM18.6939 12.7444L15.468 10.1607C15.3235 10.0449 15.1412 9.98673 14.9564 9.99729C14.7715 10.0078 14.5971 10.0864 14.4667 10.2178C12.797 11.8997 10.9361 11.6869 9.74923 10.9369L13.803 6.99941H16.7852L19.3361 12.1003L18.6939 12.7444ZM14.7686 16.6688L9.31985 15.3066L4.70735 12.0122L7.33235 6.76222L11.9992 5.52566L12.918 5.76847L8.69923 9.86347L8.69173 9.87191C8.53292 10.0307 8.4118 10.2232 8.33731 10.435C8.26281 10.6469 8.23684 10.8728 8.26132 11.096C8.28579 11.3193 8.36009 11.5342 8.47872 11.7249C8.59735 11.9156 8.75729 12.0772 8.94673 12.1978C10.8742 13.4288 13.2002 13.2291 15.032 11.7291L17.6242 13.8113L14.7686 16.6688ZM12.3574 19.9313C12.3168 20.0934 12.2233 20.2373 12.0917 20.3402C11.9601 20.4432 11.7979 20.4992 11.6308 20.4994C11.5692 20.4994 11.5078 20.4919 11.448 20.4769L7.53766 19.4991C7.4463 19.4765 7.36007 19.4368 7.2836 19.3819L4.81329 17.6175C4.6614 17.4983 4.56136 17.325 4.53401 17.1338C4.50666 16.9427 4.55411 16.7483 4.66647 16.5913C4.77883 16.4342 4.94745 16.3265 5.13721 16.2907C5.32696 16.2548 5.52324 16.2935 5.68516 16.3988L8.03923 18.0807L11.8117 19.0219C12.0047 19.0702 12.1705 19.1931 12.2728 19.3636C12.3752 19.5341 12.4056 19.7383 12.3574 19.9313Z" fill="#D4C3C3"/>
                                        </svg>
                                    </div>
                                    <div className="flex gap-1.5 items-start">
                                            <span
                                                className="h-[21px]  text-sm font-medium leading-[21px] text-[#f2f2f2] whitespace-nowrap "
                                            >
                                              Licensing Deals
                                            </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}