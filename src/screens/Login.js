import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { validateLogin } from '../utils/validation';
import { colors } from '../theme/colors';

const Login = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({}); // per-field validation errors
  const [authError, setAuthError] = useState(''); // error returned by the login API
  const [loading, setLoading] = useState(false);

  // Typing in a field clears its own error and any API error
  const onEmailChange = value => {
    setEmail(value);
    setErrors(prev => ({ ...prev, email: '' }));
    setAuthError('');
  };

  const onPasswordChange = value => {
    setPassword(value);
    setErrors(prev => ({ ...prev, password: '' }));
    setAuthError('');
  };

  const handleLogin = async () => {
    if (loading) return;

    const found = validateLogin(email, password);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // invalid input → no API call

    setAuthError('');
    setLoading(true);
    try {
      // On success AuthContext sets the user and RootNavigator switches to the Dashboard,
      // so this screen unmounts — no navigation call needed here.
      await login(email.trim(), password);
    } catch (e) {
      setAuthError(e.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        // edge-to-edge is on, so Android's adjustResize no longer moves content — pad on both platforms
        behavior="padding"
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

          {/* API error banner */}
          {!!authError && (
            <View style={styles.errorBanner} accessibilityRole="alert">
              <Text style={styles.errorBannerText}>{authError}</Text>
            </View>
          )}

          {/* Email and passwords input Container */}
          <View style={styles.form}>
            <TextField
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={onEmailChange}
              error={errors.email}
              editable={!loading}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="next"
            />
            <TextField
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={onPasswordChange}
              error={errors.password}
              editable={!loading}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          {/* login btn */}
          <PrimaryButton
            title={loading ? 'Logging in…' : 'Log in'}
            onPress={handleLogin}
            loading={loading}
          />

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
  errorBanner: {
    backgroundColor: colors.errorTint,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  errorBannerText: {
    fontSize: 13,
    color: colors.error,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
