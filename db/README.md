# Supabase Configuration

This directory contains the database configuration, schemas, and migrations for the InStage Evaluations Backend.

## Directory Structure

```plaintext
supabase/
├── .gitignore
├── config.toml              # Supabase project configuration
├── migrations/             # Database migration files
│   ├── YYYYMMDD_name.sql   # Timestamped migration files
├── schemas/               # Current database schema documentation
    ├── tables/            # Table definitions
    │   ├── posthog_recording_records.sql
    │   ├── posthog_session_details.sql
    │   ├── posthog_vision_analysis.sql
    │   ├── vapi_call_analysis.sql
    │   └── vapi_call_records.sql
    ├── types/
    │   └── enums/         # Enumerated types
    │       ├── analysis_status.sql
    │       └── membership.sql
    ├── functions/         # Database functions and triggers
    │   ├── populate_analysis_session_id.sql
    │   ├── populate_vision_analysis_session_id.sql
    │   ├── update_updated_at_column.sql
    │   └── triggers/      # Trigger definitions
    │       ├── populate_session_ids.sql
    │       └── update_timestamps.sql
    └── views/            # Database views
        ├── posthog_completed_analysis_view.sql
        └── vapi_completed_analysis_view.sql
```

## Usage

### Migrations
- New migrations are created using `supabase migration new <name>`
- Apply migrations with `supabase db push`
- Reset database with `supabase db reset`

### Schema Documentation
The `schemas/` directory provides a clear reference of the current database structure:
- `tables/`: Core table definitions
- `types/enums/`: Custom enumerated types
- `functions/`: Database functions and their associated triggers
- `views/`: Complex queries saved as views

### Key Tables
- `posthog_recording_records`: Stores session recordings data
- `posthog_session_details`: Stores processed PostHog sessions
- `posthog_vision_analysis`: Stores vision analysis results
- `vapi_call_records`: Stores VAPI call recording data
- `vapi_call_analysis`: Stores VAPI call analysis results

### Views
- `posthog_completed_analysis_view`: Combines PostHog recordings with their analysis
- `vapi_completed_analysis_view`: Combines VAPI calls with their analysis

## Development

1. Make schema changes in a new migration file
2. Update corresponding schema documentation
3. Test locally using `supabase start`
4. Push changes using `supabase db push`

## Notes

- The `schemas/` directory is for documentation purposes and doesn't affect the database
- Always create new migrations for schema changes
- Keep schema documentation in sync with migrations 