import React, {useState, useEffect} from "react";
import { FlatList, StyleSheet, Text, Pressable, View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../../components/AppCard";
import { theme } from "../../../styles/theme";
import * as api from "../../../lib/api"

// old hardcoded data
// const COURSES = [
//   { id: "cprg216", title: "CPRG-216", subtitle: "Advanced Web Systems" },
//   { id: "cprg303", title: "CPRG-303", subtitle: "Mobile Development" },
//   { id: "cprg306", title: "CPRG-306", subtitle: "Backend APIs" },
// ];

export default function CoursesList() {

  const [courses, setcourses] = useState<api.Course[]>([])
  const [isloading, setIsLoading] = useState(true); //loader state while loading saved data
  const [refreshing, setRefreshing] = useState(false); //refreshing saved data
  const [error, setError] = useState<string | null>(null)

  //function to load courses

    async function loadCourses() {
      try{
        setError(null)
        setIsLoading(true)
        const result = await api.getCourses()
        setcourses(result)
      } catch (error){
        setError(error instanceof Error? error.message : "you done fucked up")
      } finally {
        setIsLoading(false)
      }
    }

    async function  handleRefresh() {
      try{
        setRefreshing(true)
        setError(null)
        const result = await api.getCourses()
        setcourses(result)
      } catch (error) {
        setError(error instanceof Error ? error.message : "something is wrong")
      } finally {
        setRefreshing(false)
      }
    }
 // load courses on mount
    useEffect(()=>{
      loadCourses()
    },[])

    if(isloading){
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary}/>
        </View>
      )
    }

    if(error){
      return(
        <View style={styles.centered}>
          <Ionicons
            name="cloud-offline-outline"
            size = {48}
            color={theme.colors.muted}
          />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadCourses}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      )
    }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Your Courses</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Courses Found</Text>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/(tab)/courses/${item.id}`)}>
            <AppCard
              title={item.code}
              subtitle={`${item.title} - ${item.instructor}`}
              right={
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.muted}
                />
              }
            />
          </Pressable>
        )}
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
  h1: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    color: theme.colors.text,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.screen,

  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.muted,
    textAlign: "center"
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
  emptyText: {
    textAlign: "center",
    color: theme.colors.muted,
    marginTop: 40,
    fontSize: 15,
  }
});
