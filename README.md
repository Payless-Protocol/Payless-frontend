# Payless Protocol

A decentralized stolen-device registry on Base. Users can search a device IMEI before purchase, flag a lost or stolen device on-chain, and recover it later using the original secret phrase.

## Overview

Payless Protocol is built around a privacy-first model. Raw IMEI numbers and recovery phrases are normalized and hashed client-side before any contract interaction. The smart contract only receives `bytes32` hashes — no personally identifiable data is ever stored on-chain.

The protocol will support three tiers:

- **Tier 1** — User-initiated flag via IMEI and a 3-word secret phrase
- **Tier 2** — Physically verified flag via OCR and Chainlink oracle commit-reveal (in development)
- **Recovery** — Original owner unflagged using matching hashed credentials

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS |
| Web3 | wagmi v2, ethers.js v6, viem |
| Hashing | ethereum-cryptography (keccak256, browser-native) |
| Network | Base Mainnet (8453), Base Sepolia (84532) |
| Auth | Privy |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A Base RPC endpoint
- A deployed Payless Registry contract address

### Install

```bash
git clone https://github.com/Payless-Protocol/Payless-frontend.git
cd Payless-frontend
npm install
```

### Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourMainnetAddress
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_CHAIN_ID=84532

NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS=0xYourSepoliaAddress
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/YOUR_COINBASE_PAYMASTER_KEY

# The waitlist modal is live, so both Notion variables are required unless you disable the feature.
NOTION_WAITLIST_TOKEN=your_notion_token
NOTION_WAITLIST_DATABASE_ID=your_notion_database_id
```

### Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Project Structure

```
src/
├── app/                        # Next.js App Router routes (thin, metadata-only pages)
│   ├── search/                 # IMEI status lookup
│   ├── flag/                   # Tier 1 report flow
│   ├── recover/                # Unflag / recovery flow
│   └── api/waitlist/           # Waitlist submission endpoint
├── components/
│   ├── layout/                 # Navbar, Footer
│   ├── gates/                  # Multi-step flow UIs: SearchGate, FlagGate, RecoverGate
│   └── primitives/             # Shared UI: Button, Input, StatusBadge, HashPreview, StepIndicator
├── hooks/                      # Contract reads, writes, and hashing logic
│   ├── useDeviceStatus.ts      # Read registry state for a hashed IMEI
│   ├── useFlagDevice.ts        # Submit flagDevice transactions
│   ├── useUnflagDevice.ts      # Submit unflagDevice transactions
│   └── useHashedPayload.ts     # Memoized client-side keccak256 hashing
├── lib/                        # Pure utilities and contract wiring
│   ├── abi.ts                  # Contract ABI
│   ├── contract.ts             # Read/write helpers and error formatting
│   ├── hash.ts                 # keccak256 helpers using ethereum-cryptography
│   ├── status.ts               # Status enum and label mapping
│   ├── constants.ts            # Chain IDs, RPC URLs, contract addresses
│   └── basescan.ts             # Block explorer URL helpers
├── providers/
│   └── Web3Provider.tsx        # wagmi config and wallet provider composition
├── styles/
│   └── tokens.ts               # Design tokens
└── types/
    └── index.ts                # Shared TypeScript types
```

## How It Works

1. The user enters a 15-digit IMEI and a 3-word recovery phrase in the browser.
2. Both inputs are normalized locally, then hashed into `bytes32` values using keccak256 via `ethereum-cryptography`.
3. The contract receives only the hashed values — the raw inputs are never transmitted or stored.
4. The registry records or returns the current device status for the hashed IMEI.
5. To recover a flagged device, the owner re-enters the same credentials. The same normalization and hashing runs, and the resulting hashes are matched on-chain.

## Privacy Model

All hashing happens in the browser. The same normalization path runs across search, flag, and recover flows, which guarantees that identical raw inputs always produce identical on-chain lookup keys. No raw IMEI or recovery phrase reaches any server.

## Smart Contract Interface

```solidity
function flagDevice(bytes32 imeiHash, bytes32 secretHash) external;

function unflagDevice(bytes32 imeiHash, bytes32 secretHash) external;

function registry(bytes32 imeiHash)
    external
    view
    returns (bytes32 secretHash, uint64 updateAt, uint8 status);
```

**Status values:** `0` = Clean, `1` = Flagged, `2` = Verified

**Custom errors:** `AlreadyUnflagged`, `InvalidImei`, `InvalidSecret`, `Unauthorized`

**Events:**
- `Tier1(bytes32 indexed imeiHash, bytes32 secretHash)`
- `UnflagTier1(bytes32 indexed imeiHash, bytes32 secretHash)`

Guidelines for contributors:

- All hashing must remain client-side
- Route pages must stay thin — business logic belongs in hooks and gate components
- Use named exports and explicit TypeScript types throughout
- Chain configuration must be imported from `src/lib/constants.ts` — never hardcoded inline
- Do not expose raw IMEI or recovery phrases outside the browser under any circumstances

## License

MIT

## Acknowledgements

Built for the Base Student Track competition. Oracle infrastructure by Chainlink.
