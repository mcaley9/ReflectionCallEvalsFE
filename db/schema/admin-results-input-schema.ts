import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

export const adminResultsInputTable = pgTable('InStageAdmin_Results_Input', {
  id: uuid('id').defaultRandom().primaryKey(),
  uniqueId: text('unique_id').notNull(),
  phaseType: text('phase_type'),
  feedbackType: text('feedback_type', { enum: ['phase', 'boss'] }).notNull(),
  sentiment: text('sentiment', { enum: ['up', 'down'] }),
  isFlagged: boolean('is_flagged').default(false).notNull(),
  overrideStatus: text('override_status', { enum: ['yes', 'partial', 'no', 'notreached'] }),
  comment: text('comment'),
  createdBy: text('created_by').notNull(),
  updatedBy: text('updated_by').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export type AdminResultsInput = typeof adminResultsInputTable.$inferInsert; 