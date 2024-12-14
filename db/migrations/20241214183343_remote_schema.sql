

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "drizzle";


ALTER SCHEMA "drizzle" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."analysis_status" AS ENUM (
    'pending',
    'processed',
    'analyzed',
    'failed'
);


ALTER TYPE "public"."analysis_status" OWNER TO "postgres";


CREATE TYPE "public"."feedback_sentiment" AS ENUM (
    'up',
    'down'
);


ALTER TYPE "public"."feedback_sentiment" OWNER TO "postgres";


CREATE TYPE "public"."feedback_type" AS ENUM (
    'phase',
    'boss'
);


ALTER TYPE "public"."feedback_type" OWNER TO "postgres";


CREATE TYPE "public"."llm_boss_results_status" AS ENUM (
    'Ready',
    'Error',
    'Complete'
);


ALTER TYPE "public"."llm_boss_results_status" OWNER TO "postgres";


CREATE TYPE "public"."membership" AS ENUM (
    'free',
    'pro'
);


ALTER TYPE "public"."membership" OWNER TO "postgres";


CREATE TYPE "public"."review_status_type" AS ENUM (
    'Pending',
    'Ready',
    'Processing',
    'Skipped',
    'Error',
    'Completed'
);


ALTER TYPE "public"."review_status_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_tables"("schema_name" "text") RETURNS TABLE("table_name" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    RETURN QUERY
    SELECT t.tablename::text
    FROM pg_catalog.pg_tables t
    WHERE t.schemaname = schema_name;
END;
$$;


ALTER FUNCTION "public"."get_tables"("schema_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."populate_analysis_session_id"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Will set NULL if either:
    -- 1. No matching record is found
    -- 2. The matching record has a NULL session_id
    NEW.session_id = (
        SELECT session_id 
        FROM vapi_call_records 
        WHERE vapi_call_id = NEW.vapi_call_id
        LIMIT 1  -- Just to be extra safe
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."populate_analysis_session_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."populate_vision_analysis_session_id"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    UPDATE posthog_vision_analysis 
    SET session_id = (
        SELECT session_id
        FROM posthog_session_details 
        WHERE posthog_id = NEW.posthog_id_uuid
        LIMIT 1
    )
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."populate_vision_analysis_session_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_combined_analysis_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_combined_analysis_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
    "id" integer NOT NULL,
    "hash" "text" NOT NULL,
    "created_at" bigint
);


ALTER TABLE "drizzle"."__drizzle_migrations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "drizzle"."__drizzle_migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "drizzle"."__drizzle_migrations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "drizzle"."__drizzle_migrations_id_seq" OWNED BY "drizzle"."__drizzle_migrations"."id";



CREATE TABLE IF NOT EXISTS "public"."posthog_recording_records" (
    "posthog_id" "uuid" NOT NULL,
    "recording_duration" interval,
    "active_seconds" integer,
    "inactive_seconds" integer,
    "click_count" integer DEFAULT 0,
    "keypress_count" integer DEFAULT 0,
    "mouse_activity_count" integer DEFAULT 0,
    "console_log_count" integer DEFAULT 0,
    "console_warn_count" integer DEFAULT 0,
    "console_error_count" integer DEFAULT 0,
    "start_url" "text",
    "ongoing" boolean DEFAULT false,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."posthog_recording_records" OWNER TO "postgres";


COMMENT ON TABLE "public"."posthog_recording_records" IS 'Stores and manages PostHog session recordings data including user interactions and console events';



COMMENT ON COLUMN "public"."posthog_recording_records"."posthog_id" IS 'Unique identifier from PostHog for the recording';



COMMENT ON COLUMN "public"."posthog_recording_records"."recording_duration" IS 'Total duration of the recording';



COMMENT ON COLUMN "public"."posthog_recording_records"."active_seconds" IS 'Number of seconds where user activity was detected';



COMMENT ON COLUMN "public"."posthog_recording_records"."inactive_seconds" IS 'Number of seconds where no user activity was detected';



COMMENT ON COLUMN "public"."posthog_recording_records"."start_url" IS 'URL where the recording session began';



COMMENT ON COLUMN "public"."posthog_recording_records"."ongoing" IS 'Indicates if the recording session is still in progress';



CREATE TABLE IF NOT EXISTS "public"."posthog_session_details" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "posthog_id" "uuid" NOT NULL,
    "session_data" "jsonb" NOT NULL,
    "duration_seconds" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "text",
    "frontegg_id" "text",
    "client_id" "text",
    "tenant_id" "text",
    "session_id" "text",
    "assignment_id" "text",
    "pl_group_id" "text",
    "schedule_id" "text",
    "activity_type" "text",
    "experience_type" "text",
    "total_events" integer,
    "total_duration_seconds" integer,
    "event_timeline" "jsonb",
    "processed_at" timestamp with time zone,
    "public_url" "text"
);


ALTER TABLE "public"."posthog_session_details" OWNER TO "postgres";


COMMENT ON TABLE "public"."posthog_session_details" IS 'Stores processed PostHog session recordings and their metadata';



COMMENT ON COLUMN "public"."posthog_session_details"."session_data" IS 'Raw session data from PostHog';



COMMENT ON COLUMN "public"."posthog_session_details"."event_timeline" IS 'Filtered timeline of major events, minor events, and navigation';



COMMENT ON COLUMN "public"."posthog_session_details"."processed_at" IS 'Timestamp when the raw data was parsed into individual columns';



COMMENT ON COLUMN "public"."posthog_session_details"."public_url" IS 'The public URL for accessing the PostHog recording';



CREATE TABLE IF NOT EXISTS "public"."posthog_vision_analysis" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "llm_analysis" "jsonb",
    "analysis_status" "public"."analysis_status" DEFAULT 'pending'::"public"."analysis_status" NOT NULL,
    "error_message" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "analyzed_at" timestamp with time zone,
    "langfuse_trace_url" "text",
    "session_id" "text",
    "posthog_id_uuid" "uuid" NOT NULL
);


ALTER TABLE "public"."posthog_vision_analysis" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."posthog_completed_analysis_view" AS
 SELECT "pva"."id" AS "analysis_id",
    "pva"."posthog_id_uuid",
    "psd"."session_id",
    "psd"."user_id",
    "psd"."frontegg_id",
    "psd"."client_id",
    "psd"."tenant_id",
    "psd"."assignment_id",
    "psd"."pl_group_id",
    "psd"."schedule_id",
    "psd"."activity_type",
    "psd"."experience_type",
    "prr"."start_time",
    "prr"."end_time",
    "prr"."recording_duration",
    "prr"."active_seconds",
    "prr"."inactive_seconds",
    "prr"."click_count",
    "prr"."keypress_count",
    "prr"."mouse_activity_count",
    "psd"."public_url",
    "pva"."langfuse_trace_url",
    (((("pva"."llm_analysis" -> 'phase_analysis'::"text") -> 'authentication'::"text") ->> 'is_smooth'::"text"))::boolean AS "auth_phase_smooth",
    ((("pva"."llm_analysis" -> 'phase_analysis'::"text") -> 'authentication'::"text") -> 'issues'::"text") AS "auth_phase_issues",
    (((("pva"."llm_analysis" -> 'phase_analysis'::"text") -> 'call_selection'::"text") ->> 'is_smooth'::"text"))::boolean AS "selection_phase_smooth",
    ((("pva"."llm_analysis" -> 'phase_analysis'::"text") -> 'call_selection'::"text") -> 'issues'::"text") AS "selection_phase_issues",
    (((("pva"."llm_analysis" -> 'phase_analysis'::"text") -> 'call_initiation'::"text") ->> 'is_smooth'::"text"))::boolean AS "initiation_phase_smooth",
    ((("pva"."llm_analysis" -> 'phase_analysis'::"text") -> 'call_initiation'::"text") -> 'issues'::"text") AS "initiation_phase_issues",
    (((("pva"."llm_analysis" -> 'phase_analysis'::"text") -> 'report_review'::"text") ->> 'is_smooth'::"text"))::boolean AS "report_review_phase_smooth",
    ((("pva"."llm_analysis" -> 'phase_analysis'::"text") -> 'report_review'::"text") -> 'issues'::"text") AS "report_review_phase_issues",
    ((("pva"."llm_analysis" -> 'overall_analysis'::"text") ->> 'total_duration_seconds'::"text"))::integer AS "total_duration_seconds",
    ((("pva"."llm_analysis" -> 'overall_analysis'::"text") ->> 'excess_time_seconds'::"text"))::integer AS "excess_time_seconds",
    ((("pva"."llm_analysis" -> 'overall_analysis'::"text") ->> 'exceeds_target'::"text"))::boolean AS "exceeds_target",
    (("pva"."llm_analysis" -> 'overall_analysis'::"text") -> 'user_experience_issues'::"text") AS "user_experience_issues",
    ("pva"."llm_analysis" -> 'timeline'::"text") AS "timeline",
    "pva"."created_at",
    "pva"."updated_at",
    "pva"."analyzed_at"
   FROM (("public"."posthog_vision_analysis" "pva"
     JOIN "public"."posthog_session_details" "psd" ON (("pva"."posthog_id_uuid" = "psd"."posthog_id")))
     JOIN "public"."posthog_recording_records" "prr" ON (("pva"."posthog_id_uuid" = "prr"."posthog_id")))
  WHERE ("pva"."analysis_status" = 'analyzed'::"public"."analysis_status");


ALTER TABLE "public"."posthog_completed_analysis_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "user_id" "text" NOT NULL,
    "membership" "public"."membership" DEFAULT 'free'::"public"."membership" NOT NULL,
    "stripe_customer_id" "text",
    "stripe_subscription_id" "text",
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vapi_call_analysis" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "vapi_call_id" "text",
    "cleaned_transcript" "text",
    "llm_analysis" "jsonb",
    "analysis_status" "public"."analysis_status" DEFAULT 'pending'::"public"."analysis_status" NOT NULL,
    "error_message" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "processed_at" timestamp with time zone,
    "analyzed_at" timestamp with time zone,
    "langfuse_trace_url" "text",
    "session_id" "text"
);


