import { sendAlertEmail } from './feedbackServer';

/**
 * Crash and server-error alerts, so pilot problems are not silent.
 * - At most 1 alert email per hour per server instance (with a count of what was held back).
 * - At most 5 client reports per hour per user, so one broken browser cannot flood the inbox.
 * No personal data is sent: only message, screen, app version and a user id.
 */
const HOUR_MS = 60 * 60 * 1000;
const PER_USER_LIMIT = 5;

let lastEmailAt = 0;
let heldBack: string[] = [];
const userReports = new Map<string, number[]>();

function allowUserReport(uid: string, now: number): boolean {
  const recent = (userReports.get(uid) ?? []).filter((t) => now - t < HOUR_MS);
  if (recent.length >= PER_USER_LIMIT) {
    userReports.set(uid, recent);
    return false;
  }
  recent.push(now);
  userReports.set(uid, recent);
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [uid, list] of userReports) {
    if (!list.some((t) => now - t < HOUR_MS)) userReports.delete(uid);
  }
}, HOUR_MS).unref();

function trim(v: unknown, max: number): string {
  return String(v ?? '').replace(/[\r\n]+/g, ' ').slice(0, max);
}

/** Logs the error with a tag and emails the founder (rate-limited). */
export function reportError(tag: 'CLIENT-ERROR' | 'SERVER-ERROR', detail: string, now = Date.now()): void {
  const line = `${new Date(now).toISOString()} ${detail}`;
  console.error(`[${tag}] ${detail}`);
  if (now - lastEmailAt < HOUR_MS) {
    if (heldBack.length < 50) heldBack.push(`[${tag}] ${line}`);
    return;
  }
  const extra = heldBack;
  heldBack = [];
  lastEmailAt = now;
  void sendAlertEmail(
    `[Kondivore alert] ${tag === 'CLIENT-ERROR' ? 'App crash reported by a user' : 'Server error'}`,
    [
      `[${tag}] ${line}`,
      '',
      extra.length ? `${extra.length} more since the last alert email:\n${extra.join('\n')}` : 'No other errors since the last alert email.',
      '',
      'You get at most one of these emails per hour.',
    ].join('\n'),
  );
}

/** Handles a report from the browser. Returns false if this user is over their hourly limit. */
export function reportClientError(uid: string, body: any, now = Date.now()): boolean {
  if (!allowUserReport(uid, now)) return false;
  reportError(
    'CLIENT-ERROR',
    `user=${trim(uid, 40)} screen=${trim(body?.screen, 80)} version=${trim(body?.version, 40)} message=${trim(body?.message, 300)}`,
    now,
  );
  return true;
}
