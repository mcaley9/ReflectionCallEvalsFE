CREATE TABLE IF NOT EXISTS "PostHog_Session_Details_Raw" (
    "PostHog_ID" VARCHAR(255) NOT NULL,
    "session_data" JSONB NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP WITH TIME ZONE,
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    CONSTRAINT PostHog_Session_Details_Raw_pkey PRIMARY KEY ("id"),
    CONSTRAINT PostHog_Session_Details_Raw_posthog_id_key UNIQUE ("PostHog_ID")
) TABLESPACE pg_default;

-- Create an index on PostHog_ID for faster lookups (though might not be needed with UNIQUE constraint)
CREATE INDEX IF NOT EXISTS idx_posthog_session_details_raw_posthog_id 
ON "PostHog_Session_Details_Raw" USING btree ("PostHog_ID") TABLESPACE pg_default; 