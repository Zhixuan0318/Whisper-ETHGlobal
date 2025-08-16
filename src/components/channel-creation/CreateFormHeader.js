"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreateFormHeader({ stepTitle }) {
  const router = useRouter();

  return (
    <header className="h-[10vh] w-full flex items-center justify-between px-6 bg-white shadow-sm">
      {/* Left: Logo and Step Title */}
      <div className="flex items-center space-x-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={30}
          height={30}
          className="object-contain mb-0.5"
        />
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-800">Create Channel</span>
          <Image
            src="/right-arrow.png"
            alt="Arrow"
            width={13}
            height={13}
            className="object-contain ml-1.5 mb-0.5"
          />
          <span className="text-md font-normal text-gray-600 ml-1.5 mb-0.5">{stepTitle}</span>
        </div>
      </div>

      {/* Right: Exit Button */}
      <button onClick={() => router.back()} className="focus:outline-none">
        <Image
          src="/exit.png"
          alt="Exit"
          width={26}
          height={26}
          className="object-contain hover:scale-105 transition-transform cursor-pointer"
        />
      </button>
    </header>
  );
}
