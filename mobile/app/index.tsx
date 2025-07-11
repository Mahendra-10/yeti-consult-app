import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { colors } from '../src/styles/colors';
import { spacing } from '../src/styles/spacing';
import { typography } from '../src/styles/typography';

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, go to main app
        router.replace('/(tabs)');
      } else {
        // User is not authenticated, go to auth
        router.replace('/(auth)/login');
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.primary,
      }}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={{
          ...typography.text.body1,
          color: colors.text.secondary,
          marginTop: spacing.md,
        }}>
          Loading Yeti-Consult...
        </Text>
      </View>
    );
  }

  return null;
} 