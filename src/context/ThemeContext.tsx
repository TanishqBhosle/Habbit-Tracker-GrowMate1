import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useColorScheme, Platform } from "react-native"; // detects phone dark/light mode
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import theme objects
import { lightTheme, darkTheme, Theme } from "../theme/theme";

// What this context will give to the whole app
type ThemeContextType = {
  theme: Theme;        // full theme object (colors, spacing, etc.)
  isDark: boolean;     // true = dark mode, false = light mode
  toggleTheme: () => void; // switch between dark/light
};

// Create the context (empty for now)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider: wraps the whole app and manages theme
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Detect device theme (dark/light)
  const systemScheme = useColorScheme();

  // Track if app is using dark mode
  const [isDark, setIsDark] = useState(systemScheme === "dark");

  // Load saved theme from AsyncStorage when app starts
  useEffect(() => {
    loadTheme();
  }, []);

  // Load theme from AsyncStorage
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        setIsDark(savedTheme === "dark"); // apply saved theme
      }
    } catch (error) {
      console.error("Failed to load theme", error);
    }
  };

  // Switch between light and dark
  const toggleTheme = async () => {
    const newIsDark = !isDark;    // flip value (true → false, false → true)
    setIsDark(newIsDark);

    // Save new theme choice to AsyncStorage
    try {
      await AsyncStorage.setItem("theme", newIsDark ? "dark" : "light");
    } catch (error) {
      console.error("Failed to save theme", error);
    }
  };

  // Choose correct theme object
  const theme = isDark ? darkTheme : lightTheme;

  return (
    // Make theme values available to all screens
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Easy hook to use inside components
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
