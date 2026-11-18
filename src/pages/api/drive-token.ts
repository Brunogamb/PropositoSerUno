import type { APIRoute } from 'astro';
import { getDriveAccessToken } from '../../lib/googleDrive';

export const prerender = false;

export const GET: APIRoute = async () => {
    try {
        const token = await getDriveAccessToken();

        return new Response(JSON.stringify({ token }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
        },
        });
    } catch (error) {
        console.error('Error generando token de Drive:', error);
        return new Response(JSON.stringify({ error: 'No se pudo obtener acceso al material' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        });
    }
};