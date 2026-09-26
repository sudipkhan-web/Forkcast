import { auth } from '../firebase';

/**
 * fetch() for our own /api endpoints.
 * Attaches the signed-in user's Firebase ID token so the server can verify
 * who is calling. The server rejects AI requests without a valid token.
 */
export async function apiFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(url, { ...init, headers });
}
