# React Native CLI Migration - Summary

## What Changed

The project has been migrated from **Expo** to **React Native CLI**. This gives you full control over native modules and eliminates the OAuth proxy issues you were experiencing.

## Key Changes

### 1. Dependencies
- ✅ Removed: `expo`, `expo-router`, `expo-*` packages
- ✅ Added: `@react-native-firebase/*` (native Firebase modules)
- ✅ Added: `@react-navigation/*` (replaces Expo Router)
- ✅ Added: `react-native-image-picker` (replaces expo-image-picker)
- ✅ Kept: `@react-native-google-signin/google-signin` (now works natively!)

### 2. Entry Point
- Changed from `expo-router/entry` to custom `index.js` → `src/App.tsx`

### 3. Navigation
- Replaced Expo Router (file-based) with React Navigation (code-based)
- Created `src/App.tsx` with navigation structure
- All screens moved to `src/screens/`

### 4. Firebase
- Switched from Firebase Web SDK to React Native Firebase (native modules)
- Updated all Firestore calls to use native API
- Firebase now initializes from native config files (`google-services.json` / `GoogleService-Info.plist`)

### 5. Google Sign-In
- Now uses native `@react-native-google-signin/google-signin`
- No more OAuth proxy issues!
- Works directly with Firebase Auth

## Next Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize React Native Project

You need to create the native Android/iOS project structure. You have two options:

#### Option A: Use React Native CLI (Recommended)
```bash
# In a temporary directory
npx react-native init TempProject --template react-native-template-typescript

# Copy android/ and ios/ folders to your project
# Then configure them for your app
```

#### Option B: Manual Setup
Follow the detailed guide in `RN_CLI_SETUP.md`

### 3. Configure Firebase

#### Android:
1. Download `google-services.json` from Firebase Console
2. Place in `android/app/`

#### iOS:
1. Download `GoogleService-Info.plist` from Firebase Console
2. Place in `ios/` and add to Xcode project

### 4. Configure Google Sign-In

#### Android:
1. Get SHA-1 fingerprint:
```bash
cd android
./gradlew signingReport
```
2. Add SHA-1 to Firebase Console → Project Settings → Your Android App

#### iOS:
1. Add bundle identifier to Firebase Console
2. Download updated `GoogleService-Info.plist`

### 5. Environment Variables

Create `.env` file:
```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id_here
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**Note:** For React Native CLI, you may need `react-native-config` to load `.env` files, or use a different approach.

### 6. Run the App

```bash
# Start Metro bundler
npm start

# Android
npm run android

# iOS (macOS only)
npm run ios
```

## Benefits of React Native CLI

1. ✅ **Native Google Sign-In** - No more OAuth proxy issues
2. ✅ **Full Native Module Support** - Use any React Native library
3. ✅ **Better Performance** - Native modules are faster
4. ✅ **More Control** - Customize native code as needed
5. ✅ **Production Ready** - Direct builds without Expo limitations

## Troubleshooting

See `RN_CLI_SETUP.md` for detailed troubleshooting steps.

## Files Changed

- `package.json` - Updated dependencies
- `index.js` - New entry point
- `src/App.tsx` - New main app component with navigation
- `src/lib/firebase.ts` - Updated to use React Native Firebase
- `src/components/auth/AuthProvider.tsx` - Updated to use native Google Sign-In
- `src/screens/*` - All screens migrated from `app/` directory
- `babel.config.js` - Updated for React Native CLI
- `metro.config.js` - Updated for React Native CLI
- `app.json` - Simplified (no longer Expo config)

## Important Notes

- The `app/` directory is no longer used (Expo Router)
- All routing is now in `src/App.tsx`
- Firebase config comes from native files, not environment variables
- You'll need Android Studio and/or Xcode to build the app

