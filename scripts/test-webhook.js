// scripts/test-webhook.js
// Testa o endpoint do Webhook da PerfectPay localmente

const payload = {
  "token": "f13dbcbe1105b9517dd8141666cb17fe",
  "code": "PPCPMTB5HKA4O6QWKO",
  "sale_amount": 29.9,
  "currency_enum": 1,
  "currency_enum_key": "BRL",
  "coupon_code": null,
  "installments": 1,
  "installment_amount": 29.9,
  "shipping_type_enum": 0,
  "shipping_type_enum_key": null,
  "shipping_amount": 0,
  "payment_method_enum": 0,
  "payment_method_enum_key": "none",
  "payment_type_enum": 7,
  "payment_type_enum_key": "pix",
  "payment_format_enum": 1,
  "payment_format_enum_key": "regular",
  "original_code": null,
  "billet_url": "https://checkout.perfectpay.com.br/pix/PPCPMTB5HKA4O6QWKO",
  "quantity": 1,
  "sale_status_enum": 2,
  "sale_status_enum_key": "approved",
  "sale_status_detail": "paid",
  "date_created": "2026-09-18 21:35:38",
  "date_approved": "2026-09-18 21:36:45",
  "product": {
    "code": "PPPBFEQL",
    "name": "Mapa do Amor",
    "external_reference": null,
    "guarantee": 7
  },
  "plan": {
    "code": "PPLQQQGSC",
    "name": "unico"
  },
  "customer": {
    "full_name": "Maria Elisa da Silva",
    "email": "mariaelisasilva688@gmail.com",
    "identification_type": "CPF",
    "identification_number": "05241497803",
    "phone_formated": "(16) 99118-5230",
    "city": "Ribeirão Preto",
    "state": "SP",
    "country": "BR"
  }
};

async function testWebhook() {
  const url = process.env.TEST_URL || 'http://localhost:3000/app/api/webhooks/perfectpay';
  console.log(`[Teste Webhook] Enviando payload da PerfectPay para: ${url}`);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(`[Teste Webhook] Status HTTP: ${res.status}`);
    console.log('[Teste Webhook] Resposta:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Teste Webhook] Erro ao conectar ao servidor local:', err.message);
  }
}

testWebhook();
