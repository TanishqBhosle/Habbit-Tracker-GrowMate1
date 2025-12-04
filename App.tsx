import React from "react";

// Safe area = fixes top notch, bottom bars, etc.
import { SafeAreaProvider } from "react-native-safe-area-context";

// All global app contexts (theme, login, habits)
import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import { HabitProvider } from "./src/context/HabitContext";

// Main Navigation
import AppNavigator from "./src/navigation/AppNavigator";

// --------------------------------------------------
// MAIN APP ENTRY POINT
// --------------------------------------------------
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <HabitProvider>
            <AppNavigator />
          </HabitProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
