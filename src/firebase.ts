import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// @ts-ignore
import { initializeAuth, getReactNativePersistence, getAuth, Auth, setPersistence, browserLocalPersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./firebaseConfig";
import { Platform } from "react-native";

const app = initializeApp(firebaseConfig);

let auth: Auth;

if (Platform.OS === 'web') {
    // Web: Use default browser persistence
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence).catch((error) => console.error("Persistence error:", error));
} else {
    // Native: Use AsyncStorage persistence
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
}

// Analytics is optional and might not work in all environments
let analytics: any = null;
isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(app);
    }
});

export { app, auth, analytics };
