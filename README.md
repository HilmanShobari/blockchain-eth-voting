# E-Vote Blockchain

A secure and transparent voting system built on Ethereum blockchain with modern UI and comprehensive features.

## Features

- 🗳️ **Decentralized Voting**: Blockchain-based voting system
- 📝 **Custom Voting Titles**: Create votings with descriptive titles
- 🏷️ **Named Choices**: Add custom names for voting choices
- 👥 **Manager Dashboard**: Separate interface for voting creators
- 🔐 **Voter Management**: Add allowed voters to campaigns
- 📊 **Real-time Results**: Live vote counting with percentages
- 🎨 **Modern UI**: Fresh, attractive design with animations
- 📱 **Responsive**: Works on all device sizes

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_factory_contract_address
NEXT_PUBLIC_MNEMONIC_PHRASE="your twelve word mnemonic phrase"
NEXT_PUBLIC_RPC=your_rpc_endpoint_url
```

### 2. Installation

```bash
npm install --legacy-peer-deps
```

**Note**: We use `--legacy-peer-deps` due to compatibility with Next.js and Web3.js v4.

### 3. Smart Contract

```bash
# Compile contracts
npm run compile

# Deploy contracts (optional - for new deployment)
npm run deploy
```

### 4. Start Development Server

```bash
npm run dev
```

Access the application at http://localhost:3000

## Usage

### For Voters

- Visit the homepage to see available voting campaigns
- Click "View Voting" to participate in a voting session
- Select your choice and vote (requires wallet connection)

### For Managers

- Access `/manager` or click "Manager Dashboard"
- Create new voting campaigns with titles and choice names
- Manage allowed voters for your campaigns
- Monitor voting progress and results

## Technology Stack

- **Frontend**: Next.js 13.x, React 18, Semantic UI React
- **Blockchain**: Web3.js v4.16.0, Ethereum
- **Smart Contracts**: Solidity 0.8.18
- **Development**: Node.js, npm

## Web3.js v4 Migration

This project has been updated to use **Web3.js v4.16.0** with the following key changes:

### Key Updates

- ✅ Import syntax: `import { Web3 } from "web3"`
- ✅ Simplified provider initialization
- ✅ Enhanced TypeScript support
- ✅ Better performance and tree-shaking
- ✅ Native BigInt support

### Breaking Changes Fixed

1. **Import Statement**: Changed from `import Web3 from "web3"` to `import { Web3 } from "web3"`
2. **Provider Initialization**: Direct RPC URL instead of explicit HttpProvider
3. **Enhanced Error Handling**: Better error messages and debugging

## Troubleshooting

If you see "Connection Error":

1. Ensure MetaMask is installed and connected
2. Check your `.env` configuration
3. Verify the contract address is correct
4. Make sure you're on the correct network

### Web3.js v4 Specific Issues

- If you encounter dependency conflicts, use `npm install --legacy-peer-deps`
- Make sure your RPC endpoint supports the latest JSON-RPC specifications
- For TypeScript projects, Web3.js v4 provides better type safety
