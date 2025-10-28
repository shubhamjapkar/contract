export default function ProjectUpdates({data}: any) {
    return <div id={"project-updates"} className="flex py-16 flex-col gap-2.5">
        <div className="flex flex-col gap-6 items-start shrink-0">

            {/* Header */}
            <div className="flex w-full flex-col gap-4 items-start shrink-0">
                <div className="flex min-w-0 flex-col gap-4 items-start self-stretch shrink-0">
        <span className="h-[35px] text-[32px] font-semibold leading-[35px] text-[#d4c3c3] relative text-left">
          Project Updates
        </span>
                </div>
                <span className="min-w-0 min-h-0 self-stretch grow text-[16px] font-normal leading-6 text-[#d4c3c3]/90 relative text-left">
        Stay informed with the latest developments, milestones and behind the scenes progress.
      </span>
            </div>

            <div className="flex flex-col gap-6 w-full">
                {data.map((update: any, index: number) => (
                    <div key={index}
                        className="flex p-6 gap-[18px] items-start self-stretch shrink-0 bg-black/30 border border-white/20">
                        <div className="flex flex-col gap-[18px] items-start grow shrink-0 basis-0">
                            <div className="flex justify-between items-start self-stretch shrink-0">

                                <div className={`flex ${update.titleWidth} flex-col gap-[18px]`}>
                                    <span className="text-[22px] font-bold leading-6 text-[#d4c3c3]">
                                      {update.title}
                                    </span>
                                    <span className="h-[14px]  text-[12px] font-normal leading-[14px] text-[#d4c3c3] uppercase">
                                      {update.date}
                                    </span>
                                </div>

                                <div className={`flex gap-2 items-center shrink-0`}>
                                    <div>
                                        <span className={"px-2 py-1 w-fit text-[12px] rounded-xl azeret-mono leading-[18px] border border-[#ffffff4d]"}>
                                                {update.badge}
                                            </span>
                                    </div>
                                </div>
                            </div>

                            <span className="text-[16px] font-normal leading-6 text-[#d4c3c3] opacity-80 text-left">
                              {update.description}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
}