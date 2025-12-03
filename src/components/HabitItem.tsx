import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card } from './Card';

interface HabitItemProps {
    habit: any;
    isCompleted: boolean;
    onToggle: () => void;
    onPress: () => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, isCompleted, onToggle, onPress }) => {
    const { theme } = useTheme();

    const handleToggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        onToggle();
    };

    return (
        <Card style={styles.card}>
            <TouchableOpacity style={styles.content} onPress={onPress} activeOpacity={0.7}>
                <View style={styles.textContainer}>
                    <Text style={[
                        theme.typography.h3,
                        {
                            color: isCompleted ? theme.colors.textSecondary : theme.colors.text,
                            textDecorationLine: isCompleted ? 'line-through' : 'none'
                        }
                    ]}>
                        {habit.name}
                    </Text>
                    {habit.description && (
                        <Text style={[
                            theme.typography.caption,
                            { color: theme.colors.textSecondary, marginTop: 4 }
                        ]}>
                            {habit.description}
                        </Text>
                    )}
                    {habit.category && (
                        <View style={[styles.categoryTag, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                            <Text style={[theme.typography.caption, { fontSize: 10, color: theme.colors.textSecondary }]}>
                                {habit.category}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleToggle}
                style={[
                    styles.checkbox,
                    {
                        borderColor: isCompleted ? (habit.color || theme.colors.success) : theme.colors.border,
                        backgroundColor: isCompleted ? (habit.color || theme.colors.success) : 'transparent'
                    }
                ]}
            >
                {isCompleted && <Ionicons name="checkmark" size={20} color="#FFF" />}
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    content: {
        flex: 1,
    },
    textContainer: {
        marginRight: 12,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: 6,
    },
});
