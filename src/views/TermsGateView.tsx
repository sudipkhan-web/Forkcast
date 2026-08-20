import React, { useState } from 'react';
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '../constants';
import { FileText } from 'lucide-react';
import { CARD, PRIMARY_BUTTON } from '../styles/designTokens';

interface TermsGateViewProps {
  onAccept: () => void;
}

export function TermsGateView({ onAccept }: TermsGateViewProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#17181C] p-4 font-sans">
      <div className={`${CARD} w-full max-w-md p-8 sm:p-10 text-center flex flex-col items-center justify-center`}>
        <div className="w-20 h-20 bg-[#FC5200]/15 text-[#FC5200] rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-4">We've updated our terms</h1>
        <p className="text-stone-500 text-base max-w-[280px] mx-auto mb-8">
          Please review our <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className="text-[#FC5200] underline">Privacy Policy</a> and <a href={TERMS_OF_SERVICE_URL} target="_blank" rel="noopener noreferrer" className="text-[#FC5200] underline">Terms of Service</a> before continuing.
        </p>
        <label className="flex items-center gap-3 text-stone-300 text-sm text-left max-w-[280px] mx-auto cursor-pointer">
          <input 
            type="checkbox" 
            checked={agreed} 
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 rounded border-stone-700 bg-stone-900 text-[#FC5200] focus:ring-[#FC5200] focus:ring-offset-stone-900 shrink-0"
          />
          <span>I have read and agree to the Privacy Policy and Terms of Service</span>
        </label>
        <div className="mt-8 w-full">
        <button
          onClick={onAccept}
          disabled={!agreed}
          className={`w-full py-4 text-lg flex items-center justify-center gap-2 ${agreed ? PRIMARY_BUTTON : "bg-stone-800 text-stone-500 cursor-not-allowed rounded-xl"}`}
        >
          Continue
        </button>
      </div>
      </div>
    </div>
  );
}
