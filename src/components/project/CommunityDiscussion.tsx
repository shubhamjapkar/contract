export default function CommunityDiscussion({data}: any) {
    return <div id={"community-discussion"} className="flex flex-col gap-6 w-full py-16">

        <div className="flex flex-col gap-4 items-start">
            <div className="flex flex-col min-w-0 gap-4 items-start">
                <span className="text-[32px] font-semibold leading-[35px] text-[#d4c3c3]">
                  Community Discussion
                </span>
            </div>
            <span className="text-[16px] font-normal leading-6 text-[#d4c3c3]/90  w-full">
                    Stay informed with the latest developments, milestones and behind the scenes progress.
                  </span>
        </div>

        <div
            className="relative flex min-w-0 h-[193px] gap-2 items-start w-full bg-[#000009] rounded-[20px] border-[8px] border-white/10">
            <div style={{
                    backgroundImage: "linear-gradient(#C00A67 -18.45%, #DD788C 50.34%, #F9E3B0, #DD788C 12.34%, #FF5877 5%",
                }}
                className="p-[0.5px] rounded-xl w-full h-full">
                <div className="bg-black p-4 rounded-xl text-xs w-full h-full">
                    <div>
                                                <textarea
                                                    className="placeholder:text-[#d4c3c380] text-[18px] font-normal leading-[27px] text-[#d4c3c3]/50 resize-none w-full h-full right-0 border-none focus:outline-none focus:ring-0"
                                                    placeholder="Share your thoughts with the community"
                                                />
                        <div className="absolute bottom-6 right-6 p-2.5 flex flex-col justify-center items-start gap-2.5 border border-white/60 rounded">
                                                    <span className="text-[12px] font-medium uppercase text-[#efefef]">
                                                        post a comment
                                                    </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col min-w-0 gap-6 items-start w-full">
            {data.map((c: any, i: number) => (
                <div key={i} className="flex p-4 md:p-6 gap-2 md:gap-4 items-start w-full shrink-0 flex-wrap-nowrap bg-[#393838]/30 border border-white/20 rounded relative">
                    <div className={"w-[75px] md:w-[100px] h-[100px]"}>
                        <img src={c.avatar} className={"w-full h-full"}  alt={""} />
                    </div>

                    <div className="flex flex-col gap-4.5 items-start flex-1 shrink-0 basis-0">
                        <div className="flex justify-between items-start w-full shrink-0 flex-wrap-nowrap">
                            <div className="flex flex-col gap-4.5 items-start w-[194px] shrink-0">
                                <div className="flex gap-2 items-start">
                                    <span className="text-[22px] font-bold leading-6 text-[#d4c3c3] whitespace-nowrap">{c.name}</span>
                                    <div className="w-fit rounded-xl">
                                        <span className={"px-2 py-1 w-fit text-[12px] rounded-xl azeret-mono leading-[18px] border border-[#ffffff4d]"}>
                                                {c.role}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[12px] font-normal uppercase text-[#d4c3c3]">{c.time}</span>
                            </div>
                        </div>
                        <span className="text-[16px] font-normal text-[#d4c3c3]/80 leading-6 w-full">{c.text}</span>
                        <div className="flex gap-8 items-center">
                            <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 shrink-0 bg-center bg-cover" style={{ backgroundImage: `url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-15/icZKeBwyas.png')` }}></div>
                                <span className="text-[16px] font-medium text-white/80">{c.likes}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
}