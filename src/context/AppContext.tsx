import { useToast } from '../components/Toast';
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebaseUtils';
import { initNotifications } from '../services/notificationService';
import { runNotificationTriggers } from '../services/notificationTriggers';
import { Meal } from '../data/recipes';
import { InventoryItem, ShoppingItem, PlannedMeal, UserProfile, Group, PersonProfile, PantryLog, AppNotification } from '../types';

interface AppContextType {
  userId: string | null;
  isAuthReady: boolean;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  selectedGroupId: string;
  setSelectedGroupId: React.Dispatch<React.SetStateAction<string>>;
  handleSelectGroup: (groupId: string) => Promise<void>;
  groups: Group[];
  household: PersonProfile[];
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  favorites: Meal[];
  setFavorites: React.Dispatch<React.SetStateAction<Meal[]>>;
  globalRecipes: Meal[];
  setGlobalRecipes: React.Dispatch<React.SetStateAction<Meal[]>>;
  plannedMeals: PlannedMeal[];
  setPlannedMeals: React.Dispatch<React.SetStateAction<PlannedMeal[]>>;
  shoppingList: ShoppingItem[];
  setShoppingList: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  pantryLogs: PantryLog[];
  setPantryLogs: React.Dispatch<React.SetStateAction<PantryLog[]>>;
  customIngredientRules: Record<string, { location: 'fridge' | 'pantry', category: string }>;
  setCustomIngredientRules: React.Dispatch<React.SetStateAction<Record<string, { location: 'fridge' | 'pantry', category: string }>>>;
  updateCustomIngredientRule: (name: string, rule: { location: 'fridge' | 'pantry', category: string }) => Promise<void>;
  likedTags: Record<string, number>;
  setLikedTags: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  dislikedTags: Record<string, number>;
  setDislikedTags: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  likedMealIds: string[];
  setLikedMealIds: React.Dispatch<React.SetStateAction<string[]>>;
  dislikedMealIds: string[];
  setDislikedMealIds: React.Dispatch<React.SetStateAction<string[]>>;
  appNotifications: AppNotification[];
  setAppNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  clearReadNotifications: () => Promise<void>;
  queuedSuggestions: any[] | null;
  setQueuedSuggestions: React.Dispatch<React.SetStateAction<any[] | null>>;
  trainingLogs: any[];
  setTrainingLogs: React.Dispatch<React.SetStateAction<any[]>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { showToast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  const [queuedSuggestions, setQueuedSuggestions] = useState<any[] | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    favoriteCuisines: [],
    hasCompletedOnboarding: false,
  });
  const [selectedGroupId, setSelectedGroupId] = useState<string>('g1');
  const [groups, setGroups] = useState<Group[]>([]);
  const [household, setHousehold] = useState<PersonProfile[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [favorites, setFavorites] = useState<Meal[]>([]);
  const [globalRecipes, setGlobalRecipes] = useState<Meal[]>([]);
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [pantryLogs, setPantryLogs] = useState<PantryLog[]>([]);
  const [customIngredientRules, setCustomIngredientRules] = useState<Record<string, { location: 'fridge' | 'pantry', category: string }>>({});
  const [likedTags, setLikedTags] = useState<Record<string, number>>({});
  const [dislikedTags, setDislikedTags] = useState<Record<string, number>>({});
  const [likedMealIds, setLikedMealIds] = useState<string[]>([]);
  const [dislikedMealIds, setDislikedMealIds] = useState<string[]>([]);
  const [appNotifications, setAppNotifications] = useState<AppNotification[]>([]);
  const [trainingLogs, setTrainingLogs] = useState<any[]>([]);
  const triggersRunRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        initNotifications(user.uid).catch((err) => {
          console.error("Error setting up notifications during login:", err);
        });
      } else {
        setUserId(null);
      }
      setIsAuthReady(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userId) {
      // Reset state on logout
      setQueuedSuggestions(null);
      setProfile({
        favoriteCuisines: [],
        hasCompletedOnboarding: false,
      });
      setGroups([]);
      setHousehold([]);
      setInventory([]);
      setFavorites([]);
      setPlannedMeals([]);
      setShoppingList([]);
      setPantryLogs([]);
      setCustomIngredientRules({});
      setLikedTags({});
      setDislikedTags({});
      setLikedMealIds([]);
      setDislikedMealIds([]);
      setAppNotifications([]);
    }
    if (!userId || !isAuthReady) return;

    const unsubProfile = onSnapshot(doc(db, 'users', userId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(prev => {
          const next = {
            email: data.email || auth.currentUser?.email || undefined,
            favoriteCuisines: data.favoriteCuisines || [],
            healthConditions: data.healthConditions || [],
            hasCompletedOnboarding: data.hasCompletedOnboarding || false,
            hasAcceptedTerms: data.hasAcceptedTerms || false,
            selectedGroupId: data.selectedGroupId,
            notifications: data.notifications,
          };
          return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
        });

        // Auto-save email if it's missing in DB but present in auth
        if (!data.email && auth.currentUser?.email) {
          setDoc(doc(db, 'users', userId), { email: auth.currentUser.email }, { merge: true });
        }
        if (data.selectedGroupId) {
          setSelectedGroupId(prev => prev === data.selectedGroupId ? prev : data.selectedGroupId);
        }
        setLikedTags(prev => JSON.stringify(prev) === JSON.stringify(data.likedTags || {}) ? prev : (data.likedTags || {}));
        setDislikedTags(prev => JSON.stringify(prev) === JSON.stringify(data.dislikedTags || {}) ? prev : (data.dislikedTags || {}));
        setLikedMealIds(prev => JSON.stringify(prev) === JSON.stringify(data.likedMealIds || []) ? prev : (data.likedMealIds || []));
        setDislikedMealIds(prev => JSON.stringify(prev) === JSON.stringify(data.dislikedMealIds || []) ? prev : (data.dislikedMealIds || []));
        setQueuedSuggestions(prev => JSON.stringify(prev) === JSON.stringify(data.queuedSuggestions || []) ? prev : (data.queuedSuggestions || []));
      } else {
        setDoc(doc(db, 'users', userId), {
          uid: userId,
          email: auth.currentUser?.email || '',
          favoriteCuisines: [],
          healthConditions: [],
          hasCompletedOnboarding: false,
          likedTags: {},
          dislikedTags: {},
          likedMealIds: [],
          dislikedMealIds: []
        });
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${userId}`, showToast));

    const unsubInventory = onSnapshot(collection(db, `users/${userId}/inventory`), (snapshot) => {
      setInventory(snapshot.docs.map(d => d.data() as InventoryItem));
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/inventory`, showToast));

    const unsubShopping = onSnapshot(collection(db, `users/${userId}/shoppingList`), (snapshot) => {
      setShoppingList(snapshot.docs.map(d => d.data() as ShoppingItem));
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/shoppingList`, showToast));

    const unsubPantryLogs = onSnapshot(collection(db, `users/${userId}/pantryLogs`), (snapshot) => {
      setPantryLogs(snapshot.docs.map(d => d.data() as PantryLog).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/pantryLogs`, showToast));

    const unsubRules = onSnapshot(collection(db, `users/${userId}/ingredientRules`), (snapshot) => {
      const rulesMap: Record<string, { location: 'fridge' | 'pantry', category: string }> = {};
      snapshot.forEach(doc => {
        rulesMap[doc.id] = doc.data() as { location: 'fridge' | 'pantry', category: string };
      });
      setCustomIngredientRules(rulesMap);
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/ingredientRules`, showToast));

    const unsubHousehold = onSnapshot(collection(db, `users/${userId}/household`), (snapshot) => {
      setHousehold(snapshot.docs.map(d => d.data() as PersonProfile));
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/household`, showToast));

    const unsubGroups = onSnapshot(collection(db, `users/${userId}/groups`), (snapshot) => {
      setGroups(snapshot.docs.map(d => d.data() as Group));
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/groups`, showToast));

    const unsubPlannedMeals = onSnapshot(collection(db, `users/${userId}/plannedMeals`), (snapshot) => {
      setPlannedMeals(snapshot.docs.map(d => d.data() as PlannedMeal));
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/plannedMeals`, showToast));

    const unsubFavorites = onSnapshot(collection(db, `users/${userId}/favorites`), (snapshot) => {
      setFavorites(snapshot.docs.map(d => d.data() as Meal));
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/favorites`, showToast));

    const unsubGlobalRecipes = onSnapshot(collection(db, `recipes`), (snapshot) => {
      setGlobalRecipes(snapshot.docs.map(d => d.data() as Meal));
    }, (e) => handleFirestoreError(e, OperationType.LIST, `recipes`, showToast));

    const unsubNotifications = onSnapshot(collection(db, `users/${userId}/notifications`), (snapshot) => {
      setAppNotifications(snapshot.docs.map(d => d.data() as AppNotification).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/notifications`, showToast));

    const unsubTrainingLogs = onSnapshot(collection(db, `users/${userId}/trainingLog`), (snapshot) => {
      setTrainingLogs(snapshot.docs.map(d => ({ date: d.id, ...d.data() })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/trainingLog`, showToast));

    return () => {
      unsubProfile();
      unsubInventory();
      unsubShopping();
      unsubPantryLogs();
      unsubRules();
      unsubHousehold();
      unsubGroups();
      unsubPlannedMeals();
      unsubFavorites();
      unsubGlobalRecipes();
      unsubNotifications();
      unsubTrainingLogs();
    };
  }, [userId, isAuthReady]);

  useEffect(() => {
    if (userId && inventory && inventory.length > 0 && !triggersRunRef.current) {
      triggersRunRef.current = true;
      runNotificationTriggers(userId, inventory).catch((err) => {
        console.error("Error running notification trigger engine:", err);
      });
    }
  }, [userId, inventory]);

  useEffect(() => {
    if (selectedGroupId === '') return; // '' is 'Just Me', which is always valid
    const validGroup = groups.find(g => g.id === selectedGroupId);
    if (!validGroup && groups.length > 0 && selectedGroupId !== 'g1') {
      handleSelectGroup(''); // Default to 'Just Me' if selected group is invalid
    }
  }, [groups, selectedGroupId]);

  const handleSelectGroup = async (groupId: string) => {
    setSelectedGroupId(groupId);
    if (userId) {
      try {
        await setDoc(doc(db, 'users', userId), { selectedGroupId: groupId }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`, showToast);
      }
    }
  };

  const updateCustomIngredientRule = async (name: string, rule: { location: 'fridge' | 'pantry', category: string }) => {
    if (!userId) return;
    const normalizedName = name.trim().toLowerCase();
    
    // optimistically update local state
    setCustomIngredientRules(prev => ({ ...prev, [normalizedName]: rule }));
    
    try {
      await setDoc(doc(db, `users/${userId}/ingredientRules`, normalizedName), rule);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/ingredientRules/${normalizedName}`, showToast);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    if (!userId) return;
    try {
      await setDoc(doc(db, `users/${userId}/notifications`, notificationId), { read: true }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/notifications/${notificationId}`, showToast);
    }
  };


  const clearReadNotifications = async () => {
    if (!userId) return;
    try {
      const readNotifs = appNotifications.filter(n => n.read);
      await Promise.all(readNotifs.map(n => 
        deleteDoc(doc(db, `users/${userId}/notifications`, n.id))
      ));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "notifications", showToast);
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!userId) return;
    try {
      const unread = appNotifications.filter(n => !n.read);
      await Promise.all(unread.map(n => 
        setDoc(doc(db, `users/${userId}/notifications`, n.id), { read: true }, { merge: true })
      ));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/notifications/markAll`, showToast);
    }
  };

  return (
    <AppContext.Provider value={{
      userId,
      isAuthReady,
      queuedSuggestions,
      setQueuedSuggestions,
      profile,
      setProfile,
      selectedGroupId,
      setSelectedGroupId,
      handleSelectGroup,
      groups,
      household,
      inventory,
      setInventory,
      favorites,
      setFavorites,
      globalRecipes,
      setGlobalRecipes,
      plannedMeals,
      setPlannedMeals,
      shoppingList,
      setShoppingList,
      pantryLogs,
      setPantryLogs,
      customIngredientRules,
      setCustomIngredientRules,
      updateCustomIngredientRule,
      likedTags,
      setLikedTags,
      dislikedTags,
      setDislikedTags,
      likedMealIds,
      setLikedMealIds,
      dislikedMealIds,
      setDislikedMealIds,
      appNotifications,
      setAppNotifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearReadNotifications,
      trainingLogs,
      setTrainingLogs
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
