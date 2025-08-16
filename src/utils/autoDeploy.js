import {
  Wallet,
  ContractFactory,
  JsonRpcProvider,
  zeroPadValue,
  getAddress,
} from "ethers";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import supportedBlockchain from "@/data/supportedBlockchain.json";

// Import contract JSONs
import senderContractJson from "@/contracts/SourceOApp.json";
import receiverContractJson from "@/contracts/DestinationOApp.json";

// Helper to convert address to bytes32
const toBytes32Address = (address) => zeroPadValue(getAddress(address), 32);

/**
 * Auto-deploy SourceOApp on sourceChain and DestinationOApp on destinationChain,
 * then set peers in both directions.
 *
 * @param {string} sourceChainKey - Key from supportedBlockchain.json for source chain
 * @param {string} destinationChainKey - Key from supportedBlockchain.json for destination chain
 * @param {string} privateKey - Wallet private key
 * @returns {Promise<{source: {address: string, eid: number}, destination: {address: string, eid: number}}>}
 */
export default async function autoDeploy(sourceChainKey, destinationChainKey, privateKey) {
  const srcConfig = supportedBlockchain[sourceChainKey];
  const destConfig = supportedBlockchain[destinationChainKey];

  if (!srcConfig) throw new Error(`Invalid source chain: ${sourceChainKey}`);
  if (!destConfig) throw new Error(`Invalid destination chain: ${destinationChainKey}`);

  const sourceEid = EndpointId[sourceChainKey];
  const destinationEid = EndpointId[destinationChainKey];

  if (!sourceEid) throw new Error(`Missing EndpointId for ${sourceChainKey}`);
  if (!destinationEid) throw new Error(`Missing EndpointId for ${destinationChainKey}`);

  const ownerWallet = (rpc) => {
    const provider = new JsonRpcProvider(rpc);
    return new Wallet(privateKey, provider);
  };

  const deployContract = async (wallet, endpoint, label, contractJson) => {
    const factory = new ContractFactory(
      contractJson.abi,
      contractJson.bytecode,
      wallet
    );

    console.log(`Deploying ${label}...`);
    console.log(`Constructor args: endpoint=${endpoint}`);

    const contract = await factory.deploy(endpoint);
    await contract.waitForDeployment();

    console.log(`✅ ${label} deployed at ${contract.target}`);
    return contract;
  };

  // Create wallets
  const srcWallet = ownerWallet(srcConfig.Rpc);
  const destWallet = ownerWallet(destConfig.Rpc);

  // 1. Deploy SourceOApp on source chain
  const sourceContract = await deployContract(
    srcWallet,
    srcConfig.Endpoint,
    `SourceOApp (${srcConfig.Name})`,
    senderContractJson
  );

  // 2. Deploy DestinationOApp on destination chain
  const destContract = await deployContract(
    destWallet,
    destConfig.Endpoint,
    `DestinationOApp (${destConfig.Name})`,
    receiverContractJson
  );

  // 3. Set peers
  console.log("Setting peers...");

  // Source peer set
  const srcTx = await sourceContract.setPeer(
    destinationEid,
    toBytes32Address(destContract.target),
    // { gasLimit: 500000 }
  );
  await srcTx.wait();
  console.log(`🔁 ${srcConfig.Name} setPeer(${destinationEid}, ${destContract.target})`);

  // Destination peer set
  const destTx = await destContract.setPeer(
    sourceEid,
    toBytes32Address(sourceContract.target)
  );
  await destTx.wait();
  console.log(`🔁 ${destConfig.Name} setPeer(${sourceEid}, ${sourceContract.target})`);

  return {
    source: {
      address: sourceContract.target,
      eid: sourceEid,
    },
    destination: {
      address: destContract.target,
      eid: destinationEid,
    },
  };
}
