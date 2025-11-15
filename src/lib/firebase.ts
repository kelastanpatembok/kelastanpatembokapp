// Firebase Web SDK for Expo Go compatibility
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '@/constants/config';

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
  measurementId: config.firebase.measurementId,
};

// Validate Firebase config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn('Firebase config is missing required fields. Please check your .env file.');
}

// Initialize Firebase
let firebaseApp;
try {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else {
    firebaseApp = getApp();
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize Auth with AsyncStorage persistence for React Native
let firebaseAuth;
try {
  firebaseAuth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  console.log('Firebase Auth initialized with AsyncStorage persistence');
} catch (error: any) {
  // If auth is already initialized, get the existing instance
  if (error.code === 'auth/already-initialized') {
    firebaseAuth = getAuth(firebaseApp);
    console.log('Firebase Auth already initialized, using existing instance');
  } else {
    console.error('Error initializing Firebase Auth:', error);
    throw error;
  }
}

export const firebaseDb = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
export { firebaseAuth, firebaseApp };

