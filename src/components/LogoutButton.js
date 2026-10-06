import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    // Real padding instead of hitSlop: hitSlop doesn't extend outside the native header on Android
    <TouchableOpacity
      onPress={logout}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel="Log out"
    >
      <Text style={styles.text}>Log out</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: -12, // keep the text aligned with the header edge
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondary,
  },
});
