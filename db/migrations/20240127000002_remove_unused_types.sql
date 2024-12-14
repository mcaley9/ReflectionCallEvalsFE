-- Drop unused enum types
DROP TYPE IF EXISTS public.feedback_sentiment;
DROP TYPE IF EXISTS public.feedback_type;
DROP TYPE IF EXISTS public.llm_boss_results_status;
DROP TYPE IF EXISTS public.review_status_type;

COMMENT ON TYPE public.analysis_status IS 'Status tracking for analysis processing stages';
COMMENT ON TYPE public.membership IS 'User membership level'; 