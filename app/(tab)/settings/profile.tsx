import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import React from "react";

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

const profile = () => {
  return (
    <View>
      <Text>profile</Text>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({});
