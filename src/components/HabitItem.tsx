// Import React library
import React from "react";
// Import components and APIs from React Native
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
} from "react-native";

// Import Ionicons for icons
import { Ionicons } from "@expo/vector-icons";

// Import custom theme hook
import { useTheme } from "../context/ThemeContext";

// Import reusable Card component
import { Card } from "./Card";

// Import Habit type definition
import { Habit } from "../store/types";

// Define props for the HabitItem component
interface HabitItemProps {
  // The habit object containing data like name and streak
  habit: Habit;
  // Boolean indicating if the habit is completed for today
  isCompleted: boolean;
  // Function to call when the checkbox is toggled
  onToggle: () => void;
  // Function to call when the item is pressed (for details)
  onPress: () => void;
}

// Main HabitItem functional component
export const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  isCompleted,
  onToggle,
  onPress,
}) => {
  // Access theme from context
  const { theme } = useTheme();

  // Enhanced toggle function with animation
  const handleToggle = () => {
    // Configure layout animation for smooth state change effects
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // Call the original onToggle function
    onToggle();
  };

  // Render the component
  return (
    // Wrap content in a Card component
    <Card style={styles.card}>
      {/* Touchable area for habit details (left side) */}
      <TouchableOpacity style={styles.content} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.textContainer}>

          {/* Display Habit Name */}
          <Text
            style={[
              // Apply h3 typography style
              theme.typography.h3,
              {
                // Set color: gray if completed, normal text color if not
                color: isCompleted
                  ? theme.colors.textSecondary
                  : theme.colors.text,
                // Add strikethrough if completed
                textDecorationLine: isCompleted
                  ? "line-through"
                  : "none",
              },
            ]}
          >
            {habit.name}
          </Text>

          {/* Conditional rendering: if description exists, show it */}
          {!!habit.description && (
            <Text
              style={[
                // Apply caption typography style
                theme.typography.caption,
                // Set color and top margin
                { color: theme.colors.textSecondary, marginTop: 4 },
              ]}
            >
              {habit.description}
            </Text>
          )}

          {/* Meta Information Row: Category and Streak */}
          <View style={styles.metaRow}>
            {/* Conditional rendering: if category exists, show it */}
            {!!habit.category && (
              <View
                style={[
                  // Apply category tag styles
                  styles.categoryTag,
                  {
                    // Set background and border colors
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    // Apply caption typography
                    theme.typography.caption,
                    // Small font size and secondary color
                    { fontSize: 10, color: theme.colors.textSecondary },
                  ]}
                >
                  {habit.category}
                </Text>
              </View>
            )}

            {/* Conditional rendering: if streak is greater than 0, show it */}
            {habit.streak > 0 && (
              <View style={styles.streakContainer}>
                {/* Display flame emoji and streak count */}
                <Text style={{ fontSize: 12 }}>🔥 {habit.streak}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Checkbox Button (right side) */}
      <TouchableOpacity
        // Handle press to toggle completion
        onPress={handleToggle}
        style={[
          // Apply base checkbox styles
          styles.checkbox,
          {
            // Set border color: habit color/green if complete, border color if incomplete
            borderColor: isCompleted
              ? habit.color || theme.colors.success
              : theme.colors.border,
            // Set background color: habit color/green if complete, transparent if incomplete
            backgroundColor: isCompleted
              ? habit.color || theme.colors.success
              : "transparent",
          },
        ]}
      >
        {/* Show checkmark icon only if completed */}
        {isCompleted && <Ionicons name="checkmark" size={20} color="#FFF" />}
      </TouchableOpacity>
    </Card>
  );
};

// Define styles
const styles = StyleSheet.create({
  card: {
    // Arrange children in a row
    flexDirection: "row",
    // center vertically
    alignItems: "center",
    // vertical padding
    paddingVertical: 12,
  },
  content: {
    // Take up remaining horizontal space
    flex: 1,
  },
  textContainer: {
    // Add margin to the right
    marginRight: 12,
  },
  checkbox: {
    // Fixed width
    width: 28,
    // Fixed height
    height: 28,
    // Rounded corners (circle)
    borderRadius: 14,
    // Border width
    borderWidth: 2,
    // Center content horizontally
    justifyContent: "center",
    // Center content vertically
    alignItems: "center",
  },
  categoryTag: {
    // Align to the start
    alignSelf: "flex-start",
    // Horizontal padding
    paddingHorizontal: 8,
    // Vertical padding
    paddingVertical: 2,
    // Rounded corners
    borderRadius: 12,
    // Border width
    borderWidth: 1,
    // Top margin
    marginTop: 6,
  },
  metaRow: {
    // Row layout for meta info
    flexDirection: "row",
    // Align items vertically
    alignItems: "center",
    // Top margin
    marginTop: 6,
  },
  streakContainer: {
    // Row layout for streak
    flexDirection: "row",
    // Align items vertically
    alignItems: "center",
    // Left margin
    marginLeft: 8,
  },
});
