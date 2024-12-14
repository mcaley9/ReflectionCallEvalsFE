CREATE TABLE IF NOT EXISTS "public"."posthog_session_details" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "posthog_id" uuid NOT NULL,
    "session_data" jsonb NOT NULL,
    "duration_seconds" integer,
    "created_at" timestamptz DEFAULT now(),
    "updated_at" timestamptz DEFAULT now(),
    "user_id" text,
    "frontegg_id" text,
    "client_id" text,
    "tenant_id" text,
    "session_id" text,
    "assignment_id" text,
    "pl_group_id" text,
    "schedule_id" text,
    "activity_type" text,
    "experience_type" text,
    "total_events" integer,
    "total_duration_seconds" integer,
    "event_timeline" jsonb,
    "processed_at" timestamptz,
    "public_url" text,

    CONSTRAINT "posthog_session_details_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "posthog_session_details_posthog_id_key" UNIQUE ("posthog_id")
);

COMMENT ON TABLE "public"."posthog_session_details" IS 'Stores processed PostHog session recordings and their metadata';
