import { sendAlertEmail } from './feedbackServer';

/**
 * Emails the founder (once per 24 hours per server instance) when Gemini refuses
 * calls because prepaid credits or the monthly spend cap ran out. Without this,
 * voice and recipes just stop for every user and nobody notices.
 *
 * Only billing/quota-type errors count. A plain per-minute rate limit (HTTP 429)
 * is NOT an alert.
 */
const BILLING_ERROR = /prepay|credits? (are |is )?(depleted|exhausted)|depleted|spend cap|spending cap|billing|exceeded your current quota|quota exceeded/i;
const DAY_MS = 24 * 60 * 60 * 1000;
let lastAlertAt = 0;

export function isGeminiBillingError(err: unknown): boolean {
  const text = [
    (err as any)?.message,
    (err as any)?.error?.message,
    (err as any)?.statusText,
    typeof err === 'string' ? err : '',
  ].filter(Boolean).join(' ');
  return BILLING_ERROR.test(text);
}

export function notifyIfGeminiBillingError(err: unknown, now = Date.now()): boolean {
  if (!isGeminiBillingError(err)) return false;
  if (now - lastAlertAt < DAY_MS) return true;
  lastAlertAt = now;
  const detail = String((err as any)?.message || err).slice(0, 600);
  void sendAlertEmail(
    '[Kondivore alert] Gemini AI stopped working (spend cap or credits)',
    [
      'Gemini refused a request because the prepaid credits or the monthly spend cap ran out.',
      'Until this is fixed, voice and recipe generation fail for all users, and recipes silently fall back to the built-in ones.',
      '',
      'What to do:',
      '1. Open ai.studio, project ChefsPlate, Spend page.',
      '2. Raise the monthly spend cap ("Edit spend cap") or top up credits. The cap resets on the 1st of each month (PST).',
      '',
      `Time: ${new Date(now).toISOString()}`,
      `Error: ${detail}`,
      '',
      'You get at most one of these emails per day.',
    ].join('\n'),
  );
  return true;
}
