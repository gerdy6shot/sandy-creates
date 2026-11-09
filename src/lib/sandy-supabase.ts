import { createClient } from '@supabase/supabase-js';

// These are PUBLIC browser connection parameters, not privileged credentials.
// Authentication and database RLS enforce authorization on every request.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://ncphseqscanghqdgzetf.supabase.co';
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_vA0-xhnHkt8BU2rQdZBc_w_nMDFhaAk";

export const sandySupabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
export const OWNER_EMAIL = 'becomeunfazed@gmail.com';
