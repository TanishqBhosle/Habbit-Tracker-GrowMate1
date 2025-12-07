// Import React library
import React from "react";
// Import main navigation container
import { NavigationContainer } from "@react-navigation/native";
// Import stack navigator creator
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Auth context → tells if user is logged in
import { useAuth } from "../context/AuthContext";

// Navigation stacks
// Import Auth navigator (Login/Signup)
import AuthNavigator from "./AuthNavigator";
// Import Main Tab navigator (Home, etc)
import MainTabNavigator from "./MainTabNavigator";

// Screens
// Import Add Habit screen
import AddHabitScreen from "../screens/AddHabitScreen";
// Import Edit Habit screen
import EditHabitScreen from "../screens/EditHabitScreen";

// Import Type definitions for parameters
import { AppStackParamList } from "./types";

// Theme system
// Import useTheme hook
import { useTheme } from "../context/ThemeContext";

// Import UI components from React Native
import { View, ActivityIndicator } from "react-native";

// Create the stack navigator with typed params
const Stack = createNativeStackNavigator<AppStackParamList>();

// AppNavigator component: Controls the main navigation flow
export default function AppNavigator() {
  // Get user and loading state from auth context
  const { user, loading } = useAuth(); // check login state
  // Get theme object from theme context
  const { theme } = useTheme();        // get theme colors

  // While Firebase is checking user's login status
  if (loading) {
    // Show a loading screen
    return (
      <View
        style={{
          // Fill the whole screen
          flex: 1,
          // Center content vertically
          justifyContent: "center",
          // Center content horizontally
          alignItems: "center",
          // Set background color from theme
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Loading spinner in center */}
        {/* Use primary color for spinner */}
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Render the navigation structure
  return (
    // Wrap everything in NavigationContainer
    <NavigationContainer>
      {/* Configure the Stack Navigator */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* Conditional rendering based on user login status */}
        {user ? (
          // If user is logged in, show main app screens
          <>
            {/* Main tab navigation (Home, etc.) */}
            <Stack.Screen name="Main" component={MainTabNavigator} />

            {/* Screen to add a new habit */}
            <Stack.Screen
              name="AddHabit"
              component={AddHabitScreen}
              options={{
                // Show the header for this screen
                headerShown: true,
                // Set title
                title: "New Habit",
                // Style header background
                headerStyle: { backgroundColor: theme.colors.background },
                // Style header text color
                headerTintColor: theme.colors.text,
              }}
            />

            {/* Screen to edit an existing habit */}
            <Stack.Screen
              name="EditHabit"
              component={EditHabitScreen}
              options={{
                // Show header
                headerShown: true,
                // Set title
                title: "Edit Habit",
                // Style header background
                headerStyle: { backgroundColor: theme.colors.background },
                // Style header text color
                headerTintColor: theme.colors.text,
              }}
            />
          </>
        ) : (
          // If user is not logged in, show auth screens
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
