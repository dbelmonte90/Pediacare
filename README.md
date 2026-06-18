# PediaCare

A premium mobile app for pregnancy and child development tracking, built with Expo (React Native).

## Requirements

- Node.js 18+ and npm
- [Expo Go](https://expo.dev/go) installed on your iPhone (free, App Store)
- Your iPhone and development machine on the **same Wi-Fi network**

## Install dependencies

```bash
npm install
```

## Start Expo

```bash
npx expo start
```

This opens the Expo Developer Tools in your terminal. You will see a QR code.

## Open on iPhone

1. Open the **Camera** app on your iPhone.
2. Point it at the QR code in the terminal.
3. Tap the **"Open in Expo Go"** banner that appears.
4. The app will bundle and launch in Expo Go.

> **Tip**: If the QR code does not work, press `w` in the terminal to open the web build, or run `npx expo start --tunnel` to use a public tunnel that bypasses local network restrictions.

## Development scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run ios` | Start and open iOS simulator |
| `npm run android` | Start and open Android emulator |
| `npm run web` | Start and open browser |

## Reset demo data

If you want to wipe all persisted data and restore the default demo profiles (Sofía + Mamá), call `resetAppData()` from anywhere in the app:

```ts
import { resetAppData } from '@/shared/utils/resetAppData';

await resetAppData();
```

You can wire this to a button in a dev settings screen, or call it from the Expo dev menu using a custom script.

## Project structure

```
app/                    Expo Router screens
  (tabs)/               Main tab navigator
    index.tsx           Home
    health/             Health tracking
    nutrition/          Nutrition & food intro
    development/        Developmental milestones
    pregnancy/          Pregnancy follow-up
  modals/
    add-profile.tsx     Add profile modal
src/
  entities/             Domain types
  shared/
    ui/                 Reusable components
    theme/              Colors & typography
    constants/          Mock data & app constants
    utils/              Helper utilities
  store/                Zustand stores (persisted via AsyncStorage)
```

## Tech stack

- **Expo SDK 56** · **React Native 0.85** · **Expo Router v3**
- **Zustand 5** with `persist` + `immer` middleware
- **AsyncStorage** for local persistence
- **date-fns 4** for date utilities
- **TypeScript** strict mode
