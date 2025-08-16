"use client";

import { useState } from "react";
import Image from "next/image";
import supportedChains from "@/data/supportedBlockchain.json";

export default function FormStep1({
  sourceChain,
  setSourceChain,
  destChain,
  setDestChain,
}) {
  const chainList = Object.entries(supportedChains);
  const [activeCircle, setActiveCircle] = useState(null); // "source" | "dest" | null

  const handleCircleClick = (type) => {
    setActiveCircle((prev) => (prev === type ? null : type));
  };

  const handleChainSelect = (key) => {
    if (activeCircle === "source") {
      if (sourceChain === key) {
        setSourceChain(null); // deselect
      } else {
        setSourceChain(key);
      }
    } else if (activeCircle === "dest") {
      if (destChain === key) {
        setDestChain(null); // deselect
      } else {
        setDestChain(key);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 py-6 space-y-6">
      {/* Upper part */}
      <div className="w-full flex flex-col items-center mt-10">
        <div className="flex items-center justify-center space-x-6 mb-2">
          {/* SOURCE Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`w-40 h-40 rounded-full bg-white border flex items-center justify-center cursor-pointer ${
                activeCircle === "source"
                  ? "border-4 border-[#39FF14]"
                  : "border-gray-300"
              }`}
              onClick={() => handleCircleClick("source")}
            >
              {sourceChain && supportedChains[sourceChain] ? (
                <img
                  src={supportedChains[sourceChain].Thumbnail}
                  alt={supportedChains[sourceChain].Name}
                  className="w-32 h-32 object-contain rounded-full"
                />
              ) : (
                <Image
                  src="/question-mark.png"
                  alt="Source Chain"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              )}
            </div>
            <span
              className="text-md text-gray-500 mt-2"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              SOURCE
            </span>
          </div>

          {/* Middle GIF */}
          <div className="-ml-6 -mr-0 w-40 h-10 flex items-center justify-center">
            <Image
              src="/connect.gif"
              alt="Connecting"
              width={100}
              height={40}
              className="object-contain"
            />
          </div>

          {/* DEST Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`w-40 h-40 rounded-full bg-white border flex items-center justify-center cursor-pointer ${
                activeCircle === "dest"
                  ? "border-4 border-[#39FF14]"
                  : "border-gray-300"
              }`}
              onClick={() => handleCircleClick("dest")}
            >
              {destChain && supportedChains[destChain] ? (
                <img
                  src={supportedChains[destChain].Thumbnail}
                  alt={supportedChains[destChain].Name}
                  className="w-32 h-32 object-contain rounded-full"
                />
              ) : (
                <Image
                  src="/question-mark.png"
                  alt="Destination Chain"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              )}
            </div>
            <span
              className="text-md text-gray-500 mt-2"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              DESTINATION
            </span>
          </div>
        </div>
      </div>

      {/* Lower part: Chain selection */}
      <div className="w-full flex flex-col items-center space-y-4 mt-6">
        <span
          className="text-md font-normal text-gray-500 mb-5"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Supported Blockchains
        </span>

        {[0, 1].map((rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-4">
            {chainList
              .slice(rowIndex * 5, rowIndex * 5 + 5)
              .map(([key, chainData]) => {
                const isSelectedForActive =
                  (activeCircle === "source" && sourceChain === key) ||
                  (activeCircle === "dest" && destChain === key);
                const isDisabled =
                  (activeCircle === "source" && destChain === key) ||
                  (activeCircle === "dest" && sourceChain === key);

                return (
                  <button
                    key={key}
                    onClick={() => !isDisabled && handleChainSelect(key)}
                    disabled={isDisabled}
                    className={`w-[250px] h-[150px] rounded-2xl border flex flex-col items-center justify-center space-y-3 bg-white shadow-sm transition-all ${
                      isSelectedForActive
                        ? "border-4 border-black"
                        : "border border-gray-300"
                    } ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <div className="w-16 h-16 rounded-full bg-[#333333] flex items-center justify-center">
                      <img
                        src={chainData.Thumbnail}
                        alt={chainData.Name}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <span className="text-md text-gray-500 font-medium text-center">
                      {chainData.Name}
                    </span>
                  </button>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
