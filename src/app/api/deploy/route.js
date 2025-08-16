// app/api/deploy/route.js

import { db } from "@/lib/firebaseAdmin";
import autoDeploy from "@/utils/autoDeploy";

export async function POST(request) {
  try {
    const body = await request.json();
    const { walletAddress, channelId } = body;

    if (!walletAddress || !channelId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const baseRef = db.ref(`${walletAddress.toLowerCase()}/${channelId}`);

    // Ensure the channel exists
    const snapshot = await baseRef.once("value");
    if (!snapshot.exists()) {
      return new Response(JSON.stringify({ error: "Channel not found" }), {
        status: 404,
      });
    }

    const channelData = snapshot.val();

    const destinationChain = channelData.destinationChain;
    const sourceChain = channelData.sourceChain;
    const privateKey = channelData.walletPrivateKey;

    if (!destinationChain || !sourceChain || !privateKey) {
      return new Response(
        JSON.stringify({
          error: "Missing destinationChain, sourceChain or walletPrivateKey in DB",
        }),
        { status: 400 }
      );
    }

    // 🚀 Call autoDeploy
    const result = await autoDeploy(sourceChain, destinationChain, privateKey);

    // ✏️ Update channel with deployment info
    await baseRef.update({
      sourceOApp: result.source.address,
      destinationOApp: result.destination.address,
      oappDeployed: true,
    });

    return new Response(
      JSON.stringify({
        message: "Deployment successful",
        sourceOApp: result.source.address,
        destinationOApp: result.destination.address,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Deploy Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
