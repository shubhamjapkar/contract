export default function CreativeTeam({data}) {
    return <div id={"creative-team"} className="flex py-16 flex-col gap-[24px] items-start">
        <div className="flex gap-4 justify-end items-end shrink-0">
            <div className="flex min-w-0 flex-col gap-4 items-start grow">
                <div className="flex flex-col gap-4 items-start">
                <span className="text-[32px] font-semibold leading-[35px] text-[#d4c3c3] relative text-left">
                  Creative Team
                </span>
                </div>
                <span className="text-base font-normal leading-6 text-[rgba(212,195,195,0.9)] text-left">
                Meet the visionary minds behind this epic.
              </span>
            </div>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 flex-col gap-6 justify-center items-start shrink-0 w-full">
            {data.map((e, i: number)=> {
                return <div key={i} className="relative w-full p-4 flex-col gap-2 items-start bg-[#000009] border border-white/20 mx-auto">
                    <div
                        className="w-[166px] h-[166px] shrink-0 bg-center bg-cover bg-no-repeat rounded mb-2"
                        style={{backgroundImage: `url(${e.image})`}}></div>

                    <div className="w-fit rounded-xl absolute top-4 right-4">
                        <span className={"px-2 py-1 w-fit text-[12px] rounded-xl azeret-mono leading-[18px] border border-[#ffffff4d]"}>
                            Verified
                        </span>
                    </div>

                    <div className="flex pt-4 flex-col gap-3 items-start self-stretch border-t border-white/20">
                        <div className="flex flex-col gap-3 items-start self-stretch">
                      <span className="text-[22px] font-bold leading-6 text-[#d4c3c3]">
                        {e.name}
                      </span>
                            <span className="text-[12px] font-normal leading-[14px] text-[#efefef] uppercase">
                            {e.role}
                          </span>
                            <span className="text-base font-normal leading-6 text-[rgba(212,195,195,0.9)] line-clamp-5">
                                {e.description}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 items-start self-stretch">
                            <div className="flex gap-1.5 items-start">
                                <div
                                    className="w-5 h-5 shrink-0 bg-center bg-cover bg-no-repeat"
                                    style={{
                                        backgroundImage:
                                            "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-16/aP3rt0KOMn.png)",
                                    }}
                                ></div>
                                <div className="text-sm font-medium leading-[21px] text-left ">
                                    <span className="text-[rgba(212,195,195,0.9)]">Experience: </span>
                                    <span className="text-[#f2f2f2]">{e.experience}</span>
                                </div>
                            </div>

                            <div className="flex gap-1.5 items-start">
                                <div
                                    className="w-5 h-5 shrink-0 bg-center bg-cover bg-no-repeat"
                                    style={{
                                        backgroundImage:
                                            "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-16/5imy6peCBL.png)",
                                    }}
                                ></div>
                                <div className="text-sm font-medium leading-[21px] text-left ">
                                    <span className="text-[rgba(212,195,195,0.9)]">Speciality: </span>
                                    <span className="text-[#f2f2f2]">{e.speciality}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            })}

        </div>
    </div>

}