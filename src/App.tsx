import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css'
import '@rainbow-me/rainbowkit/styles.css';
import {RainbowKitProvider} from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import ProjectCard from "./components/project/ProjectCard.tsx";
import {ScreenProvider} from "./components/provider/ScreenProvider.tsx";
import PageNotFound from "./NotFound.tsx";
import { wagmiConfig } from './utils/wagmi.ts';
import chains from "./utils/wagmi.ts";
import { Toaster } from 'sonner';
import NFTPortfolioDashboard from "./components/project/ProfilePage.tsx";
import { WalletProvider } from "./components/provider/WalletProvider.tsx";

const queryClient = new QueryClient();

function App() {

  return (
        <WagmiConfig config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
              <RainbowKitProvider chains={chains}>
                  <WalletProvider>
                      <BrowserRouter>
                          <ScreenProvider>
                              <Routes>
                                  <Route path="/project/:id" element={<ProjectCard />} />
                                  <Route path="*" element={<PageNotFound />} />
                                  <Route path="/profile" element={<NFTPortfolioDashboard />} />
                              </Routes>
                          </ScreenProvider>
                      </BrowserRouter>
                  </WalletProvider>
                  <Toaster position="top-right" richColors closeButton theme="dark" />
              </RainbowKitProvider>
          </QueryClientProvider>
      </WagmiConfig>
  )
}

export default App
