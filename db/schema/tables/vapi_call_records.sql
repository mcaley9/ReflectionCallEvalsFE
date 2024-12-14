CREATE TABLE IF NOT EXISTS "public"."vapi_call_records" (
    "id" uuid PRIMARY KEY,
    "vapi_call_id" text UNIQUE,
    "created_at" timestamptz,
    "started_at" timestamptz,
    "ended_at" timestamptz,
    "duration_minutes" float,
    "status" text,
    "ended_reason" text,
    "db_created_at" timestamptz DEFAULT now(),
    "metadata" jsonb,
    "messages" jsonb,
    "user_id" text,
    "client_id" text,
    "tenant_id" text,
    "pl_group_id" text,
    "session_id" text,
    "client_name" text,
    "frontegg_id" text,
    "schedule_id" text,
    "activity_type" text,
    "assignment_id" text,
    "pl_group_id_url" text,
    "experience_type" text,
    "call_type" text
);

COMMENT ON TABLE "public"."vapi_call_records" IS 'Stores VAPI call recording data and metadata'; 