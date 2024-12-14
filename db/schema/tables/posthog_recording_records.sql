CREATE TABLE IF NOT EXISTS "public"."posthog_recording_records" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "posthog_id" uuid NOT NULL,
    "recording_duration" interval,
    "active_seconds" integer,
    "inactive_seconds" integer,
    "click_count" integer DEFAULT 0,
    "keypress_count" integer DEFAULT 0,
    "mouse_activity_count" integer DEFAULT 0,
    "console_log_count" integer DEFAULT 0,
    "console_warn_count" integer DEFAULT 0,
    "console_error_count" integer DEFAULT 0,
    "start_url" text,
    "ongoing" boolean DEFAULT false,
    "start_time" timestamptz NOT NULL,
    "end_time" timestamptz,
    "created_at" timestamptz DEFAULT now(),
    "updated_at" timestamptz DEFAULT now(),
    
    CONSTRAINT "posthog_recording_records_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "posthog_recording_records_posthog_id_key" UNIQUE ("posthog_id")
);

COMMENT ON TABLE "public"."posthog_recording_records" IS 'Stores and manages PostHog session recordings data including user interactions and console events';