import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AuthProvider } from '../src/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '../src/styles/colors';
import { OfflineIndicator } from '../src/components/OfflineIndicator';
import { checkNetworkStatus } from '../src/services/firebase';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const checkNetwork = async () => {
      const isOnline = await checkNetworkStatus();
      setIsOffline(!isOnline);
    };

    checkNetwork();
    // Check network status every 30 seconds
    const interval = setInterval(checkNetwork, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <AuthProvider>
            <OfflineIndicator isVisible={isOffline} />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background.primary },
              }}
            >
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
            <StatusBar style="auto" />
          </AuthProvider>
        </PaperProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
