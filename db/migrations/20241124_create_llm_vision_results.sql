CREATE TABLE IF NOT EXISTS public."LLM_Vision_Results" (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    review_queue_id UUID NOT NULL,
    posthog_id VARCHAR(255) NOT NULL,
    session_id VARCHAR NULL,
    auth_phase_smooth BOOLEAN NULL,
    auth_phase_details JSONB NULL,
    selection_phase_smooth BOOLEAN NULL,
    selection_phase_details JSONB NULL,
    initiation_phase_smooth BOOLEAN NULL,
    initiation_phase_details JSONB NULL,
    total_duration_seconds INTEGER NULL,
    user_experience_issues JSONB NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT llm_vision_results_pkey PRIMARY KEY (id),
    CONSTRAINT fk_review_queue
        FOREIGN KEY (review_queue_id)
        REFERENCES "PostHog_Recordings_Review_Queue"(id)
        ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_llm_vision_results_review_queue_id 
    ON public."LLM_Vision_Results" USING btree (review_queue_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_llm_vision_results_posthog_id 
    ON public."LLM_Vision_Results" USING btree (posthog_id) TABLESPACE pg_default; 