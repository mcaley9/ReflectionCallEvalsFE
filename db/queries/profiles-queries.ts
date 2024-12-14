"use server";

import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { InsertProfile, profilesTable, SelectProfile } from "../schema";

export const createProfile = async (data: InsertProfile) => {
  try {
    const [newProfile] = await db.insert(profilesTable).values(data).returning();
    return { success: true, data: newProfile };
  } catch (error) {
    console.error("Error creating profile:", error);
    return { success: false, error: "Failed to create profile" };
  }
};

export const getProfileByUserId = async (userId: string) => {
  try {
    const [profile] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.userId, userId))
      .limit(1);

    return { success: true, data: profile };
  } catch (error) {
    console.error("Error getting profile by user ID:", error);
    return { success: false, error: "Failed to get profile" };
  }
};

export const getAllProfiles = async () => {
  try {
    const profiles = await db.select().from(profilesTable);
    return { success: true, data: profiles };
  } catch (error) {
    console.error("Error getting all profiles:", error);
    return { success: false, error: "Failed to get profiles" };
  }
};

export const updateProfile = async (userId: string, data: Partial<InsertProfile>) => {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.userId, userId))
      .returning();
    return { success: true, data: updatedProfile };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
};

export const updateProfileByStripeCustomerId = async (stripeCustomerId: string, data: Partial<InsertProfile>) => {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.stripeCustomerId, stripeCustomerId))
      .returning();
    return { success: true, data: updatedProfile };
  } catch (error) {
    console.error("Error updating profile by stripe customer ID:", error);
    return { success: false, error: "Failed to update profile by stripe customer ID" };
  }
};

export const deleteProfile = async (userId: string) => {
  try {
    await db
      .delete(profilesTable)
      .where(eq(profilesTable.userId, userId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting profile:", error);
    return { success: false, error: "Failed to delete profile" };
  }
};
