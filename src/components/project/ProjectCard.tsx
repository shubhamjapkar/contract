import React, {useEffect, useRef, useState} from "react";
import HeaderFooter from "../lp/HeaderFooter.tsx";
import projectData from "../../data/project-data.json";
import HeroSection from "./HeroSection.tsx";
import ProjectOverview from "./ProjectOverview.tsx";
import Faq from "./Faq.tsx";
import CommunityDiscussion from "./CommunityDiscussion.tsx";
import ProjectUpdates from "./ProjectUpdates.tsx";
import SuccessAnalysis from "./SuccessAnalysis.tsx";
import InvestmentOpportunity from "./InvestmentOpportunity.tsx";
import CreativeTeam from "./CreativeTeam.tsx";
import ProvenTrackRecord from "./ProvenTrackRecord.tsx";
import {useAccount} from "wagmi";
import {useNavigate, useParams} from "react-router-dom";
import PageNotFound from "../../NotFound.tsx";
import moment from "moment";
import {useWallet} from "../provider/WalletProvider.tsx";
import Connected from "../nft/Connected.tsx";
import {NotConnected} from "../nft/NotConnected.tsx";
import {useScreen} from "../provider/ScreenProvider.tsx";
import {MintPhase} from "../../interface/api.ts";

const tabs = [
    {id: "hero-section", label: "Overview"},
    {id: "project-overview", label: "Project Overview"},
    {id: "opportunities", label: "Opportunities"},
    {id: "creative-team", label: "Creative Team"},
    {id: "track-record", label: "Proven Track Record"},
    // {id: "success-analysis", label: "AI Success Analysis"},
    {id: "project-updates", label: "Project Updates"},
    // {id: "community-discussion", label: "Community Discussion"},
    {id: "faq", label: "FAQ"}
];

