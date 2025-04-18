import { useAccount } from 'wagmi';
import { useState, useEffect, useCallback } from "react";
import useDebounce from "../hooks/useDebounce";
import ClaimModalInput from "./ClaimModalInput";
import ClaimModalButton from "./ClaimModalButton";

export default function ClaimModal({ setClusterName }: { setClusterName: (name: string | null) => void }) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimName, setClaimName] = useState("");

  const debouncedClaimName = useDebounce(claimName, 500);
  const { address } = useAccount();

  const checkNameAvailability = useCallback(async (name: string) => {
    if (!name) {
      setIsAvailable(null);
      return;
    }
    setIsChecking(true);
    try {
      const response = await fetch(`https://api.clusters.xyz/v1/names/community/camp/check/${name}?testnet=true`);
      const data = await response.json();
      if (data.isAvailable) {
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
      }
    } catch (error) {
      console.error('Error checking name availability:', error);
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkNameAvailability(debouncedClaimName);
  }, [debouncedClaimName, checkNameAvailability]);

  const handleClaimName = useCallback(async () => {
    setIsClaiming(true);
    try {
      const response = await fetch(`/api/cluster/register_community_name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, name: claimName }),
      });
      const data = await response.json();
      if (data.success) {
        setClusterName(`camp/${claimName}`);
        setClaimName("");
      } else {
        console.error("Error claiming name:", data);
        setClusterName(null);
      }
    } catch (error) {
      console.error("Error claiming name:", error);
    } finally {
      setIsClaiming(false);
    }
  }, [address, claimName, setClusterName, setClaimName]);

  return (
    <div className="text-center flex flex-col items-center justify-center gap-6 p-8">
      <h2 className="text-xl font-bold">Claim your community name!</h2>
      <ClaimModalInput 
        claimName={claimName}
        setClaimName={setClaimName}
        isClaiming={isClaiming}
        isChecking={isChecking}
        isAvailable={isAvailable}
      />
      <ClaimModalButton 
        handleClaimName={handleClaimName}
        isClaiming={isClaiming}
        isAvailable={isAvailable}
        isChecking={isChecking}
      />
    </div>
  );
}