import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

/**
 * Get auth token from storage
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.auth.token);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Save auth token to storage
 */
export const saveAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.auth.token, token);
  } catch (error) {
    console.error('Error saving auth token:', error);
  }
};

/**
 * Remove auth token from storage
 */
export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.auth.token);
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

/**
 * Get user data from storage
 */
export const getUserData = async (): Promise<any | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.auth.user);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Save user data to storage
 */
export const saveUserData = async (user: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.auth.user, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

/**
 * Remove user data from storage
 */
export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.auth.user);
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await Promise.all([
      removeAuthToken(),
      removeUserData(),
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * Save last conversation ID
 */
export const saveLastConversationId = async (conversationId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.chat.lastConversationId,
      conversationId
    );
  } catch (error) {
    console.error('Error saving last conversation ID:', error);
  }
};

/**
 * Get last conversation ID
 */
export const getLastConversationId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.chat.lastConversationId);
  } catch (error) {
    console.error('Error getting last conversation ID:', error);
    return null;
  }
};
