import {useNavigate} from "react-router-dom";
import projectData from "../../data/project-data.json";

function IconForFund(icon: string) {
    if (icon === "raised") {
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10.0001 18.3333C8.8473 18.3333 7.76397 18.1144 6.75008 17.6766C5.73619 17.2388 4.85425 16.6452 4.10425 15.8958C3.35425 15.1463 2.76064 14.2644 2.32342 13.25C1.88619 12.2355 1.6673 11.1522 1.66675 9.99996C1.66619 8.84774 1.88508 7.7644 2.32342 6.74996C2.76175 5.73552 3.35536 4.85357 4.10425 4.10413C4.85314 3.35468 5.73508 2.76107 6.75008 2.32329C7.76508 1.88551 8.84842 1.66663 10.0001 1.66663C11.1517 1.66663 12.2351 1.88551 13.2501 2.32329C14.2651 2.76107 15.147 3.35468 15.8959 4.10413C16.6448 4.85357 17.2387 5.73552 17.6776 6.74996C18.1165 7.7644 18.3351 8.84774 18.3334 9.99996C18.3317 11.1522 18.1129 12.2355 17.6767 13.25C17.2406 14.2644 16.647 15.1463 15.8959 15.8958C15.1448 16.6452 14.2629 17.2391 13.2501 17.6775C12.2373 18.1158 11.154 18.3344 10.0001 18.3333ZM10.0001 16.6666C11.8612 16.6666 13.4376 16.0208 14.7292 14.7291C16.0209 13.4375 16.6667 11.8611 16.6667 9.99996C16.6667 8.13885 16.0209 6.56246 14.7292 5.27079C13.4376 3.97913 11.8612 3.33329 10.0001 3.33329C8.13897 3.33329 6.56258 3.97913 5.27092 5.27079C3.97925 6.56246 3.33342 8.13885 3.33342 9.99996C3.33342 11.8611 3.97925 13.4375 5.27092 14.7291C6.56258 16.0208 8.13897 16.6666 10.0001 16.6666ZM10.0001 15C8.61119 15 7.43064 14.5138 6.45842 13.5416C5.48619 12.5694 5.00008 11.3888 5.00008 9.99996C5.00008 8.61107 5.48619 7.43052 6.45842 6.45829C7.43064 5.48607 8.61119 4.99996 10.0001 4.99996C11.389 4.99996 12.5695 5.48607 13.5417 6.45829C14.514 7.43052 15.0001 8.61107 15.0001 9.99996C15.0001 11.3888 14.514 12.5694 13.5417 13.5416C12.5695 14.5138 11.389 15 10.0001 15ZM10.0001 13.3333C10.9167 13.3333 11.7015 13.0069 12.3542 12.3541C13.007 11.7013 13.3334 10.9166 13.3334 9.99996C13.3334 9.08329 13.007 8.29857 12.3542 7.64579C11.7015 6.99302 10.9167 6.66663 10.0001 6.66663C9.08342 6.66663 8.29869 6.99302 7.64592 7.64579C6.99314 8.29857 6.66675 9.08329 6.66675 9.99996C6.66675 10.9166 6.99314 11.7013 7.64592 12.3541C8.29869 13.0069 9.08342 13.3333 10.0001 13.3333ZM10.0001 11.6666C9.54175 11.6666 9.14953 11.5036 8.82342 11.1775C8.4973 10.8513 8.33397 10.4588 8.33342 9.99996C8.33286 9.54107 8.49619 9.14885 8.82342 8.82329C9.15064 8.49774 9.54286 8.3344 10.0001 8.33329C10.4573 8.33218 10.8498 8.49552 11.1776 8.82329C11.5054 9.15107 11.6684 9.54329 11.6667 9.99996C11.6651 10.4566 11.502 10.8491 11.1776 11.1775C10.8531 11.5058 10.4606 11.6688 10.0001 11.6666Z" fill="#D4C3C3"/>
        </svg>
    } else if (icon === "days") {
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10.0001 1.66663C14.6026 1.66663 18.3334 5.39746 18.3334 9.99996C18.3334 14.6025 14.6026 18.3333 10.0001 18.3333C5.39758 18.3333 1.66675 14.6025 1.66675 9.99996C1.66675 5.39746 5.39758 1.66663 10.0001 1.66663ZM10.0001 3.33329C8.23197 3.33329 6.53628 4.03567 5.28604 5.28591C4.03579 6.53616 3.33341 8.23185 3.33341 9.99996C3.33341 11.7681 4.03579 13.4638 5.28604 14.714C6.53628 15.9642 8.23197 16.6666 10.0001 16.6666C11.7682 16.6666 13.4639 15.9642 14.7141 14.714C15.9644 13.4638 16.6667 11.7681 16.6667 9.99996C16.6667 8.23185 15.9644 6.53616 14.7141 5.28591C13.4639 4.03567 11.7682 3.33329 10.0001 3.33329ZM10.0001 4.99996C10.2042 4.99999 10.4012 5.07492 10.5537 5.21056C10.7063 5.34619 10.8037 5.53308 10.8276 5.73579L10.8334 5.83329V9.65496L13.0892 11.9108C13.2387 12.0608 13.3255 12.262 13.3319 12.4736C13.3384 12.6852 13.2641 12.8914 13.124 13.0502C12.984 13.209 12.7888 13.3085 12.578 13.3286C12.3673 13.3487 12.1567 13.2878 11.9892 13.1583L11.9109 13.0891L9.41091 10.5891C9.2814 10.4595 9.19822 10.2908 9.17425 10.1091L9.16675 9.99996V5.83329C9.16675 5.61228 9.25455 5.40032 9.41083 5.24404C9.56711 5.08776 9.77907 4.99996 10.0001 4.99996Z" fill="#D4C3C3"/>
        </svg>
    } else if (icon === "funded") {
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2.5C11.6 2.5 13.0833 3.00083 14.3 3.855L10 10V2.5Z" fill="#D4C3C3"/>
            <path d="M2.5 10C2.5 10.9849 2.69399 11.9602 3.0709 12.8701C3.44781 13.7801 4.00026 14.6069 4.6967 15.3033C5.39314 15.9997 6.21993 16.5522 7.12987 16.9291C8.03982 17.306 9.01509 17.5 10 17.5C10.9849 17.5 11.9602 17.306 12.8701 16.9291C13.7801 16.5522 14.6069 15.9997 15.3033 15.3033C15.9997 14.6069 16.5522 13.7801 16.9291 12.8701C17.306 11.9602 17.5 10.9849 17.5 10C17.5 8.01088 16.7098 6.10322 15.3033 4.6967C13.8968 3.29018 11.9891 2.5 10 2.5C8.01088 2.5 6.10322 3.29018 4.6967 4.6967C3.29018 6.10322 2.5 8.01088 2.5 10Z" stroke="#D4C3C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    } else if (icon === "backers") {
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9.99992 3.33337C10.884 3.33337 11.7318 3.68456 12.3569 4.30968C12.9821 4.93481 13.3333 5.78265 13.3333 6.66671C13.3333 7.55076 12.9821 8.39861 12.3569 9.02373C11.7318 9.64885 10.884 10 9.99992 10C9.11586 10 8.26802 9.64885 7.6429 9.02373C7.01777 8.39861 6.66659 7.55076 6.66659 6.66671C6.66659 5.78265 7.01777 4.93481 7.6429 4.30968C8.26802 3.68456 9.11586 3.33337 9.99992 3.33337ZM9.99992 5.00004C9.55789 5.00004 9.13397 5.17564 8.82141 5.4882C8.50885 5.80076 8.33325 6.22468 8.33325 6.66671C8.33325 7.10873 8.50885 7.53266 8.82141 7.84522C9.13397 8.15778 9.55789 8.33337 9.99992 8.33337C10.4419 8.33337 10.8659 8.15778 11.1784 7.84522C11.491 7.53266 11.6666 7.10873 11.6666 6.66671C11.6666 6.22468 11.491 5.80076 11.1784 5.4882C10.8659 5.17564 10.4419 5.00004 9.99992 5.00004ZM9.99992 10.8334C12.2249 10.8334 16.6666 11.9417 16.6666 14.1667V16.6667H3.33325V14.1667C3.33325 11.9417 7.77492 10.8334 9.99992 10.8334ZM9.99992 12.4167C7.52492 12.4167 4.91659 13.6334 4.91659 14.1667V15.0834H15.0833V14.1667C15.0833 13.6334 12.4749 12.4167 9.99992 12.4167Z" fill="#D4C3C3"/>
        </svg>
    }
    return
}

