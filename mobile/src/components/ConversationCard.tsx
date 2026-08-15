import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONTS } from '../constants';
import { formatTime, formatConversationTitle } from '../utils/formatting';
import { Conversation } from '../types';

interface ConversationCardProps {
  conversation: Conversation;
  onPress: () => void;
  onDelete?: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  onPress,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {formatConversationTitle(conversation.title, 50)}
        </Text>
        <View style={styles.metadata}>
          <Text style={styles.time}>
            {formatTime(conversation.updatedAt)}
          </Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.count}>
            {conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          style={styles.deleteButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.medium,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
  },
  content: {
    flex: 1,
    gap: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    ...FONTS.semibold,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  time: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    ...FONTS.regular,
  },
  separator: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  count: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    ...FONTS.regular,
  },
  deleteButton: {
    padding: SPACING.md,
  },
  deleteText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.error,
  },
});
