// src/features/enrollment/repository.ts
//
// REPOSITORY LAYER — from the very first architecture lesson tonight:
// this is the ONLY file in the enrollment feature allowed to know that
// Supabase exists. UI components (page.tsx) ask THIS file for what they
// need, in plain, feature-language function names — they never call
// supabase.from(...) or supabase.rpc(...) directly. This is what makes
// it possible to swap Supabase for something else later, or substitute a
// fake version of this file in tests, without touching any UI code.
// Sources: supabase.com/docs/reference/javascript/select and /rpc,
// supabase.com/docs/guides/api/handling-errors-in-supabase-js

import { createClient } from "@/lib/supabase/client";

export type Classroom = { id: string; name: string; capacity: number };
export type Child = { id: string; name: string };

// ERROR TRANSLATION — Supabase returns failures as plain objects shaped
// like { message, details, hint, code }, not as real JavaScript Error
// instances (see the handling-errors guide above, and
// github.com/supabase/postgrest-js/issues/501, where such an error
// fails an `instanceof Error` check).
//
// Why that matters: the UI's catch block asks "is this an Error?" before
// reading .message. A plain object fails that test, so the real message
// (like our own "This classroom is full" from RAISE EXCEPTION) was being
// thrown away and replaced with a generic fallback.
//
// This helper lives in the repository on purpose: the repository is the
// only layer that knows Supabase exists, so it is the only layer that
// should know Supabase's error shape. It converts that shape into a
// standard Error once, here, and every screen benefits automatically.
//
// Trade-off: this keeps only the message. It drops code, details and
// hint. Supabase's docs recommend branching on error.code (for example
// P0001 for a RAISE EXCEPTION) because codes are more stable than
// message text. A later improvement is to attach the code to the Error.
function toError(error: { message: string }): Error {
  return new Error(error.message);
}

// Fetches every classroom.
export async function getClassrooms(): Promise<Classroom[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("classrooms")
    .select("id, name, capacity");
  // Any Supabase failure is converted to a real Error before leaving
  // this layer, so callers never see Supabase's error shape.
  if (error) throw toError(error);
  return data ?? [];
}

// Fetches every child.
export async function getChildren(): Promise<Child[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("children").select("id, name");
  if (error) throw toError(error);
  return data ?? [];
}

// Returns how many children are currently enrolled in each classroom, as
// a lookup keyed by classroom id. Computed from real enrollment rows —
// never stored — same "derive, don't duplicate" principle from Phase 2
// of the capacity problem, now expressed at the repository layer.
export async function getEnrollmentCounts(): Promise<Record<string, number>> {
  const supabase = createClient();
  const { data, error } = await supabase.from("enrollments").select("classroom_id");
  if (error) throw toError(error);

  const counts: Record<string, number> = {};
  (data ?? []).forEach((row: { classroom_id: string }) => {
    counts[row.classroom_id] = (counts[row.classroom_id] ?? 0) + 1;
  });
  return counts;
}

// The single business action of this feature: enroll a child into a
// classroom. This is a thin wrapper around the enroll_child Postgres
// function — the REAL business rule (capacity check, row locking,
// atomicity) lives there, in the database, not here. This function's
// only job is translating "call this database function" into a plain,
// readable name the UI can call, without needing to know rpc() or
// Supabase's parameter-naming conventions (p_classroom_id) exist.
//
// When the classroom is full, Postgres raises 'This classroom is full'.
// That travels back as error.message, toError() turns it into a real
// Error, and page.tsx's catch block displays it on screen.
export async function enrollChild(classroomId: string, childId: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("enroll_child", {
    p_classroom_id: classroomId,
    p_child_id: childId,
  });
  if (error) throw toError(error);
  return data as string;
}