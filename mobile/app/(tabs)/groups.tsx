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
import { Card, Button, Avatar, Chip, FAB, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { GroupsService } from '../../src/services/groups';
import { colors } from '../../src/styles/colors';
import { spacing } from '../../src/styles/spacing';
import { typography } from '../../src/styles/typography';
import { Group } from '../../src/types/group';

export default function GroupsScreen() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'my-groups'>('discover');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [allGroups, userGroups] = await Promise.all([
        GroupsService.getGroups(),
        user ? GroupsService.getUserGroups(user.uid) : Promise.resolve([]),
      ]);

      setGroups(allGroups.groups);
      setMyGroups(userGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
      Alert.alert('Error', 'Failed to load groups');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadGroups(true);
      return;
    }

    try {
      setSearching(true);
      const searchResults = await GroupsService.searchGroups(searchQuery);
      setGroups(searchResults);
    } catch (error) {
      console.error('Error searching groups:', error);
      Alert.alert('Error', 'Failed to search groups');
    } finally {
      setSearching(false);
    }
  };

  const handleRefresh = () => {
    loadGroups(true);
  };

  const handleJoinGroup = async (group: Group) => {
    if (!user) return;

    try {
      await GroupsService.joinGroup(group.id, user);
      Alert.alert('Success', `Joined ${group.name}!`);
      loadGroups(true); // Refresh to update the list
    } catch (error) {
      console.error('Error joining group:', error);
      Alert.alert('Error', 'Failed to join group');
    }
  };

  const handleLeaveGroup = async (group: Group) => {
    if (!user) return;

    Alert.alert(
      'Leave Group',
      `Are you sure you want to leave ${group.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await GroupsService.leaveGroup(group.id, user.uid);
              Alert.alert('Success', `Left ${group.name}`);
              loadGroups(true); // Refresh to update the list
            } catch (error) {
              console.error('Error leaving group:', error);
              Alert.alert('Error', 'Failed to leave group');
            }
          },
        },
      ]
    );
  };

  const handleCreateGroup = () => {
    router.push('/(modals)/create-group');
  };

  const renderGroup = ({ item: group }: { item: Group }) => {
    const isMember = user ? group.memberIds.includes(user.uid) : false;
    const isCreator = user ? group.creatorId === user.uid : false;

    return (
      <Card style={styles.groupCard}>
        <Card.Content>
          <View style={styles.groupHeader}>
            <Avatar.Image
              size={50}
              source={
                group.coverImage
                  ? { uri: group.coverImage }
                  : require('../../assets/images/default-group.png')
              }
            />
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupLocation}>
                {group.location || 'Online'}
              </Text>
              <Text style={styles.groupMembers}>
                {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.groupCategory}>
              <Chip style={styles.categoryChip} textStyle={styles.categoryText}>
                {group.category.replace('-', ' ')}
              </Chip>
            </View>
          </View>

          <Text style={styles.groupDescription} numberOfLines={2}>
            {group.description}
          </Text>

          {group.tags && group.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {group.tags.slice(0, 3).map((tag, index) => (
                <Chip key={index} style={styles.tag} textStyle={styles.tagText}>
                  #{tag}
                </Chip>
              ))}
              {group.tags.length > 3 && (
                <Text style={styles.moreTags}>+{group.tags.length - 3} more</Text>
              )}
            </View>
          )}

          <View style={styles.actionButtons}>
            {isCreator ? (
              <Button
                mode="contained"
                onPress={() => router.push(`/group/${group.id}`)}
                style={styles.manageButton}
                theme={{
                  colors: {
                    primary: colors.primary[600],
                  },
                }}
              >
                Manage Group
              </Button>
            ) : isMember ? (
              <Button
                mode="outlined"
                onPress={() => handleLeaveGroup(group)}
                style={styles.leaveButton}
                theme={{
                  colors: {
                    primary: colors.error[500],
                    outline: colors.error[500],
                  },
                }}
              >
                Leave Group
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={() => handleJoinGroup(group)}
                style={styles.joinButton}
                theme={{
                  colors: {
                    primary: colors.primary[600],
                  },
                }}
              >
                Join Group
              </Button>
            )}

            <Button
              mode="outlined"
              onPress={() => router.push(`/group/${group.id}`)}
              style={styles.viewButton}
              theme={{
                colors: {
                  primary: colors.primary[600],
                  outline: colors.primary[600],
                },
              }}
            >
              View Group
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderFooter = () => {
    if (searching) {
      return (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }
    return null;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {activeTab === 'discover' ? 'No groups found' : 'You haven\'t joined any groups yet'}
      </Text>
      <Text style={styles.emptySubtext}>
        {activeTab === 'discover' 
          ? 'Try adjusting your search criteria' 
          : 'Discover and join groups to connect with fellow students'
        }
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={styles.loadingText}>Loading groups...</Text>
      </View>
    );
  }

  const currentGroups = activeTab === 'discover' ? groups : myGroups;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search groups..."
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
          loading={searching}
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

      <View style={styles.tabContainer}>
        <Button
          mode={activeTab === 'discover' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('discover')}
          style={styles.tabButton}
          theme={{
            colors: {
              primary: colors.primary[600],
            },
          }}
        >
          Discover
        </Button>
        <Button
          mode={activeTab === 'my-groups' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('my-groups')}
          style={styles.tabButton}
          theme={{
            colors: {
              primary: colors.primary[600],
            },
          }}
        >
          My Groups ({myGroups.length})
        </Button>
      </View>

      <FlatList
        data={currentGroups}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateGroup}
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
  tabContainer: {
    flexDirection: 'row',
    padding: spacing.layout.screen.padding,
    backgroundColor: colors.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  listContainer: {
    padding: spacing.layout.screen.padding,
  },
  groupCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface.primary,
    borderRadius: spacing.borderRadius.lg,
    ...spacing.shadow.sm,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  groupInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  groupName: {
    ...typography.text.h5,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  groupLocation: {
    ...typography.text.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  groupMembers: {
    ...typography.text.caption1,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
  },
  groupCategory: {
    alignItems: 'flex-end',
  },
  categoryChip: {
    backgroundColor: colors.primary[100],
  },
  categoryText: {
    ...typography.text.caption1,
    color: colors.primary[700],
  },
  groupDescription: {
    ...typography.text.body2,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
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
  moreTags: {
    ...typography.text.caption1,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  joinButton: {
    flex: 1,
    marginRight: spacing.sm,
    borderRadius: spacing.borderRadius.md,
  },
  leaveButton: {
    flex: 1,
    marginRight: spacing.sm,
    borderRadius: spacing.borderRadius.md,
  },
  manageButton: {
    flex: 1,
    marginRight: spacing.sm,
    borderRadius: spacing.borderRadius.md,
  },
  viewButton: {
    flex: 1,
    marginLeft: spacing.sm,
    borderRadius: spacing.borderRadius.md,
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
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xl,
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
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
  },
}); 