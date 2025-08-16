"use client";

import { useState } from "react";

export default function WebhookDetail({ channel }) {
  const [copied, setCopied] = useState("");

  if (!channel?.webhook) return null;

  const {
    webhookUrl,
    webhookMethod,
    webhookPayloadCompress,
    webhookCustomHeader,
  } = channel.webhook;

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(""), 1500);
    } catch (err) {
      console.error("Copy failed", err);
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

  const PillBox = ({ label, value }) => (
    <div className="flex items-center gap-1.5 mb-5">
      <div className="text-md font-medium text-gray-800">{label}:</div>
      <div className="bg-gray-100 border border-gray-200 text-gray-700 rounded-md px-4 py-1 text-sm font-mono font-medium">
        {value}
      </div>
    </div>
  );

  return (
    <div className="mt-12">
      {/* Title */}
      <h3
        className="text-lg font-semibold text-gray-400 mb-4"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        WEBHOOK SETUP
      </h3>

      {/* Destination URL */}
      <InfoBox label="Destination URL" value={webhookUrl} />

      {/* Method & Payload Compression side by side */}
      <div className="flex gap-6 mb-5">
        <PillBox label="Method" value={webhookMethod || "POST"} />
        <PillBox
          label="Payload Compression"
          value={webhookPayloadCompress ? "Enabled" : "Disabled"}
        />
      </div>

      {/* Headers */}
      {webhookCustomHeader && Object.keys(webhookCustomHeader).length > 0 && (
        <div className="mb-0">
          <div className="text-md font-medium text-gray-800 mb-3">Headers:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(webhookCustomHeader).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-sm font-mono text-gray-500">{key}:</span>
                <span className="bg-gray-100 border border-gray-200 text-gray-700 font-medium rounded-md px-3 py-1 text-sm font-mono">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
