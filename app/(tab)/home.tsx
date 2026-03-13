import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../components/AppCard";
import { theme } from "../../styles/theme";
import * as api from "../../lib/api";
import { Background } from "@react-navigation/elements";

export default function Home() {
  const [data, setData] = useState<api.DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    try {
      setError(null);
      setIsLoading(true);
      const result = await api.getDashboardData(); //call api
      setData(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "you fucked up"); //check type of error
    } finally {
      setIsLoading(false);
    }
  }
  // fetch on mount
  useEffect(() => {
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size={"large"} color={theme.colors.primary} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons
          name={"cloud-offline-outline"}
          size={48}
          color={theme.colors.muted}
        />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadDashboard}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Campus Hub</Text>
      <Text style={styles.p}>{data?.greeting}, here is your overview:</Text>

      <AppCard
        title="Upcoming Deadline"
        subtitle={`${data?.nextDeadline.course} ${data?.nextDeadline.title} ${data?.nextDeadline.dueDate}`}
        right={
          <Ionicons
            name="alert-circle-outline"
            size={22}
            color={theme.colors.primary}
          />
        }
      />

      <AppCard
        title="Attendance"
        subtitle={`${data?.attendance.attended}/${data?.attendance.total} classes ${data?.attendance.percentage}%`}
        right={
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color={theme.colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.screen,
    backgroundColor: theme.colors.bg,
  },
  centered: {
    flex: 1,
    padding: theme.spacing.screen,
    justifyContent: "center",
    alignItems: "center",
  },
  h1: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.muted,
    textAlign: "center",
  },
  p: {
    marginTop: 6,
    marginBottom: 16,
    color: theme.colors.muted,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.primary,
  },
  retryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
