// "import type" only imports TypeScript types. It is removed during compilation.
import type { Metadata } from "next";
import "./globals.css";
// Import the Header component so it wraps every page in the app
import Header from "@/components/Header";

// export const creates a constant variable and exports it.
// The ": Metadata" part is TypeScript type annotation ensuring it matches Next.js rules.
export const metadata: Metadata = {
  title: "Daycare Management",
  description: "Daycare administration app",
};

// This component accepts "props" (properties). 
// We are using object destructuring to pull out the "children" prop.
// The { children: React.ReactNode } part is TypeScript enforcing that children must be valid JSX.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // lang="en" is a standard HTML attribute.
    <html lang="en">
      {/* The body contains all visible page content. */}
      <body className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        
        {/* We render the imported Header component here. */}
        <Header /> 
        
        {/* The children prop injects the specific page (like /login or /enroll) here. */}
        <div className="flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}