# Daycare-App

A staff-side daycare management platform built with Next.js 14 (App Router), Supabase, and Tailwind CSS. 

## Overview

This application allows daycare staff to authenticate securely and enroll children into classrooms. Enrollment is enforced at the database level using a concurrency-safe Postgres function, preventing capacity overruns even under simultaneous requests. Data access is strictly gated by Row Level Security (RLS).

### Key Features
- **PKCE Authentication:** Secure email/password signup and login via Supabase Auth.
- **Route Protection:** Next.js middleware intercepts unauthenticated requests and redirects to login.
- **Row Level Security:** Postgres RLS ensures users can only access data they are authorized to see.
- **Concurrency-Safe Enrollment:** A Postgres RPC (`enroll_child`) uses `FOR UPDATE` row locking to serialize enrollments per classroom.
- **Clean Architecture:** UI components are decoupled from Supabase using the Repository pattern.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database & Auth:** Supabase (PostgreSQL, Auth, RLS)
- **Styling:** Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18.18 or later
- A Supabase project

### 1. Clone the repository
```bash
git clone https://github.com/austinmahlathini-jpg/Daycare-App.git
cd Daycare-App
UYTRE