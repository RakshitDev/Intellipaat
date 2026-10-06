import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';
import CourseDetails from '../screens/CourseDetails';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, isRestoring } = useAuth();

  if (isRestoring) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="CourseDetails" component={CourseDetails} />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
