import React from "react";
// Import basic UI components from React Native
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

// Import custom theme system
import { useTheme } from "../context/ThemeContext";

// Defining what props (inputs) our Button accepts
interface ButtonProps {
  title: string;                  // Button text
  onPress: () => void;            // Function when button is clicked
  variant?: "primary" | "secondary" | "outline" | "danger"; // Button type
  loading?: boolean;              // Show loading spinner
  disabled?: boolean;             // Disable the button
  style?: ViewStyle;              // Extra styles for button box
  textStyle?: TextStyle;          // Extra styles for text
  icon?: React.ReactNode;         // Add an icon before text
}

// Main Button component
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary", // default variant
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  // Get theme colors, spacing, radius etc.
  const { theme } = useTheme();

  // Pick background color according to button type
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border; // gray color when disabled

    switch (variant) {
      case "primary":
        return theme.colors.primary; // blue
      case "secondary":
        return theme.colors.secondary; // purple/green etc
      case "danger":
        return theme.colors.error; // red
      case "outline":
        return "transparent"; // no background
      default:
        return theme.colors.primary;
    }
  };

  // Pick text color
  const getTextColor = () => {
    if (disabled) return theme.colors.textSecondary; // light gray

    switch (variant) {
      case "outline":
        return theme.colors.primary; // blue text
      default:
        return "#FFFFFF"; // white
    }
  };

  // Add border only for outline button
  const getBorder = () => {
    if (variant === "outline") {
      return {
        borderWidth: 1,
        borderColor: disabled
          ? theme.colors.border
          : theme.colors.primary, // gray when disabled
      };
    }
    return {}; // no border otherwise
  };

  return (
    <TouchableOpacity
      style={[
        styles.button, // basic structure (row + center)
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: theme.borderRadius.m,
          padding: theme.spacing.m,
        },
        getBorder(), // adds border for outline variant
        style, // extra custom user style
      ]}
      onPress={onPress}
      disabled={disabled || loading} // can't click if disabled or loading
      activeOpacity={0.8} // button fade when pressed
    >
      {/* --- Show loader when loading --- */}
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {/* If icon passed, show it */}
          {icon}

          {/* Button text */}
          <Text
            style={[
              theme.typography.button,   // theme font style
              { color: getTextColor(), marginLeft: icon ? 8 : 0 }, // add space if icon
              textStyle,                 // extra custom style
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

// Basic style for container
const styles = StyleSheet.create({
  button: {
    flexDirection: "row",        // icon + text in 1 line
    justifyContent: "center",    // center horizontally
    alignItems: "center",        // center vertically
  },
});
