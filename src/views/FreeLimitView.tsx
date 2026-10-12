import React, { useState } from 'react';
import { Hourglass, Check } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { CARD, PRIMARY_BUTTON } from '../styles/designTokens';
import { BRAND } from '../brand';

interface Props {
  userId: string;
  resetsOn?: string; // "YYYY-MM-DD"
  alreadyOnWaitlist?: boolean;
}

function formatDate(iso?: string) {
  if (!iso) return 'the 1st of next month';
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' });
}

/**
 * Shown instead of the app when a free user has used this month's AI allowance.
 * Paid plans don't exist yet, so "subscribe" means joining the waitlist
 * (saved as waitlistJoinedAt on the user's profile).
 */
export function FreeLimitView({ userId, resetsOn, alreadyOnWaitlist }: Props) {
  const [joined, setJoined] = useState(!!alreadyOnWaitlist);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const joinWaitlist = async () => {
    setSaving(true);
    setError('');
    try {
      await setDoc(doc(db, 'users', userId), { waitlistJoinedAt: new Date().toISOString() }, { merge: true });
      setJoined(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-[#17181C] p-4 font-sans">
      <div className={`${CARD} w-full max-w-md p-8 sm:p-10 text-center flex flex-col items-center`}>
        <div className="w-20 h-20 bg-[#FC5200]/15 text-[#FC5200] rounded-full flex items-center justify-center mx-auto mb-6">
          <Hourglass className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-display font-bold text-white mb-3">You've used this month's free {BRAND.name}</h1>
        <p className="text-stone-400 text-sm mb-6">
          Free accounts include a monthly amount of AI meal planning. Yours resets on {formatDate(resetsOn)}.
        </p>
        <p className="text-stone-400 text-sm mb-8">
          Want to keep going? Subscriptions are coming soon. Join the waitlist and we'll let you know as soon as they open.
        </p>

        {joined ? (
          <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-800 text-stone-200 text-sm font-medium">
            <Check className="w-4 h-4 text-[#FC5200]" /> You're on the waitlist
          </div>
        ) : (
          <button onClick={joinWaitlist} disabled={saving} className={`${PRIMARY_BUTTON} w-full py-3 text-sm`}>
            {saving ? 'Saving…' : 'Join the subscription waitlist'}
          </button>
        )}
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        <button
          onClick={() => signOut(auth)}
          className="text-stone-500 text-sm hover:text-white mt-6 font-medium transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
