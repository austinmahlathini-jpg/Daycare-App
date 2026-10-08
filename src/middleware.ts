// src/middleware.ts
//
// ROLE IN THE ARCHITECTURE: this file sits IN FRONT OF the entire app —
// not inside the UI -> Business Rules -> Repository -> Infrastructure
// stack, but as a gate every request passes through BEFORE Next.js even
// decides which page/layer to route it to. This is what lets us enforce
// "must be logged in" for every current and future page at once, instead
// of repeating that check inside each individual page.
// Source: supabase.com/docs/guides/auth/server-side/nextjs

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js specifically looks for a function named exactly "middleware",
// exported from a file named exactly middleware.ts, sitting at the app's
// root (src/middleware.ts, since our app lives under src/). This
// function deliberately does almost nothing itself — it hands off to
// updateSession(), which holds the actual session-checking logic, kept
// separate so it stays readable and testable on its own.
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// WHY THIS EXISTS: without a matcher, the function above would run on
// EVERY request — including images, CSS, and other static files that
// have nothing to do with authentication. This pattern excludes those
// file types from triggering the middleware at all.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
