import React, { useState } from "react";
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
import { useForm, Controller } from "react-hook-form";

// Validation with Yup
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Firebase: create new user
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

// Theme system
import { useTheme } from "../../context/ThemeContext";

// Navigation types
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "SignUp">;
};

// Validation rules for the form
const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  })
  .required();

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const { theme } = useTheme(); // access app colors
  const [loading, setLoading] = useState(false); // button loading state

  // Form handling setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // apply validation rules
  });

  // When user presses "Sign Up"
  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      // Create a new Firebase user
      await createUserWithEmailAndPassword(auth, data.email, data.password);

      // AuthContext will automatically redirect to Main screen
    } catch (error: any) {
      console.error("Sign Up Error:", error);
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
  error: {
    marginBottom: 10,
    fontSize: 14,
  },
});
