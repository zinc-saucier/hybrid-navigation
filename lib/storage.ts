import AsyncStorage from "@react-native-async-storage/async-storage";
import { unknown } from "zod";

export const STORAGE_KEY = {
  PROFILE: "profile",
  NOTIFICATION: "notificaton",
} as const;
//get value from storage
export const get = async <T>(key: string): Promise<T | null> => {
  const value = await AsyncStorage.getItem(key);
  if (value === null) return null;
  return JSON.parse(value) as T;
};
//set value in storage
export const set = async <T>(key: string, value: unknown): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};
//remove value from storage
export const remove = async <T>(key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};