ALTER TABLE "public"."vapi_call_analysis" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vapi_call_records" (
    "id" "uuid" NOT NULL,
    "created_at" timestamp with time zone,
    "started_at" timestamp with time zone,
    "ended_at" timestamp with time zone,
    "duration_minutes" double precision,
    "status" "text",
    "ended_reason" "text",
    "vapi_call_id" "text",
    "db_created_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb",
    "messages" "jsonb",
    "user_id" "text",
    "client_id" "text",
    "tenant_id" "text",
    "pl_group_id" "text",
    "session_id" "text",
    "client_name" "text",
    "frontegg_id" "text",
    "schedule_id" "text",
    "activity_type" "text",
    "assignment_id" "text",
    "pl_group_id_url" "text",
    "experience_type" "text",
    "call_type" "text"
);


ALTER TABLE "public"."vapi_call_records" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vapi_completed_analysis_view" AS
 SELECT "va"."id" AS "analysis_id",
    "va"."vapi_call_id",
    "vcr"."session_id",
    "vcr"."user_id",
    "vcr"."client_id",
    "vcr"."tenant_id",
    "vcr"."assignment_id",
    "vcr"."pl_group_id",
    "vcr"."schedule_id",
    "vcr"."activity_type",
    "vcr"."experience_type",
    "vcr"."call_type",
    "vcr"."started_at",
    "vcr"."ended_at",
    "vcr"."duration_minutes",
    "vcr"."status",
    "vcr"."ended_reason",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage1'::"text") -> 'greetStudent'::"text") ->> 'score'::"text") AS "greet_student_score",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage1'::"text") -> 'greetStudent'::"text") -> 'criteria'::"text") AS "greet_student_criteria",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage1'::"text") -> 'understandCurrentFeelings'::"text") ->> 'score'::"text") AS "understand_feelings_score",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage1'::"text") -> 'understandCurrentFeelings'::"text") -> 'criteria'::"text") AS "understand_feelings_criteria",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage1'::"text") -> 'provideCallOverview'::"text") ->> 'score'::"text") AS "provide_overview_score",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage1'::"text") -> 'provideCallOverview'::"text") -> 'criteria'::"text") AS "provide_overview_criteria",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage1'::"text") -> 'goalReview'::"text") ->> 'score'::"text") AS "goal_review_score",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage1'::"text") -> 'goalReview'::"text") -> 'criteria'::"text") AS "goal_review_criteria",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage1'::"text") -> 'competencyReview'::"text") ->> 'score'::"text") AS "competency_review_score",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage1'::"text") -> 'competencyReview'::"text") -> 'criteria'::"text") AS "competency_review_criteria",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage1'::"text") -> 'purposeReview'::"text") ->> 'score'::"text") AS "purpose_review_score",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage1'::"text") -> 'purposeReview'::"text") -> 'criteria'::"text") AS "purpose_review_criteria",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage2'::"text") -> 'keyEventsReflection'::"text") ->> 'score'::"text") AS "key_events_reflection_score",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage2'::"text") -> 'keyEventsReflection'::"text") -> 'criteria'::"text") AS "key_events_reflection_criteria",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage3'::"text") -> 'goalSetting'::"text") ->> 'score'::"text") AS "goal_setting_score",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage3'::"text") -> 'goalSetting'::"text") -> 'criteria'::"text") AS "goal_setting_criteria",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage4'::"text") -> 'closing'::"text") ->> 'score'::"text") AS "closing_score",
    (((("va"."llm_analysis" -> 'stages'::"text") -> 'stage4'::"text") -> 'closing'::"text") -> 'criteria'::"text") AS "closing_criteria",
    ("va"."llm_analysis" ->> 'evaluationId'::"text") AS "evaluation_id",
    "va"."cleaned_transcript",
    "va"."created_at",
    "va"."updated_at",
    "va"."processed_at",
    "va"."analyzed_at"
   FROM ("public"."vapi_call_analysis" "va"
     JOIN "public"."vapi_call_records" "vcr" ON (("va"."vapi_call_id" = "vcr"."vapi_call_id")))
  WHERE ("va"."analysis_status" = 'analyzed'::"public"."analysis_status");


