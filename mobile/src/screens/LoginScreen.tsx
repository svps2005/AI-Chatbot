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
import { getEmailErrorMessage, getPasswordErrorMessage } from '../utils/validation';

type Props = StackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { setAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    let isValid = true;

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

    return isValid;
  };

  const handleLogin = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        email: email.trim(),
        password,
      });

      // Save auth data
      await saveAuthToken(response.token);
      await saveUserData(response.user);

      setAuthenticated(true);
    } catch (err: any) {
      console.error('Login error:', err);
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Login to continue chatting with AI
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
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            error={passwordError || undefined}
            secureTextEntry
            editable={!loading}
          />

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            fullWidth
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            disabled={loading}
          >
            <Text style={styles.linkText}>Sign Up</Text>
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
    marginBottom: SPACING.xxl,
    marginTop: SPACING.xl,
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

export default LoginScreen;
