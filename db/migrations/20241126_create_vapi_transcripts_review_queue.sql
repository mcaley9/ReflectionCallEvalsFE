CREATE TABLE IF NOT EXISTS "Vapi_Transcripts_Review_Queue" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "priority" INTEGER NULL DEFAULT 1,
    "status" TEXT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP WITH TIME ZONE NULL,
    "reviewed_by" TEXT NULL,
    "started_at" TIMESTAMP WITH TIME ZONE NULL,
    "completed_at" TIMESTAMP WITH TIME ZONE NULL,
    "error" TEXT NULL,
    "transcript" TEXT NULL,
    "transcript_metadata" JSONB NULL,
    "ai_analysis" TEXT NULL,
    "ai_analysis_metadata" JSONB NULL,
    "vapi_call_id" UUID NULL,
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
    "external_vapi_call_id" TEXT NULL,
    "processing_started_at" TIMESTAMP WITH TIME ZONE,
    "error_at" TIMESTAMP WITH TIME ZONE,

    CONSTRAINT transcripts_for_review_pkey PRIMARY KEY ("id"),
    CONSTRAINT transcripts_for_review_vapi_call_fkey 
        FOREIGN KEY ("vapi_call_id") 
        REFERENCES "Vapi_calls_raw" ("id") 
        ON DELETE SET NULL,
    CONSTRAINT transcripts_for_review_status_check 
        CHECK (status IN ('pending', 'in_review', 'reviewed', 'skipped', 'error'))
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transcripts_review_status 
    ON "Vapi_Transcripts_Review_Queue" USING btree (status) 
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_transcripts_review_priority 
    ON "Vapi_Transcripts_Review_Queue" USING btree (priority) 
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_transcripts_review_vapi_call_id 
    ON "Vapi_Transcripts_Review_Queue" USING btree (vapi_call_id) 
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_transcripts_review_user_id 
    ON "Vapi_Transcripts_Review_Queue" USING btree (user_id) 
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_transcripts_review_session_id 
    ON "Vapi_Transcripts_Review_Queue" USING btree (session_id) 
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_transcripts_review_assignment_id 
    ON "Vapi_Transcripts_Review_Queue" USING btree (assignment_id) 
    TABLESPACE pg_default; 