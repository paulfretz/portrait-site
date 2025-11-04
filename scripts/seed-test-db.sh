#!/bin/bash

# Seed Test Database Script
# This script seeds the test Supabase database with sample data for E2E testing

set -e

echo "🌱 Seeding Test Database..."
echo ""

# Check if required environment variables are set
if [ -z "$TEST_SUPABASE_URL" ]; then
  echo "❌ ERROR: TEST_SUPABASE_URL is not set"
  echo "   Please add it to your .env.local file"
  exit 1
fi

if [ -z "$TEST_SUPABASE_ANON_KEY" ]; then
  echo "❌ ERROR: TEST_SUPABASE_ANON_KEY is not set"
  echo "   Please add it to your .env.local file"
  exit 1
fi

# Load environment variables
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

echo "📊 Test Database Info:"
echo "   URL: $TEST_SUPABASE_URL"
echo ""

# Extract project ref from URL (format: https://PROJECT_REF.supabase.co)
PROJECT_REF=$(echo $TEST_SUPABASE_URL | sed -E 's|https://([^.]+)\.supabase\.co|\1|')

echo "🔗 Connecting to project: $PROJECT_REF"
echo ""

# Run the seed script using psql
echo "📝 Running seed script..."
echo ""

# Use supabase CLI to run the seed script
supabase db push --db-url "$TEST_SUPABASE_URL" --password "$SUPABASE_DB_PASSWORD" < supabase/seed-test-data.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Test database seeded successfully!"
  echo ""
  echo "📈 Verification:"
  echo "   - 7 categories created"
  echo "   - 9 galleries created"
  echo "   - 13 images created"
  echo "   - 5 sample inquiries created"
  echo "   - 4 page content entries created"
  echo ""
  echo "🧪 You can now run E2E tests with: npm run test:e2e"
else
  echo ""
  echo "❌ Failed to seed test database"
  echo "   Check the error messages above"
  exit 1
fi

