import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONTS } from '../constants';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  isDismissible?: boolean;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  isDismissible = true,
  onDismiss,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <View style={styles.actions}>
        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            style={[styles.button, styles.retryButton]}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
        {isDismissible && onDismiss && (
          <TouchableOpacity
            onPress={onDismiss}
            style={[styles.button, styles.dismissButton]}
          >
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.medium,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.md,
  },
  content: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: FONT_SIZES.lg,
  },
  message: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.background,
    ...FONTS.regular,
    lineHeight: FONT_SIZES.sm * 1.5,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'flex-end',
  },
  button: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.small,
  },
  retryButton: {
    backgroundColor: COLORS.background,
  },
  retryText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    ...FONTS.semibold,
  },
  dismissButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dismissText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.sm,
    ...FONTS.semibold,
  },
});
