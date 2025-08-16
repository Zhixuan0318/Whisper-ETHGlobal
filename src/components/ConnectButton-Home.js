"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useIsLoggedIn, useDynamicContext } from "@dynamic-labs/sdk-react-core";

export default function ConnectWalletButton() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const { showAuthFlow, setShowAuthFlow } = useDynamicContext();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/home");
    }
  }, [isLoggedIn, router]);

  return (
    <>
      {!isLoggedIn ? (
        <button
          type="button"
          disabled={showAuthFlow}
          onClick={() => setShowAuthFlow(true)}
          className="px-12 py-4 rounded-lg font-semibold text-lg transition-all bg-white text-black cursor-pointer hover:bg-[#39FF14] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showAuthFlow ? "Connecting Wallet..." : "Connect to Dashboard"}
        </button>
      ) : (
        <div className="px-12 py-4 text-lg font-semibold text-gray-600">
          Redirecting...
        </div>
      )}
    </>
  );
}
