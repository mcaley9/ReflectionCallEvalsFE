import { db } from "../db";
import { eq } from "drizzle-orm";
import { combinedLLMResults } from "../schema/combined-llm-results-schema";

export async function getCombinedLLMResults() {
  return await db
    .select()
    .from(combinedLLMResults)
    .orderBy(combinedLLMResults.createdAt);
}

export async function getCombinedLLMResultsBySessionId(sessionId: string) {
  return await db
    .select()
    .from(combinedLLMResults)
    .where(eq(combinedLLMResults.sessionId, sessionId));
} 