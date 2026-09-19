// src/lib/email/templates.ts - Templates HTML elegantes para e-mails transacionais do Mapa do Amor

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
 * Gera o e-mail de Compra Aprovada e Liberação de Acesso ao Mapa do Amor
 */
export function getPurchaseApprovedEmailHtml(data: PurchaseEmailData): { subject: string; html: string; text: string } {
  const firstName = data.clientName ? data.clientName.split(' ')[0] : 'querida alma';
  const accessUrl = data.accessUrl || 'https://lecturalunar.com/app';
  const subject = `✨ Seu acesso ao Mapa do Amor está liberado! • Clara Falk`;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0a14; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f6e5ce; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0a14; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Container Principal -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #171321; border: 1px solid #332b47; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Topo / Cabeçalho Dourado -->
          <tr>
            <td align="center" style="padding: 35px 30px 25px 30px; border-bottom: 1px solid #272036; background: linear-gradient(180deg, #20172c 0%, #171321 100%);">
              <div style="font-size: 26px; font-weight: bold; letter-spacing: 2px; color: #dfc382; font-family: Georgia, serif; text-transform: uppercase;">
                ✦ MAPA DO AMOR ✦
              </div>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #c5a059; margin-top: 5px; opacity: 0.85;">
                Com Clara Falk
              </div>
            </td>
          </tr>

          <!-- Mensagem Principal -->
          <tr>
            <td style="padding: 35px 30px;">
              <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #c5a059; font-weight: 600; margin: 0 0 10px 0;">
                ✓ PAGAMENTO CONFIRMADO
              </p>
              
              <h1 style="font-size: 24px; color: #ffffff; font-family: Georgia, serif; margin: 0 0 18px 0; font-weight: normal; line-height: 1.3;">
                Olá, <span style="color: #dfc382;">${firstName}</span>! Seu portal foi aberto.
              </h1>

              <p style="font-size: 15px; line-height: 1.6; color: #eeddc9; margin: 0 0 20px 0;">
                É uma alegria imensa dar as boas-vindas à sua jornada de revelação afetiva. Seu pagamento foi confirmado com sucesso e seu acesso ao aplicativo exclusivo do <strong>Mapa do Amor</strong> já está liberado.
              </p>

              <!-- Box de Acesso / Destaque -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #201a2e; border: 1px solid #43385a; border-radius: 16px; margin: 25px 0;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #c5a059; font-weight: 600; margin-bottom: 8px;">
                      Seu E-mail Cadastrado
                    </div>
                    <div style="font-size: 16px; font-weight: bold; color: #ffffff; word-break: break-all; margin-bottom: 20px;">
                      ${data.clientEmail}
                    </div>

                    <!-- Botão de Ação -->
                    <table border="0" cellspacing="0" cellpadding="0" align="center">
                      <tr>
                        <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #c5a059 0%, #a47a3e 100%);">
                          <a href="${accessUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; font-size: 15px; font-weight: bold; color: #120f1a; text-decoration: none; border-radius: 12px; letter-spacing: 0.5px;">
                            Acessar Meu Mapa do Amor →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="font-size: 12px; color: #a99bb8; margin-top: 15px;">
                      Link de acesso: <a href="${accessUrl}" style="color: #dfc382; text-decoration: underline;">${accessUrl}</a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Passo a Passo -->
              <h2 style="font-size: 16px; color: #ffffff; font-family: Georgia, serif; margin: 30px 0 15px 0; border-bottom: 1px solid #272036; padding-bottom: 8px;">
                Como fazer seu Primeiro Acesso em 3 passos:
              </h2>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                <tr>
                  <td width="30" valign="top" style="padding-bottom: 12px;">
                    <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; background-color: #c5a059; color: #120f1a; font-weight: bold; font-size: 12px; text-align: center; border-radius: 50%;">1</span>
                  </td>
                  <td style="font-size: 14px; line-height: 1.5; color: #eeddc9; padding-bottom: 12px;">
                    Clique no botão acima ou abra <strong style="color: #ffffff;">${accessUrl}</strong>.
                  </td>
                </tr>
                <tr>
                  <td width="30" valign="top" style="padding-bottom: 12px;">
                    <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; background-color: #c5a059; color: #120f1a; font-weight: bold; font-size: 12px; text-align: center; border-radius: 50%;">2</span>
                  </td>
                  <td style="font-size: 14px; line-height: 1.5; color: #eeddc9; padding-bottom: 12px;">
                    Informe seu e-mail da compra (<strong style="color: #dfc382;">${data.clientEmail}</strong>) e defina sua senha de uso pessoal.
                  </td>
                </tr>
                <tr>
                  <td width="30" valign="top" style="padding-bottom: 12px;">
                    <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; background-color: #c5a059; color: #120f1a; font-weight: bold; font-size: 12px; text-align: center; border-radius: 50%;">3</span>
                  </td>
                  <td style="font-size: 14px; line-height: 1.5; color: #eeddc9; padding-bottom: 12px;">
                    Envie seus dados de nascimento e a foto da sua palma da mão para que Clara Falk e a equipe revelem seu Mapa completo.
                  </td>
                </tr>
              </table>

              <!-- Assinatura da Clara -->
              <div style="margin-top: 35px; padding-top: 20px; border-top: 1px solid #272036;">
                <p style="font-family: Georgia, serif; font-style: italic; font-size: 15px; color: #dfc382; line-height: 1.5; margin: 0 0 10px 0;">
                  &ldquo;As respostas para o que você vive no amor não são fruto do acaso. Suas linhas e o céu guardam a verdade de onde seu coração deve pousar.&rdquo;
                </p>
                <p style="font-size: 13px; color: #ffffff; font-weight: bold; margin: 0;">
                  Clara Falk
                </p>
                <p style="font-size: 11px; color: #c5a059; margin: 2px 0 0 0;">
                  Guia do Mapa do Amor • Lectura Lunar
                </p>
              </div>
            </td>
          </tr>

          <!-- Rodapé do E-mail -->
          <tr>
            <td align="center" style="padding: 25px; background-color: #120f1a; border-top: 1px solid #272036; font-size: 11px; color: #7f7091; line-height: 1.5;">
              ${data.orderCode ? `<p style="margin: 0 0 6px 0;">Código da Transação: <strong style="color: #9d8db0;">${data.orderCode}</strong></p>` : ''}
              <p style="margin: 0 0 6px 0;">Dúvidas ou suporte? Responda a este e-mail ou envie mensagem para <a href="mailto:suporte@lecturalunar.com" style="color: #c5a059; text-decoration: none;">suporte@lecturalunar.com</a></p>
              <p style="margin: 0;">© 2026 Mapa do Amor • Clara Falk • lecturalunar.com</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `MAPA DO AMOR COM CLARA FALK
===========================================
PAGAMENTO CONFIRMADO & ACESSO LIBERADO

Olá, ${firstName}!

Seu pagamento foi confirmado com sucesso e seu acesso ao Mapa do Amor já está liberado.

Acesse o aplicativo agora pelo link abaixo:
${accessUrl}

Instruções de Primeiro Acesso:
1. Abra ${accessUrl}
2. Digite seu e-mail da compra: ${data.clientEmail}
3. Crie sua senha de acesso pessoal.
4. Envie sua data de nascimento e a foto da sua palma para Clara Falk gerar sua leitura completa.

Código do Pedido: ${data.orderCode || 'N/A'}
Suporte: suporte@lecturalunar.com

Com carinho,
Clara Falk • Mapa do Amor`;

  return { subject, html, text };
}

