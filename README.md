

#  **Smart Habit Coach**

### *Stay consistent. Stay motivated. Build better habits.*
A beautifully designed **gamified habit-tracking app** built with **React Native**, **Expo**, and **Firebase** — focused on simplicity, motivation, and consistency.

---

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK%2051-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React%20Native-Mobile%20App-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Made%20with-TypeScript-3178C6?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Platform-Android-success?style=for-the-badge" />
</p>

---

## 🚀 **Features**

### 🔐 **Authentication**

* Secure Sign Up / Sign In via **Firebase Authentication**

### ✅ **Habit Management**

* Create, edit, delete habits
* Mark habits as complete
* Smooth, intuitive UI with offline-first behavior

### 📊 **Weekly Insights**

* Auto-generated bar charts for last 7 days
* Visual progress tracking to boost consistency

### ⏰ **Smart Reminders**

* Daily local notifications
* Works even when the app is closed

### 🗂️ **Deleted Habit History**

* Stores last 10 deleted habits
* Option to manually restore / re-add them

### 🌓 **Light & Dark Themes**

* Modern theme system for beautiful UI
* Automatic or manual switching

### 📴 **Offline First**

* Habit data stored locally using **AsyncStorage**
* Works without internet after login

## 🛠 **Tech Stack**

| Category         | Technology                 |
| ---------------- | -------------------------- |
| Framework        | Expo SDK 51+, React Native |
| Language         | TypeScript                 |
| Storage          | AsyncStorage               |
| State Management | Zustand                    |
| Navigation       | React Navigation v6        |
| UI Components    | React Native Paper         |
| Charts           | Victory Native             |
| Forms            | Formik + Yup               |
| Notifications    | expo-notifications         |
|Authentication    |  FireBase                  |

---


## 🛠️ **Installation & Setup**

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd SmartHabitCoach
```

### 2️⃣ Install Dependencies

```bash
npm install
```



### 4️⃣ Run the App

#### 📱 **Expo Go (Recommended for Development)**

```bash
npm start
```

Scan the QR code using **Expo Go** (Android/iOS).

#### 🌐 **Web Preview**

```bash
npm run web
```

---

## 📦 **Build for Production**

### 📱 Android APK

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

This outputs a downloadable **APK** or **AAB**.

---

## 📦 **Library Install Commands**

```bash
# Navigation
npx expo install react-native-screens react-native-safe-area-context
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs

# AsyncStorage (Local Storage)
npx expo install @react-native-async-storage/async-storage

# UI Components
npm install react-native-paper
npx expo install react-native-vector-icons

# Charts & Insights
npm install victory-native
npx expo install react-native-svg

# Forms & Validation
npm install formik yup

# Notifications (Local Reminders)
npx expo install expo-notifications

# State Management (Zustand)
npm install zustand

---


