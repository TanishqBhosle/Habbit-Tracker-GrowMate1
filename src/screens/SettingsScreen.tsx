import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import { format } from 'date-fns';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList } from '../navigation/types';

type SettingsScreenProps = {
    navigation: NativeStackNavigationProp<MainTabParamList, 'Settings'>;
};

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
    const { theme, isDark, toggleTheme } = useTheme();
    const { signOut } = useAuth();
    const { deletedHabits } = useHabits();
    const [showHistory, setShowHistory] = useState(false);

    const handleSignOut = async () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Sign Out", style: "destructive", onPress: signOut }
            ]
        );
    };

    const renderSettingItem = (icon: any, title: string, rightElement: React.ReactNode, onPress?: () => void) => (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={0.7}
        >
            <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.background }]}>
                    <Ionicons name={icon} size={20} color={theme.colors.primary} />
                </View>
                <Text style={[theme.typography.body, { color: theme.colors.text, marginLeft: 12 }]}>{title}</Text>
            </View>
            {rightElement}
        </TouchableOpacity>
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[theme.typography.h2, { color: theme.colors.text, marginLeft: 16 }]}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginBottom: 8, marginLeft: 4 }]}>APPEARANCE</Text>
                <Card style={styles.card}>
                    {renderSettingItem(
                        isDark ? "moon" : "sunny",
                        "Dark Mode",
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                            thumbColor="#FFF"
                        />
                    )}
                </Card>

                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginBottom: 8, marginLeft: 4, marginTop: 16 }]}>DATA</Text>
                <Card style={styles.card}>
                    {renderSettingItem(
                        "trash-bin",
                        "Deleted Habits History",
                        <Ionicons name={showHistory ? "chevron-up" : "chevron-down"} size={20} color={theme.colors.textSecondary} />,
                        () => setShowHistory(!showHistory)
                    )}

                    {showHistory && (
                        <View style={styles.historyContainer}>
                            {deletedHabits.length === 0 ? (
                                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No deleted habits</Text>
                            ) : (
                                deletedHabits.map((item) => (
                                    <View key={item.id} style={[styles.historyItem, { borderColor: theme.colors.border }]}>
                                        <Text style={[styles.historyName, { color: theme.colors.text }]}>{item.name}</Text>
                                        <Text style={[styles.historyDate, { color: theme.colors.textSecondary }]}>
                                            Deleted: {format(new Date(item.deletedAt), 'MMM dd, yyyy')}
                                        </Text>
                                    </View>
                                ))
                            )}
                        </View>
                    )}
                </Card>

                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginBottom: 8, marginLeft: 4, marginTop: 16 }]}>ACCOUNT</Text>
                <Card style={styles.card}>
                    {renderSettingItem(
                        "log-out",
                        "Sign Out",
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />,
                        handleSignOut
                    )}
                </Card>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 8,
    },
    backButton: {
        padding: 4,
    },
    card: {
        padding: 0,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    historyContainer: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB', // Use a default or theme color if available in scope, but here hardcoded for simplicity within map
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    historyItem: {
        padding: 12,
        paddingLeft: 64, // Align with text
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    historyName: {
        fontSize: 14,
        fontWeight: '600',
    },
    historyDate: {
        fontSize: 12,
        marginTop: 2,
    },
    emptyText: {
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 20,
        fontSize: 14,
    },
});
