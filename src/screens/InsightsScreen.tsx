// Import React library
import React from 'react';
// Import UI components from React Native
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
// Import theme context hook
import { useTheme } from '../context/ThemeContext';
// Import habit context hook
import { useHabits } from '../context/HabitContext';
// Import BarChart component
import { BarChart } from 'react-native-chart-kit';
// Import date utility functions
import { subDays, format } from 'date-fns';
// Import screen container
import { ScreenContainer } from '../components/ScreenContainer';
// Import card component
import { Card } from '../components/Card';

// Main InsightsScreen component
export default function InsightsScreen() {
    // Get theme object
    const { theme } = useTheme();
    // Get habits list
    const { habits } = useHabits();
    // Get device screen width
    const screenWidth = Dimensions.get('window').width;

    // Calculate last 7 days completion
    // Create an array for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        // Calculate date for i days ago
        const date = subDays(new Date(), 6 - i);
        // Format date string
        return format(date, 'yyyy-MM-dd');
    });

    // Create labels for the chart (Day/Month)
    const labels = last7Days.map(date => format(new Date(date), 'dd/MM'));

    // Calculate completion count per day
    const data = last7Days.map(date => {
        // Initialize counter
        let completedCount = 0;
        // Iterate through all habits
        habits.forEach(habit => {
            // Check if habit was completed on this date
            if (habit.completedDates.includes(date)) {
                completedCount++;
            }
        });
        // Return total completions for the day
        return completedCount;
    });

    // Calculate completion rate per habit for the week
    const habitStats = habits.map(habit => {
        // Count how many times this habit was completed in the last 7 days
        const completedInWeek = last7Days.filter(date => habit.completedDates.includes(date)).length;
        // Return stats object
        return {
            name: habit.name,
            completed: completedInWeek,
            total: 7, // Total days in week
            color: habit.color // Habit color
        };
    });

    return (
        // Wrap screen content
        <ScreenContainer>
            {/* Screen Title */}
            <Text style={[theme.typography.h2, { color: theme.colors.text, marginBottom: 20 }]}>Weekly Overview</Text>

            {/* Chart Card */}
            <Card style={styles.chartCard}>
                {/* Chart Title */}
                <Text style={[theme.typography.h3, { color: theme.colors.text, marginBottom: 16 }]}>Daily Completions</Text>
                {/* Bar Chart Component */}
                <BarChart
                    data={{
                        labels: labels,
                        datasets: [
                            {
                                data: data
                            }
                        ]
                    }}
                    width={screenWidth - 72} // Screen padding (20*2) + Card padding (16*2)
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix=""
                    chartConfig={{
                        backgroundColor: theme.colors.surface,
                        backgroundGradientFrom: theme.colors.surface,
                        backgroundGradientTo: theme.colors.surface,
                        decimalPlaces: 0,
                        color: (opacity = 1) => theme.colors.primary,
                        labelColor: (opacity = 1) => theme.colors.textSecondary,
                        style: {
                            borderRadius: 16
                        },
                        barPercentage: 0.5,
                        propsForBackgroundLines: {
                            strokeDasharray: "", // solid lines
                            stroke: theme.colors.border,
                        }
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        paddingRight: 0,
                    }}
                    fromZero
                    showValuesOnTopOfBars
                />
            </Card>

            {/* Habit Performance Section Title */}
            <Text style={[theme.typography.h3, { color: theme.colors.text, marginTop: 24, marginBottom: 16 }]}>Habit Performance</Text>

            {/* Render stats for each habit */}
            {habitStats.map((stat, index) => (
                <Card key={index} style={styles.statCard}>
                    <View style={styles.statHeader}>
                        {/* Habit Name */}
                        <Text style={[theme.typography.body, { color: theme.colors.text, fontWeight: '600' }]}>{stat.name}</Text>
                        {/* Completion Ratio Text */}
                        <Text style={[theme.typography.body, { color: stat.color || theme.colors.primary, fontWeight: '700' }]}>{stat.completed}/{stat.total}</Text>
                    </View>
                    {/* Progress Bar Background */}
                    <View style={[styles.progressBar, { backgroundColor: theme.colors.background }]}>
                        {/* Progress Bar Fill */}
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    backgroundColor: stat.color || theme.colors.secondary,
                                    width: `${(stat.completed / stat.total) * 100}%`
                                }
                            ]}
                        />
                    </View>
                </Card>
            ))}

            {/* Spacer at bottom */}
            <View style={{ height: 40 }} />
        </ScreenContainer>
    );
}

// Define styles
const styles = StyleSheet.create({
    chartCard: {
        // Center content
        alignItems: 'center',
        // No horizontal padding
        paddingHorizontal: 0, // Let chart take full width minus card margin
    },
    statCard: {
        // Bottom margin
        marginBottom: 12,
        // Vertical padding
        paddingVertical: 12,
    },
    statHeader: {
        // Row layout
        flexDirection: 'row',
        // Space items
        justifyContent: 'space-between',
        // Bottom margin
        marginBottom: 12,
    },
    progressBar: {
        // Fixed height
        height: 8,
        // Rounded corners
        borderRadius: 4,
        // Hide overflow
        overflow: 'hidden',
    },
    progressFill: {
        // Full height
        height: '100%',
        // Rounded corners
        borderRadius: 4,
    },
});
