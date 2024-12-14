CREATE OR REPLACE FUNCTION public.populate_vision_analysis_session_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.session_id = (
        SELECT session_id 
        FROM vapi_call_records 
        WHERE vapi_call_id = NEW.vapi_call_id
        LIMIT 1
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.populate_vision_analysis_session_id() IS 'Automatically populates session_id from vapi_call_records when a new vision analysis is created'; 