function StickyTabs() {
    const {activeProject} = useWallet()
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("hero-section");

    const activeRef = useRef<HTMLDivElement | null>(null);
    const _tabs = (activeProject?.name === "Moksh") ? tabs?.filter(e=> (e?.id !== "track-record")) : tabs

    useEffect(() => {
        if (activeRef.current) {
            activeRef.current.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            });
            activeRef.current.focus();
        }
    }, [activeTab]);

    useEffect(() => {
        const handleScroll = () => {
            for (let i = 0; i < _tabs.length; i++) {
                const section = document.getElementById(_tabs[i].id);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 120 && rect.bottom >= 120) {
                        setActiveTab(_tabs[i].id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (<div style={{
            background: "#0000001a",
            backdropFilter: "blur(20px)"
        }}
        className="sticky overflow-scroll no-scrollbar top-[74.5px] flex justify-center w-full py-2  border-b border-t border-white/20 items-center gap-6 z-50">
        <section className={"flex justify-between items-center w-full max-w-[1350px] gap-5 m-auto px-4 lg:px-0"}>
            <button onClick={() => {
                navigate("/")
            }} className={"px-2 py-1 md:py-2 border-[1px] border-[#4D4D53] rounded-[8px] cursor-pointer"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8.64681 14.6867L4.06348 10.1034L8.64681 5.52008M5.10514 10.1034L15.9385 10.1034" stroke="#D4C3C3" stroke-width="2" stroke-linecap="square"/>
                </svg>
            </button>
            {_tabs.map((tab: any, index: number) => (<div ref={activeTab === tab.id ? activeRef : null}
                                                          onClick={() => {
                                                              setActiveTab(tab.id)
                                                              const el = document.getElementById(tab.id);
                                                              if (el) {
                                                                  const y = (el.getBoundingClientRect().top + window.pageYOffset) - 100;

                                                                  window.scrollTo({top: y, behavior: "instant"});
                                                              }
                                                          }}
                                                          key={index}
                                                          className={`${activeTab === tab.id ? "border border-[#fff3] bg-[#3E3E3E] opacity-100" : "opacity-60"} text-[#EFEFEF] text-[12px] grow justify-center flex items-center cursor-pointer py-2 md:py-[14px] px-2 `}>
                <div
                    className="Opportunities justify-start text-zinc-100 text-xs font-medium  uppercase leading-none whitespace-nowrap">
                    {tab.label}
                </div>
            </div>))}
        </section>
    </div>);
}

function LeftSideCom() {
    const {activeProject} = useWallet()


    return <div>
        {activeProject?.data?.map((data: any, i: number) => {
            if (data.type == "hero_section") {
                return <HeroSection data={data.data} key={i}/>
            } else if (data.type === "project_overview") {
                return <ProjectOverview data={data.data} key={i}/>
            } else if (data.type === "investment_opportunities") {
                return <InvestmentOpportunity data={data.data} key={i}/>
            } else if (data.type === "faq") {
                return <Faq data={data.data} key={i}/>
            } else if (data.type === "community_discussion") {
                return <CommunityDiscussion data={data.data} key={i}/>
            } else if (data.type === "project_updates") {
                return <ProjectUpdates data={data.data} key={i}/>
            } else if (data.type === "success_analysis") {
                return <SuccessAnalysis data={data.data} key={i}/>
            } else if (data.type === "creative_team") {
                return <CreativeTeam data={data.data} key={i}/>
            } else if (data.type === "proven_track_record") {
                return <ProvenTrackRecord data={data.data} key={i}/>
            }
            return <React.Fragment key={i}></React.Fragment>;
        })}
    </div>
}

function RightSideBar() {
    const {currentPhase, nftLoading, mintStatus} = useWallet()
    const {status} = useAccount();
    const {getMobileDetect} = useScreen();

    if (!getMobileDetect.isDesktop()) {
        return null;
    }

    if (["reconnecting", "connecting"].includes(status) || nftLoading) {
        return <div
            className="hidden xl:flex xl:flex-col sticky top-[132px] self-start max-w-[450px] w-full h-[650px] max-h-[calc(100svh_-_172px)] bg-[#161616]  pt-6 gap-4 items-start  border-l border-white/20 backdrop-blur-[20px] mx-auto">
            <div className="flex flex-col h-full w-full justify-center items-center gap-2 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Connecting to wallet...</p>
            </div>
        </div>
    } else if (status === "connected" && currentPhase !== null && currentPhase !== 0 && mintStatus !== 1) {
        return <Connected />
    } else {
        return <NotConnected />
    }
}

function MobileInvestNowWrapper() {
    const [open, setOpen] = useState(false)

    const {currentPhase, nftLoading, mintStatus} = useWallet()
    const {status} = useAccount();

    return <div className={`fixed flex flex-col xl:hidden bottom-0 right-0 w-dvw z-50 bg-[#00000933]`}>
        <div className={`flex flex-col ${!open ? "h-0" : "h-[100vh]"} transform duration-1000 `}>
            <div className={"flex justify-center items-center grow overflow-hidden bg-[#000000ba]"}>
                <button
                    onClick={() => setOpen(e=> !e)}
                    className={`${open ? "absolute" : "hidden"} w-9 h-9 rounded-full bg-[#161616] flex items-center justify-center shadow-md hover:scale-105 transform transition focus:outline-none`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        focusable="false">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0" />
                        <path
                            d="M15 9L9 15M9 9l6 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            <div className={`h-full bg-[#161616] max-h-[calc(min(100svh-100px,1200px))] w-full z-50 overflow-hidden transform duration-1000 ${!open ? "opacity-0" : "opacity-100"}`}>
                {!open ? null : ((["reconnecting", "connecting"].includes(status) || nftLoading)) ? <div
                    className="flex flex-col m-auto self-start max-w-[450px] w-full gap-4 items-start mx-auto h-full">
                            <div className="flex flex-col h-full w-full justify-center items-center gap-2 text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                    <p className="text-gray-400">Connecting to wallet...</p>
                            </div>
                    </div> : (status === "connected" && currentPhase !== null && currentPhase !== 0 && mintStatus !== 1) ? <Connected /> : <NotConnected />}
            </div>
        </div>

        <div className={`bg-[#161616] ${open ? "h-0" : "h-[62px] px-4 py-2"} transform duration-500`}>
            <button onClick={() => {
                setOpen(true)
            }} className={`flex gap-2 justify-center azeret-mono items-center w-full text-[#EFEFEF] bg-[#FE3D5B]  py-3.5 text-center cursor-pointer text-[12px] font-medium uppercase  z-[1000]`}>
                {status === "connected" ? (currentPhase === MintPhase.CLAIM ? <span>Claim NFT</span> : <span>Mint NFT</span>) : (mintStatus === 3 ? <span>Mint Closed</span> : <span>Check Wallet Eligibility</span>)}
            </button>
        </div>
    </div>
}

export default function ProjectCard() {
    const {id} = useParams();
    const {setActiveProject, setMintStatus} = useWallet()
    const today = moment();
    const activeProject = projectData.find((e) => e.id === id)

    useEffect(() => {
        if (activeProject) {
            setActiveProject(activeProject)

            const start = moment(activeProject.startData, "DD/MM/YYYY");
            const end = moment(activeProject.endDate, "DD/MM/YYYY");

            if (today.isBefore(start, "day")) {
                setMintStatus(1);
            } else if (today.isAfter(end, "day")) {
                setMintStatus(3);
            } else {
                setMintStatus(2);
            }

        } else {
            setActiveProject(null)
        }

        return () => {
            setActiveProject(null)
        }
    }, [activeProject]);

    if (!activeProject) {
        return <PageNotFound/>
    }

    return <HeaderFooter isFixedHeader={false} isFixedFooter={true}>
        <div className="flex flex-col">
            <section className="flex w-full max-w-[1350px] m-auto gap-6 px-4 lg:px-0 pb-10">
                <RightSideBar />
            </section>
        </div>
    </HeaderFooter>

}