export interface Habit {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    completedDates: string[]; // ISO date strings YYYY-MM-DD
    color?: string;
    category?: string;
}

export interface DeletedHabit extends Habit {
    deletedAt: string;
}

export type RootStackParamList = {
    // ... existing params
};
