-- First, create a function that the trigger will use
CREATE OR REPLACE FUNCTION process_new_recording()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the recording meets our criteria:
    -- 1. Duration > 90 seconds
    -- 2. Has some user activity (mouse, clicks, or keypresses)
    IF (
        NEW.recording_duration > 90 
        AND (
            COALESCE(NEW.mouse_activity_count, 0) > 0 
            OR COALESCE(NEW.click_count, 0) > 0 
            OR COALESCE(NEW.keypress_count, 0) > 0
        )
    ) THEN
        -- Insert into review queue
        INSERT INTO "PostHog_Recordings_Review_Queue" (
            "PostHog_ID",
            "recording_duration",
            "console_error_count",
            "review_status"  -- Explicitly setting to 'Pending' for clarity
        ) VALUES (
            NEW."PostHog_ID",
            NEW.recording_duration,
            NEW.console_error_count,
            'Pending'
        )
        ON CONFLICT ("PostHog_ID") DO UPDATE 
        SET 
            "recording_duration" = EXCLUDED.recording_duration,
            "console_error_count" = EXCLUDED.console_error_count,
            "updated_at" = CURRENT_TIMESTAMP,
            -- Reset status to Pending if the recording is updated
            "review_status" = 'Pending',
            -- Clear any existing error or skip reasons since we're back to Pending
            "error_reason" = NULL,
            "skipped_reason" = NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS check_recording_criteria ON "Posthog_Recordings_Raw";

-- Create the trigger
CREATE TRIGGER check_recording_criteria
    AFTER INSERT OR UPDATE
    ON "Posthog_Recordings_Raw"
    FOR EACH ROW
    EXECUTE FUNCTION process_new_recording(); 