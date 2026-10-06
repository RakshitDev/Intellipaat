import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

const TextField = ({ label, error, secureTextEntry, style, ...inputProps }) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputBox,
          focused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...inputProps}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHidden(h => !h)} hitSlop={8}>
            <Text style={styles.toggle}>{hidden ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default TextField;

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  inputFocused: {
    borderColor: colors.secondary,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: colors.text,
  },
  toggle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.secondary,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
  },
});
