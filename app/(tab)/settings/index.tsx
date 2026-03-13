import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import AppCard from "../../../components/AppCard";
import { theme } from "../../../styles/theme";
import * as storage from "@/lib/storage";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [isloading, setIsLoading] = useState(true);

  //load save notification preference on mount. start useEffect like thie: useEffect(()=>{},[])

  useEffect(() => {
    //define async function to load value because useEffect cannot be async
    const loadNotification = async () => {
      //try to load saved values if they exist
      const saved = await storage.get<boolean>(
        storage.STORAGE_KEY.NOTIFICATION,
      );
      if (saved !== null) {
        //if saved value exists, use it to set the state
        setNotifications(saved);
      }
      setIsLoading(false); //trun off loading spinner
    };
    loadNotification();
  }, []);

  const handleToggle = async (value: boolean) => {
    setNotifications(value);
    await storage.set(storage.STORAGE_KEY.NOTIFICATION, value);
  };
  if (isloading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Settings</Text>

      <AppCard
        title="Notifications"
        subtitle="Enable app notifications"
        right={<Switch value={notifications} onValueChange={handleToggle} />}
      />
      <Pressable onPress={() => router.push("../(tab)/settings/profile")}>
        <AppCard
          title="Account"
          subtitle="Update profile settings"
          right={
            <Ionicons
              name="person-circle-outline"
              size={24}
              color={theme.colors.primary}
            />
          }
        />
      </Pressable>
      {/* add new card for dark mode lab 4 async storage*/}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.bg,
  },
  container: {
    flex: 1,
    padding: theme.spacing.screen,
    backgroundColor: theme.colors.bg,
  },
  h1: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    color: theme.colors.text,
  },
});
