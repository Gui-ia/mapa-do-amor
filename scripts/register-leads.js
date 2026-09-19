// scripts/register-leads.js - Cadastra os 3 clientes no Supabase e envia os e-mails oficiais de acesso
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://udxxcswwfuunvjelxalk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0GfC4BUWF5w3KVkq1peX-w_rM60mv9P';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = 'Clara Falk <acesso@lecturalunar.com>';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const leads = [
  {
    code: 'PPCPMTB5HKA87E7VVP',
    fullName: 'Maria Aparecida de Araujo Bernardo',
    email: 'mariaapabernardo84@gmail.com',
    paymentType: 'credit_card',
    amount: 29.90,
    date: '19/09/2026 00:30:41'
  },
  {
    code: 'PPCPMTB5HKA4O6QWKO',
    fullName: 'Maria Elisa da Silva',
    email: 'mariaelisasilva688@gmail.com',
    paymentType: 'pix',
    amount: 29.90,
    date: '18/09/2026 21:35:38'
  },
  {
    code: 'PPCPMTB5HK9N6D7D62',
    fullName: 'Luiza do Nascimento Reffi',
    email: 'luizareffi90@gmail.com',
    paymentType: 'pix',
    amount: 29.90,
    date: '18/09/2026 15:05:33'
  }
];

