"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { adminResultsInputTable } from "@/db/schema";

interface FeedbackInput {
  uniqueId: string;
  phaseType: string | null;
  sentiment: 'up' | 'down' | null;
  isFlagged: boolean;
  overrideStatus: "yes" | "partial" | "no" | "notreached" | null;
  comment: string | null;
}

export async function submitFeedback(input: FeedbackInput) {
  const { uniqueId, phaseType, sentiment, isFlagged, overrideStatus, comment } = input;

  try {
    const result = await db
      .insert(adminResultsInputTable)
      .values({
        uniqueId,
        phaseType,
        feedbackType: 'phase',
        sentiment,
        isFlagged,
        overrideStatus,
        comment,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}