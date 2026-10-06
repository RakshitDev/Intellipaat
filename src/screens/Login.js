import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

const Login = () => {
  // UI only for now — validation and login will be wired in next
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* header */}
          <View style={styles.header}>
            <View style={styles.logoMark}>
              <Text style={styles.logoLetter}>I</Text>
            </View>
            <Text style={styles.appName}>Intellipaat Learn</Text>
          </View>

          {/* welcome Text */}
          <View style={styles.welcome}>
            <Text style={styles.title}>
              Welcome <Text style={styles.titleAccent}>back</Text>
            </Text>
            <Text style={styles.subtitle}>Log in to continue your courses</Text>
          </View>

          {/* Email and passwords input Container */}
          <View style={styles.form}>
            <TextField
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />
            <TextField
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="done"
            />
          </View>

          {/* login btn */}
          <PrimaryButton title="Log in" onPress={() => {}} />

          <Text style={styles.hint}>Demo: rahul@test.com · password@123</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  welcome: {
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '500',
    color: colors.text,
  },
  titleAccent: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
  form: {
    gap: 16,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
