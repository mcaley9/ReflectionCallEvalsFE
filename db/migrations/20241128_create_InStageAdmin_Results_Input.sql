CREATE TYPE public.feedback_type AS ENUM ('phase', 'boss');
CREATE TYPE public.feedback_sentiment AS ENUM ('up', 'down');

CREATE TABLE IF NOT EXISTS public."InStageAdmin_Results_Input" (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    unique_id TEXT NOT NULL, -- matches unique_id from combined_llm_results
    phase_type TEXT NULL, -- NULL for boss feedback, phase name for phase feedback
    feedback_type feedback_type NOT NULL,
    sentiment feedback_sentiment NULL,
    is_flagged BOOLEAN NOT NULL DEFAULT false,
    override_status TEXT NULL,
    comment TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL, -- store user identifier
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT NOT NULL, -- store user identifier

    CONSTRAINT InStageAdmin_Results_Input_pkey PRIMARY KEY (id),
    
    -- Ensure override_status matches allowed values from transcript results
    CONSTRAINT InStageAdmin_Results_Input_override_status_check 
        CHECK (override_status IN ('yes', 'partial', 'no', 'notreached', NULL)),

    -- Create a unique constraint to prevent multiple feedbacks for same phase/boss
    CONSTRAINT unique_feedback_per_phase 
        UNIQUE (unique_id, phase_type, feedback_type),

    -- Add foreign key to ensure unique_id exists in results
    CONSTRAINT fk_combined_results 
        FOREIGN KEY (unique_id) 
        REFERENCES public."LLM_Boss_Results" (unique_id) 
        ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_InStageAdmin_Results_Input_unique_id 
    ON public."InStageAdmin_Results_Input" USING btree (unique_id);

CREATE INDEX IF NOT EXISTS idx_InStageAdmin_Results_Input_phase_type 
    ON public."InStageAdmin_Results_Input" USING btree (phase_type);

CREATE INDEX IF NOT EXISTS idx_InStageAdmin_Results_Input_created_at 
    ON public."InStageAdmin_Results_Input" USING btree (created_at);

COMMENT ON TABLE public."InStageAdmin_Results_Input" IS 'Stores user feedback for both phase details and LLM boss analysis';
