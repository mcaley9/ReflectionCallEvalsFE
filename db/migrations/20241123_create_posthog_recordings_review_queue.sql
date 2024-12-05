create table
  public."PostHog_Recordings_Review_Queue" (
    id uuid not null default extensions.uuid_generate_v4 (),
    "PostHog_ID" character varying(255) not null,
    recording_duration integer null,
    console_error_count integer null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    review_status public.review_status_type null default 'Pending'::review_status_type,
    error_reason text null,
    skipped_reason text null,
    total_duration_seconds integer null,
    total_events integer null,
    user_id character varying null,
    frontegg_id character varying null,
    client_id character varying null,
    tenant_id character varying null,
    session_id character varying null,
    assignment_id character varying null,
    pl_group_id integer null,
    schedule_id character varying null,
    activity_type character varying null,
    experience_type character varying null,
    simulation_data_type character varying null,
    active_feature_flags text[] null,
    event_timeline jsonb null,
    public_url text null,
    sharing_enabled boolean null default false,
    ai_analysis jsonb null,
    ai_analysis_metadata jsonb null,
    trace_url text null,
    constraint posthog_recordings_review_queue_pkey primary key (id),
    constraint posthog_recordings_review_queue_posthog_id_key unique ("PostHog_ID"),
    constraint fk_posthog_recording foreign key ("PostHog_ID") references "Posthog_Recordings_Raw" ("PostHog_ID") on delete cascade,
    constraint check_error_reason check (
      (
        (
          (review_status = 'Error'::review_status_type)
          and (error_reason is not null)
        )
        or (
          (review_status <> 'Error'::review_status_type)
          and (error_reason is null)
        )
      )
    ),
    constraint check_skipped_reason check (
      (
        (
          (review_status = 'Skipped'::review_status_type)
          and (skipped_reason is not null)
        )
        or (
          (review_status <> 'Skipped'::review_status_type)
          and (skipped_reason is null)
        )
      )
    )
  ) tablespace pg_default;

create index if not exists idx_recordings_review_queue_posthog_id on public."PostHog_Recordings_Review_Queue" using btree ("PostHog_ID") tablespace pg_default;

create index if not exists idx_recordings_review_queue_status on public."PostHog_Recordings_Review_Queue" using btree (review_status) tablespace pg_default;