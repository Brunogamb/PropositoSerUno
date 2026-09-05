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

        const fechaFormateada = data.fechaNacimiento
        ? data.fechaNacimiento.split('-').reverse().join('/')
        : 'No especificada';

        const { data: resendData, error } = await resend.emails.send({
        from: 'Propósito Ser Uno <administracion@propositoseruno.com>',
        to: ['administracion@propositoseruno.com'],
        replyTo: data.correoElectronico,
        subject: `Nueva Solicitud de Membresía: ${data.apellido}, ${data.nombre}`,
        html: `
            <h2>Nueva solicitud de membresía</h2>
            <hr />
            
            <h3>Datos personales</h3>
            <ul>
            <li><strong>Apellido/s:</strong> ${data.apellido}</li>
            <li><strong>Nombre/s:</strong> ${data.nombre}</li>
            <li><strong>Fecha de nacimiento:</strong> ${fechaFormateada}</li>
            <li><strong>Número de celular:</strong> ${data.numeroCelular}</li>
            <li><strong>Correo electrónico:</strong> ${data.correoElectronico}</li>
            <li><strong>Ciudad:</strong> ${data.ciudad}</li>
            <li><strong>Provincia / Estado:</strong> ${data.provinciaEstado}</li>
            <li><strong>País:</strong> ${data.pais}</li>
            </ul>

            <h3>Incorporación al grupo de WhatsApp</h3>
            <p><strong>Autoriza incorporación automática:</strong> ${data.whatsappAuto ? 'Sí' : 'No'}</p>

            <h3>¿Cómo conociste Propósito Ser Uno?</h3>
            <p>${data.comoConoce || 'No especificado'}</p>

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