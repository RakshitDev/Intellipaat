import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { colors } from '../theme/colors';

// One component for full-screen loading / empty / error states, so every screen handles them the same way.
const StateView = ({ type, title, message, actionLabel, onAction }) => {
  if (type === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  const isError = type === 'error';

  return (
    <View style={styles.container}>
      <View style={[styles.icon, isError ? styles.iconError : styles.iconEmpty]}>
        <Text style={[styles.iconText, { color: isError ? colors.error : colors.secondary }]}>
          {isError ? '!' : '∅'}
        </Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
      {!!onAction && (
        <PrimaryButton
          title={actionLabel}
          onPress={onAction}
          variant={isError ? 'solid' : 'outline'}
          style={styles.button}
        />
      )}
    </View>
  );
};

export default StateView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconError: {
    backgroundColor: colors.errorTint,
  },
  iconEmpty: {
    backgroundColor: colors.secondaryTint,
  },
  iconText: {
    fontSize: 28,
    fontWeight: '700',
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  button: {
    marginTop: 4,
    minWidth: 140,
  },
});
