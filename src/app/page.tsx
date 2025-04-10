"use client";

import { useEffect, useState } from "react";
import { 
  AuthLayout, 
  ExternalWallet, 
  OAuthMethod, 
  ParaModal,
} from "@getpara/react-sdk";

import { WalletDisplay } from "../components/WalletDisplay";
import { ClusterDisplay } from "../components/ClusterDisplay";
import { para } from "../client/para";
import "@getpara/react-sdk/styles.css";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wallet, setWallet] = useState<string>("");
  const [error, setError] = useState<string>("");
    
  const handleCheckIfAuthenticated = async () => {
    setIsLoading(true);
    setError("");
    try {
      const isAuthenticated = await para.isFullyLoggedIn();
      setIsConnected(isAuthenticated);
      
      if (isAuthenticated) {
        const wallets = Object.values(para.getWallets());
        if (wallets?.length) {
          console.log('web2 login', wallets[0].address)
          setWallet(wallets[0].address || "unknown");
        } else {
          const externalWalletAddress = Object.keys(para.externalWallets)[0];
          if (externalWalletAddress) {
            console.log('wallet connect', externalWalletAddress)
            setWallet(externalWalletAddress);
          }
        }
      }
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during authentication");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleCheckIfAuthenticated();
  }, []);

  const handleOpenParaModal = () => {
    setIsOpen(true);
  };

  const handleCloseParaModal = async () => {
    handleCheckIfAuthenticated();
    setIsOpen(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">

      <h1 className="text-2xl font-bold">Community Hub</h1>

      {
        !isConnected && (
          <p className="max-w-md text-center">
            Login via Para to claim your community name.
          </p>
        )
      }

      {isConnected && <WalletDisplay walletAddress={wallet} />}

      <button
        disabled={isLoading}
        onClick={handleOpenParaModal}
        className="rounded-none px-4 py-2 bg-blue-900 text-white hover:bg-blue-950">
        {wallet ? "Open Para Modal" : "Login"}
      </button>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <ParaModal
        para={para}
        isOpen={isOpen}
        onClose={handleCloseParaModal}
        appName="Community Hub"
        oAuthMethods={[OAuthMethod.GOOGLE]}
        disableEmailLogin={false}
        disablePhoneLogin={true}
        authLayout={[AuthLayout.AUTH_CONDENSED, AuthLayout.EXTERNAL_CONDENSED]}
        externalWallets={[
          ExternalWallet.METAMASK,
          ExternalWallet.COINBASE,
          ExternalWallet.RAINBOW,
          ExternalWallet.RABBY,
        ]}
        onRampTestMode={false}
        theme={{
          foregroundColor: "#2D3648",
          backgroundColor: "#FFFFFF",
          accentColor: "#0066CC",
          darkForegroundColor: "#E8EBF2",
          darkBackgroundColor: "#1A1F2B",
          darkAccentColor: "#4D9FFF",
          mode: "light",
          borderRadius: "none",
          font: "Inter",
        }}
        recoverySecretStepEnabled={true}
        twoFactorAuthEnabled={false}
      />

      {isConnected ? <ClusterDisplay walletAddress={wallet} /> : null}
    </main>
  );
}