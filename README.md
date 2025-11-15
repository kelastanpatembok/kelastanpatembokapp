# Kelas Tanpa Tembok Mobile App

React Native mobile application for the Kelas Tanpa Tembok (RWID Community) platform.

## Tech Stack

- **React Native** (0.76.5) with **Expo** (SDK 52)
- **TypeScript**
- **Expo Router** for navigation
- **NativeWind** (Tailwind CSS for React Native)
- **Firebase** (Auth, Firestore, Storage)
- **React Query** for server state management
- **React Hook Form** + **Zod** for forms

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Firebase and API credentials
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
- iOS: Press `i` or run `npm run ios`
- Android: Press `a` or run `npm run android`
- Web: Press `w` or run `npm run web`

## Project Structure

```
app/                    # Expo Router pages
  (auth)/              # Authentication screens
  (tabs)/              # Main tab navigation
src/
  components/          # Reusable components
    ui/               # Base UI components
    auth/             # Auth-related components
  lib/                # Utilities and configurations
  types/              # TypeScript type definitions
  constants/           # App constants
```

## Features

- ✅ Authentication (Google OAuth + credentials)
- ✅ Platform browser
- ✅ Course viewer (coming soon)
- ✅ Bookmarks (coming soon)
- ✅ Profile management
- 🔄 Video playback (in progress)
- 🔄 Community features (in progress)
- 🔄 Payments (in progress)

## Environment Variables

See `.env.example` for required environment variables.

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

## Notes

- The app shares the same Firebase backend as the web application
- API endpoints point to the Next.js backend
- Some features are still in development

