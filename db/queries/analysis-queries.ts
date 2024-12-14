"use server";

import { db } from "../db";
import { eq, desc, and, not, isNull } from "drizzle-orm";
import { posthogCompletedAnalysisView, vapiCompletedAnalysisView } from "../schema/views/analysis-views-schema";

export interface CombinedAnalysisResult {
  id: string | null;
  sessionId: string | null;
  uniqueId: string | null;
  clientName: string | null;
  reviewQueueId: string | null;
  posthogId: string | null;
  vapiCallId: string | null;
  authPhaseSmooth: boolean | null;
  authPhaseDetails: any | null;
  selectionPhaseSmooth: boolean | null;
  selectionPhaseDetails: any | null;
  initiationPhaseSmooth: boolean | null;
  initiationPhaseDetails: any | null;
  reportReviewPhaseSmooth: boolean | null;
  reportReviewPhaseDetails: any | null;
  totalDurationSeconds: number | null;
  userExperienceIssues: any | null;
  evaluationId: string | null;
  smoothnessLevel: string | null;
  createdAt: Date | null;
  greetStudentScore: string | null;
  greetStudentCriteria: any | null;
  understandFeelingsScore: string | null;
  understandFeelingsCriteria: any | null;
  provideOverviewScore: string | null;
  provideOverviewCriteria: any | null;
  goalReviewScore: string | null;
  goalReviewCriteria: any | null;
  competencyReviewScore: string | null;
  competencyReviewCriteria: any | null;
  purposeReviewScore: string | null;
  purposeReviewCriteria: any | null;
  keyEventsReflectionScore: string | null;
  keyEventsReflectionCriteria: any | null;
  goalSettingScore: string | null;
  goalSettingCriteria: any | null;
  closingScore: string | null;
  closingCriteria: any | null;
  langfuseTraceUrl: string | null;
  used_name?: string;
  warm_greeting?: string;
  waited_for_response?: string;
  activity_type?: string;
  experience_type?: string;
  call_type?: string;
  started_at?: string;
  ended_at?: string;
  duration_minutes?: number;
  ended_reason?: string;
  transcript?: string;
}

