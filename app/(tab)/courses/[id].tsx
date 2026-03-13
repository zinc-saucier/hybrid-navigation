import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "@/components/AppCard";
import { theme } from "../../../styles/theme";
import * as api from "../../../lib/api";

export default function CourseDetails() {

  const[course, setCourse] = useState<api.CourseDetail | null>(null);
  const[isloading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { id } = useLocalSearchParams<{ id: string }>();

  async function loadCourse() {
    try{
      setError(null)
      setIsLoading(true)
      const result = await api.getCourseById(id!)
      setCourse(result)
    }catch (error) {
      setError(error instanceof Error ? error.message : "this is bad")
    }finally {
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    loadCourse()
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
        <Pressable style={styles.retryButton} onPress={loadCourse}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* header*/}
      <Text style={styles.code}>{course?.code}</Text>
      <Text style={styles.h1}>{course?.title}</Text>
      <Text style={styles.description}>{course?.description}</Text>
      {/*info cards*/}

      <Text style={styles.sectionTitle}>Course Info</Text>

      <AppCard 
        title="Instructor"
        subtitle={course?.instructor}
        right={
          <Ionicons 
            name={"person-outline"}
            size={20}
            color={theme.colors.muted}  
          />
        }
      />
      <AppCard 
        title="Schedule"
        subtitle={course?.schedule}
        right={
          <Ionicons 
            name={"time-outline"}
            size={20}
            color={theme.colors.muted}  
          />
        }
      />
      <AppCard 
        title="Room"
        subtitle={course?.room}
        right={
          <Ionicons 
            name={"location-outline"}
            size={20}
            color={theme.colors.muted}  
          />
        }
      />
      <AppCard 
        title="Grade"
        subtitle={course?.grade}
        right={
          <Ionicons 
            name={"school-outline"}
            size={20}
            color={theme.colors.muted}  
          />
        }
      />
      <AppCard 
        title="Next Deadline"
        subtitle={course?.nextDeadline}
        right={
          <Ionicons 
            name={"alert-circle-outline"}
            size={20}
            color={theme.colors.muted}  
          />
        }
      />
      <AppCard 
        title="Attendance"
        subtitle={course?.attendance}
        right={
          <Ionicons 
            name={"checkmark-circle-outline"}
            size={20}
            color={theme.colors.muted}  
          />
        }
      />

      {/*announcements*/}

      <Text style={styles.sectionTitle}>Announcements</Text>

      {
        course?.announcements.map((text, index) => (
          <AppCard 
            key={index}
            title={text}
            right={
            <Ionicons 
              name={"megaphone-outline"}
              size={18}
              color={theme.colors.muted}  
          />
        }
      />
        ))
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: theme.spacing.screen, 
    backgroundColor: theme.colors.bg },
  h1: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: theme.colors.text,
    marginBottom: 8,
  },
  p: { 
    marginTop: 10, 
    color: theme.colors.muted },
  code: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: 4,
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
  },
  content: {
    padding: theme.spacing.screen,
    paddingBottom: 40,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.muted,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: 8,
    marginBottom: 10,
  },
});
