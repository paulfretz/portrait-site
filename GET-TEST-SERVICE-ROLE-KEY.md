# Get Test Database Service Role Key

## Why We Need This

The **service role key** has full admin access to Supabase and automatically bypasses Row Level Security (RLS). This allows our automated test setup to:
- Clear old test data
- Seed fresh test data
- Work with RLS-protected tables

## How to Get It

### Step 1: Go to Test Supabase Project
Open: https://viqvpxipqmkswpflpqfx.supabase.co

### Step 2: Navigate to Settings
1. Click **Settings** (gear icon) in the left sidebar
2. Click **API** section

### Step 3: Copy Service Role Key
1. Scroll down to **Project API keys**
2. Find the **service_role** key (it's labeled as "secret")
3. Click the **eye icon** to reveal it
4. Click **Copy** to copy it to clipboard

### Step 4: Add to .env.local
Add this line to your `.env.local` file:

```bash
TEST_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Replace `your_service_role_key_here` with the key you copied.

### Step 5: Verify
The key should look like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcXZweGlwcW1rc3dwZmxwcWZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTI2OTAxNSwiZXhwIjoyMDQ0ODQ1MDE1fQ...
```

Note: It should have `"role":"service_role"` in the decoded JWT payload.

## Security Note

⚠️ **IMPORTANT**: 
- The service role key has FULL database access
- Only use it for the TEST database
- NEVER commit it to git
- NEVER use it in client-side code
- Our `.env.local` is already in `.gitignore`

## After Adding the Key

Run tests again:
```bash
npm run test:e2e
```

The global setup will now:
1. ✅ Use service role key to bypass RLS
2. ✅ Clear old test data
3. ✅ Seed fresh test data automatically
4. ✅ Run all tests with proper data

Expected result: Tests should pass at 95%+ rate!

