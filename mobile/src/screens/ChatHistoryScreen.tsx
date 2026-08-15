import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Header, ConversationCard, ErrorMessage } from '../components';
import { Button } from '../components/Button';
import { COLORS, SPACING, MESSAGES } from '../constants';
import { AppTabParamList } from '../navigation/RootNavigator';
import { conversationService } from '../services/conversationService';
import { Conversation } from '../types';

type Props = BottomTabScreenProps<AppTabParamList, 'ChatHistory'>;

const ChatHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await conversationService.getConversations(1, 50);
      setConversations(response.conversations);
    } catch (err: any) {
      console.error('Error loading conversations:', err);
      setError(err.message || MESSAGES.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await conversationService.deleteConversation(conversationId);
      setConversations((prev) =>
        prev.filter((conv) => conv._id !== conversationId)
      );
    } catch (err: any) {
      console.error('Error deleting conversation:', err);
      setError(err.message || 'Failed to delete conversation');
    }
  };

  const handleOpenConversation = (conversationId: string) => {
    navigation.navigate('Chat', { conversationId });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyText}>{MESSAGES.empty.noConversations}</Text>
      <Button
        title="Start New Chat"
        onPress={() => navigation.navigate('Chat')}
        fullWidth
      />
    </View>
  );

  const renderItem = ({ item }: { item: Conversation }) => (
    <ConversationCard
      conversation={item}
      onPress={() => handleOpenConversation(item._id)}
      onDelete={() => handleDeleteConversation(item._id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Chat History"
        rightActionLabel="🔄"
        rightAction={loadConversations}
      />

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadConversations}
          onDismiss={() => setError(null)}
        />
      )}

      {loading && conversations.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={!loading ? renderEmptyState() : null}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
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
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
});

export default ChatHistoryScreen;
