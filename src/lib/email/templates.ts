// src/lib/email/templates.ts - Templates HTML de Alto Padrão Visual para o Mapa do Amor • Clara Falk

export interface PurchaseEmailData {
  clientName: string;
  clientEmail: string;
  orderCode?: string;
  saleAmount?: number | string;
  accessUrl?: string;
}

export interface ReadingCompletedEmailData {
  clientName: string;
  accessUrl?: string;
  sunSign?: string;
  archetype?: string;
}

/**
 * E-MAIL 1: Compra Aprovada & Liberação Oficial de Acesso ao Aplicativo
 */
export function getPurchaseApprovedEmailHtml(data: PurchaseEmailData): { subject: string; html: string; text: string } {
  const firstName = data.clientName ? data.clientName.trim().split(' ')[0] : 'querida alma';
  const accessUrl = data.accessUrl || 'https://lecturalunar.com/app';
  const orderCode = data.orderCode || 'ML-' + Math.floor(100000 + Math.random() * 900000);
  const subject = `✦ Seu Acesso ao Mapa do Amor está Liberado! • Clara Falk`;

  const html = `<!DOCTYPE html>
<html lang="pt-BR" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
  <style>
    @media only screen and (max-width: 620px) {
      .main-card { border-radius: 16px !important; width: 100% !important; }
      .content-padding { padding: 25px 18px !important; }
      .header-padding { padding: 30px 18px 22px 18px !important; }
      .btn-cta { padding: 16px 24px !important; font-size: 15px !important; display: block !important; }
      .step-table { width: 100% !important; }
      .avatar-img { width: 72px !important; height: 72px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #07050b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #eeddc9;">
  
  <!-- Preheader invisível para caixa de entrada -->
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0;">
    Seu pagamento foi confirmado com sucesso. Acesse agora o aplicativo do Mapa do Amor com Clara Falk e inicie sua revelação pessoal.
  </div>

  <!-- Background Wrapper -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07050b; background: radial-gradient(circle at 50% 15%, #1d142c 0%, #07050b 80%); padding: 35px 12px;">
    <tr>
      <td align="center">

        <!-- Container Principal -->
        <table class="main-card" width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #120d1c; border: 1px solid #2e2343; border-radius: 28px; overflow: hidden; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);">
          
          <!-- Topo Luminoso com Retrato da Clara Falk -->
          <tr>
            <td class="header-padding" align="center" style="padding: 42px 35px 28px 35px; background: linear-gradient(180deg, #1c142c 0%, #120d1c 100%); border-bottom: 1px solid #271e3b;">
              
              <!-- Selo Místico Superior -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 18px;">
                <tr>
                  <td align="center" style="background-color: rgba(197, 160, 89, 0.12); border: 1px solid rgba(197, 160, 89, 0.4); border-radius: 30px; padding: 5px 16px;">
                    <span style="font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #dfc382; font-family: Georgia, serif;">
                      ✦ PORTAL OFICIAL DO MAPA DO AMOR ✦
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Avatar Clara Falk com Moldura Dourada -->
              <div style="width: 86px; height: 86px; border-radius: 50%; padding: 2px; background: linear-gradient(135deg, #f5dda9 0%, #c5a059 50%, #8e4b5d 100%); margin: 0 auto 16px auto; box-shadow: 0 8px 24px rgba(197, 160, 89, 0.28);">
                <img class="avatar-img" src="https://lecturalunar.com/clara-falk-retrato-v1.png" alt="Clara Falk" width="86" height="86" style="display: block; border-radius: 50%; object-fit: cover; width: 86px; height: 86px; background-color: #20172c;">
              </div>

              <!-- Título da Marca -->
              <div style="font-size: 26px; font-weight: 700; letter-spacing: 3px; color: #ffffff; font-family: 'Cormorant Garamond', Georgia, serif; text-transform: uppercase; margin-bottom: 4px;">
                CLARA FALK
              </div>
              <div style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #c5a059; opacity: 0.9;">
                Lectura Lunar • Guia Afetiva
              </div>
            </td>
          </tr>

          <!-- Corpo Principal -->
          <tr>
            <td class="content-padding" style="padding: 38px 36px;">

              <!-- Status Badge de Aprovação -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 18px;">
                <tr>
                  <td style="background-color: rgba(34, 197, 94, 0.12); border: 1px solid rgba(34, 197, 94, 0.4); border-radius: 20px; padding: 4px 14px;">
                    <span style="font-size: 11px; font-weight: 700; color: #4ade80; letter-spacing: 1px; text-transform: uppercase;">
                      ● Pagamento Confirmado &bull; Acesso Liberado
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Título Caloroso -->
              <h1 style="font-size: 24px; color: #ffffff; font-family: Georgia, serif; font-weight: normal; line-height: 1.35; margin: 0 0 16px 0;">
                Olá, <span style="color: #dfc382; font-weight: bold;">${firstName}</span>! Seu portal foi aberto.
              </h1>

              <p style="font-size: 15px; line-height: 1.65; color: #e5d4c3; margin: 0 0 24px 0;">
                É com imensa honra que recebo você no <strong>Mapa do Amor</strong>. A partir de agora, o seu acesso ao nosso aplicativo exclusivo está 100% ativo para que eu possa traçar suas coordenadas afetivas, analisar as linhas da sua mão e revelar a direção sagrada do seu futuro no amor.
              </p>

              <!-- VIP PASS / CREDENCIAL DE ACESSO -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(145deg, #1d162c 0%, #150f22 100%); border: 1px solid #473661; border-radius: 20px; margin: 28px 0; box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 14px 30px rgba(0,0,0,0.5);">
                <tr>
                  <td style="padding: 26px 22px; text-align: center;">

                    <!-- Etiqueta do Cartão -->
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #dfc382; margin-bottom: 6px;">
                      Sua Credencial de Acesso
                    </div>

                    <!-- E-mail destacado -->
                    <div style="display: inline-block; background-color: #0b0713; border: 1px solid #3c2c54; border-radius: 12px; padding: 8px 18px; margin-bottom: 22px; max-width: 90%;">
                      <span style="font-size: 15px; font-weight: 600; color: #ffffff; word-break: break-all;">
                        ${data.clientEmail}
                      </span>
                    </div>

                    <!-- BOTÃO DE AÇÃO CTA ULTRA LUXO -->
                    <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto;">
                      <tr>
                        <td align="center" style="border-radius: 14px; background: linear-gradient(135deg, #fae2b1 0%, #d4af37 45%, #a67c29 100%); box-shadow: 0 8px 24px rgba(212, 175, 55, 0.35);">
                          <a href="${accessUrl}" target="_blank" class="btn-cta" style="display: inline-block; padding: 18px 42px; font-size: 15px; font-weight: 800; color: #120d1c; text-decoration: none; border-radius: 14px; letter-spacing: 0.8px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            Entrar no Meu Mapa do Amor &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="font-size: 12px; color: #a494b5; margin-top: 16px;">
                      Ou acesse diretamente pelo link: <br>
                      <a href="${accessUrl}" style="color: #dfc382; text-decoration: underline; word-break: break-all;">${accessUrl}</a>
                    </div>

                  </td>
                </tr>
              </table>

              <!-- SEÇÃO: 3 PASSOS SIMPLES -->
              <h2 style="font-size: 17px; color: #ffffff; font-family: Georgia, serif; margin: 34px 0 16px 0; border-bottom: 1px solid #271e3b; padding-bottom: 10px;">
                ✦ Como começar em 3 passos simples:
              </h2>

              <!-- Passo 1 -->
              <table class="step-table" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 14px; background-color: #171124; border: 1px solid #2b213f; border-radius: 14px;">
                <tr>
                  <td width="54" align="center" valign="middle" style="padding: 16px 0 16px 14px;">
                    <div style="width: 32px; height: 32px; line-height: 32px; background: linear-gradient(135deg, #dfc382 0%, #c5a059 100%); color: #120d1c; font-weight: 800; font-size: 14px; text-align: center; border-radius: 50%;">
                      1
                    </div>
                  </td>
                  <td style="padding: 16px 16px 16px 8px; font-size: 14px; line-height: 1.5; color: #e2d2c1;">
                    <strong style="color: #ffffff;">Toque no botão dourado acima</strong> para abrir o aplicativo seguro no seu navegador.
                  </td>
                </tr>
              </table>

              <!-- Passo 2 -->
              <table class="step-table" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 14px; background-color: #171124; border: 1px solid #2b213f; border-radius: 14px;">
                <tr>
                  <td width="54" align="center" valign="middle" style="padding: 16px 0 16px 14px;">
                    <div style="width: 32px; height: 32px; line-height: 32px; background: linear-gradient(135deg, #dfc382 0%, #c5a059 100%); color: #120d1c; font-weight: 800; font-size: 14px; text-align: center; border-radius: 50%;">
                      2
                    </div>
                  </td>
                  <td style="padding: 16px 16px 16px 8px; font-size: 14px; line-height: 1.5; color: #e2d2c1;">
                    Na aba <strong>"Primeiro Acesso"</strong>, digite seu e-mail (<span style="color: #dfc382;">${data.clientEmail}</span>) e defina sua senha exclusiva de uso pessoal.
                  </td>
                </tr>
              </table>

              <!-- Passo 3 -->
              <table class="step-table" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: #171124; border: 1px solid #2b213f; border-radius: 14px;">
                <tr>
                  <td width="54" align="center" valign="middle" style="padding: 16px 0 16px 14px;">
                    <div style="width: 32px; height: 32px; line-height: 32px; background: linear-gradient(135deg, #dfc382 0%, #c5a059 100%); color: #120d1c; font-weight: 800; font-size: 14px; text-align: center; border-radius: 50%;">
                      3
                    </div>
                  </td>
                  <td style="padding: 16px 16px 16px 8px; font-size: 14px; line-height: 1.5; color: #e2d2c1;">
                    <strong>Envie a foto da palma da sua mão</strong> e seus dados de nascimento. Eu mesma irei examinar suas 3 linhas principais e gerar seu dossiê completo.
                  </td>
                </tr>
              </table>

              <!-- Mensagem de Clara Falk -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-left: 3px solid #c5a059; background-color: rgba(197, 160, 89, 0.05); border-radius: 0 14px 14px 0; margin-top: 30px;">
                <tr>
                  <td style="padding: 20px 22px;">
                    <p style="font-family: Georgia, serif; font-style: italic; font-size: 15px; color: #f2e2cf; line-height: 1.6; margin: 0 0 10px 0;">
                      &ldquo;O que você viveu no amor até hoje não foi um erro, foi apenas a preparação para o momento em que a clareza chegasse. Suas mãos guardam a chave. Estou te esperando no aplicativo para começarmos.&rdquo;
                    </p>
                    <div style="font-size: 13px; font-weight: 700; color: #ffffff;">
                      Clara Falk
                    </div>
                    <div style="font-size: 11px; color: #c5a059; margin-top: 2px;">
                      Mentora e Fundadora do Mapa do Amor
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Rodapé de Segurança e Atendimento -->
          <tr>
            <td align="center" style="padding: 26px 30px; background-color: #0b0714; border-top: 1px solid #231a34; font-size: 11px; color: #837496; line-height: 1.6;">
              <p style="margin: 0 0 8px 0;">
                Pedido: <strong style="color: #b3a4c8;">#${orderCode}</strong> &bull; Ambiente Seguro SSL 256-bit
              </p>
              <p style="margin: 0 0 10px 0;">
                Precisa de qualquer assistência? Basta responder a este e-mail ou escrever para: <br>
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

  const text = `✦ MAPA DO AMOR COM CLARA FALK ✦
===========================================
PAGAMENTO CONFIRMADO & ACESSO LIBERADO!

Olá, ${firstName}!

É uma alegria imensa dar as boas-vindas à sua jornada de revelação afetiva. Seu pagamento foi confirmado com sucesso e seu acesso ao aplicativo exclusivo do Mapa do Amor já está liberado.

SUA CREDENCIAL DE ACESSO:
E-mail cadastrado: ${data.clientEmail}
Link oficial de acesso: ${accessUrl}

COMO FAZER SEU PRIMEIRO ACESSO EM 3 PASSOS:
1. Abra o link: ${accessUrl}
2. Na aba "Primeiro Acesso", digite seu e-mail (${data.clientEmail}) e crie sua senha pessoal.
3. Envie sua data de nascimento e a foto da sua palma da mão para Clara Falk gerar sua leitura completa.

Código da Transação: ${orderCode}
Suporte Oficial: suporte@lecturalunar.com

"O que você viveu no amor até hoje não foi um erro, foi apenas a preparação para o momento em que a clareza chegasse. Suas mãos guardam a chave."

Com carinho,
Clara Falk • Mapa do Amor`;

  return { subject, html, text };
}

/**
 * E-MAIL 2: Leitura Concluída & Dossiê Completo em PDF Disponível para Download
 */
export function getReadingCompletedEmailHtml(data: ReadingCompletedEmailData): { subject: string; html: string; text: string } {
  const firstName = data.clientName ? data.clientName.trim().split(' ')[0] : 'querida alma';
  const accessUrl = data.accessUrl || 'https://lecturalunar.com/app';
  const subject = `🔮 Seu Mapa do Amor foi Revelado por Clara Falk! • Acesse seu Livro`;

  const html = `<!DOCTYPE html>
<html lang="pt-BR" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
  <style>
    @media only screen and (max-width: 620px) {
      .main-card { border-radius: 16px !important; width: 100% !important; }
      .content-padding { padding: 25px 18px !important; }
      .header-padding { padding: 30px 18px 22px 18px !important; }
      .btn-cta { padding: 16px 24px !important; font-size: 15px !important; display: block !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #07050b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #eeddc9;">

  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0;">
    Clara Falk concluiu a interpretação das suas linhas e seu dossiê cósmico está pronto no aplicativo com seu livro diagramado em PDF.
  </div>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07050b; background: radial-gradient(circle at 50% 15%, #241432 0%, #07050b 80%); padding: 35px 12px;">
    <tr>
      <td align="center">

        <table class="main-card" width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #120d1c; border: 1px solid #3d2547; border-radius: 28px; overflow: hidden; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);">
          
          <!-- Topo Luminoso com Clara Falk -->
          <tr>
            <td class="header-padding" align="center" style="padding: 40px 35px 28px 35px; background: linear-gradient(180deg, #241432 0%, #120d1c 100%); border-bottom: 1px solid #2e1e3b;">
              
              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                <tr>
                  <td align="center" style="background-color: rgba(142, 75, 93, 0.2); border: 1px solid rgba(223, 195, 130, 0.5); border-radius: 30px; padding: 5px 16px;">
                    <span style="font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #dfc382; font-family: Georgia, serif;">
                      ✦ LEITURA PESSOAL CONCLUÍDA ✦
                    </span>
                  </td>
                </tr>
              </table>

              <div style="width: 86px; height: 86px; border-radius: 50%; padding: 2px; background: linear-gradient(135deg, #f5dda9 0%, #8e4b5d 50%, #c5a059 100%); margin: 0 auto 16px auto; box-shadow: 0 8px 24px rgba(142, 75, 93, 0.35);">
                <img src="https://lecturalunar.com/clara-falk-retrato-v1.png" alt="Clara Falk" width="86" height="86" style="display: block; border-radius: 50%; object-fit: cover; width: 86px; height: 86px;">
              </div>

              <div style="font-size: 24px; font-weight: 700; letter-spacing: 2px; color: #ffffff; font-family: 'Cormorant Garamond', Georgia, serif; text-transform: uppercase;">
                MAPA DO AMOR REVELADO
              </div>
              <div style="font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: #dfc382; margin-top: 4px;">
                Por Clara Falk
              </div>
            </td>
          </tr>

          <!-- Corpo -->
          <tr>
            <td class="content-padding" style="padding: 38px 36px;">

              <h1 style="font-size: 24px; color: #ffffff; font-family: Georgia, serif; font-weight: normal; line-height: 1.35; margin: 0 0 16px 0;">
                ${firstName}, seu dossiê completo está pronto.
              </h1>

              <p style="font-size: 15px; line-height: 1.65; color: #e5d4c3; margin: 0 0 24px 0;">
                Analisei com muito carinho e precisão as linhas da palma da sua mão e cruzei com as coordenadas do seu nascimento. O resultado é uma leitura reveladora que traz respostas definitivas para os seus padrões do passado e ilumina o seu próximo amor.
              </p>

              <!-- Box de Destaque dos Entregáveis -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1a1224; border: 1px solid #3d2a4e; border-radius: 18px; margin: 24px 0;">
                <tr>
                  <td style="padding: 22px;">
                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #dfc382; margin-bottom: 14px;">
                      O que está esperando por você no seu painel:
                    </div>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="24" valign="top" style="padding-bottom: 10px; color: #c5a059; font-size: 14px;">✦</td>
                        <td style="padding-bottom: 10px; font-size: 14px; color: #eeddc9;">
                          <strong>Análise das 3 Linhas da Palma:</strong> Coração, Cabeça e Linha da Vida.
                        </td>
                      </tr>
                      <tr>
                        <td width="24" valign="top" style="padding-bottom: 10px; color: #c5a059; font-size: 14px;">✦</td>
                        <td style="padding-bottom: 10px; font-size: 14px; color: #eeddc9;">
                          <strong>5 Capítulos Densos:</strong> Seus bloqueios passados, arquétipo de atração e bússola diária.
                        </td>
                      </tr>
                      <tr>
                        <td width="24" valign="top" style="padding-bottom: 10px; color: #c5a059; font-size: 14px;">✦</td>
                        <td style="padding-bottom: 10px; font-size: 14px; color: #eeddc9;">
                          <strong>2 Bônus Exclusivos:</strong> Animal Espiritual Guia & Ritual de Limpeza do Coração.
                        </td>
                      </tr>
                      <tr>
                        <td width="24" valign="top" style="color: #c5a059; font-size: 14px;">✦</td>
                        <td style="font-size: 14px; color: #eeddc9;">
                          <strong>Livro Digital em PDF:</strong> Diagramado e pronto para download imediato.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Botão CTA -->
              <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 28px auto;">
                <tr>
                  <td align="center" style="border-radius: 14px; background: linear-gradient(135deg, #fae2b1 0%, #d4af37 45%, #a67c29 100%); box-shadow: 0 8px 24px rgba(212, 175, 55, 0.35);">
                    <a href="${accessUrl}" target="_blank" class="btn-cta" style="display: inline-block; padding: 18px 38px; font-size: 15px; font-weight: 800; color: #120d1c; text-decoration: none; border-radius: 14px; letter-spacing: 0.8px; text-transform: uppercase;">
                      Ler Meu Mapa & Baixar Livro &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; line-height: 1.6; color: #a494b5; text-align: center; margin: 15px 0 0 0;">
                Acesse a qualquer momento com o mesmo e-mail e senha que você cadastrou.
              </p>

            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td align="center" style="padding: 24px 30px; background-color: #0b0714; border-top: 1px solid #231a34; font-size: 11px; color: #837496;">
              &copy; 2026 Mapa do Amor com Clara Falk &bull; lecturalunar.com
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;

  const text = `✦ SEU MAPA DO AMOR FOI CONCLUÍDO! ✦
===========================================
Olá, ${firstName}!

Clara Falk concluiu a interpretação das suas linhas e seu dossiê pessoal completo já está disponível.

Acesse agora para ler e baixar seu livro digital:
${accessUrl}

O QUE ESTÁ PRONTO NA SUA ÁREA:
- Análise detalhada das Linhas do Coração, Cabeça e Vida
- Seus 5 Capítulos Pessoais
- Bônus: Animal Espiritual Guia & Ritual de Limpeza do Coração
- Livro Digital diagramado em PDF para download

Com carinho,
Clara Falk • Mapa do Amor`;

  return { subject, html, text };
}
