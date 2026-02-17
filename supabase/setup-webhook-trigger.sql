-- Supabase Database Trigger Setup for Email Notifications
-- This creates a webhook that calls the Edge Function when new questionnaire submissions are inserted

-- Step 1: Create a webhook configuration for the Edge Function
-- Run this in the Supabase SQL Editor

-- First, create a function to invoke the Edge Function
CREATE OR REPLACE FUNCTION notify_new_questionnaire_submission()
RETURNS TRIGGER AS $$
DECLARE
  payload JSONB;
  function_url TEXT;
BEGIN
  -- Construct the payload to send to the Edge Function
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'record', row_to_json(NEW),
    'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END
  );

  -- Your Edge Function URL (replace with your actual project URL)
  -- Format: https://YOUR_PROJECT_ID.supabase.co/functions/v1/notify-new-submission
  function_url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/notify-new-submission';

  -- Use pg_net to make HTTP request to Edge Function
  -- Note: You need to enable the pg_net extension first
  PERFORM
    net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('request.jwt.claims', true)::json->>'anon_key'
      ),
      body := payload
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create the trigger on questionnaire_submissions table
DROP TRIGGER IF EXISTS on_questionnaire_submission_created ON questionnaire_submissions;

CREATE TRIGGER on_questionnaire_submission_created
  AFTER INSERT ON questionnaire_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_questionnaire_submission();

-- Step 3: Enable the pg_net extension (if not already enabled)
-- This allows making HTTP requests from the database
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA net TO postgres, anon, authenticated, service_role;

-- Verify the trigger was created
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_questionnaire_submission_created';

-- Test the setup (optional - comment out if you don't want to test immediately)
-- This will insert a test record and should trigger the email notification
-- INSERT INTO questionnaire_submissions (email, reason, full_data)
-- VALUES ('test@example.com', 'losing', '{"test": true}');
