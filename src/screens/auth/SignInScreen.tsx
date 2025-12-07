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

// Yup for validation rules
// Import resolver for Yup
import { yupResolver } from "@hookform/resolvers/yup";
// Import Yup library
import * as yup from "yup";

// Firebase sign in
// Import Firebase sign in function
import { signInWithEmailAndPassword } from "firebase/auth";
// Import Firebase auth instance
import { auth } from "../../firebase";

// Theme system
// Import theme context hook
import { useTheme } from "../../context/ThemeContext";

// For screen navigation type
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

// Props for this screen
type SignInScreenProps = {
  // Navigation prop specifically for SignIn screen
  navigation: NativeStackNavigationProp<AuthStackParamList, "SignIn">;
};

// Validation rules for the form
const schema = yup
  .object({
    // Email is required and must be valid format
    email: yup.string().email("Invalid email").required("Email is required"),
    // Password is required
    password: yup.string().required("Password is required"),
  })
  .required();

// Main SignInScreen component
export default function SignInScreen({ navigation }: SignInScreenProps) {
  // Get theme colors
  const { theme } = useTheme(); // access theme colors
  // Loading state for sign in process
  const [loading, setLoading] = useState(false);

  // React Hook Form controller
  const {
    // Control object for fields
    control,
    // Handle form submission
    handleSubmit,
    // Form validation state
    formState: { errors },
  } = useForm({
    // Connect Yup validation schema
    resolver: yupResolver(schema), // connect validation rules
  });

  // Runs when user presses "Sign In"
  const onSubmit = async (data: any) => {
    // Set loading to true
    setLoading(true);

    try {
      // Firebase email + password login
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // If successful, auth state change will handle navigation in AppNavigator
    } catch (error: any) {
      // Log error
      console.error("Sign In Error:", error);
      // Show alert with error message
      Alert.alert("Sign In Failed", error.message);
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
      {/* Title */}
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Welcome Back
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
          {errors.email.message as string}
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
            secureTextEntry // hides password
          />
        )}
      />

      {/* Password error message */}
      {errors.password && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {errors.password.message as string}
        </Text>
      )}

      {/* SIGN IN BUTTON */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleSubmit(onSubmit)} // validates + submits
        disabled={loading}
      >
        {/* Show spinner if loading, else text */}
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      {/* GO TO SIGN UP */}
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={[styles.link, { color: theme.colors.primary }]}>
          Don’t have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ----------------------------------
// STYLES
// ----------------------------------
const styles = StyleSheet.create({
  container: {
    // Fill screen
    flex: 1,
    // Padding around content
    padding: 20,
    // Center content vertically
    justifyContent: "center",
  },
  title: {
    // Large font size
    fontSize: 32,
    // Bold weight
    fontWeight: "bold",
    // Bottom margin
    marginBottom: 30,
    // Center text
    textAlign: "center",
  },
  input: {
    // Height of input
    height: 50,
    // Border width
    borderWidth: 1,
    // Rounded corners
    borderRadius: 8,
    // Horizontal padding
    paddingHorizontal: 15,
    // Bottom margin
    marginBottom: 10,
    // Font size
    fontSize: 16,
  },
  button: {
    // Height of button
    height: 50,
    // Rounded corners
    borderRadius: 8,
    // Center items vertically
    justifyContent: "center",
    // Center items horizontally
    alignItems: "center",
    // Top margin
    marginTop: 10,
  },
  buttonText: {
    // White text color
    color: "#FFF",
    // Font size
    fontSize: 18,
    // Semi-bold
    fontWeight: "600",
  },
  link: {
    // Top margin
    marginTop: 20,
    // Center text
    textAlign: "center",
    // Font size
    fontSize: 16,
  },
  error: {
    // Bottom margin
    marginBottom: 10,
    // Font size
    fontSize: 14,
  },
});
