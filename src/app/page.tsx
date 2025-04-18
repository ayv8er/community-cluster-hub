"use client";

import { useCallback, useEffect, useState } from "react";
import ClaimModal from "../components/ClaimModal";
import UserInfo from "../components/UserInfo";
import { useAccount } from "wagmi";
import "@getpara/react-sdk/styles.css";

export default function Home() {
  const [clusterName, setClusterName] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const fetchClusterName = useCallback(async () => {
    if (!address) return;
    try {
      const response = await fetch(`https://api.clusters.xyz/v1/names/address/${address}?testnet=true`);
      const data = await response.json();
      if (!data.clusterName) return;
      setClusterName(data.clusterName);
    } catch (error) {
      console.error('Error fetching cluster name:', error);
    }
  }, [address]);
  
  useEffect(() => {
    fetchClusterName();
  }, [fetchClusterName]);
  
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <UserInfo clusterName={clusterName} setClusterName={setClusterName} />
      {isConnected && !clusterName && <ClaimModal setClusterName={setClusterName} />}   
    </main>
  );
}