import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastContextType {
  showToast: (message: string, type: 'error' | 'success') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const showToast = useCallback((message: string, type: 'error' | 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl w-11/12 max-w-sm border ${
              toast.type === 'error'
                ? 'bg-[#17181C] border-stone-700 text-stone-200'
                : 'bg-[#17181C] border-green-900/50 text-stone-200'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            )}
            <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="p-1 shrink-0 text-stone-400 hover:text-stone-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};
