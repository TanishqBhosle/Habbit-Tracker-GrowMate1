// Import React library to use React components
import React from "react";
// Import basic UI components from React Native library
import {
  // TouchableOpacity handles touch events with opacity feedback
  TouchableOpacity,
  // Text component for displaying text
  Text,
  // StyleSheet for creating styles
  StyleSheet,
  // ActivityIndicator for showing loading spinner
  ActivityIndicator,
  // Type definition for View styles
  ViewStyle,
  // Type definition for Text styles
  TextStyle,
} from "react-native";

// Import custom theme system hook
import { useTheme } from "../context/ThemeContext";

// Defining what props (inputs) our Button accepts
interface ButtonProps {
  // The text to display on the button
  title: string;
  // Function to call when button is clicked
  onPress: () => void;
  // Type of button style: primary, secondary, outline, or danger
  variant?: "primary" | "secondary" | "outline" | "danger";
  // If true, show a loading spinner
  loading?: boolean;
  // If true, make the button unclickable
  disabled?: boolean;
  // Extra styles for the button container
  style?: ViewStyle;
  // Extra styles for the button text
  textStyle?: TextStyle;
  // Optional icon element to display
  icon?: React.ReactNode;
}

// Main Button component definition
export const Button: React.FC<ButtonProps> = ({
  // Destructure props with default values
  title,
  onPress,
  variant = "primary", // Default to primary style
  loading = false, // Default to not loading
  disabled = false, // Default to enabled
  style,
  textStyle,
  icon,
}) => {
  // Get theme colors, spacing, and other values from the theme context
  const { theme } = useTheme();

  // Function to determine background color based on button state and variant
  const getBackgroundColor = () => {
    // If button is disabled, return a gray color
    if (disabled) return theme.colors.border;

    // Switch based on the variant prop
    switch (variant) {
      case "primary":
        // Return primary theme color (e.g., blue)
        return theme.colors.primary;
      case "secondary":
        // Return secondary theme color
        return theme.colors.secondary;
      case "danger":
        // Return error theme color (e.g., red)
        return theme.colors.error;
      case "outline":
        // Return transparent for outline buttons
        return "transparent";
      default:
        // Default to primary color
        return theme.colors.primary;
    }
  };

  // Function to determine text color
  const getTextColor = () => {
    // If disabled, return a lighter text color
    if (disabled) return theme.colors.textSecondary;

    // Switch based on variant
    switch (variant) {
      case "outline":
        // For outline buttons, use primary color for text
        return theme.colors.primary;
      default:
        // For filled buttons, use white text
        return "#FFFFFF";
    }
  };

  // Function to get border styles for outline buttons
  const getBorder = () => {
    // Only apply border if variant is 'outline'
    if (variant === "outline") {
      return {
        // Set border width
        borderWidth: 1,
        // Set border color based on disabled state
        borderColor: disabled
          ? theme.colors.border
          : theme.colors.primary,
      };
    }
    // Return empty object if not outline
    return {};
  };

  // Render the button
  return (
    // Generic touchable wrapper
    <TouchableOpacity
      style={[
        // Apply base button styles
        styles.button,
        {
          // Set background color dynamically
          backgroundColor: getBackgroundColor(),
          // Set border radius from theme
          borderRadius: theme.borderRadius.m,
          // Set padding from theme
          padding: theme.spacing.m,
        },
        // Apply dynamic border styles
        getBorder(),
        // Apply any custom styles passed as props
        style,
      ]}
      // Set the press handler
      onPress={onPress}
      // Disable interaction if disabled or loading
      disabled={disabled || loading}
      // Set opacity when pressed
      activeOpacity={0.8}
    >
      {/* Conditionally render content */}
      {/* if loading is true, show spinner */}
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        // Otherwise show icon and text
        <>
          {/* If an icon is provided, render it */}
          {icon}

          {/* Render the button text */}
          <Text
            style={[
              // Apply base button typography from theme
              theme.typography.button,
              // Apply dynamic text color and margin if icon exists
              { color: getTextColor(), marginLeft: icon ? 8 : 0 },
              // Apply custom text styles
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

// Define static styles using StyleSheet
const styles = StyleSheet.create({
  button: {
    // Arrange children in a row
    flexDirection: "row",
    // Center children horizontally
    justifyContent: "center",
    // Center children vertically
    alignItems: "center",
  },
});
