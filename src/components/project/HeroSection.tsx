import {useEffect, useRef, useState} from "react";
import {useLocation} from "react-router-dom";
import {toast} from "sonner";

function buildShareLinks(fullUrl: string) {
    const u = encodeURIComponent(fullUrl);
    const t = encodeURIComponent("");

    return {
        twitter: `https://twitter.com/intent/tweet?url=${u}${t ? `&text=${t}` : ""}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
        telegram: `https://t.me/share/url?url=${u}${t ? `&text=${t}` : ""}`,
        // Discord: no official public "share" URL — fallback below
    };
}

function ShareMenu() {
    const [open, setOpen] = useState(false);

    const location = useLocation();


    return (
        <div onMouseEnter={() => setOpen(true)}
             onMouseLeave={() => setOpen(false)}
             className="relative inline-block text-left">
            <button
                className="flex gap-1.5 items-center md:border md:border-white/40 md:p-[10px] w-fit cursor-pointer transition"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                >
                    <path
                        d="M14.167 18.3333C13.4725 18.3333 12.8823 18.0903 12.3962 17.6042C11.91 17.1181 11.667 16.5278 11.667 15.8333C11.667 15.75 11.6878 15.5556 11.7295 15.25L5.87533 11.8333C5.6531 12.0417 5.39616 12.205 5.10449 12.3233C4.81283 12.4417 4.50033 12.5006 4.16699 12.5C3.47255 12.5 2.88227 12.2569 2.39616 11.7708C1.91005 11.2847 1.66699 10.6944 1.66699 10C1.66699 9.30556 1.91005 8.71528 2.39616 8.22917C2.88227 7.74306 3.47255 7.5 4.16699 7.5C4.50033 7.5 4.81283 7.55917 5.10449 7.67751C5.39616 7.79584 5.6531 7.95889 5.87533 8.16667L11.7295 4.75C11.7017 4.65278 11.6845 4.55917 11.6778 4.46917C11.6712 4.37917 11.6675 4.27834 11.667 4.16667C11.667 3.47223 11.91 2.88195 12.3962 2.39584C12.8823 1.90973 13.4725 1.66667 14.167 1.66667C14.8614 1.66667 15.4517 1.90973 15.9378 2.39584C16.4239 2.88195 16.667 3.47223 16.667 4.16667C16.667 4.86112 16.4239 5.45139 15.9378 5.9375C15.4517 6.42362 14.8614 6.66667 14.167 6.66667C13.8337 6.66667 13.5212 6.60751 13.2295 6.48917C12.9378 6.37084 12.6809 6.20778 12.4587 6L6.60449 9.41667C6.63227 9.51389 6.64977 9.60778 6.65699 9.69834C6.66421 9.78889 6.66755 9.88945 6.66699 10C6.66644 10.1106 6.6631 10.2114 6.65699 10.3025C6.65088 10.3936 6.63338 10.4872 6.60449 10.5833L12.4587 14C12.6809 13.7917 12.9378 13.6286 13.2295 13.5108C13.5212 13.3931 13.8337 13.3339 14.167 13.3333C14.8614 13.3333 15.4517 13.5764 15.9378 14.0625C16.4239 14.5486 16.667 15.1389 16.667 15.8333C16.667 16.5278 16.4239 17.1181 15.9378 17.6042C15.4517 18.0903 14.8614 18.3333 14.167 18.3333Z"
                        fill="#D4C3C3"
                    />
                </svg>

                <span
                    className="shrink-0 basis-auto text-[12px] font-medium leading-[14px] text-[#efefef] uppercase whitespace-nowrap">
                  share
                </span>
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute right-0 py-0.5 w-[200px] bg-[#000000] border border-white/20 shadow-lg flex flex-col text-sm text-white z-50">
                    <button onClick={() => {
                        const fullUrl = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
                        navigator.clipboard.writeText(fullUrl)
                        toast.success('Copied!')
                    }} className="flex border-b border-b-[#ffffff1a] gap-1.5 items-center px-4 py-3.5 hover:bg-white/10 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M18 -6.10352e-05H8C6.897 -6.10352e-05 6 0.896939 6 1.99994V5.99994H2C0.897 5.99994 0 6.89694 0 7.99994V17.9999C0 19.1029 0.897 19.9999 2 19.9999H12C13.103 19.9999 14 19.1029 14 17.9999V13.9999H18C19.103 13.9999 20 13.1029 20 11.9999V1.99994C20 0.896939 19.103 -6.10352e-05 18 -6.10352e-05ZM2 17.9999V7.99994H12L12.002 17.9999H2ZM18 11.9999H14V7.99994C14 6.89694 13.103 5.99994 12 5.99994H8V1.99994H18V11.9999Z"
                                fill="white" fillOpacity="0.8"/>
                        </svg>
                        <span>
                            Copy Link
                        </span>
                    </button>

                    <button
                        onClick={() => {
                            const fullUrl = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
                            const links = buildShareLinks(fullUrl);
                            window.open(links.twitter, "_blank");
                        }}
                        className="flex border-b border-b-[#ffffff1a] gap-1.5 items-center px-4 py-3.5 hover:bg-white/10 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M20 19.9999L13.743 10.6748L13.7537 10.6836L19.3953 3.99994H17.51L12.9142 9.43994L9.26456 3.99994H4.32014L10.1617 12.7061L10.161 12.7054L4 19.9999H5.88528L10.9948 13.9476L15.0556 19.9999H20ZM8.51756 5.45448L17.2966 18.5454H15.8026L7.01645 5.45448H8.51756Z"
                                fill="white" fillOpacity="0.8"/>
                        </svg>
                        <span>
                            Twitter
                        </span>
                    </button>

                    {/*<button  className="flex border-b border-b-[#ffffff1a] gap-1.5 items-center px-4 py-3.5 hover:bg-white/10 cursor-pointer">*/}
                    {/*    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">*/}
                    {/*        <g clipPath="url(#clip0_353_2590)">*/}
                    {/*            <path d="M13.5555 2.81845C12.5198 2.33386 11.4123 1.98169 10.2546 1.78116C10.1124 2.03823 9.94624 2.384 9.83171 2.65906C8.60095 2.47397 7.38151 2.47397 6.17339 2.65906C6.05888 2.384 5.88899 2.03823 5.74553 1.78116C4.58649 1.98169 3.47779 2.33516 2.44208 2.82101C0.353048 5.97782 -0.213254 9.05621 0.0698976 12.0909C1.45545 13.1256 2.79823 13.7541 4.11834 14.1654C4.44428 13.7169 4.73498 13.24 4.9854 12.7374C4.50845 12.5562 4.05164 12.3325 3.62 12.0729C3.73451 11.9881 3.84652 11.8994 3.95474 11.8081C6.58742 13.0395 9.44789 13.0395 12.0491 11.8081C12.1586 11.8994 12.2706 11.9881 12.3838 12.0729C11.9509 12.3338 11.4929 12.5575 11.0159 12.7387C11.2664 13.24 11.5558 13.7181 11.883 14.1667C13.2044 13.7554 14.5484 13.1269 15.9339 12.0909C16.2662 8.57292 15.3664 5.5228 13.5555 2.81845ZM5.34407 10.2246C4.55377 10.2246 3.90565 9.48679 3.90565 8.58834C3.90565 7.68989 4.53993 6.95082 5.34407 6.95082C6.14823 6.95082 6.79633 7.68859 6.78249 8.58834C6.78374 9.48679 6.14823 10.2246 5.34407 10.2246ZM10.6598 10.2246C9.86948 10.2246 9.22136 9.48679 9.22136 8.58834C9.22136 7.68989 9.85562 6.95082 10.6598 6.95082C11.4639 6.95082 12.112 7.68859 12.0982 8.58834C12.0982 9.48679 11.4639 10.2246 10.6598 10.2246Z" fill="white" fillOpacity="0.8"/>*/}
                    {/*        </g>*/}
                    {/*        <defs>*/}
                    {/*            <clipPath id="clip0_353_2590">*/}
                    {/*                <rect width="16" height="16" fill="white" transform="translate(0.00195312 -9.15527e-05)"/>*/}
                    {/*            </clipPath>*/}
                    {/*        </defs>*/}
                    {/*    </svg>*/}
                    {/*    <span>*/}
                    {/*        Discord*/}
                    {/*    </span>*/}
                    {/*</button>*/}

                    <button onClick={() => {
                        const fullUrl = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
                        const links = buildShareLinks(fullUrl);
                        window.open(links.telegram, "_blank");
                    }}
                            className="flex border-b border-b-[#ffffff1a] gap-1.5 items-center px-4 py-3.5 hover:bg-white/10 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" viewBox="0 0 16 13" fill="none">
                            <path
                                d="M15.9564 1.18348L13.5419 12.2153C13.3597 12.9939 12.8847 13.1876 12.2096 12.8208L8.5307 10.1944L6.75554 11.8485C6.5591 12.0388 6.3948 12.198 6.01619 12.198L6.2805 8.56799L13.099 2.59879C13.3954 2.34272 13.0347 2.20084 12.6382 2.45691L4.20889 7.59908L0.579993 6.49867C-0.209363 6.2599 -0.22365 5.73392 0.744293 5.36711L14.9384 0.0692289C15.5956 -0.169539 16.1707 0.211106 15.9564 1.18348Z"
                                fill="white" fillOpacity="0.8"/>
                        </svg>
                        <span>
                            Telegram
                        </span>
                    </button>

                    <button onClick={() => {
                        const fullUrl = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
                        const links = buildShareLinks(fullUrl);
                        window.open(links.facebook, "_blank");
                    }} className="flex gap-1.5 items-center px-4 py-3.5 hover:bg-white/10 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M15.4738 12.9999L15.8886 10.1043H13.2948V8.22525C13.2948 7.43306 13.6572 6.66088 14.8188 6.66088H15.998V4.19556C15.998 4.19556 14.928 3.99994 13.9048 3.99994C11.7687 3.99994 10.3725 5.38681 10.3725 7.89744V10.1043H7.99805V12.9999H10.3725V19.9999H13.2948V12.9999H15.4738Z"
                                fill="white" fillOpacity="0.8"/>
                        </svg>
                        <span>
                            Facebook
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}

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

function Carousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const scrollRef = useRef<any>(null);

    const checkForScrollPosition = () => {
        if (!scrollRef.current) return;

        const {scrollLeft, scrollWidth, clientWidth} = scrollRef.current;

        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // -1 for precision
    };

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({left: -100, behavior: "smooth"});
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({left: 100, behavior: "smooth"});
        }
    };

    useEffect(() => {
        checkForScrollPosition(); // Initial check

        const el = scrollRef.current;
        if (!el) return;

        el.addEventListener("scroll", checkForScrollPosition);
        window.addEventListener("resize", checkForScrollPosition);

        return () => {
            el.removeEventListener("scroll", checkForScrollPosition);
            window.removeEventListener("resize", checkForScrollPosition);
        };
    }, []);


    return <div className="flex w-full items-center gap-[12px] md:gap-[18px] max-w-full overflow-scroll">
        {/* Left button */}
        <button onClick={scrollLeft}
                className={`p-2.5 border border-[#4D4D53] ${canScrollLeft ? "opacity-100" : "opacity-40"}  rounded-[8px] shrink-0`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                    d="M8.64632 14.6867L4.06299 10.1034L8.64632 5.52008M5.10466 10.1034L15.938 10.1034"
                    stroke="#D4C3C3"
                    strokeWidth="2"
                    strokeLinecap="square"
                />
            </svg>
        </button>

        <div ref={scrollRef}
             className="flex-1 overflow-scroll flex gap-[12px] md:gap-[18px] scrollbar-hide no-scrollbar">
            {[...Array(40)].map((_, index: number) => (
                <div key={index} onClick={() => {
                    setActiveIndex(index)
                }}
                     className={`w-[40px] shrink-0 rounded-[4px] ${activeIndex === index ? "border border-[#FFF]" : "border border-black"} overflow-hidden`}>
                    <img
                        className="h-[40px] w-[40px] object-cover overflow-hidden"
                        src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-15/2yZ2NLYt5W.png"
                        alt=""
                    />
                </div>
            ))}
        </div>

        <button onClick={scrollRight}
                className={`p-2.5 border border-[#4D4D53] ${canScrollRight ? "opacity-100" : "opacity-40"} rounded-[8px] shrink-0`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                    d="M11.3537 14.6867L15.937 10.1034L11.3537 5.52008M14.8953 10.1034L4.06201 10.1034"
                    stroke="#D4C3C3"
                    strokeWidth="2"
                    strokeLinecap="square"
                />
            </svg>
        </button>
    </div>
}

export default function HeroSection({data}: any) {
    return <div id={"hero-section"} className="flex w-full flex-col items-start gap-8">
        {/*<Carousel/>*/}

        <div className="flex flex-col gap-6 self-stretch">
            <div className={"grid grid-cols-1 md:grid-cols-2 gap-6"}>
                <img className={"w-full"}
                     src={data.image} alt={""}/>
                <div className={"flex flex-col gap-4"}>
                    <div className="flex flex-col items-start gap-4 self-stretch">
                        <div className="flex flex-nowrap items-center justify-between self-stretch">
                            <span
                                className="flex shrink-0 basis-auto items-start justify-center text-center text-[22px] md:text-[32px] font-bold leading-[35.2px] text-[#d4c3c3]">
                                {data.name}
                            </span>
                            <ShareMenu/>
                        </div>

                        <span
                            className="text-[16px] font-normal leading-6 text-[#d4c3c3]/90 text-left">
                            {data.description}
                        </span>

                        <div className="inline-flex justify-start items-center gap-2">
                            {
                                data.category.map((category: string, index: number) => {
                                    return <div key={index}
                                                className="px-2 py-1 w-fit text-[12px] rounded-xl azeret-mono leading-[18px] border border-[#ffffff4d]">
                                        {category}
                                    </div>
                                })
                            }
                        </div>
                    </div>

                    <div
                        className="flex w-full h-full p-4 flex-col justify-between items-start border-solid border border-[rgba(255,255,255,0.2)] mx-auto">
                        <div className="flex flex-col gap-[16px] items-start self-stretch shrink-0 ">
                            <div className="flex justify-between items-center self-stretch shrink-0 ">
                              <span
                                  className="azeret-mono shrink-0 basis-auto  text-[12px] font-normal leading-[14px] text-[#d4c3c3] relative text-left uppercase whitespace-nowrap">
                                NFT rarity
                              </span>
                                <span
                                    className="azeret-mono shrink-0 basis-auto  text-[12px] font-normal leading-[14px] text-[#d4c3c3] relative text-left uppercase whitespace-nowrap">
                            apy returns
                          </span>
                            </div>
                            <div className="flex flex-col gap-[12px] items-start self-stretch shrink-0 ">
                                <div className="flex justify-between items-center self-stretch shrink-0 ">
                                    <div className="flex w-[60px] gap-[6px] items-center shrink-0 ">
                                      <span
                                          className="shrink-0 basis-auto  text-[14px] font-semibold leading-[16.8px] text-[#fff] relative text-left capitalize whitespace-nowrap">
                                        Common
                                      </span>
                                    </div>
                                        <div
                                            className="flex w-[33px] flex-col gap-[6px] justify-center items-end shrink-0 ">
                                      <span
                                          className="shrink-0 basis-auto  text-[16px] font-bold leading-[24px] text-[#16a149] relative text-left">
                                        30%
                                      </span>
                                    </div>
                                </div>

                                <div
                                    className="self-stretch shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-21/6CmoOASpSN.png)] bg-cover bg-no-repeat relative z-[16]"/>
                            </div>
                        </div>
                        <div className={"w-full flex flex-col gap-2"}>
                            <div className="flex pt-[8px] pr-[16px] pb-[8px] pl-[16px] flex-col gap-[16px] justify-center items-center self-stretch shrink-0 flex-nowrap bg-[rgba(22,22,22,0.8)] border-solid border border-[rgba(255,255,255,0.1)]">
                                <div className="flex flex-col gap-[16px] self-stretch shrink-0">
                                    <div className="flex  gap-[5px] items-center">
                                        <span
                                            className=" shrink-0 basis-auto  text-[14px] font-normal leading-[15px] text-[#fff] relative text-le">
                                          Supported token:
                                        </span>
                                        <div className="flex  gap-[5px] items-center">
                                            <img src={"https://unlu-general.s3.ap-south-1.amazonaws.com/contest/USDC.png"}
                                                 className={'w-[20px] h-[20px]'} alt={""}/>

                                            <span
                                                className=" shrink-0 basis-auto  text-[14px] font-normal leading-[15px] text-[#fff] relative text-left">
                                        USDC
                                      </span>
                                        </div>
                                    </div>
                                    <div className="flex  gap-[5px] items-center ">
                                    <span
                                        className=" shrink-0 basis-auto  text-[14px] font-normal leading-[15px] text-[#fff] relative text-left">
                                      Supported chain:
                                    </span>
                                        <div className="flex  gap-[5px] items-center shrink-0 ">
                                            <img src={"https://unlu-general.s3.ap-south-1.amazonaws.com/contest/Base.png"}
                                                 className={'w-[20px] h-[20px]'} alt={""}/>

                                            <span
                                                className=" shrink-0 basis-auto  text-[14px] font-normal leading-[15px] text-[#fff] relative text-left">
                                        Base
                                      </span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="flex pt-[8px] pr-[16px] pb-[8px] pl-[16px] flex-col gap-[16px] text-[14px] justify-center items-center self-stretch shrink-0 flex-nowrap bg-[rgba(22,22,22,0.8)] border-solid border border-[rgba(255,255,255,0.1)]">
                                <p>Rarity of your minted NFT will be revealed once the project is closed!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="grid grid-cols-1 md:grid-cols-2 grow gap-6">
                <div
                    className="flex grow flex-col items-center justify-center gap-2 self-stretch border border-[#fff3] bg-[#000009] px-4 py-[50px]">
                    <div
                        className="flex flex-col items-start gap-4 self-stretch">
                        <span
                            className="shrink-0 basis-auto self-stretch text-[14px] font-normal leading-[16.8px] uppercase text-[#d4c3c3]">AI Project Rating</span>
                        <div
                            className="flex items-center gap-2 self-stretch">
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="33" viewBox="0 0 31 33" fill="none">
                                <path d="M31 16.5888C19.352 18.7284 17.6016 20.5095 15.3844 32.5C13.9807 24.2818 12.7305 20.8165 8.34825 18.7311C6.33799 17.7786 3.6611 17.1076 0 16.3904C11.6368 14.2689 13.3872 12.4878 15.5903 0.5C16.642 6.47714 17.549 9.92525 19.6871 12.1609C21.8311 14.4255 25.1577 15.4596 31 16.5888Z" fill="#F5AA6A"/>
                            </svg>
                            <span
                                className="shrink-0 basis-auto text-[32px] font-semibold leading-[52.8px] text-white whitespace-nowrap">{data.rating}</span>
                        </div>
                    </div>
                </div>

                <div
                    className="flex grow flex-col items-center justify-center gap-4 self-stretch border border-white/20 bg-[#000009] px-4 py-[40px]">
                    <div
                        className="flex flex-col items-start gap-4 self-stretch">
                        <span
                            className="text-[14px] font-normal leading-[16.8px] uppercase text-[#d4c3c3]">Funding status</span>
                        <div
                            className="flex flex-col flex-nowrap items-start gap-3 self-stretch">
                            <div
                                className="h-2 self-stretch bg-[#1f1f23] overflow-hidden">
                                <div className="h-2 w-[100%] bg-[#f1476a]"></div>
                            </div>

                            <div
                                className="flex flex-col flex-nowrap items-start gap-3 self-stretch">
                                <div
                                    className="grid grid-cols-2 gap-y-[16px] items-center justify-between self-stretch">
                                    {data.fundingInProgress.map((funding: any, index: number) => {
                                        return <div style={{
                                            justifySelf: (index % 2 === 0) ? "start" : "end"
                                        }}
                                                    className="flex gap-2 flex-nowrap items-start" key={index}>
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
                </div>
            </div>
        </div>
    </div>
}