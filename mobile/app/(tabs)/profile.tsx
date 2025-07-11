import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Card, Button, Avatar, List, Divider, Switch } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/styles/colors';
import { spacing } from '../../src/styles/spacing';
import { typography } from '../../src/styles/typography';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/(modals)/edit-profile');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleHelp = () => {
    router.push('/help');
  };

  const handleAbout = () => {
    router.push('/about');
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <View style={styles.profileHeader}>
            <Avatar.Image
              size={80}
              source={
                user.profilePicture
                  ? { uri: user.profilePicture }
                  : require('../../assets/images/default-avatar.png')
              }
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userLocation}>
                {user.currentLocation} → {user.destinationCountry}
              </Text>
              {user.university && (
                <Text style={styles.userUniversity}>{user.university}</Text>
              )}
              {user.studyField && (
                <Text style={styles.userField}>{user.studyField}</Text>
              )}
            </View>
          </View>

          <Button
            mode="outlined"
            onPress={handleEditProfile}
            style={styles.editButton}
            theme={{
              colors: {
                primary: colors.primary[600],
                outline: colors.primary[600],
              },
            }}
          >
            Edit Profile
          </Button>
        </Card.Content>
      </Card>

      {/* Quick Stats */}
      <Card style={styles.statsCard}>
        <Card.Content style={styles.statsContent}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Bio Section */}
      {user.bio && (
        <Card style={styles.bioCard}>
          <Card.Content>
            <Text style={styles.bioTitle}>About</Text>
            <Text style={styles.bioText}>{user.bio}</Text>
          </Card.Content>
        </Card>
      )}

      {/* Interests Section */}
      {user.interests && user.interests.length > 0 && (
        <Card style={styles.interestsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {user.interests.map((interest, index) => (
                <View key={index} style={styles.interestChip}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Settings Section */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <List.Item
            title="Notifications"
            description="Manage push notifications"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={colors.primary[600]}
              />
            )}
            onPress={() => router.push('/notification-settings')}
          />
          
          <Divider />
          
          <List.Item
            title="Dark Mode"
            description="Switch between light and dark themes"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                color={colors.primary[600]}
              />
            )}
            onPress={() => setDarkModeEnabled(!darkModeEnabled)}
          />
          
          <Divider />
          
          <List.Item
            title="Privacy Settings"
            description="Manage your privacy and security"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            onPress={() => router.push('/privacy-settings')}
          />
          
          <Divider />
          
          <List.Item
            title="Account Settings"
            description="Manage your account information"
            left={(props) => <List.Icon {...props} icon="account-cog" />}
            onPress={handleSettings}
          />
        </Card.Content>
      </Card>

      {/* Support Section */}
      <Card style={styles.supportCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <List.Item
            title="Help & FAQ"
            description="Get help and find answers"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            onPress={handleHelp}
          />
          
          <Divider />
          
          <List.Item
            title="About Yeti-Consult"
            description="Learn more about the app"
            left={(props) => <List.Icon {...props} icon="information" />}
            onPress={handleAbout}
          />
          
          <Divider />
          
          <List.Item
            title="Contact Support"
            description="Get in touch with our team"
            left={(props) => <List.Icon {...props} icon="message" />}
            onPress={() => router.push('/contact-support')}
          />
        </Card.Content>
      </Card>

      {/* Sign Out Button */}
      <Button
        mode="outlined"
        onPress={handleSignOut}
        style={styles.signOutButton}
        textColor={colors.error[500]}
        theme={{
          colors: {
            outline: colors.error[500],
          },
        }}
      >
        Sign Out
      </Button>

      {/* App Version */}
      <Text style={styles.versionText}>Yeti-Consult v1.0.0</Text>
    </ScrollView>
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
  loadingText: {
    ...typography.text.body1,
    color: colors.text.secondary,
  },
  profileCard: {
    margin: spacing.layout.screen.padding,
    backgroundColor: colors.surface.primary,
    borderRadius: spacing.borderRadius.lg,
    ...spacing.shadow.md,
  },
  profileContent: {
    padding: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    ...typography.text.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.text.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  userLocation: {
    ...typography.text.body2,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
  },
  userUniversity: {
    ...typography.text.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  userField: {
    ...typography.text.body2,
    color: colors.text.secondary,
  },
  editButton: {
    borderRadius: spacing.borderRadius.md,
  },
  statsCard: {
    margin: spacing.layout.screen.padding,
    marginTop: 0,
    backgroundColor: colors.surface.primary,
    borderRadius: spacing.borderRadius.lg,
    ...spacing.shadow.sm,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.text.h3,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.bold,
  },
  statLabel: {
    ...typography.text.caption1,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.primary,
  },
  bioCard: {
    margin: spacing.layout.screen.padding,
    marginTop: 0,
    backgroundColor: colors.surface.primary,
    borderRadius: spacing.borderRadius.lg,
    ...spacing.shadow.sm,
  },
  bioTitle: {
    ...typography.text.h5,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  bioText: {
    ...typography.text.body2,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.normal,
  },
  interestsCard: {
    margin: spacing.layout.screen.padding,
    marginTop: 0,
    backgroundColor: colors.surface.primary,
    borderRadius: spacing.borderRadius.lg,
    ...spacing.shadow.sm,
  },
  sectionTitle: {
    ...typography.text.h5,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestChip: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.full,
    margin: spacing.xs,
  },
  interestText: {
    ...typography.text.caption1,
    color: colors.primary[700],
  },
  settingsCard: {
    margin: spacing.layout.screen.padding,
    marginTop: 0,
    backgroundColor: colors.surface.primary,
    borderRadius: spacing.borderRadius.lg,
    ...spacing.shadow.sm,
  },
  supportCard: {
    margin: spacing.layout.screen.padding,
    marginTop: 0,
    backgroundColor: colors.surface.primary,
    borderRadius: spacing.borderRadius.lg,
    ...spacing.shadow.sm,
  },
  signOutButton: {
    margin: spacing.layout.screen.padding,
    marginTop: spacing.md,
    borderRadius: spacing.borderRadius.md,
  },
  versionText: {
    ...typography.text.caption1,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
}); 