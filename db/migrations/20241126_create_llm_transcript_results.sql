CREATE TABLE IF NOT EXISTS "LLM_Transcript_Results" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "evaluation_id" TEXT NOT NULL,
    "session_id" UUID NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "greet_student_score" TEXT NULL,
    "greet_student_criteria" JSONB NULL,
    "understand_feelings_score" TEXT NULL,
    "understand_feelings_criteria" JSONB NULL,
    "provide_overview_score" TEXT NULL,
    "provide_overview_criteria" JSONB NULL,
    "goal_review_score" TEXT NULL,
    "goal_review_criteria" JSONB NULL,
    "competency_review_score" TEXT NULL,
    "competency_review_criteria" JSONB NULL,
    "purpose_review_score" TEXT NULL,
    "purpose_review_criteria" JSONB NULL,
    "key_events_reflection_score" TEXT NULL,
    "key_events_reflection_criteria" JSONB NULL,
    "goal_setting_score" TEXT NULL,
    "goal_setting_criteria" JSONB NULL,
    "closing_score" TEXT NULL,
    "closing_criteria" JSONB NULL,
    "vapi_call_id" UUID NULL,
    "raw_analysis" JSONB NULL,

    CONSTRAINT reflection_transcript_analysis_pkey PRIMARY KEY ("id"),
    CONSTRAINT fk_vapi_call FOREIGN KEY ("vapi_call_id") 
        REFERENCES "Vapi_calls_raw" ("id") ON DELETE SET NULL,

    -- Score validation constraints
    CONSTRAINT reflection_transcript_analysis_greet_student_score_check 
        CHECK (greet_student_score IN ('yes', 'partial', 'missed', 'not reached', 'Not Applicable')),
    CONSTRAINT reflection_transcript_analysis_understand_feelings_score_check 
        CHECK (understand_feelings_score IN ('yes', 'partial', 'missed', 'not reached', 'Not Applicable')),
    CONSTRAINT reflection_transcript_analysis_provide_overview_score_check 
        CHECK (provide_overview_score IN ('yes', 'partial', 'missed', 'not reached', 'Not Applicable')),
    CONSTRAINT reflection_transcript_analysis_goal_review_score_check 
        CHECK (goal_review_score IN ('yes', 'partial', 'missed', 'not reached', 'Not Applicable')),
    CONSTRAINT reflection_transcript_analysis_competency_review_score_check 
        CHECK (competency_review_score IN ('yes', 'partial', 'missed', 'not reached', 'Not Applicable')),
    CONSTRAINT reflection_transcript_analysis_purpose_review_score_check 
        CHECK (purpose_review_score IN ('yes', 'partial', 'missed', 'not reached', 'Not Applicable')),
    CONSTRAINT reflection_transcript_analysi_key_events_reflection_score_check 
        CHECK (key_events_reflection_score IN ('yes', 'partial', 'missed', 'not reached', 'Not Applicable')),
    CONSTRAINT reflection_transcript_analysis_goal_setting_score_check 
        CHECK (goal_setting_score IN ('yes', 'partial', 'missed', 'not reached', 'Not Applicable')),
    CONSTRAINT reflection_transcript_analysis_closing_score_check 
        CHECK (closing_score IN ('yes', 'partial', 'missed', 'not reached', 'Not Applicable'))
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reflection_transcript_analysis_vapi_call_id 
    ON "LLM_Transcript_Results" USING btree (vapi_call_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_reflection_transcript_analysis_created_at 
    ON "LLM_Transcript_Results" USING btree (created_at) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_reflection_transcript_analysis_session_id 
    ON "LLM_Transcript_Results" USING btree (session_id) TABLESPACE pg_default; 