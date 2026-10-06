import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';
import CourseDetails from '../screens/CourseDetails';
import LogoutButton from '../components/LogoutButton';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.card },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '600' },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.background },
};

const RootNavigator = () => {
  const { user, isRestoring } = useAuth();

  // Checking for a saved session — avoids flashing the Login screen for logged-in users
  if (isRestoring) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {user ? (
        <>
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ title: 'My Courses', headerRight: LogoutButton }}
          />
          <Stack.Screen
            name="CourseDetails"
            component={CourseDetails}
            options={({ route }) => ({ title: route.params?.title ?? 'Course' })}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
