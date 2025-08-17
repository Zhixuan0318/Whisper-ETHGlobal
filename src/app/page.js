"use client";

import Image from "next/image";
import Squares from "@/components/Squares";
import { NumberTicker } from "@/components/magicui/number-ticker";
import ConnectWalletButtonHome from "@/components/ConnectButton-Home";

export default function Page() {
  return (
    <div className="relative flex items-center justify-center h-screen w-full overflow-hidden bg-black text-white">
      {/* Background Squares */}
      <div className="absolute inset-0 z-0">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#271E37"
          hoverFillColor="#222222"
        />
      </div>

      {/* Whisper Logo - top left */}
      <div className="absolute top-8 left-8 z-20 flex items-center space-x-2">
        <Image src="/logo-dark.png" alt="Whisper Logo" width={35} height={35} />
        <span className="text-[28px] font-semibold text-white">Whisper</span>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4">
        {/* Big Title */}
        <h1 className="text-7xl font-bold font-mono tracking-tight leading-tight">
          Launch Agentic Omnichain Messaging <br />
          Workflows on Flow{" "}
          <span className="inline-block align-middle">
            <NumberTicker
              value={85}
              className="text-6xl md:text-7xl font-bold font-mono text-[#39FF14]"
            />
          </span>
          % Faster
        </h1>

        {/* Description */}
        <p className="mt-9 text-xl text-gray-300 leading-relaxed mx-100">
          Whisper is the no-code tool that lets you quickly spin up
          LayerZero-powered omnichain messaging channels between Flow and any EVM
          chains, enabling your AI agents to communicate cross-chain and trigger
          automated actions.
        </p>

        {/* Buttons */}
        <div className="mt-15 flex items-center justify-center gap-5">
          <ConnectWalletButtonHome />
          <a
            href="https://github.com/Zhixuan0318/Whisper-ETHGlobal"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="group flex items-center gap-2 px-12 py-4 border-2 border-white rounded-lg text-lg font-mono text-white cursor-pointer hover:border-[#39FF14] hover:text-[#39FF14]">
              {/* Default White Logo */}
              <Image
                src="/github-mark-white.svg"
                alt="GitHub Logo"
                width={20}
                height={20}
                className="w-6 h-6 block group-hover:hidden -ml-1 mb-0.5"
              />
              {/* Neon Green Logo (visible on hover) */}
              <Image
                src="/github-mark-neon.png"
                alt="GitHub Logo Neon"
                width={20}
                height={20}
                className="w-6 h-6 hidden group-hover:block -ml-1 mb-0.5"
              />
              GitHub
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
