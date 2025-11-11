# Environment Setup (Prod / Dev / Test)

This project now operates with three distinct environments:

| Environment | Purpose | Supabase Project | S3 Bucket / Prefix |
|-------------|---------|------------------|--------------------|
| **Production** | Live site + manual admin updates | `https://nmgptiywaefuvvatlcah.supabase.co` | `portrait-site-prod` (or prefix `prod/`) |
| **Test** | CI + Playwright automation | `https://viqvpxipqmkswpflpqfx.supabase.co` | `portrait-site-test` (or prefix `test/`) |
| **Development** | Local feature work (`npm run dev`) | Supabase CLI (`supabase start`) | Local stack or prefix `dev/` |

> **Storage:** Use dedicated S3 buckets or prefixes per environment. A single bucket with prefixed folders (`prod/`, `test/`, `dev/`) works well if you manage IAM permissions carefully.

---

## 1. Local Development (Supabase CLI)

1. Install the Supabase CLI if you haven’t already:  
   ```bash
   npm install -g supabase
   ```
2. From the repo root, run:  
   ```bash
   supabase start
   ```  
   This boots a local Supabase stack at `http://localhost:54321`.
3. Use the default local credentials in your `.env.local` (or `.env.dev`) file:
   ```
   DEV_SUPABASE_URL=http://localhost:54321
   DEV_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1pbnN0YW5jZSIsInJlZiI6ImRldi1sb2NhbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjE3NTY4NjMyfQ.d2N8Ubu1By6Jd0Twr8p2BKtLgdsyBTpy0BmLRwL8Z8
   DEV_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1pbnN0YW5jZSIsInJlZiI6ImRldi1sb2NhbCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2MTc1Njg2MzJ9.B-CnW6Kd7rF2vXbn0t6xCcKwfU6n3va0cyE0h3n124w
   DEV_SUPABASE_JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters-long
   DEV_BLOB_STORAGE_PREFIX=dev/
   DEV_BLOB_READ_WRITE_TOKEN=<reuse production token or create a dedicated one>
   ```
4. Update your local `.env` file to reference these values. When you run `npm run dev`, the app will read from the local Supabase instance instead of production.

Stop the local stack when finished with `supabase stop`.

---

## 2. Test Environment (CI / Playwright)

- Set the following secrets in both `.env.local` for local runs *and* GitHub Actions secrets:
  ```
  TEST_SUPABASE_URL=https://viqvpxipqmkswpflpqfx.supabase.co
  TEST_SUPABASE_ANON_KEY=...
  TEST_SUPABASE_SERVICE_ROLE_KEY=...
  TEST_BLOB_READ_WRITE_TOKEN=<same token as prod>
  TEST_BLOB_STORAGE_PREFIX=test/
  ```
- `e2e/global-setup.ts` aborts automatically if these values point at production.
- All automated test suites (lint/test/e2e) must load these variables before running.

---

## 3. Production Environment

Production runs from the existing hosted project:
```
NEXT_PUBLIC_SUPABASE_URL=https://nmgptiywaefuvvatlcah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
BLOB_READ_WRITE_TOKEN=<primary token>
BLOB_STORAGE_PREFIX=prod/
```

Store these values in Vercel project settings (`Settings → Environment Variables`) and local `.env.local` if you need admin scripts.

---

## 4. S3 Credentials & IAM

Create an IAM user (or role) with access limited to the buckets/prefixes you need. Store the keys in environment variables:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (e.g., `us-east-1`)
- `S3_BUCKET` (or per-env: `PROD_S3_BUCKET`, `TEST_S3_BUCKET`, etc.)
- `S3_PREFIX` for each environment (`prod/`, `test/`, `dev/`)

Optional: generate separate IAM users for prod/test/dev if you want stricter isolation.

---

## 5. Environment Variable Checklist

When setting up a new environment, confirm the following variables exist:

| Variable | Prod | Test | Dev |
|----------|:----:|:----:|:---:|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | – | – |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | – | – |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | – | – |
| `AWS_ACCESS_KEY_ID` | ✅ | ✅ | ✅ *(optional separate users)* |
| `AWS_SECRET_ACCESS_KEY` | ✅ | ✅ | ✅ |
| `AWS_REGION` | ✅ | ✅ | ✅ |
| `S3_BUCKET` / `PROD_S3_BUCKET` | ✅ | – | – |
| `S3_PREFIX` / `PROD_S3_PREFIX` | ✅ | – | – |
| `TEST_SUPABASE_URL` | – | ✅ | – |
| `TEST_SUPABASE_ANON_KEY` | – | ✅ | – |
| `TEST_SUPABASE_SERVICE_ROLE_KEY` | – | ✅ | – |
| `TEST_S3_BUCKET` | – | ✅ | – |
| `TEST_S3_PREFIX` | – | ✅ | – |
| `DEV_SUPABASE_URL` | – | – | ✅ |
| `DEV_SUPABASE_ANON_KEY` | – | – | ✅ |
| `DEV_SUPABASE_SERVICE_ROLE_KEY` | – | – | ✅ |
| `DEV_SUPABASE_JWT_SECRET` | – | – | ✅ |
| `DEV_S3_BUCKET` | – | – | ✅ *(or reuse prod bucket with dev prefix)* |
| `DEV_S3_PREFIX` | – | – | ✅ |

> Tip: Keep a personal `.env.local` that includes **all** of these variables. Switch between environments by exporting the appropriate block before running scripts.


