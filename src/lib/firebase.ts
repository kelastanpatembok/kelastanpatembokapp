// Firebase React Native SDK (native modules)
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// React Native Firebase automatically initializes from native config files:
// - Android: google-services.json
// - iOS: GoogleService-Info.plist

export const firebaseAuth = auth();
export const firebaseDb = firestore();
export const firebaseStorage = storage();

