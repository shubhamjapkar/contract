type RiskItem = {
    label: string; value: string; color: string; width: string;
};

const riskData: RiskItem[] = [{
    label: "market competition",
    value: "Medium Risk",
    color: "#f5aa6a",
    width: "10%"
}, {label: "budget management", value: "Low Risk", color: "#16a149", width: "99px"}, {
    label: "audience appeal",
    value: "Very Low Risk",
    color: "#16a149",
    width: "55%"
}, {label: "distribution risk", value: "Low Risk", color: "#16a149", width: "135px"}, {
    label: "technology risk",
    value: "Very Low Risk",
    color: "#16a149",
    width: "75%"
},];

export default function RiskAssessment({data = riskData}: { data?: RiskItem[] }) {
    return (<div
            className="flex p-6 flex-col gap-[18px] items-start bg-black/30 border border-white/20">
      <span className="text-[22px] font-bold leading-6 text-[#d4c3c3] text-left">
        Risk Assessment Matrix
      </span>

            {data.map((item, index) => (
                <div key={index} className="flex flex-col gap-4 items-start self-stretch shrink-0">
                    <div className="flex justify-between items-center self-stretch">
            <span className="text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] uppercase">
              {item.label}
            </span>
                        <span
                            className="font-roboto text-[14px] font-medium leading-[21px]"
                            style={{color: item.color}}
                        >
              {item.value}
            </span>
                    </div>
                    <div className="h-2 self-stretch bg-[#1f1f23] overflow-hidden">
                        <div className="h-2" style={{width: item.width, backgroundColor: item.color}}></div>
                    </div>
                </div>))}

            {/* Overall Score */}
            <div
                className="flex p-4 flex-col gap-2 justify-center items-center bg-[rgba(22,161,73,0.3)] border border-[rgba(22,161,73,0.4)] w-full">
                <div className="flex flex-col gap-4 items-start self-stretch">
          <span className="self-stretch text-[14px] font-normal leading-[16.8px] text-[#d4c3c3] uppercase">
            Overall risk score
          </span>
                    <div className="flex gap-2 items-center self-stretch">
                        <div className="text-[32px] font-semibold leading-[35px] text-white">
                            83/100,
                            <span className="ml-1 text-[20px] leading-[35.2px] font-semibold text-white">
                Low Risk Investment
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}
