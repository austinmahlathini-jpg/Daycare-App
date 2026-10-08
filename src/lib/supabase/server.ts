// src/lib/supabase/server.ts
//
// INFRASTRUCTURE LAYER — the SERVER counterpart to client.ts. Used by
// Server Components and Route Handlers (like auth/confirm/route.ts).
// This one carries the user's auth session via cookies, so RLS policies
// apply correctly when this client queries the database from the
// server. This split (browser vs. server client) exists because each
// runs in a genuinely different execution context, with different ways
// of reading/writing cookies.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component with no request context to
            // write to — safe to ignore since middleware refreshes
            // sessions on every request anyway.
          }
        },
      },
    }
  );
}
