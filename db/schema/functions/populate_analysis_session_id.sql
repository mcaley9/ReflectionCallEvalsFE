CREATE OR REPLACE FUNCTION public.populate_analysis_session_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.session_id = (
        SELECT session_id 
        FROM posthog_session_details 
        WHERE posthog_id = NEW.posthog_id_uuid
        LIMIT 1
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.populate_analysis_session_id() IS 'Automatically populates session_id from posthog_session_details when a new analysis is created'; 