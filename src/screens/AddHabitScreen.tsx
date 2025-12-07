// Import React hooks
import React, { useState } from "react";
// Import UI components from React Native
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
// Import DateTimePicker component
import DateTimePicker from "@react-native-community/datetimepicker";

// Theme & Context
// Import theme context hook
import { useTheme } from "../context/ThemeContext";
// Import habit context hook
import { useHabits } from "../context/HabitContext";

// Navigation type
// Import navigation prop types
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../navigation/types";

// Reusable UI components
// Import screen container
import { ScreenContainer } from "../components/ScreenContainer";
// Import input component
import { Input } from "../components/Input";
// Import button component
import { Button } from "../components/Button";
// Import card component
import { Card } from "../components/Card";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Habit categories + colors
import { HABIT_CATEGORIES, HABIT_COLORS } from "../constants";

// Define props for AddHabitScreen
type AddHabitScreenProps = {
  // Navigation prop specifically for AddHabit screen
  navigation: NativeStackNavigationProp<AppStackParamList, "AddHabit">;
};

// Main AddHabitScreen component
export default function AddHabitScreen({ navigation }: AddHabitScreenProps) {
  // Get theme colors and styles
  const { theme } = useTheme();        // theme colors
  // Get addHabit function from context
  const { addHabit } = useHabits();    // addHabit function

  // Form state values
  // State for habit name
  const [name, setName] = useState("");
  // State for habit description
  const [description, setDescription] = useState("");
  // State for habit category
  const [category, setCategory] = useState(HABIT_CATEGORIES[0]); // default first category
  // State for habit color
  const [color, setColor] = useState(HABIT_COLORS[0]);           // default first color

  // Reminder state
  // State for reminder toggle
  const [reminderEnabled, setReminderEnabled] = useState(false);
  // State for reminder time
  const [reminderTime, setReminderTime] = useState(new Date());
  // State to show/hide date picker (Android)
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Loading state for save operation
  const [loading, setLoading] = useState(false);

  // Save habit handler
  const handleSave = async () => {
    // Validate name is not empty
    if (!name.trim()) {
      // Show error alert
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    // Set loading state to true
    setLoading(true);

    try {
      // Save habit into AsyncStorage (via context)
      await addHabit({
        name: name.trim(),
        description: description.trim(),
        category,
        color,
        // Only save reminder time if enabled
        reminderTime: reminderEnabled ? reminderTime.toISOString() : undefined,
      });

      // Go back to previous screen on success
      navigation.goBack(); // return to previous screen
    } catch (error) {
      // Show error alert on failure
      Alert.alert("Error", "Failed to create habit");
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    // Wrap screen in container
    <ScreenContainer>
      {/* Pushes screen up when keyboard opens */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Scrollable content area */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Page Header */}
          <View style={styles.header}>
            {/* Back button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>

            {/* Screen Title */}
            <Text
              style={[
                theme.typography.h2,
                { color: theme.colors.text, marginLeft: 16 },
              ]}
            >
              New Habit
            </Text>
          </View>

          {/* Form Card */}
          <Card style={styles.formCard}>
            {/* Habit Name Input */}
            <Input
              label="Habit Name"
              placeholder="e.g., Drink Water"
              value={name}
              onChangeText={setName}
              autoFocus
            />

            {/* Description Input */}
            <Input
              label="Description (Optional)"
              placeholder="e.g., 8 glasses a day"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={{ height: 80, textAlignVertical: "top" }}
            />

            {/* Category Section Title */}
            <Text
              style={[
                theme.typography.body,
                {
                  fontWeight: "600",
                  color: theme.colors.text,
                  marginBottom: 8,
                  marginTop: 8,
                },
              ]}
            >
              Category
            </Text>

            {/* Categories Horizontal Scroll */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectorScroll}
            >
              {/* Map through categories */}
              {HABIT_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    {
                      // Highlight selected category
                      backgroundColor:
                        category === cat
                          ? theme.colors.primary
                          : theme.colors.surface,
                      borderColor:
                        category === cat
                          ? theme.colors.primary
                          : theme.colors.border,
                    },
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  {/* Category Name */}
                  <Text
                    style={{
                      color: category === cat ? "#FFF" : theme.colors.text,
                      fontWeight: category === cat ? "600" : "400",
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Color Section Title */}
            <Text
              style={[
                theme.typography.body,
                {
                  fontWeight: "600",
                  color: theme.colors.text,
                  marginBottom: 8,
                  marginTop: 16,
                },
              ]}
            >
              Color
            </Text>

            {/* Color Picker Horizontal Scroll */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectorScroll}
            >
              {/* Map through colors */}
              {HABIT_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: c },
                    // Style selected color
                    color === c && styles.selectedColor,
                  ]}
                  onPress={() => setColor(c)}
                >
                  {/* Show checkmark on selected color */}
                  {color === c && (
                    <Ionicons name="checkmark" size={16} color="#FFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Reminder Section */}
            <View style={styles.reminderContainer}>
              <View style={styles.reminderHeader}>
                {/* Reminder Label */}
                <Text style={[theme.typography.body, { fontWeight: "600", color: theme.colors.text }]}>
                  Daily Reminder
                </Text>
                {/* Reminder Toggle Switch */}
                <Switch
                  value={reminderEnabled}
                  onValueChange={setReminderEnabled}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                />
              </View>

              {/* Show time picker if reminder is enabled */}
              {reminderEnabled && (
                <View style={styles.datePickerContainer}>
                  <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginBottom: 8 }]}>
                    Pick a time:
                  </Text>

                  {Platform.OS === 'web' ? (
                    // Web Implementation: HTML time input
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <input
                        type="time"
                        value={reminderTime.toTimeString().slice(0, 5)}
                        onChange={(e: any) => {
                          const [hours, minutes] = e.target.value.split(':');
                          const newDate = new Date();
                          newDate.setHours(parseInt(hours, 10));
                          newDate.setMinutes(parseInt(minutes, 10));
                          setReminderTime(newDate);
                        }}
                        style={{
                          padding: 10,
                          borderRadius: 8,
                          border: `1px solid ${theme.colors.border}`,
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.text,
                          fontFamily: 'inherit',
                          fontSize: 16
                        }}
                      />
                    </View>
                  ) : Platform.OS === 'android' ? (
                    // Android Implementation: Button to open Modal
                    <View>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={{
                          backgroundColor: theme.colors.surface,
                          padding: 12,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: theme.colors.border,
                          alignSelf: 'flex-start'
                        }}
                      >
                        {/* Display selected time */}
                        <Text style={{ color: theme.colors.text }}>
                          {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </TouchableOpacity>

                      {/* Modal Date Picker for Android */}
                      {showDatePicker && (
                        <DateTimePicker
                          value={reminderTime}
                          mode="time"
                          display="default"
                          onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) setReminderTime(selectedDate);
                          }}
                        />
                      )}
                    </View>
                  ) : (
                    // iOS Implementation: Inline picker
                    <DateTimePicker
                      value={reminderTime}
                      mode="time"
                      display="default"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) setReminderTime(selectedDate);
                      }}
                      style={{ alignSelf: 'flex-start' }}
                    />
                  )}
                </View>
              )}
            </View>
          </Card>

          {/* Save Button */}
          <View style={styles.footer}>
            <Button title="Create Habit" onPress={handleSave} loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

