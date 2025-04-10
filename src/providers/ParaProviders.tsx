"use client";

import {
  ParaEvmProvider,
  coinbaseWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
} from "@getpara/evm-wallet-connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia, baseSepolia } from "wagmi/chains";
import { para } from "../client/para";

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export const ParaProviders: React.FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ParaEvmProvider
        config={{
          projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
          appName: "Community Cluster",
          chains: [sepolia, baseSepolia],
          wallets: [metaMaskWallet, rainbowWallet, coinbaseWallet, rabbyWallet],
          para: para,
        }}>
        {children}
      </ParaEvmProvider>
    </QueryClientProvider>
  );
};