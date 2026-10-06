import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { CourseProvider } from './src/context/CourseContext';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CourseProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </CourseProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
