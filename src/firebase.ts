// Import initializeApp function from firebase/app
import { initializeApp } from "firebase/app";
// Import analytics functions from firebase/analytics
import { getAnalytics, isSupported } from "firebase/analytics";
// Ignore TypeScript errors for the next line
// @ts-ignore
// Import authentication functions and types from firebase/auth
import { initializeAuth, getReactNativePersistence, getAuth, Auth, setPersistence, browserLocalPersistence } from "firebase/auth";
// Import AsyncStorage for React Native
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// Import the firebase configuration
import { firebaseConfig } from "./firebaseConfig";
// Import Platform to detect the OS
import { Platform } from "react-native";

// Initialize the Firebase app with the config
const app = initializeApp(firebaseConfig);

// Declare a variable for the authentication instance
let auth: Auth;

// Check if the platform is web
if (Platform.OS === 'web') {
    // Log for Web: Use default browser persistence
    // Web: Use default browser persistence
    // Get the auth instance for the app
    auth = getAuth(app);
    // Set persistence to local storage and catch any errors
    setPersistence(auth, browserLocalPersistence).catch((error) => console.error("Persistence error:", error));
} else {
    // Log for Native: Use AsyncStorage persistence
    // Native: Use AsyncStorage persistence
    // Initialize auth with AsyncStorage persistence for React Native
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
}

// Analytics is optional and might not work in all environments
let analytics: any = null;
// Check if analytics is supported
isSupported().then((supported) => {
    // If supported, initialize analytics
    if (supported) {
        analytics = getAnalytics(app);
    }
});

// Export the app, auth, and analytics instances
export { app, auth, analytics };
