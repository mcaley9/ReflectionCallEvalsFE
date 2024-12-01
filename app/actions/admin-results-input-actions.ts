"use server";

import { db } from "@/db/db";
import { adminResultsInputTable } from "@/db/schema/admin-results-input-schema";
import { eq, desc, inArray } from "drizzle-orm";

export interface AdminResultsInput {
  uniqueId: string;
  phaseType: string | null;
  feedbackType: 'phase' | 'boss';
  sentiment: 'up' | 'down' | null;
  isFlagged: boolean;
  overrideStatus: 'yes' | 'partial' | 'no' | 'notreached' | null;
  comment: string | null;
  updatedAt?: Date;
}

export async function getAdminResultsInput(uniqueId: string) {
  try {
    const results = await db
      .select()
      .from(adminResultsInputTable)
      .where(eq(adminResultsInputTable.uniqueId, uniqueId))
      .orderBy(desc(adminResultsInputTable.createdAt));
    
    return results;
  } catch (error) {
    console.error('Error fetching admin results input:', error);
    return [];
  }
}

export async function getAdminResultsInputForMultipleIds(uniqueIds: string[]) {
  try {
    const results = await db
      .select()
      .from(adminResultsInputTable)
      .where(inArray(adminResultsInputTable.uniqueId, uniqueIds))
      .orderBy(desc(adminResultsInputTable.createdAt));
    
    return results;
  } catch (error) {
    console.error('Error fetching admin results input:', error);
    return [];
  }
}

export async function submitAdminResultsInput(
  data: AdminResultsInput & { userId: string }
) {
  try {
    const { userId, ...inputData } = data;
    
    await db.insert(adminResultsInputTable).values({
      uniqueId: inputData.uniqueId,
      phaseType: inputData.phaseType,
      feedbackType: inputData.feedbackType,
      sentiment: inputData.sentiment,
      isFlagged: inputData.isFlagged,
      overrideStatus: inputData.overrideStatus,
      comment: inputData.comment,
      createdBy: userId,
      updatedBy: userId,
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting admin results input:", error);
    return { success: false, error: "Failed to submit admin results input" };
  }
}

export async function updateAdminResultsInput(
  id: string,
  data: Partial<AdminResultsInput> & { userId: string }
) {
  try {
    const { userId, ...updateData } = data;
    
    await db.update(adminResultsInputTable)
      .set({
        phaseType: updateData.phaseType,
        feedbackType: updateData.feedbackType,
        sentiment: updateData.sentiment,
        isFlagged: updateData.isFlagged,
        overrideStatus: updateData.overrideStatus,
        comment: updateData.comment,
        updatedBy: userId,
        updatedAt: new Date()
      })
      .where(eq(adminResultsInputTable.id, id));

    return { success: true };
  } catch (error) {
    console.error("Error updating admin results input:", error);
    return { success: false, error: "Failed to update admin results input" };
  }
} 