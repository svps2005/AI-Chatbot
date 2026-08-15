import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Button } from '../components/Button';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../constants';
import { AuthStackParamList } from '../navigation/RootNavigator';

type Props = StackScreenProps<AuthStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo/Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🤖</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>AI Assistant</Text>

          {/* Tagline */}
          <Text style={styles.tagline}>
            Your Intelligent Companion
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            Chat with advanced AI to get answers, brainstorm ideas, and explore endless possibilities.
          </Text>

          {/* Features */}
          <View style={styles.features}>
            <FeatureItem icon="⚡" title="Fast & Responsive" />
            <FeatureItem icon="🔒" title="Secure & Private" />
            <FeatureItem icon="💾" title="Save Conversations" />
          </View>

          {/* CTA Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Start Chatting"
              onPress={() => navigation.navigate('Login')}
              fullWidth
            />
            <Button
              title="Create Account"
              onPress={() => navigation.navigate('Register')}
              variant="secondary"
              fullWidth
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const FeatureItem: React.FC<{ icon: string; title: string }> = ({
  icon,
  title,
}) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    color: COLORS.textPrimary,
    ...FONTS.bold,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  tagline: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.primary,
    ...FONTS.semibold,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    ...FONTS.regular,
    textAlign: 'center',
    lineHeight: FONT_SIZES.base * 1.6,
    marginBottom: SPACING.xxl,
  },
  features: {
    marginVertical: SPACING.xl,
    gap: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: FONT_SIZES.xl,
  },
  featureTitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    ...FONTS.semibold,
  },
  buttonContainer: {
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
});

export default WelcomeScreen;
