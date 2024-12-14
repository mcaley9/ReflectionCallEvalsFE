create view
  public.vapi_completed_analysis_view as
select
  va.id as analysis_id,
  va.vapi_call_id,
  vcr.session_id,
  vcr.user_id,
  vcr.client_id,
  vcr.tenant_id,
  vcr.assignment_id,
  vcr.pl_group_id,
  vcr.schedule_id,
  vcr.activity_type,
  vcr.experience_type,
  vcr.call_type,
  vcr.started_at,
  vcr.ended_at,
  vcr.duration_minutes,
  vcr.status,
  vcr.ended_reason,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage1'::text
    ) -> 'greetStudent'::text
  ) ->> 'score'::text as greet_student_score,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage1'::text
    ) -> 'greetStudent'::text
  ) -> 'criteria'::text as greet_student_criteria,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage1'::text
    ) -> 'understandCurrentFeelings'::text
  ) ->> 'score'::text as understand_feelings_score,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage1'::text
    ) -> 'understandCurrentFeelings'::text
  ) -> 'criteria'::text as understand_feelings_criteria,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage1'::text
    ) -> 'provideCallOverview'::text
  ) ->> 'score'::text as provide_overview_score,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage1'::text
    ) -> 'provideCallOverview'::text
  ) -> 'criteria'::text as provide_overview_criteria,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage1'::text
    ) -> 'goalReview'::text
  ) ->> 'score'::text as goal_review_score,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage1'::text
    ) -> 'goalReview'::text
  ) -> 'criteria'::text as goal_review_criteria,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage1'::text
    ) -> 'competencyReview'::text
  ) ->> 'score'::text as competency_review_score,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage1'::text
    ) -> 'competencyReview'::text
  ) -> 'criteria'::text as competency_review_criteria,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage1'::text
    ) -> 'purposeReview'::text
  ) ->> 'score'::text as purpose_review_score,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage1'::text
    ) -> 'purposeReview'::text
  ) -> 'criteria'::text as purpose_review_criteria,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage2'::text
    ) -> 'keyEventsReflection'::text
  ) ->> 'score'::text as key_events_reflection_score,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage2'::text
    ) -> 'keyEventsReflection'::text
  ) -> 'criteria'::text as key_events_reflection_criteria,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage3'::text
    ) -> 'goalSetting'::text
  ) ->> 'score'::text as goal_setting_score,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage3'::text
    ) -> 'goalSetting'::text
  ) -> 'criteria'::text as goal_setting_criteria,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage4'::text
    ) -> 'closing'::text
  ) ->> 'score'::text as closing_score,
  (
    (
      (va.llm_analysis -> 'stages'::text) -> 'stage4'::text
    ) -> 'closing'::text
  ) -> 'criteria'::text as closing_criteria,
  va.llm_analysis ->> 'evaluationId'::text as evaluation_id,
  va.langfuse_trace_url,
  va.cleaned_transcript,
  va.created_at,
  va.updated_at,
  va.processed_at,
  va.analyzed_at
from
  vapi_call_analysis va
  join vapi_call_records vcr on va.vapi_call_id = vcr.vapi_call_id
where
  va.analysis_status = 'analyzed'::analysis_status;