import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList, MainTabParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ScreenContainer } from '../components/ScreenContainer';
import { HabitItem } from '../components/HabitItem';

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<AppStackParamList & MainTabParamList>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const { theme } = useTheme();
    const { habits, toggleCompletion, deleteHabit } = useHabits();
    const today = format(new Date(), 'yyyy-MM-dd');

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Habit",
            "Are you sure you want to delete this habit?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteHabit(id) }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => {
        const isCompleted = item.completedDates.includes(today);

        return (
            <HabitItem
                habit={item}
                isCompleted={isCompleted}
                onToggle={() => toggleCompletion(item.id, today)}
                onPress={() => navigation.navigate('EditHabit', { habitId: item.id })}
            />
        );
    };

    const completedCount = habits.filter(h => h.completedDates.includes(today)).length;
    const totalCount = habits.length;
    const progress = totalCount > 0 ? completedCount / totalCount : 0;

    return (
        <ScreenContainer style={{ padding: 0 }}>
            <View style={[styles.header, { backgroundColor: theme.colors.surface, paddingBottom: theme.spacing.l }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={[theme.typography.h1, { color: theme.colors.text }]}>Hello!</Text>
                        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>Ready to crush your goals?</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.settingsButton, { backgroundColor: theme.colors.background }]}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                {totalCount > 0 && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressTextRow}>
                            <Text style={[theme.typography.caption, { fontWeight: '600' }]}>Daily Progress</Text>
                            <Text style={[theme.typography.caption, { color: theme.colors.primary }]}>{Math.round(progress * 100)}%</Text>
                        </View>
                        <View style={[styles.progressBarBg, { backgroundColor: theme.colors.background }]}>
                            <View style={[
                                styles.progressBarFill,
                                {
                                    backgroundColor: theme.colors.primary,
                                    width: `${progress * 100}%`
                                }
                            ]} />
                        </View>
                    </View>
                )}
            </View>

            <FlatList
                data={habits}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={[styles.listContent, { padding: theme.spacing.m }]}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="leaf-outline" size={64} color={theme.colors.textSecondary} style={{ marginBottom: 16, opacity: 0.5 }} />
                        <Text style={[theme.typography.h3, { color: theme.colors.text, textAlign: 'center', marginBottom: 8 }]}>No habits yet</Text>
                        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>
                            Start building your streak by adding a new habit!
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={[
                    styles.fab,
                    {
                        backgroundColor: theme.colors.primary,
                        shadowColor: theme.colors.primary,
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                    }
                ]}
                onPress={() => navigation.navigate('AddHabit')}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={32} color="#FFF" />
            </TouchableOpacity>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 1,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    settingsButton: {
        padding: 8,
        borderRadius: 12,
    },
    progressContainer: {
        marginTop: 10,
    },
    progressTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    listContent: {
        paddingBottom: 100,
        paddingTop: 20,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
        paddingHorizontal: 40,
    },
});
