// Import React hooks
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

// Import AsyncStorage for local data storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Habit types and DeletedHabit type
import { Habit, DeletedHabit } from "../store/types";
// Import notification helper functions
import { scheduleHabitReminder, cancelHabitReminder } from "../utils/notifications";
// Import date utility functions
import { differenceInCalendarDays, parseISO, subDays, format } from "date-fns";

// Define the data and functions provided by HabitContext
type HabitContextType = {
  // Array of all habit objects
  habits: Habit[];
  // Array of recently deleted habits
  deletedHabits: DeletedHabit[];
  // Function to add a new habit
  addHabit: (habit: Omit<Habit, "id" | "createdAt" | "completedDates" | "streak" | "bestStreak">) => Promise<void>;
  // Function to edit an existing habit
  editHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  // Function to delete a habit by ID
  deleteHabit: (id: string) => Promise<void>;
  // Function to toggle habit completion for a date
  toggleCompletion: (id: string, date: string) => Promise<void>;
  // Loading state boolean
  loading: boolean;
};

// Create the HabitContext with undefined default
const HabitContext = createContext<HabitContextType | undefined>(undefined);

// Main HabitProvider component
export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State for storing habits, defaults to empty array
  const [habits, setHabits] = useState<Habit[]>([]);
  // State for storing deleted habits, defaults to empty array
  const [deletedHabits, setDeletedHabits] = useState<DeletedHabit[]>([]);
  // State for loading status, defaults to true
  const [loading, setLoading] = useState(true);

  // Effect to load data when the provider mounts
  useEffect(() => {
    // Call loadData function
    loadData();
  }, []);

  // Helper function to calculate streak based on completed dates
  const calculateStreak = (completedDates: string[]) => {
    // Sort completed dates in descending order (newest first)
    const sortedDates = [...completedDates].sort((a, b) =>
      new Date(b).getTime() - new Date(a).getTime()
    );

    // Get today's date formatted as string
    const todayStr = format(new Date(), "yyyy-MM-dd");
    // Get yesterday's date formatted as string
    const yesterdayStr = format(subDays(new Date(), 1), "yyyy-MM-dd");

    // Start checking from today
    let checkDate = todayStr;
    // If today is not in the completed list
    if (!sortedDates.includes(todayStr)) {
      // If yesterday is in List, start checking from yesterday
      if (sortedDates.includes(yesterdayStr)) {
        checkDate = yesterdayStr;
      } else {
        // If neither today nor yesterday is completed, streak is 0
        return 0;
      }
    }

    // Initialize current streak counter
    let currentStreak = 0;
    // Date object to iterate backwards
    let d = new Date(checkDate);

    // Loop indefinitely (will break out)
    while (true) {
      // Format current check date
      const dStr = format(d, "yyyy-MM-dd");
      // If date is found in completed list
      if (sortedDates.includes(dStr)) {
        // Increment streak
        currentStreak++;
        // Move to previous day
        d = subDays(d, 1);
      } else {
        // Break loop if date not found (streak broken)
        break;
      }
    }
    // Return the calculated streak
    return currentStreak;
  };

  // Function to load data from AsyncStorage
  const loadData = async () => {
    try {
      // Get stored habits string
      const storedHabits = await AsyncStorage.getItem("habits");
      // Get stored deleted habits string
      const storedDeleted = await AsyncStorage.getItem("deletedHabits");

      // If habits exist in storage
      if (storedHabits) {
        // Parse the JSON string to an array
        const parsedHabits: Habit[] = JSON.parse(storedHabits);

        // Recalculate streaks for each habit to ensure accuracy
        const updatedHabits = parsedHabits.map(h => {
          // Calculate streak for this habit
          const currentStreak = calculateStreak(h.completedDates);
          // If calculated streak is different from stored, update it
          if (currentStreak !== h.streak) {
            return { ...h, streak: currentStreak };
          }
          // Return original habit if no change
          return h;
        });

        // Update state with habits
        setHabits(updatedHabits);
      }
      // If deleted habits exist, parse and set state
      if (storedDeleted) setDeletedHabits(JSON.parse(storedDeleted));
    } catch (error) {
      // Log error if loading fails
      console.error("Failed to load habits", error);
    } finally {
      // Set loading to false regardless of success or failure
      setLoading(false);
    }
  };

  // Function to save data to AsyncStorage
  const saveData = async (newHabits: Habit[], newDeleted?: DeletedHabit[]) => {
    try {
      // Save habits array as JSON string
      await AsyncStorage.setItem("habits", JSON.stringify(newHabits));

      // If newDeleted list is provided, save it too
      if (newDeleted) {
        await AsyncStorage.setItem("deletedHabits", JSON.stringify(newDeleted));
      }
    } catch (error) {
      // Log error if saving fails
      console.error("Failed to save habits", error);
    }
  };

  // Function to add a new habit
  const addHabit = async (
    habitData: Omit<Habit, "id" | "createdAt" | "completedDates" | "streak" | "bestStreak">
  ) => {
    // Create new habit object
    const newHabit: Habit = {
      ...habitData,
      // Generate unique ID based on timestamp
      id: Date.now().toString(),
      // Set creation date
      createdAt: new Date().toISOString(),
      // Initialize empty completed dates list
      completedDates: [],
      // Initialize streak to 0
      streak: 0,
      // Initialize best streak to 0
      bestStreak: 0,
    };

    // Schedule notification if reminderTime is provided
    if (newHabit.reminderTime) {
      // Parse reminder time string to Date object
      const date = new Date(newHabit.reminderTime);
      // Call scheduleHabitReminder helper
      const notifId = await scheduleHabitReminder(
        newHabit.name,
        date.getHours(),
        date.getMinutes()
      );
      // If notification scheduled successfully, save the ID
      if (notifId) {
        newHabit.notificationId = notifId;
      }
    }

    // Create new habits array with the new habit added
    const newHabits = [...habits, newHabit];
    // Update state
    setHabits(newHabits);

    // Save to storage
    await saveData(newHabits);
  };

  // Function to edit an existing habit
  const editHabit = async (id: string, updates: Partial<Habit>) => {
    // Find the habit to update
    const oldHabit = habits.find((h) => h.id === id);
    // Return if not found
    if (!oldHabit) return;

    // Create updated habit object
    let updatedHabit = { ...oldHabit, ...updates };

    // Handle Reminder Changes logic
    // Check if reminderTime is being updated and is different
    if (updates.reminderTime !== undefined && updates.reminderTime !== oldHabit.reminderTime) {
      // If an old notification exists, cancel it
      if (oldHabit.notificationId) {
        await cancelHabitReminder(oldHabit.notificationId);
        // Clear notification ID in object
        updatedHabit.notificationId = undefined;
      }

      // If new reminderTime is set (not null/undefined)
      if (updates.reminderTime) {
        // Parse new time
        const date = new Date(updates.reminderTime);
        // Schedule new notification
        const notifId = await scheduleHabitReminder(
          updatedHabit.name,
          date.getHours(),
          date.getMinutes()
        );
        // Save new notification ID
        if (notifId) updatedHabit.notificationId = notifId;
      }
    }
    // Check if name changed but reminderTime stayed same (need to update notification text)
    else if (updates.name && oldHabit.reminderTime && !updates.reminderTime) {
      // If old notification exists, cancel it because text needs update
      if (oldHabit.notificationId) {
        await cancelHabitReminder(oldHabit.notificationId);
      }
      // Re-schedule with new name and same time
      const date = new Date(oldHabit.reminderTime);
      const notifId = await scheduleHabitReminder(
        updates.name,
        date.getHours(),
        date.getMinutes()
      );
      // Save new notification ID
      if (notifId) updatedHabit.notificationId = notifId;
    }

    // Create new habits array with the updated habit replacing the old one
    const newHabits = habits.map((h) => (h.id === id ? updatedHabit : h));

    // Update state
    setHabits(newHabits);
    // Save to storage
    await saveData(newHabits);
  };

  // Function to delete a habit
  const deleteHabit = async (id: string) => {
    // Find habit to delete
    const habitToDelete = habits.find((h) => h.id === id);
    // Return if not found
    if (!habitToDelete) return;

    // Create new habits array excluding the deleted one
    const newHabits = habits.filter((h) => h.id !== id);
    // Update state
    setHabits(newHabits);

    // Cancel notification if it exists
    if (habitToDelete.notificationId) {
      await cancelHabitReminder(habitToDelete.notificationId);
    }

    // Create deleted habit object with timestamp
    const newDeleted: DeletedHabit = {
      ...habitToDelete,
      deletedAt: new Date().toISOString(),
    };

    // Add to deleted list and keep only the last 10
    const newDeletedList = [newDeleted, ...deletedHabits].slice(0, 10);

    // Update deleted habits state
    setDeletedHabits(newDeletedList);

    // Save both lists to storage
    await saveData(newHabits, newDeletedList);
  };

  // Function to toggle completion status of a habit for a date
  const toggleCompletion = async (id: string, date: string) => {
    // Map over habits to find the one to toggle
    const newHabits = habits.map((h) => {
      if (h.id === id) {
        // Check if date is currently completed
        const isCompleted = h.completedDates.includes(date);

        // Calculate new completed dates list
        const newCompletedDates = isCompleted
          ? h.completedDates.filter((d) => d !== date) // remove if exists
          : [...h.completedDates, date];               // add if doesn't exist

        // Recalculate Streak based on new dates
        const currentStreak = calculateStreak(newCompletedDates);
        // Update best streak if current is higher
        const newBestStreak = Math.max(h.bestStreak || 0, currentStreak);

        // Return updated habit object
        return {
          ...h,
          completedDates: newCompletedDates,
          streak: currentStreak,
          bestStreak: newBestStreak
        };
      }
      // Return unchanged habit if id doesn't match
      return h;
    });

    // Update state
    setHabits(newHabits);
    // Save to storage
    await saveData(newHabits);
  };

  // Render provider
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
      {/* Render children */}
      {children}
    </HabitContext.Provider>
  );
};

// Custom hook to access HabitContext
export const useHabits = () => {
  // Access context
  const context = useContext(HabitContext);

  // Error if used outside provider
  if (!context) {
    throw new Error("useHabits must be used within a HabitProvider");
  }

  // Return context
  return context;
};
