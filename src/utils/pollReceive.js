import fetch from "node-fetch";

const LAYERZERO_API_URL = "https://scan-testnet.layerzero-api.com/v1/messages/tx";

/**
 * Polls LayerZero API for delivery status of a txHash.
 *
 * @param {string} txHash - The transaction hash from quoteAndSend
 * @returns {Promise<string>} - Resolves when DELIVERED, throws if FAILED
 */
export default async function pollReceive(txHash) {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  console.log(`📡 Polling LayerZero for tx: ${txHash}...`);

  while (true) {
    try {
      const res = await fetch(`${LAYERZERO_API_URL}/${txHash}`, {
        headers: { accept: "application/json" },
      });

      if (!res.ok) {
        console.warn(`⚠️ Failed to fetch status for ${txHash}, retrying...`);
        await delay(1_000);
        continue;
      }

      const data = await res.json();
      const statusName = data?.data?.[0]?.status?.name;

      if (!statusName) {
        console.warn(`⚠️ No status found yet for ${txHash}, retrying...`);
        await delay(1_000);
        continue;
      }

      switch (statusName) {
        case "DELIVERED":
          console.log(`✅ Message DELIVERED for tx ${txHash}`);
          return "DELIVERED";

        case "INFLIGHT":
          console.log("🔄 Inflight...");
          break;

        case "FAILED":
          console.error(`❌ Delivery FAILED for tx ${txHash}`);
          throw new Error("Delivery failed");

        default:
          console.warn(`⚠️ Unknown status: ${statusName}`);
      }
    } catch (err) {
      console.error(`❗ Error polling status: ${err.message}`);
    }

    await delay(1_000); // Wait before next poll
  }
}
