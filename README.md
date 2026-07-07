# Smokelog

Smokelog is a calm, judgment-free time-tracking companion designed to help users track smoke breaks effortlessly. Built entirely locally with no network tracking, it prioritizes privacy, absolute timer precision, and deterministic health motivation.

---

## 🏗 Overview
The core philosophy of Smokelog is **"Working out of the box."** No login, no cloud sync, no latency.

Key Features:
- **Instant Logging**: Debounced persistence with immediate UI feedback.
- **Precision Time Tracking**: Real-world synchronized clock polling that remains accurate across device sleep, backgrounding, and timezone changes.
- **Deterministic Insights**: Health milestones and motivational insights computed purely from time deltas, ensuring mathematical consistency.
- **Privacy First**: 100% offline. Zero tracking. Zero telemetry.

---

## 🛠 Technology Stack

- **React Native (Expo)**: Rapid, native development.
- **Zustand**: Minimalist, unopinionated global state management.
- **AsyncStorage**: Standard React Native persistence.
- **TypeScript**: Strict structural typing across the entire Domain.
- **Expo Router**: File-based routing for instant navigation setups.

---

## 🏛 Architecture & Engineering Decisions

We utilized a strict **Separation of Concerns** separating the React UI layer from the pure Typescript Domain layer. 

### Why AsyncStorage?
Standard `AsyncStorage` provides reliable local persistence. The application architecture hydrates this data seamlessly during the splash screen, avoiding UI flashing during initial app load and providing seamless synchronous interactions afterward.

### Why Zustand?
Zustand provides a tiny, boilerplate-free state container. Unlike Redux, it doesn't require complex providers or action dispatchers. It allows our UI to subscribe exclusively to the slices of state they care about, drastically reducing React re-renders.

### The Repository Pattern
The application data is routed through a `SmokeLogRepository` interface.
This guarantees that the core Domain logic (`SmokeLogService`) has absolutely no idea *how* the data is stored. If we ever migrate from AsyncStorage to SQLite, zero domain logic needs to change.

### ClockService & TimerEngine
`ClockService` abstracts `Date.now()`. This makes the entire time-based application trivial to unit test by mocking a single provider.
The `TimerEngine` strictly calculates delta `(now - lastTimestamp)` rather than aggregating `+1` every second. This guarantees the timer *never drifts*, even if the user backgrounds the app for a week or turns their device off.

### Battery Optimization (AppState Lifecycle)
Timers are expensive. The `useLiveTimer` hook explicitly listens to React Native's `AppState`. When the app enters the `background` or `inactive` state, the timer intervals are completely obliterated to save battery. When the user returns to `active`, the exact delta is recalculated and the timer smoothly resumes precisely locked to the clock's second boundaries.

---

## 📁 Folder Structure

```
src/
├── app/                  # Expo Router file-based screens
├── components/
│   ├── animations/       # Reusable Reanimated Wrappers
│   ├── feature/          # Domain-specific UI (Dashboard, History)
│   ├── layout/           # Structural wrappers (Headers, Groups)
│   └── ui/               # Core Design System Primitives (Cards, Text, Buttons)
├── constants/            # Centralized Keys & Magic Numbers
├── domain/               # Pure Typescript Business Logic & Services
├── hooks/                # React custom hooks bridging Domain -> UI
├── infrastructure/       # External service implementations (MMKV)
├── storage/              # Low-level MMKV wrappers
├── store/                # Zustand global state (Hydration & Selectors)
├── theme/                # Design System Tokens (Colors, Spacing, Typography)
└── utils/                # Helper functions
```

---

## ⚙️ Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Locally (Development)**
   ```bash
   npm start
   # Press 'a' for Android, 'i' for iOS
   ```

3. **Run Production Build Verification**
   ```bash
   npx expo export
   # Outputs the optimized JS bundles exactly as they would run on-device
   ```

---

## 📈 Future Improvements

While Smokelog is production-ready, future iterations could include:
- **E2E Testing Matrix**: Detox integrations to automate the manual testing matrix.
- **Haptic Feedback**: Leveraging `expo-haptics` during the button press for tactile confirmation.
- **Advanced Data Export**: Allowing users to securely export their storage blob to JSON or CSV for backup.
- **Customizable Milestones**: Allowing the user to input their custom goals.
