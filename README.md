# Payless Registry

Frontend scaffold for the Payless Registry, a decentralized stolen device registry built on Base.

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

2. Copy environment values into `.env.local`:

   ```bash
   CONTRACT_ADDRESS=
   RPC_URL=
   CHAIN_ID=
   ```

3. Run the app:

   ```bash
   npm run dev
   ```

## Notes

- `.env.example` is committed as a safe template.
- `.env.local` stays local and is ignored by Git.
- This branch contains the initial scaffold only.
