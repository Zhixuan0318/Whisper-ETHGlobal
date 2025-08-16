// app/api/channel/route.js
import { db } from "@/lib/firebaseAdmin";

export async function GET(req) {

  const { searchParams } = new URL(req.url);
  const walletAddress = searchParams.get("walletAddress")?.toLowerCase();
  const channelId = searchParams.get("channelId");

  if (!walletAddress || !channelId) {
    return new Response(JSON.stringify({ error: "Missing params" }), {
      status: 400,
    });
  }

  const ref = db.ref(`${walletAddress}/${channelId}`);
  const snapshot = await ref.once("value");

  if (!snapshot.exists()) {
    return new Response(JSON.stringify({ error: "Channel not found" }), {
      status: 404,
    });
  }

  const data = snapshot.val();

  return new Response(
    JSON.stringify({
      sourceOApp: data.sourceOApp,
      destinationOApp: data.destinationOApp,
    }),
    { status: 200 }
  );
}
