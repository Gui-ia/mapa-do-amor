import PDFDocument from 'pdfkit';
import { FullLoveMapReport } from '../ai/clara-synthesizer';
import { supabaseAdmin } from '../supabase/admin';

export async function generateLoveMapPDF(
  report: FullLoveMapReport,
  readingId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        bufferPages: true,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));

      doc.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          const fileName = `mapa-do-amor-${readingId}.pdf`;

          // 1. Faz upload para o bucket reading-reports do Supabase
          const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('reading-reports')
            .upload(fileName, pdfBuffer, {
              contentType: 'application/pdf',
              upsert: true,
            });

          if (uploadError) {
            console.error('[PDF Generator] Erro no upload para o Supabase Storage:', uploadError);
            // Se falhar o upload no bucket, cria data URI base64 como fallback garantido
            const base64Pdf = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
            resolve(base64Pdf);
            return;
          }

          // 2. Obtém a URL pública do PDF
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('reading-reports')
            .getPublicUrl(fileName);

          const pdfUrl = publicUrlData?.publicUrl || '';
          console.log(`[PDF Generator] PDF gerado e salvo com sucesso: ${pdfUrl}`);
          resolve(pdfUrl);
        } catch (storageErr) {
          console.error('[PDF Generator] Erro ao salvar buffer do PDF:', storageErr);
          reject(storageErr);
        }
      });

      // ==========================================
      // PÁGINA 1: CAPA EDITORIAL DE LUXO
      // ==========================================
      
      // Fundo e moldura elegante
      doc.rect(20, 20, 555, 802).lineWidth(1.5).strokeColor('#c5a059').stroke();
      doc.rect(25, 25, 545, 792).lineWidth(0.5).strokeColor('#e2b380').stroke();

      doc.moveDown(5);
      doc
        .font('Times-Roman')
        .fontSize(11)
        .fillColor('#8e4b5d')
        .text('SUA JORNADA AFETIVA PESSOAL', { align: 'center', characterSpacing: 3 });

      doc.moveDown(1.5);
      doc
        .font('Times-Bold')
        .fontSize(34)
        .fillColor('#171321')
        .text('MAPA DO AMOR', { align: 'center', characterSpacing: 1 });

      doc.moveDown(0.5);
      doc
        .font('Times-Italic')
        .fontSize(14)
        .fillColor('#6d422a')
        .text('O que seu coração precisa, o que mudar e o amor que você merece viver', { align: 'center' });

      doc.moveDown(4);
      
      // Linha divisória dourada
      doc.moveTo(180, doc.y).lineTo(415, doc.y).lineWidth(1).strokeColor('#c5a059').stroke();
      doc.moveDown(3);

      doc
        .font('Times-Roman')
        .fontSize(13)
        .fillColor('#171321')
        .text('Elaborado especialmente para:', { align: 'center' });

      doc.moveDown(0.5);
      doc
        .font('Times-Bold')
        .fontSize(22)
        .fillColor('#8e4b5d')
        .text(report.meta.clientName, { align: 'center' });

      doc.moveDown(1.5);
      doc
        .font('Times-Roman')
        .fontSize(11)
        .fillColor('#6d422a')
        .text(`Data de Nascimento: ${report.meta.birthDate}  |  Horário: ${report.meta.birthTime || 'Não informado'}`, { align: 'center' });

      doc.moveDown(0.5);
      doc
        .font('Times-Roman')
        .fontSize(11)
        .fillColor('#6d422a')
        .text(`Signo & Arquétipo: ${report.meta.sunSign} — ${report.meta.archetype}`, { align: 'center' });

      doc.moveDown(6);
      doc
        .font('Times-Italic')
        .fontSize(12)
        .fillColor('#171321')
        .text('Por Clara Falk & Especialistas em Quiromancia e Astrologia', { align: 'center' });

      doc.moveDown(0.5);
      doc
        .font('Times-Roman')
        .fontSize(9)
        .fillColor('#999999')
        .text(`Documento emitido em ${report.meta.generatedAt} • Edição Privada e Confidencial`, { align: 'center' });

      // ==========================================
      // CAPÍTULOS E CONTEÚDO
      // ==========================================
      for (const chapter of report.chapters) {
        doc.addPage();

        // Cabeçalho discreto
        doc
          .font('Times-Roman')
          .fontSize(8)
          .fillColor('#999999')
          .text(`MAPA DO AMOR • ${report.meta.clientName.toUpperCase()}`, 50, 30, { align: 'left' });

        doc
          .font('Times-Roman')
          .fontSize(8)
          .fillColor('#999999')
          .text('CLARA FALK', 50, 30, { align: 'right' });

        doc.moveTo(50, 42).lineTo(545, 42).lineWidth(0.5).strokeColor('#dddddd').stroke();

        doc.moveDown(2);

        // Título do Capítulo
        doc
          .font('Times-Roman')
          .fontSize(10)
          .fillColor('#8e4b5d')
          .text(`CAPÍTULO 0${chapter.chapterNumber}`, { characterSpacing: 2 });

        doc.moveDown(0.5);
        doc
          .font('Times-Bold')
          .fontSize(20)
          .fillColor('#171321')
          .text(chapter.title);

        doc.moveDown(0.3);
        doc
          .font('Times-Italic')
          .fontSize(12)
          .fillColor('#c5a059')
          .text(chapter.subtitle);

        doc.moveDown(1.5);

        // Corpo do texto com tipografia legível e espaçamento generoso
        doc
          .font('Times-Roman')
          .fontSize(11)
          .fillColor('#2d2d2d')
          .lineGap(5)
          .text(chapter.content, { align: 'justify' });

        doc.moveDown(2);
      }

      // ==========================================
      // PÁGINA FINAL: BÚSSOLA, PONTOS-CHAVE E CARTA
      // ==========================================
      doc.addPage();

      doc
        .font('Times-Roman')
        .fontSize(8)
        .fillColor('#999999')
        .text(`MAPA DO AMOR • CONCLUSÃO E BÊNÇÃO`, 50, 30, { align: 'left' });

      doc.moveTo(50, 42).lineTo(545, 42).lineWidth(0.5).strokeColor('#dddddd').stroke();
      doc.moveDown(2);

      doc
        .font('Times-Bold')
        .fontSize(18)
        .fillColor('#171321')
        .text('Sua Bússola Diária: Pontos Fundamentais');

      doc.moveDown(1);

      // Caixa de destaque dos pontos-chave
      for (const takeaway of report.summaryKeyTakeaways) {
        doc
          .font('Times-Bold')
          .fontSize(11)
          .fillColor('#8e4b5d')
          .text('✦  ', { continued: true })
          .font('Times-Roman')
          .fillColor('#2d2d2d')
          .text(takeaway, { lineGap: 3 });
        doc.moveDown(0.5);
      }

      doc.moveDown(2);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(0.5).strokeColor('#c5a059').stroke();
      doc.moveDown(2);

      doc
        .font('Times-Bold')
        .fontSize(16)
        .fillColor('#171321')
        .text('Mensagem Pessoal de Clara Falk');

      doc.moveDown(0.8);
      doc
        .font('Times-Italic')
        .fontSize(11.5)
        .fillColor('#4a3b32')
        .lineGap(4)
        .text(report.claraPersonalMessage, { align: 'justify' });

      doc.moveDown(3);
      doc
        .font('Times-BoldItalic')
        .fontSize(13)
        .fillColor('#8e4b5d')
        .text('Com carinho e votos de um amor pleno,', { align: 'right' });

      doc.moveDown(0.5);
      doc
        .font('Times-Bold')
        .fontSize(15)
        .fillColor('#171321')
        .text('Clara Falk', { align: 'right' });

      // Numeração de páginas no rodapé
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        if (i > 0) {
          doc
            .font('Times-Roman')
            .fontSize(8)
            .fillColor('#aaaaaa')
            .text(`Página ${i + 1} de ${pageCount}`, 50, 800, { align: 'center' });
        }
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
