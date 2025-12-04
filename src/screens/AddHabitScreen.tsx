import React, { useState } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";

// Theme & Context
import { useTheme } from "../context/ThemeContext";
import { useHabits } from "../context/HabitContext";

// Navigation type
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../navigation/types";

// Reusable UI components
import { ScreenContainer } from "../components/ScreenContainer";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Habit categories + colors
import { HABIT_CATEGORIES, HABIT_COLORS } from "../constants";

type AddHabitScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "AddHabit">;
};

export default function AddHabitScreen({ navigation }: AddHabitScreenProps) {
  const { theme } = useTheme();        // theme colors
  const { addHabit } = useHabits();    // addHabit function

  // Form state values
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(HABIT_CATEGORIES[0]); // default first category
  const [color, setColor] = useState(HABIT_COLORS[0]);           // default first color

  // Reminder state
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());

  const [loading, setLoading] = useState(false);

  // Save habit handler
  const handleSave = async () => {
    // Validate name
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    setLoading(true);

    try {
      // Save habit into AsyncStorage (via context)
      await addHabit({
        name: name.trim(),
        description: description.trim(),
        category,
        color,
        reminderTime: reminderEnabled ? reminderTime.toISOString() : undefined,
      });

      navigation.goBack(); // return to previous screen
    } catch (error) {
      Alert.alert("Error", "Failed to create habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      {/* Pushes screen up when keyboard opens */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Page Header */}
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

            {/* Category Section */}
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

            {/* Color Section */}
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

            {/* Color Picker */}
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
                    // Fallback for web or other platforms if needed, but DateTimePicker works on iOS/Android
                    <Text style={{ color: theme.colors.error }}>Time picker not supported on this platform</Text>
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
