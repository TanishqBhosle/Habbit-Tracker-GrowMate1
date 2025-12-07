// Import React library
import React from "react";
// Import React Native components
import { View, TextInput, Text, StyleSheet, TextInputProps } from "react-native";
// Import theme hook
import { useTheme } from "../context/ThemeContext";

// Define Props for Input component
// Extends standard TextInputProps to allow standard behavior
interface InputProps extends TextInputProps {
  // Optional label to display above the input
  label?: string;
  // Optional error message to display below the input
  error?: string;
}

// Main Input component
export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  // Get theme values
  const { theme } = useTheme();

  return (
    // Container view for the input block
    <View style={styles.container}>

      {/* Conditionally render the label if provided */}
      {!!label && (
        <Text
          style={[
            // Apply caption typography
            theme.typography.caption,
            {
              // Set label text color
              color: theme.colors.text,
              // Add space below the label
              marginBottom: theme.spacing.xs,
              // Make the label text bold
              fontWeight: "600",
            },
          ]}
        >
          {label}
        </Text>
      )}

      {/* Render the TextInput component */}
      <TextInput
        style={[
          // Apply base input styles
          styles.input,
          {
            // Set background color
            backgroundColor: theme.colors.surface,
            // Determine border color: red if error, otherwise theme border color
            borderColor: error
              ? theme.colors.error
              : theme.colors.border,
            // Set text color
            color: theme.colors.text,
            // Set border radius
            borderRadius: theme.borderRadius.s,
            // Set padding
            padding: theme.spacing.m,
          },
          // Apply custom styles from props
          style,
        ]}
        // Set placeholder text color
        placeholderTextColor={theme.colors.textSecondary}
        // Spread remaining props (onChangeText, value, etc.)
        {...props}
      />

      {/* Conditionally render error text if error exists */}
      {!!error && (
        <Text
          style={[
            // Apply caption typography
            theme.typography.caption,
            {
              // Set error text color to red
              color: theme.colors.error,
              // Add space above the error text
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

// Define styles
const styles = StyleSheet.create({
  container: {
    // Add margin below the entire input block
    marginBottom: 16,
  },
  input: {
    // Set default border width
    borderWidth: 1,
    // Set default font size
    fontSize: 16,
  },
});
