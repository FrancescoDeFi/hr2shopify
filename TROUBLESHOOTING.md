# Troubleshooting Guide - No Rows in Supabase

## Issue: Form submissions not appearing in Supabase

### Step 1: Get the Correct API Key

The API key format `sb_publishable_HuflliXdhboCnoXJ3mHI8Q_7wl49GnE` doesn't look like a standard Supabase anon key. Here's how to get the correct one:

1. Go to your Supabase dashboard: https://app.supabase.com/project/dixwqzkpwwxyukcwygzt
2. Click on **Settings** (gear icon in the left sidebar)
3. Click on **API** in the settings menu
4. Look for **Project API keys** section
5. Copy the **anon** **public** key (it should start with `eyJ...`)
6. The key is a long JWT token, something like:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpeHdxemtwd3d4eXVrY3d5Z3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NTU2NjAsImV4cCI6MjAyNTEzMTY2MH0.XXXXX...
   ```

7. Update `shopify-dawn/snippets/supabase-client.liquid` line 4 with the correct key:
   ```javascript
   window.SUPABASE_KEY = 'eyJ...YOUR_ACTUAL_KEY_HERE';
   ```

### Step 2: Verify the Database Table Exists

1. Go to Supabase dashboard → **Table Editor**
2. Look for `questionnaire_submissions` table in the list
3. If it doesn't exist, go to **SQL Editor**
4. Run the SQL from `supabase-schema.sql`
5. Refresh the Table Editor

### Step 3: Check RLS Policies

1. Go to **Authentication** → **Policies** in Supabase dashboard
2. Find the `questionnaire_submissions` table
3. Verify these policies exist:
   - **"Allow public inserts"** - for INSERT operations
   - **"Allow authenticated reads"** - for SELECT operations

If they don't exist, run the SQL schema again.

### Step 4: Test the Connection

1. Open `test-supabase.html` in your browser
2. Click **"1. Test Connection"** - should show ✓ Connection successful
3. Click **"2. Test Table Exists"** - should show ✓ Table exists
4. Click **"3. Test Insert"** - should show ✓ Insert successful
5. If any fail, note the error message

### Step 5: Test the Live Form

1. Open your Shopify site
2. Go to the questionnaire page
3. Open browser **Developer Tools** (F12)
4. Go to the **Console** tab
5. Fill out and submit the questionnaire
6. Look for `[Supabase]` log messages in the console
7. Check for any errors (they'll be in red)

### Step 6: Check Browser Console Errors

Common errors and solutions:

**Error: 401 Unauthorized**
- Your API key is incorrect
- Get the correct anon/public key from Supabase settings

**Error: 404 Not Found**
- Table doesn't exist
- Run the SQL schema in Supabase SQL Editor

**Error: 403 Forbidden**
- RLS policy is blocking inserts
- Verify "Allow public inserts" policy exists
- Check the policy has `WITH CHECK (true)`

**Error: 400 Bad Request**
- Data format issue
- Check console logs to see what data is being sent
- Verify field types match the schema

**Error: CORS Error**
- Your Shopify domain needs to be allowed
- Go to Supabase → Settings → API → CORS
- Add your Shopify domain (e.g., `https://your-store.myshopify.com`)

### Step 7: Manual Test Insert

Try inserting directly via Supabase dashboard:

1. Go to **Table Editor** → `questionnaire_submissions`
2. Click **Insert row**
3. Fill in at minimum:
   - `email`: test@example.com
   - `reason`: losing
4. Click **Save**
5. If this works, the problem is with the form/API key
6. If this fails, check the table schema

### Step 8: Check the Data Being Sent

Add this temporarily to your form to see what's being submitted:

1. Edit `shopify-dawn/assets/questionnaire.js`
2. Find the `submitQuizData` function (around line 230)
3. Add at the top:
   ```javascript
   console.log('=== FULL SUBMISSION DATA ===');
   console.log(JSON.stringify(data, null, 2));
   alert('Check console for data');
   ```
4. Submit the form and check what appears in the console

### Quick Fix Checklist

- [ ] Updated API key with correct anon/public key from Supabase settings
- [ ] Ran `supabase-schema.sql` in Supabase SQL Editor
- [ ] Table `questionnaire_submissions` exists in Table Editor
- [ ] RLS policy "Allow public inserts" exists and has `WITH CHECK (true)`
- [ ] Tested with `test-supabase.html` - all tests pass
- [ ] Pushed updated code to Shopify
- [ ] Cleared browser cache / tried in incognito mode
- [ ] Checked browser console for `[Supabase]` log messages

## Still Not Working?

Share the following information:

1. **Console logs** when submitting the form (copy the `[Supabase]` messages)
2. **Test results** from `test-supabase.html`
3. **Screenshot** of Supabase Table Editor showing the table structure
4. **RLS policies** screenshot from Supabase dashboard

## Alternative: Use Supabase JS Client

If issues persist, we can switch to using the official Supabase JS client library instead of raw fetch calls. Let me know if you'd like to try that approach.
