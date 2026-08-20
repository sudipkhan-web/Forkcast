import React from 'react';
import { CARD, ICON_BUTTON, PRIMARY_BUTTON } from '../styles/designTokens';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Link, Mail } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`${CARD} w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden`}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-stone-800 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-white">
                Share Profile
              </h2>
              <button 
                onClick={onClose}
                className={`${ICON_BUTTON}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <div className="w-16 h-16 bg-[#FC5200]/15 text-[#FC5200] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-center font-display font-bold text-white text-lg mb-2">Invite to Household</h3>
                <p className="text-center text-sm text-stone-500 mb-6">
                  Share your preferences, dietary settings, inventory, and meal plans with family or roommates.
                </p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      // Conceptual copy action
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#FC5200] text-white font-semibold hover:bg-[#FC5200] transition-all active:scale-[0.98] shadow-lg shadow-[#FC5200]/20"
                  >
                    <Link className="w-5 h-5" />
                    Copy Invite Link
                  </button>
                  
                  <button 
                    onClick={() => {
                      // Conceptual email action
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-stone-800 text-stone-300 font-semibold hover:bg-stone-900 transition-all active:scale-[0.98]"
                  >
                    <Mail className="w-5 h-5" />
                    Send via Email
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
