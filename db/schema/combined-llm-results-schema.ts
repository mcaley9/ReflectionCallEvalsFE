import { pgTable, text, timestamp, uuid, boolean, jsonb } from "drizzle-orm/pg-core";

export const combinedLLMResults = pgTable("combined_llm_results", {
  id: text("id").primaryKey(),
  sessionId: uuid("session_id"),
  uniqueId: text("unique_id"),
  clientName: text("client_name"),
  reviewQueueId: text("review_queue_id"),
  posthogId: text("posthog_id"),
  vapiCallId: text("vapi_call_id"),
  authPhaseSmooth: boolean("auth_phase_smooth"),
  authPhaseDetails: text("auth_phase_details"),
  selectionPhaseSmooth: boolean("selection_phase_smooth"),
  selectionPhaseDetails: text("selection_phase_details"),
  initiationPhaseSmooth: boolean("initiation_phase_smooth"),
  initiationPhaseDetails: text("initiation_phase_details"),
  reportReviewPhaseSmooth: boolean("report_review_phase_smooth"),
  reportReviewPhaseDetails: text("report_review_phase_details"),
  totalDurationSeconds: text("total_duration_seconds"),
  userExperienceIssues: text("user_experience_issues"),
  evaluationId: text("evaluation_id"),
  greetStudentScore: text("greet_student_score"),
  greetStudentCriteria: text("greet_student_criteria"),
  understandFeelingsScore: text("understand_feelings_score"),
  understandFeelingsCriteria: text("understand_feelings_criteria"),
  provideOverviewScore: text("provide_overview_score"),
  provideOverviewCriteria: text("provide_overview_criteria"),
  goalReviewScore: text("goal_review_score"),
  goalReviewCriteria: text("goal_review_criteria"),
  competencyReviewScore: text("competency_review_score"),
  competencyReviewCriteria: text("competency_review_criteria"),
  purposeReviewScore: text("purpose_review_score"),
  purposeReviewCriteria: text("purpose_review_criteria"),
  keyEventsReflectionScore: text("key_events_reflection_score"),
  keyEventsReflectionCriteria: text("key_events_reflection_criteria"),
  goalSettingScore: text("goal_setting_score"),
  goalSettingCriteria: text("goal_setting_criteria"),
  closingScore: text("closing_score"),
  closingCriteria: text("closing_criteria"),
  recordingDurationSeconds: text("recording_duration_seconds"),
  userId: text("user_id"),
  fronteggId: text("frontegg_id"),
  clientId: text("client_id"),
  tenantId: text("tenant_id"),
  assignmentId: text("assignment_id"),
  plGroupId: text("pl_group_id"),
  scheduleId: text("schedule_id"),
  activityType: text("activity_type"),
  experienceType: text("experience_type"),
  simulationDataType: text("simulation_data_type"),
  publicUrl: text("public_url"),
  createdAt: timestamp("created_at"),
  hasVisionData: text("has_vision_data"),
  hasTranscriptData: text("has_transcript_data"),
  posthogVisionAiAnalysis: jsonb("posthog_vision_ai_analysis")
}); 