import { db } from "@/lib/firebaseAdmin";
import send from "@/utils/send";
import pollReceive from "@/utils/pollReceive";

export async function POST(request) {
  try {
    const body = await request.json();
    const { walletAddress, channelId, apiKey, payload } = body;

    if (!walletAddress || !channelId || !apiKey || !payload) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const basePath = `${walletAddress.toLowerCase()}/${channelId}`;
    const snapshot = await db.ref(basePath).once("value");

    if (!snapshot.exists()) {
      return new Response(JSON.stringify({ error: "Channel not found" }), {
        status: 404,
      });
    }

    const channelData = snapshot.val();

    // 🔒 Verify API key
    if (channelData.apiKey !== apiKey) {
      return new Response(JSON.stringify({ error: "Invalid API key" }), {
        status: 403,
      });
    }

    const { sourceOApp, sourceChain, destinationOApp, destinationChain, walletPrivateKey } =
      channelData;

    if (!sourceOApp || !sourceChain || !destinationOApp || !walletPrivateKey) {
      return new Response(
        JSON.stringify({ error: "Deployment incomplete or missing fields" }),
        { status: 400 }
      );
    }

    // 🚀 Send message
    const stringifiedPayload =
      typeof payload === "string" ? payload : JSON.stringify(payload);
    const txHash = await send(
      sourceOApp,
      sourceChain,
      destinationChain,
      walletPrivateKey,
      stringifiedPayload
    );

    // 📝 Save request info under /request/{txHash}
    const requestRef = db.ref(`${basePath}/request/${txHash}`);
    await requestRef.set({
      status: "inflight",
      timestamp: Date.now(),
    });

    // Poll for delivery in background
    const status = await pollReceive(txHash);

    if (status === "DELIVERED") {
      await requestRef.update({
        status: "delivered",
        deliveredAt: Date.now(),
      });

      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/triggerWebhook`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress,
            channelId,
            payload,
          }),
        });
      } catch (err) {
        console.error("Failed to call triggerWebhook:", err);
      }
    }

    return new Response(JSON.stringify({ txHash }), { status: 200 });
  } catch (err) {
    console.error("Send API Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
