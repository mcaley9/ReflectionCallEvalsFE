CREATE TABLE IF NOT EXISTS "Vapi_calls_raw" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "started_at" TIMESTAMP WITH TIME ZONE NULL,
    "ended_at" TIMESTAMP WITH TIME ZONE NULL,
    "duration_minutes" NUMERIC(10,2) NULL,
    "status" VARCHAR(50) NULL,
    "ended_reason" VARCHAR(100) NULL,
    "assistant_id" VARCHAR(100) NULL,
    "customer_id" VARCHAR(100) NULL,
    "metadata" JSONB NULL,
    "db_created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
    "messages" JSONB NULL,
    "user_id" TEXT NULL,
    "client_id" TEXT NULL,
    "tenant_id" TEXT NULL,
    "pl_group_id" TEXT NULL,
    "session_id" TEXT NULL,
    "client_name" TEXT NULL,
    "frontegg_id" TEXT NULL,
    "schedule_id" TEXT NULL,
    "activity_type" TEXT NULL,
    "assignment_id" TEXT NULL,
    "pl_group_id_url" TEXT NULL,
    "experience_type" TEXT NULL,
    "simulation_data_type" TEXT NULL,
    "vapi_call_id" TEXT NULL,
    CONSTRAINT vapi_calls_pkey PRIMARY KEY ("id")
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vapi_calls_created_at 
ON "Vapi_calls_raw" USING btree (created_at) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_vapi_calls_started_at 
ON "Vapi_calls_raw" USING btree (started_at) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_vapi_calls_status 
ON "Vapi_calls_raw" USING btree (status) TABLESPACE pg_default; 