import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, request, url }) => {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
        return new Response('No autorizado', { status: 401 });
    }

    const fileId = params.id;
    if (!fileId) {
        return new Response('Falta ID de archivo', { status: 400 });
    }

    try {
        // Obtiene el token validando la misma cookie de sesión contra /api/drive-token
        const tokenRes = await fetch(`${url.origin}/api/drive-token`, {
            headers: { cookie: cookieHeader },
        });

        if (!tokenRes.ok) {
            return new Response('Sesión inválida o expirada', { status: tokenRes.status });
        }

        const { token: driveToken } = await tokenRes.json();
        const range = request.headers.get('range');

        const headers: Record<string, string> = {
            Authorization: `Bearer ${driveToken}`,
        };
        if (range) {
            headers['Range'] = range;
        }

        const driveRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            headers,
        });

        const responseHeaders = new Headers();
        ['content-type', 'content-length', 'content-range', 'accept-ranges'].forEach((h) => {
            const val = driveRes.headers.get(h);
            if (val) responseHeaders.set(h, val);
        });
        responseHeaders.set('Cache-Control', 'private, no-store');

        return new Response(driveRes.body, {
            status: driveRes.status,
            headers: responseHeaders,
        });
    } catch (err) {
        console.error('Error en stream de Drive:', err);
        return new Response('Error interno al transmitir archivo', { status: 500 });
    }
};