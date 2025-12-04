import React, { useState, useEffect } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";

// Theme + Habit Context
import { useTheme } from "../context/ThemeContext";
import { useHabits } from "../context/HabitContext";

// Navigation types
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../navigation/types";

// Reusable Components
import { ScreenContainer } from "../components/ScreenContainer";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Constants
import { HABIT_CATEGORIES, HABIT_COLORS } from "../constants";

type EditHabitScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "EditHabit"
>;

export default function EditHabitScreen({ navigation, route }: EditHabitScreenProps) {
  const { habitId } = route.params;     // habit ID from navigation
  const { theme } = useTheme();         // theme colors
  const { habits, editHabit, deleteHabit } = useHabits(); // habit functions

  const habit = habits.find((h) => h.id === habitId); // find habit by ID

  // Local state for input fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(HABIT_CATEGORIES[0]);
  const [color, setColor] = useState(HABIT_COLORS[0]);

  // Reminder state
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());

  const [loading, setLoading] = useState(false);

  // Pre-fill fields when habit is loaded
  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description || "");
      if (habit.category) setCategory(habit.category);
      if (habit.color) setColor(habit.color);

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
    if (!habit) return;

    if (!name.trim()) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    setLoading(true);

    try {
      await editHabit(habit.id, {
        name: name.trim(),
        description: description.trim(),
        category,

        color,
        reminderTime: reminderEnabled ? reminderTime.toISOString() : undefined,
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update habit");
    } finally {
      setLoading(false);
    }
  };

  // Delete habit with confirmation
  const handleDelete = () => {
    if (!habit) return;

    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Are you sure you want to delete this habit?");
      if (confirmed) {
        (async () => {
          await deleteHabit(habit.id);
          navigation.goBack();
        })();
      }
    } else {
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
    <ScreenContainer>
      {/* Moves inputs up when keyboard opens */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>

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
            {/* Habit Name */}
            <Input
              label="Habit Name"
              placeholder="e.g., Drink Water"
              value={name}
              onChangeText={setName}
            />

            {/* Description */}
            <Input
              label="Description (Optional)"
              placeholder="e.g., 8 glasses a day"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={{ height: 80, textAlignVertical: "top" }}
            />

            {/* Category Selector */}
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

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectorScroll}
            >
              {HABIT_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    {
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

            {/* Color Selector */}
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

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectorScroll}
            >
              {HABIT_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: c },
                    color === c && styles.selectedColor,
                  ]}
                  onPress={() => setColor(c)}
                >
                  {color === c && (
                    <Ionicons name="checkmark" size={16} color="#FFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>


            {/* Reminder Section */}
            <View style={styles.reminderContainer}>
              <View style={styles.reminderHeader}>
                <Text style={[theme.typography.body, { fontWeight: "600", color: theme.colors.text }]}>
                  Daily Reminder
                </Text>
                <Switch
                  value={reminderEnabled}
                  onValueChange={setReminderEnabled}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                />
              </View>

              {reminderEnabled && (
                <View style={styles.datePickerContainer}>
                  <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginBottom: 8 }]}>
                    Pick a time:
                  </Text>
                  {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                    <DateTimePicker
                      value={reminderTime}
                      mode="time"
                      display="default"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) setReminderTime(selectedDate);
                      }}
                      style={{ alignSelf: 'flex-start' }}
                    />
                  ) : (
                    <Text style={{ color: theme.colors.error }}>Time picker not supported on this platform</Text>
                  )}
                </View>
              )}
            </View>
          </Card>

          {/* Buttons */}
          <View style={styles.footer}>
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={loading}
              style={{ marginBottom: 16 }}
            />

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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  backButton: {
    padding: 4,
  },
  formCard: {
    padding: 20,
  },
  footer: {
    marginTop: 24,
  },
  selectorScroll: {
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: "#FFF",
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
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#EEE", // You might want to use theme.colors.border here if accessible
    paddingTop: 16,
  },
  reminderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  datePickerContainer: {
    marginTop: 12,
  },
});
