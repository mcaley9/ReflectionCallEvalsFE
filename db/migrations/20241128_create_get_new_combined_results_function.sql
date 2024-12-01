CREATE OR REPLACE FUNCTION public.get_new_combined_results()
RETURNS TABLE (
    unique_id TEXT,
    session_id UUID,
    posthog_id VARCHAR,
    vapi_call_id UUID,
    vision_result_id UUID,
    vapi_transcript_ai_analysis TEXT,
    posthog_vision_ai_analysis JSONB,
    transcript TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.unique_id,
        c.session_id,
        c.posthog_id,
        c.vapi_call_id,
        v.id as vision_result_id,
        c.vapi_transcript_ai_analysis,
        c.posthog_vision_ai_analysis,
        c.transcript
    FROM combined_llm_results c
    LEFT JOIN "LLM_Vision_Results" v ON c.posthog_id = v.posthog_id
    WHERE NOT EXISTS (
        SELECT 1 
        FROM "LLM_Boss_Results" b 
        WHERE b.unique_id = c.unique_id
    );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.get_new_combined_results IS 'Gets new entries from combined_llm_results that have not been processed by the boss worker yet';