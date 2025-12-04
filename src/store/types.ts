// A Habit = one task the user wants to do daily
export interface Habit {
  id: string;
  // Unique ID for each habit (we generate it using Date.now().toString())

  name: string;
  // Name of the habit (example: "Drink Water")

  description?: string;
  // Optional small note about the habit

  createdAt: string;
  // Date when the habit was created (in ISO format like '2025-01-02T10:00:00Z')

  completedDates: string[];
  // List of dates when the habit was completed
  // Example: ["2025-01-02", "2025-01-03"]

  color?: string;
  // Optional color to highlight the habit (from your color picker)

  category?: string;
  // Optional category (Health, Study, Fitness, etc.)

  streak: number;
  // Current streak count

  bestStreak: number;
  // All-time best streak

  reminderTime?: string;
  // Optional reminder time (ISO string or HH:mm)

  notificationId?: string;
  // ID of the scheduled notification
}

// DeletedHabit = normal habit + one extra field "deletedAt"
export interface DeletedHabit extends Habit {
  deletedAt: string;
  // Date when the habit was deleted
}

// Navigation types for Root Navigation
export type RootStackParamList = {
  // Add your screens here when needed
  // Example:
  // Home: undefined;
  // Settings: undefined;
};
