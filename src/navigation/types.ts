import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Insights: undefined;
    Settings: undefined;
};

export type AppStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Main: NavigatorScreenParams<MainTabParamList>;
    AddHabit: undefined;
    EditHabit: { habitId: string };
};
