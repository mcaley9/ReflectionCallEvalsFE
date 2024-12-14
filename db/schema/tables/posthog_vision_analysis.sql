CREATE TABLE IF NOT EXISTS "public"."posthog_vision_analysis" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "posthog_id_uuid" uuid NOT NULL,
    "llm_analysis" jsonb,
    "analysis_status" analysis_status NOT NULL DEFAULT 'pending',
    "error_message" text,
    "created_at" timestamptz DEFAULT now(),
    "updated_at" timestamptz DEFAULT now(),
    "analyzed_at" timestamptz,
    "langfuse_trace_url" text,
    "session_id" text,

    CONSTRAINT "posthog_vision_analysis_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "posthog_vision_analysis_posthog_id_key" UNIQUE ("posthog_id_uuid")
);

COMMENT ON TABLE "public"."posthog_vision_analysis" IS 'Stores vision analysis results for PostHog recordings'; 