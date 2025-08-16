"use client";

import {
  useDynamicContext,
  useIsLoggedIn,
  DynamicUserProfile,
} from "@dynamic-labs/sdk-react-core";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useMemo } from "react";

const FLOW_CHAIN_ID = 545;

function formatFlow(balanceString) {
  if (!balanceString) return "";
  const [amountStr, symbol] = balanceString.split(" ");
  const amount = parseFloat(amountStr);
  if (isNaN(amount)) return balanceString;

  if (amount < 1000) {
    return (amount % 1 === 0 ? amount.toString() : amount.toFixed(1)) + " " + symbol;
  }
  const value = amount / 1000;
  return (value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)) + "k " + symbol;
}

export default function ConnectWalletButton() {
  const { setShowAuthFlow, setShowDynamicUserProfile, user } = useDynamicContext();
  const { address } = useAccount();
  const chainId = useChainId();
  const isLoggedIn = useIsLoggedIn();

  const { data: balanceData } = useBalance({
    address,
    chainId,
    watch: true,
  });

  const displayBalance = useMemo(() => {
    if (!balanceData) return "";
    return formatFlow(`${balanceData.formatted} FLOW`);
  }, [balanceData]);

  const isWrongNetwork = chainId !== FLOW_CHAIN_ID;

  if (!isLoggedIn) {
    return (
      <div className="w-full mb-1">
        <button
          onClick={() => setShowAuthFlow(true)}
          type="button"
          className="w-full bg-black text-white px-4 py-2 h-13 rounded-2xl font-semibold hover:scale-102 transition-all cursor-pointer"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mb-1">
      <div className={`flex items-center w-full px-4 py-3 rounded-2xl shadow-lg border-2 ${isWrongNetwork ? "bg-red-500 border-red-600" : "bg-white border-gray-50"}`}>
        {/* Left: Avatar + Address */}
        <div
          onClick={() => setShowDynamicUserProfile(true)}
          className="flex items-center bg-gray-100 pl-2 pr-3 py-3 rounded-xl space-x-2 cursor-pointer shadow-sm hover:scale-102"
        >
          <img
            src={user?.avatar || "/avatar.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-md font-bold text-gray-800">
            {address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : "Unknown"}
          </span>
        </div>

        {/* Right: Chain Info + Balance */}
        <div className="flex flex-col ml-3 mt-1.5 justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <img
              src="/flow-logo.png"
              alt="Flow"
              className="w-6 h-6 object-contain hover:scale-105"
            />
            <span className={`ml-0.5 w-2 h-2 rounded-full shadow-[0_0_6px_2px_rgba(34,197,94,0.6)] ${isWrongNetwork ? "bg-red-500" : "bg-green-500"}`} />
          </div>

          <span
            className={`text-md font-bold truncate max-w-[120px] ${isWrongNetwork ? "text-white" : "text-gray-800"}`}
            title={displayBalance}
          >
            {isWrongNetwork ? "Switch Network" : displayBalance}
          </span>
        </div>
      </div>

      <DynamicUserProfile />
    </div>
  );
}
