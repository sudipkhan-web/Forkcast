import React, { useState } from 'react';
import { CARD, ICON_BUTTON, PRIMARY_BUTTON } from '../styles/designTokens';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const NotificationBell = () => {
  const { appNotifications, markNotificationAsRead, markAllNotificationsAsRead, clearReadNotifications } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = appNotifications.filter(n => !n.read).length;
  const hasRead = appNotifications.some(n => n.read);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${ICON_BUTTON} relative`}
        aria-label="Notifications"
      >
        <Bell className="w-[19px] h-[19px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#17181C]">
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
              className={`absolute right-0 mt-2 w-80 z-50 overflow-hidden ${CARD}`}
            >
              <div className="p-4 border-b border-stone-800 flex items-center justify-between">
                <h3 className="font-semibold text-white">Notifications</h3>
                <div className="flex items-center gap-2">
                  {hasRead && (
                    <button 
                      onClick={clearReadNotifications}
                      className="text-xs text-stone-400 hover:text-white font-medium"
                    >
                      Clear read
                    </button>
                  )}
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-[#FC5200] hover:text-[#FC5200] font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className={`${ICON_BUTTON}`}>
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
                        className={`p-4 border-b border-stone-800 last:border-0 transition-colors ${notification.read ? 'opacity-70 bg-stone-900' : 'bg-[#FC5200]/10'}`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-white">{notification.title}</h4>
                            <p className="text-xs text-stone-400 mt-1 leading-relaxed">{notification.message}</p>
                            <span className="text-[10px] text-stone-400 mt-2 block">
                              {new Date(notification.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {!notification.read && (
                            <button 
                              onClick={() => markNotificationAsRead(notification.id)}
                              className={`shrink-0 ${ICON_BUTTON}`}
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
