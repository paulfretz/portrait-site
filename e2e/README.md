# E2E Testing with Playwright

## Overview

End-to-end tests are located in the `/e2e` directory and use Playwright to test the full application flow across multiple browsers (Chromium, Firefox, WebKit).

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/public-site.spec.ts

# Run with specific browser
npx playwright test --project=chromium
```

## Test Authentication

Some tests require admin authentication to test admin features. We use Playwright's `storageState` feature to manage authentication.

### How It Works

1. **Auth Setup (`e2e/auth.setup.ts`):**
   - Runs before all browser tests
   - Creates a mock authenticated session
   - Saves session state to `playwright/.auth/user.json`
   - All subsequent tests use this authenticated state

2. **Session Reuse:**
   - Each browser project depends on the 'setup' project
   - Loads the saved `storageState` automatically
   - Tests run as if logged in with admin privileges

3. **Mock Authentication:**
   - Currently uses a **mock session** approach
   - Sets localStorage and cookies to simulate Supabase auth
   - Works for testing admin routes and UI without real OAuth

### Environment Variables

The auth setup requires these environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

### Limitations

**Current Mock Approach:**
- ✅ Tests admin route access
- ✅ Tests admin UI visibility
- ✅ Tests middleware protection
- ❌ Does NOT test actual Supabase queries (middleware may block)
- ❌ Does NOT test real OAuth flow

**Why Mock?**
- Google OAuth requires real credentials and user interaction
- Real OAuth is tested manually during deployment
- Mock authentication is sufficient for UI/route testing

### Future Enhancement

To test with **real authentication**:

1. **Option A: Test Credentials**
   - Create a dedicated test admin account
   - Store credentials in environment variables
   - Use Playwright to automate OAuth flow

2. **Option B: Supabase Test Project**
   - Set up local Supabase with Docker (Task 10.22c)
   - Create test users programmatically
   - Use real sessions for testing

## Test Organization

### Public Tests (No Auth Required)
- `public-site.spec.ts` - Homepage, navigation, footer
- `gallery-viewing.spec.ts` - Gallery browsing, lightbox
- `contact-form.spec.ts` - Contact form submission

### Auth Tests
- `admin-auth.spec.ts` - Login flow, route protection

### Admin Tests (Requires Auth)
- `gallery-management.spec.ts` - Currently tests unauthenticated behavior
- `inline-editing.spec.ts` - Will test authenticated inline editing (pending)

## Debugging Tests

```bash
# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Generate test report
npx playwright show-report
```

## CI/CD

Tests automatically run on:
- Pull requests to main
- Pushes to main

See `.github/workflows/playwright.yml` for configuration.

## Troubleshooting

**Issue: "Auth setup failed" warning**
- Ensure `.env.local` has all required variables
- Check that admin email exists in Supabase
- Verify Supabase URL and keys are correct

**Issue: Tests fail with "not authenticated"**
- Check that `playwright/.auth/user.json` exists
- Run `npx playwright test e2e/auth.setup.ts` manually
- Verify storageState is being loaded in config

**Issue: Tests are slow**
- Use `--project=chromium` to test single browser
- Use `.only` to run specific tests during development
- Disable video/screenshots in config if not needed

