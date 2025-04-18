"use client";

import { createConfig, http, WagmiProvider, cookieToInitialState } from "wagmi";
import { coinbaseWallet, walletConnect, metaMask } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { paraConnector } from "@getpara/wagmi-v2-integration";
import { OAuthMethod } from "@getpara/web-sdk";
import { sepolia } from "wagmi/chains";
import { type Chain } from "viem";
import { useState } from "react";
import { para } from "./para";

type Props = {
  children: React.ReactNode;
  cookies: string | null;
};

const testnetBasecamp = {
  id: 123420001114,
  name: "Basecamp Testnet",
  nativeCurrency: {
    name: "Basecamp Testnet",
    symbol: "tETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_BASECAMP_RPC_URL]
    }
  }
} as const satisfies Chain;

const wagmiConfig = createConfig({
  chains: [sepolia, testnetBasecamp],
  connectors: [
    paraConnector({
      para: para,
      chains: [sepolia, testnetBasecamp],
      appName: "Basecamp",
      options: {},
      nameOverride: "Basecamp",
      idOverride: "basecamp",
      oAuthMethods: Object.values(OAuthMethod),
      disableEmailLogin: false,
      disablePhoneLogin: true,
      onRampTestMode: false
    }),
    metaMask(),
    coinbaseWallet({
      appName: "Basecamp",
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      metadata: {
        name: "Basecamp",
        description: "Basecamp Login",
        url: "https://basecamp.vercel.app",
        icons: ["https://your-icon-url.png"]
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
    [testnetBasecamp.id]: http(process.env.NEXT_PUBLIC_BASECAMP_RPC_URL),
  },
});

export default function Provider({ children, cookies }: Props) {

  const initialState = cookieToInitialState(wagmiConfig, cookies);

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        retry: false,
        refetchOnWindowFocus: true,
        gcTime: 0,
      },
    },
  }));

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};