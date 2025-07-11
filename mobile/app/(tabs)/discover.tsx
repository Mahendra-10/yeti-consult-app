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
import { Card, Button, Avatar, Chip, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { AuthService } from '../../src/services/auth';
import { colors } from '../../src/styles/colors';
import { spacing } from '../../src/styles/spacing';
import { typography } from '../../src/styles/typography';
import { User } from '../../src/types/user';

export default function DiscoverScreen() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const fetchedUsers = await AuthService.searchUsers('', user?.uid || '');
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadUsers(true);
      return;
    }

    try {
      setSearching(true);
      const searchResults = await AuthService.searchUsers(searchQuery, user?.uid || '');
      setUsers(searchResults);
    } catch (error) {
      console.error('Error searching users:', error);
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleRefresh = () => {
    loadUsers(true);
  };

  const handleConnect = (targetUser: User) => {
    Alert.alert(
      'Connect',
      `Would you like to connect with ${targetUser.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Connect', onPress: () => connectWithUser(targetUser) },
      ]
    );
  };

  const connectWithUser = async (targetUser: User) => {
    try {
      // This would typically call a matching service
      Alert.alert('Success', `Connection request sent to ${targetUser.name}!`);
    } catch (error) {
      console.error('Error connecting with user:', error);
      Alert.alert('Error', 'Failed to send connection request');
    }
  };

  const calculateMatchScore = (targetUser: User): number => {
    if (!user) return 0;

    let score = 0;
    const sharedInterests = user.interests.filter(interest =>
      targetUser.interests.includes(interest)
    );
    const sharedGoals = user.goals.filter(goal =>
      targetUser.goals.includes(goal)
    );

    // Same destination country
    if (user.destinationCountry === targetUser.destinationCountry) {
      score += 30;
    }

    // Same destination state/city
    if (user.destinationState === targetUser.destinationState) {
      score += 20;
    }
    if (user.destinationCity === targetUser.destinationCity) {
      score += 15;
    }

    // Same university
    if (user.university === targetUser.university) {
      score += 25;
    }

    // Same study field
    if (user.studyField === targetUser.studyField) {
      score += 20;
    }

    // Shared interests
    score += sharedInterests.length * 5;

    // Shared goals
    score += sharedGoals.length * 5;

    return Math.min(score, 100);
  };

  const renderUser = ({ item: targetUser }: { item: User }) => {
    const matchScore = calculateMatchScore(targetUser);
    const sharedInterests = user?.interests.filter(interest =>
      targetUser.interests.includes(interest)
    ) || [];

    return (
      <Card style={styles.userCard}>
        <Card.Content>
          <View style={styles.userHeader}>
            <Avatar.Image
              size={60}
              source={
                targetUser.profilePicture
                  ? { uri: targetUser.profilePicture }
                  : require('../../assets/images/default-avatar.png')
              }
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{targetUser.name}</Text>
              <Text style={styles.userLocation}>
                {targetUser.destinationCity && `${targetUser.destinationCity}, `}
                {targetUser.destinationCountry}
              </Text>
              {targetUser.university && (
                <Text style={styles.userUniversity}>{targetUser.university}</Text>
              )}
              {targetUser.studyField && (
                <Text style={styles.userField}>{targetUser.studyField}</Text>
              )}
            </View>
            <View style={styles.matchScore}>
              <Text style={styles.matchScoreText}>{matchScore}%</Text>
              <Text style={styles.matchLabel}>Match</Text>
            </View>
          </View>

          {targetUser.bio && (
            <Text style={styles.userBio} numberOfLines={2}>
              {targetUser.bio}
            </Text>
          )}

          {sharedInterests.length > 0 && (
            <View style={styles.interestsContainer}>
              <Text style={styles.interestsTitle}>Shared Interests:</Text>
              <View style={styles.chipContainer}>
                {sharedInterests.slice(0, 3).map((interest, index) => (
                  <Chip key={index} style={styles.interestChip} textStyle={styles.chipText}>
                    {interest}
                  </Chip>
                ))}
                {sharedInterests.length > 3 && (
                  <Text style={styles.moreInterests}>+{sharedInterests.length - 3} more</Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => handleConnect(targetUser)}
              style={styles.connectButton}
              theme={{
                colors: {
                  primary: colors.primary[600],
                },
              }}
            >
              Connect
            </Button>
            <Button
              mode="outlined"
              onPress={() => router.push(`/user/${targetUser.uid}`)}
              style={styles.viewButton}
              theme={{
                colors: {
                  primary: colors.primary[600],
                  outline: colors.primary[600],
                },
              }}
            >
              View Profile
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by name, university, or field..."
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

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search criteria
            </Text>
          </View>
        }
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
  listContainer: {
    padding: spacing.layout.screen.padding,
  },
  userCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface.primary,
    borderRadius: spacing.borderRadius.lg,
    ...spacing.shadow.sm,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    ...typography.text.h5,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userLocation: {
    ...typography.text.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  userUniversity: {
    ...typography.text.body2,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
  },
  userField: {
    ...typography.text.body2,
    color: colors.text.secondary,
  },
  matchScore: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    padding: spacing.sm,
    borderRadius: spacing.borderRadius.md,
  },
  matchScoreText: {
    ...typography.text.h4,
    color: colors.primary[700],
    fontWeight: typography.fontWeight.bold,
  },
  matchLabel: {
    ...typography.text.caption1,
    color: colors.primary[600],
  },
  userBio: {
    ...typography.text.body2,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  interestsContainer: {
    marginBottom: spacing.md,
  },
  interestsTitle: {
    ...typography.text.body2,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  interestChip: {
    margin: spacing.xs,
    backgroundColor: colors.primary[100],
  },
  chipText: {
    ...typography.text.caption1,
    color: colors.primary[700],
  },
  moreInterests: {
    ...typography.text.caption1,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  connectButton: {
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
}); 