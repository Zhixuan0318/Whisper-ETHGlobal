"use client";

import { useState } from "react";
import ChannelBalance from "./ChannelBalance";
import OAppDetail from "./OAppDetail";
import EndpointDetail from "./EndpointDetail";
import WebhookDetail from "./WebhookDetail";
import VerificationDetail from "./VerificationDetail";

export default function ChannelDetailParent({ channel, onBack }) {
  const status = channel.oappDeployed ? "Ready" : "Pending";
  const [copied, setCopied] = useState("");

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(""), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="w-[80%] ml-auto mt-10 px-15">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src="/back.png"
          alt="Back"
          className="w-7 h-7 cursor-pointer"
          onClick={onBack}
        />

        {/* Channel ID + Copy Button */}
        <div className="flex items-center gap-2">
          <h2
            className="text-xl font-semibold text-gray-900"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {channel.id}
          </h2>
          <button
            onClick={() => handleCopy(channel.id)}
            className="hover:opacity-80"
          >
            <img
              src={copied === channel.id ? "/copied.png" : "/copy.png"}
              alt="Copy"
              className="w-5 h-5 cursor-pointer"
            />
          </button>
        </div>

        <span
          className={`px-4 py-1 text-sm font-semibold rounded-full ${
            channel.oappDeployed
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {status}
        </span>
      </div>

      <ChannelBalance channel={channel} />
      <OAppDetail channel={channel} />
      <EndpointDetail channel={channel} />
      <WebhookDetail channel={channel} />
      <VerificationDetail channel={channel} />
    </div>
  );
}
