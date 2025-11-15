# Migration from Expo to React Native CLI

This document tracks the migration from Expo to React Native CLI.

## Steps Completed
- [x] Planning migration
- [ ] Remove Expo dependencies
- [ ] Set up React Native CLI structure
- [ ] Replace Expo Router with React Navigation
- [ ] Configure Firebase native modules
- [ ] Set up Google Sign-In native
- [ ] Update all routing
- [ ] Test Android build
- [ ] Test iOS build

## Key Changes

### Dependencies
- Remove: `expo`, `expo-router`, `expo-*` packages
- Add: React Native CLI setup
- Keep: `@react-native-firebase/*`, `@react-native-google-signin/google-signin`

### Routing
- Replace Expo Router (file-based) with React Navigation (code-based)
- Create navigation structure manually

### Entry Point
- Change from `expo-router/entry` to custom `index.js`

### Native Configuration
- Android: `android/` folder with Gradle config
- iOS: `ios/` folder with Xcode project
- Firebase: Native configuration files

