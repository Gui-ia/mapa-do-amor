import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { email: rawEmail, password } = await req.json();

    const email = rawEmail?.trim().toLowerCase();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter no mínimo 6 caracteres.' },
        { status: 400 }
      );
    }

    // 1. Verifica se existe compra aprovada vinculada a este e-mail
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .ilike('customer_email', email)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // 2. Se não encontrar em orders, checa se existe em profiles
    let fullName = order?.customer_name || '';
    let customerId = order?.customer_id || null;

    if (!order) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .ilike('email', email)
        .maybeSingle();

      if (!profile) {
        return NextResponse.json(
          {
            error:
              'Não localizamos uma compra aprovada com este e-mail. Por favor, verifique se digitou exatamente o mesmo e-mail utilizado na compra da PerfectPay.',
          },
          { status: 404 }
        );
      }

      fullName = profile.full_name;
      customerId = profile.id;
    }

    // 3. Procura o usuário no Supabase Auth
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuthUser = listData?.users?.find(
      (u) => u.email?.toLowerCase() === email
    );

    let finalUserId: string;

    if (existingAuthUser) {
      finalUserId = existingAuthUser.id;
      // Atualiza a senha do usuário
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        finalUserId,
        {
          password: password,
          email_confirm: true,
          user_metadata: {
            ...existingAuthUser.user_metadata,
            full_name: fullName || existingAuthUser.user_metadata?.full_name || 'Cliente Mapa do Amor',
          },
        }
      );

      if (updateError) {
        console.error('[Activate] Erro ao atualizar senha:', updateError);
        return NextResponse.json(
          { error: 'Não foi possível definir sua senha. Tente novamente.' },
          { status: 500 }
        );
      }
    } else {
      // Cria novo usuário no Auth caso ainda não tenha sido gerado
      const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName || 'Cliente Mapa do Amor',
          origin: 'activation',
        },
      });

      if (createError || !newAuthUser?.user) {
        console.error('[Activate] Erro ao criar usuário Auth:', createError);
        return NextResponse.json(
          { error: 'Erro ao criar seu acesso. Tente novamente.' },
          { status: 500 }
        );
      }

      finalUserId = newAuthUser.user.id;
    }

    // 4. Garante que os registros em orders e profiles fiquem vinculados ao finalUserId
    await supabaseAdmin
      .from('orders')
      .update({ customer_id: finalUserId })
      .ilike('customer_email', email)
      .is('customer_id', null);

    await supabaseAdmin
      .from('profiles')
      .upsert({
        id: finalUserId,
        email: email,
        full_name: fullName || 'Cliente Mapa do Amor',
        updated_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      email,
      fullName,
      message: 'Senha definida com sucesso! Realizando login...',
    });
  } catch (err: any) {
    console.error('[Activate] Erro inesperado:', err);
    return NextResponse.json(
      { error: 'Erro interno ao ativar acesso.', details: err.message },
      { status: 500 }
    );
  }
}
