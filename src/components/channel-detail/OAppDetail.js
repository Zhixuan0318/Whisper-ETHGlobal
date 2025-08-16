import supportedBlockchain from "@/data/supportedBlockchain.json";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function OAppDetail({ channel }) {
  const { address: walletAddress } = useAccount();
  const [copied, setCopied] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployed, setDeployed] = useState(channel.oappDeployed);
  const [sourceOApp, setSourceOApp] = useState(channel.sourceOApp);
  const [destOApp, setDestOApp] = useState(channel.destinationOApp);

  const destChainData = supportedBlockchain[channel.destinationChain];
  const destExplorerBase = destChainData?.Explorer;

  const formatAddress = (address) =>
    address ? `${address.slice(0, 5)}...${address.slice(-5)}` : "";

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(""), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const AddressRow = ({ address, explorerUrl }) => (
    <div className="flex items-center gap-2 text-md text-gray-500 mt-1">
      <span>{formatAddress(address)}</span>
      <button onClick={() => handleCopy(address)}>
        <img
          src={copied === address ? "/copied.png" : "/copy.png"}
          alt="Copy"
          className="w-4 h-4 hover:opacity-80 cursor-pointer"
        />
      </button>
      <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
        <img src="/explorer.png" alt="Explorer" className="w-4 h-4" />
      </a>
    </div>
  );

  const handleDeploy = async () => {
    if (!walletAddress) return;
    setIsDeploying(true);

    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          channelId: channel.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSourceOApp(data.sourceOApp);
        setDestOApp(data.destinationOApp);
        setDeployed(true);
      } else {
        console.error("Deployment failed:", data.error);
      }
    } catch (err) {
      console.error("Deployment error:", err);
    } finally {
      setIsDeploying(false);
    }
  };

  // ✅ Fetch latest contract data if already deployed
  useEffect(() => {
    const fetchLatestOAppAddresses = async () => {
      if (!walletAddress || !channel.id || !channel.oappDeployed) return;

      try {
        const res = await fetch(
          `/api/channel?walletAddress=${walletAddress}&channelId=${channel.id}`
        );
        const data = await res.json();

        if (res.ok) {
          setSourceOApp(data.sourceOApp);
          setDestOApp(data.destinationOApp);
        } else {
          console.warn("Could not refresh deployed data:", data.error);
        }
      } catch (err) {
        console.error("Failed to fetch channel info:", err);
      }
    };

    fetchLatestOAppAddresses();
  }, [walletAddress, channel.id, channel.oappDeployed]);

  return (
    <div className="mt-10">
      {/* Header with Button */}
      <div className="flex items-center gap-3 mb-4">
        <h3
          className="text-lg font-semibold text-gray-400"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          OAPP DEPLOYMENT
        </h3>
        <button
          onClick={handleDeploy}
          disabled={deployed || isDeploying}
          className={`text-md mb-1 ml-2 font-medium rounded-xl px-8 py-2 transition
      ${
        deployed
          ? "bg-gray-200 text-gray-700 cursor-not-allowed"
          : isDeploying
          ? "bg-gray-600 text-white cursor-not-allowed"
          : "bg-black text-white hover:scale-102 cursor-pointer"
      }`}
        >
          {deployed
            ? "Deployed"
            : isDeploying
            ? "Deploying..."
            : "One-Click Deploy"}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sender OApp */}
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/senderOApp.png"
              alt="Sender OApp"
              className="w-12 h-12"
            />
          </div>
          <p
            className="text-xl font-semibold text-gray-800"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Sender OApp
          </p>
          {!deployed ? (
            <p className="text-md text-gray-400 mt-1">Pending Deployment</p>
          ) : (
            <AddressRow
              address={sourceOApp}
              explorerUrl={`https://hashscan.io/testnet/contract/${sourceOApp}`}
            />
          )}
        </div>

        {/* Destination OApp */}
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/destOApp.png"
              alt="Destination OApp"
              className="w-12 h-12"
            />
          </div>
          <p
            className="text-xl font-semibold text-gray-800"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Destination OApp
          </p>
          {!deployed ? (
            <p className="text-md text-gray-400 mt-1">Pending Deployment</p>
          ) : (
            <AddressRow
              address={destOApp}
              explorerUrl={`${destExplorerBase}/address/${destOApp}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
