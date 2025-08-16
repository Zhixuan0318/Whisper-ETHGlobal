// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WalletProvider from "@/context/WalletProvider";
import Sidebar from "@/components/Sidebar";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Whisper",
  description:
    "A no-code developer tool that lets you quickly spin up LayerZero-powered omnichain messaging channels between Flow and EVM chains, enabling your AI agents to communicate cross-chain and trigger automated actions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <div>
            <Sidebar />
            <main>{children}</main>
          </div>
        </WalletProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
