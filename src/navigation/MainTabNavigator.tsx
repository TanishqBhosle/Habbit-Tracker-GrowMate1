import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens inside the bottom tabs
import HomeScreen from "../screens/HomeScreen";
import InsightsScreen from "../screens/InsightsScreen";
import SettingsScreen from "../screens/SettingsScreen";

import { MainTabParamList } from "./types";

// Theme system
import { useTheme } from "../context/ThemeContext";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Create bottom tab navigator
const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme } = useTheme(); // get theme colors

  return (
    <Tab.Navigator
      // Style + icon logic for all tabs
      screenOptions={({ route }) => ({
        headerShown: true, // show header on top

        // Header styling
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.text,

        // Bottom bar style
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },

        // Active / inactive tab colors
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,

        // Icon logic for each tab
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          // Select icon based on which route is active
          if (route.name === "Home") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Insights") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else {
            iconName = "alert"; // fallback
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Bottom tabs */}
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Habits" }} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
