// src/app/enroll/page.tsx
//
// UI LAYER — this file's job is presentation and interaction ONLY. It
// does not know Supabase exists at all; it only knows about the plain
// functions exported from the enrollment feature's repository, imported
// below. This is the Repository pattern from the architecture lesson,
// now actually applied — compare this to how directly wiring supabase.
// from(...) into this component would have blurred UI and Infrastructure
// together.
"use client";

import { useEffect, useState } from "react";
import {
  getClassrooms,
  getChildren,
  getEnrollmentCounts,
  enrollChild,
  type Classroom,
  type Child,
} from "@/features/enrollment/repository";

export default function EnrollPage() {
  // UI state only — what's currently loaded, what's currently selected,
  // what message (if any) to show after an action.
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const [selectedChild, setSelectedChild] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Loads everything the page needs to render. The page asks the
  // repository for data in plain language — it has no idea these
  // functions internally talk to Supabase at all.
  async function loadData() {
    setLoading(true);
    try {
      const [classroomData, childData, countData] = await Promise.all([
        getClassrooms(),
        getChildren(),
        getEnrollmentCounts(),
      ]);
      setClassrooms(classroomData);
      setChildren(childData);
      setCounts(countData);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to load data.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  // Runs once, when the page first mounts.
  useEffect(() => {
    loadData();
  }, []);

  async function handleEnroll() {
    setMessage(null);
    setIsError(false);

    if (!selectedChild || !selectedClassroom) {
      setMessage("Pick a child and a classroom first.");
      setIsError(true);
      return;
    }

    setSubmitting(true);
    try {
      await enrollChild(selectedClassroom, selectedChild);
      setMessage("Enrolled successfully.");
      setIsError(false);
      setSelectedChild("");
      setSelectedClassroom("");
      await loadData(); // refresh counts so capacity display is current
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Enrollment failed.");
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <p className="text-gray-600">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Enroll a Child</h1>

        {message && (
          <p className={isError ? "text-red-600 text-sm" : "text-green-700 text-sm"}>
            {message}
          </p>
        )}

        <label className="block">
          <span className="text-sm text-gray-700">Child</span>
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="mt-1 w-full border rounded p-2"
          >
            <option value="">Select a child…</option>
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">Classroom</span>
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="mt-1 w-full border rounded p-2"
          >
            <option value="">Select a classroom…</option>
            {classrooms.map((room) => {
              const used = counts[room.id] ?? 0;
              const full = used >= room.capacity;
              return (
                <option key={room.id} value={room.id} disabled={full}>
                  {room.name} ({used}/{room.capacity}){full ? " — full" : ""}
                </option>
              );
            })}
          </select>
        </label>

        <button
          onClick={handleEnroll}
          disabled={submitting}
          className="w-full bg-black text-white rounded p-2 disabled:opacity-50"
        >
          {submitting ? "Enrolling…" : "Enroll"}
        </button>
      </div>
    </main>
  );
}