import { StyleSheet, Text, View, Alert, ScrollView, TextInput, Pressable } from "react-native";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

import { theme } from "../../../styles/theme";

const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "first name must be at least 3 characters long"),
  lastName: z
    .string()
    .trim()
    .min(3, "last name must be at least 3 characters long"),
  email: z.string().trim().email("ivalid email address"),
  studentId: z.string().trim().length(9, "must be 9 chars"),
  phone: z
    .string()
    .refine(
      (val) => val.replace(/\D/g, "").length >= 10,
      "phone number must be 10 digits",
    ),
});

type ProfileForm = z.infer<typeof profileSchema>

const profile = () => {

  const {control, handleSubmit, formState: {errors, isValid}} = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      studentId: "",
      phone: "",
    },
    mode: "onSubmit"
  })

  const onSubmit = (data: ProfileForm) => {
    Alert.alert("profile saved", "profile updated")
  }

  return (
    <ScrollView style = {styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>Edit Profile</Text>
      {/*First Name */}
      <Text style={styles.label}>First Name</Text>
      <Controller
        control={control}
        name="firstName"
        render={({field: {onChange, value}})=>(
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
      {errors.firstName && (<Text style={styles.error}>{errors.firstName.message}</Text>)}

      {/*Last Name */}
      <Text style={styles.label}>Last Name</Text>
      <Controller
        control={control}
        name="lastName"
        render={({field: {onChange, value}})=>(
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
      {errors.lastName && (<Text style={styles.error}>{errors.lastName.message}</Text>)}

      {/*Email*/}
      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({field: {onChange, value}})=>(
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
      {errors.email && (<Text style={styles.error}>{errors.email.message}</Text>)}

      {/*Phone number*/}
      <Text style={styles.label}>Phone Number</Text>
      <Controller
        control={control}
        name="phone"
        render={({field: {onChange, value}})=>(
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
      {errors.phone && (<Text style={styles.error}>{errors.phone.message}</Text>)}

      {/*Student ID*/}
      <Text style={styles.label}>Student ID</Text>
      <Controller
        control={control}
        name="studentId"
        render={({field: {onChange, value}})=>(
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
      {errors.studentId && (<Text style={styles.error}>{errors.studentId.message}</Text>)}

      <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Save Profile</Text>

      </Pressable>
    </ScrollView>
  );
};

export default profile;

const styles = StyleSheet.create({
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
});
