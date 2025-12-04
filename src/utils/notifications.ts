import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Configure how notifications behave when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// Request permissions
export async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    if (!Device.isDevice) {
        // alert("Must use physical device for Push Notifications");
        // return;
        // Simulator usually works for local notifications too
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return false;
    }

    return true;
}

// Schedule a daily notification
export async function scheduleHabitReminder(
    habitName: string,
    triggerHour: number,
    triggerMinute: number
) {
    const hasPermission = await registerForPushNotificationsAsync();
    if (!hasPermission) return null;

    try {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Habit Reminder 🔔",
                body: `Time to work on: ${habitName}`,
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: triggerHour,
                minute: triggerMinute,
            },
        });
        return id;
    } catch (error) {
        console.error("Error scheduling notification:", error);
        return null;
    }
}

// Cancel a specific notification
export async function cancelHabitReminder(notificationId: string) {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
        console.error("Error canceling notification:", error);
    }
}
