# Seed Test Database - Instructions

## Quick Start

### Option 1: Using Supabase SQL Editor (EASIEST)

1. Go to your test Supabase project: https://viqvpxipqmkswpflpqfx.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `supabase/seed-test-data.sql`
5. Click **Run** (or press Cmd+Enter)
6. Verify the output shows successful inserts

### Option 2: Using Supabase CLI

```bash
# Make sure you're in the project root
cd /Users/paulfretz/personal-workspace/portrait-site

# Load environment variables
source .env.local

# Run the seed script
supabase db execute --db-url "$TEST_SUPABASE_URL" --file supabase/seed-test-data.sql
```

### Option 3: Using psql directly

```bash
# Get your database password from Supabase dashboard
# Settings → Database → Connection string → Password

psql "postgresql://postgres:[YOUR_PASSWORD]@db.viqvpxipqmkswpflpqfx.supabase.co:5432/postgres" \
  -f supabase/seed-test-data.sql
```

## What This Script Does

1. **Clears existing test data** (safe for test database only!)
2. **Creates 7 categories**: Weddings, Portraits, Events, Seniors, Families, Maternity, Engagement
3. **Creates 9 galleries** across different categories
4. **Creates 13 images** with Unsplash placeholder URLs
5. **Creates 5 sample inquiries** for testing the contact form
6. **Creates 4 page content entries** for About/Home pages
7. **Disables RLS** for easier testing (or configures permissive policies)

## Verification

After running the seed script, verify it worked:

```sql
SELECT COUNT(*) as category_count FROM categories;
SELECT COUNT(*) as gallery_count FROM galleries;
SELECT COUNT(*) as image_count FROM images;
SELECT COUNT(*) as inquiry_count FROM inquiries;
SELECT COUNT(*) as page_content_count FROM page_content;
```

Expected results:
- category_count: 7
- gallery_count: 9
- image_count: 13
- inquiry_count: 5
- page_content_count: 4

## After Seeding

Run the E2E tests:
```bash
npm run test:e2e
```

Expected improvement:
- Gallery layout tests should pass (no more 30s timeouts)
- Hero slideshow tests should pass (has hero images)
- Contact form tests should pass (RLS disabled)
- Overall pass rate should increase from 66% to 95%+

## Troubleshooting

### If you get "permission denied" errors:
- Make sure you're running this against the TEST database, not production
- Check that your database password is correct

### If images don't load:
- The seed script uses Unsplash URLs which should work
- Images are configured in `next.config.js` to allow `images.unsplash.com`

### If RLS errors persist:
- Verify RLS is disabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
- Should show `rowsecurity = false` for all tables

