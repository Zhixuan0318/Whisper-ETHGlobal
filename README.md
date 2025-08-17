<div align="center">
    <img src="https://github.com/user-attachments/assets/ae822f59-02fe-472c-af5b-c13ab2d88395" width=100>
    <h1>Whisper</h1>
    <strong>Omnichain Messaging Channels for 🤖 Agentic Workflow on any EVM chains.</strong>  
</div>

<br>

## Description

🔥 **Trend:**
Omnichain technology is rapidly gaining momentum (according to recent statistics from LayerZero), bringing seamless cross-chain interoperability to EVM ecosystems like Flow. This enhances composability, improves user experience, broadens accessibility, and unlocks innovative use cases beyond siloed environments.

💡 **Inspiration:**
The concept of omnichain AI agents is now possible on EVM chains by combining LayerZero’s cross-chain capabilities with agent kits and frameworks. Potential use cases include:

- **Omnichain DAO** – An agent on one EVM chain coordinates with an agent on another, enabling DAO-to-DAO cross-chain collaboration.
- **Omnichain prediction market** – An agent on one EVM chain retrieves oracle data and passes it to an agent on another chain to place bets.
- **Omnichain NFT** – An agent on one EVM chain triggers an event that prompts an agent on a different chain to upgrade the token on-chain.

💪 **Challenge:**
Manually setting up an omnichain agent architecture on EVM chains is complex and error-prone. Developers must deploy and configure O-App contracts across chains, connect peers, handle cross-chain messaging, and secure agent endpoints—all without automation. This adds significant development time, overhead, and security risk. A more user-friendly omnichain developer experience is needed.

👻 **Whisper reduces 85% of the setup hassle + no-code + handles everything:**
EVM-compatible chain via LayerZero. Instead of manually deploying contracts, configuring endpoints, and managing message flow, developers just connect a wallet, choose a destination chain, and define a webhook—Whisper handles the rest.

With automated contract deployment, peer setup, polling, logging, and webhook execution, Whisper abstracts away the complexity of LayerZero infrastructure. This lets developers focus on agent logic rather than plumbing. From a simple “Hello World” to complex cross-chain workflows, Whisper makes omnichain messaging secure, reliable, and accessible with a single API call.

⭐ **Key Features:**
- **Quick channel setup** – Select chain, bind webhook, click **Create**.
- **One-click OApp deploy** – Fund with gas tokens, Whisper deploys automatically.
- **Agent-ready endpoint** – Unique endpoint + API key for cross-chain messages.
- **Auto tracking** – Messages tracked from in-flight to delivered.
- **Webhook triggers** – Run post-actions on message arrival.

## How it's made?

Whisper leverages **Dynamic’s** non-custodial embedded wallet service to provide a seamless onboarding experience for AI agent developers, abstracting complexity while offering familiar UX options such as social logins or preferred wallets. Whisper supports all EVM chains compatible with the **LayerZero V2** protocol; for this MVP, we extracted metadata from 10 networks using official LayerZero deployment data, including endpoints, EIDs, thumbnails, and more.

In the demo, we show how a developer on **Flow EVM** can spin up omnichain messaging channels with any other EVM chain in the ecosystem. When a user selects a source and destination chain from Whisper’s supported networks, Whisper opens a channel in a pending state, assigns a funding wallet (EOA), and allows the developer to fund it with the native gas token. Dynamic’s `useDynamicContext` and `useSendBalance` hooks streamline this process, providing a smooth experience.

Once funded, the developer clicks **One-Click Deploy**. Behind the scenes, Whisper’s prebuilt pipeline deploys the compiled **LayerZero V2 OApp** contracts (sender and receiver) to both selected chains with the correct endpoints, then configures the OApps to recognize each other as peers. Once successfully set up, the channel is ready for omnichain messaging.

Whisper exposes each channel through a dedicated endpoint with an access key, enabling cross-chain messaging via a single API call. Channels are compatible with any agent kit, agent framework, or AI client. Whisper tracks messages from in-flight to delivered using the **LayerZero Scan Swagger-based API**.

Designed for modularity and flexibility, Whisper allows developers to attach **webhooks** to channels. When a cross-chain message arrives at the destination, the webhook automatically triggers with the message payload, enabling post-action workflows and unlocking a wide range of use cases. HMAC verification is used for security.


