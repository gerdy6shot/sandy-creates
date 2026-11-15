import { createClient } from '@supabase/supabase-js';

// Vite embeds these public connection values at build time.
// Supabase RLS and verified user authorization protect data, not the public key.
const url: string | undefined = import.meta.env.VITE_SUPABASE_URL;
const key: string | undefined = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !/^https:\/\/[^/]+\.supabase\.co\/?$/.test(url) || !key?.startsWith('sb_publishable_')) {
 throw new Error('Sandy Creates Supabase build configuration is missing or invalid.');
}
export const sandySupabase = createClient(url, key, {
 auth: { persistSession:true, autoRefreshToken:true, detectSessionInUrl:true },
});
