import type { APIRoute } from 'astro';
import PDFDocument from 'pdfkit';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    
    const nombre = url.searchParams.get('nombre') || '';
    const apellido = url.searchParams.get('apellido') || '';
    const fecha = url.searchParams.get('fecha') || '';
    const celular = url.searchParams.get('celular') || '';
    const email = url.searchParams.get('email') || '';
    const ciudad = url.searchParams.get('ciudad') || '';
    const provincia = url.searchParams.get('provincia') || '';
    const pais = url.searchParams.get('pais') || '';
    const comoConoce = url.searchParams.get('comoConoce') || '';
    const whatsapp = url.searchParams.get('whatsapp') || 'No';

    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err) => reject(err));

        doc.fillColor('#260090').fontSize(22).text('Propósito Ser Uno', { align: 'center' });
        doc.moveDown(0.3);
        doc.fillColor('#784bf2').fontSize(14).text('Ficha de Solicitud de Membresía', { align: 'center' });
        doc.moveDown(1.5);

        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#ff9854').lineWidth(2).stroke();
        doc.moveDown(1.5);

        doc.fillColor('#260090').fontSize(16).text('Datos Personales');
        doc.moveDown(0.8);

        const addRow = (label: string, value: string) => {
            doc.fillColor('#6d6875').fontSize(11).text(label, { continued: true, width: 150 });
            doc.fillColor('#260090').fontSize(11).text(`: ${value}`);
            doc.moveDown(0.5);
        };

        addRow('Apellido/s', apellido);
        addRow('Nombre/s', nombre);
        addRow('Fecha de nacimiento', fecha);
        addRow('Número de celular', celular);
        addRow('Correo electrónico', email);
        addRow('Ciudad', ciudad || 'No especificada');
        addRow('Provincia / Estado', provincia || 'No especificada');
        addRow('País', pais || 'No especificado');

        doc.moveDown(1);
        doc.fillColor('#260090').fontSize(16).text('Grupo de WhatsApp');
        doc.moveDown(0.8);
        addRow('Autoriza incorporación', whatsapp);

        doc.moveDown(1);
        doc.fillColor('#260090').fontSize(16).text('¿Cómo conoció Propósito Ser Uno?');
        doc.moveDown(0.8);
        doc.fillColor('#4d4852').fontSize(11).text(comoConoce || 'No especificado');

        doc.moveDown(2);
        doc.fillColor('#a0aec0').fontSize(9).text(`Documento generado el ${new Date().toLocaleDateString('es-AR')} - Propósito Ser Uno`, { align: 'center' });

        doc.end();
    });

    const filename = `Solicitud_${apellido}_${nombre}.pdf`.replace(/\s+/g, '_');

    return new Response(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
};