ALTER TABLE "public"."vapi_completed_analysis_view" OWNER TO "postgres";


COMMENT ON VIEW "public"."vapi_completed_analysis_view" IS 'Combines completed Vapi call analyses with call details and transcripts';



ALTER TABLE ONLY "drizzle"."__drizzle_migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"drizzle"."__drizzle_migrations_id_seq"'::"regclass");



ALTER TABLE ONLY "drizzle"."__drizzle_migrations"
    ADD CONSTRAINT "__drizzle_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posthog_recording_records"
    ADD CONSTRAINT "posthog_recording_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posthog_recording_records"
    ADD CONSTRAINT "posthog_recording_records_posthog_id_key" UNIQUE ("posthog_id");



ALTER TABLE ONLY "public"."posthog_session_details"
    ADD CONSTRAINT "posthog_session_details_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posthog_session_details"
    ADD CONSTRAINT "posthog_session_details_posthog_id_key" UNIQUE ("posthog_id");



ALTER TABLE ONLY "public"."posthog_vision_analysis"
    ADD CONSTRAINT "posthog_vision_analysis_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."posthog_vision_analysis"
    ADD CONSTRAINT "unique_posthog_vision_analysis" UNIQUE ("posthog_id_uuid");



ALTER TABLE ONLY "public"."vapi_call_analysis"
    ADD CONSTRAINT "unique_vapi_call_analysis" UNIQUE ("vapi_call_id");



