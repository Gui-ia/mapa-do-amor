// src/lib/email/sender.ts - Disparador de e-mails transacionais via API (compatível com Cloudflare Workers e Node.js)

export interface SendEmailOptions {
  apiKey?: string;
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Envia um e-mail transacional usando a API do Resend via fetch nativo.
 * Funciona perfeitamente dentro do Cloudflare Workers e no Next.js sem precisar de bibliotecas pesadas.
 */
export async function sendTransactionalEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = options.apiKey || (typeof process !== 'undefined' ? process.env.RESEND_API_KEY : '');
  const from = options.from || (typeof process !== 'undefined' ? process.env.EMAIL_FROM : '') || 'Clara Falk <acesso@lecturalunar.com>';
  const replyTo = options.replyTo || (typeof process !== 'undefined' ? process.env.EMAIL_REPLY_TO : '') || 'suporte@lecturalunar.com';

  if (!apiKey) {
    console.warn('[Email Sender] RESEND_API_KEY não configurada. E-mail simulado com sucesso para:', options.to);
    return {
      success: true,
      id: 'simulated_' + Date.now(),
      error: 'RESEND_API_KEY não configurada (modo simulação)',
    };
  }

  const recipients = Array.isArray(options.to) ? options.to : [options.to];

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: replyTo,
      }),
    });

    const data = await response.json() as any;

    if (!response.ok) {
      console.error('[Email Sender] Erro ao enviar e-mail pela Resend:', data);
      return {
        success: false,
        error: data.message || data.error || 'Erro ao enviar e-mail',
      };
    }

    console.log(`[Email Sender] E-mail enviado com sucesso para ${recipients.join(', ')} (ID: ${data.id})`);
    return {
      success: true,
      id: data.id,
    };
  } catch (err: any) {
    console.error('[Email Sender] Exceção ao disparar e-mail:', err);
    return {
      success: false,
      error: err.message || 'Exceção interna no envio',
    };
  }
}
