import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Package, Store, ChevronLeft, Check } from 'lucide-react';
import { ShoppingItem } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderStep: 'provider' | 'checkout' | 'success';
  setOrderStep: (step: 'provider' | 'checkout' | 'success') => void;
  selectedProvider: { id: string, name: string, logo: React.ReactNode, bgClass?: string, textClass?: string, fee: number, time: string } | null;
  setSelectedProvider: (provider: { id: string, name: string, logo: React.ReactNode, bgClass?: string, textClass?: string, fee: number, time: string } | null) => void;
  combinedShoppingList: ShoppingItem[];
  onMoveToPantry: (items: ShoppingItem[]) => void;
}

export function OrderModal({
  isOpen,
  onClose,
  orderStep,
  setOrderStep,
  selectedProvider,
  setSelectedProvider,
  combinedShoppingList,
  onMoveToPantry
}: OrderModalProps) {
  const PROVIDERS = [
    { id: 'rewe', name: 'REWE', logo: <Store className="w-5 h-5" />, bgClass: 'bg-red-100', textClass: 'text-red-600', fee: 4.90, time: 'Lieferung oder Abholung' },
    { id: 'billa', name: 'BILLA', logo: <ShoppingCart className="w-5 h-5" />, bgClass: 'bg-yellow-100', textClass: 'text-yellow-600', fee: 3.90, time: 'Click & Collect verfügbar' },
    { id: 'spar', name: 'SPAR', logo: <Package className="w-5 h-5" />, bgClass: 'bg-green-100', textClass: 'text-green-600', fee: 4.50, time: 'Abholung im Markt' },
  ];

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
                {orderStep === 'provider' ? 'Order Groceries' : orderStep === 'checkout' ? 'Checkout' : 'Order Placed'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-200/50 rounded-full transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {orderStep === 'provider' && (
                <>
                  <div>
                    <label className="block text-xs font-display font-bold text-stone-400 uppercase tracking-widest mb-3">Delivery Service</label>
                    <div className="space-y-3">
                      {PROVIDERS.map(provider => (
                        <button 
                          key={provider.id}
                          onClick={() => {
                            setSelectedProvider(provider);
                            setOrderStep('checkout');
                          }}
                          className="w-full flex items-center justify-between p-4 rounded-2xl border border-stone-200/60 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${provider.bgClass} flex items-center justify-center ${provider.textClass}`}>
                              {provider.logo}
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-stone-900">{provider.name}</p>
                              <p className="text-xs text-stone-500">{provider.time}</p>
                            </div>
                          </div>
                          <ChevronLeft className="w-5 h-5 text-stone-300 group-hover:text-emerald-500 rotate-180 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {orderStep === 'checkout' && selectedProvider && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
                    <div className={`w-12 h-12 rounded-full ${selectedProvider.bgClass || 'bg-white'} flex items-center justify-center shadow-sm ${selectedProvider.textClass || 'text-stone-700'}`}>
                      {selectedProvider.logo}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{selectedProvider.name}</p>
                      <p className="text-xs text-stone-500">{selectedProvider.time}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-display font-bold text-stone-900 mb-3">Order Summary</h3>
                    <ul className="space-y-3 mb-4">
                      {combinedShoppingList.filter(i => !i.checked).map(item => (
                        <li key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-stone-600"><span className="text-stone-400 mr-2">{item.quantity}x</span>{item.name}</span>
                          <span className="text-stone-900 font-medium">€{(item.quantity * 3.50).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="border-t border-stone-200/60 pt-4 space-y-2 text-sm">
                      <div className="flex justify-between text-stone-500">
                        <span>Subtotal</span>
                        <span>€{(combinedShoppingList.filter(i => !i.checked).reduce((acc, item) => acc + item.quantity * 3.50, 0)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-stone-500">
                        <span>Delivery Fee</span>
                        <span>€{selectedProvider.fee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-stone-900 text-base pt-2 border-t border-stone-200/60 mt-2">
                        <span>Total</span>
                        <span>€{(combinedShoppingList.filter(i => !i.checked).reduce((acc, item) => acc + item.quantity * 3.50, 0) + selectedProvider.fee).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setOrderStep('success')}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-semibold text-lg hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20"
                  >
                    Place Order
                  </button>
                </div>
              )}

              {orderStep === 'success' && (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-stone-900">Order Placed!</h3>
                  <p className="text-stone-500">Your groceries are on the way via {selectedProvider?.name}.</p>
                  
                  <button 
                    onClick={() => {
                      const orderedItems = combinedShoppingList.filter(i => !i.checked);
                      onMoveToPantry(orderedItems);
                      onClose();
                    }}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <Package className="w-5 h-5" />
                    Confirm Delivery & Add to Pantry
                  </button>

                  <button 
                    onClick={onClose}
                    className="w-full py-4 bg-stone-100 text-stone-900 rounded-2xl font-semibold hover:bg-stone-200 transition-all active:scale-[0.98]"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
