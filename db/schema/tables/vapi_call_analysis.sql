CREATE TABLE IF NOT EXISTS "public"."vapi_call_analysis" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "vapi_call_id" text,
    "cleaned_transcript" text,
    "llm_analysis" jsonb,
    "analysis_status" analysis_status NOT NULL DEFAULT 'pending',
    "error_message" text,
    "created_at" timestamptz DEFAULT now(),
    "updated_at" timestamptz DEFAULT now(),
    "processed_at" timestamptz,
    "analyzed_at" timestamptz,
    "langfuse_trace_url" text,
    "session_id" text,

    CONSTRAINT "vapi_call_analysis_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "vapi_call_analysis_vapi_call_id_fkey" FOREIGN KEY ("vapi_call_id") 
        REFERENCES "public"."vapi_call_records"("vapi_call_id"),
    CONSTRAINT "unique_vapi_call_analysis" UNIQUE ("vapi_call_id")
);

COMMENT ON TABLE "public"."vapi_call_analysis" IS 'Stores analysis results for VAPI calls'; 