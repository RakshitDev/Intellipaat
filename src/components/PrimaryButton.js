import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

const PrimaryButton = ({ title, onPress, loading = false, disabled = false, variant = 'solid', style }) => {
  const isOutline = variant === 'outline';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        isOutline ? styles.outline : styles.solid,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading && <ActivityIndicator color={isOutline ? colors.secondary : colors.white} />}
      <Text style={[styles.text, isOutline && styles.outlineText]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 6,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  solid: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.white,
  },
  outlineText: {
    color: colors.secondary,
  },
});
