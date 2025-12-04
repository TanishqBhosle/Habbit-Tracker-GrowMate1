import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

// Firebase auth functions
import {
  User,                   // Firebase user object
  onAuthStateChanged,     // listens for login/logout
  signOut as firebaseSignOut, // function to sign out
} from "firebase/auth";

import { auth } from "../firebase"; // Your Firebase auth instance

// What data/functions this Auth context will provide
type AuthContextType = {
  user: User | null;      // logged-in user (null if not logged in)
  loading: boolean;       // true while checking user's auth status
  signOut: () => Promise<void>; // function to log out
};

// Create context (empty for now)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider wrapper for the whole app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Store current user
  const [user, setUser] = useState<User | null>(null);

  // Loading while Firebase checks the current user
  const [loading, setLoading] = useState(true);

  // Run once when app starts
  useEffect(() => {
    // Firebase listener → runs whenever user signs in OR signs out
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);   // save user (or null)
      setLoading(false);       // done loading
    });

    // cleanup listener when component unmounts
    return unsubscribe;
  }, []);

  // Logout function
  const signOut = async () => {
    try {
      await firebaseSignOut(auth); // Firebase signOut call
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    // Make user, loading, and signOut available to the whole app
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children} {/* app screens */}
    </AuthContext.Provider>
  );
};

// Custom hook for easy use of authentication data
export const useAuth = () => {
  const context = useContext(AuthContext);

  // If used outside AuthProvider, show an error
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
