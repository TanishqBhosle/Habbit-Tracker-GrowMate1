import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { HabitProvider } from './src/context/HabitContext';
import AppNavigator from './src/navigation/AppNavigator';


export default function App() {


  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <HabitProvider>
            <AppNavigator />
          </HabitProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
