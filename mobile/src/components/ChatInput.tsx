import React, { useState, useRef } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Text,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
  onNewChat?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  onNewChat,
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const textInputRef = useRef<RNTextInput>(null);

  const handleSend = async () => {
    if (!message.trim() || disabled || sending) {
      return;
    }

    setSending(true);
    try {
      await onSendMessage(message);
      setMessage('');
      textInputRef.current?.clear();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const canSend = message.trim().length > 0 && !disabled && !sending;

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <RNTextInput
          ref={textInputRef}
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor={COLORS.textSecondary}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={1000}
          editable={!disabled && !sending}
          scrollEnabled
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!canSend}
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          activeOpacity={0.7}
        >
          {sending ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
      {onNewChat && (
        <TouchableOpacity
          onPress={onNewChat}
          disabled={disabled || sending}
          style={styles.newChatButton}
          activeOpacity={0.7}
        >
          <Text style={styles.newChatText}>+ New Chat</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? SPACING.lg : SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.md,
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.medium,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.small,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.5,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
  newChatButton: {
    alignSelf: 'center',
    paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
  },
  newChatText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
});
