"use client";

import {
  ParaEvmProvider,
  coinbaseWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
} from "@getpara/evm-wallet-connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type Chain, sepolia, baseSepolia } from "wagmi/chains";
import { para } from "../client/para";

type Props = {
  children: React.ReactNode;
};

const camp: Chain = {
  id: 123420001114,
  name: "Basecamp",
  nativeCurrency: {
    decimals: 18,
    name: "Basecamp",
    symbol: "CAMP",
  },
  rpcUrls: {
    public: { http: ["https://rpc.basecamp.t.raas.gelato.cloud"] },
    default: { http: ["https://rpc.basecamp.t.raas.gelato.cloud"] },
  },
  blockExplorers: {
    default: { name: "Basecamp", url: "https://basecamp.cloud.blockscout.com/" },
  },
} as const satisfies Chain;

const queryClient = new QueryClient();

export const ParaProviders: React.FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ParaEvmProvider
        config={{
          projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
          appName: "Camp Cluster",
          chains: [camp, sepolia, baseSepolia],
          wallets: [metaMaskWallet, rainbowWallet, coinbaseWallet, rabbyWallet],
          para: para,
        }}>
        {children}
      </ParaEvmProvider>
    </QueryClientProvider>
  );
};