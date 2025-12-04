import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";

// Props for Card
interface CardProps {
  children: React.ReactNode;   // Anything inside <Card>...</Card>
  style?: ViewStyle;           // Extra custom styling
  variant?: "elevated" | "outlined" | "flat"; // Type of card
}

// Main Card component
export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = "elevated", // default type is elevated
}) => {
  // Get theme colors, spacing, shadows, radius etc.
  const { theme } = useTheme();

  // Choose style based on the variant
  const getVariantStyle = () => {
    switch (variant) {
      // Card with shadow
      case "elevated":
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.small, // adds small shadow
        };

      // Card with border
      case "outlined":
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };

      // Simple card, no border or shadow
      case "flat":
        return {
          backgroundColor: theme.colors.background,
        };

      default:
        return {};
    }
  };

  return (
    <View
      style={[
        styles.card,                         // base padding + margin
        { borderRadius: theme.borderRadius.m }, // rounded corners
        getVariantStyle(),                   // selected variant style
        style,                                // custom styles from user
      ]}
    >
      {/* Content inside the Card */}
      {children}
    </View>
  );
};

// Base styles
const styles = StyleSheet.create({
  card: {
    padding: 16,       // space inside the card
    marginBottom: 16,  // space below the card
  },
});
