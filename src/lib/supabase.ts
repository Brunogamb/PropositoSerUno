import { createClient } from '@supabase/supabase-js';

export function getSupabaseClient() {
    const url = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const anonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        throw new Error('Faltan PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_ANON_KEY');
    }

    return createClient(url, anonKey, {
        auth: {
        persistSession: false,
        autoRefreshToken: false,
        },
    });
}