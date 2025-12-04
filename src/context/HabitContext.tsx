import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Types for habits
import { Habit, DeletedHabit } from "../store/types";
import { scheduleHabitReminder, cancelHabitReminder } from "../utils/notifications";
import { differenceInCalendarDays, parseISO, subDays, format } from "date-fns";

// What this Habit Context will provide to the app
type HabitContextType = {
  habits: Habit[];                     // list of all habits
  deletedHabits: DeletedHabit[];       // recently deleted habits (max 10)
  addHabit: (habit: Omit<Habit, "id" | "createdAt" | "completedDates" | "streak" | "bestStreak">) => Promise<void>;
  editHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleCompletion: (id: string, date: string) => Promise<void>;
  loading: boolean;                    // true while loading data
};

// Create the context (empty placeholder)
const HabitContext = createContext<HabitContextType | undefined>(undefined);

// Main provider for the app
export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [habits, setHabits] = useState<Habit[]>([]);               // all habits
  const [deletedHabits, setDeletedHabits] = useState<DeletedHabit[]>([]); // recently deleted
  const [loading, setLoading] = useState(true);                    // loading state

  // Load habits from AsyncStorage when app starts
  useEffect(() => {
    loadData();
  }, []);

  // Load stored habits + deleted habits from AsyncStorage
  const loadData = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem("habits");
      const storedDeleted = await AsyncStorage.getItem("deletedHabits");

      if (storedHabits) setHabits(JSON.parse(storedHabits));
      if (storedDeleted) setDeletedHabits(JSON.parse(storedDeleted));
    } catch (error) {
      console.error("Failed to load habits", error);
    } finally {
      setLoading(false);
    }
  };

  // Save habits (and deleted habits if given) to AsyncStorage
  const saveData = async (newHabits: Habit[], newDeleted?: DeletedHabit[]) => {
    try {
      await AsyncStorage.setItem("habits", JSON.stringify(newHabits));

      if (newDeleted) {
        await AsyncStorage.setItem("deletedHabits", JSON.stringify(newDeleted));
      }
    } catch (error) {
      console.error("Failed to save habits", error);
    }
  };

  // Add a new habit
  const addHabit = async (
    habitData: Omit<Habit, "id" | "createdAt" | "completedDates" | "streak" | "bestStreak">
  ) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),            // unique id
      createdAt: new Date().toISOString(),  // timestamp
      completedDates: [],                   // completed dates empty
      streak: 0,
      bestStreak: 0,
    };

    // Schedule notification if reminderTime is present
    if (newHabit.reminderTime) {
      const date = new Date(newHabit.reminderTime);
      const notifId = await scheduleHabitReminder(
        newHabit.name,
        date.getHours(),
        date.getMinutes()
      );
      if (notifId) {
        newHabit.notificationId = notifId;
      }
    }

    const newHabits = [...habits, newHabit];
    setHabits(newHabits);

    await saveData(newHabits);
  };

  // Edit an existing habit
  const editHabit = async (id: string, updates: Partial<Habit>) => {
    const oldHabit = habits.find((h) => h.id === id);
    if (!oldHabit) return;

    let updatedHabit = { ...oldHabit, ...updates };

    // Handle Reminder Changes
    // 1. If reminderTime changed or toggled
    if (updates.reminderTime !== undefined && updates.reminderTime !== oldHabit.reminderTime) {
      // Cancel old notification if exists
      if (oldHabit.notificationId) {
        await cancelHabitReminder(oldHabit.notificationId);
        updatedHabit.notificationId = undefined;
      }

      // Schedule new one if reminderTime is set
      if (updates.reminderTime) {
        const date = new Date(updates.reminderTime);
        const notifId = await scheduleHabitReminder(
          updatedHabit.name,
          date.getHours(),
          date.getMinutes()
        );
        if (notifId) updatedHabit.notificationId = notifId;
      }
    }
    // 2. If name changed but reminder stays same, might want to update notif text? 
    // For simplicity, we'll skip that or re-schedule. Let's re-schedule to be safe.
    else if (updates.name && oldHabit.reminderTime && !updates.reminderTime) {
      // If name changed and we have a reminder, update it
      if (oldHabit.notificationId) {
        await cancelHabitReminder(oldHabit.notificationId);
      }
      const date = new Date(oldHabit.reminderTime);
      const notifId = await scheduleHabitReminder(
        updates.name,
        date.getHours(),
        date.getMinutes()
      );
      if (notifId) updatedHabit.notificationId = notifId;
    }

    const newHabits = habits.map((h) => (h.id === id ? updatedHabit : h));

    setHabits(newHabits);
    await saveData(newHabits);
  };

  // Delete a habit & add it to "recently deleted" list
  const deleteHabit = async (id: string) => {
    const habitToDelete = habits.find((h) => h.id === id);
    if (!habitToDelete) return;

    // Remove from habits list
    const newHabits = habits.filter((h) => h.id !== id);
    setHabits(newHabits);

    // Cancel notification
    if (habitToDelete.notificationId) {
      await cancelHabitReminder(habitToDelete.notificationId);
    }

    // Add to deleted list with timestamp
    const newDeleted: DeletedHabit = {
      ...habitToDelete,
      deletedAt: new Date().toISOString(),
    };

    // Keep only the last 10 deleted habits
    const newDeletedList = [newDeleted, ...deletedHabits].slice(0, 10);

    setDeletedHabits(newDeletedList);

    await saveData(newHabits, newDeletedList);
  };

  // Mark habit completed/uncompleted for a specific date
  const toggleCompletion = async (id: string, date: string) => {
    const newHabits = habits.map((h) => {
      if (h.id === id) {
        const isCompleted = h.completedDates.includes(date);

        const newCompletedDates = isCompleted
          ? h.completedDates.filter((d) => d !== date) // remove date → uncomplete
          : [...h.completedDates, date];               // add date → complete

        // Recalculate Streak
        // Sort dates descending
        const sortedDates = [...newCompletedDates].sort((a, b) =>
          new Date(b).getTime() - new Date(a).getTime()
        );

        let currentStreak = 0;
        const todayStr = format(new Date(), "yyyy-MM-dd");
        const yesterdayStr = format(subDays(new Date(), 1), "yyyy-MM-dd");

        // Check if streak is active (today or yesterday must be present)
        // If today is present, start from today.
        // If today is NOT present, but yesterday IS, start from yesterday.
        // Else streak is 0.

        let checkDate = todayStr;
        if (!sortedDates.includes(todayStr)) {
          if (sortedDates.includes(yesterdayStr)) {
            checkDate = yesterdayStr;
          } else {
            checkDate = ""; // Streak broken
          }
        }

        if (checkDate) {
          // Count backwards
          let d = new Date(checkDate);
          while (true) {
            const dStr = format(d, "yyyy-MM-dd");
            if (sortedDates.includes(dStr)) {
              currentStreak++;
              d = subDays(d, 1);
            } else {
              break;
            }
          }
        }

        const newBestStreak = Math.max(h.bestStreak || 0, currentStreak);

        return {
          ...h,
          completedDates: newCompletedDates,
          streak: currentStreak,
          bestStreak: newBestStreak
        };
      }
      return h;
    });

    setHabits(newHabits);
    await saveData(newHabits);
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        deletedHabits,
        addHabit,
        editHabit,
        deleteHabit,
        toggleCompletion,
        loading,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

// Custom hook to access habit data in components
export const useHabits = () => {
  const context = useContext(HabitContext);

  if (!context) {
    throw new Error("useHabits must be used within a HabitProvider");
  }

  return context;
};
