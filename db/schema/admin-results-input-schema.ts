import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const adminResultsInputTable = pgTable("admin_results_input", {
  id: uuid("id").defaultRandom().primaryKey(),
  uniqueId: text("unique_id").notNull(),
  phaseType: text("phase_type"),
  feedbackType: text("feedback_type", { enum: ['phase'] }).notNull(),
  sentiment: text("sentiment", { enum: ['up', 'down'] }),
  isFlagged: text("is_flagged").notNull(),
  overrideStatus: text("override_status", { enum: ['yes', 'partial', 'no', 'notreached'] }),
  comment: text("comment"),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}); 