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

// Cache permission status to avoid repeated requests
let permissionStatus: boolean | null = null;

// Initialize notifications (request permissions)
export async function initializeNotifications(): Promise<boolean> {
  if (Platform.OS === 'web') {
    permissionStatus = true;
    return true; // Web doesn't need permission for our in-app notifications
  }

  // Return cached status if already checked
  if (permissionStatus !== null) {
    return permissionStatus;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    permissionStatus = finalStatus === 'granted';
    return permissionStatus;
  } catch (error) {
    console.warn('Failed to initialize notifications:', error);
    permissionStatus = false;
    return false;
  }
}

// Send local notification with haptic feedback (for mobile)
export async function sendLocalNotification(
  title: string, 
  body: string, 
  type: NotificationType = 'info'
): Promise<void> {
  if (Platform.OS === 'web') {
    return; // Early return for web
  }

  // Add haptic feedback based on notification type
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
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }
  } catch (error) {
    console.warn('Failed to trigger haptic feedback:', error);
  }

  // Send system notification only if permissions are granted
  if (permissionStatus === true) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: { type },
          ...(type === 'error' ? { color: 'red' } : {}), // 🔴 Red for delete/error
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
  const emojiMap: Record<NotificationType, string> = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };
  
  return emojiMap[type] ?? 'ℹ️';
}

// Helper to get notification title based on type
export function getNotificationTitle(type: NotificationType): string {
  const titleMap: Record<NotificationType, string> = {
    success: 'Task Completed',
    error: '❌ Task Deleted', // 🔴 Changed here
    info: 'Task Updated',
    warning: 'Warning',
  };
  
  return titleMap[type] ?? 'Notification';
}

// Optional: Get current permission status without requesting
export function getPermissionStatus(): boolean | null {
  return permissionStatus;
}

// Optional: Reset permission cache (useful for settings screen)
export function resetPermissionCache(): void {
  permissionStatus = null;
}
