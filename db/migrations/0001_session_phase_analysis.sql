DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS "session_phase_analysis" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "session_id" UUID NOT NULL,
    "timestamp" TIMESTAMPTZ DEFAULT NOW(),
    "auth_phase_smooth" BOOLEAN,
    "auth_phase_details" jsonb,
    "selection_phase_smooth" BOOLEAN,
    "selection_phase_details" jsonb,
    "initiation_phase_smooth" BOOLEAN,
    "initiation_phase_details" jsonb,
    "total_duration_seconds" INTEGER,
    "user_experience_issues" jsonb,
    "recording_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT "fk_session" FOREIGN KEY ("session_id") REFERENCES "recordings_for_review" ("id") ON DELETE CASCADE
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_session_phase_analysis_session_id" ON "session_phase_analysis" ("session_id");

--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_session_phase_analysis_recording_id" ON "session_phase_analysis" ("recording_id"); 