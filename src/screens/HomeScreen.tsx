// Import React library
import React from "react";
// Import UI components from React Native
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";

// Theme + Habits context
// Import theme context hook
import { useTheme } from "../context/ThemeContext";
// Import habit context hook
import { useHabits } from "../context/HabitContext";

// Navigation type
// Import navigation prop types
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList, MainTabParamList } from "../navigation/types";

// Icon library
import { Ionicons } from "@expo/vector-icons";

// Date formatting utility
import { format } from "date-fns";

// Reusable components
// Import screen container wrapper
import { ScreenContainer } from "../components/ScreenContainer";
// Import habit item component
import { HabitItem } from "../components/HabitItem";

// Define props for HomeScreen
type HomeScreenProps = {
  // Navigation prop with type checking for both stacks
  navigation: NativeStackNavigationProp<AppStackParamList & MainTabParamList>;
};

// Main HomeScreen component
export default function HomeScreen({ navigation }: HomeScreenProps) {
  // Get theme colors and styles
  const { theme } = useTheme();                       // theme colors
  // Get habits list and helper functions from context
  const { habits, toggleCompletion, deleteHabit } = useHabits(); // habit data + actions

  // Get today's date formatted as YYYY-MM-DD
  const today = format(new Date(), "yyyy-MM-dd");     // today's date string

  // Delete habit with confirmation alert
  const handleDelete = (id: string) => {
    // Show standard alert dialog
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit?",
      [
        // Cancel button
        { text: "Cancel", style: "cancel" },
        // Delete button (red/destructive style) which calls deleteHabit function
        { text: "Delete", style: "destructive", onPress: () => deleteHabit(id) },
      ]
    );
  };

  // Renders each habit in the list
  const renderItem = ({ item }: { item: any }) => {
    // Check if the current habit is completed today
    const isCompleted = item.completedDates.includes(today);

    // Return the HabitItem component
    return (
      <HabitItem
        habit={item}
        isCompleted={isCompleted}
        onToggle={() => toggleCompletion(item.id, today)}
        onPress={() => navigation.navigate("EditHabit", { habitId: item.id })}
      />
    );
  };

  // Daily progress mathematics
  // Count how many habits are completed today
  const completedCount = habits.filter((h) =>
    h.completedDates.includes(today)
  ).length;

  // Get total number of habits
  const totalCount = habits.length;

  // Calculate progress percentage (0 to 1)
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  // Render the screen
  return (
    // Use container without default padding for customized header
    <ScreenContainer style={{ padding: 0 }}>
      {/* HEADER WITH GREETING + PROGRESS */}
      <View
        style={[
          styles.header,
          {
            // Set header background color
            backgroundColor: theme.colors.surface,
            // Add padding at bottom
            paddingBottom: theme.spacing.l,
          },
        ]}
      >
        {/* Top of header: greeting + settings button */}
        <View style={styles.headerTop}>
          <View>
            {/* Greeting Title */}
            <Text style={[theme.typography.h1, { color: theme.colors.text }]}>
              Hello!
            </Text>
            {/* Subtitle */}
            <Text
              style={[
                theme.typography.body,
                { color: theme.colors.textSecondary },
              ]}
            >
              Ready to crush your goals?
            </Text>
          </View>

          {/* Settings button */}
          <TouchableOpacity
            style={[
              styles.settingsButton,
              { backgroundColor: theme.colors.background },
            ]}
            onPress={() => navigation.navigate("Settings")}
          >
            {/* Settings Icon */}
            <Ionicons
              name="settings-outline"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Progress bar section if user has habits */}
        {totalCount > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressTextRow}>
              {/* Progress Label */}
              <Text style={[theme.typography.caption, { fontWeight: "600" }]}>
                Daily Progress
              </Text>
              {/* Progress Percentage Text */}
              <Text
                style={[
                  theme.typography.caption,
                  { color: theme.colors.primary },
                ]}
              >
                {Math.round(progress * 100)}%
              </Text>
            </View>

            {/* Progress Bar Background */}
            <View
              style={[
                styles.progressBarBg,
                { backgroundColor: theme.colors.background },
              ]}
            >
              {/* Progress Bar Fill */}
              <View
                style={[
                  styles.progressBarFill,
                  { backgroundColor: theme.colors.primary, width: `${progress * 100}%` },
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* HABITS LIST */}
      <FlatList
        // Data source
        data={habits}
        // Unique key for each item
        keyExtractor={(item) => item.id}
        // Function to render each item
        renderItem={renderItem}
        // Container style for the list content
        contentContainerStyle={[
          styles.listContent,
          { padding: theme.spacing.m },
        ]}
        // Component to show when list is empty
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {/* Empty state icon */}
            <Ionicons
              name="leaf-outline"
              size={64}
              color={theme.colors.textSecondary}
              style={{ marginBottom: 16, opacity: 0.5 }}
            />
            {/* Empty state title */}
            <Text
              style={[
                theme.typography.h3,
                {
                  color: theme.colors.text,
                  textAlign: "center",
                  marginBottom: 8,
                },
              ]}
            >
              No habits yet
            </Text>
            {/* Empty state description */}
            <Text
              style={[
                theme.typography.body,
                {
                  color: theme.colors.textSecondary,
                  textAlign: "center",
                },
              ]}
            >
              Start building your streak by adding a new habit!
            </Text>
          </View>
        }
      />

      {/* FAB BUTTON → Add new habit */}
      {/* Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            // Set background color to primary
            backgroundColor: theme.colors.primary,
            // Platform specific shadows
            ...Platform.select({
              ios: {
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
              },
              android: {
                elevation: 8,
              },
              web: {
                boxShadow: `0px 8px 12px ${theme.colors.primary}4D`, // 4D = 30% opacity
              }
            }),
          },
        ]}
        // Navigate to AddHabit screen
        onPress={() => navigation.navigate("AddHabit")}
        activeOpacity={0.8}
      >
        {/* Plus Icon */}
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

