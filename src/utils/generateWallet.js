import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';

export default function generateWallet() {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  return {
    address: account.address,
    privateKey: privateKey,
  };
}
