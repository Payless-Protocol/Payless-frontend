# Payless Registry

Payless Registry is a frontend for a decentralized stolen-device registry built on Base.
The current UI uses a dark, glassy visual system with a blue accent, a marketing-style
landing page, and three dedicated gate routes for search, flagging, and retrieval.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- ethers.js v6

## Project Structure

- `src/app` - App Router pages and root layout
- `src/components` - Shared UI, gate, and layout components
- `src/lib` - Contract and crypto helpers
- `src/hooks` - React hooks for wallet and registry actions
- `src/styles` - Global design tokens and CSS variables
- `src/types` - Shared TypeScript types

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add local environment values to `.env.local`:

   ```bash
   NEXT_PUBLIC_CONTRACT_ADDRESS=
   NEXT_PUBLIC_RPC_URL=
   NEXT_PUBLIC_CHAIN_ID=
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## UI Notes

- The landing page mirrors the provided reference with hero, tools, benefits, and CTA sections.
- `Navbar` and `Footer` are shared across routes to keep the experience consistent.
- `next.config.mjs` is used because this Next.js version does not load `next.config.ts`.
- Gate pages are wired for live contract integration and the Search gate is connected to `registry()`.
