import type { Response, NextFunction } from 'express';
import type { AuthedRequest } from './authMiddleware';

/**
 * Simple in-memory, per-user request limiter for /api (sliding one-minute window).
 * It protects the Gemini bill from one account hammering the AI routes while the
 * monthly free-tier cap is switched off (pilot mode). Per server instance only.
 */
/** Pilot mode: limiter is wired in but switched off. Set to true to enforce API_REQUESTS_PER_MINUTE. */
export const RATE_LIMIT_ENFORCED = false;

const WINDOW_MS = 60_000;
export const API_REQUESTS_PER_MINUTE = 60;

const hits = new Map<string, number[]>();

/** Returns true if the call is allowed and records it. */
export function allowApiCall(uid: string, now = Date.now(), limit = API_REQUESTS_PER_MINUTE): boolean {
  const recent = (hits.get(uid) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= limit) {
    hits.set(uid, recent);
    return false;
  }
  recent.push(now);
  hits.set(uid, recent);
  return true;
}

/** Drops idle users so the map cannot grow without bound. */
setInterval(() => {
  const now = Date.now();
  for (const [uid, list] of hits) {
    if (!list.some((t) => now - t < WINDOW_MS)) hits.delete(uid);
  }
}, 5 * WINDOW_MS).unref();

/** Express middleware: place after requireFirebaseUser. */
export function apiRateLimit(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!RATE_LIMIT_ENFORCED || !req.uid || allowApiCall(req.uid)) return next();
  res.set('Retry-After', '60');
  return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
}
