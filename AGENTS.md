# 🚨 AGENTS.MD - REGRAS CRÍTICAS DE ARQUITETURA & PRODUÇÃO 🚨
# Projeto: Mapa do Amor (Clara Falk) • Domínio: lecturalunar.com

Este documento é a diretriz MÁXIMA e INVIOLÁVEL para qualquer agente de IA, desenvolvedor ou script automatizado que opere neste repositório. O desrespeito a estas regras causa perda direta de tráfego pago e prejuízo financeiro.

---

## 1. 🛑 REGRA DE OURO: O FUNIL PRINCIPAL DE VENDAS É SAGRADO E INTOCÁVEL

O tráfego pago (Facebook Ads, Google, etc.) é direcionado para a raiz do domínio: `https://lecturalunar.com/`.

A estrutura das páginas de venda DEVE SER SEMPRE ESTA:

| Rota Pública | Arquivo Fonte | Conteúdo Obrigatório | Elementos Vitais |
|---|---|---|---|
| **`/`** (Home) | `outputs/index.html` | **Mini VSL 1 (Português)** | Headline: *"As linhas da sua mão podem revelar o nome da sua alma gêmea."*<br>Player VTurb: `vid-6aac2f6f17052e6db12238cb`<br>Botão: "Tirar foto da minha mão" (aos 30s) |
| **`/preparando`** | `outputs/preparando.html` | **Página de Transição** | Animação das 3 linhas + Pergunta do Nome |
| **`/oferta`** | `outputs/oferta.html` | **Mini VSL 2 (Oferta Principal)** | Player VTurb: `vid-6aac506d76eb195e3e5f046c`<br>Checkout PerfectPay: `https://go.perfectpay.com.br/PPU38CQG8P0` (R$ 29,90) |
| **`/app`** | Worker `renderAppHtml()` | **Área de Membros / Entrega** | Protocolo 24h, Upsell Express 6h (R$ 9,90), Dossiê Completo e Leitor de PDF |

### ⛔ PROIBIÇÕES EXPRESSAS:
1. **NUNCA, EM HIPÓTESE ALGUMA, COLOQUE CONTEÚDO EM ALEMÃO OU QUALQUER OUTRO IDIOMA NA RAIZ.**
   - O material alemão ("Herzlinien") pertence a estudos anteriores de benchmarking e JAMAIS deve ser servido como `index.html`.
2. **NUNCA ALTERE OU APAGUE OS ARQUIVOS DO FUNIL VSL:**
   - `outputs/index.html`
   - `outputs/vsl.js` / `outputs/vsl.css`
   - `outputs/preparando.html` / `outputs/preparando.js` / `outputs/preparando.css`
   - `outputs/oferta.html` / `outputs/oferta.js` / `outputs/oferta.css`
   - `outputs/photo-storage.js` / `outputs/attribution.js` / `outputs/offer-config.js` / `outputs/offer-access.js`
   - `outputs/assets/`
3. **NUNCA MUDE A CONFIGURAÇÃO DE ASSETS DO `wrangler.jsonc` SEM TESTAR O ROOT PRIMEIRO.**

---

## 2. 🛡️ VERIFICAÇÃO OBRIGATÓRIA ANTES E APÓS QUALQUER DEPLOY (SMOKE TEST)

Toda vez que qualquer comando `wrangler deploy` for executado, o agente DEVE IMEDIATAMENTE rodar as seguintes checagens por comando:

```bash
# 1. Validar se a Home está em português com a VSL 1:
curl -s https://lecturalunar.com/ | grep -q "As linhas da sua mão podem revelar o nome da sua" && echo "✅ HOME OK" || echo "❌ ERRO CRÍTICO NA HOME"

# 2. Validar se a Oferta está em português com a VSL 2:
curl -s https://lecturalunar.com/oferta | grep -q "Sua leitura está pronta" && echo "✅ OFERTA OK" || echo "❌ ERRO CRÍTICO NA OFERTA"

# 3. Validar se o App de Membros está ativo:
curl -s https://lecturalunar.com/app | grep -q "Mapa do Amor" && echo "✅ APP OK" || echo "❌ ERRO CRÍTICO NO APP"
```

Se qualquer um dos 3 comandos falhar ou retornar status diferente de 200, é considerado **INCIDENTE CRÍTICO DE PRODUÇÃO** e deve ser corrigido no mesmo segundo.

---

## 3. 📦 ISOLAMENTO DE AMBIENTES

- **Tráfego de Aquisição / Vendas:** Fica em `outputs/` (servido via Cloudflare Worker Static Assets).
- **Área de Membros / Pós-Venda:** Fica em `/app` (renderizado pelo Cloudflare Worker em `src/worker.ts`).
- **APIs e Webhooks:** Ficam em `/api/webhooks/perfectpay`, `/api/auth/activate`, `/api/readings/process`.
