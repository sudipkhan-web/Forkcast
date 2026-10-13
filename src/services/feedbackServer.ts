import nodemailer from 'nodemailer';

/**
 * In-app feedback: rate limiting and the notification email.
 *
 * The email is sent FROM and TO the dedicated feedback inbox (lytform.apps@gmail.com).
 * That inbox forwards to the founder's personal address with Gmail forwarding,
 * so the personal address never appears in the app.
 *
 * Secrets (set in AI Studio > Secrets / Cloud Run env), never in the client bundle:
 *   App_Password   Gmail app password of the sender (FEEDBACK_SMTP_PASS also works)
 * Optional overrides:
 *   FEEDBACK_SMTP_USER  default lytform.apps@gmail.com
 *   FEEDBACK_TO         default = FEEDBACK_SMTP_USER
 */

export const FEEDBACK_TYPES = ['Bug', 'Idea', 'Something confusing', 'Praise'] as const;
export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export const MAX_FEEDBACK_CHARS = 2000;
const MAX_PER_HOUR = 5;
const HOUR_MS = 60 * 60 * 1000;

// In-memory limiter (per server instance): fine for a small pilot.
const recent = new Map<string, number[]>();

export function allowFeedback(uid: string, now = Date.now()): boolean {
  const times = (recent.get(uid) || []).filter(t => now - t < HOUR_MS);
  if (times.length >= MAX_PER_HOUR) {
    recent.set(uid, times);
    return false;
  }
  times.push(now);
  recent.set(uid, times);
  return true;
}

export interface FeedbackPayload {
  type: FeedbackType;
  message: string;
  consentToContact: boolean;
  route?: string;
  appVersion?: string;
}

/** Returns a cleaned payload, or an error string. */
export function validateFeedback(body: any): { ok: true; value: FeedbackPayload } | { ok: false; error: string } {
  const type = body?.type;
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!FEEDBACK_TYPES.includes(type)) return { ok: false, error: 'Please choose a type.' };
  if (!message) return { ok: false, error: 'Please write a message.' };
  if (message.length > MAX_FEEDBACK_CHARS) {
    return { ok: false, error: `Please keep it under ${MAX_FEEDBACK_CHARS} characters.` };
  }
  const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.slice(0, n) : '');
  return {
    ok: true,
    value: {
      type,
      message,
      consentToContact: body?.consentToContact === true,
      route: clip(body?.route, 100),
      appVersion: clip(body?.appVersion, 50),
    },
  };
}

function smtpConfig() {
  const user = process.env.FEEDBACK_SMTP_USER || 'lytform.apps@gmail.com';
  const pass = (process.env.FEEDBACK_SMTP_PASS || process.env.App_Password || process.env.APP_PASSWORD || '').replace(/\s+/g, '');
  const to = process.env.FEEDBACK_TO || user;
  return { user, pass, to };
}

/** Sends the notification email. Resolves false (never throws) if email isn't configured or fails. */
export async function sendFeedbackEmail(opts: {
  feedback: FeedbackPayload;
  uid: string;
  email: string | null;
  userAgent: string;
}): Promise<boolean> {
  const { user, pass, to } = smtpConfig();
  if (!pass) {
    console.warn('[FEEDBACK] No SMTP password configured (App_Password); email not sent.');
    return false;
  }
  const { feedback, uid, email, userAgent } = opts;
  const first = feedback.message.replace(/\s+/g, ' ').slice(0, 60);
  const lines = [
    `Type: ${feedback.type}`,
    `Contact OK: ${feedback.consentToContact ? 'Yes' : 'No'}`,
    `Email: ${feedback.consentToContact && email ? email : '(not shared)'}`,
    `User ID: ${uid}`,
    `Screen: ${feedback.route || '-'}`,
    `App version: ${feedback.appVersion || '-'}`,
    `Device: ${userAgent || '-'}`,
    `Sent: ${new Date().toISOString()}`,
    '',
    'Message:',
    feedback.message,
  ];
  try {
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });
    await transport.sendMail({
      from: `Kondivore feedback <${user}>`,
      to,
      subject: `[Kondivore feedback] ${feedback.type}: ${first}`,
      text: lines.join('\n'),
    });
    return true;
  } catch (err: any) {
    console.error('[FEEDBACK] Email failed:', err?.message || err);
    return false;
  }
}
