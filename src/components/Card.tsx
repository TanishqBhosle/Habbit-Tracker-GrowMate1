import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'elevated' }) => {
    const { theme } = useTheme();

    const getVariantStyle = () => {
        switch (variant) {
            case 'elevated':
                return {
                    backgroundColor: theme.colors.surface,
                    ...theme.shadows.small,
                };
            case 'outlined':
                return {
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                };
            case 'flat':
                return {
                    backgroundColor: theme.colors.background,
                };
            default:
                return {};
        }
    };

    return (
        <View style={[
            styles.card,
            { borderRadius: theme.borderRadius.m },
            getVariantStyle(),
            style
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginBottom: 16,
    },
});
