import { AsyncLocalStorage } from 'node:async_hooks';
import type { Response, NextFunction } from 'express';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import type { AuthedRequest } from './authMiddleware';
import { FREE_TIER_MONTHLY_CAP_EUR, geminiCallCostEur } from './aiCostConfig';

/**
 * Server-side metering for the free-tier AI cap (see aiCostConfig.ts).
 *
 * Firestore (server only — clients have no rules for these collections, so they
 * can neither read nor write them):
 *   aiUsage/{uid}            { month: "2026-10", costEur: number, updatedAt }
 *   pilotTesters/{email}     any document = that user is exempt (email lowercase)
 *
 * Fails open: if Firestore can't be reached (e.g. missing server credentials),
 * requests are allowed and the problem is logged, so a metering fault never
 * breaks the app for users.
 */

let db: Firestore | null = null;
function firestore(): Firestore {
  if (!db) {
    const app = getApps()[0] ?? initializeApp({ projectId: firebaseConfig.projectId });
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
  return db;
}

/** Tests only: swap in a fake Firestore. */
export function __setFirestoreForTests(fake: any) {
  db = fake;
}

interface UsageContext {
  uid: string;
  costEur: number;
}
const usageContext = new AsyncLocalStorage<UsageContext>();

/** Adds a cost to the current request's running total (no-op outside a metered request). */
export function addRequestCostEur(eur: number) {
  const ctx = usageContext.getStore();
  if (ctx && eur > 0) ctx.costEur += eur;
}

/** Records one Gemini call's token usage against the current request. */
export function recordGeminiUsage(model: string, usage: any) {
  if (!usage) return;
  const input = usage.promptTokenCount ?? 0;
  const output = (usage.candidatesTokenCount ?? 0) + (usage.thoughtsTokenCount ?? 0);
  addRequestCostEur(geminiCallCostEur(model, input, output));
}

function currentMonth(d = new Date()) {
  return d.toISOString().slice(0, 7); // "YYYY-MM", UTC
}
function firstOfNextMonth(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1)).toISOString().slice(0, 10);
}

export interface UsageStatus {
  month: string;
  spentEur: number;
  capEur: number;
  exempt: boolean;
  locked: boolean;
  resetsOn: string;
}

export async function getUsageStatus(uid: string, email?: string): Promise<UsageStatus> {
  const month = currentMonth();
  const base = { month, capEur: FREE_TIER_MONTHLY_CAP_EUR, resetsOn: firstOfNextMonth() };
  try {
    const [pilotSnap, usageSnap] = await Promise.all([
      email ? firestore().collection('pilotTesters').doc(email.toLowerCase()).get() : Promise.resolve(null),
      firestore().collection('aiUsage').doc(uid).get(),
    ]);
    const exempt = !!pilotSnap?.exists;
    const data = usageSnap.exists ? usageSnap.data()! : null;
    const spentEur = data && data.month === month ? Number(data.costEur) || 0 : 0;
    return { ...base, spentEur, exempt, locked: !exempt && spentEur >= FREE_TIER_MONTHLY_CAP_EUR };
  } catch (err: any) {
    console.error('[USAGE] Could not read usage — allowing request (fail-open):', err?.message || err);
    return { ...base, spentEur: 0, exempt: false, locked: false };
  }
}

async function addUsage(uid: string, eur: number) {
  const month = currentMonth();
  const ref = firestore().collection('aiUsage').doc(uid);
  await firestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const prev = snap.exists && snap.data()!.month === month ? Number(snap.data()!.costEur) || 0 : 0;
    tx.set(ref, { month, costEur: prev + eur, updatedAt: new Date().toISOString() });
  });
}

/** Paths under /api that are never blocked by the cap. */
const UNMETERED = new Set(['/usage', '/settings/notifications']);

/**
 * Express middleware for /api (after requireFirebaseUser): blocks free users who
 * are over this month's cap with HTTP 402, otherwise meters the request.
 */
export async function enforceFreeTierCap(req: AuthedRequest, res: Response, next: NextFunction) {
  if (UNMETERED.has(req.path) || !req.uid) return next();
  const uid = req.uid;
  const status = await getUsageStatus(uid, req.email);
  if (status.locked) {
    return res.status(402).json({
      error: "You've used this month's free AI allowance.",
      code: 'free_limit_reached',
      resetsOn: status.resetsOn,
    });
  }
  const ctx: UsageContext = { uid, costEur: 0 };
  res.on('finish', () => {
    if (ctx.costEur > 0) {
      addUsage(uid, ctx.costEur).catch((err) =>
        console.error('[USAGE] Could not record usage:', err?.message || err),
      );
    }
  });
  usageContext.run(ctx, () => next());
}
