import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONTS, FONT_SIZES } from '../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
}) => {
  const variantStyles = {
    primary: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    secondary: {
      backgroundColor: COLORS.cardBg,
      borderColor: COLORS.border,
    },
    danger: {
      backgroundColor: COLORS.error,
      borderColor: COLORS.error,
    },
  };

  const sizeStyles = {
    small: {
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
    },
    medium: {
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
    },
    large: {
      paddingVertical: SPACING.lg,
      paddingHorizontal: SPACING.xl,
    },
  };

  const fontSizeBySize = {
    small: FONT_SIZES.sm,
    medium: FONT_SIZES.base,
    large: FONT_SIZES.lg,
  };

  const textColor = variant === 'secondary' ? COLORS.textPrimary : 'white';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: fontSizeBySize[size],
            },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.medium,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    ...FONTS.semibold,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
