# Google Sign-In Setup Guide

This guide explains how to get the `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` needed for Google Sign-In in the React Native app.

## Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project (the same one used by your web app)

## Step 2: Navigate to Project Settings

1. Click the **gear icon** (⚙️) next to "Project Overview" in the left sidebar
2. Select **"Project settings"**

## Step 3: Find Your Web App Configuration

1. Scroll down to the **"Your apps"** section
2. Find your **Web app** (the one with the `</>` icon)
3. If you don't have a Web app yet:
   - Click **"Add app"** → Select **Web** (`</>`)
   - Register your app with a nickname
   - Copy the Firebase config (you'll need this too)

## Step 4: Get the Web Client ID

The Web Client ID is **NOT** in the Firebase config directly. You need to get it from Google Cloud Console:

### Option A: From Firebase Console (Easier)

1. In Firebase Console → Project Settings
2. Go to the **"General"** tab
3. Scroll to **"Your apps"** section
4. Click on your **Web app**
5. Look for **"Web client ID"** or go to **"Service accounts"** tab
6. The Web Client ID format is: `xxxxx-xxxxx.apps.googleusercontent.com`

### Option B: From Google Cloud Console (More Detailed)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **"APIs & Services"** → **"Credentials"**
4. Look for **"OAuth 2.0 Client IDs"**
5. Find the one with type **"Web application"** (not Android/iOS)
6. Click on it to see details
7. Copy the **"Client ID"** (this is your Web Client ID)

## Step 5: Add to Your .env File

Add the Web Client ID to your `.env` file in the React Native app root:

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id-here.apps.googleusercontent.com
```

**Important Notes:**
- The Web Client ID is different from:
  - Firebase API Key
  - Firebase App ID
  - Android Client ID
  - iOS Client ID
- It should end with `.apps.googleusercontent.com`
- It's the same Web Client ID used by your Next.js web app

## Step 6: Configure OAuth Consent Screen (If Needed)

If you haven't set up OAuth consent screen:
1. Go to Google Cloud Console → **"APIs & Services"** → **"OAuth consent screen"**
2. Configure the consent screen (External or Internal)
3. Add your app name, support email, etc.
4. Add scopes: `email`, `profile`, `openid`
5. Add authorized redirect URIs (Expo will handle this automatically)

## Step 7: Verify It Works

After adding the Web Client ID to your `.env` file:
1. Restart your Expo dev server (`npx expo start --clear`)
2. Try the "Continue with Google" button
3. It should open a browser/WebView for Google authentication

## Troubleshooting

### "Google Sign-In not configured" error
- Make sure `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is in your `.env` file
- Restart the Expo server after adding it
- Check that the value doesn't have quotes around it

### "Invalid client" error
- Verify the Web Client ID is correct
- Make sure you're using the **Web** client ID, not Android/iOS
- Check that OAuth consent screen is configured

### Sign-in opens but fails
- Check that your OAuth consent screen is published (if using External)
- Verify the redirect URI is allowed (Expo handles this automatically)

## Example .env File

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Sign-In (Web Client ID)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com

# API URL
EXPO_PUBLIC_API_URL=http://localhost:3000

# Midtrans (optional)
EXPO_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```
