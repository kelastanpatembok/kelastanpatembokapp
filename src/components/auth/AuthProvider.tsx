import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseAuth, firebaseDb } from '@/lib/firebase';
import { User, Role } from '@/types';
import { onAuthStateChanged, signInWithCredential, signOut, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { api } from '@/lib/api';
import { writeSession, clearSession } from '@/lib/session';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

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

  // Configure WebBrowser for OAuth (used by Google Sign-In)
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);

  useEffect(() => {
    let mounted = true;
    
    try {
      const unsubscribe = onAuthStateChanged(
        firebaseAuth,
        async (fbUser) => {
          if (!mounted) return;
          
          if (fbUser) {
            try {
              const userRef = doc(firebaseDb, 'users', fbUser.uid);
              const userSnap = await getDoc(userRef);
              
              let userData: any = {};
              if (!userSnap.exists()) {
                await setDoc(userRef, {
                  displayName: fbUser.displayName || '',
                  email: fbUser.email || '',
                  photoURL: fbUser.photoURL || '',
                  role: 'member',
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
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
        },
        (error) => {
          console.error('Firebase auth state change error:', error);
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        }
      );

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
      
      // Use expo-auth-session for Google OAuth (works with Expo Go)
      // Must use Expo's proxy URL (https://auth.expo.io) because Google OAuth
      // only accepts HTTP/HTTPS URLs, not custom schemes like exp://
      // When useProxy is true in promptAsync, it should use the proxy, but
      // we need to ensure the redirectUri is also set correctly
      let redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
      });
      
      // If it's still using exp://, manually construct the proxy URL
      if (!redirectUri.startsWith('https://')) {
        // Construct the Expo proxy URL manually
        const expoUsername = 'anonymous'; // For Expo Go, it's always anonymous
        const appSlug = 'kelastanpatembokapp'; // From app.json
        redirectUri = `https://auth.expo.io/@${expoUsername}/${appSlug}`;
        console.log('Manually using proxy redirect URI:', redirectUri);
      } else {
        console.log('Using redirect URI:', redirectUri);
      }
      
      // Generate a random nonce for security (required by Google for ID token flow)
      const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const request = new AuthSession.AuthRequest({
        clientId: webClientId,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.IdToken,
        redirectUri,
        usePKCE: false, // PKCE not supported for ID token flow
        extraParams: {
          nonce: nonce, // Required by Google for ID token response type
        },
      });
      
      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };
      
      // useProxy: true ensures Expo uses https://auth.expo.io as the proxy
      const result = await request.promptAsync(discovery, {
        useProxy: true,
        showInRecents: true,
      });
      
      console.log('OAuth result type:', result.type);
      console.log('OAuth result params:', result.params);
      console.log('OAuth result error:', result.error);
      
      if (result.type === 'success') {
        const { id_token } = result.params;
        
        if (!id_token) {
          console.error('No ID token in OAuth response:', result.params);
          return { ok: false, error: 'Failed to get ID token from Google' };
        }
        
        try {
          // Create a Google credential with the ID token
          const googleCredential = GoogleAuthProvider.credential(id_token);
          
          // Sign in to Firebase with the Google credential
          await signInWithCredential(firebaseAuth, googleCredential);
          
          console.log('Successfully signed in to Firebase with Google credential');
          
          // The onAuthStateChanged listener will handle updating the user state
          return { ok: true };
        } catch (firebaseError: any) {
          console.error('Firebase sign-in error:', firebaseError);
          return { 
            ok: false, 
            error: firebaseError.message || 'Failed to sign in to Firebase' 
          };
        }
      } else if (result.type === 'dismiss') {
        // OAuth was dismissed (user closed the browser/error screen)
        // Check if Firebase auth actually succeeded despite the dismiss
        // This can happen if the OAuth completed but the redirect failed
        console.log('OAuth dismissed, checking if Firebase auth succeeded...');
        
        try {
          const currentUser = firebaseAuth.currentUser;
          if (currentUser) {
            console.log('Firebase auth succeeded despite OAuth dismiss, user:', currentUser.uid);
            // The onAuthStateChanged listener will handle updating the user state
            return { ok: true };
          } else {
            // Check if there's an ID token in the params even though type is dismiss
            const { id_token } = result.params || {};
            if (id_token) {
              console.log('Found ID token in dismiss result, attempting Firebase sign-in...');
              try {
                const googleCredential = GoogleAuthProvider.credential(id_token);
                await signInWithCredential(firebaseAuth, googleCredential);
                console.log('Successfully signed in to Firebase with ID token from dismiss result');
                return { ok: true };
              } catch (firebaseError: any) {
                console.error('Firebase sign-in error with dismiss token:', firebaseError);
              }
            }
            return { ok: false, error: 'Sign-in was cancelled or failed' };
          }
        } catch (error) {
          console.error('Error checking Firebase auth state:', error);
          return { ok: false, error: 'Sign-in was cancelled' };
        }
      } else if (result.type === 'cancel') {
        return { ok: false, error: 'Sign-in was cancelled' };
      } else {
        console.error('OAuth error:', result.error);
        return { ok: false, error: result.error?.message || 'Google sign-in failed' };
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        return { ok: false, error: 'Sign-in was cancelled' };
      }
      
      return { ok: false, error: error.message || 'Google sign-in failed' };
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await signOut(firebaseAuth);
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

