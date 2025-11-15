# React Native CLI Setup Guide

This project has been migrated from Expo to React Native CLI. Follow these steps to set up the development environment.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Java Development Kit (JDK)** - Version 17 or higher
3. **Android Studio** (for Android development)
4. **Xcode** (for iOS development, macOS only)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Install React Native CLI (if not already installed)

```bash
npm install -g react-native-cli
```

### 3. Android Setup

#### Install Android Studio
1. Download and install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio and install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

#### Configure Environment Variables (Windows)
Add to your system environment variables:
```
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

#### Create Android Project
```bash
npx react-native init KelasTanpaTembokApp --template react-native-template-typescript
```

**Note:** Since we're migrating an existing project, you'll need to manually set up the Android folder. See "Manual Android Setup" below.

### 4. iOS Setup (macOS only)

1. Install Xcode from the App Store
2. Install CocoaPods:
```bash
sudo gem install cocoapods
```

3. Navigate to ios folder and install pods:
```bash
cd ios
pod install
cd ..
```

### 5. Firebase Configuration

#### Android
1. Download `google-services.json` from Firebase Console
2. Place it in `android/app/` directory

#### iOS
1. Download `GoogleService-Info.plist` from Firebase Console
2. Place it in `ios/` directory
3. Add it to Xcode project

### 6. Google Sign-In Configuration

#### Android
1. Get SHA-1 fingerprint:
```bash
cd android
./gradlew signingReport
```

2. Add SHA-1 to Firebase Console → Project Settings → Your Android App

#### iOS
1. Add your bundle identifier to Firebase Console
2. Download the updated `GoogleService-Info.plist`

## Running the App

### Android
```bash
npm run android
```

Or:
```bash
npx react-native run-android
```

### iOS
```bash
npm run ios
```

Or:
```bash
npx react-native run-ios
```

### Start Metro Bundler
```bash
npm start
```

## Manual Android Setup (If needed)

If the Android project doesn't exist, you'll need to:

1. **Create Android folder structure:**
   - `android/app/src/main/java/com/rwid/kelastanpatembok/`
   - `android/app/src/main/res/`

2. **Create necessary files:**
   - `android/build.gradle`
   - `android/app/build.gradle`
   - `android/settings.gradle`
   - `android/gradle.properties`
   - `android/app/src/main/AndroidManifest.xml`
   - `android/app/src/main/java/com/rwid/kelastanpatembok/MainActivity.kt` (or `.java`)

3. **Configure Gradle:**
   - Add Firebase and Google Sign-In dependencies
   - Configure package name: `com.rwid.kelastanpatembok`

## Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
```

### iOS Build Issues
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Firebase Not Initializing
- Ensure `google-services.json` (Android) or `GoogleService-Info.plist` (iOS) is in the correct location
- Check that Firebase plugins are properly configured in Gradle (Android) or Podfile (iOS)

## Environment Variables

Create a `.env` file in the root directory:
```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id_here
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**Note:** For React Native CLI, you may need to use `react-native-config` or `react-native-dotenv` to load environment variables, or use a different approach.

## Next Steps

1. Initialize React Native project structure (if not done automatically)
2. Configure Firebase native modules
3. Set up Google Sign-In native configuration
4. Test the app on Android/iOS device or emulator

