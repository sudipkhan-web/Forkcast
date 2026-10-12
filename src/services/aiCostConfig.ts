/**
 * Free-tier AI cost cap — all the numbers live here.
 *
 * How it works: every Gemini call reports how many tokens it used. The server
 * converts that to euros with the price table below and keeps a running total
 * per user per calendar month (UTC). When a free user's total reaches the cap,
 * the app locks until the 1st of next month and offers the subscription waitlist.
 * Pilot testers (Firestore collection `pilotTesters`, document ID = their email
 * in lowercase) are exempt.
 */

/** Monthly AI allowance per free user, in euros. */
export const FREE_TIER_MONTHLY_CAP_EUR = 0.5;

/** Approximate USD→EUR rate used to convert Google's USD prices. Update occasionally. */
export const USD_TO_EUR = 0.92;

/**
 * Voice sessions (Gemini Live) stream straight from the browser, so the server
 * can't see their token counts. Each voice session is charged this flat estimate.
 */
export const VOICE_SESSION_ESTIMATE_EUR = 0.03;

type Price = { inputPerMillionUsd: number; outputPerMillionUsd: number };

/**
 * Gemini API paid-tier prices (USD per 1M tokens), from ai.google.dev/gemini-api/docs/pricing
 * (checked 2026-09-25). Each model lists prices with the date they take effect.
 * Thinking tokens are billed as output. Image-model output is image tokens
 * (roughly 1,300 tokens ≈ US$0.08 per generated image).
 */
const PRICES: Record<string, { from: string; price: Price }[]> = {
  'gemini-3.6-flash': [
    { from: '2000-01-01', price: { inputPerMillionUsd: 0.75, outputPerMillionUsd: 3.75 } },
    { from: '2027-01-01', price: { inputPerMillionUsd: 1.5, outputPerMillionUsd: 7.5 } },
  ],
  'gemini-3.5-flash-lite': [
    { from: '2000-01-01', price: { inputPerMillionUsd: 0.3, outputPerMillionUsd: 2.5 } },
  ],
  'gemini-3.1-flash-image': [
    { from: '2000-01-01', price: { inputPerMillionUsd: 0.5, outputPerMillionUsd: 60 } },
  ],
};

/** Used for any model missing from the table — deliberately on the expensive side. */
const UNKNOWN_MODEL_PRICE: Price = { inputPerMillionUsd: 1.5, outputPerMillionUsd: 7.5 };

function priceFor(model: string, when: Date): Price {
  const entries = PRICES[model];
  if (!entries) return UNKNOWN_MODEL_PRICE;
  const day = when.toISOString().slice(0, 10);
  let current = entries[0].price;
  for (const e of entries) if (e.from <= day) current = e.price;
  return current;
}

/** Cost in euros of one Gemini call. */
export function geminiCallCostEur(model: string, inputTokens: number, outputTokens: number, when = new Date()): number {
  const p = priceFor(model, when);
  const usd = (inputTokens * p.inputPerMillionUsd + outputTokens * p.outputPerMillionUsd) / 1_000_000;
  return usd * USD_TO_EUR;
}
