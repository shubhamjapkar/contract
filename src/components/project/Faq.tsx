import {useState} from "react";

function Question({e}: any) {
    const [open, setOpen] = useState(false);

    return (
        <div
            onClick={() => setOpen(!open)}
            className="flex flex-col p-6 items-start self-stretch shrink-0 bg-black/30 border border-white/20 cursor-pointer ">
            <div
                className="flex w-full justify-between items-center gap-4">
            <span className="text-base font-medium leading-[17.6px] text-[#d4c3c3]">
          {e.question}
        </span>
                <div className="flex justify-center items-center h-[32px] w-[32px] shrink-0 border border-white/20">
                    {open ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="3"
                            viewBox="0 0 18 3"
                            fill="none"
                        >
                            <path
                                d="M10.2857 2.78572H18V0.214294H10.2857H7.71429H0V2.78572H7.71429H10.2857Z"
                                fill="white"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                        >
                            <path
                                d="M16 10H10V16H6V10H0V6H6V0H10V6H16V10Z"
                                fill="#F2F2F2"
                            />
                        </svg>
                    )}
                </div>
            </div>

            <div
                className={`overflow-hidden transition-all duration-1000 ease-in-out ${
                    open ? "max-h-40 opacity-100 mt-3" : "max-h-0 h-0 opacity-0"
                }`}
            >
                <p className="text-sm text-gray-300">{e.answer}</p>
            </div>
        </div>
    );
}

export default function Faq({data}: any) {
    return <div id={"faq"} className="flex py-16 flex-col gap-2.5">
        <div className="flex w-full flex-col gap-6 items-start">
            <div className="flex flex-col gap-4 items-start">
                <div className="flex flex-col gap-4 items-start self-stretch shrink-0">
                    <span className="text-[32px] font-semibold leading-[35px] text-[#d4c3c3] text-left">
                      Frequently Asked Questions
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-4 items-start self-stretch shrink-0">
                {data.map((e: any, index: number)=> {
                    return <Question e={e} key={index} />
                })}
            </div>
        </div>
    </div>

}