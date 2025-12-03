export const lightTheme = {
    colors: {
        background: '#F3F4F6', // Cool Gray 100
        surface: '#FFFFFF',
        primary: '#6366F1', // Indigo 500
        primaryDark: '#4F46E5', // Indigo 600
        secondary: '#10B981', // Emerald 500
        text: '#111827', // Gray 900
        textSecondary: '#6B7280', // Gray 500
        border: '#E5E7EB', // Gray 200
        error: '#EF4444', // Red 500
        success: '#10B981',
        warning: '#F59E0B',
        card: '#FFFFFF',
        overlay: 'rgba(0, 0, 0, 0.5)',
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        s: 8,
        m: 12,
        l: 16,
        xl: 24,
        round: 9999,
    },
    typography: {
        h1: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
        h2: { fontSize: 24, fontWeight: '600' as const, letterSpacing: -0.5 },
        h3: { fontSize: 20, fontWeight: '600' as const },
        body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
        caption: { fontSize: 14, fontWeight: '400' as const, color: '#6B7280' },
        button: { fontSize: 16, fontWeight: '600' as const },
    },
    shadows: {
        small: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        medium: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
        },
        large: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 15,
            elevation: 10,
        },
    }
};

export const darkTheme = {
    colors: {
        background: '#111827', // Gray 900
        surface: '#1F2937', // Gray 800
        primary: '#818CF8', // Indigo 400
        primaryDark: '#6366F1', // Indigo 500
        secondary: '#34D399', // Emerald 400
        text: '#F9FAFB', // Gray 50
        textSecondary: '#9CA3AF', // Gray 400
        border: '#374151', // Gray 700
        error: '#F87171', // Red 400
        success: '#34D399',
        warning: '#FBBF24',
        card: '#1F2937',
        overlay: 'rgba(0, 0, 0, 0.7)',
    },
    spacing: lightTheme.spacing,
    borderRadius: lightTheme.borderRadius,
    typography: lightTheme.typography,
    shadows: lightTheme.shadows, // Shadows might need adjustment for dark mode visibility if not using elevation
};

export type Theme = typeof lightTheme;
