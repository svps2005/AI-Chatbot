import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Button, TextInput, ErrorMessage } from '../components';
import { COLORS, SPACING, FONT_SIZES, FONTS, MESSAGES } from '../constants';
import { AuthStackParamList, useAuth } from '../navigation/RootNavigator';
import { authService } from '../services/authService';
import { saveAuthToken, saveUserData } from '../store/asyncStorage';
import {
  getNameErrorMessage,
  getEmailErrorMessage,
  getPasswordErrorMessage,
} from '../utils/validation';

type Props = StackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { setAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    let isValid = true;

    const nameErr = getNameErrorMessage(name);
    if (nameErr) {
      setNameError(nameErr);
      isValid = false;
    } else {
      setNameError(null);
    }

    const emailErr = getEmailErrorMessage(email);
    if (emailErr) {
      setEmailError(emailErr);
      isValid = false;
    } else {
      setEmailError(null);
    }

    const passwordErr = getPasswordErrorMessage(password);
    if (passwordErr) {
      setPasswordError(passwordErr);
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError(null);
    }

    return isValid;
  };

  const handleRegister = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // After registration, login
      const loginResponse = await authService.login({
        email: email.trim(),
        password,
      });

      // Save auth data
      await saveAuthToken(loginResponse.token);
      await saveUserData(loginResponse.user);

      setAuthenticated(true);
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.message || MESSAGES.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join us and start chatting with AI
          </Text>
        </View>

        {error && (
          <ErrorMessage
            message={error}
            onDismiss={() => setError(null)}
          />
        )}

        <View style={styles.form}>
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            error={nameError || undefined}
            autoCapitalize="words"
            editable={!loading}
          />

          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            error={emailError || undefined}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            label="Password"
            placeholder="Enter a password (min 6 characters)"
            value={password}
            onChangeText={setPassword}
            error={passwordError || undefined}
            secureTextEntry
            editable={!loading}
          />

          <TextInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={confirmPasswordError || undefined}
            secureTextEntry
            editable={!loading}
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            fullWidth
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
    marginTop: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.textPrimary,
    ...FONTS.bold,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    ...FONTS.regular,
  },
  form: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    ...FONTS.regular,
  },
  linkText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
    ...FONTS.semibold,
  },
});

export default RegisterScreen;
