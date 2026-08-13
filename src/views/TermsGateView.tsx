import React, { useState } from 'react';
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '../constants';
import { FileText } from 'lucide-react';

interface TermsGateViewProps {
  onAccept: () => void;
}

export function TermsGateView({ onAccept }: TermsGateViewProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-[#17181C] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-emerald-100 text-[#FC5200] rounded-full flex items-center justify-center mx-auto mb-6">
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
      </div>
      <div className="p-6 bg-stone-900 border-t border-stone-800">
        <button
          onClick={onAccept}
          disabled={!agreed}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${
            agreed
              ? 'bg-[#FC5200] text-white hover:bg-[#FC5200] shadow-[#FC5200]/20'
              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
