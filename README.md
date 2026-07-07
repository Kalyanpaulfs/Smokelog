# Smokelog 🚭

**Smokelog** is a highly polished, offline-first, privacy-focused React Native application designed to help users track and ultimately reduce their smoking habits. It focuses on intentional friction, deep psychological motivation, and seamless user experience.

---

## 🌟 Key Features

### ⏱️ Dynamic Dashboard & Live Tracking
- **Live Timer:** The dashboard features a beautiful, real-time timer tracking exactly how long it has been since your last logged activity.
- **Quick Insights:** Automatically calculates and displays your "Today" total, Longest Streak, Average Interval, and Daily Average.
- **7-Day Trend:** A visual representation of your progress over the last week to keep you motivated.

### 💰 Financial Impact Calculator
- **Money Smoked Away:** Users can enter the exact cost of a single cigarette in the Settings. The dashboard dynamically updates a bright red warning card showing exactly how much money has literally gone up in smoke based on total all-time logs.

### 🛑 Intentional Friction UI
- **Mindful Logging:** We don't want logging to be completely thoughtless. Tapping "Log Smoke" pulls up an elegant bottom sheet that presents a randomized motivational quote and asks the user to take a breath and reconsider before confirming. 
- **Premium Aesthetics:** Features custom typography, haptic feedback, and modern native animations.

### 📅 Smart History Management
- **Intelligent Grouping:** Logs are automatically categorized into "Today", "Yesterday", "This Week", and "Earlier". 
- **Clutter-Free:** The "Earlier" group is collapsed by default, and thanks to React Native's Virtualized SectionLists, the app can handle years of data (20,000+ logs) without a single frame drop.
- **Undo / Delete:** Made a mistake? Simply long-press any entry to safely delete it. The app instantly recalculates all your averages and streaks.

### 🔒 100% Offline & Privacy-First
- **Local Storage:** Everything is saved directly to your device via `AsyncStorage`. There are no external servers, no accounts, and absolutely zero tracking.
- **Data Portability:** Complete freedom over your data. You can Export your entire history to a JSON file, or Import a previous backup to restore your data instantly.
- **Nuclear Option:** A secure "Reset All Data" button to permanently wipe the database when you want a fresh start.

### 🎨 Premium Theming & UX
- **Theme Engine:** Fully supports Light Mode, Dark Mode, and System Default, with adaptive text contrast that looks beautiful in any environment.
- **Micro-interactions:** Haptic feedback on buttons, fluid bottom sheets, and native scaling animations make the app feel incredibly premium.

---

## 🛠️ Technology Stack

- **Framework:** React Native / Expo
- **Routing:** Expo Router (File-based routing)
- **State Management:** Zustand (Ultra-lightweight, hook-based state management)
- **Persistence:** React Native AsyncStorage
- **Styling:** Custom StyleSheet architecture utilizing semantic Design Tokens (Spacing, Typography, Border Radius, Shadows).

---

## 🚀 How to Run Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm start
   ```

3. **Run on your Device:**
   Scan the QR code in your terminal using the **Expo Go** app (available on iOS and Android).

## 📦 Building the APK

To generate a standalone `.apk` for Android, this project uses **Expo Application Services (EAS)**:

1. Install the EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```
2. Log in with your Expo account:
   ```bash
   eas login
   ```
3. Run the cloud build for Android:
   ```bash
   eas build -p android --profile preview
   ```
4. Once the cloud build completes, you will be provided a QR code to download the `.apk` directly to your phone.
