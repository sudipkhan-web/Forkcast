import { auth } from '../firebase';

/** Fired on window when the server says this month's free AI allowance is used up. */
export const FREE_LIMIT_EVENT = 'free-limit-reached';

/**
 * fetch() for our own /api endpoints.
 * Attaches the signed-in user's Firebase ID token so the server can verify
 * who is calling. The server rejects AI requests without a valid token.
 * If the server answers 402 (free allowance used up), FREE_LIMIT_EVENT is
 * dispatched so the app can show the lock screen.
 */
export async function apiFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(url, { ...init, headers });
  if (res.status === 402) {
    const body = await res.clone().json().catch(() => ({}));
    if (body?.code === 'free_limit_reached') {
      window.dispatchEvent(new CustomEvent(FREE_LIMIT_EVENT, { detail: { resetsOn: body.resetsOn } }));
    }
  }
  return res;
}
