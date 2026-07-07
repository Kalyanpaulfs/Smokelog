# Smokelog 🚭

## Project Overview
**Smokelog** is a privacy-first, locally-powered React Native application designed to help users mindfully track, analyze, and reduce their smoking habits. By introducing intentional friction (such as motivational prompts before logging a smoke) and providing real-time data insights, the app serves as a calm, judgment-free companion on the user's journey to better health.

## Purpose of the Application
The core philosophy of Smokelog is **"Working out of the box."** 
It operates completely offline with zero latency, zero cloud sync requirements, and zero telemetry tracking. It focuses on deterministic insights based on pure time deltas to show users exactly how much time and money they have saved, and how their health is improving.

---

## Features Overview
- **Real-Time Tracking**: Precision live timers tracking the exact time since the last logged activity.
- **Financial Analytics**: Calculates the exact monetary cost of the user's habit over time.
- **Mindful Friction UI**: Intercepts the "Log Smoke" action with a confirmation sheet displaying a randomized motivational quote to encourage reconsideration.
- **Smart Data Grouping**: Automatically categorizes historical logs into collapsible sections (Today, Yesterday, This Week, Earlier) for optimal performance.
- **100% Data Ownership**: Complete offline storage with JSON export/import backup capabilities.

---

## Application Workflow & User Journey (End-to-End)
1. **Onboarding / Setup**: Upon opening the app for the first time, the user is presented with a blank slate. They navigate to **Settings** to input their specific "Cost per Cigarette".
2. **Logging an Entry**: The user taps the prominent "Log Smoke" button on the Dashboard. A bottom sheet slides up, introducing a brief pause (intentional friction) with a motivational quote. If the user confirms, the entry is saved.
3. **Tracking Progress**: The Dashboard instantly updates. The live timer resets to zero and begins counting up. The "Today" count increases, and the "Money Smoked Away" widget recalculates.
4. **Reviewing History**: The user opens the **History** tab to view past logs. If a log was made by mistake, they long-press the entry to delete it, instantly recalculating all dashboard statistics.
5. **Data Management**: After months of tracking, the user goes to Settings and clicks "Backup Data" to save their entire history locally to their device's file system as a secure JSON file.

---

## Dashboard
The Dashboard serves as the primary home screen, providing an instant, comprehensive view of the user's current progress.

### Widgets & Functionality:
- **Live Timer Card (`TimerCard` / `DashboardTimerContainer`)**: 
  - Displays the exact time (Hours, Minutes, Seconds) since the last logged smoke.
  - Pauses its interval when the app goes into the background to save battery, and calculates the exact delta upon returning to the foreground so the timer never drifts.
- **Insight Grid (`InsightGrid`)**:
  - **Today**: Total number of cigarettes smoked in the current day.
  - **Longest Streak**: The maximum amount of continuous time the user has gone without smoking.
  - **Average Interval**: The average time between each smoke break.
  - **Money Smoked Away**: A dynamic, red-highlighted card calculating the total financial cost of all logged smokes based on the user's configured "Cost per Cigarette".
- **Log Smoke Button (`LogSmokeButton`)**: 
  - A prominent, floating-style action button that triggers the logging flow.
- **Confirmation Modal (`SmokeConfirmationSheet`)**: 
  - Rather than instantly logging a smoke, tapping the button opens this sheet. It displays a randomized motivational quote and requires the user to explicitly press "Yes, log it" or "Cancel", introducing psychological friction.

---

## History
The History tab provides a complete chronological log of all tracked habits.

### Features & Functionality:
- **Smart Grouping (`HistoryList`)**:
  - Logs are mathematically grouped into visual sections: **Today**, **Yesterday**, **This Week**, and **Earlier**.
  - The **Earlier** section is collapsed by default. Because the app uses a virtualized `SectionList`, it can handle tens of thousands of logs with zero UI lag.
- **Detailed Entries (`HistoryItem`)**:
  - Each item displays the exact formatted time the smoke occurred.
- **Long-Press Deletion**:
  - Users can press and hold any log entry to trigger a deletion prompt. Removing an entry automatically cascades and recalculates all Dashboard statistics (averages, streaks, and money).

---

## Settings
The Settings tab (`settings.tsx`) allows complete control over the app's configuration and data.

