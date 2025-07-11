import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { AuthService } from './auth';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  // Request permissions
  static async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  // Get Expo push token
  static async getExpoPushToken(): Promise<string | null> {
    try {
      // Skip push notifications in Expo Go
      if (__DEV__) {
        console.log('Push notifications disabled in development mode');
        return null;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });

      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Register for push notifications
  static async registerForPushNotifications(): Promise<string | null> {
    try {
      // Skip push notifications in Expo Go
      if (__DEV__) {
        console.log('Push notifications disabled in development mode');
        return null;
      }

      const token = await this.getExpoPushToken();
      
      if (token) {
        // Update user's push token in Firestore
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          await AuthService.updatePushToken(currentUser.uid, token);
        }
      }

      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  // Schedule local notification
  static async scheduleLocalNotification(
    title: string,
    body: string,
    data?: Record<string, any>,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: trigger || null,
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling local notification:', error);
      throw new Error('Failed to schedule notification');
    }
  }

  // Cancel notification
  static async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  // Cancel all notifications
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  // Get notification settings
  static async getNotificationSettings(): Promise<Notifications.NotificationPermissionsStatus> {
    try {
      return await Notifications.getPermissionsAsync();
    } catch (error) {
      console.error('Error getting notification settings:', error);
      throw new Error('Failed to get notification settings');
    }
  }

  // Add notification listener
  static addNotificationListener(
    callback: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Add notification response listener
  static addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Remove notification listener
  static removeNotificationListener(subscription: Notifications.Subscription): void {
    subscription.remove();
  }

  // Send test notification
  static async sendTestNotification(): Promise<void> {
    try {
      await this.scheduleLocalNotification(
        'Test Notification',
        'This is a test notification from Yeti-Consult!',
        { type: 'test' }
      );
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }

  // Handle notification response
  static handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data;
    
    // Handle different notification types
    switch (data?.type) {
      case 'match':
        // Navigate to match screen
        break;
      case 'group':
        // Navigate to group screen
        break;
      case 'post':
        // Navigate to post screen
        break;
      case 'message':
        // Navigate to chat screen
        break;
      default:
        // Default handling
        break;
    }
  }

  // Check if notifications are enabled
  static async areNotificationsEnabled(): Promise<boolean> {
    try {
      const settings = await this.getNotificationSettings();
      return settings.status === 'granted';
    } catch (error) {
      return false;
    }
  }

  // Request notification permissions with explanation
  static async requestPermissionsWithExplanation(): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      
      if (!hasPermission) {
        // Show explanation dialog
        // You can implement a custom dialog here
        console.log('Please enable notifications in your device settings');
      }
      
      return hasPermission;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }
} 