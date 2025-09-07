import { createClient } from '@supabase/supabase-js';

if (typeof window === 'undefined') {
    throw new Error('supabaseClient solo debe usarse en el navegador');
}

const SUPABASE_URL = 'https://jfejymhssyiypzlbogcq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZWp5bWhzc3lpeXB6bGJvZ2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxOTkzMTUsImV4cCI6MjA3Mjc3NTMxNX0.mOR_IEKzwJ-KrnEGG0bMgxNwF2QDgq5c1jas-LcHkfQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: false
    }
});