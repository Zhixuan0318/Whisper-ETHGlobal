import crypto from "crypto";

export default function generateWebhookSecret() {
  return crypto.randomBytes(32).toString("hex");
}
