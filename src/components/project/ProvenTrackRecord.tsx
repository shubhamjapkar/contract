export default function ProvenTrackRecord({data}: any) {
    return <div id={"track-record"}
        className="flex min-w-0 py-[64px] flex-col gap-[10px] items-start self-stretch shrink-0">
        <div className="flex w-full flex-col gap-6 items-start shrink-0 flex-nowrap">
            <div className="flex flex-col gap-4 items-start shrink-0 flex-nowrap">
                <div
                    className="flex min-w-0 flex-col gap-4 items-start self-stretch shrink-0 flex-nowrap">
                <span
                    className="h-[35px] shrink-0  text-[32px] font-semibold leading-[35px] text-[#d4c3c3] relative text-left">
                  Proven Track Record
                </span>
                </div>
                <span
                    className="min-w-0 h-6 self-stretch shrink-0  text-base font-normal leading-6 text-[rgba(212,195,195,0.9)] relative text-left">
                Our production team has consistently delivered profitable products. Have a look!
              </span>
            </div>

            <div
                className="flex min-w-0 flex-col gap-6 justify-center items-start self-stretch shrink-0">
                {/* === Card 1 === */}
                {data.map((e: any, i: number)=> {
                    return <div key={i} className="flex flex-wrap p-4 gap-6 self-stretch shrink-0 flex-wrapbg-[#000009] border border-white/20">
                        <div
                            className="w-[248px] h-[250px] self-stretch shrink-0 bg-center bg-cover bg-no-repeat rounded"
                            style={{backgroundImage: `url(${e.image})`}}
                        ></div>
                        <div
                            className="flex pt-4 flex-col gap-3 items-start flex-grow shrink-0 basis-0 flex-nowrap">
                            <div
                                className="flex flex-col gap-3 items-start self-stretch shrink-0 flex-nowrap">
                    <span
                        className="h-6 shrink-0  text-[22px] font-bold leading-6 text-[#d4c3c3] relative text-left">
                      {e.title}
                    </span>
                                <span
                                    className="h-[14px] shrink-0  text-[12px] font-normal leading-[14px] text-[#efefef] relative text-left uppercase">
                             {e.author}
                            </span>

                                {/* Tags */}
                                <div className="flex gap-2 items-center shrink-0 flex-nowrap">
                                    {e.tags.map((name: string, i: number) => <div key={i}>
                                            <span className={"px-2 py-1 w-fit text-[12px] rounded-xl azeret-mono leading-[18px] border border-[#ffffff4d]"}>
                                                {name}
                                        </span>
                                    </div>)}
                                </div>

                                <span
                                    className="text-base font-normal leading-6 text-[rgba(212,195,195,0.9)] relative text-left">
                                  {e.description}
                                </span>
                            </div>

                            {/* Stats */}
                            {/*<div className="flex flex-col gap-4 items-start self-stretch shrink-0 relative">*/}
                            {/*    <div className="flex justify-between items-center self-stretch">*/}
                            {/*        <div className="flex flex-col gap-1.5 items-start">*/}
                            {/*        <span*/}
                            {/*            className="text-[12px] font-normal leading-[14px] text-[#d4c3c3] uppercase">budget</span>*/}
                            {/*            <span*/}
                            {/*                className="text-base font-bold leading-6 text-[#f2f2f2]">{e.budget}</span>*/}
                            {/*        </div>*/}
                            {/*        <div className="flex flex-col gap-1.5 items-end">*/}
                            {/*        <span*/}
                            {/*            className="text-[12px] font-normal leading-[14px] text-[#d4c3c3] uppercase">Revenue</span>*/}
                            {/*            <span className="text-base font-bold leading-6 text-[#16a149]">{e.revenue}</span>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}

                            {/*    <div className="flex justify-between items-center self-stretch">*/}
                            {/*        <div className="flex flex-col gap-1.5 items-start">*/}
                            {/*        <span*/}
                            {/*            className="text-[12px] font-normal leading-[14px] text-[#d4c3c3] uppercase">roi</span>*/}
                            {/*            <span className=" text-base font-bold leading-6 text-[#16a149]">{e.roi}</span>*/}
                            {/*        </div>*/}
                            {/*        <div className="flex flex-col gap-1.5 items-end">*/}
                            {/*        <span*/}
                            {/*            className=" text-[12px] font-normal leading-[14px] text-[#d4c3c3] uppercase">platform</span>*/}
                            {/*            <span className=" text-base font-bold leading-6 text-[#f2f2f2]">{e.platform}</span>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>

}