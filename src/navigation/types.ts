import { NavigatorScreenParams } from "@react-navigation/native";

// -----------------------------------------------
// AUTH STACK (Sign In / Sign Up)
// -----------------------------------------------

// This defines the parameter types for Auth screens
// "undefined" → screen does not expect any route params
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

// -----------------------------------------------
// MAIN TAB (Bottom Tabs: Home, Insights, Settings)
// -----------------------------------------------

export type MainTabParamList = {
  Home: undefined;
  Insights: undefined;
  Settings: undefined;
};

// -----------------------------------------------
// ROOT APP STACK
// This controls which navigator or screen you can go to
// depending on login state.
// -----------------------------------------------

export type AppStackParamList = {
  // Auth flow → this stack contains SignIn + SignUp screens
  Auth: NavigatorScreenParams<AuthStackParamList>;

  // Main app → this includes the bottom tab navigator
  Main: NavigatorScreenParams<MainTabParamList>;

  // Add a new habit → no params needed
  AddHabit: undefined;

  // Edit an existing habit → requires habitId param
  EditHabit: { habitId: string };
};
