import { useCallback } from "react";

type ClaimModalInputProps = {
  claimName: string;
  setClaimName: (name: string) => void;
  isClaiming: boolean;
  isChecking: boolean;
  isAvailable: boolean | null;
}

export default function ClaimModalInput({ 
  claimName, 
  setClaimName, 
  isClaiming, 
  isChecking, 
  isAvailable 
}: ClaimModalInputProps) {
  
  const getAvailabilityMessage = useCallback(() => {
    if (!claimName) return null;
    if (isChecking) return "Checking availability...";
    if (isAvailable === null) return null;
    return isAvailable ? "✓ Name is available" : "✗ Name is already taken";
  }, [claimName, isChecking, isAvailable]);

  const getAvailabilityColor = useCallback(() => {
    if (!claimName || isChecking || isAvailable === null) return "text-white/50";
    return isAvailable ? "text-green-400" : "text-red-400";
  }, [claimName, isChecking, isAvailable]);

  return (
    <div className="flex flex-col gap-2">
      <input 
        className={`rounded-none border border-gray-300 px-4 py-2 text-white ${getAvailabilityColor()}`} 
        type="text" 
        placeholder="Enter name" 
        value={claimName} 
        onChange={(e) => setClaimName(e.target.value)} 
        disabled={isClaiming}
      />
      <p className={`text-sm ${getAvailabilityColor()}`}>{getAvailabilityMessage()}</p>
    </div>
  )
}