/**
 * Gera o e-mail de Conclusão de Leitura e Disponibilidade do Livro / Relatório
 */
export function getReadingCompletedEmailHtml(data: ReadingCompletedEmailData): { subject: string; html: string; text: string } {
  const firstName = data.clientName ? data.clientName.split(' ')[0] : 'querida alma';
  const accessUrl = data.accessUrl || 'https://lecturalunar.com/app';
  const subject = `🔮 Seu Mapa do Amor foi revelado por Clara Falk! • Acesse seu Livro`;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0a14; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f6e5ce;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0a14; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #171321; border: 1px solid #332b47; border-radius: 24px; overflow: hidden;">
          <tr>
            <td align="center" style="padding: 35px 30px 25px 30px; border-bottom: 1px solid #272036; background: linear-gradient(180deg, #20172c 0%, #171321 100%);">
              <div style="font-size: 26px; font-weight: bold; letter-spacing: 2px; color: #dfc382; font-family: Georgia, serif; text-transform: uppercase;">
                ✦ MAPA DO AMOR ✦
              </div>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #c5a059; margin-top: 5px;">
                Leitura Concluída
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 35px 30px;">
              <h1 style="font-size: 24px; color: #ffffff; font-family: Georgia, serif; margin: 0 0 18px 0; font-weight: normal; line-height: 1.3;">
                ${firstName}, sua leitura foi finalizada com sucesso!
              </h1>

              <p style="font-size: 15px; line-height: 1.6; color: #eeddc9; margin: 0 0 20px 0;">
                Clara Falk concluiu pessoalmente a interpretação detalhada das suas linhas da palma da mão e a correspondência com a posição de Vênus no seu nascimento.
              </p>

              ${data.archetype || data.sunSign ? `
              <div style="background-color: #201a2e; border: 1px solid #43385a; border-radius: 12px; padding: 15px; margin-bottom: 25px; text-align: center;">
                <div style="font-size: 12px; text-transform: uppercase; color: #c5a059; letter-spacing: 1px;">Síntese Cósmica</div>
                <div style="font-size: 16px; font-weight: bold; color: #ffffff; margin-top: 4px;">
                  ${data.sunSign ? data.sunSign : ''} ${data.archetype ? `• Arquétipo: ${data.archetype}` : ''}
                </div>
              </div>` : ''}

              <!-- Botão -->
              <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 25px 0;">
                <tr>
                  <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #c5a059 0%, #a47a3e 100%);">
                    <a href="${accessUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; font-size: 15px; font-weight: bold; color: #120f1a; text-decoration: none; border-radius: 12px;">
                      Ler Meu Mapa & Baixar Livro em PDF →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; line-height: 1.6; color: #eeddc9;">
                Seu mapa digital completo, com os 5 capítulos detalhados, sua bússola diária e o livro diagramado para download, já estão prontos na sua área de leituras.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 20px; background-color: #120f1a; border-top: 1px solid #272036; font-size: 11px; color: #7f7091;">
              © 2026 Mapa do Amor • Clara Falk • lecturalunar.com
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `SEU MAPA DO AMOR FOI CONCLUÍDO!
===================================
Olá, ${firstName}!

Clara Falk e a equipe concluíram a leitura das linhas da sua palma e do alinhamento cósmico.

Acesse seu Mapa e baixe seu livro em PDF pelo link:
${accessUrl}

Com carinho,
Clara Falk`;

  return { subject, html, text };
}
