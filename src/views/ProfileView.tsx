import React, { useState, useRef, useEffect } from 'react';
import { CARD, ICON_BUTTON, PRIMARY_BUTTON, PILL, STEPPER } from '../styles/designTokens';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Share, User, Leaf, Ban, X, Target, Users, Plus, ChefHat, Clock, LogOut, Activity, Bell, Calendar, ShoppingCart, Archive, Mail, Sparkles, Check, ChevronDown, ChevronUp, Settings, Info } from 'lucide-react';
import { PersonProfile, Group, UserProfile, AppNotification } from '../types';
import { Meal } from '../data/recipes';
import { DIETARY_OPTIONS, CUISINE_OPTIONS, HEALTH_CONDITIONS, SKILL_OPTIONS, TIME_OPTIONS, COMMON_DISLIKED_INGREDIENTS, BIOLOGICAL_SEX_OPTIONS, RACE_TYPE_OPTIONS } from '../constants';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { NotificationBell } from '../components/NotificationBell';
import { initNotifications } from '../services/notificationService';

interface ProfileViewProps {
  userId: string | null;
  favorites: Meal[];
  setActiveTab: (tab: any) => void;
  setIsShareModalOpen: (open: boolean) => void;
  household: PersonProfile[];
  updateHouseholdMember: (person: PersonProfile) => void;
  deleteHouseholdMember: (id: string) => void;
  groups: Group[];
  updateGroup: (group: Group) => void;
  deleteGroup: (id: string) => void;
  selectedGroupId: string;
  handleSelectGroup: (id: string) => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export function ProfileView({
  userId,
  favorites,
  setActiveTab,
  setIsShareModalOpen,
  household,
  updateHouseholdMember,
  deleteHouseholdMember,
  groups,
  updateGroup,
  deleteGroup,
  selectedGroupId,
  handleSelectGroup,
  profile,
  setProfile
}: ProfileViewProps) {
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [newDislikedIngredient, setNewDislikedIngredient] = useState('');
  const [newDietary, setNewDietary] = useState('');
  const [newHealthCondition, setNewHealthCondition] = useState('');
  const [newFavoriteCuisine, setNewFavoriteCuisine] = useState('');
  const [newSupplement, setNewSupplement] = useState('');
  const [isConfirmingSignOut, setIsConfirmingSignOut] = useState(false);
  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);
  const [isBiometricsOpen, setIsBiometricsOpen] = useState(false);
  const signOutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [permission, setPermission] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        return Notification.permission;
      }
    } catch (e) {
      console.warn("Failed to read Notification permission status safely:", e);
    }
    return 'default';
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setPermission(Notification.permission);
      }
    } catch (e) {
      console.warn("Failed to get Notification permission safely on mount:", e);
    }
  }, []);

  const handleEnableNotifications = async () => {
    if (userId) {
      try {
        await initNotifications(userId);
        if (typeof window !== 'undefined' && 'Notification' in window) {
          setPermission(Notification.permission);
        }
      } catch (e) {
        console.warn("Failed to register notification token safely:", e);
      }
    }
  };

  const handleSignOut = () => {
    if (isConfirmingSignOut) {
      if (signOutTimeoutRef.current) clearTimeout(signOutTimeoutRef.current);
      signOut(auth);
    } else {
      setIsConfirmingSignOut(true);
      signOutTimeoutRef.current = setTimeout(() => {
        setIsConfirmingSignOut(false);
      }, 3000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 bg-[#17181C] flex flex-col z-10"
    >
      <header className="px-6 py-4 flex items-center justify-between bg-[#17181C]/80 backdrop-blur-xl border-b border-stone-800 shrink-0 z-20 sticky top-0">
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Chef's Profile</h1>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className={`${ICON_BUTTON} relative`}
          >
            <Share className="w-5 h-5" />
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {editingGroupId ? (
          <div className="space-y-8">
            <div className={`flex items-center justify-between ${CARD} p-6`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#FC5200]">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-white">Edit Group</h2>
              </div>
              <button onClick={() => setEditingGroupId(null)} className={`${PRIMARY_BUTTON} px-4 py-2 text-sm`}>Done</button>
            </div>
            
            {(() => {
              const group = groups.find(g => g.id === editingGroupId);
              if (!group) return null;
              return (
                <>
                  <div className={`${CARD} p-6`}>
                    <label className="block text-sm font-bold text-stone-300 mb-2">Group Name</label>
                    <input 
                      type="text" 
                      value={group.name}
                      onChange={e => updateGroup({ ...group, name: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-white transition-all"
                    />
                  </div>

                  <section className={`${CARD} p-6`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4 text-[#FC5200]" />
                      <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Group Members</h2>
                    </div>
                    <div className="space-y-2">
                      {household.map(person => (
                        <label key={person.id} className="flex items-center gap-3 p-3 rounded-xl border border-stone-800 hover:bg-stone-900 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={group.memberIds.includes(person.id)}
                            onChange={(e) => {
                              const newMemberIds = e.target.checked
                                ? [...group.memberIds, person.id]
                                : group.memberIds.filter(id => id !== person.id);
                              updateGroup({ ...group, memberIds: newMemberIds });
                            }}
                            className="w-5 h-5 rounded border-stone-300 text-[#FC5200] focus:ring-emerald-500"
                          />
                          <span className="text-sm font-medium text-white">{person.name}</span>
                        </label>
                      ))}
                    </div>
                  </section>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        deleteGroup(group.id);
                        setEditingGroupId(null);
                        if (selectedGroupId === group.id) {
                          const nextGroupId = groups.find(g => g.id !== group.id)?.id || '';
                          handleSelectGroup(nextGroupId);
                        }
                      }}
                      className="w-full py-4 bg-red-500/10 text-red-600 rounded-2xl font-semibold text-sm hover:bg-red-500/20 transition-all active:scale-[0.98] border border-red-500/20"
                    >
                      Delete Group
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <div className="space-y-6">
            
            <section className={`${CARD} p-6 flex flex-col gap-4`}>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-[#FC5200]" />
                <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Account & Authentication</h2>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1 block">Account Email</label>
                <input 
                  type="email" 
                  placeholder="Enter email address"
                  value={profile.email || auth.currentUser?.email || ''}
                  onChange={(e) => {
                    const email = e.target.value;
                    setProfile(prev => ({ ...prev, email }));
                    if (auth.currentUser) {
                      setDoc(doc(db, 'users', auth.currentUser.uid), { email }, { merge: true });
                    }
                  }}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-white transition-all"
                />
              </div>
              <button
                onClick={handleSignOut}
                className="w-full py-3.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-white flex items-center justify-center gap-2 mt-2"
              >
                <LogOut className="w-4 h-4" />
                {isConfirmingSignOut ? 'Tap again to confirm' : 'Sign out'}
              </button>
            </section>

            <section className={`${CARD} p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Notifications</h2>
                </div>
                <label className="flex items-center relative w-max cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    className="appearance-none transition-colors cursor-pointer w-11 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 bg-stone-200 checked:bg-indigo-500"
                    checked={profile.notifications?.enabled || false}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      let shouldRequest = false;
                      try {
                        const hasNotification = typeof window !== 'undefined' && 'Notification' in window;
                        if (hasNotification && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                          shouldRequest = true;
                        }
                      } catch (err) {
                        console.warn("Safe notification permission check failed:", err);
                      }
                      
                      if (enabled && shouldRequest) {
                        try {
                          Notification.requestPermission();
                        } catch (err) {
                          console.warn("Safe requestPermission failed:", err);
                        }
                      }
                      const newNotifications = { ...profile.notifications, enabled, mealPlanningTime: profile.notifications?.mealPlanningTime || '17:00' };
                      setProfile(prev => ({ 
                        ...prev, 
                        notifications: newNotifications
                      }));
                      if (auth.currentUser) setDoc(doc(db, 'users', auth.currentUser.uid), { notifications: newNotifications }, { merge: true });
                    }}
                  />
                  <span className="w-5 h-5 right-6 absolute rounded-full transform transition-transform bg-stone-900 border border-stone-800 shadow-sm checked:border-indigo-500 pointer-events-none checked:translate-x-5" style={{ transform: profile.notifications?.enabled ? 'translateX(20px)' : 'translateX(2px)' }} />
                </label>
              </div>

              {profile.notifications?.enabled && (
                <div className="space-y-4 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-500">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="text-sm text-stone-300 font-medium">Meal Planning Reminder</div>
                    </div>
                    <input 
                      type="time" 
                      value={profile.notifications?.mealPlanningTime || '17:00'}
                      onChange={(e) => {
                        const newNotifications = { ...profile.notifications!, mealPlanningTime: e.target.value };
                        setProfile(prev => ({ ...prev, notifications: newNotifications }));
                        if (auth.currentUser) setDoc(doc(db, 'users', auth.currentUser.uid), { notifications: newNotifications }, { merge: true });
                      }}
                      className="bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-500">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <div className="text-sm text-stone-300 font-medium">Shopping Reminder</div>
                    </div>
                    <label className="flex items-center relative w-max cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="appearance-none transition-colors cursor-pointer w-9 h-5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 bg-stone-200 checked:bg-indigo-500"
                        checked={profile.notifications?.shoppingReminder || false}
                        onChange={(e) => {
                          const newNotifications = { ...profile.notifications!, shoppingReminder: e.target.checked };
                          setProfile(prev => ({ ...prev, notifications: newNotifications }));
                          if (auth.currentUser) setDoc(doc(db, 'users', auth.currentUser.uid), { notifications: newNotifications }, { merge: true });
                        }}
                      />
                      <span className="w-4 h-4 relative -left-8 rounded-full transform transition-transform bg-stone-900 shadow-sm pointer-events-none block" style={{ transform: profile.notifications?.shoppingReminder ? 'translateX(16px)' : 'translateY(0px)' }} />
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-500">
                        <Archive className="w-4 h-4" />
                      </div>
                      <div className="text-sm text-stone-300 font-medium">Expiring Items Alert</div>
                    </div>
                    <label className="flex items-center relative w-max cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="appearance-none transition-colors cursor-pointer w-9 h-5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 bg-stone-200 checked:bg-indigo-500"
                        checked={profile.notifications?.expiringReminder || false}
                        onChange={(e) => {
                          const newNotifications = { ...profile.notifications!, expiringReminder: e.target.checked };
                          setProfile(prev => ({ ...prev, notifications: newNotifications }));
                          if (auth.currentUser) setDoc(doc(db, 'users', auth.currentUser.uid), { notifications: newNotifications }, { merge: true });
                        }}
                      />
                      <span className="w-4 h-4 relative -left-8 rounded-full transform transition-transform bg-stone-900 shadow-sm pointer-events-none block" style={{ transform: profile.notifications?.expiringReminder ? 'translateX(16px)' : 'translateY(0px)' }} />
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="text-sm text-stone-300 font-medium">Email Notifications</div>
                    </div>
                    <label className="flex items-center relative w-max cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="appearance-none transition-colors cursor-pointer w-9 h-5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 bg-stone-200 checked:bg-indigo-500"
                        checked={profile.notifications?.emailNotifications || false}
                        onChange={async (e) => {
                          const newNotifications = { ...profile.notifications!, emailNotifications: e.target.checked };
                          setProfile(prev => ({ ...prev, notifications: newNotifications }));
                          if (auth.currentUser) {
                            setDoc(doc(db, 'users', auth.currentUser.uid), { notifications: newNotifications }, { merge: true });
                            
                            try {
                              await fetch('/api/settings/notifications', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  userId: auth.currentUser.uid,
                                  emailNotificationEnabled: e.target.checked
                                })
                              });
                            } catch (error) {
                              console.error('Failed to notify server of email preference change', error);
                            }
                          }
                        }}
                      />
                      <span className="w-4 h-4 relative -left-8 rounded-full transform transition-transform bg-stone-900 shadow-sm pointer-events-none block" style={{ transform: profile.notifications?.emailNotifications ? 'translateX(16px)' : 'translateY(0px)' }} />
                    </label>
                  </div>
                  

                  <div className="pt-4 mt-2 border-t border-stone-100">
                    <button
                      onClick={async () => {
                        const msg = "This is a test notification from Forkcast! Your notifications are now properly configured.";
                        
                        // 1. Browser push
                        try {
                          const hasNotification = typeof window !== 'undefined' && 'Notification' in window;
                          if (hasNotification) {
                            if (Notification.permission === 'granted') {
                              new Notification("Forkcast Test", { body: msg });
                            } else {
                              const perm = await Notification.requestPermission();
                              if (perm === 'granted') {
                                new Notification("Forkcast Test", { body: msg });
                              }
                            }
                          } else {
                            console.warn("Notifications are not supported in this environment.");
                          }
                        } catch (e) {
                          console.warn("Safe browser notification trigger failed:", e);
                        }

                        // 2. Firestore sync
                        if (userId) {
                          const notificationId = Date.now().toString();
                          const newNotif: AppNotification = {
                            id: notificationId,
                            title: "Notification Test successful",
                            message: msg,
                            createdAt: new Date().toISOString(),
                            read: false,
                            userId: userId,
                            type: 'system'
                          };
                          await setDoc(doc(db, `users/${userId}/notifications`, notificationId), newNotif);
                        }
                      }}
                      className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-400 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-500" /> Send Test Notification
                    </button>
                  </div>
                </div>
              )}
            </section>
            <section className="pt-6 border-t border-stone-800 mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-[#FC5200]" />
                <h2 className="text-sm font-display font-medium text-white uppercase tracking-wider">Push Notifications</h2>
              </div>
              
              <div className={`${CARD} p-5`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-stone-300">Permission Status</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    permission === 'granted' ? 'bg-emerald-50 text-[#FC5200] border border-emerald-200' :
                    permission === 'denied' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {permission === 'granted' ? 'Enabled' :
                     permission === 'denied' ? 'Blocked' :
                     'Not Requested'}
                  </span>
                </div>

                {permission === 'default' && (
                  <div>
                    <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                      Stay updated! Get early alerts before your ingredients expire and timely dinner planning prompts.
                    </p>
                    <button
                      onClick={handleEnableNotifications}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] bg-stone-900 text-white hover:bg-stone-800 flex items-center justify-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      Enable Notifications
                    </button>
                  </div>
                )}

                {permission === 'granted' && (
                  <div className="flex gap-2.5 items-start text-[#FC5200]">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold">Notifications are on ✓</h4>
                      <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                        You'll be reminded about expiring ingredients and meal planning.
                      </p>
                    </div>
                  </div>
                )}

                {permission === 'denied' && (
                  <div>
                    <div className="text-rose-700">
                      <div className="flex gap-2 items-start mb-1.5">
                        <X className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
                        <h4 className="text-xs font-semibold text-rose-800">Notifications are blocked</h4>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        Enable notifications in your browser's site settings to unlock real-time expiry alerts and customized meal preparation cues.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEnableModalOpen(true)}
                      className="mt-3 w-full py-2 px-3 bg-stone-850 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-medium rounded-xl transition-colors border border-stone-800 flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <Info className="w-3.5 h-3.5 text-[#FC5200]" />
                      How to enable
                    </button>
                  </div>
                )}
              </div>
            </section>
            <section className={`${CARD} p-6`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#FC5200]" />
                  <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Household Members</h2>
                </div>
                <button 
                  onClick={() => {
                    const newId = Date.now().toString();
                    const newMember: PersonProfile = { id: newId, name: 'New Member', dietary: [], dislikedIngredients: [], favoriteCuisines: [] };
                    updateHouseholdMember(newMember);
                    setEditingPersonId(newId);
                  }}
                  className="text-[#FC5200] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-all active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <p className="text-sm text-stone-500 mb-4">
                Meal suggestions will adapt based on the combined preferences, dietary restrictions, and favorite cuisines of everyone in your household.
              </p>
              <div className="space-y-4">
                {household.map(person => (
                  <div key={person.id} className={`${CARD} p-5 flex items-center justify-between`}>
                    <div>
                      <h3 className="font-display font-bold text-white">{person.name}</h3>
                      <p className="text-xs text-stone-500 mt-1">
                        {person.dietary.length > 0 ? person.dietary.join(', ') : 'No dietary restrictions'}
                        {person.dislikedIngredients.length > 0 ? ` • Dislikes: ${person.dislikedIngredients.join(', ')}` : ''}
                        {person.favoriteCuisines.length > 0 ? ` • Loves: ${person.favoriteCuisines.join(', ')}` : ''}
                      </p>
                    </div>
                    <button 
                      onClick={() => setEditingPersonId(person.id)}
                      className={`${ICON_BUTTON}`}>
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
            
            {editingPersonId && (
              <div className="pt-6 border-t border-stone-800 space-y-8 animate-in fade-in slide-in-from-bottom-4" id="member-settings">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-bold text-white">
                    Editing Member
                  </h2>
                  <button onClick={() => setEditingPersonId(null)} className={`${PRIMARY_BUTTON} px-4 py-2 text-sm`}>
                    Close
                  </button>
                </div>
                {(() => {
              const person = household.find(p => p.id === editingPersonId);
              if (!person) return null;
              return (
                <>
                  <div className={`${CARD} p-6`}>
                    <label className="block text-sm font-bold text-stone-300 mb-2">Name</label>
                    <input 
                      type="text" 
                      value={person.name}
                      onChange={e => updateHouseholdMember({ ...person, name: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-white transition-all"
                    />
                  </div>

                  <section className={`${CARD} p-6`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Leaf className="w-4 h-4 text-[#FC5200]" />
                      <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Dietary Preferences</h2>
                    </div>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newDietary.trim()) return;
                        if (!person.dietary.includes(newDietary.trim())) {
                          updateHouseholdMember({
                            ...person,
                            dietary: [...person.dietary, newDietary.trim()]
                          });
                        }
                        setNewDietary('');
                      }}
                      className="flex gap-2 mb-3"
                    >
                      <input 
                        type="text" 
                        value={newDietary}
                        onChange={e => setNewDietary(e.target.value)}
                        placeholder="Add other preference..."
                        className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-white placeholder:text-stone-400"
                      />
                      <button type="submit" className={`${PRIMARY_BUTTON} px-5 py-2.5 text-sm`}>Add</button>
                    </form>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set([...DIETARY_OPTIONS, ...person.dietary])).map(diet => (
                        <button
                          key={diet}
                          onClick={() => {
                            updateHouseholdMember({
                              ...person,
                              dietary: person.dietary.includes(diet) 
                                ? person.dietary.filter(d => d !== diet)
                                : [...person.dietary, diet]
                            });
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-[0.98] border flex items-center gap-1 ${
                            person.dietary.includes(diet)
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                              : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-emerald-500 hover:text-[#FC5200]'
                          }`}
                        >
                          {diet}
                          {person.dietary.includes(diet) && !DIETARY_OPTIONS.includes(diet) && (
                            <X className="w-3 h-3 ml-1 opacity-70 hover:opacity-100" />
                          )}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className={`${CARD} p-6`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Ban className="w-4 h-4 text-red-500" />
                      <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Disliked Ingredients</h2>
                    </div>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newDislikedIngredient.trim()) return;
                        if (!person.dislikedIngredients.includes(newDislikedIngredient.trim())) {
                          updateHouseholdMember({
                            ...person,
                            dislikedIngredients: [...person.dislikedIngredients, newDislikedIngredient.trim()]
                          });
                        }
                        setNewDislikedIngredient('');
                      }}
                      className="flex gap-2 mb-3"
                    >
                      <input 
                        type="text" 
                        value={newDislikedIngredient}
                        onChange={e => setNewDislikedIngredient(e.target.value)}
                        placeholder="Add other ingredient..."
                        className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-white placeholder:text-stone-400"
                      />
                      <button type="submit" className={`${PRIMARY_BUTTON} px-5 py-2.5 text-sm`}>Add</button>
                    </form>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set([...COMMON_DISLIKED_INGREDIENTS, ...person.dislikedIngredients])).map(ing => (
                        <button
                          key={ing}
                          onClick={() => {
                            updateHouseholdMember({
                              ...person,
                              dislikedIngredients: person.dislikedIngredients.includes(ing) 
                                ? person.dislikedIngredients.filter(i => i !== ing)
                                : [...person.dislikedIngredients, ing]
                            });
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-[0.98] border flex items-center gap-1 ${
                            person.dislikedIngredients.includes(ing)
                              ? 'bg-red-500 border-red-500 text-white shadow-sm'
                              : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-red-500 hover:text-red-600'
                          }`}
                        >
                          {ing}
                          {person.dislikedIngredients.includes(ing) && !COMMON_DISLIKED_INGREDIENTS.includes(ing) && (
                            <X className="w-3 h-3 ml-1 opacity-70 hover:opacity-100" />
                          )}
                        </button>
                      ))}
                    </div>
                  </section>

{/* Training Profile */}
            <section className={`${CARD} p-6`}>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-[#FC5200]" />
                <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Race & Training Profile</h2>
              </div>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                Configure your race details. You'll set your daily training goal on the Home tab to get targeted recipes.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Upcoming Race Type</label>
                  <select 
                    className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                    value={person.raceType || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateHouseholdMember({ ...person, raceType: value });
                      
                    }}
                  >
                    <option value="">Select a race type...</option>
                    {['5K', '10K', 'Half Marathon', 'Marathon', 'Sprint Triathlon', 'Olympic Triathlon', 'Half Ironman (70.3)', 'Ironman', 'Not training for a race'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Race Date</label>
                  <input 
                    type="date"
                    className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                    value={person.raceDate || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateHouseholdMember({ ...person, raceDate: value });
                      
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Weekly Training Days</label>
                  <select 
                    className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                    value={person.weeklyTrainingDays || 0}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      updateHouseholdMember({ ...person, weeklyTrainingDays: value });
                      
                    }}
                  >
                    <option value={0}>Not training</option>
                    {[1,2,3,4,5,6,7].map(d => (
                      <option key={d} value={d}>{d} {d === 1 ? 'day' : 'days'} / week</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>\n
                        {/* Supplements */}
            <section className="pt-6 border-t border-stone-800">
              <div className="flex items-center gap-2 mb-2"> 
                <Activity className="w-4 h-4 text-[#FC5200]" />
                <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Supplements</h2>
              </div>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                Track your daily supplements.
              </p>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {['Vitamin D', 'Magnesium', 'Creatine', 'Omega-3'].map(supp => (
                    <button
                      key={supp}
                      onClick={() => {
                        const current = person.trackedSupplements || [];
                        if (current.includes(supp)) {
                          updateHouseholdMember({ ...person, trackedSupplements: current.filter(s => s !== supp) });
                        } else {
                          updateHouseholdMember({ ...person, trackedSupplements: [...current, supp] });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        (person.trackedSupplements || []).includes(supp)
                          ? 'bg-[#FC5200]/20 text-[#FC5200] border border-[#FC5200]/50'
                          : 'bg-stone-900 text-stone-400 border border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {supp}
                    </button>
                  ))}
                  {(person.trackedSupplements || []).filter(s => !['Vitamin D', 'Magnesium', 'Creatine', 'Omega-3'].includes(s)).map(supp => (
                    <span
                      key={supp}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#FC5200]/20 text-[#FC5200] border border-[#FC5200]/50 flex items-center gap-1"
                    >
                      {supp}
                      <button
                        onClick={() => {
                          updateHouseholdMember({
                            ...person,
                            trackedSupplements: (person.trackedSupplements || []).filter(s => s !== supp)
                          });
                        }}
                        className="text-[#FC5200] hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSupplement}
                    onChange={(e) => setNewSupplement(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSupplement.trim()) {
                        e.preventDefault();
                        const val = newSupplement.trim();
                        if (!(person.trackedSupplements || []).includes(val)) {
                          updateHouseholdMember({
                            ...person,
                            trackedSupplements: [...(person.trackedSupplements || []), val]
                          });
                        }
                        setNewSupplement('');
                      }
                    }}
                    placeholder="Add other supplement..."
                    className="flex-1 bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                  />
                  <button
                    onClick={() => {
                      if (newSupplement.trim()) {
                        const val = newSupplement.trim();
                        if (!(person.trackedSupplements || []).includes(val)) {
                          updateHouseholdMember({
                            ...person,
                            trackedSupplements: [...(person.trackedSupplements || []), val]
                          });
                        }
                        setNewSupplement('');
                      }
                    }}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </section>
            
{/* Biometrics */}
            <section className={`${CARD} overflow-hidden`}>
              <button 
                onClick={() => setIsBiometricsOpen(!isBiometricsOpen)}
                className="w-full flex items-center justify-between p-6 text-left active:bg-stone-800/50 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Fine-tune your fueling</h3>
                  <p className="text-xs text-stone-400 mt-1 font-medium">Optional — helps us personalize carb and calorie targets to your body.</p>
                </div>
                {isBiometricsOpen ? (
                  <ChevronUp className="w-5 h-5 text-stone-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                )}
              </button>
              
              {isBiometricsOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-stone-800/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-stone-300 mb-1 block">Age</label>
                      <input 
                        type="number"
                        className="w-full bg-stone-950 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-[#FC5200] focus:border-[#FC5200] block p-2.5 outline-none transition-colors"
                        value={person.age || ''}
                        onChange={(e) => {
                          const value = e.target.value ? Number(e.target.value) : undefined;
                          updateHouseholdMember({ ...person, age: value });
                          
                        }}
                        placeholder="e.g. 30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-300 mb-1 block">Biological Sex</label>
                      <div className="flex gap-2">
                        {BIOLOGICAL_SEX_OPTIONS.map(sex => (
                          <button
                            key={sex}
                            onClick={() => {
                              updateHouseholdMember({ ...person, biologicalSex: sex });
                              
                            }}
                            className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all active:scale-[0.98] border ${
                              person.biologicalSex === sex
                                ? 'bg-orange-500/10 border-[#FC5200] text-[#FC5200]'
                                : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-white'
                            }`}
                          >
                            {sex}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-300 mb-1 block">Height (cm)</label>
                      <input 
                        type="number"
                        className="w-full bg-stone-950 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-[#FC5200] focus:border-[#FC5200] block p-2.5 outline-none transition-colors"
                        value={person.heightCm || ''}
                        onChange={(e) => {
                          const value = e.target.value ? Number(e.target.value) : undefined;
                          updateHouseholdMember({ ...person, heightCm: value });
                          
                        }}
                        placeholder="e.g. 175"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-300 mb-1 block">Weight (kg)</label>
                      <input 
                        type="number"
                        className="w-full bg-stone-950 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-[#FC5200] focus:border-[#FC5200] block p-2.5 outline-none transition-colors"
                        value={person.weightKg || ''}
                        onChange={(e) => {
                          const value = e.target.value ? Number(e.target.value) : undefined;
                          updateHouseholdMember({ ...person, weightKg: value });
                          
                        }}
                        placeholder="e.g. 70"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Skill Level */}
            <section className={`${CARD} p-6`}>
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="w-4 h-4 text-[#FC5200]" />
                <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Cooking Skill Level</h2>
              </div>
              <div className="flex gap-2">
                {SKILL_OPTIONS.map(skill => (
                  <button
                    key={skill}
                    onClick={() => {
                      updateHouseholdMember({ ...person, skillLevel: skill });
                      
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] border ${
                      person.skillLevel === skill
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-emerald-500 hover:text-[#FC5200]'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </section>

            {/* Max Cooking Time */}
            <section className={`${CARD} p-6`}>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-[#FC5200]" />
                <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Max Cooking Time</h2>
              </div>
              <div className="flex gap-2">
                {TIME_OPTIONS.map(time => (
                  <button
                    key={time}
                    onClick={() => {
                      updateHouseholdMember({ ...person, maxCookingTime: time });
                      
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] border ${
                      person.maxCookingTime === time
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-emerald-500 hover:text-[#FC5200]'
                    }`}
                  >
                    {time} min
                  </button>
                ))}
              </div>
            </section>


                  <section className={`${CARD} p-6`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Favorite Cuisines</h2>
                    </div>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newFavoriteCuisine.trim()) return;
                        if (!person.favoriteCuisines.includes(newFavoriteCuisine.trim())) {
                          updateHouseholdMember({
                            ...person,
                            favoriteCuisines: [...person.favoriteCuisines, newFavoriteCuisine.trim()]
                          });
                        }
                        setNewFavoriteCuisine('');
                      }}
                      className="flex gap-2 mb-3"
                    >
                      <input 
                        type="text" 
                        value={newFavoriteCuisine}
                        onChange={e => setNewFavoriteCuisine(e.target.value)}
                        placeholder="Add other cuisine..."
                        className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-white placeholder:text-stone-400"
                      />
                      <button type="submit" className={`${PRIMARY_BUTTON} px-5 py-2.5 text-sm`}>Add</button>
                    </form>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set([...CUISINE_OPTIONS, ...person.favoriteCuisines])).map(cuisine => (
                        <button
                          key={cuisine}
                          onClick={() => {
                            updateHouseholdMember({
                              ...person,
                              favoriteCuisines: person.favoriteCuisines.includes(cuisine) 
                                ? person.favoriteCuisines.filter(c => c !== cuisine)
                                : [...person.favoriteCuisines, cuisine]
                            });
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-[0.98] border flex items-center gap-1 ${
                            person.favoriteCuisines.includes(cuisine)
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                              : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-emerald-500 hover:text-[#FC5200]'
                          }`}
                        >
                          {cuisine}
                          {person.favoriteCuisines.includes(cuisine) && !CUISINE_OPTIONS.includes(cuisine) && (
                            <X className="w-3 h-3 ml-1 opacity-70 hover:opacity-100" />
                          )}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className={`${CARD} p-6 relative overflow-hidden`}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="flex items-center gap-2 mb-4 pl-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Medical & Health Conditions</h2>
                    </div>
                    <p className="text-xs text-stone-500 mb-4 pl-2">Tap to select any conditions you have. We'll strict-filter recipes to accommodate your needs.</p>
                    <div className="pl-2">
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newHealthCondition.trim()) return;
                          if (!(person.healthConditions || []).includes(newHealthCondition.trim())) {
                            updateHouseholdMember({
                              ...person,
                              healthConditions: [...(person.healthConditions || []), newHealthCondition.trim()]
                            });
                          }
                          setNewHealthCondition('');
                        }}
                        className="flex gap-2 mb-3"
                      >
                        <input 
                          type="text" 
                          value={newHealthCondition}
                          onChange={e => setNewHealthCondition(e.target.value)}
                          placeholder="Add other condition..."
                          className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white placeholder:text-stone-400"
                        />
                        <button type="submit" className={`${PRIMARY_BUTTON} px-5 py-2.5 text-sm`}>Add</button>
                      </form>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set([...HEALTH_CONDITIONS, ...(person.healthConditions || [])])).map(condition => (
                          <button
                            key={condition}
                            onClick={() => {
                              updateHouseholdMember({
                                ...person,
                                healthConditions: (person.healthConditions || []).includes(condition) 
                                  ? (person.healthConditions || []).filter(c => c !== condition)
                                  : [...(person.healthConditions || []), condition]
                              });
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-[0.98] border flex items-center gap-1 ${
                              (person.healthConditions || []).includes(condition)
                                ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                                : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-blue-500 hover:text-blue-600'
                            }`}
                          >
                            {condition}
                            {(person.healthConditions || []).includes(condition) && !HEALTH_CONDITIONS.includes(condition) && (
                              <X className="w-3 h-3 ml-1 opacity-70 hover:opacity-100" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>

                  {household.length > 1 && (
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          deleteHouseholdMember(person.id);
                          setEditingPersonId(null);
                        }}
                        className="w-full py-4 bg-red-500/10 text-red-600 rounded-2xl font-semibold text-sm hover:bg-red-500/20 transition-all active:scale-[0.98] border border-red-500/20"
                      >
                        Delete Member
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
              </div>
            )}

            <section className={`${CARD} p-6`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#FC5200]" />
                  <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Groups</h2>
                </div>
                <button 
                  onClick={() => {
                    const newId = `g${Date.now()}`;
                    const newGroup: Group = { id: newId, name: 'New Group', memberIds: [] };
                    updateGroup(newGroup);
                    setEditingGroupId(newId);
                  }}
                  className="text-[#FC5200] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-all active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <p className="text-sm text-stone-500 mb-4">
                Create groups like "Family" or "Friends" to quickly select who you are cooking for.
              </p>
              <div className="space-y-4">
                {groups.map(group => (
                  <div key={group.id} className={`${CARD} p-5 flex items-center justify-between`}>
                    <div>
                      <h3 className="font-display font-bold text-white">{group.name}</h3>
                      <p className="text-xs text-stone-500 mt-1">
                        {group.memberIds.length} member{group.memberIds.length !== 1 ? 's' : ''}
                        {group.memberIds.length > 0 && ` • ${group.memberIds.map(id => household.find(h => h.id === id)?.name).filter(Boolean).join(', ')}`}
                      </p>
                    </div>
                    <button 
                      onClick={() => setEditingGroupId(group.id)}
                      className={`${ICON_BUTTON}`}>
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
            <section className="pt-4 border-t border-stone-800 mt-8">
              <button
                onClick={() => setActiveTab('learning')}
                className="w-full py-3.5 rounded-2xl text-lg font-semibold transition-all active:scale-[0.98] bg-[#FC5200] text-white hover:bg-[#FC5200] flex items-center justify-center gap-2 shadow-lg shadow-[#FC5200]/20"
              >
                Refine My Palate
              </button>
              <p className="text-xs text-stone-500 text-center mt-3">
                Swipe through dishes to improve your recommendations.
              </p>
            </section>
            <section className="pt-4 border-t border-stone-800 pb-8">
              <div className="flex items-center gap-2 mb-2">
                 <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">System Actions</h2>
              </div>
              <p className="text-xs text-stone-400 mb-4">Pre-populate database with default stored recipes and their respective images.</p>
              <button
                onClick={async () => {
                  try {
                    const { doc, setDoc } = await import('firebase/firestore');
                    const { db } = await import('../firebase');
                    const { ALL_MEALS } = await import('../data/recipes');
                    const { getOrGenerateRecipeImage } = await import('../services/imageGenerator');
                    
                    alert('Starting database pre-population. This will take a moment.');
                    for (const meal of ALL_MEALS) {
                       const url = await getOrGenerateRecipeImage(meal.id, meal.name, meal.cuisine, meal.details);
                       await setDoc(doc(db, 'recipes', meal.id), {
                         ...meal,
                         uid: auth.currentUser?.uid,
                         image: url
                       }, { merge: true });
                    }
                    alert('Pre-population complete!');
                  } catch (e) {
                    console.error(e);
                    alert('Pre-population failed: ' + e);
                  }
                }}
                className="w-full py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98] bg-red-500/10 text-red-600 hover:bg-red-500/20 flex items-center justify-center pb-4"
                title="Pre-populate the database with a set of default recipes (This may take a few minutes running in the background)"
              >
                Pre-Populate Recipes Database
              </button>
              <p className="text-[11px] text-center text-stone-400 mt-3 px-4 italic">
                Note: Tailoring a large batch of recipes to your unique dietary needs and generating high-quality images can take several minutes running in the background.
              </p>
            </section>
          </div>
        )}
      </div>
      {/* Notification Permission Help Modal */}
      <AnimatePresence>
        {isEnableModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setIsEnableModalOpen(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-3 text-white">
                <Bell className="w-5 h-5 text-[#FC5200]" />
                <h3 className="text-sm font-semibold">How to Enable Notifications</h3>
              </div>

              <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4 mb-4">
                <p className="text-xs text-stone-300 leading-relaxed">
                  {typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream ? (
                    "Notifications for installed apps are managed in Settings, not the browser. Go to: Settings app → Notifications → Forkcast → Allow Notifications. (If Forkcast isn't listed, open the app once first, then check again.)"
                  ) : typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent) ? (
                    "Tap the lock/info icon next to the address bar → Permissions → Notifications → Allow. Or: Chrome menu (⋮) → Settings → Site settings → Notifications → find Forkcast → Allow."
                  ) : (
                    "Click the lock/info icon in the address bar → Notifications → Allow, then refresh the page."
                  )}
                </p>
              </div>

              <button
                onClick={() => setIsEnableModalOpen(false)}
                className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-semibold transition-all active:scale-[0.98]"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
