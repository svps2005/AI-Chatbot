import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../constants';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: () => void;
  leftActionLabel?: string;
  rightAction?: () => void;
  rightActionLabel?: string;
  centerIcon?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftAction,
  leftActionLabel = '←',
  rightAction,
  rightActionLabel = '⋮',
  centerIcon,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {leftAction ? (
            <TouchableOpacity onPress={leftAction} style={styles.actionButton}>
              <Text style={styles.actionText}>{leftActionLabel}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.actionButton} />
          )}
        </View>

        <View style={styles.centerSection}>
          {centerIcon}
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.rightSection}>
          {rightAction ? (
            <TouchableOpacity onPress={rightAction} style={styles.actionButton}>
              <Text style={styles.actionText}>{rightActionLabel}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.actionButton} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  leftSection: {
    flex: 0.15,
  },
  centerSection: {
    flex: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  rightSection: {
    flex: 0.15,
    alignItems: 'flex-end',
  },
  actionButton: {
    padding: SPACING.sm,
  },
  actionText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.primary,
    ...FONTS.semibold,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    ...FONTS.semibold,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    ...FONTS.regular,
    marginTop: SPACING.xs,
  },
});
