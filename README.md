# Sajilo Health

Sajilo Health is an npm-workspaces monorepo containing the Expo mobile app, a Next.js dashboard, and shared TypeScript packages.

## Workspaces

- `apps/mobile` — existing Expo Router application (`@sajilo/mobile`)
- `apps/web` — Next.js App Router dashboard (`@sajilo/web`)
- `packages/types` — shared domain types
- `packages/api` — shared API primitives
- `packages/validation` — shared validation helpers
- `packages/config` — shared product configuration and brand colors

## Getting started

Install all workspace dependencies once from the repository root:

```bash
npm install
```

Run the mobile app:

```bash
npm run dev:mobile
```

Run the web dashboard:

```bash
npm run dev:web
```

Open a native target with `npm run android` or `npm run ios`.

## Checks

```bash
npm run lint
npm run typecheck
npm run build:web
```
