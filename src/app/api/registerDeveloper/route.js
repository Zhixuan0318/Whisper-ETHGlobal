// app/api/registerDeveloper/route.js
import { db } from "@/lib/firebaseAdmin";

export async function POST(request) {
  try {
    
    const body = await request.json();
    const walletAddress = body.walletAddress?.toLowerCase();

    if (!walletAddress) {
      return new Response(JSON.stringify({ error: "Missing wallet address" }), {
        status: 400,
      });
    }

    const developerRef = db.ref(`${walletAddress}`);
    const snapshot = await developerRef.once("value");

    if (snapshot.exists()) {
      return new Response(JSON.stringify({ message: "Developer already registered" }), {
        status: 200,
      });
    }

    // New developer, create entry
    await developerRef.set({
      channelCount: 0,
    });

    return new Response(JSON.stringify({ message: "Developer registered successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Register Developer Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
