# Kondivore

**Fuel for your training.** A voice-first AI fueling assistant for runners and triathletes: it plans meals around the training day, tracks carbs, protein and fat against daily targets, and can be talked to hands-free in the kitchen.

Kondivore is a solo-founder product in a live pilot in Vienna. This repository is shared for review; the code is not open source (see Notice).

## What it does

- **Training-aware meal planning.** Recipes are generated for the day's load (rest, long run, race day) and adapt once the day's carb target is already met.
- **Voice assistant.** Talk to the app through Gemini Live while cooking: ask what to eat before a long run, swap an ingredient, log a meal.
- **Photo input.** Scan a fridge or pantry to build an inventory; photograph a meal to estimate its macros.
- **Pantry and substitutions.** Expiry tracking, and swaps that use what is already in the kitchen, perishables first.
- **Households.** Several people with their own dietary constraints (vegan, gluten-free and so on) feed into the same generation prompts.
- **Installable web app (PWA)** with push notifications for expiring items and the weekly plan.

## Architecture

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS |
| Backend | Express (`server.ts`), bundled with esbuild to `dist/server.cjs` |
| AI | Gemini through `@google/genai`, server-side only |
| Data and auth | Firebase Auth and Firestore |
| Hosting | Google AI Studio / Cloud Run |

The browser never holds the Gemini key. Text and image calls go through authenticated `/api` routes. Voice sessions use a single-use ephemeral token minted by the server.

## Design decisions worth reading

- **Cost and abuse controls, built and switchable.** Per-user monthly AI cost cap, per-user API rate limit and a global daily spend ceiling are all implemented (`src/services/aiCostConfig.ts`, `aiUsage.ts`, `rateLimit.ts`). During the pilot they are switched off with one flag each (`CAP_ENFORCED`, `RATE_LIMIT_ENFORCED`, `DAILY_CEILING_ENFORCED`) while usage is metered. Switching on is a config change, not a rewrite.
- **Voice sessions are bounded.** The client disconnects after three quiet minutes or ten minutes in total, and the server-issued token expires in twelve.
- **Timeouts everywhere.** 60 s on Gemini calls, 120 s on app API calls, so a stalled upstream never hangs the app.
- **Failures are loud.** Client crashes, server errors and Gemini refusals (credits, spend cap) raise rate-limited email alerts to the maintainer.
- **Security.** Every `/api` route requires a verified Firebase ID token; Firestore rules are owner-scoped; request bodies are size-capped; security headers are set.
- **Health data is opt-in.** The app asks for an 18+ confirmation and explicit consent to process health-related data before use.
- **One-line rebrand.** All user-facing naming is in `src/brand.ts`.

## Run it locally

```bash
npm ci
cp .env.example .env     # set GEMINI_API_KEY
npm run dev
npm run lint             # tsc --noEmit
```

Firebase configuration is in `firebase-applet-config.json` (a public web config; access is enforced by `firestore.rules`). Server-side email alerts use a Gmail app password supplied as the `App_Password` secret and are skipped if it is not set.

## Status

Pilot stage. Not yet charging; no automated test suite yet.

## Notice

Copyright (c) 2026 Sudip Khan. All rights reserved. The source is published for review and discussion; it may not be copied, redistributed or used to run a competing service without written permission.
