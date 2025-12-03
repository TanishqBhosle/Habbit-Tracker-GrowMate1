import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import { BarChart } from 'react-native-chart-kit';
import { subDays, format } from 'date-fns';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';

export default function InsightsScreen() {
    const { theme } = useTheme();
    const { habits } = useHabits();
    const screenWidth = Dimensions.get('window').width;

    // Calculate last 7 days completion
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return format(date, 'yyyy-MM-dd');
    });

    const labels = last7Days.map(date => format(new Date(date), 'dd/MM'));

    // Calculate completion count per day
    const data = last7Days.map(date => {
        let completedCount = 0;
        habits.forEach(habit => {
            if (habit.completedDates.includes(date)) {
                completedCount++;
            }
        });
        return completedCount;
    });

    // Calculate completion rate per habit for the week
    const habitStats = habits.map(habit => {
        const completedInWeek = last7Days.filter(date => habit.completedDates.includes(date)).length;
        return {
            name: habit.name,
            completed: completedInWeek,
            total: 7,
            color: habit.color
        };
    });

    return (
        <ScreenContainer>
            <Text style={[theme.typography.h2, { color: theme.colors.text, marginBottom: 20 }]}>Weekly Overview</Text>

            <Card style={styles.chartCard}>
                <Text style={[theme.typography.h3, { color: theme.colors.text, marginBottom: 16 }]}>Daily Completions</Text>
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

            <Text style={[theme.typography.h3, { color: theme.colors.text, marginTop: 24, marginBottom: 16 }]}>Habit Performance</Text>

            {habitStats.map((stat, index) => (
                <Card key={index} style={styles.statCard}>
                    <View style={styles.statHeader}>
                        <Text style={[theme.typography.body, { color: theme.colors.text, fontWeight: '600' }]}>{stat.name}</Text>
                        <Text style={[theme.typography.body, { color: stat.color || theme.colors.primary, fontWeight: '700' }]}>{stat.completed}/{stat.total}</Text>
                    </View>
                    <View style={[styles.progressBar, { backgroundColor: theme.colors.background }]}>
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

            <View style={{ height: 40 }} />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    chartCard: {
        alignItems: 'center',
        paddingHorizontal: 0, // Let chart take full width minus card margin
    },
    statCard: {
        marginBottom: 12,
        paddingVertical: 12,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
});
