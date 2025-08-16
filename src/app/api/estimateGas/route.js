import { NextResponse } from "next/server";
import { JsonRpcProvider, ContractFactory, Wallet, formatEther } from "ethers";

const PRIVATE_KEY = process.env.DEMO_PRIVATE_KEY;

export async function POST(request) {
  try {
    if (!PRIVATE_KEY) {
      return NextResponse.json({ error: "Private key not set" }, { status: 500 });
    }

    const body = await request.json();
    const { rpc, endpoint, contractJson, symbol = "NATIVE" } = body;

    if (!rpc || !endpoint || !contractJson?.abi || !contractJson?.bytecode) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const provider = new JsonRpcProvider(rpc);
    const wallet = new Wallet(PRIVATE_KEY, provider);

    const factory = new ContractFactory(contractJson.abi, contractJson.bytecode, wallet);
    const tx = await factory.getDeployTransaction(endpoint);
    const gasEstimate = await wallet.estimateGas(tx);

    const gasPriceHex = await provider.send("eth_gasPrice", []);
    const gasPrice = BigInt(gasPriceHex);

    const totalCostWei = gasEstimate * gasPrice;
    const totalCost = parseFloat(formatEther(totalCostWei)).toFixed(6);

    return NextResponse.json({
      gas: gasEstimate.toString(),
      cost: totalCost,
      formatted: `${gasEstimate.toString()} (~${totalCost} ${symbol})`,
    });
  } catch (err) {
    console.error("Estimate Gas Error:", err);
    return NextResponse.json({ error: "Estimation failed", details: err.message }, { status: 500 });
  }
}
