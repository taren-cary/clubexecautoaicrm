import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('Environment variables:', {
  VITE_SUPABASE_URL: supabaseUrl,
  VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '***' : 'undefined'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  // Temporarily comment out the error throw for debugging
  // throw new Error('Missing Supabase environment variables');
}

// Use fallback values temporarily
const url = supabaseUrl || 'https://srrxtonbtgvbvpxwxgqd.supabase.co';
const key = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycnh0b25idGd2YnZweHd4Z3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDgxNjksImV4cCI6MjA2NzkyNDE2OX0.daA6zo3qmX08HhIPpLfz7G2ObA2cn1lpCVIYQdPsTAs';

export const supabase = createClient(url, key);

// Database table names
export const TABLES = {
  B2B_CALLS: 'b2b_calls',
  B2B_CONTACTS: 'b2b_contacts',
  B2C_CALLS: 'b2c_calls',
  B2C_CONTACTS: 'b2c_contacts',
} as const; 