import React from 'react';
import { BRAND } from '../brand';
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '../constants';

/**
 * The two consents every account needs before using the app:
 * 1. Age + Terms/Privacy: users must be 18+ (no date of birth is collected).
 * 2. Health data (GDPR Art. 9): training and eating info is used for suggestions.
 * Wording approved draft: claude/Drafts_Positioning_AgeGate_Subscription.md §2.
 */
export const CONSENT_TEXT = {
  ageRequiredError: "Please confirm you're 18 or older to continue.",
  healthRequiredError: `Please agree to how ${BRAND.name} uses your training and eating information to continue.`,
  healthNote: `${BRAND.name} gives general fueling suggestions for healthy adults. It is not medical advice. If you have a medical condition, food allergy or history of disordered eating, talk to a doctor or registered dietitian first.`,
};

/** Fields saved on the user's Firestore profile when both boxes are ticked. */
export function consentFields() {
  const now = new Date().toISOString();
  return {
    ageConfirmedAt: now,
    healthConsentAt: now,
    hasAcceptedTerms: true,
    termsAcceptedAt: now,
  };
}

interface Props {
  ageConfirmed: boolean;
  healthConsent: boolean;
  onAgeChange: (v: boolean) => void;
  onHealthChange: (v: boolean) => void;
}

const boxClass =
  'mt-0.5 w-5 h-5 rounded border-stone-700 bg-stone-900 text-[#FC5200] focus:ring-[#FC5200] focus:ring-offset-stone-900 shrink-0';
const linkClass = 'text-[#FC5200] underline';

export function ConsentCheckboxes({ ageConfirmed, healthConsent, onAgeChange, onHealthChange }: Props) {
  return (
    <div className="flex flex-col gap-3 text-left">
      <label className="flex items-start gap-3 text-stone-300 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={ageConfirmed}
          onChange={(e) => onAgeChange(e.target.checked)}
          className={boxClass}
        />
        <span>
          I'm 18 or older and I agree to the{' '}
          <a href={TERMS_OF_SERVICE_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>Terms of Use</a>
          {' '}and{' '}
          <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>Privacy Policy</a>.
        </span>
      </label>
      <label className="flex items-start gap-3 text-stone-300 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={healthConsent}
          onChange={(e) => onHealthChange(e.target.checked)}
          className={boxClass}
        />
        <span>I agree that {BRAND.name} uses my training and eating information to give me meal suggestions.</span>
      </label>
    </div>
  );
}
