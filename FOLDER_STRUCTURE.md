# Payless Protocol — Folder Structure

## Root
- `.env.local` — environment variables (never commit)
- `.npmrc` — `legacy-peer-deps=true` for Vercel
- `next.config.mjs` — webpack aliases for Privy/MetaMask deps
- `package.json` — dependencies
- `tsconfig.json` — TypeScript config (target: ES2020)

## src/app/
- `page.tsx` — Landing page
- `layout.tsx` — Root layout with Providers
- `search/page.tsx` — Search Gate (read-only IMEI lookup)
- `report/page.tsx` — Flag Gate (write: flagDevice)
- `retrieve/page.tsx` — Retrieve Gate (write: unflagDevice)
- `api/waitlist/` — Waitlist API route

## src/components/
- `Navbar.tsx` — Top navigation with auth buttons
- `AuthModal.tsx` — Privy login/logout buttons
- `Providers.tsx` — `PrivyProvider` + `WagmiProvider` + `QueryClient`
- `ErrorBoundary.tsx` — Global error boundary
- `gates/GateKit.tsx` — Shared UI primitives (Button, Panel, etc.)

## src/lib/
- `wagmi.ts` — wagmi config (chains, transports)
- `contract.ts` — Contract address helper + ethers providers
- `abi.ts` — Payless contract ABI
- `hash.ts` — keccak256 hashing (`hashIMEI`, `hashSecret`)
- `status.ts` — Device status parsing (`isDeviceFlagged` etc.)

## src/hooks/
- (shared hooks directory — currently using `lib/` for contract logic)

## src/styles/
- `tokens.ts` — Design system tokens

## src/types/
- `index.ts` — Shared TypeScript types
