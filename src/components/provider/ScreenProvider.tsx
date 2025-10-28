import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface ScreenContextType {
    getMobileDetect: {
        isMobile,
        isDesktop,
        isAndroid,
        isIos,
        isSSR,
    };
}

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

const getMobileDetectData = (userAgent: NavigatorID['userAgent']) => {
    const isAndroid = () => Boolean(userAgent.match(/Android/i))
    const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i))
    const isOpera = () => Boolean(userAgent.match(/Opera Mini/i))
    const isWindows = () => Boolean(userAgent.match(/IEMobile/i))
    const isSSR = () => Boolean(userAgent.match(/SSR/i))
    const isMobile = () => Boolean(isAndroid() || isIos() || isOpera() || isWindows())
    const isDesktop = () => Boolean(!isMobile() && !isSSR())
    return {
        isMobile,
        isDesktop,
        isAndroid,
        isIos,
        isSSR,
    }
}

export function ScreenProvider({ children }: { children: React.ReactNode }) {
    const { pathname } = useLocation();
    const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent

    const [getMobileDetect] = useState(() => getMobileDetectData(userAgent));

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, [pathname]);

    return (
        <ScreenContext.Provider value={{ getMobileDetect }}>
            {children}
        </ScreenContext.Provider>
    );
}

export const useScreen = () => {
    const context = useContext(ScreenContext);
    if (context === undefined) {
        throw new Error('useScreen must be used within a ScreenProvider');
    }
    return context;
};
