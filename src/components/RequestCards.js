"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebaseClient";
import supportedBlockchain from "@/data/supportedBlockchain.json";

export default function RequestCard({ walletAddress }) {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!walletAddress) return;

    const walletPath = walletAddress.toLowerCase();
    const walletRef = ref(db, walletPath);

    const unsubscribe = onValue(walletRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setRequests([]);
        return;
      }

      const allRequests = [];

      Object.entries(data).forEach(([channelId, channel]) => {
        if (channelId === "channelCount") return;
        if (!channel.request) return;

        Object.entries(channel.request).forEach(([txHash, request]) => {
          allRequests.push({
            txHash,
            status: request.status?.toLowerCase() || "",
            timestamp: request.timestamp,
            sourceChain: channel.sourceChain, // ✅ store sourceChain
            destinationChain: channel.destinationChain,
            channelId,
          });
        });
      });

      // Sort newest first
      allRequests.sort((a, b) => b.timestamp - a.timestamp);
      setRequests(allRequests);
    });

    return () => unsubscribe();
  }, [walletAddress]);

  const getFilteredRequests = () => {
    const normalizedFilter = filter.toLowerCase();
    if (normalizedFilter === "inflight")
      return requests.filter((r) => r.status === "inflight");
    if (normalizedFilter === "delivered")
      return requests.filter((r) => r.status === "delivered");
    return requests;
  };

  const countStatus = {
    All: requests.length,
    Inflight: requests.filter((r) => r.status === "inflight").length,
    Delivered: requests.filter((r) => r.status === "delivered").length,
  };

  const formatHash = (hash) =>
    hash.length > 10 ? `${hash.slice(0, 5)}...${hash.slice(-5)}` : hash;

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleString();
  };

  return (
    <div className="w-[80%] ml-auto space-y-4 mt-10">
      {/* Requests Title */}
      <h2
        className="text-2xl font-semibold text-gray-900 px-9"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        Requests
      </h2>

      {/* Filter Options */}
      <div className="flex gap-3 px-9 mb-6">
        {["All", "Inflight", "Delivered"].map((type) => (
          <div
            key={type}
            onClick={() => setFilter(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition
              ${
                filter === type
                  ? "bg-blue-100 border-blue-300"
                  : "bg-white border-gray-200"
              }`}
          >
            <span
              className="text-sm font-medium"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {type}
            </span>
            <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {countStatus[type]}
            </span>
          </div>
        ))}
      </div>

      {/* Request Cards */}
      {getFilteredRequests().length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-40">
          <img
            src="/empty.gif"
            alt="No results"
            className="w-50 h-50 object-contain"
          />
          <p className="text-gray-400 text-lg font-semibold font-mono mt-2">
            No result found...
          </p>
        </div>
      ) : (
        getFilteredRequests().map((req) => {
          // ✅ Source Chain Data
          const sourceChain = supportedBlockchain[req.sourceChain];
          const sourceIcon = sourceChain?.Thumbnail || "";
          const sourceName = sourceChain?.Name || "Unknown";

          // ✅ Destination Chain Data
          const destChain = supportedBlockchain[req.destinationChain];
          const destIcon = destChain?.Thumbnail || "";
          const destName = destChain?.Name || "Unknown";

          return (
            <div
              key={req.txHash}
              className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 mx-9"
            >
              {/* Status Icon */}
              <div className="flex items-center gap-2">
                {req.status === "inflight" ? (
                  <img
                    src="/inflight.gif"
                    alt="In flight"
                    className="w-15 h-15 -ml-2 object-contain"
                  />
                ) : (
                  <img
                    src="/delivered.png"
                    alt="Delivered"
                    className="w-9 h-9 ml-1 mr-3"
                  />
                )}

                {/* Transaction Hash */}
                <a
                  href={`https://testnet.layerzeroscan.com/tx/${req.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-black text-md font-medium font-mono"
                >
                  {formatHash(req.txHash)}
                </a>

                {/* Sender Icon + Timestamp */}
                <div className="flex items-center gap-2 ml-25">
                  <img
                    src="/senderOApp.png"
                    alt="Sender OApp"
                    className="w-7 h-7"
                  />
                  <span
                    className="text-sm text-gray-500"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    {formatDate(req.timestamp)}
                  </span>
                </div>
              </div>

              {/* Channel + Source + Destination */}
              <div className="flex items-center gap-4 bg-white rounded-2xl shadow-md border border-gray-50 px-7 py-4">
                {/* Channel ID */}
                <div className="flex items-center gap-2">
                  <img
                    src="/channel-card-icon.png"
                    alt="Channel Icon"
                    className="w-11 h-11"
                  />
                  <span
                    className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    {req.channelId}
                  </span>
                </div>

                {/* Source */}
                <span
                  className="ml-4 text-sm font-semibold text-gray-700"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  Source
                </span>
                {sourceIcon && (
                  <div className="w-11 h-11 bg-[#333333] rounded-xl flex items-center justify-center">
                    <img
                      src={sourceIcon}
                      alt={sourceName}
                      title={sourceName}
                      className="w-7 h-7"
                    />
                  </div>
                )}

                {/* Destination */}
                <span
                  className="ml-8 text-sm font-semibold text-gray-700"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  Destination
                </span>
                {destIcon && (
                  <div className="w-11 h-11 bg-[#333333] rounded-xl flex items-center justify-center">
                    <img
                      src={destIcon}
                      alt={destName}
                      title={destName}
                      className="w-7 h-7"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
