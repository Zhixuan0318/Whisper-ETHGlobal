"use client";

import supportedBlockchain from "@/data/supportedBlockchain.json";
import senderContractJson from "@/contracts/SourceOApp.json";
import receiverContractJson from "@/contracts/DestinationOApp.json";
import { useEffect, useState } from "react";
import {
  useDynamicContext,
  useSendBalance,
  useSwitchNetwork,
} from "@dynamic-labs/sdk-react-core";

export default function ChannelBalance({ channel }) {
  const [copied, setCopied] = useState("");
  const [sourceBalance, setSourceBalance] = useState(null);
  const [destBalance, setDestBalance] = useState(null);
  const [gasEstimateSource, setGasEstimateSource] = useState(null);
  const [gasEstimateDest, setGasEstimateDest] = useState(null);
  const [refreshingSource, setRefreshingSource] = useState(false);
  const [refreshingDest, setRefreshingDest] = useState(false);

  const { primaryWallet } = useDynamicContext();
  const { open: sendBalance } = useSendBalance();
  const switchNetwork = useSwitchNetwork();

  const FLOW_EVM_CHAIN_ID = 545;

  // Source chain data
  const sourceChainData = supportedBlockchain[channel.sourceChain];
  const sourceIcon = sourceChainData?.Thumbnail || "";
  const sourceName = sourceChainData?.Name || "Unknown";
  const sourceExplorer = sourceChainData?.Explorer || "";
  const sourceRpc = sourceChainData?.Rpc;
  const sourceSymbol = sourceChainData?.Symbol || "TOKEN";
  const sourceEndpoint = sourceChainData?.Endpoint;
  const sourceChainId = sourceChainData?.ChainId;

  // Destination chain data
  const destChainData = supportedBlockchain[channel.destinationChain];
  const destIcon = destChainData?.Thumbnail || "";
  const destName = destChainData?.Name || "Unknown";
  const destExplorer = destChainData?.Explorer || "";
  const destRpc = destChainData?.Rpc;
  const destSymbol = destChainData?.Symbol || "TOKEN";
  const destEndpoint = destChainData?.Endpoint;
  const destChainId = destChainData?.ChainId;

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
    <div className="flex items-center gap-2 text-md text-gray-500">
      <span>{formatAddress(address)}</span>
      <button onClick={() => handleCopy(address)}>
        <img
          src={copied === address ? "/copied.png" : "/copy.png"}
          alt="Copy"
          className="w-4 h-4 hover:opacity-80 cursor-pointer"
        />
      </button>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 cursor-pointer"
      >
        <img src="/explorer.png" alt="Explorer" className="w-4 h-4" />
      </a>
    </div>
  );

  const handleFund = async (targetChainId) => {
    if (!primaryWallet) {
      console.error("No primary wallet connected");
      return;
    }

    try {
      await switchNetwork({ wallet: primaryWallet, network: targetChainId });
      await sendBalance({ recipientAddress: channel.walletAddress });
      await switchNetwork({
        wallet: primaryWallet,
        network: FLOW_EVM_CHAIN_ID,
      });
    } catch (err) {
      console.error("Funding failed:", err);
      const userClosed =
        err?.name === "UserRejectedTransactionError" ||
        err?.code === 4001 ||
        err?.message?.toLowerCase().includes("user rejected") ||
        err?.message?.toLowerCase().includes("user denied") ||
        err?.message?.toLowerCase().includes("modal closed");

      if (userClosed) {
        try {
          await switchNetwork({
            wallet: primaryWallet,
            network: FLOW_EVM_CHAIN_ID,
          });
        } catch (switchErr) {
          console.error("Failed to switch back to Flow EVM:", switchErr);
        }
      }
    }
  };

  const fetchSource = async () => {
    if (!sourceRpc) return;
    try {
      setRefreshingSource(true);
      const res = await fetch(sourceRpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [channel.walletAddress, "latest"],
          id: 1,
        }),
      });
      const json = await res.json();
      if (json?.result) {
        const value = parseInt(json.result, 16) / 1e18;
        setSourceBalance(value.toFixed(4));
      }

      const estimateRes = await fetch("/api/estimateGas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rpc: sourceRpc,
          endpoint: sourceEndpoint,
          contractJson: senderContractJson,
          symbol: sourceSymbol,
        }),
      });

      const estimateJson = await estimateRes.json();
      setGasEstimateSource(estimateJson.formatted ?? "--");
    } catch (e) {
      console.error("Source error:", e);
      setGasEstimateSource("--");
    } finally {
      setRefreshingSource(false);
    }
  };

  const fetchDest = async () => {
    if (!destRpc) return;
    try {
      setRefreshingDest(true);
      const res = await fetch(destRpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [channel.walletAddress, "latest"],
          id: 1,
        }),
      });
      const json = await res.json();
      if (json?.result) {
        const value = parseInt(json.result, 16) / 1e18;
        setDestBalance(value.toFixed(4));
      }

      const destEstimateRes = await fetch("/api/estimateGas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rpc: destRpc,
          endpoint: destEndpoint,
          contractJson: receiverContractJson,
          symbol: destSymbol,
        }),
      });

      const estimateJson = await destEstimateRes.json();
      setGasEstimateDest(estimateJson.formatted ?? "--");
    } catch (e) {
      console.error("Destination error:", e);
      setGasEstimateDest("--");
    } finally {
      setRefreshingDest(false);
    }
  };

  useEffect(() => {
    fetchSource();
  }, [channel.walletAddress, sourceRpc]);

  useEffect(() => {
    fetchDest();
  }, [channel.walletAddress, destRpc]);

  return (
    <div className="mt-10">
      <h3
        className="text-lg font-semibold text-gray-400 mb-4"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        CHANNEL BALANCE
      </h3>

      <div className="flex gap-6">
        {/* Source Chain Card */}
        <div className="relative flex-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <img
            src="/piggybank.png"
            alt="Fund"
            onClick={() => handleFund(sourceChainId)}
            className="absolute top-5 right-5 w-8 h-8 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
          />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-15 h-15 bg-[#333333] rounded-2xl flex items-center justify-center">
              {sourceIcon && (
                <img src={sourceIcon} alt={sourceName} className="w-12 h-12" />
              )}
            </div>
          </div>

          <p className="text-xl font-semibold text-gray-800 mb-1">
            {sourceName}
          </p>
          <AddressRow
            address={channel.walletAddress}
            explorerUrl={`${sourceExplorer}/address/${channel.walletAddress}`}
          />
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
            Balance (Native Gas Token):{" "}
            <span className="text-gray-800">
              {sourceBalance ?? "--"} {sourceSymbol}
            </span>
            <img
              src="/refresh.png"
              alt="Refresh"
              onClick={fetchSource}
              className={`w-4 h-4 cursor-pointer transition-transform duration-300 hover:scale-[1.02] ${
                refreshingSource ? "rotate-[360deg]" : ""
              }`}
            />
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Est. Gas Required:{" "}
            <span className="text-gray-800">{gasEstimateSource ?? "--"}</span>
          </p>
        </div>

        {/* Destination Card */}
        <div className="relative flex-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <img
            src="/piggybank.png"
            alt="Fund"
            onClick={() => handleFund(destChainId)}
            className="absolute top-5 right-5 w-8 h-8 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
          />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-15 h-15 bg-[#333333] rounded-2xl flex items-center justify-center">
              {destIcon && (
                <img src={destIcon} alt={destName} className="w-12 h-12" />
              )}
            </div>
          </div>

          <p className="text-xl font-semibold text-gray-800 mb-1">{destName}</p>
          <AddressRow
            address={channel.walletAddress}
            explorerUrl={`${destExplorer}/address/${channel.walletAddress}`}
          />
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
            Balance (Native Gas Token):{" "}
            <span className="text-gray-800">
              {destBalance ?? "--"} {destSymbol}
            </span>
            <img
              src="/refresh.png"
              alt="Refresh"
              onClick={fetchDest}
              className={`w-4 h-4 cursor-pointer transition-transform duration-300 hover:scale-[1.02] ${
                refreshingDest ? "rotate-[360deg]" : ""
              }`}
            />
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Est. Gas Required:{" "}
            <span className="text-gray-800">{gasEstimateDest ?? "--"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
