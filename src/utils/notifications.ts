// Import Expo Notifications
import * as Notifications from "expo-notifications";
// Import Expo Device info
import * as Device from "expo-device";
// Import Platform from React Native
import { Platform } from "react-native";

// Configure how notifications behave when the app is in foreground
Notifications.setNotificationHandler({
    // Handle the notification event
    handleNotification: async () => ({
        // Show alert/banner
        shouldShowAlert: true,
        // Play sound
        shouldPlaySound: true,
        // Set app badge count
        shouldSetBadge: false,
        // Show banner (iOS)
        shouldShowBanner: true,
        // Show in notification center (iOS)
        shouldShowList: true,
    }),
});

// Request permissions and get push token (if needed in future)
export async function registerForPushNotificationsAsync() {
    // Android specific configuration
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    // Check if running on physical device
    if (!Device.isDevice) {
        // alert("Must use physical device for Push Notifications");
        // return;
        // Simulator usually works for local notifications too, so we continue
    }

    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If permission not granted, ask for it
    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    // If still not granted, fail silently
    if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return false;
    }

    return true;
}

// Schedule a daily notification for a habit
export async function scheduleHabitReminder(
    habitName: string,   // Name of the habit
    triggerHour: number, // Hour (0-23)
    triggerMinute: number // Minute (0-59)
) {
    // Ensure permissions are granted
    const hasPermission = await registerForPushNotificationsAsync();
    if (!hasPermission) return null;

    try {
        // Schedule the notification
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Habit Reminder 🔔", // Notification title
                body: `Time to work on: ${habitName}`, // Notification body
                sound: true, // Play default sound
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: triggerHour,
                minute: triggerMinute,
            },
        });
        // Return notification ID
        return id;
    } catch (error) {
        console.error("Error scheduling notification:", error);
        return null;
    }
}

// Cancel a specific notification
export async function cancelHabitReminder(notificationId: string) {
    try {
        // Cancel notification by ID
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
        console.error("Error canceling notification:", error);
    }
}
