import { AsyncLocalStorage } from 'node:async_hooks';
import type { Response, NextFunction } from 'express';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import type { AuthedRequest } from './authMiddleware';
import { CAP_ENFORCED, FREE_TIER_MONTHLY_CAP_EUR, DAILY_CEILING_ENFORCED, DAILY_CEILING_EUR, geminiCallCostEur } from './aiCostConfig';
import { sendAlertEmail } from './feedbackServer';

/**
 * Server-side metering for the free-tier AI cap (see aiCostConfig.ts).
 *
 * Firestore (server only — clients have no rules for these collections, so they
 * can neither read nor write them):
 *   aiUsage/{uid}            { month: "2026-10", costEur: number, updatedAt }
 *   aiUsage/_global-YYYY-MM-DD  { costEur } server-wide spend for that UTC day
 *   pilotTesters/{email}     any document = that user is exempt (email lowercase;
 *                            only counts when the Firebase token says email_verified)
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

export async function getUsageStatus(uid: string, email?: string | null, emailVerified = false): Promise<UsageStatus> {
  const month = currentMonth();
  const base = { month, capEur: FREE_TIER_MONTHLY_CAP_EUR, resetsOn: firstOfNextMonth() };
  try {
    const [pilotSnap, usageSnap] = await Promise.all([
      email && emailVerified ? firestore().collection('pilotTesters').doc(email.toLowerCase()).get() : Promise.resolve(null),
      firestore().collection('aiUsage').doc(uid).get(),
    ]);
    // During the pilot (CAP_ENFORCED = false) everyone is exempt; usage is still recorded.
    const exempt = !CAP_ENFORCED || !!pilotSnap?.exists;
    const data = usageSnap.exists ? usageSnap.data()! : null;
    const spentEur = data && data.month === month ? Number(data.costEur) || 0 : 0;
    return { ...base, spentEur, exempt, locked: !exempt && spentEur >= FREE_TIER_MONTHLY_CAP_EUR };
  } catch (err: any) {
    console.error('[USAGE] Could not read usage — allowing request (fail-open):', err?.message || err);
    return { ...base, spentEur: 0, exempt: false, locked: false };
  }
}

function globalDayDocId(d = new Date()) {
  return `_global-${d.toISOString().slice(0, 10)}`;
}

async function addUsage(uid: string, eur: number) {
  const month = currentMonth();
  const ref = firestore().collection('aiUsage').doc(uid);
  const globalRef = firestore().collection('aiUsage').doc(globalDayDocId());
  await firestore().runTransaction(async (tx) => {
    const [snap, gSnap] = await Promise.all([tx.get(ref), tx.get(globalRef)]);
    const prev = snap.exists && snap.data()!.month === month ? Number(snap.data()!.costEur) || 0 : 0;
    const gPrev = gSnap.exists ? Number(gSnap.data()!.costEur) || 0 : 0;
    tx.set(ref, { month, costEur: prev + eur, updatedAt: new Date().toISOString() });
    tx.set(globalRef, { costEur: gPrev + eur, updatedAt: new Date().toISOString() });
  });
}

let lastCeilingAlertDay = '';

/** True if today's server-wide spend has reached the daily ceiling (fails open). */
async function dailyCeilingReached(): Promise<boolean> {
  if (!DAILY_CEILING_ENFORCED) return false;
  try {
    const snap = await firestore().collection('aiUsage').doc(globalDayDocId()).get();
    const spent = snap.exists ? Number(snap.data()!.costEur) || 0 : 0;
    if (spent < DAILY_CEILING_EUR) return false;
    const day = new Date().toISOString().slice(0, 10);
    if (lastCeilingAlertDay !== day) {
      lastCeilingAlertDay = day;
      void sendAlertEmail(
        '[Kondivore alert] Daily AI ceiling reached',
        `Today's AI spend reached EUR ${spent.toFixed(2)} (ceiling EUR ${DAILY_CEILING_EUR}). AI features are paused for all users until 00:00 UTC. If this is normal growth, raise DAILY_CEILING_EUR in aiCostConfig.ts; if not, look for many new accounts. You get at most one of these emails per day.`,
      );
    }
    return true;
  } catch (err: any) {
    console.error('[USAGE] Could not read daily total — allowing request (fail-open):', err?.message || err);
    return false;
  }
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
  if (await dailyCeilingReached()) {
    return res.status(503).json({ error: 'AI is resting until tomorrow. Please try again later.', code: 'daily_ceiling' });
  }
  const status = await getUsageStatus(uid, req.email, req.emailVerified);
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
