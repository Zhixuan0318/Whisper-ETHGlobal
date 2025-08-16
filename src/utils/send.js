import { Wallet, JsonRpcProvider, Contract, parseEther } from "ethers";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import senderContractJson from "@/contracts/SourceOApp.json";
import supportedBlockchain from "@/data/supportedBlockchain.json";

/**
 * Send a message using SenderOApp via LayerZero.
 *
 * @param {string} sourceOApp - Address of the deployed SourceOApp on the source chain
 * @param {string} sourceChain - Source chain key from supportedBlockchain.json
 * @param {string} destinationChain - Destination chain key from EndpointId
 * @param {string} PRIVATE_KEY - Private key of the sender
 * @param {string} message - The message string to send
 * @returns {Promise<string>} - The transaction hash
 */
export default async function send(
  sourceOApp,
  sourceChain,
  destinationChain,
  PRIVATE_KEY,
  message
) {
  // Validate chains
  if (!supportedBlockchain[sourceChain]) {
    throw new Error(`Invalid source chain: ${sourceChain}`);
  }
  if (!EndpointId[destinationChain]) {
    throw new Error(`Invalid destination chain: ${destinationChain}`);
  }

  // Get RPC for the source chain
  const sourceRpc = supportedBlockchain[sourceChain].Rpc;
  if (!sourceRpc) {
    throw new Error(`Missing RPC URL for source chain: ${sourceChain}`);
  }

  const DST_EID = EndpointId[destinationChain];
  console.log(`📡 Source RPC: ${sourceRpc}`);
  console.log(`📡 Destination EID: ${DST_EID}`);

  // Setup provider, wallet, and contract
  const provider = new JsonRpcProvider(sourceRpc);
  const wallet = new Wallet(PRIVATE_KEY, provider);
  const contract = new Contract(sourceOApp, senderContractJson.abi, wallet);

  console.log(`🚀 Sending message from ${sourceChain} to ${destinationChain}: "${message}"`);
  
  const tx = await contract.send(DST_EID, message, {
    value: parseEther("1"),
    gasLimit: 1_000_000
  });
  console.log(`📤 Transaction sent: ${tx.hash}`);

  const receipt = await tx.wait();
  return receipt.hash;
}
