import type { APIRoute } from 'astro';
import { getSupabaseClient } from '../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
        return new Response(JSON.stringify({ error: 'Completá email y contraseña.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
        }

        const supabase = getSupabaseClient();
        const cleanEmail = String(email || '').trim().toLowerCase();

const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: String(password || ''),
});

// 2. Agregá el console.error adentro de este bloque (antes del return)
if (error || !data.session) {
    console.error('Supabase login error:', {
        message: error?.message,
        status: error?.status,
    });

    return new Response(
        JSON.stringify({ error: 'Credenciales inválidas.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
}

        const isProd = import.meta.env.PROD;

        cookies.set('sb-access-token', data.session.access_token, {
        path: '/',
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 60 * 60, 
        });

        cookies.set('sb-refresh-token', data.session.refresh_token, {
        path: '/',
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, 
        });

        cookies.set('psu-logged', '1', {
        path: '/',
        httpOnly: false, 
        secure: isProd,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        });

        return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('Error en /api/login:', err);
        return new Response(JSON.stringify({ error: 'Error interno al iniciar sesión.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        });
    }
};