import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseAuth, firebaseDb } from '@/lib/firebase';
import { User, Role } from '@/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { api } from '@/lib/api';
import { writeSession, clearSession } from '@/lib/session';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  loginAs: (userId: string) => Promise<void>;
  loginWithCredentials: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Configure Google Sign-In
  useEffect(() => {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (webClientId) {
      GoogleSignin.configure({
        webClientId: webClientId, // From Firebase Console
        offlineAccess: true,
      });
    } else {
      console.warn('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID not set. Google Sign-In will not work.');
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    try {
      const unsubscribe = firebaseAuth.onAuthStateChanged(async (fbUser) => {
        if (!mounted) return;
        
        if (fbUser) {
          try {
            const userRef = firebaseDb.collection('users').doc(fbUser.uid);
            const userSnap = await userRef.get();
            
            let userData: any = {};
            if (!userSnap.exists) {
              await userRef.set({
                displayName: fbUser.displayName || '',
                email: fbUser.email || '',
                photoURL: fbUser.photoURL || '',
                role: 'member',
                createdAt: firestore.FieldValue.serverTimestamp(),
                updatedAt: firestore.FieldValue.serverTimestamp(),
              });
              userData = { role: 'member' };
            } else {
              userData = userSnap.data() || {};
            }
            
            const mapped: User = {
              id: fbUser.uid,
              name: userData.displayName || fbUser.displayName || fbUser.email || 'User',
              role: (userData.role || 'member') as Role,
              avatarUrl: userData.photoURL || fbUser.photoURL || undefined,
              email: fbUser.email || undefined,
            };
            if (mounted) setUser(mapped);
          } catch (error) {
            console.error('Error checking/creating user document:', error);
            const mapped: User = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email || 'User',
              role: 'member',
              avatarUrl: fbUser.photoURL || undefined,
              email: fbUser.email || undefined,
            };
            if (mounted) setUser(mapped);
          }
        } else {
          if (mounted) setUser(null);
        }
        if (mounted) setLoading(false);
      });

      // Set a timeout to ensure loading doesn't hang forever
      const timeout = setTimeout(() => {
        if (mounted) {
          console.warn('Auth initialization timeout, setting loading to false');
          setLoading(false);
        }
      }, 5000);

      return () => {
        mounted = false;
        clearTimeout(timeout);
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      if (mounted) {
        setLoading(false);
      }
    }
  }, []);

  async function loginAs(userId: string) {
    setLoading(true);
    try {
      await api.post('/api/auth/login', { userId });
      const me = await api.get('/api/auth/me');
      setUser(me.user);
      await writeSession({ userId: me.user.id, role: me.user.role });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loginWithCredentials(username: string, password: string) {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { username, password });
      const me = await api.get('/api/auth/me');
      setUser(me.user);
      await writeSession({ userId: me.user.id, role: me.user.role });
      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message || 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  }

  async function loginWithGoogle() {
    try {
      setLoading(true);
      
      const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
      if (!webClientId) {
        return { 
          ok: false, 
          error: 'Google Sign-In not configured. Please set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in your .env file.' 
        };
      }
      
      // Check if Google Play Services are available (Android only)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }
      
      // Get user info from Google Sign-In
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo.idToken) {
        return { ok: false, error: 'Failed to get ID token from Google' };
      }
      
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      
      // Sign in to Firebase with the Google credential
      await firebaseAuth.signInWithCredential(googleCredential);
      
      console.log('Successfully signed in to Firebase with Google credential');
      
      // The onAuthStateChanged listener will handle updating the user state
      return { ok: true };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Handle specific error cases
      if (error.code === 'sign_in_cancelled') {
        return { ok: false, error: 'Sign-in was cancelled' };
      } else if (error.code === 'in_progress') {
        return { ok: false, error: 'Sign-in already in progress' };
      } else if (error.code === 'play_services_not_available') {
        return { ok: false, error: 'Google Play Services not available' };
      }
      
      return { ok: false, error: error.message || 'Google sign-in failed' };
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await firebaseAuth.signOut();
      await GoogleSignin.signOut(); // Also sign out from Google
      await clearSession();
      try {
        await api.post('/api/auth/logout');
      } catch (e) {
        // Ignore API errors on logout
      }
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginAs,
        loginWithCredentials,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

