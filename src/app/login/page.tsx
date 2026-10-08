// This page needs interactivity (form state, a button click handler) and
// must call a browser-side Supabase client — Server Components can't do
// either, so this file must opt out of the App Router's Server Component
// default.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  // Controlled form state — React needs to track what the user has typed
  // so we can read it on submit, rather than reaching into the DOM directly.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Starts empty; only populated if Supabase rejects the login attempt.
  const [error, setError] = useState<string | null>(null);

  // Lets us navigate away from /login after a successful sign-in,
  // client-side, without a full page reload.
  const router = useRouter();

  // The BROWSER Supabase client specifically — this code runs in the
  // user's browser, so it must use the client built for that context.
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Checks email/password against what's stored, and on success, sets
    // a session cookie the server can later read.
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Staff Login</h1>
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
          Log In
        </button>
      </form>
    </main>
  );
}
