import { bigint, boolean, index, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const sessionPhaseAnalysisTable = pgTable("session_phase_analysis", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  sessionId: uuid("session_id").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
  authPhaseSmooth: boolean("auth_phase_smooth"),
  authPhaseDetails: jsonb("auth_phase_details"),
  selectionPhaseSmooth: boolean("selection_phase_smooth"),
  selectionPhaseDetails: jsonb("selection_phase_details"),
  initiationPhaseSmooth: boolean("initiation_phase_smooth"),
  initiationPhaseDetails: jsonb("initiation_phase_details"),
  totalDurationSeconds: bigint("total_duration_seconds", { mode: "number" }),
  userExperienceIssues: jsonb("user_experience_issues"),
  recordingId: uuid("recording_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => {
  return {
    sessionIdIdx: index("idx_session_phase_analysis_session_id").on(table.sessionId),
    recordingIdIdx: index("idx_session_phase_analysis_recording_id").on(table.recordingId)
  };
});

export type InsertSessionPhaseAnalysis = typeof sessionPhaseAnalysisTable.$inferInsert;
export type SelectSessionPhaseAnalysis = typeof sessionPhaseAnalysisTable.$inferSelect; 