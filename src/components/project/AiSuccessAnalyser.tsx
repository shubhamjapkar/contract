export default function AiSuccessAnalyser() {
    return <div id={"success-analysis"} className="flex flex-col gap-2.5 pt-16">
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 md:flex-row min-w-0 justify-between items-center self-stretch md:gap-6">
                <div className="flex flex-col gap-4 items-start flex-1">
                    <div className="flex flex-col gap-4 items-start self-stretch shrink-0 relative">
                      <span className="text-[32px] font-semibold leading-[35px] text-[#d4c3c3] text-left relative">
                        AI Success Analysis
                      </span>
                    </div>
                    <span className="flex  text-base font-normal leading-6 text-[#d4c3c3]/90 text-left relative ">
                      Advanced machine learning algorithms have analysed 10,000+
                      film releases, market trends, and audience behaviours to
                      predict Astra’s commercial success with 94.7% accuracy.
                    </span>
                </div>

                <div className="flex w-full md:w-fit p-4 flex-col gap-2 justify-center items-center shrink-0 bg-[rgba(22,161,73,0.3)] border border-[rgba(22,161,73,0.4)]">
                    <div className="flex flex-col gap-4 items-start self-stretch shrink-0 relative">
                      <span
                          className=" uppercase font-azeret text-sm font-normal leading-[16.8px] text-[#d4c3c3] relative text-left whitespace-nowrap">
                        ai confidence score
                        </span>
                        <div className="flex gap-2 items-center self-stretch shrink-0 relative">
                        <span
                            className=" text-[32px] font-semibold leading-[35px] text-white text-left whitespace-nowrap relative">
                          94.7%
                        </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 justify-center items-center self-stretch shrink-0 relative">
                <div className="flex flex-col gap-6 justify-center items-start self-stretch shrink-0 relative">
                    <div className="flex p-6 flex-col gap-[18px] items-start self-stretch shrink-0 bg-black/30 border border-white/20 relative ">
                          <span className="h-6 text-[22px] font-bold leading-6 text-[#d4c3c3] text-left whitespace-nowrap relative">
                            Market Position Analysis
                          </span>

                        {[
                            { label: "fantasy films", value: "78% Success Rate", bar: "w-[10%]" },
                            { label: "mythology based", value: "62% Success Rate", bar: "w-[30%]" },
                            { label: "action/adventure", value: "82% Success Rate", bar: "w-[50%]" },
                            { label: "indie productions", value: "32% Success Rate", bar: "w-[55%]" },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-4 items-start self-stretch shrink-0 relative">
                                <div className="flex justify-between items-center self-stretch">
                            <span
                                className=" font-azeret text-sm font-normal leading-[16.8px] text-[#d4c3c3] uppercase whitespace-nowrap">
                              {item.label}
                            </span>
                                    <span
                                        className="text-sm font-medium leading-[21px] text-[#16a149] whitespace-nowrap">
                              {item.value}
                            </span>
                                </div>
                                <div className="h-2 self-stretch bg-[#1f1f23]">
                                    <div className={`${item.bar} h-2 bg-[#16a149]`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
}