import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Check } from 'lucide-react';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { apiFetch } from '../utils/apiFetch';
import { CARD, ICON_BUTTON, PRIMARY_BUTTON } from '../styles/designTokens';
import { BRAND } from '../brand';

const TYPES = ['Bug', 'Idea', 'Something confusing', 'Praise'] as const;
type FeedbackType = (typeof TYPES)[number];
const MAX_CHARS = 2000;

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Which screen the user was on (home, plan, ...). */
  route: string;
}

export function FeedbackModal({ isOpen, onClose, route }: FeedbackModalProps) {
  const [type, setType] = useState<FeedbackType>('Idea');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  // Fresh form each time the sheet opens (but keep text after a failed send).
  useEffect(() => {
    if (isOpen) {
      setSent(false);
      setError('');
    }
  }, [isOpen]);

  const submit = async () => {
    const text = message.trim();
    if (!text) {
      setError('Please write a message.');
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      setError('Please sign in again to send feedback.');
      return;
    }
    setSending(true);
    setError('');
    const appVersion = 'web';
    try {
      // 1) Server: validates, rate-limits, emails the feedback inbox.
      const res = await apiFetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message: text, consentToContact: consent, route, appVersion }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Could not send feedback. Please try again.');
      }
      // 2) Record in Firestore (the durable copy).
      const ref = doc(collection(db, 'feedback'));
      await setDoc(ref, {
        uid: user.uid,
        email: consent ? user.email || null : null,
        type,
        message: text,
        consentToContact: consent,
        route,
        appVersion,
        userAgent: navigator.userAgent.slice(0, 300),
        createdAt: serverTimestamp(),
        status: 'New',
      }).catch(err => console.error('[feedback] Firestore write failed:', err));
      setSent(true);
      setMessage('');
      setConsent(false);
    } catch (err: any) {
      setError(err?.message || 'Could not send feedback. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`${CARD} w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden`}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-label="Send feedback"
          >
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#FC5200]" />
                Send feedback
              </h2>
              <button onClick={onClose} className={ICON_BUTTON} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {sent ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-[#FC5200]/15 text-[#FC5200] rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <p className="text-white font-semibold">Thanks, we read every message.</p>
                <button onClick={onClose} className={`${PRIMARY_BUTTON} w-full py-3 text-sm`}>
                  Done
                </button>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <p className="text-sm text-stone-400">
                  Tell us what's working, what's broken or what's confusing in {BRAND.name}.
                </p>

                <div className="flex flex-wrap gap-2">
                  {TYPES.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all active:scale-95 ${
                        type === t
                          ? 'bg-[#FC5200] border-[#FC5200] text-white'
                          : 'bg-[#1c1d22] border-[#2c2d33] text-stone-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value.slice(0, MAX_CHARS))}
                    rows={5}
                    placeholder="Your feedback…"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FC5200]/20 focus:border-[#FC5200] resize-none"
                  />
                  <div className="text-right text-[11px] text-stone-500 mt-1">
                    {message.length}/{MAX_CHARS}
                  </div>
                </div>

                <label className="flex items-start gap-3 text-sm text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#FC5200]"
                  />
                  <span>You can contact me about this.</span>
                </label>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                  onClick={submit}
                  disabled={sending || !message.trim()}
                  className={`${PRIMARY_BUTTON} w-full py-3.5 text-sm disabled:opacity-50`}
                >
                  {sending ? 'Sending…' : 'Send feedback'}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
