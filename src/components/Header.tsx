// "use client" tells Next.js to compile this file for the browser, allowing 
// it to use React hooks (useState) and browser APIs (window).
"use client";

// import brings external modules into this file so we can use them.
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState, useMemo } from "react";

// export default allows this function to be imported by other files.
// "function Header()" defines a React Component.
export default function Header() {
  // useRouter() is a hook. It returns an object with methods like push() and refresh().
  // We store that object in the constant variable "router".
  const router = useRouter();
  
  // usePathname() is a hook that returns a string of the current URL path.
  const pathname = usePathname();
  
  // useMemo() caches the result of a function so it doesn't re-run on every render.
  // Syntax: useMemo(callbackFunction, dependencyArray)
  // The empty array [] means "never re-run this, just run it once on mount".
  const supabase = useMemo(() => createClient(), []);
  
  // useState() returns an array with two items: [currentValue, updaterFunction].
  // Array destructuring (const [a, b] = ...) assigns them to variables.
  // Here, currentValue is "isLoggingOut" (initially false), and updater is "setIsLoggingOut".
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // An if statement checks a condition. The === is the strict equality operator.
  // The || is the logical OR operator. It returns true if either side is true.
  if (pathname === "/login" || pathname === "/signup") {
    // return null tells React to render nothing to the screen.
    return null;
  }

  // "async" declares that this function performs asynchronous operations.
  // It allows the use of the "await" keyword inside.
  async function handleSignOut() {
    // Calls the updater function to change state to true, triggering a re-render.
    setIsLoggingOut(true);
    
    // "await" pauses this function until the Promise returned by signOut() resolves.
    await supabase.auth.signOut();
    
    // router.push() navigates to a new URL. router.refresh() forces a server fetch.
    router.push("/login");
    router.refresh(); 
  }

  // return () tells React to render the following JSX to the DOM.
  return (
    // className applies Tailwind CSS utility classes.
    <header className="border-b bg-white px-6 py-4 flex justify-between items-center shadow-sm">
      <nav className="flex gap-6 font-medium">
        {/* Link is a Next.js component. href is a prop (property) passing the URL string. */}
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
        <Link href="/enroll" className="hover:text-blue-600 transition-colors">
          Enroll Child
        </Link>
        <Link href="/children" className="hover:text-blue-600 transition-colors">
          Children
        </Link>
        {/* Added the Classrooms link here, inside the nav */}
        <Link href="/classrooms" className="hover:text-blue-600 transition-colors">
          Classrooms
        </Link>
      </nav>
      
      <button
        // onClick is an event listener prop. It fires when the element is clicked.
        onClick={handleSignOut}
        // disabled is an HTML attribute. If true, the button is unclickable.
        disabled={isLoggingOut}
        className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
      >
        {/* Curly braces {} allow us to write JavaScript inside JSX. */}
        {/* This is the ternary operator (condition ? trueResult : falseResult). */}
        {isLoggingOut ? "Signing out..." : "Sign Out"}
      </button>
    </header>
  );
}