export async function getAnalysisResultByUniqueId(uniqueId: string) {
  try {
    const [posthogResult, vapiResult] = await Promise.all([
      db.select()
        .from(posthogCompletedAnalysisView)
        .where(eq(posthogCompletedAnalysisView.posthogIdUuid, uniqueId))
        .limit(1),
      db.select()
        .from(vapiCompletedAnalysisView)
        .where(eq(vapiCompletedAnalysisView.sessionId, uniqueId))
        .limit(1)
    ]);

    if (!posthogResult.length && !vapiResult.length) return null;

    const posthog = posthogResult[0];
    const vapi = vapiResult[0];

    console.log('Raw Vapi Result:', vapi);
    console.log('Raw Posthog Result:', posthog);

    // Determine smoothness level based on phase smoothness
    const allPhasesSmooth = posthog && 
      posthog.authPhaseSmooth && 
      posthog.selectionPhaseSmooth && 
      posthog.initiationPhaseSmooth && 
      posthog.reportReviewPhaseSmooth;

    // Helper function to format phase details
    const formatPhaseDetails = (isSmooth: boolean | null, issues: any, phase: string) => {
      if (!issues) return null;
      
      return {
        is_smooth: isSmooth,
        issues,
        publicUrl: posthog?.publicUrl,
        vapiCallId: vapi?.vapiCallId,
        // UI specific fields
        used_name: vapi?.used_name || 'No',
        warm_greeting: vapi?.warm_greeting || 'No',
        waited_for_response: vapi?.waited_for_response || 'No',
        activity_type: vapi?.activity_type || 'Unknown',
        experience_type: vapi?.experience_type || 'Unknown',
        call_type: vapi?.call_type || 'Unknown',
        started_at: vapi?.started_at || posthog?.startTime?.toISOString(),
        ended_at: vapi?.ended_at || new Date().toISOString(),
        duration_minutes: vapi?.durationMinutes || 0,
        ended_reason: vapi?.ended_reason || 'Unknown',
        transcript: vapi?.transcript || '',
        phase
      };
    };

    const result = {
      id: posthog?.analysisId || vapi?.analysisId || null,
      sessionId: posthog?.sessionId || vapi?.sessionId || null,
      uniqueId: posthog?.posthogIdUuid || vapi?.sessionId || null,
      clientName: vapi?.clientId || null,
      reviewQueueId: null,
      posthogId: posthog?.posthogIdUuid || null,
      vapiCallId: vapi?.vapiCallId || null,
      authPhaseSmooth: posthog?.authPhaseSmooth || null,
      authPhaseDetails: formatPhaseDetails(posthog?.authPhaseSmooth, posthog?.authPhaseIssues, 'auth'),
      selectionPhaseSmooth: posthog?.selectionPhaseSmooth || null,
      selectionPhaseDetails: formatPhaseDetails(posthog?.selectionPhaseSmooth, posthog?.selectionPhaseIssues, 'selection'),
      initiationPhaseSmooth: posthog?.initiationPhaseSmooth || null,
      initiationPhaseDetails: formatPhaseDetails(posthog?.initiationPhaseSmooth, posthog?.initiationPhaseIssues, 'initiation'),
      reportReviewPhaseSmooth: posthog?.reportReviewPhaseSmooth || null,
      reportReviewPhaseDetails: formatPhaseDetails(posthog?.reportReviewPhaseSmooth, posthog?.reportReviewPhaseIssues, 'report_review'),
      totalDurationSeconds: posthog?.totalDurationSeconds || (vapi?.durationMinutes ? vapi.durationMinutes * 60 : null),
      userExperienceIssues: null,
      evaluationId: vapi?.evaluationId || null,
      smoothnessLevel: allPhasesSmooth ? 'completely_smooth' : 'not_smooth',
      createdAt: posthog?.startTime || vapi?.createdAt || null,
      greetStudentScore: vapi?.greetStudentScore || null,
      greetStudentCriteria: vapi?.greetStudentCriteria || null,
      understandFeelingsScore: vapi?.understandFeelingsScore || null,
      understandFeelingsCriteria: vapi?.understandFeelingsCriteria || null,
      provideOverviewScore: vapi?.provideOverviewScore || null,
      provideOverviewCriteria: vapi?.provideOverviewCriteria || null,
      goalReviewScore: vapi?.goalReviewScore || null,
      goalReviewCriteria: vapi?.goalReviewCriteria || null,
      competencyReviewScore: vapi?.competencyReviewScore || null,
      competencyReviewCriteria: vapi?.competencyReviewCriteria || null,
      purposeReviewScore: vapi?.purposeReviewScore || null,
      purposeReviewCriteria: vapi?.purposeReviewCriteria || null,
      keyEventsReflectionScore: vapi?.keyEventsReflectionScore || null,
      keyEventsReflectionCriteria: vapi?.keyEventsReflectionCriteria || null,
      goalSettingScore: vapi?.goalSettingScore || null,
      goalSettingCriteria: vapi?.goalSettingCriteria || null,
      closingScore: vapi?.closingScore || null,
      closingCriteria: vapi?.closingCriteria || null,
      langfuseTraceUrl: vapi?.langfuseTraceUrl || posthog?.langfuseTraceUrl || null,
    };

    console.log('Formatted Result:', result);
    return result;
  } catch (error) {
    console.error('Error fetching analysis result:', error);
    return null;
  }
}

