-- Update timestamps for posthog_vision_analysis
CREATE TRIGGER update_posthog_vision_analysis_updated_at
    BEFORE UPDATE ON public.posthog_vision_analysis
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Update timestamps for vapi_call_analysis
CREATE TRIGGER update_vapi_call_analysis_updated_at
    BEFORE UPDATE ON public.vapi_call_analysis
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Update timestamps for posthog_session_details
CREATE TRIGGER update_posthog_session_details_updated_at
    BEFORE UPDATE ON public.posthog_session_details
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TRIGGER update_posthog_vision_analysis_updated_at ON public.posthog_vision_analysis IS 'Updates timestamp when vision analysis is modified';
COMMENT ON TRIGGER update_vapi_call_analysis_updated_at ON public.vapi_call_analysis IS 'Updates timestamp when call analysis is modified';
COMMENT ON TRIGGER update_posthog_session_details_updated_at ON public.posthog_session_details IS 'Updates timestamp when session details are modified'; 