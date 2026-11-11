"use server";

import { revalidatePath } from "next/cache";
// 1. Import the Server client
import { createClient } from "@/lib/supabase/server"; 

export async function addChildAction(formData: FormData) {
  // 2. Create the server client
  const supabase = createClient(); 

  const name = formData.get("name") as string;

  if (!name || name.trim() === "") {
    throw new Error("Name is required");
  }

  // 3. Pass the client into the repository
  await createChild(supabase, name.trim());

  revalidatePath("/children");
}

// Add this import at the top if it's not there
import { createChild, createClassroom } from "@/features/enrollment/repository";

// ... keep addChildAction ...

export async function addClassroomAction(formData: FormData) {
  const supabase = createClient();
  
  // Extract both fields from the form
  const name = formData.get("name") as string;
  const capacityStr = formData.get("capacity") as string;
  const capacity = parseInt(capacityStr, 10); // Convert string to number

  if (!name || name.trim() === "") {
    throw new Error("Name is required");
  }
  if (isNaN(capacity) || capacity <= 0) {
    throw new Error("Capacity must be a positive number");
  }

  await createClassroom(supabase, name.trim(), capacity);
  revalidatePath("/classrooms");
}