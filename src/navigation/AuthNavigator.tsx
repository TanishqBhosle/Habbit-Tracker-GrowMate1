// Import React library
import React from "react";
// Import stack navigator creator
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens for authentication
// Import Sign In Screen
import SignInScreen from "../screens/auth/SignInScreen";
// Import Sign Up Screen
import SignUpScreen from "../screens/auth/SignUpScreen";

// Type for this stack
import { AuthStackParamList } from "./types";

// Theme system
// Import useTheme hook
import { useTheme } from "../context/ThemeContext";

// Create a stack navigator only for auth screens
const Stack = createNativeStackNavigator<AuthStackParamList>();

// AuthNavigator component: Manages authentication flow screens
export default function AuthNavigator() {
  // Get theme object
  const { theme } = useTheme(); // get theme colors

  return (
    // Configure the Stack Navigator
    <Stack.Navigator
      screenOptions={{
        // Set header background color
        headerStyle: { backgroundColor: theme.colors.background },
        // Set header text color
        headerTintColor: theme.colors.text,
        // Set content background color
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      {/* Sign In Screen */}
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ title: "Sign In" }}
      />

      {/* Sign Up Screen */}
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: "Sign Up" }}
      />
    </Stack.Navigator>
  );
}
