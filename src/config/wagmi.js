import { createConfig, http } from "wagmi";
import { flowTestnet } from "viem/chains";

export const config = createConfig({
  chains: [flowTestnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [flowTestnet.id]: http(),
  },
});
