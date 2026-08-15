import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../constants';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Loading...',
  size = 'medium',
}) => {
  const [dots, setDots] = useState('.');
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate dots
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  const sizeStyles = {
    small: {
      size: 12,
    },
    medium: {
      size: 16,
    },
    large: {
      size: 20,
    },
  };

  const dotSize = sizeStyles[size].size;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Animated dots */}
        <Animated.View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              opacity: scaleAnim,
            },
          ]}
        />
        <Text style={styles.message}>
          {message}
          {dots}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  dot: {
    backgroundColor: COLORS.primary,
  },
  message: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    ...FONTS.regular,
  },
});
