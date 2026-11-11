import { createClient } from "@/lib/supabase/client";

export type Classroom = { id: string; name: string; capacity: number };
export type Child = { id: string; name: string };

function toError(error: { message: string }): Error {
  return new Error(error.message);
}

// 1. Fetch classrooms
export async function getClassrooms(): Promise<Classroom[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("classrooms")
    .select("id, name, capacity");
  if (error) throw toError(error);
  return data ?? [];
}

// 2. Fetch children
export async function getChildren(): Promise<Child[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("children").select("id, name");
  if (error) throw toError(error);
  return data ?? [];
}

// 3. Get enrollment counts
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

// 4. Enroll a child
export async function enrollChild(classroomId: string, childId: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("enroll_child", {
    p_classroom_id: classroomId,
    p_child_id: childId,
  });
  if (error) throw toError(error);
  return data as string;
}

// 5. Fetch all children sorted alphabetically
// Notice we pass `supabase` in as an argument now.
export async function getAllChildren(supabase: any): Promise<Child[]> {
  const { data, error } = await supabase
    .from("children")
    .select("id, name")
    .order("name", { ascending: true });
    
  if (error) throw toError(error);
  return data ?? [];
}

// 6. Create a new child
// Notice we pass `supabase` in as an argument here too.
export async function createChild(supabase: any, name: string): Promise<Child> {
  const { data, error } = await supabase
    .from("children")
    .insert({ name })
    .select()
    .single();

  if (error) throw toError(error);
  return data;
}

// 7. Fetch all classrooms
export async function getAllClassrooms(supabase: any): Promise<Classroom[]> {
  const { data, error } = await supabase
    .from("classrooms")
    .select("id, name, capacity")
    .order("name", { ascending: true });
    
  if (error) throw toError(error);
  return data ?? [];
}

// 8. Create a new classroom
export async function createClassroom(supabase: any, name: string, capacity: number): Promise<Classroom> {
  const { data, error } = await supabase
    .from("classrooms")
    .insert({ name, capacity })
    .select()
    .single();

  if (error) throw toError(error);
  return data;
}