create view
  public.combined_llm_results as
select
  coalesce(v.id, t.id) as id,
  coalesce(v.session_id::uuid, t.session_id) as session_id,
  v.review_queue_id,
  v.posthog_id,
  t.vapi_call_id,
  v.auth_phase_smooth,
  v.auth_phase_details,
  v.selection_phase_smooth,
  v.selection_phase_details,
  v.initiation_phase_smooth,
  v.initiation_phase_details,
  v.total_duration_seconds,
  v.user_experience_issues,
  t.evaluation_id,
  t.greet_student_score,
  t.greet_student_criteria,
  t.understand_feelings_score,
  t.understand_feelings_criteria,
  t.provide_overview_score,
  t.provide_overview_criteria,
  t.goal_review_score,
  t.goal_review_criteria,
  t.competency_review_score,
  t.competency_review_criteria,
  t.purpose_review_score,
  t.purpose_review_criteria,
  t.key_events_reflection_score,
  t.key_events_reflection_criteria,
  t.goal_setting_score,
  t.goal_setting_criteria,
  t.closing_score,
  t.closing_criteria,
  pr.total_duration_seconds as recording_duration_seconds,
  coalesce(pr.user_id, vr.user_id) as user_id,
  coalesce(pr.frontegg_id, vr.frontegg_id) as frontegg_id,
  coalesce(pr.client_id, vr.client_id) as client_id,
  coalesce(pr.tenant_id, vr.tenant_id) as tenant_id,
  coalesce(pr.assignment_id, vr.assignment_id) as assignment_id,
  coalesce(pr.pl_group_id, vr.pl_group_id) as pl_group_id,
  coalesce(pr.schedule_id, vr.schedule_id) as schedule_id,
  coalesce(pr.activity_type, vr.activity_type) as activity_type,
  coalesce(pr.experience_type, vr.experience_type) as experience_type,
  pr.simulation_data_type,
  pr.public_url,
  coalesce(v.created_at, t.created_at) as created_at,
  case
    when v.id is not null then 'vision'::text
    else 'no vision'::text
  end as has_vision_data,
  case
    when t.id is not null then 'transcript'::text
    else 'no transcript'::text
  end as has_transcript_data
from
  "LLM_Vision_Results" v
  full join "LLM_Transcript_Results" t on v.session_id::uuid = t.session_id
  left join "PostHog_Recordings_Review_Queue" pr on v.posthog_id = pr."PostHog_ID"
  left join "Vapi_Transcripts_Review_Queue" vr on t.vapi_call_id = vr.vapi_call_id
where
  v.id is not null
  or t.id is not null;