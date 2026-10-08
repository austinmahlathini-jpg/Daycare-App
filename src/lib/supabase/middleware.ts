// src/lib/supabase/middleware.ts
//
// ROLE IN THE ARCHITECTURE: this is Infrastructure-layer code, the same
// layer as client.ts and server.ts — but this is a THIRD, distinct way of
// constructing a Supabase client, because middleware runs in its own
// execution context. It's neither a browser page nor a normal
// server-rendered page, so it needs its own way of reading cookies off
// the incoming request and writing any refreshed session cookie onto the
// outgoing response.
//
// This file holds the REAL logic. src/middleware.ts (the other file)
// just plugs this into Next.js's required entrypoint shape.

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Start with a pass-through response — if nothing below decides to
  // redirect, this is what actually gets returned, letting the request
  // continue to whatever page it was headed to.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Reads whatever cookies arrived WITH the incoming request —
        // this is how we find out if a session cookie already exists.
        getAll() {
          return request.cookies.getAll();
        },
        // If Supabase needs to refresh the session (e.g. it's close to
        // expiring), this writes the NEW cookie both onto the request
        // (so this same execution sees it) and onto a fresh response
        // object (so the browser actually receives the update).
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // THE ACTUAL CHECK: ask Supabase directly whether this request's
  // cookie represents a real, currently-valid logged-in user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // THE ACCESS-CONTROL DECISION: if there's no logged-in user, AND the
  // request isn't already headed to /login, /signup, or /auth (avoiding
  // an infinite redirect loop), send it to /login instead of letting
  // the originally-requested page render.
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/signup") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Either the user IS logged in, or this request was already headed to
  // a public auth page — let it through normally.
  return supabaseResponse;
}
