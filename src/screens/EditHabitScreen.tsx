// Import React hooks
import React, { useState, useEffect } from "react";
// Import UI components from React Native
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
// Import DateTimePicker component
import DateTimePicker from "@react-native-community/datetimepicker";

// Theme + Habit Context
// Import theme context hook
import { useTheme } from "../context/ThemeContext";
// Import habit context hook
import { useHabits } from "../context/HabitContext";

// Navigation types
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../navigation/types";

// Reusable Components
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

// Constants
import { HABIT_CATEGORIES, HABIT_COLORS } from "../constants";

// Define props for EditHabitScreen
type EditHabitScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "EditHabit"
>;

// Main EditHabitScreen component
export default function EditHabitScreen({ navigation, route }: EditHabitScreenProps) {
  // Get habit ID from navigation params
  const { habitId } = route.params;     // habit ID from navigation
  // Get theme colors
  const { theme } = useTheme();         // theme colors
  // Get habit helper functions
  const { habits, editHabit, deleteHabit } = useHabits(); // habit functions

  // Find the habit to edit
  const habit = habits.find((h) => h.id === habitId); // find habit by ID

  // Local state for input fields
  // State for habit name
  const [name, setName] = useState("");
  // State for habit description
  const [description, setDescription] = useState("");
  // State for habit category
  const [category, setCategory] = useState(HABIT_CATEGORIES[0]);
  // State for habit color
  const [color, setColor] = useState(HABIT_COLORS[0]);

  // Reminder state
  // State for reminder toggle
  const [reminderEnabled, setReminderEnabled] = useState(false);
  // State for reminder time
  const [reminderTime, setReminderTime] = useState(new Date());
  // State to show/hide date picker (Android)
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Loading state for save operation
  const [loading, setLoading] = useState(false);

  // Pre-fill fields when habit is loaded
  useEffect(() => {
    if (habit) {
      // Set name
      setName(habit.name);
      // Set description
      setDescription(habit.description || "");
      // Set category if exists
      if (habit.category) setCategory(habit.category);
      // Set color if exists
      if (habit.color) setColor(habit.color);

      // Set reminder details if exists
      if (habit.reminderTime) {
        setReminderEnabled(true);
        setReminderTime(new Date(habit.reminderTime));
      } else {
        setReminderEnabled(false);
        setReminderTime(new Date());
      }
    }
  }, [habit]);

  // Save updated habit
  const handleSave = async () => {
    // If habit missing, stop
    if (!habit) return;

    // Validate name
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    // Set loading state
    setLoading(true);

    try {
      // Call editHabit function
      await editHabit(habit.id, {
        name: name.trim(),
        description: description.trim(),
        category,
        color,
        // Update reminder time only if enabled
        reminderTime: reminderEnabled ? reminderTime.toISOString() : undefined,
      });

      // Navigate back
      navigation.goBack();
    } catch (error) {
      // Show error alert
      Alert.alert("Error", "Failed to update habit");
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  // Delete habit with confirmation
  const handleDelete = () => {
    if (!habit) return;

    // Platform specific deletion confirmation
    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Are you sure you want to delete this habit?");
      if (confirmed) {
        (async () => {
          await deleteHabit(habit.id);
          navigation.goBack();
        })();
      }
    } else {
      // Use native Alert for mobile
      Alert.alert(
        "Delete Habit",
        "Are you sure you want to delete this habit?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await deleteHabit(habit.id);
              navigation.goBack();
            },
          },
        ]
      );
    }
  };

  // If habit not found – return nothing
  if (!habit) return null;

  return (
    // Wrap screen in container
    <ScreenContainer>
      {/* Moves inputs up when keyboard opens */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Scrollable content area */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
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
              Edit Habit
            </Text>
          </View>

          {/* Main Form */}
          <Card style={styles.formCard}>
            {/* Habit Name Input */}
            <Input
              label="Habit Name"
              placeholder="e.g., Drink Water"
              value={name}
              onChangeText={setName}
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

            {/* Category Selector Title */}
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

            {/* Category Horizontal Scroll */}
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
                      // Selected style
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
                  {/* Category Text */}
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

            {/* Color Selector Title */}
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

            {/* Color Horizontal Scroll */}
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
                    // Selected style
                    color === c && styles.selectedColor,
                  ]}
                  onPress={() => setColor(c)}
                >
                  {/* Selected checkmark */}
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
                {/* Reminder Toggle */}
                <Switch
                  value={reminderEnabled}
                  onValueChange={setReminderEnabled}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                />
              </View>

              {/* Reminder Time Picker */}
              {reminderEnabled && (
                <View style={styles.datePickerContainer}>
                  <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginBottom: 8 }]}>
                    Pick a time:
                  </Text>

                  {Platform.OS === 'web' ? (
                    // Web Implementation
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
                        {/* Display Time */}
                        <Text style={{ color: theme.colors.text }}>
                          {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </TouchableOpacity>

                      {/* Modal Date Picker */}
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
                    // iOS Implementation: Inline
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

          {/* Buttons */}
          <View style={styles.footer}>
            {/* Save Button */}
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={loading}
              style={{ marginBottom: 16 }}
            />

            {/* Delete Button */}
            <Button
              title="Delete Habit"
              onPress={handleDelete}
              variant="danger"
              icon={<Ionicons name="trash-outline" size={20} color="#FFF" />}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView >
    </ScreenContainer >
  );
}

// ----------------------------------------
// Styles
// ----------------------------------------
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
    // Top margin for footer
    marginTop: 24,
  },
  selectorScroll: {
    // Bottom margin for scroll
    marginBottom: 8,
  },
  categoryChip: {
    // Horizontal padding
    paddingHorizontal: 16,
    // Vertical padding
    paddingVertical: 8,
    // Rounded corners
    borderRadius: 20,
    // Right margin
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
    // Right margin
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
    // Top margin
    marginTop: 24,
    // Top border
    borderTopWidth: 1,
    // Border color
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
    // Top margin
    marginTop: 12,
  },
});
