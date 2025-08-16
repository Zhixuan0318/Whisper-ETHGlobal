import crypto from "crypto";

/**
 * Signs payload with HMAC SHA256
 * @param {object|string|Buffer} payload - JSON object, JSON string, or Buffer
 * @param {string} secret - Shared secret
 */
export default function signWebhookPayload(payload, secret) {
  let data;

  if (Buffer.isBuffer(payload)) {
    data = payload; // already raw bytes
  } else if (typeof payload === "string") {
    data = Buffer.from(payload, "utf-8"); // string as bytes
  } else if (typeof payload === "object" && payload !== null) {
    data = Buffer.from(JSON.stringify(payload), "utf-8"); // stringify only objects
  } else {
    throw new Error("Invalid payload type for signing");
  }

  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}