ALTER TABLE ONLY "public"."vapi_call_analysis"
    ADD CONSTRAINT "vapi_call_analysis_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vapi_call_records"
    ADD CONSTRAINT "vapi_call_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vapi_call_records"
    ADD CONSTRAINT "vapi_call_records_vapi_call_id_key" UNIQUE ("vapi_call_id");



CREATE INDEX "idx_posthog_completed_view_client_created" ON "public"."posthog_session_details" USING "btree" ("client_id", "created_at");



CREATE INDEX "idx_posthog_completed_view_session" ON "public"."posthog_session_details" USING "btree" ("session_id");



CREATE INDEX "idx_posthog_recording_records_ongoing" ON "public"."posthog_recording_records" USING "btree" ("ongoing") WHERE ("ongoing" = true);



CREATE INDEX "idx_posthog_recording_records_start_time" ON "public"."posthog_recording_records" USING "btree" ("start_time");



CREATE INDEX "idx_posthog_session_details_activity_type" ON "public"."posthog_session_details" USING "btree" ("activity_type");



CREATE INDEX "idx_posthog_session_details_assignment_id" ON "public"."posthog_session_details" USING "btree" ("assignment_id");



CREATE INDEX "idx_posthog_session_details_public_url" ON "public"."posthog_session_details" USING "btree" ("public_url");



