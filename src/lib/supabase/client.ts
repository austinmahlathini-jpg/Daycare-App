// src/lib/supabase/client.ts
//
// INFRASTRUCTURE LAYER — this is the ONLY file allowed to construct a
// Supabase client for use in the BROWSER. Every Client Component
// ("use client" pages like login, signup, enroll) imports createClient
// from here, never from "@supabase/ssr" or "@supabase/supabase-js"
// directly. This is what keeps the actual construction details isolated
// to one place, per the Repository/Infrastructure separation from the
// first architecture lesson.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
