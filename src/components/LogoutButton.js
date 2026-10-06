import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <TouchableOpacity onPress={logout} hitSlop={8}>
      <Text style={styles.text}>Log out</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondary,
  },
});