// --------------------------------------------
// Styles
// --------------------------------------------
const styles = StyleSheet.create({
  header: {
    // Row layout for header
    flexDirection: "row",
    // Align items vertically
    alignItems: "center",
    // Bottom margin
    marginBottom: 24,
    // Top margin
    marginTop: 8,
  },
  backButton: {
    // Padding for touch area
    padding: 4,
  },
  formCard: {
    // Padding inside card
    padding: 20,
  },
  footer: {
    // Margin above footer
    marginTop: 24,
  },
  selectorScroll: {
    // Margin below scroll views
    marginBottom: 8,
  },
  categoryChip: {
    // Horizontal padding
    paddingHorizontal: 16,
    // Vertical padding
    paddingVertical: 8,
    // Rounded corners
    borderRadius: 20,
    // Margin between chips
    marginRight: 8,
    // Border width
    borderWidth: 1,
  },
  colorCircle: {
    // Width
    width: 32,
    // Height
    height: 32,
    // Circular
    borderRadius: 16,
    // Margin between circles
    marginRight: 12,
    // Center content
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColor: {
    // Border for selection
    borderWidth: 2,
    // White border
    borderColor: "#FFF",
    // Platform specific shadows
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
      }
    }),
  },
  reminderContainer: {
    // Margin top
    marginTop: 24,
    // Top border
    borderTopWidth: 1,
    // Light border color
    borderTopColor: "#EEE", // You might want to use theme.colors.border here if accessible
    // Top padding
    paddingTop: 16,
  },
  reminderHeader: {
    // Row layout
    flexDirection: "row",
    // Space between items
    justifyContent: "space-between",
    // Align items vertically
    alignItems: "center",
  },
  datePickerContainer: {
    // Margin top
    marginTop: 12,
  },
});
