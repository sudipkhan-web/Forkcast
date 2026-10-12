import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { deleteUser, signOut } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { CARD, PRIMARY_BUTTON } from '../styles/designTokens';
import { BRAND } from '../brand';
import { ConsentCheckboxes, CONSENT_TEXT } from '../components/ConsentCheckboxes';

interface TermsGateViewProps {
  onAccept: () => void | Promise<void>;
}

/**
 * Shown after sign-in to anyone who hasn't yet confirmed they're 18+ and given
 * health-data consent: existing accounts, and new Google sign-ups (Google creates
 * the account before we can show checkboxes). Nothing else in the app is
 * reachable until both are ticked.
 */
export function TermsGateView({ onAccept }: TermsGateViewProps) {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [healthConsent, setHealthConsent] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showUnder18, setShowUnder18] = useState(false);

  const canContinue = ageConfirmed && healthConsent && !saving;

  const handleContinue = async () => {
    if (!ageConfirmed) return setError(CONSENT_TEXT.ageRequiredError);
    if (!healthConsent) return setError(CONSENT_TEXT.healthRequiredError);
    setError('');
    setSaving(true);
    try {
      await onAccept();
    } catch (e: any) {
      // Show the real reason (e.g. permission-denied) so a failed save is visible.
      console.error('[Consent] Could not save consent:', e);
      setError(`Couldn't save your confirmation (${e?.code || e?.message || 'unknown error'}). Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  // Under-18: remove the account and its profile, then sign out.
  const handleUnder18 = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid)).catch(() => {});
      await deleteUser(user);
    } catch (e) {
      // deleteUser can require a recent sign-in; at minimum, sign out.
      console.warn('[Consent] Could not delete under-18 account automatically:', e);
      await signOut(auth);
    }
  };

  if (showUnder18) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#17181C] p-4 font-sans">
        <div className={`${CARD} w-full max-w-md p-8 sm:p-10 text-center`}>
          <h1 className="text-2xl font-display font-bold text-white mb-4">Sorry, {BRAND.name} is for adults</h1>
          <p className="text-stone-400 text-sm mb-8">
            You need to be 18 or older to use {BRAND.name}. We'll remove this account and won't keep any of its data.
          </p>
          <button onClick={handleUnder18} className={`${PRIMARY_BUTTON} w-full py-3 text-sm`}>
            Remove account and sign out
          </button>
          <button
            onClick={() => setShowUnder18(false)}
            className="text-stone-500 text-sm hover:text-white mt-4 font-medium transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#17181C] p-4 font-sans">
      <div className={`${CARD} w-full max-w-md p-8 sm:p-10 text-center flex flex-col items-center`}>
        <div className="w-20 h-20 bg-[#FC5200]/15 text-[#FC5200] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-display font-bold text-white mb-3">Before you start</h1>
        <p className="text-stone-500 text-sm mb-6">Please confirm the following to use {BRAND.name}.</p>

        <ConsentCheckboxes
          ageConfirmed={ageConfirmed}
          healthConsent={healthConsent}
          onAgeChange={(v) => { setAgeConfirmed(v); setError(''); }}
          onHealthChange={(v) => { setHealthConsent(v); setError(''); }}
        />

        <p className="text-stone-500 text-xs text-left mt-5">{CONSENT_TEXT.healthNote}</p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-sm font-medium mt-4 border border-red-100 w-full">
            {error}
          </div>
        )}

        <div className="mt-6 w-full">
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`w-full py-3 text-sm flex items-center justify-center gap-2 ${canContinue ? PRIMARY_BUTTON : 'bg-stone-800 text-stone-500 cursor-not-allowed rounded-xl'}`}
          >
            Continue
          </button>
        </div>
        <button
          onClick={() => setShowUnder18(true)}
          className="text-stone-500 text-sm hover:text-white mt-4 font-medium transition-colors"
        >
          I'm under 18
        </button>
      </div>
    </div>
  );
}
