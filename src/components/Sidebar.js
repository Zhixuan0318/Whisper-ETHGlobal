"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectWalletButton from "./ConnectButton";

export default function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on /create route
  if (pathname === "/" || pathname === "/create") return null;

  return (
    <div className="fixed top-0 w-[20vw] min-h-screen bg-white border-r border-gray-200 flex flex-col items-start p-4 space-y-6">
      {/* Logo + Whisper Text */}
      <div className="mt-5 w-full flex items-center justify-center space-x-2">
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
        <span className="text-3xl mt-1 mx-0.5 font-semibold text-gray-800">
          Whisper
        </span>
      </div>

      {/* Create Channel Button */}
      <Link
        href="/create"
        className="group mt-2 cursor-pointer h-13 flex items-center justify-center bg-black text-white font-semibold text-md px-4 py-2 rounded-2xl hover:scale-102 transition-transform w-full"
      >
        <div className="transition-transform duration-300 group-hover:rotate-90 mr-2">
          <Image src="/plus.png" alt="Create" width={20} height={20} />
        </div>
        <span>Create new channel</span>
      </Link>

      {/* Navigation Links */}
      <div className="flex flex-col w-full space-y-3">
        <NavItem
          icon="/home.png"
          label="Home"
          href="/home"
          active={pathname === "/home"}
        />
        <NavItem
          icon="/signal.png"
          label="Channels"
          href="/channel"
          active={pathname === "/channel"}
        />
        <NavItem
          icon="/log.png"
          label="Request Log"
          href="/log"
          active={pathname === "/log"}
        />
      </div>

      {/* RainbowKit Connect Button pinned to bottom */}
      <div className="mt-auto w-full">
        <ConnectWalletButton />
      </div>
    </div>
  );
}

function NavItem({ icon, label, href, active }) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all hover:bg-gray-100 hover:scale-102 cursor-pointer ${
          active ? "bg-blue-50 font-semibold" : ""
        }`}
      >
        <Image src={icon} alt={label} width={25} height={25} />
        <span className="text-gray-800 font-semibold">{label}</span>
      </div>
    </Link>
  );
}