export async function getAnalysisResults(page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize;
    
    // Get results from both views
    const [posthogResults, vapiResults] = await Promise.all([
      db.select()
        .from(posthogCompletedAnalysisView)
        .orderBy(desc(posthogCompletedAnalysisView.startTime))
        .offset(offset)
        .limit(pageSize),
      db.select()
        .from(vapiCompletedAnalysisView)
        .orderBy(desc(vapiCompletedAnalysisView.createdAt))
        .offset(offset)
        .limit(pageSize)
    ]);

    console.log('Raw Vapi Results:', JSON.stringify(vapiResults, null, 2));
    console.log('Raw Posthog Results:', JSON.stringify(posthogResults, null, 2));

    // Create a map for faster lookup
    const resultMap = new Map<string, CombinedAnalysisResult>();

    // Process Posthog results
    posthogResults.forEach(posthog => {
      if (!posthog.sessionId) return;

      const allPhasesSmooth = 
        posthog.authPhaseSmooth && 
        posthog.selectionPhaseSmooth && 
        posthog.initiationPhaseSmooth && 
        posthog.reportReviewPhaseSmooth;

      resultMap.set(posthog.sessionId, {
        id: posthog.analysisId || null,
        sessionId: posthog.sessionId,
        uniqueId: posthog.posthogIdUuid || null,
        clientName: null,
        reviewQueueId: null,
        posthogId: posthog.posthogIdUuid || null,
        vapiCallId: null,
        authPhaseSmooth: posthog.authPhaseSmooth || null,
        authPhaseDetails: posthog.authPhaseIssues ? {
          is_smooth: posthog.authPhaseSmooth,
          issues: posthog.authPhaseIssues,
          publicUrl: posthog.publicUrl,
          vapiCallId: null
        } : null,
        selectionPhaseSmooth: posthog.selectionPhaseSmooth || null,
        selectionPhaseDetails: posthog.selectionPhaseIssues ? {
          is_smooth: posthog.selectionPhaseSmooth,
          issues: posthog.selectionPhaseIssues,
          publicUrl: posthog.publicUrl,
          vapiCallId: null
        } : null,
        initiationPhaseSmooth: posthog.initiationPhaseSmooth || null,
        initiationPhaseDetails: posthog.initiationPhaseIssues ? {
          is_smooth: posthog.initiationPhaseSmooth,
          issues: posthog.initiationPhaseIssues,
          publicUrl: posthog.publicUrl,
          vapiCallId: null
        } : null,
        reportReviewPhaseSmooth: posthog.reportReviewPhaseSmooth || null,
        reportReviewPhaseDetails: posthog.reportReviewPhaseIssues ? {
          is_smooth: posthog.reportReviewPhaseSmooth,
          issues: posthog.reportReviewPhaseIssues,
          publicUrl: posthog.publicUrl,
          vapiCallId: null
        } : null,
        totalDurationSeconds: posthog.totalDurationSeconds || null,
        userExperienceIssues: null,
        evaluationId: null,
        smoothnessLevel: allPhasesSmooth ? 'completely_smooth' : 'not_smooth',
        createdAt: posthog.startTime || null,
        greetStudentScore: null,
        greetStudentCriteria: null,
        understandFeelingsScore: null,
        understandFeelingsCriteria: null,
        provideOverviewScore: null,
        provideOverviewCriteria: null,
        goalReviewScore: null,
        goalReviewCriteria: null,
        competencyReviewScore: null,
        competencyReviewCriteria: null,
        purposeReviewScore: null,
        purposeReviewCriteria: null,
        keyEventsReflectionScore: null,
        keyEventsReflectionCriteria: null,
        goalSettingScore: null,
        goalSettingCriteria: null,
        closingScore: null,
        closingCriteria: null,
        langfuseTraceUrl: posthog.langfuseTraceUrl || null,
      });
    });

    // Process Vapi results
    vapiResults.forEach(vapi => {
      if (!vapi.sessionId) return;

      if (!resultMap.has(vapi.sessionId)) {
        resultMap.set(vapi.sessionId, {
          id: vapi.analysisId || null,
          sessionId: vapi.sessionId,
          uniqueId: vapi.sessionId,
          clientName: vapi.clientId || null,
          reviewQueueId: null,
          posthogId: null,
          vapiCallId: vapi.vapiCallId || null,
          authPhaseSmooth: null,
          authPhaseDetails: null,
          selectionPhaseSmooth: null,
          selectionPhaseDetails: null,
          initiationPhaseSmooth: null,
          initiationPhaseDetails: null,
          reportReviewPhaseSmooth: null,
          reportReviewPhaseDetails: null,
          totalDurationSeconds: vapi.durationMinutes ? vapi.durationMinutes * 60 : null,
          userExperienceIssues: null,
          evaluationId: vapi.evaluationId || null,
          smoothnessLevel: null,
          createdAt: vapi.createdAt || null,
          greetStudentScore: vapi.greetStudentScore || null,
          greetStudentCriteria: vapi.greetStudentCriteria || null,
          understandFeelingsScore: vapi.understandFeelingsScore || null,
          understandFeelingsCriteria: vapi.understandFeelingsCriteria || null,
          provideOverviewScore: vapi.provideOverviewScore || null,
          provideOverviewCriteria: vapi.provideOverviewCriteria || null,
          goalReviewScore: vapi.goalReviewScore || null,
          goalReviewCriteria: vapi.goalReviewCriteria || null,
          competencyReviewScore: vapi.competencyReviewScore || null,
          competencyReviewCriteria: vapi.competencyReviewCriteria || null,
          purposeReviewScore: vapi.purposeReviewScore || null,
          purposeReviewCriteria: vapi.purposeReviewCriteria || null,
          keyEventsReflectionScore: vapi.keyEventsReflectionScore || null,
          keyEventsReflectionCriteria: vapi.keyEventsReflectionCriteria || null,
          goalSettingScore: vapi.goalSettingScore || null,
          goalSettingCriteria: vapi.goalSettingCriteria || null,
          closingScore: vapi.closingScore || null,
          closingCriteria: vapi.closingCriteria || null,
          langfuseTraceUrl: vapi.langfuseTraceUrl || null,
        });
      }
    });

    return Array.from(resultMap.values());
  } catch (error) {
    console.error('Error fetching analysis results:', error);
    return [];
  }
}

export async function getActiveClients() {
  try {
    const results = await db
      .select({ clientId: vapiCompletedAnalysisView.clientId })
      .from(vapiCompletedAnalysisView)
      .where(not(isNull(vapiCompletedAnalysisView.clientId)));

    // Filter out nulls and duplicates
    const clients = results
      .map(r => r.clientId)
      .filter((id): id is string => id !== null);

    // Use Array.from instead of spread operator
    return Array.from(new Set(clients)).sort();
  } catch (error) {
    console.error('Error fetching active clients:', error);
    return [];
  }
} 