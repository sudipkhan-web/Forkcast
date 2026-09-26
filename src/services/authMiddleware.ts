import type { Request, Response, NextFunction } from 'express';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Verifying Firebase ID tokens only needs the project ID (Google's public
// signing keys are fetched automatically), so no service-account key is required.
if (!getApps().length) {
  initializeApp({ projectId: firebaseConfig.projectId });
}

export interface AuthedRequest extends Request {
  uid?: string;
}

/**
 * Rejects /api requests that don't carry a valid Firebase ID token.
 * Stops anyone who finds the app URL from using the AI endpoints (and the
 * Gemini bill) without signing in, and tells the server which user is calling.
 */
export async function requireFirebaseUser(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).json({ error: 'Please sign in to use this feature.' });
  }
  try {
    const decoded = await getAuth().verifyIdToken(match[1]);
    req.uid = decoded.uid;
    next();
  } catch (err: any) {
    console.warn('[AUTH] Rejected API request:', err?.code || err?.message);
    return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  }
}
