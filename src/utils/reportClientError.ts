import { apiFetch } from './apiFetch';

/** Max reports per page load, so an error loop cannot spam the server. */
const MAX_PER_LOAD = 3;
let sent = 0;

/** Tells the server the app crashed (message, screen, version only; no personal data). Never throws. */
export function reportClientError(message: unknown): void {
  if (sent >= MAX_PER_LOAD) return;
  sent++;
  try {
    void apiFetch('/api/client-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: String((message as any)?.message || message || 'unknown').slice(0, 300),
        screen: window.location.pathname + window.location.hash,
        version: (import.meta as any).env?.VITE_APP_VERSION || 'dev',
      }),
    }).catch(() => {});
  } catch {
    // reporting must never break the app
  }
}
