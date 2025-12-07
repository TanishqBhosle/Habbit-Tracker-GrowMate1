// Import React hooks
import React, { useState } from "react";
// Import UI components from React Native
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

// Form handling
// Import React Hook Form hooks
import { useForm, Controller } from "react-hook-form";

// Validation with Yup
// Import resolver for Yup
import { yupResolver } from "@hookform/resolvers/yup";
// Import Yup library
import * as yup from "yup";

// Firebase: create new user
// Import Firebase create user function
import { createUserWithEmailAndPassword } from "firebase/auth";
// Import Firebase auth instance
import { auth } from "../../firebase";

// Theme system
// Import theme context hook
import { useTheme } from "../../context/ThemeContext";

// Navigation types
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

// Props for SignUp screen
type SignUpScreenProps = {
  // Navigation prop specifically for SignUp screen
  navigation: NativeStackNavigationProp<AuthStackParamList, "SignUp">;
};

// Validation rules for the form
const schema = yup
  .object({
    // Email is required and must be valid
    email: yup.string().email("Invalid email").required("Email is required"),
    // Password is required, min 6 chars
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    // Confirm password must match password
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  })
  .required();

// Main SignUpScreen component
export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  // Get theme colors
  const { theme } = useTheme(); // access app colors
  // Loading state
  const [loading, setLoading] = useState(false); // button loading state

  // Form handling setup
  const {
    // Control object for fields
    control,
    // Handle form submission
    handleSubmit,
    // Form validation state
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // apply validation rules
  });

  // When user presses "Sign Up"
  const onSubmit = async (data: any) => {
    // Set loading state
    setLoading(true);

    try {
      // Create a new Firebase user with email and password
      await createUserWithEmailAndPassword(auth, data.email, data.password);

      // AuthContext will automatically redirect to Main screen upon auth state change
    } catch (error: any) {
      // Log error
      console.error("Sign Up Error:", error);
      // Show alert with error message
      Alert.alert("Registration Failed", error.message);
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    // Main container view
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Screen title */}
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Create Account
      </Text>

      {/* EMAIL INPUT */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          // Text Input for Email
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Email"
            placeholderTextColor={theme.colors.textSecondary}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />
      {/* Email error message */}
      {errors.email && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {errors.email.message}
        </Text>
      )}

      {/* PASSWORD INPUT */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          // Text Input for Password
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Password"
            placeholderTextColor={theme.colors.textSecondary}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry // hide password
          />
        )}
      />
      {/* Password error message */}
      {errors.password && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {errors.password.message}
        </Text>
      )}

      {/* CONFIRM PASSWORD INPUT */}
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          // Text Input for Confirm Password
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Confirm Password"
            placeholderTextColor={theme.colors.textSecondary}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {/* Confirm Password error message */}
      {errors.confirmPassword && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {errors.confirmPassword.message}
        </Text>
      )}

      {/* SIGN UP BUTTON */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {/* Show spinner if loading, else text */}
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Go to Sign In screen */}
      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text style={[styles.link, { color: theme.colors.primary }]}>
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// --------------------------
// Styles
// --------------------------
const styles = StyleSheet.create({
  container: {
    // Fill screen
    flex: 1,
    // Padding
    padding: 20,
    // Center vertically
    justifyContent: "center",
  },
  title: {
    // Large font size
    fontSize: 32,
    // Bold weight
    fontWeight: "bold",
    // Margin bottom
    marginBottom: 30,
    // Center text
    textAlign: "center",
  },
  input: {
    // Height
    height: 50,
    // Border width
    borderWidth: 1,
    // Radius
    borderRadius: 8,
    // Horizontal padding
    paddingHorizontal: 15,
    // Margin bottom
    marginBottom: 10,
    // Font size
    fontSize: 16,
  },
  button: {
    // Height
    height: 50,
    // Radius
    borderRadius: 8,
    // Center items vertically
    justifyContent: "center",
    // Center items horizontally
    alignItems: "center",
    // Margin top
    marginTop: 10,
  },
  buttonText: {
    // White text
    color: "#FFF",
    // Font size
    fontSize: 18,
    // Semi-bold
    fontWeight: "600",
  },
  link: {
    // Margin top
    marginTop: 20,
    // Center text
    textAlign: "center",
    // Font size
    fontSize: 16,
  },
  error: {
    // Margin bottom
    marginBottom: 10,
    // Font size
    fontSize: 14,
  },
});
