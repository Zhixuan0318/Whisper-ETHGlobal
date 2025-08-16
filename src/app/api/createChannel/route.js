import { db } from "@/lib/firebaseAdmin";

import generateChannelId from "@/utils/generateChannelId";
import generateWallet from "@/utils/generateWallet";
import generateApiKey from "@/utils/generateApiKey";
import generateWebhookSecret from "@/utils/generateWebhookSecret";

export async function POST(request) {
  try {
    
    const body = await request.json();
    console.log("Received body:", body);

    const {
      walletAddress,
      destinationChain,
      sourceChain,
      webhookURL,
      webhookMethod,
      webhookPayloadCompress,
      webhookCustomHeader = {},
    } = body;

    // Validate required fields
    if (!walletAddress || !destinationChain || !sourceChain || !webhookURL) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Validate types for new fields
    if (typeof webhookMethod !== "string") {
      return new Response(
        JSON.stringify({ error: "webhookMethod must be a string" }),
        { status: 400 }
      );
    }

    if (typeof webhookPayloadCompress !== "boolean") {
      return new Response(
        JSON.stringify({ error: "webhookPayloadCompress must be a boolean" }),
        { status: 400 }
      );
    }

    if (
      typeof webhookCustomHeader !== "object" ||
      Array.isArray(webhookCustomHeader)
    ) {
      return new Response(
        JSON.stringify({ error: "webhookCustomHeader must be an object" }),
        { status: 400 }
      );
    }

    const channelId = generateChannelId();
    const { address: generatedWalletAddress, privateKey } = generateWallet();
    const apiKey = generateApiKey();
    const webhookSecret = generateWebhookSecret();

    const channelData = {
      walletAddress: generatedWalletAddress,
      walletPrivateKey: privateKey,
      destinationChain,
      sourceChain,
      apiKey,
      webhook: {
        webhookUrl: webhookURL,
        webhookSecret,
        webhookMethod,
        webhookPayloadCompress,
        webhookCustomHeader,
      },
      oappDeployed: false,
    };

    const refPath = `${walletAddress.toLowerCase()}/${channelId}`;
    await db.ref(refPath).set(channelData);

    const countRef = db.ref(`${walletAddress.toLowerCase()}/channelCount`);
    countRef.transaction((current) => (current || 0) + 1);

    return new Response(
      JSON.stringify({
        message: "Channel created successfully",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Channel Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
