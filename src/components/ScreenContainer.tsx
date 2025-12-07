// Import React library
import React from "react";
// Import React Native components
import { View, StyleSheet, StatusBar, ViewStyle } from "react-native";
// Import SafeAreaView to handle notches and safe areas
import { SafeAreaView } from "react-native-safe-area-context";
// Import theme context
import { useTheme } from "../context/ThemeContext";

// Define props for ScreenContainer
interface ScreenContainerProps {
  // Child components to render inside the container
  children: React.ReactNode;
  // Optional custom styles
  style?: ViewStyle;
}

// Main ScreenContainer component to wrap screens
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
}) => {
  // Get theme values
  const { theme } = useTheme();

  return (
    // SafeAreaView ensures content is within safe boundaries (avoids notch)
    <SafeAreaView
      style={[
        // Apply base container styles
        styles.container,
        // Set background color from theme
        { backgroundColor: theme.colors.background },
      ]}
    >
      {/* StatusBar configuration */}
      <StatusBar
        // Set status bar text style: darker texts for light backgrounds, and vice versa
        barStyle={
          theme.colors.background === "#111827"
            ? "light-content"
            : "dark-content"
        }
        // Set status bar background color
        backgroundColor={theme.colors.background}
      />

      {/* Main content view */}
      <View style={[styles.content, style]}>
        {/* Render child components */}
        {children}
      </View>
    </SafeAreaView>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    // Fill the available screen space
    flex: 1,
  },
  content: {
    // Fill the container
    flex: 1,
    // Add default padding
    padding: 20,
  },
});
