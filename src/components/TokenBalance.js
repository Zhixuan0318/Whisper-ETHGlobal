'use client';

import { useEffect, useState } from 'react';
import { createPublicClient, http, formatEther } from 'viem';

export default function TokenBalance({ label, rpcUrl, address, symbol }) {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (!rpcUrl || !address) return;

    const fetchBalance = async () => {
      try {
        const client = createPublicClient({ transport: http(rpcUrl) });
        const raw = await client.getBalance({ address });
        const formatted = `${formatEther(raw)} ${symbol}`;
        setBalance(formatted);
      } catch (err) {
        console.error(`Failed to fetch balance for ${label}:`, err);
        setBalance(`0 ${symbol}`);
      }
    };

    fetchBalance();
  }, [rpcUrl, address, symbol, label]);

  return (
    <p>
      <strong>{label}:</strong> {balance ?? 'Loading...'}
    </p>
  );
}
