import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            {label && (
                <Text style={[
                    theme.typography.caption,
                    { color: theme.colors.text, marginBottom: theme.spacing.xs, fontWeight: '600' }
                ]}>
                    {label}
                </Text>
            )}
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: error ? theme.colors.error : theme.colors.border,
                        color: theme.colors.text,
                        borderRadius: theme.borderRadius.s,
                        padding: theme.spacing.m,
                    },
                    style
                ]}
                placeholderTextColor={theme.colors.textSecondary}
                {...props}
            />
            {error && (
                <Text style={[
                    theme.typography.caption,
                    { color: theme.colors.error, marginTop: theme.spacing.xs }
                ]}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        fontSize: 16,
    },
});
