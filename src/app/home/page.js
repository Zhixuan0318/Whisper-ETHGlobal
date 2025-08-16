"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const features = [
    { emoji: "🚀", title: "Blazing Fast Setup", desc: "Cut 80% of the work to launch a cross-chain channel for your AI agents." },
    { emoji: "💪", title: "Support 127+ Networks", desc: "Connect your Hedera AI agents to any LayerZero-supported EVM chain." },
    { emoji: "🧲", title: "Auto-Trigger Hook Actions", desc: "Auto-trigger predefined hook actions when cross-chain message arrived." },
    { emoji: "🌳", title: "Safe and Modular", desc: "Built-in security verification. Modular design for any agentic use case." },
  ];

  const useCases = [
    {
      emoji: "🤖",
      title: "Cross-Chain Attestation Machine",
      desc: "An agentic workflow that submits a message to an HCS topic, which is also available as an attestation on another EVM chain.",
      href: "/demo/HCS-Agent-Demo",
      external: false,
    },
    {
      emoji: "🤖",
      title: "Cross-Chain Emoji NFT Minter",
      desc: "An agentic workflow that mints an emoji as NFT with HTS and broadcasts the option to an emoji NFT minter on another EVM chain.",
      href: "/demo/HTS-Agent-Demo",
      external: false,
    },
    {
      emoji: "🤖",
      title: "Whisper MCP Server",
      desc: "The MCP server that equips Hedera Agent Tools and Whisper cross-chain messaging integration.",
      href: "https://github.com/Zhixuan0318/Whisper-MCP-Server",
      external: true,
    },
  ];

  return (
    <div className="w-[79.5%] ml-auto space-y-3 mt-20">
      {/* Home Title */}
      <h1
        className="text-4xl font-bold text-gray-900 px-9"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        Home
      </h1>

      {/* Description */}
      <p className="text-lg font-semibold text-gray-400 px-9 mb-10">
        Let&apos;s create some omnichain magic✨
      </p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-9">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-gray-300 rounded-lg mb-4 text-2xl">
              {item.emoji}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Agentic Use Cases Section */}
      <div className="space-y-3 px-9 mt-15">
        <h2 className="text-[26px] font-bold text-gray-900">
          Agentic Use Cases
        </h2>
        <p className="text-lg font-semibold text-gray-400 mb-10">
          Combining Hedera Agent Kit, Hedera Network Services and 👻 Whisper
        </p>

        {/* Use Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {useCases.map((caseItem, index) =>
            caseItem.external ? (
              <a
                key={index}
                href={caseItem.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="relative h-50 bg-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer group">
                  <div>
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-300 rounded-lg mb-4 text-2xl">
                      {caseItem.emoji}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {caseItem.title}
                    </h3>
                    <p className="text-gray-600 text-sm mr-12">
                      {caseItem.desc}
                    </p>
                  </div>
                  <ArrowRight className="absolute top-1/2 right-7 -translate-y-1/2 text-gray-500 group-hover:text-black transition" size={22} />
                </div>
              </a>
            ) : (
              <Link key={index} href={caseItem.href}>
                <div className="relative h-50 bg-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer group">
                  <div>
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-300 rounded-lg mb-4 text-2xl">
                      {caseItem.emoji}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {caseItem.title}
                    </h3>
                    <p className="text-gray-600 text-sm mr-12">
                      {caseItem.desc}
                    </p>
                  </div>
                  <ArrowRight className="absolute top-1/2 right-7 -translate-y-1/2 text-gray-500 group-hover:text-black transition" size={22} />
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
