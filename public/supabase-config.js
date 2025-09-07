window.SUPABASE_CONFIG = {
    url: 'https://jfejymhssyiypzlbogcq.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZWp5bWhzc3lpeXB6bGJvZ2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxOTkzMTUsImV4cCI6MjA3Mjc3NTMxNX0.mOR_IEKzwJ-KrnEGG0bMgxNwF2QDgq5c1jas-LcHkfQ'
};

window.createSupabaseClient = async () => {
    const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js');
    return createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey, {
        auth: {
            persistSession: false
        }
    });
};
