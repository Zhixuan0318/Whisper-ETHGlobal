import { promisify } from "util";
import { gzip as nodeGzip } from "zlib";

const gzipPromise = promisify(nodeGzip);

export async function gzip(data) {
  if (typeof data !== "object" || data === null) {
    throw new Error("Input must be a valid JSON object");
  }

  const jsonString = JSON.stringify(data);
  const compressed = await gzipPromise(jsonString);
  return compressed;
}
