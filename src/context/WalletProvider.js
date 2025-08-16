"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
  DynamicContextProvider,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";

import { config } from "@/config/wagmi";

function WalletWatcher({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useIsLoggedIn();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isLoggedIn && pathname !== "/" && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/");
    }
  }, [isLoggedIn, pathname, router]);

  if (!isLoggedIn && pathname !== "/") {
    return null;
  }

  return <>{children}</>;
}

export default function WalletProvider({ children }) {
  const queryClient = new QueryClient();

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID,
        walletConnectors: [EthereumWalletConnectors],
        events: {
          onLogout: () => {
            console.log("User logged out");
            router.replace("/"); // redirect to homepage
          },
        },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <WalletWatcher>{children}</WalletWatcher>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
