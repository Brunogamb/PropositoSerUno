import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const escapeHtml = (value: string) =>
    value.replace(/[&<>'"]/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
    })[character] ?? character);

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
        const siteUrl = 'https://propositoseruno.com';
        const logoUrl = `${siteUrl}/logo-email.webp`;

        const pdfParams = new URLSearchParams({
            nombre: data.nombre,
            apellido: data.apellido,
            fecha: fechaFormateada,
            celular: data.numeroCelular,
            email: data.correoElectronico,
            ciudad: data.ciudad || '',
            provincia: data.provinciaEstado || '',
            pais: data.pais || '',
            comoConoce: data.comoConoce || '',
            whatsapp: data.whatsappAuto ? 'Sí' : 'No',
        });
        const pdfDownloadUrl = `${siteUrl}/api/pdf?${pdfParams.toString()}`;

        const { error } = await resend.emails.send({
            from: 'Propósito Ser Uno <administracion@propositoseruno.com>',
            to: ['administracion@propositoseruno.com'],
            replyTo: data.correoElectronico,
            subject: `Nueva Solicitud de Membresía: ${data.apellido}, ${data.nombre}`,
            attachments: [{
                filename: 'logo-email.webp',
                path: logoUrl,
                contentId: 'logo-email',
            }],
            html: `
                <div style="margin: 0; padding: 32px 16px; background-color: #f7f4ef; color: #260090; font-family: Arial, Helvetica, sans-serif;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 680px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8e1d9; border-radius: 8px; overflow: hidden;">
                        <tr>
                            <td style="padding: 28px 32px; background-color: #ff9854; text-align: center;">
                                <img src="cid:logo-email" alt="Propósito Ser Uno" width="280" style="display: block; width: 280px; max-width: 100%; height: auto; margin: 0 auto; border: 0;">
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 32px;">
                                <p style="margin: 0 0 8px; color: #784bf2; font-size: 13px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">Nueva solicitud</p>
                                
                                <!-- TITULO Y BOTÓN DE DESCARGA EN LA MISMA LÍNEA -->
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                                    <tr>
                                        <td valign="middle" align="left">
                                            <h1 style="margin: 0; color: #260090; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: normal; line-height: 1.25;">Solicitud de membresía</h1>
                                        </td>
                                        <td valign="middle" align="right" style="white-space: nowrap; padding-left: 12px;">
                                            <a href="${pdfDownloadUrl}" target="_blank" style="display: inline-block; padding: 8px 14px; background-color: #784bf2; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 4px;">
                                                📄 Descargar PDF
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <h2 style="margin: 0 0 14px; color: #260090; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: normal;">Datos personales</h2>
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; font-size: 15px; line-height: 1.5;">
                                    <tr><td style="padding: 9px 0; color: #6d6875; width: 42%; border-bottom: 1px solid #eee8e2;">Apellido/s</td><td style="padding: 9px 0; color: #260090; font-weight: bold; border-bottom: 1px solid #eee8e2;">${escapeHtml(data.apellido)}</td></tr>
                                    <tr><td style="padding: 9px 0; color: #6d6875; border-bottom: 1px solid #eee8e2;">Nombre/s</td><td style="padding: 9px 0; color: #260090; font-weight: bold; border-bottom: 1px solid #eee8e2;">${escapeHtml(data.nombre)}</td></tr>
                                    <tr><td style="padding: 9px 0; color: #6d6875; border-bottom: 1px solid #eee8e2;">Fecha de nacimiento</td><td style="padding: 9px 0; color: #260090; border-bottom: 1px solid #eee8e2;">${escapeHtml(fechaFormateada)}</td></tr>
                                    <tr><td style="padding: 9px 0; color: #6d6875; border-bottom: 1px solid #eee8e2;">Número de celular</td><td style="padding: 9px 0; color: #260090; border-bottom: 1px solid #eee8e2;">${escapeHtml(data.numeroCelular)}</td></tr>
                                    <tr><td style="padding: 9px 0; color: #6d6875; border-bottom: 1px solid #eee8e2;">Correo electrónico</td><td style="padding: 9px 0; color: #260090; border-bottom: 1px solid #eee8e2;">${escapeHtml(data.correoElectronico)}</td></tr>
                                    <tr><td style="padding: 9px 0; color: #6d6875; border-bottom: 1px solid #eee8e2;">Ciudad</td><td style="padding: 9px 0; color: #260090; border-bottom: 1px solid #eee8e2;">${escapeHtml(data.ciudad || 'No especificada')}</td></tr>
                                    <tr><td style="padding: 9px 0; color: #6d6875; border-bottom: 1px solid #eee8e2;">Provincia / Estado</td><td style="padding: 9px 0; color: #260090; border-bottom: 1px solid #eee8e2;">${escapeHtml(data.provinciaEstado || 'No especificada')}</td></tr>
                                    <tr><td style="padding: 9px 0; color: #6d6875;">País</td><td style="padding: 9px 0; color: #260090;">${escapeHtml(data.pais || 'No especificado')}</td></tr>
                                </table>

                                <div style="margin-top: 28px; padding: 20px; background-color: #fff4ec; border-left: 4px solid #ff9854;">
                                    <h2 style="margin: 0 0 8px; color: #260090; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: normal;">Incorporación al grupo de WhatsApp</h2>
                                    <p style="margin: 0; color: #4d4852; font-size: 15px; line-height: 1.5;"><strong>Autoriza incorporación automática:</strong> ${data.whatsappAuto ? 'Sí' : 'No'}</p>
                                </div>

                                <h2 style="margin: 28px 0 8px; color: #260090; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: normal;">¿Cómo conociste Propósito Ser Uno?</h2>
                                <p style="margin: 0; color: #4d4852; font-size: 15px; line-height: 1.6;">${escapeHtml(data.comoConoce || 'No especificado')}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 32px; background-color: #260090; color: #ffffff; font-size: 12px; line-height: 1.5; text-align: center;">Propósito Ser Uno · ${new Date().getFullYear()}</td>
                        </tr>
                    </table>
                </div>
            `,
        });

        if (error) {
        return new Response(
            JSON.stringify({ error: 'Hubo un inconveniente al enviar la solicitud.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
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