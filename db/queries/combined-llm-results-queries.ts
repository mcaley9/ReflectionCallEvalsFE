"use server";

import { db } from "../db";
import { eq, desc } from "drizzle-orm";
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

export async function getCombinedLLMResultsWithSmoothnessLevels(page = 1, limit = 100) {
  try {
    const offset = (page - 1) * limit;
    return await db
      .select({
        id: combinedLLMResults.id,
        sessionId: combinedLLMResults.sessionId,
        uniqueId: combinedLLMResults.uniqueId,
        reviewQueueId: combinedLLMResults.reviewQueueId,
        posthogId: combinedLLMResults.posthogId,
        vapiCallId: combinedLLMResults.vapiCallId,
        authPhaseSmooth: combinedLLMResults.authPhaseSmooth,
        authPhaseDetails: combinedLLMResults.authPhaseDetails,
        selectionPhaseSmooth: combinedLLMResults.selectionPhaseSmooth,
        selectionPhaseDetails: combinedLLMResults.selectionPhaseDetails,
        initiationPhaseSmooth: combinedLLMResults.initiationPhaseSmooth,
        initiationPhaseDetails: combinedLLMResults.initiationPhaseDetails,
        totalDurationSeconds: combinedLLMResults.totalDurationSeconds,
        userExperienceIssues: combinedLLMResults.userExperienceIssues,
        evaluationId: combinedLLMResults.evaluationId,
        greetStudentScore: combinedLLMResults.greetStudentScore,
        greetStudentCriteria: combinedLLMResults.greetStudentCriteria,
        understandFeelingsScore: combinedLLMResults.understandFeelingsScore,
        understandFeelingsCriteria: combinedLLMResults.understandFeelingsCriteria,
        provideOverviewScore: combinedLLMResults.provideOverviewScore,
        provideOverviewCriteria: combinedLLMResults.provideOverviewCriteria,
        goalReviewScore: combinedLLMResults.goalReviewScore,
        goalReviewCriteria: combinedLLMResults.goalReviewCriteria,
        competencyReviewScore: combinedLLMResults.competencyReviewScore,
        competencyReviewCriteria: combinedLLMResults.competencyReviewCriteria,
        purposeReviewScore: combinedLLMResults.purposeReviewScore,
        purposeReviewCriteria: combinedLLMResults.purposeReviewCriteria,
        keyEventsReflectionScore: combinedLLMResults.keyEventsReflectionScore,
        keyEventsReflectionCriteria: combinedLLMResults.keyEventsReflectionCriteria,
        goalSettingScore: combinedLLMResults.goalSettingScore,
        goalSettingCriteria: combinedLLMResults.goalSettingCriteria,
        closingScore: combinedLLMResults.closingScore,
        closingCriteria: combinedLLMResults.closingCriteria,
        recordingDurationSeconds: combinedLLMResults.recordingDurationSeconds,
        userId: combinedLLMResults.userId,
        fronteggId: combinedLLMResults.fronteggId,
        clientId: combinedLLMResults.clientId,
        tenantId: combinedLLMResults.tenantId,
        assignmentId: combinedLLMResults.assignmentId,
        plGroupId: combinedLLMResults.plGroupId,
        scheduleId: combinedLLMResults.scheduleId,
        activityType: combinedLLMResults.activityType,
        experienceType: combinedLLMResults.experienceType,
        simulationDataType: combinedLLMResults.simulationDataType,
        publicUrl: combinedLLMResults.publicUrl,
        createdAt: combinedLLMResults.createdAt,
        hasVisionData: combinedLLMResults.hasVisionData,
        hasTranscriptData: combinedLLMResults.hasTranscriptData,
        smoothnessLevel: llmBossResults.smoothnessLevel,
        posthogVisionAiAnalysis: combinedLLMResults.posthogVisionAiAnalysis
      })
      .from(combinedLLMResults)
      .leftJoin(
        llmBossResults,
        eq(combinedLLMResults.uniqueId, llmBossResults.uniqueId)
      )
      .orderBy(desc(combinedLLMResults.createdAt))
      .limit(limit)
      .offset(offset);
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
} 