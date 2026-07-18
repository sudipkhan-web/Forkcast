import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { InventoryItem } from '../types';

// Helper to display a notification locally
function showLocalNotification(title: string, body: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  
  if (Notification.permission === 'granted') {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: title.replace(/\s+/g, '-').toLowerCase()
        });
      }).catch(() => {
        // Fallback to standard window Notification
        new Notification(title, { body, icon: '/icon-192.png' });
      });
    } else {
      new Notification(title, { body, icon: '/icon-192.png' });
    }
  }
}

// Helper to get formatted date string (YYYY-MM-DD)
function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Checks triggers and schedules timeout callbacks according to criteria.
 */
export async function runNotificationTriggers(userId: string, inventory: InventoryItem[]) {
  if (typeof window === 'undefined') return;

  const todayStr = getTodayDateString();

  // -------------------------------------------------------------
  // TRIGGER 1 — EXPIRY ALERT (Target: 5:30 PM today)
  // -------------------------------------------------------------
  const lastExpirySent = localStorage.getItem('lastExpiryNotification');
  if (lastExpirySent !== todayStr) {
    const nowTime = new Date().getTime();
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    
    // Filter items expiring in the next 3 days
    const expiringItems = inventory.filter(item => {
      if (!item.expiresAt) return false;
      const expTime = new Date(item.expiresAt).getTime();
      const diff = expTime - nowTime;
      return diff >= 0 && diff <= threeDaysMs;
    });

    if (expiringItems.length > 0) {
      const now = new Date();
      const target = new Date();
      target.setHours(17, 30, 0, 0);
      const ms = target.getTime() - now.getTime();
      
      if (ms > 0) {
        console.log(`[NotificationTrigger] Expiry Alert scheduled in ${Math.round(ms / 1000 / 60)} minutes.`);
        setTimeout(() => {
          localStorage.setItem('lastExpiryNotification', todayStr);
          
          const names = expiringItems.map(i => i.name);
          let body = '';
          if (names.length === 1) {
            body = `${names[0]} is expiring soon. Tap to see what you can make.`;
          } else if (names.length === 2) {
            body = `${names[0]} and ${names[1]} are expiring soon. Tap to see what you can make.`;
          } else {
            body = `${names[0]}, ${names[1]} and ${names.length - 2} more are expiring soon. Tap to see what you can make.`;
          }
          
          showLocalNotification("Use it before you lose it 🥗", body);
        }, ms);
      }
    }
  }

  // -------------------------------------------------------------
  // TRIGGER 2 — EVENING COOK PROMPT (Target: 5:00 PM today)
  // -------------------------------------------------------------
  const lastEveningPrompt = localStorage.getItem('lastEveningPrompt');
  if (lastEveningPrompt !== todayStr) {
    try {
      const profileDoc = await getDoc(doc(db, 'users', userId, 'behavioralProfile', 'current'));
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        const cookingByHour = profileData.cookingByHourOfDay || {};
        
        // check hours 17, 18, 19
        const hasEveningCooking = 
          (cookingByHour['17'] && cookingByHour['17'] > 0) ||
          (cookingByHour['18'] && cookingByHour['18'] > 0) ||
          (cookingByHour['19'] && cookingByHour['19'] > 0) ||
          (cookingByHour[17] && cookingByHour[17] > 0) ||
          (cookingByHour[18] && cookingByHour[18] > 0) ||
          (cookingByHour[19] && cookingByHour[19] > 0);
          
        if (hasEveningCooking) {
          const now = new Date();
          const target = new Date();
          target.setHours(17, 0, 0, 0);
          const ms = target.getTime() - now.getTime();
          
          if (ms > 0) {
            console.log(`[NotificationTrigger] Evening Cook Prompt scheduled in ${Math.round(ms / 1000 / 60)} minutes.`);
            setTimeout(() => {
              localStorage.setItem('lastEveningPrompt', todayStr);
              showLocalNotification(
                "What's for dinner tonight? 🍽️",
                "Forkcast has suggestions ready based on what's in your kitchen."
              );
            }, ms);
          }
        }
      }
    } catch (err) {
      console.warn("Failed fetching behavioral profile for cook prompt:", err);
    }
  }

  // -------------------------------------------------------------
  // TRIGGER 3 — WEEKLY PLAN REMINDER (Target: Sundays at 6:00 PM)
  // -------------------------------------------------------------
  if (new Date().getDay() === 0) {
    const lastWeekly = localStorage.getItem('lastWeeklyReminder');
    if (lastWeekly !== todayStr) {
      const now = new Date();
      const target = new Date();
      target.setHours(18, 0, 0, 0);
      const ms = target.getTime() - now.getTime();
      
      if (ms > 0) {
        console.log(`[NotificationTrigger] Weekly Plan Reminder scheduled in ${Math.round(ms / 1000 / 60)} minutes.`);
        setTimeout(() => {
          localStorage.setItem('lastWeeklyReminder', todayStr);
          showLocalNotification(
            "Plan your week 📋",
            "You have items in your pantry that need using this week. Tap to plan your meals."
          );
        }, ms);
      }
    }
  }
}
