# Email Notification Webhook Setup Guide

This guide will help you set up automatic email notifications whenever a new questionnaire submission is received in your Supabase database.

## Overview

The system uses:
- **Supabase Edge Functions** (serverless function to send emails)
- **Database Trigger** (automatically calls the function on new submissions)
- **Resend** (email delivery service - free tier: 100 emails/day)

## Prerequisites

1. Supabase project (you already have this)
2. Supabase CLI installed
3. Resend account (free tier available)

---

## Step 1: Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Or using npm
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

---

## Step 2: Set Up Resend (Email Service)

### 2.1 Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email

### 2.2 Add Your Domain (Recommended)
1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `hairsquad.com`)
4. Add the DNS records shown to your domain provider
5. Wait for verification (usually a few minutes)

**OR** use Resend's onboarding domain for testing: `onboarding@resend.dev`

### 2.3 Get Your API Key
1. Go to **API Keys** in Resend dashboard
2. Click **Create API Key**
3. Name it "Hair Squad Webhook"
4. Copy the API key (starts with `re_...`)
5. **Save it securely** - you'll need it in Step 4

---

## Step 3: Link Your Supabase Project

```bash
# Navigate to your project directory
cd /Users/patri/Documents/hr2shopify

# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID
```

To find your `PROJECT_ID`:
- Go to your Supabase dashboard
- Your URL looks like: `https://app.supabase.com/project/YOUR_PROJECT_ID`
- Copy the PROJECT_ID part

---

## Step 4: Deploy the Edge Function

### 4.1 Set Environment Variables (Secrets)

```bash
# Set your Resend API key
supabase secrets set RESEND_API_KEY=re_your_actual_api_key_here

# Set the email address where you want to receive notifications
supabase secrets set NOTIFICATION_EMAIL=your-email@example.com
```

Replace:
- `re_your_actual_api_key_here` with your actual Resend API key from Step 2.3
- `your-email@example.com` with your email address

### 4.2 Update the Email "From" Address

Before deploying, edit this file:
```
supabase/functions/notify-new-submission/index.ts
```

Find line 44 and update it:
```typescript
from: "Hair Squad Notifications <notifications@yourdomain.com>",
```

Replace `yourdomain.com` with:
- Your verified domain from Resend, OR
- Use `onboarding@resend.dev` for testing

### 4.3 Deploy the Function

```bash
# Deploy the Edge Function
supabase functions deploy notify-new-submission
```

You should see:
```
✅ Deployed Function notify-new-submission
```

---

## Step 5: Set Up the Database Trigger

### 5.1 Get Your Project URL

You need your Supabase project URL. Find it in your Supabase dashboard:
- Format: `https://YOUR_PROJECT_ID.supabase.co`

### 5.2 Update the SQL File

Edit this file:
```
supabase/setup-webhook-trigger.sql
```

Find line 20 and replace `YOUR_PROJECT_ID`:
```sql
function_url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/notify-new-submission';
```

### 5.3 Run the SQL in Supabase

1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire contents of `supabase/setup-webhook-trigger.sql`
5. Paste it into the editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

You should see:
```
Success. No rows returned
```

If you see the verification query results at the bottom, your trigger is set up correctly!

---

## Step 6: Test the Webhook

### Option A: Insert a Test Record via SQL

In the Supabase SQL Editor, run:

```sql
INSERT INTO questionnaire_submissions (email, reason, full_data)
VALUES ('test@example.com', 'losing', '{"test": true}');
```

### Option B: Submit the Actual Form

1. Go to your website
2. Navigate to the hair quiz page
3. Complete and submit the questionnaire
4. Check your notification email inbox

---

## Verify It's Working

You should receive an email at the address you set in Step 4.1 that looks like:

**Subject:** New Hair Quiz Submission from test@example.com

**Body:** Contains submission details, date, and a link to your Supabase dashboard

---

## Troubleshooting

### No email received?

1. **Check Supabase Logs:**
   ```bash
   supabase functions logs notify-new-submission
   ```

2. **Check if trigger fired:**
   In Supabase SQL Editor:
   ```sql
   SELECT * FROM questionnaire_submissions ORDER BY created_at DESC LIMIT 1;
   ```

3. **Verify secrets are set:**
   ```bash
   supabase secrets list
   ```
   You should see `RESEND_API_KEY` and `NOTIFICATION_EMAIL`

4. **Check Resend Dashboard:**
   - Go to resend.com
   - Click **Logs** to see if the email was sent
   - Check for any errors

5. **Common issues:**
   - Wrong API key → Check your `.env` or secrets
   - Domain not verified → Use `onboarding@resend.dev` for testing
   - Wrong email address → Check `NOTIFICATION_EMAIL` secret
   - Function not deployed → Run `supabase functions deploy` again

### Edge Function errors?

Check the logs:
```bash
supabase functions logs notify-new-submission --tail
```

Then trigger a test submission to see real-time errors.

---

## Customization

### Change Email Template

Edit `supabase/functions/notify-new-submission/index.ts`:
- Modify the `generateEmailHTML()` function (starting around line 92)
- Redeploy: `supabase functions deploy notify-new-submission`

### Send to Multiple Recipients

In Supabase secrets, set multiple emails:
```bash
supabase secrets set NOTIFICATION_EMAIL="email1@example.com,email2@example.com"
```

Then update the function to split the string:
```typescript
const recipients = NOTIFICATION_EMAIL.split(',').map(e => e.trim());
// ... in the email payload:
to: recipients,
```

### Add SMS Notifications

You can add Twilio or another SMS service to the Edge Function to also send SMS alerts.

---

## Monitoring

### View all Edge Function invocations:
```bash
supabase functions logs notify-new-submission
```

### View recent submissions in database:
```sql
SELECT email, created_at, reason
FROM questionnaire_submissions
ORDER BY created_at DESC
LIMIT 10;
```

---

## Cost

- **Supabase Edge Functions:** 500K invocations/month free, then $2 per 1M
- **Resend:** 100 emails/day free, 3,000/month on paid plan ($20/mo)
- **pg_net (database HTTP):** Included in Supabase

For a typical hair quiz with ~100 submissions/month, this stays **completely free**.

---

## Alternative: Webhook URL (No Edge Function)

If you prefer not to use Edge Functions, you can use a webhook service like:

1. **Zapier** - Connect Supabase to Gmail/Email
2. **Make.com** - Similar workflow automation
3. **Your own server** - Point the trigger to your API endpoint

The database trigger SQL works the same way, just change the `function_url` to your webhook endpoint.

---

## Support

If you encounter issues:

1. Check the Supabase documentation: https://supabase.com/docs/guides/functions
2. Check Resend documentation: https://resend.com/docs
3. Review the troubleshooting section above
4. Check the logs for specific error messages

---

## Files Reference

- `supabase/functions/notify-new-submission/index.ts` - Edge Function code
- `supabase/setup-webhook-trigger.sql` - Database trigger SQL
- This file - Setup instructions

---

**Last Updated:** 2026-02-16
