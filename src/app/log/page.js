'use client';

import { useAccount } from 'wagmi';
import RequestCard from '@/components/RequestCards';

export default function Home() {
  const { address } = useAccount();

  return (
    <RequestCard walletAddress={address}/>
  );
}