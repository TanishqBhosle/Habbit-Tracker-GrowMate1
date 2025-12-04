

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

### 🔐 Authentication

* Secure Sign Up / Sign In via **Firebase Authentication**

### ✅ Habit Management

* Create, edit, delete habits
* Mark as complete
* Smooth UI with **offline-first** behavior

### 📊 Weekly Insights

* Automatic 7-day bar chart
* Helps visualize progress & consistency

### ⏰ Smart Reminders

* Daily local notifications
* Works even when the app is closed

### 🗂️ Deleted Habit History

* Stores last 10 removed habits
* Option to restore manually

### 🌓 Light & Dark Themes

* Modern UI with elegant color tokens
* Auto / manual toggle

### 📴 Offline First

* All habit data stored using **AsyncStorage**
* Works without internet post-login

---

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
| Notifications    | Expo Notifications         |
| Authentication   | Firebase                   |

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

### 3️⃣ Run the App

#### 📱 Expo Go (Recommended)

```bash
npm start
```

Scan the QR code using **Expo Go** (Android).

#### 🌐 Web Preview

```bash
npm run web
```

---

## 📦 **Build for Production**

### 📱 Android APK / AAB

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

---

## 📚 **Library Install Commands**

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
```

---

## 🎨 **Figma Wireframe**

📌 **Wireframe Link:**
[https://www.figma.com/board/1tbWiNWeXz334H3h5C1lMp/GrowMate-Detailed-Wireframe-Flow?node-id=0-1&p=f&t=9r8fh64BjU8NDvEQ-0](https://www.figma.com/board/1tbWiNWeXz334H3h5C1lMp/GrowMate-Detailed-Wireframe-Flow?node-id=0-1&p=f&t=9r8fh64BjU8NDvEQ-0)

---


