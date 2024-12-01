create table
  public."InStageAdmin_Results_Input" (
    id uuid not null default gen_random_uuid (),
    unique_id text not null,
    phase_type text null,
    feedback_type public.feedback_type not null,
    sentiment public.feedback_sentiment null,
    is_flagged boolean not null default false,
    override_status text null,
    comment text null,
    created_at timestamp with time zone not null default current_timestamp,
    created_by text not null,
    updated_at timestamp with time zone not null default current_timestamp,
    updated_by text not null,
    constraint instageadmin_results_input_pkey primary key (id),
    constraint unique_feedback_per_phase unique (unique_id, phase_type, feedback_type),
    constraint fk_combined_results foreign key (unique_id) references "LLM_Boss_Results" (unique_id) on delete cascade,
    constraint instageadmin_results_input_override_status_check check (
      (
        override_status = any (
          array[
            'yes'::text,
            'partial'::text,
            'no'::text,
            'notreached'::text,
            null::text
          ]
        )
      )
    )
  ) tablespace pg_default;

create index if not exists idx_instageadmin_results_input_unique_id on public."InStageAdmin_Results_Input" using btree (unique_id) tablespace pg_default;

create index if not exists idx_instageadmin_results_input_phase_type on public."InStageAdmin_Results_Input" using btree (phase_type) tablespace pg_default;

create index if not exists idx_instageadmin_results_input_created_at on public."InStageAdmin_Results_Input" using btree (created_at) tablespace pg_default;