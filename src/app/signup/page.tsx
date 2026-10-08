// src/app/signup/page.tsx
//
// ROLE IN THE SYSTEM: this is the first domino. A successful submission
// here eventually leads to a real, authenticated session — which is what
// lets a staff member's browser satisfy "TO authenticated" in the RLS
// policies written earlier, and ultimately call enroll_child() as a
// real, identified user rather than an anonymous request.

// Same reasoning as login: this page needs useState (interactive form
// fields) and calls a browser-side Supabase method — a Server Component
// can do neither, so this file must opt out of the default.
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Tracks whether sign-up succeeded, so we can swap the form out for a
  // confirmation message instead of redirecting immediately — there is
  // no active session yet. Supabase creates the account in an
  // UNCONFIRMED state; it only becomes usable once the email
  // confirmation step (src/app/auth/confirm/route.ts) completes.
  const [submitted, setSubmitted] = useState(false);

  // The BROWSER Supabase client — this code runs in the user's browser,
  // talking directly to Supabase's Auth servers over HTTPS.
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // THE ACTUAL SIGN-UP CALL. Behind this one line, Supabase:
    //   1. Creates a new row in its own internal auth.users table.
    //   2. Hashes the password before storing it.
    //   3. Marks the account as UNCONFIRMED.
    //   4. Sends a real email containing a link back to YOUR app, built
    //      from emailRedirectTo below, with a PKCE code embedded in it.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Tells Supabase where the confirmation link should point —
        // must match the Route Handler built specifically to receive
        // it: src/app/auth/confirm/route.ts. Also must be added to
        // Supabase's Auth -> URL Configuration -> Redirect URLs allow-list.
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      // Sign-up accepted; the REAL next step now happens completely
      // outside this component — in the user's inbox, then in
      // auth/confirm/route.ts once they click the link.
      setSubmitted(true);
    }
  }

  // Once submitted, swap the form out entirely for a confirmation
  // message — there is nothing left for this form to do until the user
  // acts on the email, elsewhere.
  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <p className="text-center max-w-sm">
          Account created. Check your email to confirm your address before
          logging in.
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Staff Sign Up</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <button type="submit" className="w-full bg-black text-white rounded p-2">
          Sign Up
        </button>
      </form>
    </main>
  );
}
