import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/types';
import { ScreenContainer } from '../components/ScreenContainer';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { HABIT_CATEGORIES, HABIT_COLORS } from '../constants';

type AddHabitScreenProps = {
    navigation: NativeStackNavigationProp<AppStackParamList, 'AddHabit'>;
};

export default function AddHabitScreen({ navigation }: AddHabitScreenProps) {
    const { theme } = useTheme();
    const { addHabit } = useHabits();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(HABIT_CATEGORIES[0]);
    const [color, setColor] = useState(HABIT_COLORS[0]);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a habit name');
            return;
        }

        setLoading(true);
        try {
            await addHabit({
                name: name.trim(),
                description: description.trim(),
                category,
                color,
            });
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to create habit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                        <Text style={[theme.typography.h2, { color: theme.colors.text, marginLeft: 16 }]}>New Habit</Text>
                    </View>

                    <Card style={styles.formCard}>
                        <Input
                            label="Habit Name"
                            placeholder="e.g., Drink Water"
                            value={name}
                            onChangeText={setName}
                            autoFocus
                        />
                        <Input
                            label="Description (Optional)"
                            placeholder="e.g., 8 glasses a day"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                            style={{ height: 80, textAlignVertical: 'top' }}
                        />

                        <Text style={[theme.typography.body, { fontWeight: '600', color: theme.colors.text, marginBottom: 8, marginTop: 8 }]}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
                            {HABIT_CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryChip,
                                        {
                                            backgroundColor: category === cat ? theme.colors.primary : theme.colors.surface,
                                            borderColor: category === cat ? theme.colors.primary : theme.colors.border,
                                        }
                                    ]}
                                    onPress={() => setCategory(cat)}
                                >
                                    <Text style={{
                                        color: category === cat ? '#FFF' : theme.colors.text,
                                        fontWeight: category === cat ? '600' : '400'
                                    }}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={[theme.typography.body, { fontWeight: '600', color: theme.colors.text, marginBottom: 8, marginTop: 16 }]}>Color</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
                            {HABIT_COLORS.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    style={[
                                        styles.colorCircle,
                                        { backgroundColor: c },
                                        color === c && styles.selectedColor
                                    ]}
                                    onPress={() => setColor(c)}
                                >
                                    {color === c && <Ionicons name="checkmark" size={16} color="#FFF" />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Card>

                    <View style={styles.footer}>
                        <Button
                            title="Create Habit"
                            onPress={handleSave}
                            loading={loading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    formCard: {
        padding: 20,
    },
    footer: {
        marginTop: 24,
    },
    selectorScroll: {
        marginBottom: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    colorCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedColor: {
        borderWidth: 2,
        borderColor: '#FFF',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
