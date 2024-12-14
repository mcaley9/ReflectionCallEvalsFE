-- Populate session IDs for PostHog analysis
CREATE TRIGGER populate_posthog_analysis_session_id
    BEFORE INSERT ON public.posthog_vision_analysis
    FOR EACH ROW
    EXECUTE FUNCTION public.populate_analysis_session_id();

-- Populate session IDs for VAPI analysis
CREATE TRIGGER populate_vapi_analysis_session_id
    BEFORE INSERT ON public.vapi_call_analysis
    FOR EACH ROW
    EXECUTE FUNCTION public.populate_vision_analysis_session_id();

COMMENT ON TRIGGER populate_posthog_analysis_session_id ON public.posthog_vision_analysis IS 'Automatically populates session_id for new PostHog analyses';
COMMENT ON TRIGGER populate_vapi_analysis_session_id ON public.vapi_call_analysis IS 'Automatically populates session_id for new VAPI analyses'; 