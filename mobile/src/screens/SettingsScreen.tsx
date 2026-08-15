import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Header, Button } from '../components';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../constants';
import { AppTabParamList, useAuth } from '../navigation/RootNavigator';
import { clearAuthData, getUserData } from '../store/asyncStorage';
import { User } from '../types';

type Props = BottomTabScreenProps<AppTabParamList, 'Settings'>;

const SettingsScreen: React.FC<Props> = () => {
  const { setAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getUserData();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            setLoading(true);
            try {
              await clearAuthData();
              setAuthenticated(false);
            } catch (error) {
              console.error('Error logging out:', error);
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <View style={styles.profileCard}>
              <View style={styles.profileIcon}>
                <Text style={styles.avatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
              </View>
            </View>
          </View>
        )}

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <SettingItem label="App Name" value="AI Assistant" />
          <SettingItem label="AI Model" value="Google Gemini" />
          <SettingItem label="Version" value="1.0.0" />
        </View>

        {/* Application Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Info', 'Check the README for more information.')}
          >
            <Text style={styles.settingLabel}>Help & Support</Text>
            <Text style={styles.settingValue}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              Alert.alert('Privacy', 'Your conversations are stored securely.')
            }
          >
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Text style={styles.settingValue}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Button
            title="Logout"
            onPress={handleLogout}
            loading={loading}
            disabled={loading}
            variant="danger"
            fullWidth
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built with ❤️ for AI enthusiasts
          </Text>
          <Text style={styles.footerText}>© 2024 AI Assistant</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.settingItem}>
    <Text style={styles.settingLabel}>{label}</Text>
    <Text style={styles.settingValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  section: {
    marginVertical: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    ...FONTS.semibold,
    marginBottom: SPACING.md,
    marginLeft: SPACING.sm,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.background,
    ...FONTS.bold,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    ...FONTS.semibold,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    ...FONTS.regular,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  settingLabel: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    ...FONTS.regular,
  },
  settingValue: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    ...FONTS.regular,
  },
  footer: {
    marginVertical: SPACING.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    ...FONTS.regular,
    textAlign: 'center',
    marginVertical: SPACING.xs,
  },
});

export default SettingsScreen;
