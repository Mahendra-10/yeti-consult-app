import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Card, Avatar, Button, FAB, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/styles/colors';
import { spacing } from '../../src/styles/spacing';
import { typography } from '../../src/styles/typography';
import { Conversation, Message } from '../../src/types/common';

// Mock data for conversations - in a real app, this would come from a service
const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: ['user1', 'user2'],
    lastMessage: {
      id: 'msg1',
      senderId: 'user2',
      receiverId: 'user1',
      content: 'Hey! How are you doing with your studies?',
      type: 'text',
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
      isEdited: false,
    },
    unreadCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    participants: ['user1', 'user3'],
    lastMessage: {
      id: 'msg2',
      senderId: 'user1',
      receiverId: 'user3',
      content: 'Thanks for the study tips!',
      type: 'text',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: true,
      isEdited: false,
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

export default function ChatsScreen() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate loading conversations
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setConversations(mockConversations);
      return;
    }

    const filtered = mockConversations.filter(conv => {
      // In a real app, you'd search through participant names
      return conv.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setConversations(filtered);
  };

  const handleNewMessage = () => {
    router.push('/(modals)/new-message');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderConversation = ({ item: conversation }: { item: Conversation }) => {
    const otherParticipantId = conversation.participants.find(id => id !== user?.uid);
    const otherParticipantName = otherParticipantId === 'user2' ? 'Sarah Johnson' : 'Mike Chen';
    const otherParticipantAvatar = otherParticipantId === 'user2' 
      ? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';

    return (
      <Card
        style={[
          styles.conversationCard,
          conversation.unreadCount > 0 && styles.unreadCard,
        ]}
        onPress={() => router.push(`/chat/${conversation.id}`)}
      >
        <Card.Content style={styles.conversationContent}>
          <Avatar.Image
            size={50}
            source={{ uri: otherParticipantAvatar }}
          />
          <View style={styles.conversationInfo}>
            <View style={styles.conversationHeader}>
              <Text style={styles.participantName}>{otherParticipantName}</Text>
              <Text style={styles.lastMessageTime}>
                {formatTime(conversation.updatedAt)}
              </Text>
            </View>
            <View style={styles.conversationFooter}>
              <Text
                style={[
                  styles.lastMessage,
                  conversation.unreadCount > 0 && styles.unreadMessage,
                ]}
                numberOfLines={1}
              >
                {conversation.lastMessage?.content}
              </Text>
              {conversation.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>
                    {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No conversations yet</Text>
      <Text style={styles.emptySubtext}>
        Start a conversation with fellow students to connect and share experiences
      </Text>
      <Button
        mode="contained"
        onPress={handleNewMessage}
        style={styles.startChatButton}
        theme={{
          colors: {
            primary: colors.primary[600],
          },
        }}
      >
        Start a Chat
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search conversations..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchBar}
          theme={{
            colors: {
              primary: colors.primary[600],
            },
          }}
        />
        <Button
          mode="contained"
          onPress={handleSearch}
          style={styles.searchButton}
          theme={{
            colors: {
              primary: colors.primary[600],
            },
          }}
        >
          Search
        </Button>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleNewMessage}
        theme={{
          colors: {
            primary: colors.primary[600],
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: spacing.layout.screen.padding,
    backgroundColor: colors.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  searchBar: {
    flex: 1,
    marginRight: spacing.sm,
    backgroundColor: colors.background.primary,
  },
  searchButton: {
    alignSelf: 'center',
  },
  listContainer: {
    padding: spacing.layout.screen.padding,
  },
  conversationCard: {
    marginBottom: spacing.sm,
    backgroundColor: colors.surface.primary,
    borderRadius: spacing.borderRadius.lg,
    ...spacing.shadow.sm,
  },
  unreadCard: {
    backgroundColor: colors.primary[50],
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[600],
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  conversationInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  participantName: {
    ...typography.text.body1,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  lastMessageTime: {
    ...typography.text.caption1,
    color: colors.text.tertiary,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    ...typography.text.body2,
    color: colors.text.secondary,
    flex: 1,
  },
  unreadMessage: {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  unreadBadge: {
    backgroundColor: colors.primary[600],
    borderRadius: spacing.borderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  unreadCount: {
    ...typography.text.caption2,
    color: colors.text.inverse,
    fontWeight: typography.fontWeight.bold,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.text.h4,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.text.body2,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  startChatButton: {
    borderRadius: spacing.borderRadius.md,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
  },
}); 