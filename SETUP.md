# Setup Guide

## Initial Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase credentials (same as web app)
   - Set `EXPO_PUBLIC_API_URL` to your Next.js backend URL

3. **Firebase Configuration:**
   - For Android: Place `google-services.json` in the root directory
   - For iOS: Place `GoogleService-Info.plist` in the root directory
   - These files are auto-detected by the Expo plugin

4. **Start the development server:**
   ```bash
   npm start
   ```

## Additional Setup for Google Sign-In

To enable Google Sign-In, you need to install and configure:

```bash
npm install @react-native-google-signin/google-signin
```

Then update `src/components/auth/AuthProvider.tsx` to use the Google Sign-In package.

## Project Structure

- `app/` - Expo Router pages (file-based routing)
- `src/components/` - Reusable React components
- `src/lib/` - Utilities, API client, Firebase config
- `src/types/` - TypeScript type definitions
- `src/constants/` - App constants and configuration

## Key Features Implemented

✅ Authentication (username/password)
✅ Firebase integration
✅ Platform browser
✅ Basic navigation (tabs)
✅ UI component library
🔄 Google Sign-In (requires additional setup)
🔄 Course viewer (coming soon)
🔄 Video playback (coming soon)

## Notes

- The app uses the same Firebase backend as the web application
- API endpoints should point to your Next.js backend
- Some features are still in development

