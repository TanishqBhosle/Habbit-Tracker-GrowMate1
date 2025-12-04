import React from "react";
import { View, TextInput, Text, StyleSheet, TextInputProps } from "react-native";
import { useTheme } from "../context/ThemeContext";

// Input component props
// Extends TextInputProps → allows all normal TextInput props
interface InputProps extends TextInputProps {
  label?: string; // Small text above input
  error?: string; // Error message below input
}

// Main Input component
export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  const { theme } = useTheme(); // Get theme colors + typography

  return (
    <View style={styles.container}>

      {/* Label above the input (optional) */}
      {!!label && (
        <Text
          style={[
            theme.typography.caption,
            {
              color: theme.colors.text,        // label text color
              marginBottom: theme.spacing.xs,  // small spacing below label
              fontWeight: "600",               // make label a bit bold
            },
          ]}
        >
          {label}
        </Text>
      )}

      {/* Text input field */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface, // card-like background
            borderColor: error                     // if error, red border
              ? theme.colors.error
              : theme.colors.border,               // otherwise normal border
            color: theme.colors.text,              // text inside input
            borderRadius: theme.borderRadius.s,    // rounded corners
            padding: theme.spacing.m,              // inner spacing
          },
          style,                                   // custom styles from user
        ]}
        placeholderTextColor={theme.colors.textSecondary} // placeholder light color
        {...props}                                  // all other TextInput props
      />

      {/* Error message below input (optional) */}
      {!!error && (
        <Text
          style={[
            theme.typography.caption,
            {
              color: theme.colors.error,            // red error text
              marginTop: theme.spacing.xs,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

// Basic reusable styles
const styles = StyleSheet.create({
  container: {
    marginBottom: 16, // space below each input field
  },
  input: {
    borderWidth: 1,   // thin border around input
    fontSize: 16,     // input text size
  },
});
