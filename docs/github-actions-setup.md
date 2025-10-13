# GitHub Actions CI/CD Setup

## Overview

This project uses GitHub Actions for continuous integration and deployment automation.

## Workflows

### 1. **CI - Tests and Linting** (`.github/workflows/ci.yml`)

Runs on every push and pull request to `main`:
- ✅ Linting (ESLint)
- ✅ TypeScript type checking
- ✅ Unit & integration tests (Jest)
- ✅ Coverage report generation
- ✅ E2E tests (Playwright)
- ✅ Build verification

**Triggers:** Push or PR to `main`

### 2. **Playwright Tests** (`.github/workflows/playwright.yml`)

Dedicated E2E testing workflow:
- ✅ Runs Playwright tests across 3 browsers
- ✅ Uploads test reports on failure
- ✅ Retries failed tests on CI

**Triggers:** Push or PR to `main`

### 3. **Deploy Database Migrations** (`.github/workflows/deploy-migrations.yml`)

Manual workflow for deploying database changes:
- ✅ Links to Supabase project
- ✅ Runs migrations with dry-run first
- ✅ Supports staging and production environments

**Triggers:** Manual dispatch

## Required GitHub Secrets

To enable full CI/CD functionality, add these secrets to your GitHub repository:

### Navigation:
`GitHub Repository → Settings → Secrets and variables → Actions → New repository secret`

### Required Secrets:

#### **For E2E Tests (Authenticated):**
```
TEST_ADMIN_EMAIL=test-admin@example.com
TEST_ADMIN_PASSWORD=your-test-password
```

#### **For Supabase Connection:**
```
NEXT_PUBLIC_SUPABASE_URL=https://nmgptiywaefuvvatlcah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### **For Database Migrations:**
```
SUPABASE_ACCESS_TOKEN=your-personal-access-token
SUPABASE_DB_PASSWORD=your-database-password
SUPABASE_PROJECT_ID=nmgptiywaefuvvatlcah
```

#### **For Build (Optional):**
```
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
RESEND_API_KEY=your-resend-api-key
NOTIFICATION_EMAIL=your-notification-email
```

### How to Get Supabase Access Token:

1. Go to https://supabase.com/dashboard/account/tokens
2. Click "Generate new token"
3. Name it "GitHub Actions"
4. Copy the token
5. Add to GitHub Secrets as `SUPABASE_ACCESS_TOKEN`

## Staging Environment Setup (Task 10.23c)

### Option 1: Separate Supabase Project

1. **Create a staging Supabase project:**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Name: "portrait-site-staging"
   - Same region as production

2. **Run migrations on staging:**
   ```bash
   # Link to staging project
   supabase link --project-ref staging-project-ref
   
   # Push migrations
   supabase db push
   ```

3. **Add staging secrets to GitHub:**
   - Use GitHub Environments feature
   - Create "staging" environment
   - Add staging-specific secrets

### Option 2: Vercel Preview Deployments

- Use Vercel's automatic preview deployments for PRs
- Each PR gets its own preview URL
- Connect to staging Supabase project via env vars

### Recommended Approach:

**Use Vercel Preview Deployments** with the same Supabase project but different data:
- Production: Real client data
- Staging/Preview: Test data only
- Separate via RLS policies or database schemas

## Workflow Triggers

### Automatic:
- **On PR:** Runs linting, tests, build check
- **On Push to main:** Runs full CI suite
- **On Merge:** Triggers Vercel deployment

### Manual:
- **Database Migrations:** Run via workflow dispatch
- **Staging Deployment:** Manual trigger for testing

## Testing the Workflows

### Locally:
```bash
# Install act (GitHub Actions local runner)
brew install act

# Run workflows locally
act pull_request
```

### On GitHub:
1. Create a PR
2. Check "Actions" tab
3. View workflow runs and logs

## Monitoring

### Check Workflow Status:
- Go to repository → Actions tab
- View recent workflow runs
- Check logs for failures

### Notifications:
- GitHub will email you on workflow failures
- Configure in Settings → Notifications

## Troubleshooting

### Issue: Tests fail on CI but pass locally
- **Cause:** Environment differences
- **Fix:** Ensure all secrets are set in GitHub

### Issue: E2E tests skip authentication
- **Cause:** Missing TEST_ADMIN_EMAIL or TEST_ADMIN_PASSWORD
- **Fix:** Add secrets to GitHub repository

### Issue: Build fails with missing env vars
- **Cause:** Required env vars not in secrets
- **Fix:** Add all required secrets from .env.example

### Issue: Migration workflow fails
- **Cause:** Missing SUPABASE_ACCESS_TOKEN or wrong project ID
- **Fix:** Verify secrets and project ref

## Best Practices

1. **Always test migrations locally first:**
   ```bash
   supabase db reset
   ```

2. **Use staging environment for testing:**
   - Deploy to staging first
   - Test thoroughly
   - Then deploy to production

3. **Monitor workflow runs:**
   - Check Actions tab regularly
   - Fix failures promptly

4. **Keep secrets secure:**
   - Never commit secrets to code
   - Rotate tokens periodically
   - Use least-privilege access

## Next Steps

After setting up GitHub Actions:

1. ✅ Add all required secrets to GitHub
2. ✅ Create a test PR to verify workflows
3. ✅ Set up staging environment (if using separate project)
4. ✅ Configure Vercel deployment (Task 11.0)
5. ✅ Test full deployment pipeline

## Current Status

- ✅ **Task 10.23a:** CI workflow configured (runs tests on PRs)
- ✅ **Task 10.23b:** Migration workflow configured (manual dispatch)
- 📝 **Task 10.23c:** Staging environment (documented, pending setup)
- 📝 **Task 10.23d:** GitHub Secrets (documented, pending manual addition)

**Note:** Tasks 10.23c and 10.23d require manual steps in GitHub and Supabase dashboards.

