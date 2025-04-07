import { useState, useEffect } from "react";

interface ClusterDisplayProps {
  walletAddress?: string;
}

export const ClusterDisplay = ({ walletAddress }: ClusterDisplayProps) => {
  const [communityName, setCommunityName] = useState("");
  const [claimName, setClaimName] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const fetchCampName = async () => {
    try {
      const response = await fetch(`https://api.clusters.xyz/v1/names/address/${walletAddress}`);
      const data = await response.json();
      if (data.walletName) {
        setCommunityName(data.walletName);
      }
    } catch (error) {
      console.error("Error fetching name:", error);
      setCommunityName("");
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    fetchCampName();
  }, [walletAddress])

  const handleClaimName = async () => {
    setIsClaiming(true);
    try {
      const response = await fetch(`/api/cluster`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress, name: claimName }),
      });
      const data = await response.json();
    } catch (error) {
      console.error("Error claiming name:", error);
    } finally {
      setIsClaiming(false);
      fetchCampName();
    }
  };

  return (
    <div className="text-center flex flex-col gap-2">
      {isFetching ? (
        <p>Loading your community name...</p>
      ) : communityName ? (
        <p>
          Your community name is: <strong>campnetwork/{communityName}</strong>
        </p>
      ) : (
        <>
          <h2 className="text-xl font-bold">Claim your community name!</h2>
          <input 
            className="rounded-none border border-gray-300 px-4 py-2 text-white" 
            type="text" 
            placeholder="Enter your community name" 
            value={claimName} 
            onChange={(e) => setClaimName(e.target.value)} 
            disabled={isClaiming}
          />
          <button
            className="rounded-none px-4 py-2 bg-blue-900 text-white hover:bg-blue-950 disabled:opacity-50"
            onClick={handleClaimName}
            disabled={isClaiming}>
            {isClaiming ? "Claiming..." : "Claim"}
          </button>
        </>
      )}
    </div>
  );
}