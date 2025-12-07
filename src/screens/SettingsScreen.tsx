// Import React hooks
import React, { useState } from "react";
// Import UI components from React Native
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";

// Theme + Auth + Habits context
// Import theme context hook
import { useTheme } from "../context/ThemeContext";
// Import auth context hook
import { useAuth } from "../context/AuthContext";
// Import habit context hook
import { useHabits } from "../context/HabitContext";

// Formatting delete dates
// Import date formatting function
import { format } from "date-fns";

// UI components
// Import screen container
import { ScreenContainer } from "../components/ScreenContainer";
// Import card component
import { Card } from "../components/Card";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Navigation type
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainTabParamList } from "../navigation/types";

// Define props for SettingsScreen
type SettingsScreenProps = {
  // Navigation prop specifically for Settings screen
  navigation: NativeStackNavigationProp<MainTabParamList, "Settings">;
};

// Main SettingsScreen component
export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  // Get theme object and helper functions
  const { theme, isDark, toggleTheme } = useTheme(); // theme + dark mode
  // Get signOut function
  const { signOut } = useAuth();                    // sign out function
  // Get deleted habits list
  const { deletedHabits } = useHabits();           // deleted habits list

  // State to toggle deleted habits history view
  const [showHistory, setShowHistory] = useState(false); // toggle view deleted habits

  // Sign out confirmation popup
  const handleSignOut = async () => {
    // Platform specific confirmation
    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Are you sure you want to sign out?");
      if (confirmed) {
        signOut();
      }
    } else {
      // Use native Alert for mobile
      Alert.alert(
        "Sign Out",
        "Are you sure you want to sign out?",
        [
          { text: "Cancel", style: "cancel" },
          // Destructive action for sign out
          { text: "Sign Out", style: "destructive", onPress: signOut },
        ]
      );
    }
  };

  // Reusable settings row component
  const renderSettingItem = (
    icon: any, // Icon name
    title: string, // Row title
    rightElement: React.ReactNode, // Element on the right (switch, arrow, etc.)
    onPress?: () => void // Optional click handler
  ) => (
    // Touchable row
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        {/* Icon bubble */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          {/* Render Icon */}
          <Ionicons name={icon} size={20} color={theme.colors.primary} />
        </View>

        {/* Setting title */}
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.text, marginLeft: 12 },
          ]}
        >
          {title}
        </Text>
      </View>

      {/* Right side UI (switch, arrow, etc.) */}
      {rightElement}
    </TouchableOpacity>
  );

  return (
    // Wrap screen in container
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        {/* Screen Title */}
        <Text
          style={[
            theme.typography.h2,
            { color: theme.colors.text, marginLeft: 16 },
          ]}
        >
          Settings
        </Text>
      </View>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* APPEARANCE SECTION */}
        <Text
          style={[
            theme.typography.caption,
            { color: theme.colors.textSecondary, marginBottom: 8, marginLeft: 4 },
          ]}
        >
          APPEARANCE
        </Text>

        <Card style={styles.card}>
          {/* Dark mode toggle */}
          {renderSettingItem(
            isDark ? "moon" : "sunny",
            "Dark Mode",
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor="#FFF"
            />
          )}
        </Card>

        {/* DATA SECTION */}
        <Text
          style={[
            theme.typography.caption,
            {
              color: theme.colors.textSecondary,
              marginBottom: 8,
              marginLeft: 4,
              marginTop: 16,
            },
          ]}
        >
          DATA
        </Text>

        <Card style={styles.card}>
          {/* Toggle deleted habits history */}
          {renderSettingItem(
            "trash-bin",
            "Deleted Habits History",
            <Ionicons
              name={showHistory ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.colors.textSecondary}
            />,
            () => setShowHistory(!showHistory)
          )}

          {/* Deleted habits list */}
          {showHistory && (
            <View style={styles.historyContainer}>
              {deletedHabits.length === 0 ? (
                // Empty state message
                <Text
                  style={[
                    styles.emptyText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  No deleted habits
                </Text>
              ) : (
                // Map through deleted habits
                deletedHabits.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.historyItem,
                      { borderColor: theme.colors.border },
                    ]}
                  >
                    {/* Habit Name */}
                    <Text
                      style={[
                        styles.historyName,
                        { color: theme.colors.text },
                      ]}
                    >
                      {item.name}
                    </Text>

                    {/* Deleted Date */}
                    <Text
                      style={[
                        styles.historyDate,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      Deleted: {format(new Date(item.deletedAt), "MMM dd, yyyy")}
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}
        </Card>

        {/* ACCOUNT SECTION */}
        <Text
          style={[
            theme.typography.caption,
            {
              color: theme.colors.textSecondary,
              marginBottom: 8,
              marginLeft: 4,
              marginTop: 16,
            },
          ]}
        >
          ACCOUNT
        </Text>

        <Card style={styles.card}>
          {/* Sign Out */}
          {renderSettingItem(
            "log-out",
            "Sign Out",
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textSecondary}
            />,
            handleSignOut
          )}
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

// ------------------------
// STYLES
// ------------------------
const styles = StyleSheet.create({
  header: {
    // Row layout for header
    flexDirection: "row",
    // Vertical alignment
    alignItems: "center",
    // Margins
    marginBottom: 24,
    marginTop: 8,
  },
  backButton: {
    // Padding for touch target
    padding: 4,
  },
  card: {
    // Remove default padding for custom internal layout
    padding: 0,
    // Clip content
    overflow: "hidden",
  },
  settingItem: {
    // Row layout
    flexDirection: "row",
    // Space between left and right elements
    justifyContent: "space-between",
    // Align vertically
    alignItems: "center",
    // Padding
    padding: 16,
  },
  settingLeft: {
    // Row layout for icon and text
    flexDirection: "row",
    // Align vertically
    alignItems: "center",
  },
  iconContainer: {
    // Width
    width: 36,
    // Height
    height: 36,
    // Circular
    borderRadius: 18,
    // Center icon
    justifyContent: "center",
    alignItems: "center",
  },
  historyContainer: {
    // Top border
    borderTopWidth: 1,
    // Semi-transparent border
    borderTopColor: "rgba(0,0,0,0.1)",
    // Slightly shaded background
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  historyItem: {
    // Padding
    padding: 12,
    // Indent text to align with settings text
    paddingLeft: 64,
    // Bottom border
    borderBottomWidth: 1,
    // Semi-transparent border
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  historyName: {
    // Font size
    fontSize: 14,
    // Semi-bold
    fontWeight: "600",
  },
  historyDate: {
    // Smaller font
    fontSize: 12,
    // Top margin
    marginTop: 2,
  },
  emptyText: {
    // Italic text
    fontStyle: "italic",
    // Center text
    textAlign: "center",
    // Padding
    padding: 20,
    // Font size
    fontSize: 14,
  },
});
