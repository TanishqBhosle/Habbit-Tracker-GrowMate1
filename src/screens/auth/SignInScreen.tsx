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

// Yup for validation rules
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Firebase sign in
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

// Theme system
import { useTheme } from "../../context/ThemeContext";

// For screen navigation type
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

// Props for this screen
type SignInScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "SignIn">;
};

// Validation rules for the form
const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

export default function SignInScreen({ navigation }: SignInScreenProps) {
  const { theme } = useTheme(); // access theme colors
  const [loading, setLoading] = useState(false);

  // React Hook Form controller
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // connect validation rules
  });

  // Runs when user presses "Sign In"
  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      // Firebase email + password login
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error: any) {
      console.error("Sign In Error:", error);
      Alert.alert("Sign In Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