### Configuration Options:
- **Theme Toggle (Header Icon)**: A Sun/Moon icon in the top right corner instantly switches the app between Light and Dark mode using the custom Theme Engine.
- **Financials (Cost per Cigarette)**: Opens a custom modal (`PromptModal`) allowing the user to input the exact decimal cost of a single cigarette. This variable powers the Dashboard's financial impact card.
- **Notifications (Achievement Alerts)**: A toggle to enable/disable local push notifications when the user hits significant health milestones.
- **Data Management (Backup Data)**: Triggers the native Document Picker/File System to export all `AsyncStorage` logs into a readable `smokelog_backup.json` file on the device.
- **Data Management (Restore Data)**: Allows the user to select a previously exported JSON file to completely restore their history.
- **Danger Zone (Reset All Data)**: A destructive action that permanently wipes the `AsyncStorage` database and resets all global Zustand states, giving the user a fresh start.

---

## Project Structure & Folder Layout

```text
src/
├── app/                  # Expo Router file-based screens (Tabs: Dashboard, History, Settings)
├── components/
│   ├── animations/       # Reusable Reanimated Wrappers (FadeIn, SlideUp)
│   ├── feature/          # Domain-specific UI (Dashboard widgets, History lists)
│   ├── layout/           # Structural wrappers (ScreenHeader, SettingsGroup)
│   └── ui/               # Core Design System Primitives (Cards, Text, Buttons, Modals)
├── constants/            # Centralized Keys & Magic Numbers
├── domain/               # Pure Typescript Business Logic (Analytics, Milestones, Services)
├── hooks/                # React custom hooks bridging Domain -> UI (useTheme, useLiveTimer)
├── infrastructure/       # External service implementations (AsyncStorage Repositories)
├── store/                # Zustand global state (Hydration & App/Smoke Stores)
├── theme/                # Design System Tokens (Colors, Spacing, Typography)
└── utils/                # Helper functions (Time formatting, math)
```

---

## Technologies Used
- **Framework**: React Native (via Expo)
- **Routing**: Expo Router (File-based routing)
- **State Management**: Zustand (Minimalist, unopinionated global state)
- **Persistence**: React Native AsyncStorage
- **Language**: TypeScript (Strict structural typing)
- **Animations**: React Native Reanimated & core Animated API
- **Icons**: Expo Vector Icons (Feather & Ionicons)

---

## Setup & Installation

1. **Clone the repository** (if applicable) and navigate to the project directory.
2. **Install Node.js** (v18 or higher recommended).
3. **Install Dependencies**:
   ```bash
   npm install
   ```

## Running the Project

To start the local development server:
```bash
npm start
```
- Press **`a`** to open the app in an Android Emulator.
- Press **`i`** to open the app in an iOS Simulator.
- Or, scan the generated **QR Code** using the **Expo Go** app on your physical mobile device.

---

## Build & Deployment

To generate a standalone `.apk` (Android) for production, this project uses **Expo Application Services (EAS)**:

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```
2. **Log in to EAS**:
   ```bash
   eas login
   ```
3. **Run the Cloud Build**:
   ```bash
   eas build -p android --profile preview --clear-cache
   ```
4. Once the build completes on Expo's servers, a QR code will be provided to download the final `.apk` directly to your device.

---

## Environment Variables
This project operates 100% offline and locally. Currently, there are **no external APIs** or backend servers required, so there is no `.env` file necessary to run the base application.

---

## Important Notes
- **Architecture Philosophy**: The application strictly separates the React UI layer from the pure TypeScript Domain layer. The UI components are completely unaware of how data is stored, interacting only through the Zustand store and Domain services.
- **Timer Battery Optimization**: The `useLiveTimer` hook explicitly listens to React Native's `AppState`. When the app enters the background, intervals are destroyed to preserve battery. When reopened, the exact time delta is recalculated and synced.

---

## Future Improvements
- **Customizable Milestones**: Allowing the user to input their custom goals (e.g., "Save $500 for a vacation").
- **Interactive Charts**: Implementing `react-native-svg` or similar libraries to visualize the 7-day trend data graphically.
- **E2E Testing Matrix**: Adding Detox integrations to automate the manual testing matrix.
- **Advanced Export Options**: Allowing users to securely export their storage blob to CSV for spreadsheet analysis.
