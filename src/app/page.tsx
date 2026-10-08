// src/app/page.tsx
//
// The homepage, rendered at "/". Protected by src/middleware.ts — an
// unauthenticated visitor is redirected to /login before this component
// ever renders, so nothing extra needs to be checked here.

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-semibold">Daycare Management</h1>
      <p className="mt-2 text-gray-600">
        Scaffold is running. Features are built one at a time, together.
      </p>
    </main>
  );
}
