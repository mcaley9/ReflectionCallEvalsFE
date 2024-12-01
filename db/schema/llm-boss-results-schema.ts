import { pgTable, text, timestamp, uuid, boolean, integer, jsonb } from "drizzle-orm/pg-core";

export const llmBossResults = pgTable("LLM_Boss_Results", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id"),
  uniqueId: text("unique_id").notNull().unique(),
  smoothnessLevel: text("smoothness_level"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  status: text("status"),
  vapiCallId: uuid("vapi_call_id"),
  visionResultId: uuid("vision_result_id"),
  technicalScore: integer("technical_score"),
  conversationScore: integer("conversation_score"),
  overallScore: integer("overall_score"),
  confidenceLevel: text("confidence_level"),
  technicalHighlights: jsonb("technical_highlights"),
  technicalIssues: jsonb("technical_issues"),
  conversationHighlights: jsonb("conversation_highlights"),
  conversationIssues: jsonb("conversation_issues"),
  assessmentSummary: text("assessment_summary"),
  keyFactors: jsonb("key_factors"),
  technicalRecommendations: jsonb("technical_recommendations"),
  conversationalRecommendations: jsonb("conversational_recommendations"),
  improvementPriority: text("improvement_priority")
}); 