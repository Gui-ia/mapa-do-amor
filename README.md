# 💖 Mapa do Amor • Clara Falk

Aplicativo web completo do **Mapa do Amor** com Clara Falk, integrando quiromancia simbólica e astrologia com agentes de Inteligência Artificial da OpenAI, banco de dados e autenticação Supabase, recepção de vendas via Webhook da PerfectPay, e geração automática de relatórios diagramados em PDF para entrega imediata aos clientes.

---

## 🌟 Funcionalidades Principais

1. **Recepção Automática de Vendas (Webhook PerfectPay)**:
   - Endpoint `/api/webhooks/perfectpay` configurado para capturar compras aprovadas (`sale_status_enum: 2`, `paid`).
   - Provisiona o cadastro e ativação do cliente no Supabase Auth e salva os dados na tabela `orders`.
2. **Fluxo do Usuário & Onboarding**:
   - Ativação de primeiro acesso / login com o mesmo e-mail da compra (`lecturalunar.com/app/login?email=...`).
   - Onboarding personalizado com o nome completo da compra pré-preenchido.
   - Coleta da data de nascimento e horário opcional.
   - Upload guiado da foto da palma da mão com pré-visualização instantânea e armazenamento no Supabase Storage.
3. **Tela de Espera da Clara & Notificação**:
   - Animação imersiva com o retrato e estética de Clara Falk.
   - Acompanhamento em tempo real das etapas de análise (Quiromancia, Astrologia, Redação e Diagramação).
4. **Pipeline Multi-Agente IA (OpenAI)**:
   - **Especialista em Quiromancia**: Visão computacional (GPT-4o Vision) analisando a Linha do Coração, Linha da Cabeça, Linha da Vida e Monte de Vênus.
   - **Especialista em Astrologia**: Mapeamento de signos, arquétipos de Vênus e ciclos de relacionamento.
   - **Clara Falk (Voz e Síntese)**: Redação acolhedora e intimista da Liebeslandkarte dividida em 5 capítulos + pontos-chave da bússola afetiva + bênção final.
5. **Gerador Oficial de PDF**:
   - Diagramação de alto padrão editorial com capa dourada, cabeçalhos, tipografia de livro e assinatura de Clara Falk.
   - Upload automático no bucket `reading-reports` do Supabase com link direto para download do cliente.
6. **Área de Leituras do Aplicativo (`/leituras`)**:
   - Visualização interativa na tela com registro fotográfico e leitura de capítulos.
   - Botão para download do PDF oficial.

---

## 🚀 Como Configurar o Projeto

### 1. Banco de Dados e Storage no Supabase

1. Acesse o painel do seu projeto no Supabase: `https://supabase.com/dashboard/project/udxxcswwfuunvjelxalk`
2. Vá em **SQL Editor** e execute o conteúdo do arquivo [supabase/schema.sql](file:///Users/oguiillhermesantos/Downloads/Mapa-do-Amor/supabase/schema.sql).
   - Isso criará as tabelas `profiles`, `orders`, `readings`, triggers de novos usuários e os buckets de storage `hand-photos` e `reading-reports`.
3. Vá em **Project Settings > API** e copie:
   - `Project URL`
   - `anon / public key`
   - `service_role key` (mantenha confidencial)
4. Cole as chaves no seu arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://udxxcswwfuunvjelxalk.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
   OPENAI_API_KEY=sua_chave_openai_aqui
   ```

---

### 2. Configurar o Webhook na PerfectPay

1. No painel da **PerfectPay**, acesse o produto **Mapa do Amor**.
2. Na aba **Integrações / Webhooks**, cadastre uma nova URL:
   ```
   https://lecturalunar.com/app/api/webhooks/perfectpay
   ```
3. Marque para enviar eventos de **Venda Aprovada** (Pix, Cartão, Boleto compensado).
4. Na **Página de Obrigado** do produto na PerfectPay, configure o redirecionamento para:
   ```
   https://lecturalunar.com/app/login?email={customer.email}
   ```

---

### 3. Versionamento no GitHub

Para subir o código para o seu repositório no GitHub:

```bash
# Adicione a origem do seu repositório do GitHub:
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git

# Envie para o GitHub:
git branch -M main
git push -u origin main
```

---

### 4. Executando Localmente

```bash
# Instalar dependências (caso ainda não tenha feito)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000/app](http://localhost:3000/app) no seu navegador.

---

### 5. Deploy na Cloudflare (`lecturalunar.com/app`)

O projeto está configurado com `basePath: '/app'` no `next.config.mjs`, pronto para responder sob `lecturalunar.com/app`.

#### Opção A: Cloudflare Pages
1. No painel da Cloudflare, acesse **Compute (Workers) > Pages > Create a project > Connect to Git**.
2. Selecione o repositório GitHub.
3. Nas configurações de build:
   - **Framework Preset**: Next.js
   - **Build command**: `npx @cloudflare/next-on-pages` ou `npm run build`
   - **Root directory**: `/`
4. Nas **Environment Variables** da Cloudflare Pages, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `PERFECTPAY_WEBHOOK_TOKEN`
5. Em **Custom Domains**, aponte para `lecturalunar.com` e defina a rota `/app*`.
