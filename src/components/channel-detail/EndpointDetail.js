"use client";

import { useState, useEffect } from "react";
import CodeblockExample from "./Codeblock";
import { useAccount } from "wagmi";

export default function EndpointDetail({ channel }) {

  const [isLocked, setIsLocked] = useState(!channel?.oappDeployed);

  useEffect(() => {
    setIsLocked(!channel?.oappDeployed);
  }, [channel?.oappDeployed]);

  const [copied, setCopied] = useState("");
  const { address } = useAccount();

  const baseURL = typeof window !== "undefined" ? window.location.origin : "";

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(""), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const InfoBox = ({ label, value }) => (
    <div className="mb-5">
      <div className="text-md font-medium text-gray-800 mb-1">{label}</div>
      <div className="relative bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-mono text-gray-700 overflow-x-auto flex items-center justify-between">
        <span className="break-all">{value}</span>
        <button
          onClick={() => handleCopy(value)}
          className="ml-4 hover:opacity-80"
        >
          <img
            src={copied === value ? "/copied.png" : "/copy.png"}
            alt="Copy"
            className="w-5 h-5 cursor-pointer"
          />
        </button>
      </div>
    </div>
  );

  return (
    <div className="mt-10 relative">
      {/* Section Title */}
      <h3
        className="text-lg font-semibold text-gray-400 mb-4"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        CROSS CHAIN MESSAGING
      </h3>

      {/* Content Area */}
      <div
        className={`${isLocked ? "pointer-events-none filter blur-sm" : ""}`}
      >
        <InfoBox label="Endpoint" value={`${baseURL}/api/send`} />
        <InfoBox label="API Key" value={channel.apiKey} />
        <div className="text-md font-medium text-gray-800 mb-1">
          Example Usage
        </div>
        <CodeblockExample
          endpoint={`${baseURL}/api/send`}
          apiKey={channel.apiKey}
          walletAddress={address}
          channelId={channel.id}
        />
      </div>

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-10 max-w-sm text-center">
            <img
              src="/lock.png"
              alt="Locked"
              className="w-10 h-10 mx-auto mb-3"
            />
            <p className="text-gray-700 text-md font-medium">
              Deploy the OApps to unlock cross-chain messaging via this channel
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
