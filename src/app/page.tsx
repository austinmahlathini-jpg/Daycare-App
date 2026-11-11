import { createClient } from "@/lib/supabase/server";
// Import redirect to force navigation if the user is not logged in
import { redirect } from "next/navigation";
// Import Next.js Link for optimized, client-side routing without full page reloads
import Link from "next/link";

// export default marks this as the main component for the "/" route.
// "async" turns this into a Server Component, allowing us to await database calls.
export default async function Home() {
  // Initialize the Supabase client (connects to the database using server credentials)
  const supabase = createClient();

  // Await pauses execution until Supabase checks the session cookie.
  // We use object destructuring `{ data: { user } }` to extract just the user object.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the user object is null (no valid session), immediately redirect to /login
  if (!user) {
    redirect("/login");
  }

  // return defines the JSX (UI) that will be sent to the browser
  return (
    // max-w-4xl limits the width on large screens, mx-auto centers it horizontally
    <main className="p-8 max-w-4xl mx-auto">
      
      {/* Header Section */}
      <div className="mb-8">
        {/* text-3xl sets font size, font-bold makes it thick, text-gray-900 sets dark color */}
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        
        {/* mt-2 adds margin-top. user.email is dynamically rendered from the server data */}
        <p className="text-gray-600 mt-2">Welcome back, {user.email}</p>
      </div>

      {/* 
        CSS Grid Layout: 
        grid-cols-1 (1 column on mobile), md:grid-cols-2 (2 columns on medium screens+)
        gap-6 adds spacing between the grid items.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* --- Card 1: Enroll --- */}
        {/* Link component creates an <a> tag but uses Next.js client-side routing */}
        <Link
          href="/enroll"
          // block makes the whole card clickable. 
          // p-6 adds padding. bg-white sets background. rounded-lg rounds corners. 
          // shadow-sm adds a subtle shadow. hover:shadow-md increases shadow on hover.
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Enroll a Child
          </h2>
          <p className="text-gray-600 text-sm">
            Assign children to available classrooms and manage capacity.
          </p>
        </Link>

        {/* --- Card 2: Manage Children --- */}
        <Link
          href="/children"
          // Same styling as Card 1, now linking to the new page we created
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Manage Children
          </h2>
          <p className="text-gray-600 text-sm">
            Add new children or view existing profiles.
          </p>
        </Link>
        
      </div>
    </main>
  );
}
