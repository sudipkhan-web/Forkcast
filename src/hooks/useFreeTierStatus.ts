import { useEffect, useState } from 'react';
import { apiFetch, FREE_LIMIT_EVENT } from '../utils/apiFetch';

export interface FreeTierStatus {
  locked: boolean;
  resetsOn?: string;
}

/**
 * Whether the signed-in user's free AI allowance for this month is used up.
 * Checked once on sign-in (GET /api/usage) and flipped to locked whenever any
 * API call comes back with 402 free_limit_reached.
 */
export function useFreeTierStatus(userId: string | null | undefined): FreeTierStatus {
  const [status, setStatus] = useState<FreeTierStatus>({ locked: false });

  useEffect(() => {
    if (!userId) {
      setStatus({ locked: false });
      return;
    }
    let cancelled = false;
    apiFetch('/api/usage')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setStatus({ locked: !!data.locked, resetsOn: data.resetsOn });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    const onLimit = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      setStatus({ locked: true, resetsOn: detail.resetsOn });
    };
    window.addEventListener(FREE_LIMIT_EVENT, onLimit);
    return () => window.removeEventListener(FREE_LIMIT_EVENT, onLimit);
  }, []);

  return status;
}
