import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, DeletedHabit } from '../store/types';


type HabitContextType = {
    habits: Habit[];
    deletedHabits: DeletedHabit[];
    addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => Promise<void>;
    editHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
    toggleCompletion: (id: string, date: string) => Promise<void>;
    loading: boolean;
};

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [deletedHabits, setDeletedHabits] = useState<DeletedHabit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const storedHabits = await AsyncStorage.getItem('habits');
            const storedDeleted = await AsyncStorage.getItem('deletedHabits');
            if (storedHabits) setHabits(JSON.parse(storedHabits));
            if (storedDeleted) setDeletedHabits(JSON.parse(storedDeleted));
        } catch (error) {
            console.error('Failed to load habits', error);
        } finally {
            setLoading(false);
        }
    };

    const saveData = async (newHabits: Habit[], newDeleted?: DeletedHabit[]) => {
        try {
            await AsyncStorage.setItem('habits', JSON.stringify(newHabits));
            if (newDeleted) {
                await AsyncStorage.setItem('deletedHabits', JSON.stringify(newDeleted));
            }
        } catch (error) {
            console.error('Failed to save habits', error);
        }
    };

    const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => {
        const newHabit: Habit = {
            ...habitData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            completedDates: [],
        };
        const newHabits = [...habits, newHabit];
        setHabits(newHabits);
        await saveData(newHabits);

    };

    const editHabit = async (id: string, updates: Partial<Habit>) => {
        const newHabits = habits.map(h => h.id === id ? { ...h, ...updates } : h);
        setHabits(newHabits);
        await saveData(newHabits);

    };

    const deleteHabit = async (id: string) => {
        const habitToDelete = habits.find(h => h.id === id);
        if (!habitToDelete) return;

        const newHabits = habits.filter(h => h.id !== id);
        setHabits(newHabits);

        const newDeleted: DeletedHabit = { ...habitToDelete, deletedAt: new Date().toISOString() };
        // Keep last 10
        const newDeletedList = [newDeleted, ...deletedHabits].slice(0, 10);
        setDeletedHabits(newDeletedList);

        await saveData(newHabits, newDeletedList);
    };

    const toggleCompletion = async (id: string, date: string) => {
        const newHabits = habits.map(h => {
            if (h.id === id) {
                const isCompleted = h.completedDates.includes(date);
                const newCompletedDates = isCompleted
                    ? h.completedDates.filter(d => d !== date)
                    : [...h.completedDates, date];
                return { ...h, completedDates: newCompletedDates };
            }
            return h;
        });
        setHabits(newHabits);
        await saveData(newHabits);
    };


    return (
        <HabitContext.Provider value={{ habits, deletedHabits, addHabit, editHabit, deleteHabit, toggleCompletion, loading }}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (!context) {
        throw new Error('useHabits must be used within a HabitProvider');
    }
    return context;
};
