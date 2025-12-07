// Import Platform from React Native to detect OS
import { Platform } from "react-native";

// Define Light Theme Object
export const lightTheme = {
    // Colors configuration
    colors: {
        background: '#F3F4F6', // Main background color (Cool Gray 100)
        surface: '#FFFFFF',    // Card/Container background color
        primary: '#6366F1',    // Primary brand color (Indigo 500)
        primaryDark: '#4F46E5', // Darker shade of primary for press states (Indigo 600)
        secondary: '#10B981',  // Secondary color (Emerald 500)
        text: '#111827',       // Main text color (Gray 900)
        textSecondary: '#6B7280', // Secondary text color (Gray 500)
        border: '#E5E7EB',     // Border color (Gray 200)
        error: '#EF4444',      // Error status color (Red 500)
        success: '#10B981',    // Success status color
        warning: '#F59E0B',    // Warning status color
        card: '#FFFFFF',       // Card background specifically
        overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlay color
    },
    // Spacing configuration (margins/paddings)
    spacing: {
        xs: 4,  // Extra small spacing
        s: 8,   // Small spacing
        m: 16,  // Medium spacing
        l: 24,  // Large spacing
        xl: 32, // Extra large spacing
        xxl: 48, // Double extra large
    },
    // Border Radius configuration
    borderRadius: {
        s: 8,   // Small radius
        m: 12,  // Medium radius
        l: 16,  // Large radius
        xl: 24, // Extra large radius
        round: 9999, // Full circle radius
    },
    // Typography configuration
    typography: {
        h1: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 }, // Heading 1
        h2: { fontSize: 24, fontWeight: '600' as const, letterSpacing: -0.5 }, // Heading 2
        h3: { fontSize: 20, fontWeight: '600' as const }, // Heading 3
        body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 }, // Body text
        caption: { fontSize: 14, fontWeight: '400' as const, color: '#6B7280' }, // Caption text
        button: { fontSize: 16, fontWeight: '600' as const }, // Button text
    },
    // Shadows configuration
    shadows: {
        small: Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            }
        }) as any,
        medium: Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }
        }) as any,
        large: Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 15,
            },
            android: {
                elevation: 10,
            },
            web: {
                boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
            }
        }) as any,
    }
};

// Define Dark Theme Object
export const darkTheme = {
    // Override colors for dark mode
    colors: {
        background: '#111827', // Dark background (Gray 900)
        surface: '#1F2937',    // Dark surface (Gray 800)
        primary: '#818CF8',    // Lighter primary for dark mode (Indigo 400)
        primaryDark: '#6366F1', // Primary dark (Indigo 500)
        secondary: '#34D399',  // Lighter secondary (Emerald 400)
        text: '#F9FAFB',       // Light text (Gray 50)
        textSecondary: '#9CA3AF', // Dimmed text (Gray 400)
        border: '#374151',     // Dark border (Gray 700)
        error: '#F87171',      // Lighter error (Red 400)
        success: '#34D399',    // Success
        warning: '#FBBF24',    // Warning
        card: '#1F2937',       // Card background
        overlay: 'rgba(0, 0, 0, 0.7)', // Darker overlay
    },
    // Reuse spacing, radius, typography, shadows from light theme
    spacing: lightTheme.spacing,
    borderRadius: lightTheme.borderRadius,
    typography: lightTheme.typography,
    shadows: lightTheme.shadows, // Shadows might need adjustment for dark mode visibility if not using elevation
};

// Export Theme type based on lightTheme structure
export type Theme = typeof lightTheme;
