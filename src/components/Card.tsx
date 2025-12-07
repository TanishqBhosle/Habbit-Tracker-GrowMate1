// Import React library
import React from "react";
// Import View, StyleSheet, and ViewStyle from React Native
import { View, StyleSheet, ViewStyle } from "react-native";
// Import the custom theme hook
import { useTheme } from "../context/ThemeContext";

// Define the properties (props) for the Card component
interface CardProps {
  // Children elements to be rendered inside the card
  children: React.ReactNode;
  // Optional custom styles for the card
  style?: ViewStyle;
  // Variant of the card: raised, outlined, or flat
  variant?: "elevated" | "outlined" | "flat";
}

// Define the Card component as a functional component
export const Card: React.FC<CardProps> = ({
  // Destructure props
  children,
  style,
  variant = "elevated", // Default variant is 'elevated'
}) => {
  // Use the theme context to access colors and shadows
  const { theme } = useTheme();

  // Function to determine styles based on the card variant
  const getVariantStyle = () => {
    switch (variant) {
      // Style for elevated card (with shadow)
      case "elevated":
        return {
          // Set background color from theme
          backgroundColor: theme.colors.surface,
          // Apply small shadow from theme
          ...theme.shadows.small,
        };

      // Style for outlined card (with border)
      case "outlined":
        return {
          // Set background color
          backgroundColor: theme.colors.surface,
          // Set border width
          borderWidth: 1,
          // Set border color from theme
          borderColor: theme.colors.border,
        };

      // Style for flat card (no shadow or border)
      case "flat":
        return {
          // Set background color to general background
          backgroundColor: theme.colors.background,
        };

      // Default return empty object
      default:
        return {};
    }
  };

  // Render the card using a View component
  return (
    <View
      style={[
        // Apply base card styles
        styles.card,
        // Apply border radius from theme
        { borderRadius: theme.borderRadius.m },
        // Apply the variant-specific styles
        getVariantStyle(),
        // Apply any custom styles passed in props
        style,
      ]}
    >
      {/* Render the children components inside the View */}
      {children}
    </View>
  );
};

// Define styles using StyleSheet
const styles = StyleSheet.create({
  card: {
    // Add internal padding
    padding: 16,
    // Add margin at the bottom
    marginBottom: 16,
  },
});
