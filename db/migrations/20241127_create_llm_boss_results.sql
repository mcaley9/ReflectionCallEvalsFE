create table
  public."LLM_Boss_Results" (
    id uuid not null default gen_random_uuid (),
    session_id uuid null,
    vapi_call_id uuid null,
    vision_result_id uuid null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    smoothness_level text null,
    vision_analysis_available boolean null default false,
    transcript_analysis_available boolean null default false,
    raw_transcript_available boolean null default false,
    technical_score integer null,
    conversation_score integer null,
    overall_score integer null,
    confidence_level text null,
    technical_highlights jsonb null,
    technical_issues jsonb null,
    conversation_highlights jsonb null,
    conversation_issues jsonb null,
    assessment_summary text null,
    key_factors jsonb null,
    technical_recommendations jsonb null,
    conversational_recommendations jsonb null,
    improvement_priority text null,
    unique_id text not null,
    vapi_transcript_ai_analysis text null,
    posthog_vision_ai_analysis jsonb null,
    transcript text null,
    status public.llm_boss_results_status null default 'Ready'::llm_boss_results_status,
    constraint llm_boss_results_pkey primary key (id),
    constraint unique_llm_boss_results_unique_id unique (unique_id),
    constraint fk_vapi_call foreign key (vapi_call_id) references "Vapi_calls_raw" (id) on delete set null,
    constraint fk_vision_results foreign key (vision_result_id) references "LLM_Vision_Results" (id) on delete set null,
    constraint LLM_Boss_Results_smoothness_level_check check (
      (
        smoothness_level = any (
          array[
            'completely_smooth'::text,
            'mostly_smooth'::text,
            'not_smooth'::text
          ]
        )
      )
    ),
    constraint LLM_Boss_Results_confidence_level_check check (
      (
        confidence_level = any (array['high'::text, 'medium'::text, 'low'::text])
      )
    ),
    constraint LLM_Boss_Results_technical_score_check check (
      (
        (technical_score >= 1)
        and (technical_score <= 10)
      )
    ),
    constraint LLM_Boss_Results_conversation_score_check check (
      (
        (conversation_score >= 1)
        and (conversation_score <= 10)
      )
    ),
    constraint LLM_Boss_Results_improvement_priority_check check (
      (
        improvement_priority = any (
          array[
            'technical'::text,
            'conversational'::text,
            'both'::text,
            'none'::text
          ]
        )
      )
    ),
    constraint LLM_Boss_Results_overall_score_check check (
      (
        (overall_score >= 1)
        and (overall_score <= 10)
      )
    )
  ) tablespace pg_default;

create index if not exists idx_llm_boss_results_session_id on public."LLM_Boss_Results" using btree (session_id) tablespace pg_default;

create index if not exists idx_llm_boss_results_vapi_call_id on public."LLM_Boss_Results" using btree (vapi_call_id) tablespace pg_default;

create index if not exists idx_llm_boss_results_vision_result_id on public."LLM_Boss_Results" using btree (vision_result_id) tablespace pg_default;

create index if not exists idx_llm_boss_results_created_at on public."LLM_Boss_Results" using btree (created_at) tablespace pg_default;

create index if not exists idx_llm_boss_results_smoothness_level on public."LLM_Boss_Results" using btree (smoothness_level) tablespace pg_default;

create index if not exists idx_llm_boss_results_unique_id on public."LLM_Boss_Results" using btree (unique_id) tablespace pg_default;