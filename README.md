# 🌱 Smart Habit Coach

A gamified habit-tracking application built with React Native, Expo, and Firebase.

## Features

- **Authentication**: Secure Sign Up & Sign In with Firebase.
- **Habit Tracking**: Create, edit, delete, and mark habits as complete.
- **Weekly Insights**: Visual bar charts showing your progress over the last 7 days.
- **Reminders**: Daily local notifications to keep you on track.
- **Deleted History**: View and restore (manual re-add) your last 10 deleted habits.
- **Theme System**: Beautiful Light and Dark modes.
- **Offline First**: Works without internet (after initial login/sync logic if extended).

## Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd SmartHabitCoach
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Firebase Setup**
    - The project is pre-configured with a Firebase project.
    - If you wish to use your own, update `src/firebase.ts` with your config.

4.  **Run the app**
    - **Expo Go (Android/iOS)**:
        ```bash
        npm start
        ```
        Scan the QR code with the Expo Go app.
    - **Web**:
        ```bash
        npm run web
        ```

## Building for Production

### Android APK
1.  Install EAS CLI: `npm install -g eas-cli`
2.  Login: `eas login`
3.  Configure: `eas build:configure`
4.  Build: `eas build -p android --profile preview`

## Permissions

- **Notifications**: Required for daily habit reminders.
- **Internet**: Required for Firebase Authentication.

## Privacy Policy

**Smart Habit Coach** respects your privacy.
- **Data Collection**: We use Firebase Authentication to manage user accounts.
- **Data Storage**: Habit data is stored locally on your device using AsyncStorage.
- **Third Parties**: We do not share your personal data with third parties.

## Project Structure

```
/src
  /components     - Reusable UI components
  /screens        - App screens (Home, Insights, etc.)
  /navigation     - Navigation configuration
  /context        - State management (Auth, Theme, Habits)
  /theme          - Design system tokens
  /utils          - Helper functions
```