// Define styles
const styles = StyleSheet.create({
  header: {
    // Horizontal padding
    paddingHorizontal: 20,
    // Top padding
    paddingTop: 20,
    // Rounded bottom left corner
    borderBottomLeftRadius: 24,
    // Rounded bottom right corner
    borderBottomRightRadius: 24,
    // Platform specific shadows for header
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
      }
    }),
    // Ensure header stays above list
    zIndex: 1,
  },
  headerTop: {
    // Row layout
    flexDirection: "row",
    // Space items apart
    justifyContent: "space-between",
    // Align to top
    alignItems: "flex-start",
    // Bottom margin
    marginBottom: 20,
  },
  settingsButton: {
    // Padding inside button
    padding: 8,
    // Rounded corners
    borderRadius: 12,
  },
  progressContainer: {
    // Top margin
    marginTop: 10,
  },
  progressTextRow: {
    // Row layout
    flexDirection: "row",
    // Space items apart
    justifyContent: "space-between",
    // Bottom margin
    marginBottom: 8,
  },
  progressBarBg: {
    // Fixed height
    height: 8,
    // Rounded corners
    borderRadius: 4,
    // Hide overflow (for fill)
    overflow: "hidden",
  },
  progressBarFill: {
    // Full height
    height: "100%",
    // Rounded corners
    borderRadius: 4,
  },
  listContent: {
    // Padding at bottom to avoid overlapping with FAB
    paddingBottom: 100,
    // Padding at top
    paddingTop: 20,
  },
  fab: {
    // Absolute positioning
    position: "absolute",
    // Distance from right
    right: 20,
    // Distance from bottom
    bottom: 30,
    // Width
    width: 64,
    // Height
    height: 64,
    // Circular shape
    borderRadius: 32,
    // Center icon vertically
    justifyContent: "center",
    // Center icon horizontally
    alignItems: "center",
    // Shadow for android
    elevation: 8,
  },
  emptyContainer: {
    // Fill space
    flex: 1,
    // Center content vertically
    justifyContent: "center",
    // Center content horizontally
    alignItems: "center",
    // Top margin
    marginTop: 60,
    // Horizontal padding
    paddingHorizontal: 40,
  },
});
