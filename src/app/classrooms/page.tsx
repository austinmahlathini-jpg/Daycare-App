import { createClient } from "@/lib/supabase/server";
import { getAllClassrooms } from "@/features/enrollment/repository";
import AddClassroomForm from "@/components/AddClassroomForm";
import Link from "next/link";

export default async function ClassroomsPage() {
  const supabase = createClient();
  const classrooms = await getAllClassrooms(supabase);

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Classrooms</h1>
          <p className="text-gray-600 mt-1">Add and view classrooms and their capacities.</p>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>

      <AddClassroomForm />

      {/* 
        UPDATED LAYOUT: 
        We removed the single white box (<div className="bg-white border...">) 
        and replaced it with a CSS Grid. 
      */}
      <div>
        {classrooms.length === 0 ? (
          <p className="p-6 text-gray-500 text-center bg-white border rounded-lg">No classrooms found. Add one above!</p>
        ) : (
          /* 
            grid-cols-1: 1 column on mobile
            md:grid-cols-2: 2 columns on desktop
            gap-4: adds space between the cards
          */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classrooms.map((room) => (
              /* 
                Each classroom is now its own white card with a border, 
                padding, and a shadow. 
              */
              <div 
                key={room.id} 
                className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <span className="font-semibold text-lg text-gray-900">{room.name}</span>
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Capacity: {room.capacity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}