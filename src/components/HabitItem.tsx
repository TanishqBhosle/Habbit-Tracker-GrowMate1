import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
} from "react-native";

// Icon library
import { Ionicons } from "@expo/vector-icons";

// Custom theme system
import { useTheme } from "../context/ThemeContext";

// Reusable Card component
import { Card } from "./Card";

// Types
import { Habit } from "../store/types";

// Props for each habit item
interface HabitItemProps {
  habit: Habit;          // habit object (name, description, color, etc.)
  isCompleted: boolean;  // true if habit is marked complete
  onToggle: () => void;  // when checkbox is pressed
  onPress: () => void;   // when whole habit item is pressed
}

// Main Habit Item component
export const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  isCompleted,
  onToggle,
  onPress,
}) => {
  const { theme } = useTheme(); // Get theme colors + typography

  // Handle checkbox press with smooth animation
  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  return (
    // Wrapper card around each habit
    <Card style={styles.card}>
      {/* When user taps the left area → open habit details */}
      <TouchableOpacity style={styles.content} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.textContainer}>

          {/* Habit name */}
          <Text
            style={[
              theme.typography.h3,
              {
                color: isCompleted
                  ? theme.colors.textSecondary     // faded color if completed
                  : theme.colors.text,             // normal color
                textDecorationLine: isCompleted
                  ? "line-through"                 // line through when done
                  : "none",
              },
            ]}
          >
            {habit.name}
          </Text>

          {/* Habit description (optional) */}
          {!!habit.description && (
            <Text
              style={[
                theme.typography.caption,
                { color: theme.colors.textSecondary, marginTop: 4 },
              ]}
            >
              {habit.description}
            </Text>
          )}

          {/* Habit category tag (optional) */}
          {/* Meta Row: Category + Streak */}
          <View style={styles.metaRow}>
            {!!habit.category && (
              <View
                style={[
                  styles.categoryTag,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    theme.typography.caption,
                    { fontSize: 10, color: theme.colors.textSecondary },
                  ]}
                >
                  {habit.category}
                </Text>
              </View>
            )}

            {/* Streak Indicator */}
            {habit.streak > 0 && (
              <View style={styles.streakContainer}>
                <Text style={{ fontSize: 12 }}>🔥 {habit.streak}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Checkbox on right side */}
      <TouchableOpacity
        onPress={handleToggle}
        style={[
          styles.checkbox,
          {
            // Border or background color changes based on completion
            borderColor: isCompleted
              ? habit.color || theme.colors.success
              : theme.colors.border,
            backgroundColor: isCompleted
              ? habit.color || theme.colors.success
              : "transparent",
          },
        ]}
      >
        {/* Checkmark icon only if completed */}
        {isCompleted && <Ionicons name="checkmark" size={20} color="#FFF" />}
      </TouchableOpacity>
    </Card>
  );
};

// Basic styles
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",   // left (text) + right (checkbox)
    alignItems: "center",
    paddingVertical: 12,
  },
  content: {
    flex: 1,                // text area takes full width
  },
  textContainer: {
    marginRight: 12,        // space before checkbox
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,       // round checkbox
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
});
