import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { z } from "zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

import { theme } from "../../../styles/theme";
import * as storage from "@/lib/storage"



const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "first name must be at least 3 characters long"),
  lastName: z
    .string()
    .trim()
    .min(3, "last name must be at least 3 characters long"),
  email: z.email("invalid email address"),
  studentId: z.string().trim().length(9, "must be 9 chars"),
  phone: z
    .string()
    .refine(
      (val) => val.replace(/\D/g, "").length >= 10,
      "phone number must be 10 digits",
    ),
});

type ProfileForm = z.infer<typeof profileSchema>;

const profile = () => {
  
  const [isloading, setIsLoading] = useState(true); //loader state while loading saved data
  const [isEditing, setIsEditing] = useState(false); //track if in editing mode
  const [hasSavedData, setHasSavedData] = useState(false); //track if there is saved data for this profile
  
  const {
    control,
    handleSubmit,
    reset, // reset form to default values when edit cancelled
    watch, // add watch function to track form values, to enable/disable submit
    formState: { errors, isValid },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      studentId: "",
      phone: "",
    },
    mode: "onSubmit",
  });

  const watchedValues = watch() // returns array of all form filled values without keys, checks that every value has length >0
  // ["firstName", "lastName", "", "studentID", "5555551234"] => will return false because email field is empty

  const isFormFilled = Object.values(watchedValues).every((v)=> v.length >0)

  // load saved profile data from mount
  useEffect(()=>{
    const loadingProfile = async()=> {
      const saved = await storage.get<ProfileForm>(storage.STORAGE_KEY.PROFILE)
      // if saved is NOT NULL, or has data, prefill the view mode with user data
      if (saved !== null){
        reset(saved)
        setHasSavedData(true)
      }else {
        setIsEditing(true) // first visit, start in edit mode
      }
      setIsLoading(false)
    }
    loadingProfile()
  },[])



  const onSubmit = async(data: ProfileForm) => {
    // --old-- dummy message
    // Alert.alert("profile saved", "profile updated", [
    //   { text: "OK", onPress: () => router.back() },
    // ]);
    // --new--
    await storage.set(storage.STORAGE_KEY.PROFILE, data)
    setHasSavedData(true)
    setIsEditing(false)
  };

  const handleCancel = async()=> {
    const saved = await storage.get<ProfileForm>(storage.STORAGE_KEY.PROFILE)
    if (saved !=null) {
      reset(saved)
    }
    setIsEditing(false)
  };

  if (isloading) {
    return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size = "large" color={theme.colors.primary}/>
    </View>
    );
  }

  if(!isEditing) {
    const values = watch()
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.h1}>My Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>First Name</Text>
            <Text style={styles.profileValue}>{values.firstName}</Text>
          </View>
          <View style={styles.divider}/>
        </View>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>First Name</Text>
            <Text style={styles.profileValue}>{values.lastName}</Text>
          </View>
          <View style={styles.divider}/>
        </View>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>First Name</Text>
            <Text style={styles.profileValue}>{values.studentId}</Text>
          </View>
          <View style={styles.divider}/>
        </View>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>First Name</Text>
            <Text style={styles.profileValue}>{values.email}</Text>
          </View>
          <View style={styles.divider}/>
        </View>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>First Name</Text>
            <Text style={styles.profileValue}>{values.phone}</Text>
          </View>
          <View style={styles.divider}/>
        </View>
        <Pressable style={styles.button} onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>
      </ScrollView>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>Edit Profile</Text>
      {/*First Name */}
      <Text style={styles.label}>First Name</Text>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder="first name here"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChange={onChange}
            autoCapitalize="words"
          />
        )}
      />
      {errors.firstName && (
        <Text style={styles.error}>{errors.firstName.message}</Text>
      )}

      {/*Last Name */}
      <Text style={styles.label}>Last Name</Text>
      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            placeholder="last name here"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChange={onChange}
            autoCapitalize="words"
          />
        )}
      />
      {errors.lastName && (
        <Text style={styles.error}>{errors.lastName.message}</Text>
      )}

      {/*Email*/}
      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="example@example.com"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChange={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      {/*Phone number*/}
      <Text style={styles.label}>Phone Number</Text>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="(555) 555-5555"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChange={onChange}
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

      {/*Student ID*/}
      <Text style={styles.label}>Student ID</Text>
      <Controller
        control={control}
        name="studentId"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.studentId && styles.inputError]}
            placeholder="A00123456"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChange={onChange}
            autoCapitalize="characters"
            maxLength={9}
          />
        )}
      />
      {errors.studentId && (
        <Text style={styles.error}>{errors.studentId.message}</Text>
      )}
      {/* buttons for edit mode */}
      {hasSavedData ? (
            <View style={styles.buttonRow}>
              <Pressable style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.saveButton, !isFormFilled && styles.buttonDisabled]} 
                onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Save Profile</Text>
              </Pressable>
            </View>
        ) :(
            <Pressable style={[styles.button, !isFormFilled && styles.buttonDisabled]} 
              onPress={handleSubmit(onSubmit)} disabled={!isFormFilled}>
              <Text style={styles.buttonText}>Save Profile</Text>
            </Pressable>
        )
      }
    {/* submit button */}
      
    </ScrollView>
  );
};

export default profile;

const styles = StyleSheet.create({
  profileCard: {
backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  profileRow: {
    padding: 16,
  },
  profileLabel: {
    fontSize: 13,
    color: theme.colors.muted,
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    padding: theme.spacing.screen,
  },
  h1: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    color: theme.colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    padding: 14,
    fontSize: 16,
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  error: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.input,
    padding: 16,
    alignItems: "center",
    marginTop: 28,
  },
  buttonText: {
    color: "ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
  },
  cancelButton: {
    flex: 1,
    borderRadius: theme.radius.input,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.input,
    padding: 16,
    alignItems: "center",
  }
});
