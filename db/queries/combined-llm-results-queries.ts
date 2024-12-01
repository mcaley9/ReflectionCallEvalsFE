"use server";

import { db } from "../db";
import { eq } from "drizzle-orm";
import { combinedLLMResults } from "../schema/combined-llm-results-schema";
import { llmBossResults } from "../schema/llm-boss-results-schema";

export async function getCombinedLLMResults() {
  try {
    return await db
      .select()
      .from(combinedLLMResults)
      .orderBy(combinedLLMResults.createdAt);
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export async function getLLMBossResultByUniqueId(uniqueId: string) {
  try {
    return await db
      .select({
        uniqueId: llmBossResults.uniqueId,
        smoothnessLevel: llmBossResults.smoothnessLevel
      })
      .from(llmBossResults)
      .where(eq(llmBossResults.uniqueId, uniqueId))
      .limit(1);
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
} 