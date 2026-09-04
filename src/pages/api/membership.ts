import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

interface MembershipPayload {
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    numeroCelular: string;
    correoElectronico: string;
    ciudad: string;
    provinciaEstado: string;
    pais: string;
    comoConoce: string;
    whatsappAuto: boolean;
    aceptaTerminos: boolean;
    aceptaPrivacidad: boolean;
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const data: MembershipPayload = await request.json();

        if (
        !data.nombre ||
        !data.apellido ||
        !data.correoElectronico ||
        !data.numeroCelular ||
        !data.aceptaTerminos ||
        !data.aceptaPrivacidad
        ) {
        return new Response(
            JSON.stringify({ error: 'Faltan campos obligatorios o no aceptó las condiciones.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
        }

        const { data: resendData, error } = await resend.emails.send({
        from: 'Propósito Ser Uno <administracion@propositoseruno.com>',
        to: ['administracion@propositoseruno.com'],
        subject: `Nueva Solicitud de Membresía: ${data.nombre} ${data.apellido}`,
        html: `
            <h2>Nueva solicitud de membresía</h2>
            <hr />
            <h3>Datos personales</h3>
            <ul>
            <li><strong>Nombre completo:</strong> ${data.nombre} ${data.apellido}</li>
            <li><strong>Fecha de nacimiento:</strong> ${data.fechaNacimiento}</li>
            <li><strong>Email:</strong> ${data.correoElectronico}</li>
            <li><strong>Celular:</strong> ${data.numeroCelular}</li>
            <li><strong>Ubicación:</strong> ${data.ciudad}, ${data.provinciaEstado}, ${data.pais}</li>
            </ul>

            <h3>Preferencias y Estado</h3>
            <ul>
            <li><strong>Incorporación automática a WhatsApp:</strong> ${data.whatsappAuto ? 'Sí' : 'No'}</li>
            <li><strong>¿Cómo conoció el programa?:</strong> ${data.comoConoce || 'No especificado'}</li>
            </ul>
        `,
        });

        if (error) {
        return new Response(
            JSON.stringify({ error: 'Hubo un inconveniente al enviar la solicitud.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
        }

        return new Response(
        JSON.stringify({ message: '¡Solicitud enviada con éxito! Nos pondremos en contacto a la brevedad.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        return new Response(
        JSON.stringify({ error: 'Error interno en el servidor.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};