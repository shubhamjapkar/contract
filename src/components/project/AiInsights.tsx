export default function AiInsights() {
    return <div className="flex flex-col gap-6 justify-center">
        <div
            className="flex p-6 flex-col justify-between items-start bg-black/30 border border-white/20">
            <span className="text-[22px] font-bold leading-6 text-[#d4c3c3] text-left">
              Key AI Insights
            </span>

            <div className="flex flex-col md:flex-row gap-2 w-full justify-center items-center pt-8 md:pt-[60px]">
                <div className="flex gap-1.5 items-start flex-1">
                    <div className="flex w-[126px] flex-col gap-1.5 items-center shrink-0">
                      <span className="h-12 text-[32px] font-bold leading-[48px] text-[#f1476a]">
                        2.8x
                      </span>
                        <span
                            className="flex w-[126px] h-[30px] text-[12px] font-normal leading-[15px] text-[#d4c3c3] text-left overflow-hidden">
                        expected ROI multiplier<br/>based on similar films
                      </span>
                    </div>
                </div>

                {/* Optimal Release Date */}
                <div className="flex gap-1.5 justify-center items-center flex-1">
                    <div className="flex w-[122px] flex-col gap-1.5 justify-center items-center shrink-0">
                      <span className="h-12 text-[32px] font-bold leading-[48px] text-[#f2f2f2] whitespace-nowrap">
                        Q2 2026
                      </span>
                        <span
                            className="flex w-[122px] h-[45px] text-[12px] font-normal leading-[15px] text-[#d4c3c3] text-left overflow-hidden">
                        optimal release date<br/>based on ai-generated<br/>market timing
                      </span>
                    </div>
                </div>

                {/* Streaming Success Rate */}
                <div className="flex gap-1.5 justify-end items-center flex-1">
                    <div className="flex w-[126px] flex-col gap-1.5 justify-center items-center shrink-0">
                          <span className="h-12 text-[32px] font-bold leading-[48px] text-[#16a149] whitespace-nowrap">
                            89%
                          </span>
                        <span
                            className="flex w-[126px] h-[30px] text-[12px] font-normal leading-[15px] text-[#d4c3c3] text-left overflow-hidden">
                        streaming success rate<br/>for this genre
                      </span>
                    </div>
                </div>
            </div>
        </div>

        <div
            className="flex p-6 flex-col gap-[18px] items-start self-stretch shrink-0 bg-[#383838]/30 border border-white/20">
            <p className="h-6 text-[22px] font-bold leading-6 text-[#d4c3c3] text-left whitespace-nowrap">
              Download AI Analysis Report
            </p>
            <p
                className="h-[17px]  text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] text-left uppercase whitespace-nowrap">
                      Last updated 10/10/2025
            </p>
            <p className="flex text-[16px] font-normal leading-6 text-[#d4c3c3] opacity-80 text-left">
                      Download all 47 pages detailed report analysed by our AI. It will help you take better decision while investing.
            </p>

            <div
                className="flex w-[240px] h-10 p-[11px] flex-col justify-center items-center shrink-0 border border-white/60 overflow-hidden">
                <div className="flex min-w-0 gap-1.5 justify-center items-center self-stretch shrink-0">
                    <span
                        className="h-[14px]  text-[12px] font-medium leading-[14px] text-[#efefef] text-left uppercase whitespace-nowrap">
                      download full report PDF
                    </span>
                </div>
            </div>
        </div>
    </div>

}