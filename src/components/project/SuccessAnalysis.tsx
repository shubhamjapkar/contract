import RiskAssessment from "./RiskAssessment.tsx";
import AiSuccessAnalyser from "./AiSuccessAnalyser.tsx";
import AiInsights from "./AiInsights.tsx";
import React from "react";

export default function SuccessAnalysis({data}: any) {
    return <div className={"relative flex flex-col gap-6 pb-16"}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center gap-2 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path d="M49.75 30.668V20.916C49.75 11.128 41.79 3.16602 32 3.16602C22.21 3.16602 14.25 11.126 14.25 20.916V30.668H10.084V60.834H53.916V30.668H49.75ZM21.25 20.916C21.25 14.988 26.07 10.166 32 10.166C37.93 10.166 42.75 14.986 42.75 20.916V30.668H21.25V20.916ZM36.544 53.912H27.454L29.898 46.578C29.105 46.1885 28.4367 45.585 27.9685 44.8358C27.5002 44.0867 27.2507 43.2215 27.248 42.338C27.248 41.0782 27.7484 39.8701 28.6392 38.9793C29.53 38.0885 30.7382 37.588 31.998 37.588C33.2578 37.588 34.4659 38.0885 35.3567 38.9793C36.2475 39.8701 36.748 41.0782 36.748 42.338C36.748 44.202 35.664 45.798 34.1 46.578L36.544 53.912Z" fill="#D4C3C3"/>
            </svg>
            <span>AI Analysis coming soon!</span>
        </div>
        <div className={"blur-[0.4rem]"}>
            {data.map((e: any, i: number)=> {
                if (e.type == "risk_assessment") {
                    return <RiskAssessment data={e.data} key={i} />
                } else if (e.type === "ai_success_analyser") {
                    return <AiSuccessAnalyser key={i} />
                } else if (e.type === "ai_insights") {
                    return <AiInsights key={i} />
                }

                return <React.Fragment key={i}></React.Fragment>;
            })}
        </div>
    </div>
}