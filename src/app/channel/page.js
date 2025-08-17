'use client';

import { useAccount } from 'wagmi';
import ChannelCard from '@/components/ChannelCards';

export default function Home() {
  const { address } = useAccount();

  return (
    <ChannelCard walletAddress={address}/>
  );
}
