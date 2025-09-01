/*
  Lightweight storage abstraction:
  - On web uses localStorage
  - On native uses @react-native-async-storage/async-storage with static import
  Exposes simple get/set for a key.
*/
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      console.warn('Failed to get item from localStorage:', e);
      return null;
    }
  }

  // Use static import instead of dynamic require
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.warn('Failed to get item from AsyncStorage:', e);
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
      return;
    } catch (e) {
      console.warn('Failed to set item in localStorage:', e);
      return;
    }
  }

  // Use static import instead of dynamic require
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.warn('Failed to set item in AsyncStorage:', e);
  }
}

export async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(key);
      return;
    } catch (e) {
      console.warn('Failed to remove item from localStorage:', e);
      return;
    }
  }

  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn('Failed to remove item from AsyncStorage:', e);
  }
}