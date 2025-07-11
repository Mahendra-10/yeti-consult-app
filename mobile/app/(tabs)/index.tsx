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
import { Card, Button, Avatar, Chip, FAB } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { PostsService } from '../../src/services/posts';
import { colors } from '../../src/styles/colors';
import { spacing } from '../../src/styles/spacing';
import { typography } from '../../src/styles/typography';
import { Post, ReactionType } from '../../src/types/post';

export default function HomeScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setLastDoc(null);
        setHasMore(true);
      } else if (loadingMore) {
        return;
      } else {
        setLoading(true);
      }

      const result = await PostsService.getFeedPosts(
        user?.uid || '',
        isRefresh ? null : lastDoc
      );

      if (isRefresh) {
        setPosts(result.posts);
      } else {
        setPosts(prev => [...prev, ...result.posts]);
      }

      setLastDoc(result.lastDoc);
      setHasMore(result.lastDoc !== null);
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    loadPosts(true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      loadPosts();
    }
  };

  const handleReaction = async (postId: string, reaction: ReactionType) => {
    try {
      await PostsService.addReaction(postId, reaction, user?.uid || '');
      // Update local state
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                reactions: {
                  ...post.reactions,
                  [reaction]: (post.reactions[reaction] || 0) + 1,
                },
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleCreatePost = () => {
    router.push('/(modals)/create-post');
  };

  const renderPost = ({ item: post }: { item: Post }) => (
    <Card style={styles.postCard}>
      <Card.Content>
        <View style={styles.postHeader}>
          <Avatar.Image
            size={40}
            source={
              post.authorProfilePicture
                ? { uri: post.authorProfilePicture }
                : require('../../assets/images/default-avatar.png')
            }
          />
          <View style={styles.postHeaderInfo}>
            <Text style={styles.authorName}>{post.authorName}</Text>
            <Text style={styles.postTime}>
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <Text style={styles.postContent}>{post.content}</Text>

        {post.images && post.images.length > 0 && (
          <View style={styles.imageContainer}>
            {/* Image gallery would go here */}
            <Text style={styles.imagePlaceholder}>📷 {post.images.length} image(s)</Text>
          </View>
        )}

        {post.tags && post.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {post.tags.map((tag, index) => (
              <Chip key={index} style={styles.tag} textStyle={styles.tagText}>
                #{tag}
              </Chip>
            ))}
          </View>
        )}

        <View style={styles.postStats}>
          <Text style={styles.statsText}>
            {Object.values(post.reactions).reduce((sum, count) => sum + count, 0)} reactions
          </Text>
          <Text style={styles.statsText}>{post.commentCount} comments</Text>
          <Text style={styles.statsText}>{post.shareCount} shares</Text>
        </View>

        <View style={styles.reactionsContainer}>
          {(['❤️', '👍', '😊', '🎉', '🤔', '😢'] as ReactionType[]).map((reaction) => (
            <Button
              key={reaction}
              mode="text"
              onPress={() => handleReaction(post.id, reaction)}
              style={styles.reactionButton}
              labelStyle={styles.reactionLabel}
            >
              {reaction} {post.reactions[reaction] || 0}
            </Button>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <Button
            mode="text"
            onPress={() => router.push(`/post/${post.id}`)}
            style={styles.actionButton}
          >
            💬 Comment
          </Button>
          <Button
            mode="text"
            onPress={() => {
              // Share functionality
              Alert.alert('Share', 'Share functionality coming soon!');
            }}
            style={styles.actionButton}
          >
            📤 Share
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color={colors.primary[600]} />
        <Text style={styles.loadingText}>Loading more posts...</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreatePost}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  listContainer: {
    padding: spacing.layout.screen.padding,
  },
  postCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface.primary,
    borderRadius: spacing.borderRadius.lg,
    ...spacing.shadow.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  postHeaderInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  authorName: {
    ...typography.text.body1,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  postTime: {
    ...typography.text.caption1,
    color: colors.text.tertiary,
  },
  postContent: {
    ...typography.text.body1,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.normal,
    marginBottom: spacing.md,
  },
  imageContainer: {
    marginBottom: spacing.md,
  },
  imagePlaceholder: {
    ...typography.text.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.tertiary,
    borderRadius: spacing.borderRadius.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  tag: {
    margin: spacing.xs,
    backgroundColor: colors.primary[100],
  },
  tagText: {
    ...typography.text.caption1,
    color: colors.primary[700],
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  statsText: {
    ...typography.text.caption1,
    color: colors.text.tertiary,
  },
  reactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  reactionButton: {
    flex: 1,
  },
  reactionLabel: {
    ...typography.text.body2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border.secondary,
    paddingTop: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  loadingText: {
    ...typography.text.body2,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
  },
});
