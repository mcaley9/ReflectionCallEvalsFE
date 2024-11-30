CREATE TYPE review_status_type AS ENUM (
    'Pending',   -- Default state when record is created
    'Ready',     -- Ready for review
    'Processing', -- Currently being processed
    'Skipped',   -- Decided to skip this review
    'Error',     -- Something went wrong during processing
    'Completed'  -- Review has been completed
);

CREATE TABLE IF NOT EXISTS "PostHog_Recordings_Review_Queue" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "PostHog_ID" VARCHAR(255) NOT NULL,
    "recording_duration" INTEGER NULL,
    "console_error_count" INTEGER NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
    "review_status" review_status_type NULL DEFAULT 'Pending',
    "error_reason" TEXT NULL,
    "skipped_reason" TEXT NULL,
    
    -- Session analysis fields
    "total_duration_seconds" INTEGER NULL,
    "total_events" INTEGER NULL,
    "user_id" VARCHAR NULL,
    "frontegg_id" VARCHAR NULL,
    "client_id" VARCHAR NULL,
    "tenant_id" VARCHAR NULL,
    "session_id" VARCHAR NULL,
    "assignment_id" VARCHAR NULL,
    "pl_group_id" INTEGER NULL,
    "schedule_id" VARCHAR NULL,
    "activity_type" VARCHAR NULL,
    "experience_type" VARCHAR NULL,
    "simulation_data_type" VARCHAR NULL,
    "active_feature_flags" TEXT[] NULL,
    "event_timeline" JSONB NULL,
    
    -- New sharing fields
    "public_url" TEXT NULL,
    "sharing_enabled" BOOLEAN NULL DEFAULT FALSE,
    
    -- AI Analysis fields
    "ai_analysis" JSONB NULL,
    "ai_analysis_metadata" JSONB NULL,
    
    CONSTRAINT PostHog_Recordings_Review_Queue_pkey PRIMARY KEY ("id"),
    CONSTRAINT PostHog_Recordings_Review_Queue_PostHog_ID_key UNIQUE ("PostHog_ID"),
    CONSTRAINT fk_posthog_recording 
        FOREIGN KEY ("PostHog_ID") 
        REFERENCES "Posthog_Recordings_Raw"("PostHog_ID")
        ON DELETE CASCADE,
    CONSTRAINT check_error_reason 
        CHECK (
            (review_status = 'Error' AND error_reason IS NOT NULL) OR 
            (review_status != 'Error' AND error_reason IS NULL)
        ),
    CONSTRAINT check_skipped_reason 
        CHECK (
            (review_status = 'Skipped' AND skipped_reason IS NOT NULL) OR 
            (review_status != 'Skipped' AND skipped_reason IS NULL)
        )
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recordings_review_queue_posthog_id 
ON "PostHog_Recordings_Review_Queue" USING btree ("PostHog_ID") TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_recordings_review_queue_status 
ON "PostHog_Recordings_Review_Queue" USING btree (review_status) TABLESPACE pg_default;

-- Add index for AI analysis fields (optional, but helpful if you plan to query these fields)
CREATE INDEX IF NOT EXISTS idx_recordings_review_queue_ai_analysis 
ON "PostHog_Recordings_Review_Queue" USING gin ("ai_analysis") TABLESPACE pg_default; 