CREATE INDEX "idx_posthog_session_details_tenant_id" ON "public"."posthog_session_details" USING "btree" ("tenant_id");



CREATE INDEX "idx_posthog_session_details_user_id" ON "public"."posthog_session_details" USING "btree" ("user_id");



CREATE INDEX "idx_posthog_vision_analysis_posthog_id" ON "public"."posthog_vision_analysis" USING "btree" ("posthog_id_uuid");



CREATE INDEX "idx_posthog_vision_analysis_session_id" ON "public"."posthog_vision_analysis" USING "btree" ("session_id");



CREATE INDEX "idx_posthog_vision_analysis_status" ON "public"."posthog_vision_analysis" USING "btree" ("analysis_status");



CREATE INDEX "idx_posthog_vision_analysis_trace_url" ON "public"."posthog_vision_analysis" USING "btree" ("langfuse_trace_url");



CREATE INDEX "idx_vapi_call_analysis_session_id" ON "public"."vapi_call_analysis" USING "btree" ("session_id");



CREATE INDEX "idx_vapi_call_analysis_status" ON "public"."vapi_call_analysis" USING "btree" ("analysis_status");



CREATE INDEX "idx_vapi_call_analysis_trace_url" ON "public"."vapi_call_analysis" USING "btree" ("langfuse_trace_url");



CREATE INDEX "idx_vapi_call_analysis_vapi_call_id" ON "public"."vapi_call_analysis" USING "btree" ("vapi_call_id");



CREATE INDEX "idx_vapi_call_records_created_at" ON "public"."vapi_call_records" USING "btree" ("created_at");



CREATE INDEX "idx_vapi_call_records_vapi_call_id" ON "public"."vapi_call_records" USING "btree" ("vapi_call_id");



CREATE INDEX "idx_vapi_completed_view_client_created" ON "public"."vapi_call_records" USING "btree" ("client_id", "created_at");



CREATE INDEX "idx_vapi_completed_view_session" ON "public"."vapi_call_records" USING "btree" ("session_id");



CREATE INDEX "posthog_session_details_created_at_idx" ON "public"."posthog_session_details" USING "btree" ("created_at");



CREATE INDEX "posthog_session_details_duration_seconds_idx" ON "public"."posthog_session_details" USING "btree" ("duration_seconds");



CREATE OR REPLACE TRIGGER "new_posthog_recording_record" AFTER INSERT ON "public"."posthog_recording_records" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://c169b32ff71e.ngrok.app/webhook/supabase', 'POST', '{"Content-type":"application/json"}', '{}', '5000');



