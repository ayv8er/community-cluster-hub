import { useAccount } from 'wagmi';

export default function ClaimModalButton({ 
  handleClaimName, 
  isClaiming,
  isAvailable,
  isChecking
}: { 
  handleClaimName: () => void, 
  isClaiming: boolean,
  isAvailable: boolean | null,
  isChecking: boolean
}) {
  const { address } = useAccount();

  return (
    <button
      className={`rounded-none px-4 py-2 bg-blue-900 text-white hover:bg-blue-950 ${
        isAvailable ? "hover:cursor-pointer" : "hover:cursor-not-allowed"
      }`}
      onClick={handleClaimName}
      disabled={address ? (!isAvailable || isChecking || isClaiming) : false}
    >
      {isClaiming ? "Claiming..." : "Claim"}
    </button>
  )
}