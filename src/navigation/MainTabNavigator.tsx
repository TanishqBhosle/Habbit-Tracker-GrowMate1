// Import React library
import React from "react";
// Import bottom tab navigator creator
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens inside the bottom tabs
// Import Home Screen
import HomeScreen from "../screens/HomeScreen";
// Import Insights Screen
import InsightsScreen from "../screens/InsightsScreen";
// Import Settings Screen
import SettingsScreen from "../screens/SettingsScreen";

// Import Type definitions for parameters
import { MainTabParamList } from "./types";

// Theme system
// Import useTheme hook
import { useTheme } from "../context/ThemeContext";

// Icons
// Import Ionicons library
import { Ionicons } from "@expo/vector-icons";

// Create bottom tab navigator
const Tab = createBottomTabNavigator<MainTabParamList>();

// MainTabNavigator component: Manages the bottom tabs
export default function MainTabNavigator() {
  // Get theme object
  const { theme } = useTheme(); // get theme colors

  return (
    // Configure Tab Navigator
    <Tab.Navigator
      // Style + icon logic for all tabs
      screenOptions={({ route }) => ({
        // Show header on top of screens
        headerShown: true, // show header on top

        // Header styling
        // Set header background color
        headerStyle: { backgroundColor: theme.colors.background },
        // Set header text color
        headerTintColor: theme.colors.text,

        // Bottom bar style
        tabBarStyle: {
          // Set tab bar background color
          backgroundColor: theme.colors.surface,
          // Set top border color
          borderTopColor: theme.colors.border,
        },

        // Active / inactive tab colors
        // Color for the active tab icon/text
        tabBarActiveTintColor: theme.colors.primary,
        // Color for inactive tab icon/text
        tabBarInactiveTintColor: theme.colors.textSecondary,

        // Icon logic for each tab
        tabBarIcon: ({ focused, color, size }) => {
          // Variable to hold the icon name
          let iconName: keyof typeof Ionicons.glyphMap;

          // Select icon based on which route is active
          if (route.name === "Home") {
            // Use filled list icon if focused, outline if not
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Insights") {
            // Use filled bar chart icon if focused, outline if not
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (route.name === "Settings") {
            // Use filled settings icon if focused, outline if not
            iconName = focused ? "settings" : "settings-outline";
          } else {
            // Fallback icon
            iconName = "alert"; // fallback
          }

          // Return the Icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Bottom tabs definitions */}
      {/* Home Tab */}
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Habits" }} />
      {/* Insights Tab */}
      <Tab.Screen name="Insights" component={InsightsScreen} />
      {/* Settings Tab */}
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
