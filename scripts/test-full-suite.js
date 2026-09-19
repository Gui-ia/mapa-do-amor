// scripts/test-full-suite.js - Validação Completa de Ponta a Ponta
const fetch = require('node-fetch');

const BASE_URL = 'https://lecturalunar.com';

async function runFullSuite() {
  console.log('====================================================');
  console.log('🔮 INICIANDO BATERIA DE TESTES DE PONTA A PONTA 🔮');
  console.log('Ambiente:', BASE_URL);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // TESTE 1: Servir o SPA e verificar elementos cruciais (HTML, Modal, Upsell, Iniciais)
  try {
    console.log('▶ [1/5] Testando carregamento do WebApp (/app)...');
    const res = await fetch(`${BASE_URL}/app`);
    const html = await res.text();
    
    const hasUpsellCard = html.includes('id="expressUpsellCard"');
    const hasActiveBadge = html.includes('id="expressActiveBadge"');
    const hasQueueModal = html.includes('id="queueNoticeModal"');
    const hasSealInner = html.includes('soulmate-seal-inner');
    const hasInitials = html.includes('id="soulmateInitials"');

    if (hasUpsellCard && hasActiveBadge && hasQueueModal && hasSealInner && hasInitials) {
      console.log('  ✅ Sucesso: Todos os componentes UI (Upsell, Fila Padrão, Modal e Iniciais) estão presentes!');
      passed++;
    } else {
      console.error('  ❌ Falha: Algum elemento essencial não foi encontrado no HTML.');
      console.error({ hasUpsellCard, hasActiveBadge, hasQueueModal, hasSealInner, hasInitials });
      failed++;
    }
  } catch (err) {
    console.error('  ❌ Erro no Teste 1:', err.message);
    failed++;
  }

  // TESTE 2: Webhook da PerfectPay (Venda Normal vs Venda de Upgrade R$ 9,90)
  const testNormalEmail = `teste.normal.${Date.now()}@exemplo.com`;
  const testExpressEmail = `teste.express.${Date.now()}@exemplo.com`;

  try {
    console.log('\n▶ [2/5] Testando Webhook PerfectPay com Venda Normal e Upsell...');
    
    // Venda 1: Normal (R$ 29,90)
    const normalPayload = {
      code: `NORMAL_${Date.now()}`,
      sale_status_enum: 2,
      sale_status_enum_key: 'approved',
      sale_amount: 29.90,
      currency_enum_key: 'BRL',
      payment_type_enum_key: 'pix',
      product_code: 'PPUMAPAPADRAO',
      product_name: 'Mapa do Amor - Clara Falk',
      customer: {
        full_name: 'Maria Clara Normal',
        email: testNormalEmail,
        phone_formated: '(11) 98888-1111'
      }
    };

    const resNormal = await fetch(`${BASE_URL}/api/webhooks/perfectpay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalPayload)
    });
    const dataNormal = await resNormal.json();

    // Venda 2: Upsell Express 6h (R$ 9,90 - PPU38CQGAA3)
    const expressPayload = {
      code: `EXPRESS_${Date.now()}`,
      sale_status_enum: 2,
      sale_status_enum_key: 'approved',
      sale_amount: 9.90,
      currency_enum_key: 'BRL',
      payment_type_enum_key: 'pix',
      product_code: 'PPU38CQGAA3',
      product_name: 'Mapa do Amor em 6 Horas - Prioridade Express',
      customer: {
        full_name: 'Fernanda Prioridade Express',
        email: testExpressEmail,
        phone_formated: '(11) 97777-2222'
      }
    };

    const resExpress = await fetch(`${BASE_URL}/api/webhooks/perfectpay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expressPayload)
    });
    const dataExpress = await resExpress.json();

    if (dataNormal.status === 'success' && dataExpress.status === 'success') {
      console.log('  ✅ Sucesso: Ambas as vendas foram salvas com sucesso no Supabase orders/profiles!');
      passed++;
    } else {
      console.error('  ❌ Falha no webhook:', { dataNormal, dataExpress });
      failed++;
    }
  } catch (err) {
    console.error('  ❌ Erro no Teste 2:', err.message);
    failed++;
  }

  // TESTE 3: Rota /api/auth/activate e Diferenciação de Prioridade (Aceleração)
  try {
    console.log('\n▶ [3/5] Testando Ativação e Detecção Real da Prioridade Expressa...');

    const resCheckNormal = await fetch(`${BASE_URL}/api/auth/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testNormalEmail })
    });
    const checkNormal = await resCheckNormal.json();

    const resCheckExpress = await fetch(`${BASE_URL}/api/auth/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testExpressEmail })
    });
    const checkExpress = await resCheckExpress.json();

    console.log('  - Cliente Normal:', { email: checkNormal.email, isPriorityExpress: checkNormal.isPriorityExpress });
    console.log('  - Cliente Express (R$ 9,90):', { email: checkExpress.email, isPriorityExpress: checkExpress.isPriorityExpress });

    if (checkNormal.isPriorityExpress === false && checkExpress.isPriorityExpress === true) {
      console.log('  ✅ Sucesso: Diferenciação de Fila Padrão (24h) vs Fila Expressa (6h) 100% calibrada!');
      passed++;
    } else {
      console.error('  ❌ Falha: A prioridade expressa não foi identificada corretamente.');
      failed++;
    }
  } catch (err) {
    console.error('  ❌ Erro no Teste 3:', err.message);
    failed++;
  }

  // TESTE 4: Envio de E-mail Transacional via Resend (/api/email/test)
  try {
    console.log('\n▶ [4/5] Testando disparo de e-mail via API do Resend...');
    const resEmail = await fetch(`${BASE_URL}/api/email/test?to=oguiillhermesantos@gmail.com`);
    const emailData = await resEmail.json();

    if (emailData.status === 'success' && emailData.result?.id) {
      console.log('  ✅ Sucesso: E-mail da Clara Falk enviado com sucesso via Resend! ID:', emailData.result.id);
      passed++;
    } else {
      console.error('  ❌ Falha no envio de e-mail:', emailData);
      failed++;
    }
  } catch (err) {
    console.error('  ❌ Erro no Teste 4:', err.message);
    failed++;
  }

  // TESTE 5: Geração de Dossiê com IA Multimodal e Persistência no Supabase
  try {
    console.log('\n▶ [5/5] Testando Geração Profunda com OpenAI o1/GPT-4o Vision...');
    const processPayload = {
      clientName: 'Fernanda Prioridade Express',
      birthDate: '1992-06-21',
      birthTime: '15:45',
      email: testExpressEmail,
      handPhotoUrl: 'https://lecturalunar.com/herzlinien-map-example.png'
    };

    const resProcess = await fetch(`${BASE_URL}/api/readings/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(processPayload)
    });
    const processData = await resProcess.json();

    const report = processData?.reading?.report_data;
    const initials = report?.soulmateReveal?.initials;
    const chaptersCount = report?.chapters?.length;
    const hasAnimalBonus = Boolean(report?.bonusSpiritualAnimal?.animalName);
    const hasCleansingBonus = Boolean(report?.bonusHeartCleansing?.title);

    console.log('  - Iniciais da Alma Gêmea:', initials);
    console.log('  - Quantidade de Capítulos:', chaptersCount);
    console.log('  - Bônus Animal Totem:', report?.bonusSpiritualAnimal?.animalName);
    console.log('  - Bônus Limpeza do Coração:', report?.bonusHeartCleansing?.title);

    if (processData.status === 'completed' && initials && chaptersCount === 6 && hasAnimalBonus && hasCleansingBonus) {
      console.log('  ✅ Sucesso: O Dossiê foi gerado com máxima profundidade e salvo no banco!');
      passed++;
    } else {
      console.error('  ❌ Falha no processamento do dossiê:', processData);
      failed++;
    }
  } catch (err) {
    console.error('  ❌ Erro no Teste 5:', err.message);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`📊 RESULTADO FINAL: ${passed}/5 testes passaram com perfeição!`);
  if (failed === 0) {
    console.log('🎉 TUDO 100% OPERACIONAL E HOMOLOGADO EM PRODUÇÃO! 🎉');
  } else {
    console.log(`⚠️ ${failed} testes apresentaram falha. Verifique os logs acima.`);
  }
  console.log('====================================================\n');
}

runFullSuite();
