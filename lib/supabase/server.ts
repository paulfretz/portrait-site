import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/db/types';

/**
 * Create a Supabase client for use in Server Components, Server Actions, and API Routes
 * This client handles authentication via cookies and works server-side only
 *
 * Usage in Server Components:
 * ```tsx
 * import { createClient } from '@/lib/supabase/server';
 *
 * export default async function MyServerComponent() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('galleries').select('*');
 *   return <div>...</div>;
 * }
 * ```
 *
 * Usage in Server Actions:
 * ```tsx
 * 'use server';
 * import { createClient } from '@/lib/supabase/server';
 *
 * export async function myServerAction() {
 *   const supabase = await createClient();
 *   // Use supabase client here
 * }
 * ```
 *
 * Usage in API Routes:
 * ```tsx
 * import { createClient } from '@/lib/supabase/server';
 *
 * export async function GET() {
 *   const supabase = await createClient();
 *   // Use supabase client here
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase admin client with service role key for privileged operations
 * ⚠️ WARNING: This client bypasses Row Level Security (RLS)
 * Only use in trusted server-side code (API routes, Server Actions)
 * Never expose service role key to the client
 *
 * Usage:
 * ```tsx
 * import { createAdminClient } from '@/lib/supabase/server';
 *
 * export async function GET() {
 *   const supabase = createAdminClient();
 *   // Perform admin operations that bypass RLS
 * }
 * ```
 */
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // No-op for admin client
        },
      },
    }
  );
}
