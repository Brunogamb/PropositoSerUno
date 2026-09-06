import type { APIRoute } from 'astro';
import { jsPDF } from 'jspdf';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    try {
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

        const doc = new jsPDF();

        doc.setTextColor(38, 0, 144);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Propósito Ser Uno', 105, 20, { align: 'center' });

        doc.setTextColor(120, 75, 242);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'normal');
        doc.text('Ficha de Solicitud de Membresía', 105, 28, { align: 'center' });

        doc.setDrawColor(255, 152, 84); 
        doc.setLineWidth(1);
        doc.line(20, 34, 190, 34);

        doc.setTextColor(38, 0, 144);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Datos Personales', 20, 45);

        let y = 54;
        const addRow = (label: string, value: string) => {
            doc.setTextColor(109, 104, 117); // #6d6875
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`${label}:`, 20, y);

            doc.setTextColor(38, 0, 144);
            doc.setFont('helvetica', 'bold');
            doc.text(value || '-', 70, y);
            y += 8;
        };

        addRow('Apellido/s', apellido);
        addRow('Nombre/s', nombre);
        addRow('Fecha de nacimiento', fecha);
        addRow('Número de celular', celular);
        addRow('Correo electrónico', email);
        addRow('Ciudad', ciudad);
        addRow('Provincia / Estado', provincia);
        addRow('País', pais);

        y += 4;
        doc.setTextColor(38, 0, 144);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Grupo de WhatsApp', 20, y);
        y += 9;

        addRow('Autoriza incorporación', whatsapp);

        y += 4;
        doc.setTextColor(38, 0, 144);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('¿Cómo conoció Propósito Ser Uno?', 20, y);
        y += 9;

        doc.setTextColor(77, 72, 82);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(comoConoce || 'No especificado', 170);
        doc.text(splitText, 20, y);

        doc.setTextColor(160, 174, 192);
        doc.setFontSize(8);
        doc.text(`Documento generado el ${new Date().toLocaleDateString('es-AR')} - Propósito Ser Uno`, 105, 280, { align: 'center' });

        const pdfArrayBuffer = doc.output('arraybuffer');
        const filename = `Solicitud_${apellido}_${nombre}.pdf`.replace(/\s+/g, '_');

        return new Response(pdfArrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ error: 'Error al generar el PDF' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};