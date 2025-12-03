import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import AddHabitScreen from '../screens/AddHabitScreen';
import EditHabitScreen from '../screens/EditHabitScreen';
import { AppStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
    const { user, loading } = useAuth();
    const { theme } = useTheme();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <>
                        <Stack.Screen name="Main" component={MainTabNavigator} />
                        <Stack.Screen
                            name="AddHabit"
                            component={AddHabitScreen}
                            options={{
                                headerShown: true,
                                title: 'New Habit',
                                headerStyle: { backgroundColor: theme.colors.background },
                                headerTintColor: theme.colors.text,
                            }}
                        />
                        <Stack.Screen
                            name="EditHabit"
                            component={EditHabitScreen}
                            options={{
                                headerShown: true,
                                title: 'Edit Habit',
                                headerStyle: { backgroundColor: theme.colors.background },
                                headerTintColor: theme.colors.text,
                            }}
                        />
                    </>
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
