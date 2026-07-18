import { getMessaging, getToken } from 'firebase/messaging';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebaseUtils';
import { UserProfile, InventoryItem, PlannedMeal, ShoppingItem } from '../types';

let currentToken: string | null = null;

export function getFCMToken(): string | null {
  return currentToken;
}

export function checkNotifications(
  profile: UserProfile,
  inventory: InventoryItem[],
  plannedMeals: PlannedMeal[],
  shoppingList: ShoppingItem[]
): string | null {
  const now = new Date();
  const currentHour = now.getHours();
  
  const mealPlanTimeStr = profile.notifications?.mealPlanningTime || '17:00';
  const targetHour = parseInt(mealPlanTimeStr.split(':')[0], 10);
  
  // Only allow notifications during the user's chosen meal planning hour window
  if (currentHour !== targetHour) {
    return null;
  }

  // Prevent spamming notification checks by checking the last sent time
  const lastSent = localStorage.getItem('lastNotificationSentAt');
  if (lastSent) {
    const lastSentDate = new Date(lastSent);
    if (
      lastSentDate.getFullYear() === now.getFullYear() &&
      lastSentDate.getMonth() === now.getMonth() &&
      lastSentDate.getDate() === now.getDate() &&
      lastSentDate.getHours() === currentHour
    ) {
      // Already sent in this hour window today
      return null;
    }
  }

  // 1. Check Expiring Items
  if (profile.notifications?.expiringReminder !== false) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

    const expiringItems = inventory.filter(item => {
      if (!item.expiresAt) return false;
      const expDate = new Date(item.expiresAt);
      expDate.setHours(0, 0, 0, 0);
      return expDate >= today && expDate <= threeDaysFromNow;
    });

    if (expiringItems.length > 0) {
      const names = expiringItems.slice(0, 3).map(i => i.name).join(', ');
      const restCount = expiringItems.length - 3;
      const andMore = restCount > 0 ? ` and ${restCount} more` : '';
      return `⚠️ Use it before you lose it: ${names}${andMore} are expiring soon!`;
    }
  }

  // 2. Check Upcoming Meal Plan Reminder
  // Check if there are no meals planned for today
  if (profile.notifications?.mealPlanningTime) {
    const todayStr = new Date().toISOString().split('T')[0];
    const hasTodayMeal = plannedMeals.some(meal => meal.date === todayStr);
    if (!hasTodayMeal) {
      return "📅 You haven't planned any meals for today yet! Let's check some recommendations.";
    }
  }

  // 3. Check Shopping List Reminder
  if (profile.notifications?.shoppingReminder !== false) {
    const uncheckedCount = shoppingList.filter(item => !item.checked).length;
    if (uncheckedCount > 0) {
      return `🛒 You have ${uncheckedCount} unchecked items on your shopping list. Ready to stock up?`;
    }
  }

  return null;
}

export async function initNotifications(userId: string): Promise<string | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('Notification' in window)) {
    console.warn("Notifications or Service Workers are not supported in this browser environment.");
    return null;
  }

  try {
    // 1. Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn("Notification permission was denied.");
      return null;
    }

    // 2. Get the Service Worker registration
    const registration = await navigator.serviceWorker.ready;

    // 3. Get FCM Messaging instance
    const messaging = getMessaging();

    // 4. Retrieve Token
    let token: string | null = null;
    try {
      // Pass the service worker registration explicitly to avoid errors under iframe environments
      token = await getToken(messaging, {
        serviceWorkerRegistration: registration
      });
    } catch (tokenErr) {
      console.warn("Failed with serviceWorkerRegistration parameter, trying with standard getToken:", tokenErr);
      try {
        token = await getToken(messaging);
      } catch (innerErr) {
        console.warn("Standard getToken also failed. Push notifications might be unavailable in this sandboxed environment:", innerErr);
      }
    }

    if (token) {
      currentToken = token;
      console.log("FCM Token obtained successfully:", token);

      // Save token to Firestore at users/{uid}/fcmTokens/{token} with uid and timestamp
      const tokenPath = `users/${userId}/fcmTokens/${token}`;
      try {
        const tokenDocRef = doc(db, 'users', userId, 'fcmTokens', token);
        await setDoc(tokenDocRef, {
          uid: userId, // Must include uid field to comply with existing security rules
          token: token,
          createdAt: new Date().toISOString()
        });
        console.log(`FCM Token stored in Firestore at ${tokenPath}`);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, tokenPath);
      }

      return token;
    } else {
      console.warn("No registration token returned from Firebase.");
      return null;
    }
  } catch (err) {
    console.warn("Error during notification initialization:", err);
    return null;
  }
}
