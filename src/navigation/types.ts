// Import types from React Navigation
import { NavigatorScreenParams } from "@react-navigation/native";

// -----------------------------------------------
// AUTH STACK (Sign In / Sign Up)
// -----------------------------------------------

// This defines the parameter types for Auth screens
// "undefined" → screen does not expect any route params
export type AuthStackParamList = {
  // Sign In Screen params (none)
  SignIn: undefined;
  // Sign Up Screen params (none)
  SignUp: undefined;
};

// -----------------------------------------------
// MAIN TAB (Bottom Tabs: Home, Insights, Settings)
// -----------------------------------------------

// This defines the parameter types for Main Tab screens
export type MainTabParamList = {
  // Home Screen params (none)
  Home: undefined;
  // Insights Screen params (none)
  Insights: undefined;
  // Settings Screen params (none)
  Settings: undefined;
};

// -----------------------------------------------
// ROOT APP STACK
// This controls which navigator or screen you can go to
// depending on login state.
// -----------------------------------------------

// This defines the parameter types for the Root App Stack
export type AppStackParamList = {
  // Auth flow → this stack contains SignIn + SignUp screens
  // Uses NavigatorScreenParams to nest param lists
  Auth: NavigatorScreenParams<AuthStackParamList>;

  // Main app → this includes the bottom tab navigator
  // Uses NavigatorScreenParams to nest param lists
  Main: NavigatorScreenParams<MainTabParamList>;

  // Add a new habit → no params needed
  AddHabit: undefined;

  // Edit an existing habit → requires habitId param
  // habitId must be a string
  EditHabit: { habitId: string };
};
