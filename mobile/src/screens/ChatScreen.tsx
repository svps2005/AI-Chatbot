import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Header, ChatBubble, LoadingIndicator, ErrorMessage } from '../components';
import { ChatInput } from '../components/ChatInput';
import { COLORS, SPACING, AI_SUGGESTED_PROMPTS } from '../constants';
import { AppTabParamList } from '../navigation/RootNavigator';
import { chatService } from '../services/chatService';
import { conversationService } from '../services/conversationService';
import { Message } from '../types';
import { saveLastConversationId, getLastConversationId } from '../store/asyncStorage';

type Props = BottomTabScreenProps<AppTabParamList, 'Chat'>;

const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Initialize conversation
  useEffect(() => {
    initializeConversation(route.params?.conversationId);
  }, [route.params?.conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const initializeConversation = async (requestedConversationId?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Try to get last conversation
      const lastConvId = requestedConversationId || await getLastConversationId();

      if (lastConvId) {
        try {
          const conversation = await conversationService.getConversation(lastConvId);
          setConversationId(lastConvId);
          setMessages(
            conversation.messages?.map((msg) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })) || []
          );
        } catch (err) {
          // Conversation not found, create new
          await createNewConversation();
        }
      } else {
        // Create new conversation
        await createNewConversation();
      }
    } catch (err: any) {
      console.error('Error initializing conversation:', err);
      setError('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await conversationService.createConversation();
      setConversationId(response.conversationId);
      await saveLastConversationId(response.conversationId);
      setMessages([]);
      setError(null);
    } catch (err: any) {
      console.error('Error creating conversation:', err);
      setError('Failed to create conversation');
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!conversationId || !message.trim()) {
      return;
    }

    setSending(true);
    setError(null);

    try {
      const response = await chatService.sendMessage({
        message: message.trim(),
        conversationId,
      });

      // Add messages to state
      setMessages((prev) => [
        ...prev,
        {
          ...response.userMessage,
          timestamp: new Date(response.userMessage.timestamp),
        },
        {
          ...response.assistantMessage,
          timestamp: new Date(response.assistantMessage.timestamp),
        },
      ]);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleRetry = async () => {
    if (conversationId) {
      await initializeConversation();
    }
  };

  const handleNewChat = async () => {
    await createNewConversation();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💬</Text>
      <Text style={styles.emptyTitle}>How can I help you?</Text>
      <View style={styles.suggestionsContainer}>
        {AI_SUGGESTED_PROMPTS.map((prompt, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionButton}
            onPress={() => handleSendMessage(prompt)}
            disabled={sending}
          >
            <Text style={styles.suggestionText}>{prompt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Message }) => (
    <ChatBubble
      message={item.content}
      isUser={item.role === 'user'}
      timestamp={item.timestamp}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="AI Assistant"
        subtitle="Online"
        rightActionLabel="⚙️"
        rightAction={() => navigation.navigate('Settings' as any)}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {error && (
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
            onDismiss={() => setError(null)}
          />
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.messagesList}
            ListEmptyComponent={renderEmptyState()}
            scrollEnabled={messages.length > 0}
          />
        )}

        {sending && <LoadingIndicator message="AI is thinking" />}

        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={sending || loading}
          onNewChat={handleNewChat}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

import { Text, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingVertical: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 24,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.xl,
  },
  suggestionsContainer: {
    width: '100%',
    gap: SPACING.md,
  },
  suggestionButton: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  suggestionText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ChatScreen;
