// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client configuration.
 * Creates a single shared client instance using public anon key.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Main Supabase client for the Daycare App.
 * Used for authentication, database queries, and storage.
 * Only public operations allowed — sensitive actions routed through Edge Functions.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);