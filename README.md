# Daycare Management App

## Run it
npm install
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev

## Pages
/            - homepage (protected by middleware)
/login       - staff login
/signup      - staff sign up (email confirmation via PKCE, /auth/confirm)
/enroll      - enroll a child into a classroom (calls enroll_child)

## Database
Migrations in supabase/migrations/ already ran against the live project.
Kept here as historical record; no need to re-run.

## Supabase dashboard settings already configured
- RLS enabled on children, classrooms, enrollments (staff full access
  policies, TO authenticated)
- Redirect URL added: http://localhost:3000/auth/confirm
