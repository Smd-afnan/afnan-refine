
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { User as AppUser, UserSettings } from '@/types';
import { Spinner } from '@/components/ui/spinner';

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          // Create new user in firestore
          const newUser: AppUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: firebaseUser.displayName!,
            full_name: firebaseUser.displayName!,
            fcmToken: '',
          };
          await setDoc(userDocRef, newUser);
          setAppUser(newUser);

          // Create default settings for new user
          const defaultSettings: Omit<UserSettings, 'id' | 'created_by'> = {
            show_opening_dua: true,
            randomize_daily_dua: true,
            dua_audio_enabled: false,
            contextual_dua_mode: true,
            app_language: 'english',
            dark_mode: false,
            notifications_enabled: false,
            last_dua_shown_date: '',
            preferred_language: 'arabic_english',
          };
          await setDoc(doc(db, 'userSettings', firebaseUser.uid), { ...defaultSettings, created_by: firebaseUser.email! });

        } else {
          setAppUser(userDoc.data() as AppUser);
        }
      } else {
        setUser(null);
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, appUser, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// A component to display a loading spinner while auth state is being determined.
export const AuthLoadingSpinner = () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Spinner size="large" />
    </div>
);
