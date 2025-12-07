// Import necessary hooks from React
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

// Import Firebase authentication functions and types
import {
  User,                   // Type definition for Firebase User
  onAuthStateChanged,     // Function to listen for authentication state changes
  signOut as firebaseSignOut, // Function to sign out the user, renamed to avoid conflict
} from "firebase/auth";

// Import the initialized auth instance from the firebase configuration file
import { auth } from "../firebase";

// Define the shape of the Auth Context data
type AuthContextType = {
  // Current logged-in user or null if not logged in
  user: User | null;
  // Loading state boolean, true while checking auth status
  loading: boolean;
  // Function to sign out the user, returns a Promise
  signOut: () => Promise<void>;
};

// Create the context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the AuthProvider component that wraps the application
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to hold the current user
  const [user, setUser] = useState<User | null>(null);

  // State to hold the loading status, default is true
  const [loading, setLoading] = useState(true);

  // Effect to set up the authentication state listener
  useEffect(() => {
    // Listen for changes in authentication state (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Update the user state with the current user
      setUser(currentUser);
      // Set loading to false as the check is complete
      setLoading(false);
    });

    // Cleanup function to unsubscribe the listener when component unmounts
    return unsubscribe;
  }, []);

  // Function to handle user sign out
  const signOut = async () => {
    try {
      // Call Firebase's signOut function
      await firebaseSignOut(auth);
    } catch (error) {
      // Log any errors that occur during sign out
      console.error("Error signing out: ", error);
    }
  };

  // Render the provider with the value object
  return (
    // Pass user, loading, and signOut to the context consumers
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {/* Render child components inside the provider */}
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the authentication context
export const useAuth = () => {
  // Access the context value
  const context = useContext(AuthContext);

  // Check if context is undefined (used outside of provider)
  if (!context) {
    // Throw an error if used incorrectly
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Return the context value
  return context;
};
