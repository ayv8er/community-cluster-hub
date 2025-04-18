import { useCallback } from "react";
import { useAccount, useSignMessage } from "wagmi";

export default function useAuthKey() {
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  
  const getAuthKey = useCallback(async () => {
    if (!address) throw new Error('No address found');

    try {
      const messageToSign = await fetch("https://api.clusters.xyz/v1/auth/message", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_CLUSTERS_API_KEY || "",
        },
      });

      if (!messageToSign.ok) {
        throw new Error('Failed to fetch message to sign');
      }

      const messageData = await messageToSign.json();

      if (!messageData.message) {
        throw new Error('No message to sign in the response');
      }

      const signature = await signMessageAsync({ message: messageData.message, account: address });

      const tokenResponse = await fetch("https://api.clusters.xyz/v1/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_CLUSTERS_API_KEY || "",
        },
        body: JSON.stringify({
          signature: signature,
          signingDate: messageData.signingDate,
          type: "evm",
          wallet: address,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get auth token');
      }

      const tokenData = await tokenResponse.json();

      return tokenData.token;
    } catch (error) {
      console.error("Error getting auth key:", error);
      return null;
    }
  }, [address, signMessageAsync]);

  return { getAuthKey };
}