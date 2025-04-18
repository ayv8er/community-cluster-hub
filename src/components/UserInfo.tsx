import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';

export default function UserInfo({ 
  clusterName, 
  setClusterName 
}: { 
  clusterName: string | null, 
  setClusterName: (clusterName: string | null) => void 
}) {
  const [showConnectors, setShowConnectors] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { connect, connectors, isPending } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setMounted(true);
  }, []);

  const WalletOptions = () => {
    return (
      <div className="flex flex-col gap-2 mt-2">
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="rounded-none px-4 py-2 bg-blue-900 text-white hover:bg-blue-950"
          >
            Connect with {connector.name}
          </button>
        ))}
      </div>
    );
  }

  const handleDisconnect = () => {
    setClusterName(null);
    disconnect();
  }

  return (
    <>
      <span 
        onClick={() => window.open("https://testnet.clusters.xyz/community/camp")}
        className="select-none hover:cursor-pointer"
      >
        <h1 className="text-2xl font-bold">Camp Community Hub</h1>
      </span>
      {mounted && isConnected ? (
        <>
          <p className="text-sm font-mono">
            Connected: {address}
            {clusterName && (
              <>
                <br />
                <span
                  onClick={() => window.open(`https://testnet.clusters.xyz/${clusterName}`)}
                  className="hover:cursor-pointer"
                >
                  Community Name: {clusterName}
                </span>
              </>
            )}
          </p>
          <button
            onClick={handleDisconnect}
            className="rounded-none px-4 py-2 bg-blue-900 text-white hover:bg-blue-950"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <p className="max-w-md text-center">
            {!mounted ? 'Loading...' : 'Login via Para to claim your community name.'}
          </p>
          {mounted && (
            <>
              <button
                onClick={() => setShowConnectors(!showConnectors)}
                className="rounded-none px-4 py-2 bg-blue-900 text-white hover:bg-blue-950"
              >
                Login Options
              </button>
              {showConnectors && <WalletOptions />}
            </>
          )}
        </>
      )}
    </>
  )
}