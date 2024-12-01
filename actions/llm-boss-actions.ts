"use server";

import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { llmBossResults } from "@/db/schema/llm-boss-results-schema";

export async function getDetailedLLMBossResultByUniqueId(uniqueId: string) {
  try {
    return await db
      .select({
        uniqueId: llmBossResults.uniqueId,
        smoothnessLevel: llmBossResults.smoothnessLevel,
        technicalScore: llmBossResults.technicalScore,
        conversationScore: llmBossResults.conversationScore,
        overallScore: llmBossResults.overallScore,
        confidenceLevel: llmBossResults.confidenceLevel,
        technicalHighlights: llmBossResults.technicalHighlights,
        technicalIssues: llmBossResults.technicalIssues,
        conversationHighlights: llmBossResults.conversationHighlights,
        conversationIssues: llmBossResults.conversationIssues,
        assessmentSummary: llmBossResults.assessmentSummary,
        keyFactors: llmBossResults.keyFactors,
        technicalRecommendations: llmBossResults.technicalRecommendations,
        conversationalRecommendations: llmBossResults.conversationalRecommendations,
        improvementPriority: llmBossResults.improvementPriority,
        status: llmBossResults.status,
        createdAt: llmBossResults.createdAt
      })
      .from(llmBossResults)
      .where(eq(llmBossResults.uniqueId, uniqueId))
      .limit(1);
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
} 