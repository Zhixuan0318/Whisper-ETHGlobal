"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebaseClient";
import supportedBlockchain from "@/data/supportedBlockchain.json";
import ChannelDetailParent from "./channel-detail/ChannelDetailParent";

export default function ChannelCard({ walletAddress }) {
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [channels, setChannels] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!walletAddress) return;

    const walletPath = walletAddress.toLowerCase();
    const channelRef = ref(db, walletPath);

    const unsubscribe = onValue(channelRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setChannels([]);
        return;
      }

      const entries = Object.entries(data)
        .filter(([key]) => key !== "channelCount")
        .map(([id, channel]) => ({
          id,
          oappDeployed: channel.oappDeployed,
          sourceChain: channel.sourceChain,
          destinationChain: channel.destinationChain,
          walletAddress: channel.walletAddress,
          apiKey: channel.apiKey,
          webhook: channel.webhook,
        }));

      setChannels(entries);
    });

    return () => unsubscribe();
  }, [walletAddress]);

  const getFilteredChannels = () => {
    if (filter === "Pending") return channels.filter((c) => !c.oappDeployed);
    if (filter === "Ready") return channels.filter((c) => c.oappDeployed);
    return channels;
  };

  const countStatus = {
    All: channels.length,
    Pending: channels.filter((c) => !c.oappDeployed).length,
    Ready: channels.filter((c) => c.oappDeployed).length,
  };

  // Get the latest version of the selected channel
  const selectedChannel = channels.find((c) => c.id === selectedChannelId);

  if (selectedChannel) {
    return (
      <ChannelDetailParent
        channel={selectedChannel}
        onBack={() => setSelectedChannelId(null)}
      />
    );
  }

  return (
    <div className="w-[80%] ml-auto space-y-4 mt-10">
      {/* Channels Title */}
      <h2
        className="text-2xl font-semibold text-gray-900 px-9"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        Channels
      </h2>

      {/* Filter Options */}
      <div className="flex gap-3 px-9 mb-6">
        {["All", "Pending", "Ready"].map((type) => (
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

      {/* Channel Cards or Empty State */}
      {getFilteredChannels().length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-40">
          <div className="w-50 h-50">
            <img src="/empty.gif" alt="No results" className="w-50 h-50" />
          </div>
          <p className="text-gray-400 text-lg font-semibold font-mono mt-2">
            No result found...
          </p>
        </div>
      ) : (
        getFilteredChannels().map((channel) => {
          const destChain = supportedBlockchain[channel.destinationChain];
          const destIcon = destChain?.Thumbnail || "";
          const destName = destChain?.Name || "Unknown";

          return (
            <div
              key={channel.id}
              className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 mx-9"
            >
              {/* Icon + ID */}
              <div className="flex items-center gap-2">
                <img
                  src="/channel-card-icon.png"
                  alt="Channel Icon"
                  className="w-11 h-11"
                />
                <span
                  className="ml-2 text-md font-medium text-gray-800"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  {channel.id}
                </span>
              </div>

              {/* Status Pill */}
              <div>
                <span
                  className={`px-5 py-3 text-[14px] font-semibold rounded-full ${
                    channel.oappDeployed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {channel.oappDeployed ? "Ready" : "Pending"}
                </span>
              </div>

              {/* Source + Destination */}
              <div className="flex items-center gap-2 bg-white rounded-2xl shadow-md border border-gray-50 px-7 py-4">
                <span
                  className="-ml-0.5 text-sm font-semibold text-gray-700"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  Source
                </span>
                {(() => {
                  const sourceChain = supportedBlockchain[channel.sourceChain];
                  const sourceIcon = sourceChain?.Thumbnail || "";
                  const sourceName = sourceChain?.Name || "Unknown";
                  return (
                    sourceIcon && (
                      <div className="w-11 h-11 bg-[#333333] rounded-xl flex items-center justify-center">
                        <img
                          src={sourceIcon}
                          alt={sourceName}
                          title={sourceName}
                          className="w-7 h-7"
                        />
                      </div>
                    )
                  );
                })()}

                <span
                  className="ml-8 text-sm font-semibold text-gray-700"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  Destination
                </span>
                {(() => {
                  const destChain =
                    supportedBlockchain[channel.destinationChain];
                  const destIcon = destChain?.Thumbnail || "";
                  const destName = destChain?.Name || "Unknown";
                  return (
                    destIcon && (
                      <div className="w-11 h-11 bg-[#333333] rounded-xl flex items-center justify-center">
                        <img
                          src={destIcon}
                          alt={destName}
                          title={destName}
                          className="w-7 h-7"
                        />
                      </div>
                    )
                  );
                })()}
              </div>

              {/* Enter Icon */}
              <div>
                <img
                  src="/enter.png"
                  alt="Enter"
                  className="w-8 h-8 cursor-pointer hover:scale-102"
                  onClick={() => setSelectedChannelId(channel.id)}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
