import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  B2B_CALLS: 'b2b_calls',
  B2B_CONTACTS: 'b2b_contacts',
  B2C_CALLS: 'b2c_calls',
  B2C_CONTACTS: 'b2c_contacts',
} as const; 