function Card({project}) {
    const navigate = useNavigate();
    const data = project.data;

    const heroSection = data.find((e)=> e.type === "hero_section")?.data;
    const projectOverview = data.find((e)=> e.type === "project_overview")?.data;

    if (!heroSection || !projectOverview) {
        return null;
    }

    return <div onClick={() => {
            navigate(`/project/${project.id}`)
        }} className="self-stretch p-4 bg-bg border border-[#ffffff33] inline-flex flex-col justify-start items-start gap-2 text-white cursor-pointer">
        <div className="w-full">
            <img loading="lazy" className="w-full h-40 rounded-sm object-cover" src={heroSection.smallImage} alt={""}/>
        </div>

        <div
            className="self-stretch pt-4 border-t border-t-[#ffffff4d] flex flex-col justify-start items-start gap-3">
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="justify-start text-high-emphasis text-xl font-bold leading-normal text-[#D4C3C3]">
                    {heroSection.name}
                </div>
                <div
                    className="justify-start text-xs font-normal uppercase text-[#EFEFEF]">
                    By {heroSection.author}
                </div>

                <div className="inline-flex justify-start items-center gap-2">
                    {heroSection.category.map((e)=> {
                        return <div>
                           <span className={"px-2 py-1 w-fit text-[12px] rounded-xl azeret-mono leading-[18px] border border-[#ffffff4d]"}>
                                {e}
                            </span>
                        </div>
                    })}
                </div>
                <div
                    className="self-stretch justify-start text-medium-emphasis/90 text-base font-normal leading-normal  text-[#d4c3c3e6] line-clamp-4">
                    {projectOverview.loglineText}
                </div>
            </div>

            <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="self-stretch h-2 relative bg-[#1F1F23] overflow-hidden">
                    <div className="w-full h-2 left-0 top-0 absolute bg-[#F1476A]"></div>
                </div>

                <div
                    className="grid grid-cols-2 gap-y-[16px] items-center justify-between self-stretch">
                    {heroSection.fundingInProgress.map((funding: any, index: number) => {
                        return <div style={{
                            justifySelf: (index % 2 === 0) ? "start" : "end"
                        }}
                                    className="flex gap-2 flex-nowrap items-start">
                            <div>
                                {IconForFund(funding.type)}
                            </div>
                            <span
                                className="h-[21px] shrink-0 basis-auto  text-[14px] font-medium leading-[21px] text-[#f2f2f2] whitespace-nowrap">{funding.text}</span>
                        </div>
                    })}
                </div>

            </div>
        </div>
    </div>
}

export default function FeatureProject() {
    return <section className={"max-w-[1350px] mx-auto py-[65px] px-4 lg:px-0"}>
        <h3 className={"text-[#D4C3C3] font-semibold leading-[44px] text-[40px]"}>Featured Projects</h3>
        <p className={"text-[#d4c3c3e6] leading-[27px] text-[18px] pt-[16px]"}>
            Discover the most promising projects backed by our community
        </p>

        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] pt-[56px]"}>
            {projectData.map((project, index) => {
                return <Card project={project} key={index}/>
            })}
        </div>

        {(projectData?.length > 6) && <div className={"flex justify-center pt-[24px] w-full"}>
            <button
                className={"uppercase p-3 border-[1px] border-[#fff9] text-[#EFEFEF] text-[12px] font-medium leading-[14px]"}>
                Load more
            </button>
        </div>}
    </section>
}