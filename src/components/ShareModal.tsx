import React from 'react';
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
            className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-stone-200/60 flex items-center justify-between bg-stone-50">
              <h2 className="text-xl font-display font-bold text-stone-900">
                Share Profile
              </h2>
              <button 
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-200/50 rounded-full transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-center font-display font-bold text-stone-900 text-lg mb-2">Invite to Household</h3>
                <p className="text-center text-sm text-stone-500 mb-6">
                  Share your preferences, dietary settings, inventory, and meal plans with family or roommates.
                </p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      // Conceptual copy action
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20"
                  >
                    <Link className="w-5 h-5" />
                    Copy Invite Link
                  </button>
                  
                  <button 
                    onClick={() => {
                      // Conceptual email action
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-stone-200/60 text-stone-700 font-semibold hover:bg-stone-50 transition-all active:scale-[0.98]"
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
