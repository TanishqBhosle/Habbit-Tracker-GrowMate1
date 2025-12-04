import React from "react";
import { View, StyleSheet, StatusBar, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

// Props for this screen wrapper component
interface ScreenContainerProps {
  children: React.ReactNode; // The screen content inside the container
  style?: ViewStyle;         // Extra custom styling
}

// Main reusable screen wrapper
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
}) => {
  const { theme } = useTheme(); // Get theme colors

  return (
    // SafeAreaView ensures content doesn't go under the notch/top bar
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background }, // Screen background
      ]}
    >
      {/* StatusBar: changes text color based on dark/light theme */}
      <StatusBar
        barStyle={
          theme.colors.background === "#111827"
            ? "light-content"  // white icons for dark background
            : "dark-content"   // dark icons for light background
        }
        backgroundColor={theme.colors.background}
      />

      {/* Screen content area */}
      <View style={[styles.content, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

// Basic default styles
const styles = StyleSheet.create({
  container: {
    flex: 1, // take full screen height
  },
  content: {
    flex: 1,
    padding: 20, // space around content
  },
});
