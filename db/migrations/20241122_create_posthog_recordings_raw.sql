CREATE TABLE IF NOT EXISTS "Posthog_Recordings_Raw" (
    "PostHog_ID" VARCHAR(255) NOT NULL,
    "distinct_id" VARCHAR(255),
    "recording_duration" INTEGER,
    "active_seconds" INTEGER,
    "inactive_seconds" INTEGER,
    "start_time" TIMESTAMP WITH TIME ZONE,
    "end_time" TIMESTAMP WITH TIME ZONE,
    "click_count" INTEGER,
    "keypress_count" INTEGER,
    "mouse_activity_count" INTEGER,
    "console_log_count" INTEGER,
    "console_warn_count" INTEGER,
    "console_error_count" INTEGER,
    "start_url" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "ongoing" BOOLEAN,
    CONSTRAINT Posthog_Recordings_Raw_pkey PRIMARY KEY ("id"),
    CONSTRAINT Posthog_Recordings_Raw_posthog_id_key UNIQUE ("PostHog_ID")
) TABLESPACE pg_default;

-- Create an index on PostHog_ID for faster lookups (though might not be needed with UNIQUE constraint)
CREATE INDEX IF NOT EXISTS idx_posthog_recordings_raw_posthog_id 
ON "Posthog_Recordings_Raw" USING btree ("PostHog_ID") TABLESPACE pg_default;
  