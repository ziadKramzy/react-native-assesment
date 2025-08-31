/*
  Lightweight storage abstraction:
  - On web uses localStorage
  - On native tries to require('@react-native-async-storage/async-storage') dynamically
  Exposes simple get/set for a key.
*/
import { Platform } from 'react-native';

async function _getNativeAsyncStorage(): Promise<any | null> {
  try {
    // dynamic require so we don't hard-depend on the package at compile time
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    return AsyncStorage;
  } catch (e) {
    return null;
  }
}

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  const AsyncStorage = await _getNativeAsyncStorage();
  if (AsyncStorage?.getItem) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  return null;
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
      return;
    } catch (e) {
      return;
    }
  }

  const AsyncStorage = await _getNativeAsyncStorage();
  if (AsyncStorage?.setItem) {
    try {
      await AsyncStorage.setItem(key, value);
      return;
    } catch (e) {
      return;
    }
  }

  return;
}