function generateEmailHtml(lead) {
  const firstName = lead.fullName.trim().split(' ')[0];
  const accessUrl = 'https://lecturalunar.com/app';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>✦ Seu Acesso ao Mapa do Amor está Liberado! • Clara Falk</title>
</head>
<body style="margin: 0; padding: 0; background-color: #07050b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #eeddc9;">
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0;">
    Seu pagamento foi confirmado com sucesso. Acesse agora o aplicativo do Mapa do Amor com Clara Falk e inicie sua revelação pessoal.
  </div>
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07050b; background: radial-gradient(circle at 50% 15%, #1d142c 0%, #07050b 80%); padding: 35px 12px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #120d1c; border: 1px solid #2e2343; border-radius: 28px; overflow: hidden; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);">
          <tr>
            <td align="center" style="padding: 42px 35px 28px 35px; background: linear-gradient(180deg, #1c142c 0%, #120d1c 100%); border-bottom: 1px solid #271e3b;">
              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 18px;">
                <tr>
                  <td align="center" style="background-color: rgba(197, 160, 89, 0.12); border: 1px solid rgba(197, 160, 89, 0.4); border-radius: 30px; padding: 5px 16px;">
                    <span style="font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #dfc382; font-family: Georgia, serif;">
                      ✦ PORTAL OFICIAL DO MAPA DO AMOR ✦
                    </span>
                  </td>
                </tr>
              </table>
              <div style="width: 86px; height: 86px; border-radius: 50%; padding: 2px; background: linear-gradient(135deg, #f5dda9 0%, #c5a059 50%, #8e4b5d 100%); margin: 0 auto 16px auto; box-shadow: 0 8px 24px rgba(197, 160, 89, 0.28);">
                <img src="https://lecturalunar.com/clara-falk-retrato-v1.png" alt="Clara Falk" width="86" height="86" style="display: block; border-radius: 50%; object-fit: cover; width: 86px; height: 86px; background-color: #20172c;">
              </div>
              <div style="font-size: 26px; font-weight: 700; letter-spacing: 3px; color: #ffffff; font-family: Georgia, serif; text-transform: uppercase; margin-bottom: 4px;">
                CLARA FALK
              </div>
              <div style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #c5a059; opacity: 0.9;">
                Lectura Lunar • Guia Afetiva
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 38px 36px;">
              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 18px;">
                <tr>
                  <td style="background-color: rgba(34, 197, 94, 0.12); border: 1px solid rgba(34, 197, 94, 0.4); border-radius: 20px; padding: 4px 14px;">
                    <span style="font-size: 11px; font-weight: 700; color: #4ade80; letter-spacing: 1px; text-transform: uppercase;">
                      ● Pagamento Confirmado &bull; Acesso Liberado
                    </span>
                  </td>
                </tr>
              </table>
              <h1 style="font-size: 24px; color: #ffffff; font-family: Georgia, serif; font-weight: normal; line-height: 1.35; margin: 0 0 16px 0;">
                Olá, <span style="color: #dfc382; font-weight: bold;">${firstName}</span>! Seu portal foi aberto.
              </h1>
              <p style="font-size: 15px; line-height: 1.65; color: #e5d4c3; margin: 0 0 24px 0;">
                É com imensa honra que recebo você no <strong>Mapa do Amor</strong>. Seu acesso ao nosso aplicativo exclusivo já está liberado para que eu possa traçar suas coordenadas afetivas, analisar as linhas da sua mão e revelar a direção sagrada do seu futuro no amor.
              </p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(145deg, #1d162c 0%, #150f22 100%); border: 1px solid #473661; border-radius: 20px; margin: 28px 0; box-shadow: 0 14px 30px rgba(0,0,0,0.5);">
                <tr>
                  <td style="padding: 26px 22px; text-align: center;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #dfc382; margin-bottom: 6px;">
                      Sua Credencial de Acesso
                    </div>
                    <div style="display: inline-block; background-color: #0b0713; border: 1px solid #3c2c54; border-radius: 12px; padding: 8px 18px; margin-bottom: 22px;">
                      <span style="font-size: 15px; font-weight: 600; color: #ffffff; word-break: break-all;">
                        ${lead.email}
                      </span>
                    </div>
                    <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto;">
                      <tr>
                        <td align="center" style="border-radius: 14px; background: linear-gradient(135deg, #fae2b1 0%, #d4af37 45%, #a67c29 100%); box-shadow: 0 8px 24px rgba(212, 175, 55, 0.35);">
                          <a href="${accessUrl}" target="_blank" style="display: inline-block; padding: 18px 42px; font-size: 15px; font-weight: 800; color: #120d1c; text-decoration: none; border-radius: 14px; letter-spacing: 0.8px; text-transform: uppercase;">
                            Entrar no Meu Mapa do Amor &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                    <div style="font-size: 12px; color: #a494b5; margin-top: 16px;">
                      Link de acesso: <br>
                      <a href="${accessUrl}" style="color: #dfc382; text-decoration: underline;">${accessUrl}</a>
                    </div>
                  </td>
                </tr>
              </table>
              <h2 style="font-size: 17px; color: #ffffff; font-family: Georgia, serif; margin: 34px 0 16px 0; border-bottom: 1px solid #271e3b; padding-bottom: 10px;">
                ✦ Como começar em 3 passos simples:
              </h2>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 14px; background-color: #171124; border: 1px solid #2b213f; border-radius: 14px;">
                <tr>
                  <td width="54" align="center" valign="middle" style="padding: 16px 0 16px 14px;">
                    <div style="width: 32px; height: 32px; line-height: 32px; background: linear-gradient(135deg, #dfc382 0%, #c5a059 100%); color: #120d1c; font-weight: 800; font-size: 14px; text-align: center; border-radius: 50%;">1</div>
                  </td>
                  <td style="padding: 16px 16px 16px 8px; font-size: 14px; line-height: 1.5; color: #e2d2c1;">
                    <strong style="color: #ffffff;">Toque no botão dourado acima</strong> para abrir o aplicativo oficial no seu navegador.
                  </td>
                </tr>
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 14px; background-color: #171124; border: 1px solid #2b213f; border-radius: 14px;">
                <tr>
                  <td width="54" align="center" valign="middle" style="padding: 16px 0 16px 14px;">
                    <div style="width: 32px; height: 32px; line-height: 32px; background: linear-gradient(135deg, #dfc382 0%, #c5a059 100%); color: #120d1c; font-weight: 800; font-size: 14px; text-align: center; border-radius: 50%;">2</div>
                  </td>
                  <td style="padding: 16px 16px 16px 8px; font-size: 14px; line-height: 1.5; color: #e2d2c1;">
                    Na aba <strong>"Primeiro Acesso"</strong>, informe seu e-mail (<span style="color: #dfc382;">${lead.email}</span>) e cadastre sua senha pessoal de uso.
                  </td>
                </tr>
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: #171124; border: 1px solid #2b213f; border-radius: 14px;">
                <tr>
                  <td width="54" align="center" valign="middle" style="padding: 16px 0 16px 14px;">
                    <div style="width: 32px; height: 32px; line-height: 32px; background: linear-gradient(135deg, #dfc382 0%, #c5a059 100%); color: #120d1c; font-weight: 800; font-size: 14px; text-align: center; border-radius: 50%;">3</div>
                  </td>
                  <td style="padding: 16px 16px 16px 8px; font-size: 14px; line-height: 1.5; color: #e2d2c1;">
                    <strong>Envie a foto da palma da sua mão</strong> e data de nascimento. Eu mesma examinarei suas linhas e redigirei seu dossiê completo.
                  </td>
                </tr>
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-left: 3px solid #c5a059; background-color: rgba(197, 160, 89, 0.05); border-radius: 0 14px 14px 0; margin-top: 30px;">
                <tr>
                  <td style="padding: 20px 22px;">
                    <p style="font-family: Georgia, serif; font-style: italic; font-size: 15px; color: #f2e2cf; line-height: 1.6; margin: 0 0 10px 0;">
                      &ldquo;O que você viveu no amor até hoje não foi um erro, foi apenas a preparação para o momento em que a clareza chegasse. Suas mãos guardam a chave. Estou te esperando no aplicativo.&rdquo;
                    </p>
                    <div style="font-size: 13px; font-weight: 700; color: #ffffff;">Clara Falk</div>
                    <div style="font-size: 11px; color: #c5a059; margin-top: 2px;">Mentora e Fundadora do Mapa do Amor</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 26px 30px; background-color: #0b0714; border-top: 1px solid #231a34; font-size: 11px; color: #837496; line-height: 1.6;">
              <p style="margin: 0 0 8px 0;">
                Pedido: <strong style="color: #b3a4c8;">#${lead.code}</strong> &bull; Ambiente Seguro SSL 256-bit
              </p>
              <p style="margin: 0 0 10px 0;">
                Dúvidas ou suporte? Responda a este e-mail ou escreva para: <br>
                <a href="mailto:suporte@lecturalunar.com" style="color: #dfc382; text-decoration: none; font-weight: 600;">suporte@lecturalunar.com</a>
              </p>
              <p style="margin: 0; opacity: 0.75;">
                &copy; 2026 Mapa do Amor com Clara Falk &bull; lecturalunar.com &bull; Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function generateEmailText(lead) {
  const firstName = lead.fullName.trim().split(' ')[0];
  const accessUrl = 'https://lecturalunar.com/app';

  return `✦ MAPA DO AMOR COM CLARA FALK ✦
===========================================
PAGAMENTO CONFIRMADO & ACESSO LIBERADO!

Olá, ${firstName}!

É uma alegria imensa dar as boas-vindas à sua jornada de revelação afetiva. Seu pagamento foi confirmado com sucesso e seu acesso ao aplicativo exclusivo do Mapa do Amor já está liberado.

SUA CREDENCIAL DE ACESSO:
E-mail cadastrado: ${lead.email}
Link oficial de acesso: ${accessUrl}

COMO FAZER SEU PRIMEIRO ACESSO EM 3 PASSOS:
1. Abra o link: ${accessUrl}
2. Na aba "Primeiro Acesso", digite seu e-mail (${lead.email}) e crie sua senha pessoal.
3. Envie sua data de nascimento e a foto da sua palma da mão para Clara Falk gerar sua leitura completa.

Código da Transação: ${lead.code}
Suporte Oficial: suporte@lecturalunar.com

"O que você viveu no amor até hoje não foi um erro, foi apenas a preparação para o momento em que a clareza chegasse. Suas mãos guardam a chave."

Com carinho,
Clara Falk • Mapa do Amor`;
}

async function processLeads() {
  console.log('Iniciando processamento dos 3 leads históricos...\n');

  for (const lead of leads) {
    console.log(`--------------------------------------------------`);
    console.log(`Processando: ${lead.fullName} (${lead.email})`);
    console.log(`Transação: ${lead.code} | Valor: R$ ${lead.amount} | Pagamento: ${lead.paymentType}`);

    // 1. Cadastrar / Atualizar em profiles no Supabase
    try {
      const { data: profData, error: profError } = await supabase.from('profiles').upsert({
        email: lead.email.trim().toLowerCase(),
        full_name: lead.fullName,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

      if (profError) {
        console.warn('  ⚠️ Aviso profiles:', profError.message);
      } else {
        console.log('  ✓ Perfil registrado na tabela profiles.');
      }
    } catch (e) {
      console.warn('  ⚠️ Exceção profiles:', e.message);
    }

    // 2. Cadastrar / Atualizar em orders no Supabase
    try {
      const { data: ordData, error: ordError } = await supabase.from('orders').upsert({
        transaction_code: lead.code,
        customer_email: lead.email.trim().toLowerCase(),
        customer_name: lead.fullName,
        sale_amount: lead.amount,
        currency: 'BRL',
        payment_type: lead.paymentType,
        status: 'approved',
        raw_payload: {
          code: lead.code,
          customer: {
            full_name: lead.fullName,
            email: lead.email
          },
          sale_amount: lead.amount,
          date: lead.date,
          origin: 'perfectpay_manual_recovery'
        }
      }, { onConflict: 'transaction_code' });

      if (ordError) {
        console.error('  ❌ Erro ao salvar pedido em orders:', ordError);
      } else {
        console.log('  ✓ Pedido aprovado registrado na tabela orders.');
      }
    } catch (e) {
      console.error('  ❌ Exceção ao salvar pedido:', e.message);
    }

    // 3. Disparar e-mail oficial pelo Resend
    try {
      const html = generateEmailHtml(lead);
      const text = generateEmailText(lead);

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to: [lead.email],
          subject: '✦ Seu Acesso ao Mapa do Amor está Liberado! • Clara Falk',
          html,
          text,
          reply_to: 'suporte@lecturalunar.com'
        })
      });

      const resData = await res.json();
      if (res.ok) {
        console.log(`  🎉 E-mail de acesso enviado com sucesso! Resend ID: ${resData.id}`);
      } else {
        console.error(`  ❌ Erro ao enviar e-mail via Resend:`, resData);
      }
    } catch (e) {
      console.error('  ❌ Exceção ao enviar e-mail:', e.message);
    }
  }

  console.log(`\n==================================================`);
  console.log(`Processo concluído com sucesso para todos os leads!`);
}

processLeads();
