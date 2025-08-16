import crypto from "crypto";
import { gunzipSync } from "zlib";

const WEBHOOK_SECRET =
  "581dfc2ea23d66237ac72033fbefbe278af380fe045e92d0f2e2f4e600f01cfd";

export async function POST(req) {
  try {
    const signature = req.headers.get("x-webhook-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing signature" }), {
        status: 400,
      });
    }

    // Get the raw binary request body
    const arrayBuffer = await req.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // ✅ Compute HMAC over the raw buffer (compressed if gzip)
    const expectedSig = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(rawBuffer)
      .digest("hex");

    if (signature !== expectedSig) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 403,
      });
    }

    let rawBody;

    if (req.headers.get("content-encoding") === "gzip") {
      // Decompress after verifying HMAC
      rawBody = gunzipSync(rawBuffer).toString("utf-8");
    } else {
      rawBody = rawBuffer.toString("utf-8");
    }

    // Parse the JSON payload
    const payload = JSON.parse(rawBody);
    console.log("Pinged!", payload);

    return new Response(
      JSON.stringify({ message: "Webhook received successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
