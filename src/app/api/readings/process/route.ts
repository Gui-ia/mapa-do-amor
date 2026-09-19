import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { analyzePalmPhoto } from '@/lib/ai/palmistry-agent';
import { analyzeAstrologyProfile } from '@/lib/ai/astrology-agent';
import { synthesizeLoveMap } from '@/lib/ai/clara-synthesizer';
import { generateLoveMapPDF } from '@/lib/pdf/generate-mapa-pdf';

export const maxDuration = 120; // Permite tempo para os agentes de IA e PDF

export async function POST(req: NextRequest) {
  try {
    const { readingId } = await req.json();

    if (!readingId) {
      return NextResponse.json({ error: 'readingId é obrigatório' }, { status: 400 });
    }

    // 1. Busca a leitura no banco
    const { data: reading, error: fetchError } = await supabaseAdmin
      .from('readings')
      .select('*')
      .eq('id', readingId)
      .single();

    if (fetchError || !reading) {
      return NextResponse.json({ error: 'Leitura não encontrada' }, { status: 404 });
    }

    // Se já estiver concluída, retorna os dados
    if (reading.status === 'completed') {
      return NextResponse.json({ status: 'completed', reading });
    }

    console.log(`[Process Reading] Iniciando processamento multi-agente para ${reading.full_name} (${readingId})...`);

    // 2. Executa análise de quiromancia e astrologia em paralelo
    const [palmistryResult, astrologyResult] = await Promise.all([
      analyzePalmPhoto(reading.hand_photo_url, reading.full_name),
      analyzeAstrologyProfile(reading.full_name, reading.birth_date, reading.birth_time),
    ]);

    console.log(`[Process Reading] Quiromancia e Astrologia concluídas. Iniciando redação da Clara Falk...`);

    // 3. Clara Falk sintetiza e redige o relatório completo
    const loveMapReport = await synthesizeLoveMap(
      reading.full_name,
      reading.birth_date,
      reading.birth_time,
      palmistryResult,
      astrologyResult
    );

    console.log(`[Process Reading] Redação concluída. Gerando PDF diagramado...`);

    // 4. Gera o PDF oficial e salva no Supabase Storage
    const pdfUrl = await generateLoveMapPDF(loveMapReport, reading.id);

    // 5. Atualiza a leitura no banco
    const { data: updatedReading, error: updateError } = await supabaseAdmin
      .from('readings')
      .update({
        status: 'completed',
        report_data: loveMapReport,
        pdf_url: pdfUrl,
        completed_at: new Date().toISOString(),
      })
      .eq('id', readingId)
      .select()
      .single();

    if (updateError) {
      console.error('[Process Reading] Erro ao atualizar status final da leitura:', updateError);
      return NextResponse.json({ error: 'Erro ao salvar leitura finalizada' }, { status: 500 });
    }

    console.log(`[Process Reading] Sucesso completo para leitura ${readingId}!`);

    return NextResponse.json({
      status: 'completed',
      reading: updatedReading,
    });
  } catch (error: any) {
    console.error('[Process Reading] Erro durante processamento:', error);
    return NextResponse.json({ error: 'Falha no processamento da leitura', details: error.message }, { status: 500 });
  }
}
