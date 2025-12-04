import React, { useState } from "react";
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
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useHabits } from "../context/HabitContext";

// Formatting delete dates
import { format } from "date-fns";

// UI components
import { ScreenContainer } from "../components/ScreenContainer";
import { Card } from "../components/Card";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Navigation type
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainTabParamList } from "../navigation/types";

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<MainTabParamList, "Settings">;
};

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { theme, isDark, toggleTheme } = useTheme(); // theme + dark mode
  const { signOut } = useAuth();                    // sign out function
  const { deletedHabits } = useHabits();           // deleted habits list

  const [showHistory, setShowHistory] = useState(false); // toggle view deleted habits

  // Sign out confirmation popup
  const handleSignOut = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Are you sure you want to sign out?");
      if (confirmed) {
        signOut();
      }
    } else {
      Alert.alert(
        "Sign Out",
        "Are you sure you want to sign out?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign Out", style: "destructive", onPress: signOut },
        ]
      );
    }
  };

  // Reusable settings row component
  const renderSettingItem = (
    icon: any,
    title: string,
    rightElement: React.ReactNode,
    onPress?: () => void
  ) => (
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
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <Text
          style={[
            theme.typography.h2,
            { color: theme.colors.text, marginLeft: 16 },
          ]}
        >
          Settings
        </Text>
      </View>

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
                <Text
                  style={[
                    styles.emptyText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  No deleted habits
                </Text>
              ) : (
                deletedHabits.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.historyItem,
                      { borderColor: theme.colors.border },
                    ]}
                  >
                    <Text
                      style={[
                        styles.historyName,
                        { color: theme.colors.text },
                      ]}
                    >
                      {item.name}
                    </Text>

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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  backButton: {
    padding: 4,
  },
  card: {
    padding: 0,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  historyContainer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  historyItem: {
    padding: 12,
    paddingLeft: 64,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  historyName: {
    fontSize: 14,
    fontWeight: "600",
  },
  historyDate: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
    fontSize: 14,
  },
});