CREATE OR REPLACE TRIGGER "new_vapi_call_record" AFTER INSERT ON "public"."vapi_call_records" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://c169b32ff71e.ngrok.app/webhook/supabase', 'POST', '{"Content-type":"application/json"}', '{}', '5000');



CREATE OR REPLACE TRIGGER "trigger_populate_analysis_session_id" BEFORE INSERT ON "public"."vapi_call_analysis" FOR EACH ROW EXECUTE FUNCTION "public"."populate_analysis_session_id"();



CREATE OR REPLACE TRIGGER "trigger_populate_vision_analysis_session_id" AFTER INSERT ON "public"."posthog_vision_analysis" FOR EACH ROW EXECUTE FUNCTION "public"."populate_vision_analysis_session_id"();



CREATE OR REPLACE TRIGGER "update_posthog_recording_records_updated_at" BEFORE UPDATE ON "public"."posthog_recording_records" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_posthog_vision_analysis_updated_at" BEFORE UPDATE ON "public"."posthog_vision_analysis" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_vapi_call_analysis_updated_at" BEFORE UPDATE ON "public"."vapi_call_analysis" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."posthog_session_details"
    ADD CONSTRAINT "fk_posthog_id" FOREIGN KEY ("posthog_id") REFERENCES "public"."posthog_recording_records"("posthog_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posthog_vision_analysis"
    ADD CONSTRAINT "fk_posthog_vision_analysis_session_details" FOREIGN KEY ("posthog_id_uuid") REFERENCES "public"."posthog_session_details"("posthog_id");



ALTER TABLE ONLY "public"."vapi_call_analysis"
    ADD CONSTRAINT "vapi_call_analysis_vapi_call_id_fkey" FOREIGN KEY ("vapi_call_id") REFERENCES "public"."vapi_call_records"("vapi_call_id");



CREATE POLICY "Allow all operations for authenticated users" ON "public"."posthog_recording_records" TO "authenticated" USING (true) WITH CHECK (true);





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON FUNCTION "public"."get_tables"("schema_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_tables"("schema_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_tables"("schema_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."populate_analysis_session_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."populate_analysis_session_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."populate_analysis_session_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."populate_vision_analysis_session_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."populate_vision_analysis_session_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."populate_vision_analysis_session_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_combined_analysis_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_combined_analysis_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_combined_analysis_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."posthog_recording_records" TO "anon";
GRANT ALL ON TABLE "public"."posthog_recording_records" TO "authenticated";
GRANT ALL ON TABLE "public"."posthog_recording_records" TO "service_role";



GRANT ALL ON TABLE "public"."posthog_session_details" TO "anon";
GRANT ALL ON TABLE "public"."posthog_session_details" TO "authenticated";
GRANT ALL ON TABLE "public"."posthog_session_details" TO "service_role";



GRANT ALL ON TABLE "public"."posthog_vision_analysis" TO "anon";
GRANT ALL ON TABLE "public"."posthog_vision_analysis" TO "authenticated";
GRANT ALL ON TABLE "public"."posthog_vision_analysis" TO "service_role";



GRANT ALL ON TABLE "public"."posthog_completed_analysis_view" TO "anon";
GRANT ALL ON TABLE "public"."posthog_completed_analysis_view" TO "authenticated";
GRANT ALL ON TABLE "public"."posthog_completed_analysis_view" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."vapi_call_analysis" TO "anon";
GRANT ALL ON TABLE "public"."vapi_call_analysis" TO "authenticated";
GRANT ALL ON TABLE "public"."vapi_call_analysis" TO "service_role";



GRANT ALL ON TABLE "public"."vapi_call_records" TO "anon";
GRANT ALL ON TABLE "public"."vapi_call_records" TO "authenticated";
GRANT ALL ON TABLE "public"."vapi_call_records" TO "service_role";



GRANT ALL ON TABLE "public"."vapi_completed_analysis_view" TO "anon";
GRANT ALL ON TABLE "public"."vapi_completed_analysis_view" TO "authenticated";
GRANT ALL ON TABLE "public"."vapi_completed_analysis_view" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
