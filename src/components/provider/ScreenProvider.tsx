import { createContext, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScreenContext = createContext<void>(undefined);

export function ScreenProvider({ children }: { children: React.ReactNode }) {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, [pathname]);

    return (
        <ScreenContext.Provider value={undefined}>
            {children}
        </ScreenContext.Provider>
    );
}

export const useScreen = () => useContext(ScreenContext);
