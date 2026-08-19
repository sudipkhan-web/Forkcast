const fs = require('fs');
let code = fs.readFileSync('src/components/NotificationBell.tsx', 'utf8');

// 1. Update imports from AppContext
code = code.replace(
  "const { appNotifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext();",
  "const { appNotifications, markNotificationAsRead, markAllNotificationsAsRead, clearReadNotifications } = useAppContext();"
);

// 2. Add hasRead to check if there are read notifications
code = code.replace(
  "const unreadCount = appNotifications.filter(n => !n.read).length;",
  "const unreadCount = appNotifications.filter(n => !n.read).length;\n  const hasRead = appNotifications.some(n => n.read);"
);

// 3. Add Clear read button
const oldButtons = `                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-[#FC5200] hover:text-[#FC5200] font-medium"
                    >
                      Mark all as read
                    </button>
                  )}`;

const newButtons = `                  {hasRead && (
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
                  )}`;

code = code.replace(oldButtons, newButtons);

// 4. Update bg-emerald-50/30 to bg-[#FC5200]/10
code = code.replace(
  "'bg-emerald-50/30'",
  "'bg-[#FC5200]/10'"
);

fs.writeFileSync('src/components/NotificationBell.tsx', code);
