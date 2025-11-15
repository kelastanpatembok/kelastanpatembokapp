# Android Setup Guide

The Android project structure has been created! Follow these steps to complete the setup:

## 1. Install Dependencies

```bash
npm install
```

## 2. Firebase Configuration

### Get google-services.json

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Scroll down to **Your apps** section
5. Click on your Android app (or create one if it doesn't exist)
6. Download `google-services.json`
7. Place it in: `android/app/google-services.json`

**Important:** The package name in Firebase must match: `com.rwid.kelastanpatembok`

## 3. Get SHA-1 Fingerprint (for Google Sign-In)

Run this command to get your SHA-1 fingerprint:

```bash
cd android
./gradlew signingReport
```

Look for the SHA-1 value under `Variant: debug` → `SHA1:`

### Add SHA-1 to Firebase

1. Go to Firebase Console → Project Settings
2. Find your Android app
3. Click **Add fingerprint**
4. Paste your SHA-1 value
5. Click **Save**

## 4. Environment Variables

Create a `.env` file in the root directory:

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id_here
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**To get Web Client ID:**
1. Go to Firebase Console → Project Settings
2. Scroll to **Your apps** → Android app
3. Find **OAuth 2.0 Client IDs** section
4. Copy the **Web client** ID (not Android client)

## 5. Run the App

### First Time Setup

Make sure you have:
- Android Studio installed
- Android SDK installed
- Android emulator or physical device connected

### Start Metro Bundler

```bash
npm start
```

### Run on Android

In a new terminal:

```bash
npm run android
```

Or:

```bash
npx react-native run-android
```

## Troubleshooting

### Build Errors

If you get build errors, try:

```bash
cd android
./gradlew clean
cd ..
npm start -- --reset-cache
npm run android
```

### Firebase Not Initializing

- Make sure `google-services.json` is in `android/app/`
- Verify package name matches: `com.rwid.kelastanpatembok`
- Check that SHA-1 is added to Firebase Console

### Google Sign-In Not Working

- Verify `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is set correctly
- Make sure SHA-1 is added to Firebase
- Check that `google-services.json` has the correct OAuth client ID

### Metro Bundler Issues

```bash
npm start -- --reset-cache
```

## Project Structure

```
android/
├── app/
│   ├── build.gradle          # App-level Gradle config
│   ├── google-services.json  # Firebase config (you need to add this)
│   ├── src/
│   │   └── main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/com/rwid/kelastanpatembok/
│   │       │   ├── MainActivity.kt
│   │       │   └── MainApplication.kt
│   │       └── res/
│   │           └── values/
│   │               ├── strings.xml
│   │               └── styles.xml
├── build.gradle              # Project-level Gradle config
├── settings.gradle
└── gradle.properties
```

## Next Steps

1. ✅ Android project structure created
2. ⏳ Add `google-services.json` from Firebase
3. ⏳ Get SHA-1 and add to Firebase
4. ⏳ Set environment variables
5. ⏳ Run `npm install`
6. ⏳ Run `npm run android`

