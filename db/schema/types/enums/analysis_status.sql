CREATE TYPE public.analysis_status AS ENUM (
    'pending',      -- Initial state
    'processed',    -- Transcript cleaned
    'analyzed',     -- LLM analysis complete
    'failed'        -- Processing failed
);

COMMENT ON TYPE public.analysis_status IS 'Status tracking for analysis processing stages'; 