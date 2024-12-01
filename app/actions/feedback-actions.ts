"use server";

import { submitAdminResultsInput, AdminResultsInput } from "./admin-results-input-actions";

export async function submitFeedback(data: {
  uniqueId: string;
  phaseType: string | null;
  feedbackType: 'phase' | 'boss';
  sentiment: 'up' | 'down' | null;
  isFlagged: boolean;
  overrideStatus: 'yes' | 'partial' | 'no' | 'notreached' | null;
  comment: string | null;
}) {
  try {
    // Get the user ID from the session - for now using a placeholder
    // TODO: Replace with actual user ID from auth
    const userId = "placeholder-user-id";
    
    return await submitAdminResultsInput({
      ...data,
      userId
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { success: false, error: "Failed to submit feedback" };
  }
}