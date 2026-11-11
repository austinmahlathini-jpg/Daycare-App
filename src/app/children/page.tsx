// Add this import at the top
import { createClient } from "@/lib/supabase/server";
import { getAllChildren } from "@/features/enrollment/repository";
import AddChildForm from "@/components/AddChildForm";
import Link from "next/link";

export default async function ChildrenPage() {
  // 1. Create the SERVER client
  const supabase = createClient(); 
  
  // 2. Pass it into the repository
  const children = await getAllChildren(supabase); 

  return (
    // ... (Keep the rest of the JSX exactly the same)
    <main className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Children</h1>
          <p className="text-gray-600 mt-1">Add and view children enrolled in the daycare.</p>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>

      <AddChildForm />

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        {children.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No children found. Add one above!</p>
        ) : (
          <ul className="divide-y">
            {children.map((child) => (
              <li key={child.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <span className="font-medium text-gray-900">{child.name}</span>
                <span className="text-sm text-gray-400">ID: {child.id.slice(0, 8)}...</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}