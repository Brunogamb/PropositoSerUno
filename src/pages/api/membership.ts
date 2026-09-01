import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json();
    
    const {
      apellido,
      nombre,
      fechaNacimiento,
      numeroCelular,
      correoElectronico,
      ciudad,
      provinciaEstado,
      pais,
      comoConoce,
      whatsappAuto,
      aceptaTerminos,
      aceptaPrivacidad,
    } = body;

    if (!apellido || !nombre || !fechaNacimiento || !numeroCelular || !correoElectronico || !ciudad || !provinciaEstado || !pais) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!aceptaTerminos || !aceptaPrivacidad) {
      return new Response(
        JSON.stringify({ error: 'Debes aceptar los términos y condiciones' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailContent = `
    <h2>Nueva Solicitud de Membresía</h2>
    <h3>Datos Personales</h3>
    <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
    <p><strong>Fecha de Nacimiento:</strong> ${fechaNacimiento}</p>
    <p><strong>Número de Celular:</strong> ${numeroCelular}</p>
    <p><strong>Correo Electrónico:</strong> ${correoElectronico}</p>
    <p><strong>Ciudad:</strong> ${ciudad}</p>
    <p><strong>Provincia/Estado:</strong> ${provinciaEstado}</p>
    <p><strong>País:</strong> ${pais}</p>
    
    <h3>Información Adicional</h3>
    ${comoConoce ? `<p><strong>¿Cómo nos conociste?:</strong> ${comoConoce}</p>` : ''}
    
    <h3>Preferencias</h3>
    <p><strong>WhatsApp Automático:</strong> ${whatsappAuto ? 'Sí' : 'No'}</p>
    `;

    const adminEmail = import.meta.env.ADMIN_EMAIL || 'contact@propositoseruno.com';
    
    await resend.emails.send({
      from: 'Propósito Ser Uno <onboarding@resend.dev>',
      to: adminEmail,
      subject: `Nueva Solicitud de Membresía: ${nombre} ${apellido}`,
      html: emailContent,
      replyTo: correoElectronico,
    });

    await resend.emails.send({
      from: 'Propósito Ser Uno <onboarding@resend.dev>',
      to: correoElectronico,
      subject: '¡Tu solicitud de membresía ha sido recibida!',
      html: `
      <h2>¡Bienvenido a Propósito Ser Uno!</h2>
      <p>Hola ${nombre},</p>
      <p>Hemos recibido tu solicitud de membresía. Nos pondremos en contacto contigo pronto para completar el proceso.</p>
      <p>Gracias por formar parte de nuestra comunidad.</p>
      <br>
      <p>Saludos,<br>El equipo de Propósito Ser Uno</p>
      `,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Formulario enviado correctamente. Revisa tu correo electrónico.' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    return new Response(
      JSON.stringify({ error: 'Error al procesar el formulario' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
