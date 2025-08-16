"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Ripple } from "@/components/magicui/ripple";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { toast, Bounce } from "react-toastify";

export default function Loading({ payload }) {
  const router = useRouter();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const delayedApiCall = new Promise(async (resolve, reject) => {
      try {
        // 1. Wait for 4 seconds
        await new Promise((r) => setTimeout(r, 4000));

        // 2. Then call the API
        const res = await fetch("/api/createChannel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to create channel");

        resolve(); // All done
      } catch (err) {
        reject(err); // Something went wrong
      }
    });

    // Toast while both delay + API run as one promise
    toast.promise(delayedApiCall, {
      pending: "Whisper is working super hard...",
      success: "Channel created successfully!",
      error: "Something went wrong!",
    }, {
      position: "bottom-right",
      autoClose: 3000,
      transition: Bounce,
      theme: "light",
    });

    delayedApiCall
      .then(() => router.push("/channel"))
      .catch((err) => {
        console.error("Channel creation failed:", err);
        // Optional: stay on page or handle retry
      });
  }, [payload, router]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <TypingAnimation
        className="z-10 text-center text-2xl font-semibold tracking-tighter text-gray-700 typewriter"
        
      >
        Creating your channel...
      </TypingAnimation>
      <Ripple />
    </div>
  );
}
