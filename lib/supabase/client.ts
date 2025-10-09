import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/db/types';

/**
 * Create a Supabase client for use in browser/client components
 * This client automatically handles authentication state and cookies
 *
 * Usage in Client Components:
 * ```tsx
 * 'use client';
 * import { createClient } from '@/lib/supabase/client';
 *
 * export default function MyComponent() {
 *   const supabase = createClient();
 *   // Use supabase client here
 * }
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
