import type { APIRoute } from 'astro';
import { getSupabaseClient } from '../../lib/supabase';
import { getTemporaryAccessToken } from '../../lib/googleDrive';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
    try {
        const accessToken = cookies.get('sb-access-token')?.value;
        const refreshToken = cookies.get('sb-refresh-token')?.value;

        if (!accessToken && !refreshToken) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
        }

        const supabase = getSupabaseClient();
        let user = null;

        if (accessToken) {
        const { data } = await supabase.auth.getUser(accessToken);
        user = data.user;
        }

        if (!user && refreshToken) {
        const { data: refreshed } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
        if (refreshed.session && refreshed.user) {
            user = refreshed.user;
            const isProd = import.meta.env.PROD;
            cookies.set('sb-access-token', refreshed.session.access_token, {
            path: '/',
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            maxAge: 60 * 60,
            });
            cookies.set('sb-refresh-token', refreshed.session.refresh_token, {
            path: '/',
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            });
        }
        }

        if (!user) {
        return new Response(JSON.stringify({ error: 'Sesión inválida' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
        }

        const driveToken = await getTemporaryAccessToken();

        return new Response(JSON.stringify({ token: driveToken }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, private',
        },
        });
    } catch (err) {
        console.error('Error en /api/drive-token:', err);
        return new Response(JSON.stringify({ error: 'Error interno' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        });
    }
};