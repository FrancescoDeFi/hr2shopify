# Supabase Integration Setup

## Overview
The questionnaire form now saves all submission data directly to Supabase instead of Shopify.

## Setup Instructions

### 1. Create the Database Table

1. Go to your Supabase dashboard: https://dixwqzkpwwxyukcwygzt.supabase.co
2. Navigate to the **SQL Editor**
3. Copy the contents of `supabase-schema.sql`
4. Paste and run the SQL script
5. This will create:
   - `questionnaire_submissions` table with all form fields
   - Indexes for performance
   - Row Level Security (RLS) policies
   - Public insert access for form submissions

### 2. Verify Configuration

The Supabase client is already configured in your theme with:
- **Project URL**: `https://dixwqzkpwwxyukcwygzt.supabase.co`
- **Public Key**: `sb_publishable_HuflliXdhboCnoXJ3mHI8Q_7wl49GnE`

Configuration files:
- `shopify-dawn/snippets/supabase-client.liquid` - Supabase client setup
- `shopify-dawn/layout/theme.liquid` - Includes the Supabase client
- `shopify-dawn/assets/questionnaire.js` - Updated to save to Supabase

### 3. Test the Integration

1. Deploy your Shopify theme changes
2. Visit the questionnaire page
3. Fill out the form and submit
4. Check the Supabase dashboard → **Table Editor** → `questionnaire_submissions`
5. You should see your submission data

### 4. View Submissions

To view all submissions:
1. Go to Supabase dashboard
2. Navigate to **Table Editor**
3. Select the `questionnaire_submissions` table
4. All submissions will be displayed with timestamps

### 5. Export Data

You can export data from Supabase:
- **Via Dashboard**: Use the Table Editor → Export button
- **Via API**: Use the Supabase REST API with service role key
- **Via SQL**: Run queries in the SQL Editor

## Data Structure

The table stores:
- **Contact**: email
- **Triage**: reason, onset_time, onset_type, pattern, scalp_symptoms, breakage_vs_shedding
- **Personal**: age, sex, pregnant, postpartum, cycles, bleeding
- **Lifestyle**: diet, dieted, sun, exclusions
- **Symptoms**: iron_symptoms, vitd_symptoms, b12_symptoms (as JSON objects)
- **Backup**: full_data (complete JSON of all answers)
- **Metadata**: id (UUID), created_at (timestamp)

## Security

- **Public Inserts**: Anyone can submit the form (needed for public questionnaire)
- **Authenticated Reads**: Only logged-in users can view submissions
- **Service Role**: Full access for admin operations
- **RLS Enabled**: Row Level Security protects the data

## Fallback

If Supabase is unavailable:
- Data is saved to browser's localStorage
- Klaviyo integration still works (if configured)
- Error is logged to browser console

## Notes

- Old Shopify form submissions are no longer saved
- Shopify customer creation has been removed
- Shopify contact form is no longer used
- All data now goes directly to Supabase
