# How to Get Your Supabase Anon Public Key

## ⚠️ Important: Use the RIGHT Key

You have **TWO** different API keys in Supabase:

1. **`anon` `public`** key - ✅ USE THIS ONE (safe for browsers/frontend)
2. **`service_role` `secret`** key - ❌ DO NOT USE (only for backend/server)

You provided the **secret** key (`sb_secret_...`) but we need the **public** key.

## Steps to Get the Anon Public Key

### Option 1: Via Dashboard

1. Go to your Supabase project: https://app.supabase.com/project/dixwqzkpwwxyukcwygzt
2. Click **Settings** (gear icon) in the left sidebar
3. Click **API** under Project Settings
4. Under **Project API keys** section, you'll see two keys:
   - **`anon` `public`** ← Copy this one (starts with `eyJ...`)
   - **`service_role` `secret`** ← DO NOT use this

5. Copy the entire **anon public** key (it's very long, 100+ characters)

### Option 2: Via Project Settings

1. Go to https://supabase.com/dashboard/project/dixwqzkpwwxyukcwygzt/settings/api
2. Look for the section **Project API keys**
3. Find the key labeled **anon public**
4. Click the **Copy** button next to it

## Update Your Code

Once you have the correct key:

1. Open `shopify-dawn/snippets/supabase-client.liquid`
2. Replace line 6:
   ```javascript
   window.SUPABASE_KEY = 'PASTE_YOUR_ANON_PUBLIC_KEY_HERE';
   ```

   With:
   ```javascript
   window.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your actual anon key
   ```

3. Push to Shopify
4. Test the form

## What Each Key Does

### Anon Public Key (✅ Use This)
- Safe to expose in frontend/browser code
- Works with Row Level Security (RLS) policies
- Respects your database security rules
- Users can only do what your RLS policies allow

### Service Role Secret Key (❌ Don't Use)
- NEVER expose in frontend/browser code
- Bypasses ALL Row Level Security policies
- Has full admin access to your database
- Only for backend/server-side code
- If leaked, anyone can access/modify all your data

## Security Note

The **secret** key you shared (`<service-role-secret-key>`) should:
- ❌ Never be used in frontend/browser code
- ❌ Never be committed to Git
- ❌ Never be shared publicly
- ✅ Only used in server-side code (if needed)

Consider rotating it in Supabase dashboard since it was shared here.

## After You Update

1. Save the file with the correct anon key
2. Push to Shopify theme
3. Test the form
4. Check Supabase Table Editor for new rows
5. You should see submissions appearing!
