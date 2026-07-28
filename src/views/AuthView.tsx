import React, { useState } from 'react';
import { ChefHat } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ALL_MEALS } from '../data/recipes';

export function AuthView() {
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        const user = userCredential.user;
        await setDoc(doc(db, `users/${user.uid}`), {
          uid: user.uid,
          email: user.email,
          favoriteCuisines: [],
          skillLevel: 'Intermediate',
          maxCookingTime: 60,
          likedTags: {},
          dislikedTags: {},
          hasCompletedOnboarding: false,
          createdAt: new Date().toISOString(),
          queuedSuggestions: [...ALL_MEALS].sort(() => Math.random() - 0.5).slice(0, 50).map(m => ({
            ...m,
            dynamicReason: m.reason || 'Perfect to get you started',
            groupReason: 'Perfect for just you'
          }))
        }, { merge: true });
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, `users/${user.uid}`));
      if (!userDoc.exists()) {
        await setDoc(doc(db, `users/${user.uid}`), {
          uid: user.uid,
          email: user.email,
          favoriteCuisines: [],
          skillLevel: 'Intermediate',
          maxCookingTime: 60,
          likedTags: {},
          dislikedTags: {},
          hasCompletedOnboarding: false,
          createdAt: new Date().toISOString(),
          queuedSuggestions: [...ALL_MEALS].sort(() => Math.random() - 0.5).slice(0, 50).map(m => ({
            ...m,
            dynamicReason: m.reason || 'Perfect to get you started',
            groupReason: 'Perfect for just you'
          }))
        }, { merge: true });
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        setAuthError('Popup was blocked. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/network-request-failed') {
        setAuthError('Network error. Please check your connection and try again.');
      } else {
        setAuthError(error.message || 'Sign in failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 p-4 font-sans">
      <div className="w-full max-w-md bg-stone-900 rounded-3xl shadow-xl border border-stone-100 p-8 sm:p-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-emerald-100 text-[#FC5200] rounded-full flex items-center justify-center">
            <ChefHat className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Forkcast</h1>
        <p className="text-stone-500 text-sm mb-8">Less waste. Less thinking. Better meals.</p>
        
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-stone-900 border border-stone-800 text-stone-300 px-4 py-3.5 rounded-xl font-medium hover:bg-stone-900 active:scale-[0.98] transition-all shadow-sm mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-stone-200"></div>
          <span className="text-stone-400 text-sm font-medium">or</span>
          <div className="flex-1 h-px bg-stone-200"></div>
        </div>

        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-stone-800 bg-stone-900 focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-white placeholder:text-stone-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-stone-800 bg-stone-900 focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-white placeholder:text-stone-400"
            required
          />
          
          <button
            type="submit"
            className="w-full bg-[#FC5200] text-white px-4 py-3.5 rounded-xl font-medium hover:bg-[#FC5200] active:scale-[0.98] transition-all shadow-sm mt-2"
          >
            {isSignUp ? 'Create new account' : 'Sign In as existing user'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setAuthError('');
            }}
            className="text-stone-500 text-sm hover:text-white mt-2 font-medium transition-colors"
          >
            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>

          {authError && (
            <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-full text-sm font-medium mt-2 border border-red-100">
              {authError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
