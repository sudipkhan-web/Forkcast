import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const NotificationBell = () => {
  const { appNotifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = appNotifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-stone-400 hover:text-emerald-600 transition-all active:scale-[0.98] relative rounded-full hover:bg-stone-100"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#fdfbf7]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200/60 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <h3 className="font-semibold text-stone-800">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-[350px] overflow-y-auto">
                {appNotifications.length === 0 ? (
                  <div className="p-8 text-center text-stone-500 text-sm">
                    No notifications yet.
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {appNotifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-b border-stone-100 last:border-0 transition-colors ${notification.read ? 'opacity-70 bg-white' : 'bg-emerald-50/30'}`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-stone-800">{notification.title}</h4>
                            <p className="text-xs text-stone-600 mt-1 leading-relaxed">{notification.message}</p>
                            <span className="text-[10px] text-stone-400 mt-2 block">
                              {new Date(notification.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {!notification.read && (
                            <button 
                              onClick={() => markNotificationAsRead(notification.id)}
                              className="w-6 h-6 rounded-full bg-stone-100 hover:bg-emerald-100 text-stone-400 hover:text-emerald-600 flex items-center justify-center shrink-0 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
