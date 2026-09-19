import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const readingId = params.id;
    if (!readingId) {
      return NextResponse.json({ error: 'ID da leitura inválido' }, { status: 400 });
    }

    const { data: reading, error } = await supabaseAdmin
      .from('readings')
      .select('*')
      .eq('id', readingId)
      .single();

    if (error || !reading) {
      return NextResponse.json({ error: 'Leitura não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ reading });
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro ao buscar leitura', details: err.message }, { status: 500 });
  }
}
