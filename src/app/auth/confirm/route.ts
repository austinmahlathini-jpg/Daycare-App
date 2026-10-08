// src/app/auth/confirm/route.ts
//
// ROLE IN THE SYSTEM: this is the server-side landing point for
// Supabase's confirmation link. This project's default email flow uses
// PKCE (confirmed via Supabase's own docs), so this route reads a "code"
// query parameter and exchanges it for a real session — it does NOT use
// the older token_hash pattern, which would require editing the email
// template (locked on this project's plan).
//
// WHAT A ROUTE HANDLER IS: unlike page.tsx (which renders UI), route.ts
// defines a backend endpoint — reachable at /auth/confirm, returning a
// raw HTTP response (a redirect, here) instead of visual markup.

import { type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
// ^ The SERVER client specifically — exchanging a code for a session
// requires setting a real cookie on the response, which only server-side
// code can do. The browser client has no ability to do this.
import { redirect } from 'next/navigation';

// GET, specifically, because clicking an emailed link always triggers a
// browser GET request. Next.js Route Handlers let you export a function
// named after the HTTP method you want to handle.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // The PKCE flow's parameter, appended automatically by Supabase's own
  // /auth/v1/verify endpoint when it redirects back to us — produced by
  // the DEFAULT (unmodified) email template, no template editing needed.
  const code = searchParams.get('code');

  if (code) {
    const supabase = createClient();

    // Redeems the one-time code for a real, valid session. The server
    // client automatically attaches the resulting session cookie onto
    // this response.
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      redirect('/'); // success — genuinely logged in now
    }
  }

  // No code at all, or the exchange failed (expired, already used, or
  // consumed early by an email client's link-prefetch security scan) —
  // send back to login rather than a dead end.
  redirect('/login');
}
