import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Verificação de token opcional se configurado no .env
    const expectedToken = process.env.PERFECTPAY_WEBHOOK_TOKEN;
    if (expectedToken && payload.token && payload.token !== expectedToken) {
      console.warn('[Webhook PerfectPay] Token inválido:', payload.token);
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const {
      code,
      sale_amount,
      currency_enum_key,
      payment_type_enum_key,
      sale_status_enum,
      sale_status_enum_key,
      sale_status_detail,
      customer,
      product,
    } = payload;

    console.log(`[Webhook PerfectPay] Recebido evento para pedido: ${code}, status: ${sale_status_enum_key} / ${sale_status_detail}`);

    // Verifica se a venda foi aprovada
    const isApproved =
      sale_status_enum === 2 ||
      sale_status_enum_key === 'approved' ||
      sale_status_detail === 'paid';

    if (!isApproved) {
      console.log(`[Webhook PerfectPay] Pedido ${code} com status não aprovado (${sale_status_enum_key}). Ignorando.`);
      return NextResponse.json({ message: 'Evento recebido, mas venda não aprovada', status: sale_status_enum_key });
    }

    const email = customer?.email?.trim().toLowerCase();
    const fullName = customer?.full_name?.trim() || 'Cliente Mapa do Amor';
    const phone = customer?.phone_formated || customer?.phone_number || '';
    const cpf = customer?.identification_number || '';

    if (!email) {
      return NextResponse.json({ error: 'E-mail do cliente não fornecido no payload' }, { status: 400 });
    }

    let customerId: string | null = null;

    // 1. Verifica se o usuário já existe na tabela de perfis
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingProfile) {
      customerId = existingProfile.id;
      // Atualiza dados adicionais se necessário
      await supabaseAdmin
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone || undefined,
          cpf: cpf || undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', customerId);
    } else {
      // 2. Cria o usuário no Supabase Auth se ainda não existir
      const tempPassword = `Amor@${Math.random().toString(36).substring(2, 10)}!`;
      
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          phone,
          cpf,
          origin: 'perfectpay',
        },
      });

      if (createError) {
        // Se o erro for de usuário já existente na Auth, busca ele
        console.warn('[Webhook PerfectPay] Aviso ao criar usuário Auth:', createError.message);
        const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
        const found = userData?.users?.find((u) => u.email?.toLowerCase() === email);
        if (found) {
          customerId = found.id;
        }
      } else if (newUser?.user) {
        customerId = newUser.user.id;
      }
    }

    // 3. Registra o pedido na tabela orders
    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .upsert(
        {
          transaction_code: code,
          customer_id: customerId,
          customer_email: email,
          customer_name: fullName,
          sale_amount: typeof sale_amount === 'number' ? sale_amount : parseFloat(sale_amount || '0'),
          currency: currency_enum_key || 'BRL',
          payment_type: payment_type_enum_key || 'desconhecido',
          status: 'approved',
          raw_payload: payload,
        },
        { onConflict: 'transaction_code' }
      );

    if (orderError) {
      console.error('[Webhook PerfectPay] Erro ao salvar pedido na tabela orders:', orderError);
    }

    console.log(`[Webhook PerfectPay] Sucesso! Pedido ${code} processado para ${email} (User ID: ${customerId})`);

    return NextResponse.json({
      status: 'success',
      message: 'Venda processada com sucesso',
      order_code: code,
      customer_id: customerId,
    });
  } catch (err: any) {
    console.error('[Webhook PerfectPay] Erro inesperado:', err);
    return NextResponse.json({ error: 'Erro interno ao processar webhook', details: err.message }, { status: 500 });
  }
}
