import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONTS } from '../constants';
import { formatTime } from '../utils/formatting';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: Date | string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isUser,
  timestamp,
}) => {
  const { width } = useWindowDimensions();
  const maxWidth = width * 0.85;

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
          { maxWidth },
        ]}
      >
        <Text
          style={[
            styles.message,
            isUser ? styles.userText : styles.assistantText,
          ]}
        >
          {message}
        </Text>
        {timestamp && (
          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.assistantTimestamp,
            ]}
          >
            {formatTime(timestamp)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.medium,
  },
  userBubble: {
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: RADIUS.small,
  },
  assistantBubble: {
    backgroundColor: COLORS.aiBubble,
    borderBottomLeftRadius: RADIUS.small,
  },
  message: {
    fontSize: FONT_SIZES.base,
    lineHeight: FONT_SIZES.base * 1.5,
    ...FONTS.regular,
  },
  userText: {
    color: COLORS.background,
  },
  assistantText: {
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
    ...FONTS.regular,
  },
  userTimestamp: {
    color: COLORS.background,
    opacity: 0.7,
  },
  assistantTimestamp: {
    color: COLORS.textSecondary,
  },
});
