-- Hair Squad Questionnaire Submissions Table
-- Run this SQL in your Supabase SQL Editor to create the table

CREATE TABLE IF NOT EXISTS questionnaire_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

  -- Contact information
  email TEXT NOT NULL,

  -- Q1: What brings you here
  reason TEXT, -- 'losing', 'stable', 'no-loss'

  -- Q2-Q6: Triage questions (only if reason != 'no-loss')
  onset_time TEXT, -- '<3mo', '3-6mo', '6-12mo', '>12mo'
  onset_type TEXT, -- 'sudden', 'gradual'
  pattern TEXT, -- 'diffuse', 'shedding', 'widening', 'receding', 'patchy'
  scalp_symptoms TEXT[], -- array: 'itch', 'burning', 'pain', 'dandruff', 'redness', 'pimples', 'none'
  breakage_vs_shedding TEXT, -- 'breakage', 'shedding', 'both', 'unsure'

  -- Q7: Personal basics
  age INTEGER,
  sex TEXT, -- 'female', 'male'
  pregnant TEXT, -- 'yes', 'no'
  postpartum TEXT, -- 'yes', 'no'
  cycles TEXT, -- 'regular', 'irregular', 'na'
  bleeding TEXT, -- 'light', 'normal', 'heavy', 'very-heavy'

  -- Q8-Q11: Diet and lifestyle
  diet TEXT, -- 'omnivore', 'pescatarian', 'vegetarian', 'vegan'
  dieted TEXT, -- 'yes', 'no'
  sun TEXT, -- 'most-days', '1-3-week', 'rarely'
  exclusions TEXT[], -- array: 'gluten-free', 'dairy-free', 'low-fat', 'low-carb', 'none'

  -- Q12-Q14: Symptom grids (stored as JSONB for flexibility)
  iron_symptoms JSONB, -- {fatigue: 'yes'/'no'/'unsure', breath: ..., dizziness: ..., cravings: ..., nails: ...}
  vitd_symptoms JSONB, -- {low_sun: 'yes'/'no'/'unsure', bone_aches: ..., infections: ..., winter_mood: ...}
  b12_symptoms JSONB, -- {tongue: 'yes'/'no'/'unsure', memory: ..., wound: ..., cold_intolerance: ...}

  -- Full data backup (in case we need it)
  full_data JSONB
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_questionnaire_email ON questionnaire_submissions(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_questionnaire_created_at ON questionnaire_submissions(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE questionnaire_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for the public form)
CREATE POLICY "Allow public inserts" ON questionnaire_submissions
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads only for authenticated users (for admin access)
CREATE POLICY "Allow authenticated reads" ON questionnaire_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Optional: Grant access to service role
GRANT ALL ON questionnaire_submissions TO service_role;

-- Grant insert access to anon role (for public form submissions)
GRANT INSERT ON questionnaire_submissions TO anon;
