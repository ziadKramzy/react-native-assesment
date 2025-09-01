import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationData {
  message: string;
  type: NotificationType;
}

// Initialize notifications (request permissions)
export async function initializeNotifications(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return true; // Web doesn't need permission for our in-app notifications
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Failed to initialize notifications:', error);
    return false;
  }
}

// Send local notification with haptic feedback (for mobile)
export async function sendLocalNotification(
  title: string, 
  body: string, 
  type: NotificationType = 'info'
): Promise<void> {
  // Add haptic feedback based on notification type
  if (Platform.OS !== 'web') {
    try {
      switch (type) {
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'info':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
      }
    } catch (error) {
      console.warn('Failed to trigger haptic feedback:', error);
    }

    // Send system notification
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: { type },
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.warn('Failed to send notification:', error);
    }
  }
}

// Helper to get emoji for notification type
export function getNotificationEmoji(type: NotificationType): string {
  switch (type) {
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    case 'info':
      return 'ℹ️';
    case 'warning':
      return '⚠️';
    default:
      return 'ℹ️';
  }
}

// Helper to get notification title based on type
export function getNotificationTitle(type: NotificationType): string {
  switch (type) {
    case 'success':
      return 'Task Completed';
    case 'error':
      return 'Error';
    case 'info':
      return 'Task Updated';
    case 'warning':
      return 'Task Deleted';
    default:
      return 'Notification';
  }
}