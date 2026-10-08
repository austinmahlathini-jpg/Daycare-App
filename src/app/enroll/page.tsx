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
  const [loading, setLoading] = useState(true);

  // Loads everything the page needs to render. The page asks the
  // repository for data in plain language — it has no idea these
  // functions internally talk to Supabase at all.
  async function loadData() {
    setLoading(true);
    const [classroomData, childData, countData] = await Promise.all([
      getClassrooms(),
      getChildren(),
      getEnrollmentCounts(),
    ]);
    setClassrooms(classroomData);
    setChildren(childData);
    setCounts(countData);
    setLoading(false);
  }

  // Runs once, when the page first mounts.
  useEffect(() => {
    loadData();
  }, []);

  async function handleEnroll() {
    setMessage(null);
    if (!selectedChild || !selectedClassroom) {
      setMessage("Pick a child and a classroom first.");
      return;
    }
  }
}

