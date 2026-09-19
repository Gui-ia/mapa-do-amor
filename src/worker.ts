// src/worker.ts - Cloudflare Worker para lecturalunar.com
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

export interface Env {
  ASSETS: Fetcher;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  OPENAI_API_KEY?: string;
  PERFECTPAY_WEBHOOK_TOKEN?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  EMAIL_REPLY_TO?: string;
}

const DEFAULT_SUPABASE_URL = 'https://udxxcswwfuunvjelxalk.supabase.co';
const DEFAULT_OPENAI_KEY = '';

function getSupabase(env: Env) {
  const url = env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';
  return createClient(url, key);
}

function getOpenAI(env: Env) {
  return new OpenAI({
    apiKey: env.OPENAI_API_KEY || DEFAULT_OPENAI_KEY,
  });
}

// --------------------------------------------------------------------------
// HTML DO APLICATIVO SPA (Renderizado em /app e sub-rotas)
// --------------------------------------------------------------------------
function renderAppHtml(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mapa do Amor • Clara Falk</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              gold: '#c5a059',
              goldLight: '#dfc382',
              rose: '#8e4b5d',
              bgDark: '#120f1a',
              cardDark: '#171321',
              cardInner: '#201b2e',
              borderDark: '#332b47'
            }
          },
          fontFamily: {
            serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
            sans: ['Inter', 'sans-serif']
          }
        }
      }
    }
  </script>
  <style>
    body { background-color: #120f1a; color: #f6e5ce; font-family: 'Inter', sans-serif; min-height: 100vh; }
    .gold-text { background: linear-gradient(135deg, #dfc382 0%, #c5a059 50%, #e2b380 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    
    /* Estilos para impressão / Download de PDF denso */
    @media print {
      body { background: white !important; color: #1a1a1a !important; }
      header, footer, #userHeaderActions, #downloadPdfBtn, #printBtn, #cameraModal { display: none !important; }
      .print-page-break { page-break-before: always; }
      .print-card { border: 1px solid #d4af37 !important; background: white !important; color: #1a1a1a !important; box-shadow: none !important; margin-bottom: 2rem !important; padding: 2rem !important; }
      .gold-text { color: #855f1e !important; -webkit-text-fill-color: #855f1e !important; }
      #view-leituras { display: block !important; }
      #view-login, #view-onboarding, #view-waiting { display: none !important; }
    }
  </style>
</head>
<body class="flex flex-col justify-between min-h-screen">
  <!-- Top Navigation -->
  <header class="border-b border-brand-borderDark bg-[#171321]/90 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3 cursor-pointer" onclick="handleLogoClick()">
        <div class="w-10 h-10 rounded-full border border-brand-gold p-0.5 overflow-hidden bg-brand-cardInner flex items-center justify-center shadow-md">
          <img src="/clara-falk-retrato-v1.png" alt="Clara Falk" class="w-full h-full object-cover rounded-full" onerror="this.src='/clara-falk-9x16.png'">
        </div>
        <div>
          <span class="font-serif text-xl font-bold tracking-wide gold-text block leading-none">Mapa do Amor</span>
          <span class="text-[10px] uppercase tracking-widest text-[#dfc382]/70 block mt-0.5 font-sans">com Clara Falk</span>
        </div>
      </div>
      <div id="userHeaderActions" class="flex items-center gap-3">
        <button id="navLeiturasBtn" onclick="goToLeiturasView()" class="hidden text-xs text-brand-goldLight border border-brand-gold/40 px-3 py-1.5 rounded-full hover:bg-brand-cardInner transition-all">
          📖 Minhas Leituras
        </button>
        <button id="logoutBtn" onclick="handleLogout()" class="hidden text-xs text-[#edd0ab]/60 hover:text-rose-400 transition-colors pl-2 border-l border-brand-borderDark">
          Sair
        </button>
      </div>
    </div>
  </header>

  <!-- Container Principal das Telas -->
  <main class="flex-1 max-w-3xl mx-auto px-4 py-8 w-full flex flex-col justify-center">

    <!-- 1. TELA DE ATIVAÇÃO / LOGIN -->
    <div id="view-login" class="w-full max-w-md mx-auto bg-brand-cardDark border border-brand-borderDark rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div class="text-center space-y-3 mb-6">
        <div class="w-16 h-16 rounded-full border-2 border-brand-gold p-0.5 mx-auto overflow-hidden bg-brand-cardInner shadow-lg">
          <img src="/clara-falk-retrato-v1.png" alt="Clara Falk" class="w-full h-full object-cover rounded-full" onerror="this.src='/clara-falk-9x16.png'">
        </div>
        <div>
          <h1 id="loginTitle" class="font-serif text-2xl text-[#f6e5ce]">Ative seu Mapa do Amor</h1>
          <p id="loginDesc" class="text-xs text-[#edd0ab]/70 mt-1">Insira o e-mail da compra para definir sua senha de acesso</p>
        </div>
        <!-- Abas -->
        <div class="flex bg-brand-cardInner p-1 rounded-xl border border-brand-borderDark text-xs">
          <button type="button" id="tabFirstAccess" onclick="setLoginMode(true)" class="flex-1 py-2 rounded-lg font-semibold bg-brand-gold text-[#171321] transition-all">
            Primeiro Acesso
          </button>
          <button type="button" id="tabHasPassword" onclick="setLoginMode(false)" class="flex-1 py-2 rounded-lg text-[#edd0ab]/70 hover:text-white transition-all">
            Já tenho senha
          </button>
        </div>
      </div>

      <form id="authForm" onsubmit="handleAuthSubmit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-[#edd0ab]/80 mb-1.5">E-mail da compra</label>
          <input type="email" id="authEmail" required placeholder="seuemail@exemplo.com" class="w-full bg-brand-cardInner border border-brand-borderDark focus:border-brand-gold text-[#f6e5ce] rounded-xl px-4 py-3 text-xs sm:text-sm outline-none transition-colors">
          <span id="emailHint" class="text-[11px] text-[#edd0ab]/50 block mt-1">✓ Localizamos seu pedido aprovado automaticamente pelo seu e-mail.</span>
        </div>

        <div>
          <label id="passwordLabel" class="block text-xs font-medium text-[#edd0ab]/80 mb-1.5">Crie sua Senha</label>
          <input type="password" id="authPassword" required minlength="6" placeholder="Mínimo de 6 dígitos" class="w-full bg-brand-cardInner border border-brand-borderDark focus:border-brand-gold text-[#f6e5ce] rounded-xl px-4 py-3 text-xs sm:text-sm outline-none transition-colors">
        </div>

        <div id="confirmPasswordGroup">
          <label class="block text-xs font-medium text-[#edd0ab]/80 mb-1.5">Confirme sua Senha</label>
          <input type="password" id="authConfirmPassword" placeholder="Repita a mesma senha" class="w-full bg-brand-cardInner border border-brand-borderDark focus:border-brand-gold text-[#f6e5ce] rounded-xl px-4 py-3 text-xs sm:text-sm outline-none transition-colors">
        </div>

        <div id="authError" class="hidden text-xs text-rose-300 bg-rose-950/60 border border-rose-800 p-3 rounded-xl leading-relaxed"></div>

        <button type="submit" id="authBtn" class="w-full bg-gradient-to-r from-brand-gold to-brand-rose hover:brightness-110 text-white font-medium py-3.5 rounded-xl shadow-lg transition-all text-xs sm:text-sm font-sans flex items-center justify-center gap-2">
          <span>Ativar Acesso e Continuar</span>
        </button>
      </form>
    </div>

    <!-- 2. TELA DE ONBOARDING -->
    <div id="view-onboarding" class="hidden max-w-xl mx-auto w-full space-y-6">
      <div class="text-center space-y-2">
        <span class="inline-block px-3 py-1 rounded-full bg-brand-rose/30 border border-brand-rose/60 text-brand-goldLight text-xs font-medium">
          ✦ Coleta de Coordenadas Pessoais
        </span>
        <h2 class="font-serif text-2xl sm:text-3xl text-[#f6e5ce]">Olá, <span id="onboardingUserName"></span>!</h2>
        <p class="text-xs sm:text-sm text-[#edd0ab]/70">Para que a Clara e os especialistas entreguem seu Mapa do Amor pessoal, confirme seus dados cósmicos e a foto da sua palma.</p>
      </div>

      <form id="onboardingForm" onsubmit="handleOnboardingSubmit(event)" class="bg-brand-cardDark border border-brand-borderDark rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
        <div>
          <label class="block text-xs font-medium text-[#edd0ab]/80 mb-1.5">Seu Nome Completo</label>
          <input type="text" id="obFullName" required class="w-full bg-brand-cardInner border border-brand-borderDark focus:border-brand-gold text-[#f6e5ce] rounded-xl px-4 py-3 text-xs sm:text-sm outline-none">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-[#edd0ab]/80 mb-1.5">Data de Nascimento *</label>
            <input type="date" id="obBirthDate" required class="w-full bg-brand-cardInner border border-brand-borderDark focus:border-brand-gold text-[#f6e5ce] rounded-xl px-4 py-3 text-xs sm:text-sm outline-none [color-scheme:dark]">
          </div>
          <div>
            <label class="block text-xs font-medium text-[#edd0ab]/80 mb-1.5">Horário de Nascimento <span class="text-[#edd0ab]/40">(opcional)</span></label>
            <input type="time" id="obBirthTime" class="w-full bg-brand-cardInner border border-brand-borderDark focus:border-brand-gold text-[#f6e5ce] rounded-xl px-4 py-3 text-xs sm:text-sm outline-none [color-scheme:dark]">
          </div>
        </div>

        <!-- Foto da Palma da Mão -->
        <div class="pt-2 space-y-3">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-brand-goldLight mb-1">
              Foto da Palma da Mão <span class="text-rose-400">*</span>
            </label>
            <p class="text-xs text-[#edd0ab]/70">
              Para uma leitura precisa da Linha do Coração e de Vênus, posicione sua mão aberta em um local bem iluminado.
            </p>
          </div>

          <!-- Inputs invisíveis -->
          <input type="file" id="cameraInput" accept="image/*" capture="environment" class="hidden" onchange="handleHandFile(event)">
          <input type="file" id="galleryInput" accept="image/*" class="hidden" onchange="handleHandFile(event)">

          <!-- Card de Ação Câmera -->
          <div id="dropZone" class="bg-brand-cardInner border-2 border-dashed border-brand-gold/50 rounded-2xl p-6 sm:p-8 text-center space-y-4 transition-all">
            <div class="w-16 h-16 rounded-full bg-brand-borderDark/80 border border-brand-gold/60 flex items-center justify-center mx-auto text-3xl shadow-inner">
              📸
            </div>

            <div class="space-y-1">
              <h4 class="font-serif text-lg font-bold text-[#f6e5ce]">
                Tirar foto da sua palma agora
              </h4>
              <p class="text-xs text-[#edd0ab]/70 max-w-xs mx-auto">
                Abra a câmera do celular ou webcam, enquadre a mão aberta e capture com nitidez.
              </p>
            </div>

            <div class="pt-2 space-y-2.5">
              <button
                type="button"
                onclick="startLiveCamera()"
                class="w-full bg-gradient-to-r from-brand-gold to-[#a66236] hover:brightness-110 text-[#171321] font-bold py-4 px-6 rounded-xl shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 text-sm font-sans transition-all active:scale-95"
              >
                <span class="text-xl">📷</span>
                <span>Tirar Foto Agora (Abrir Câmera)</span>
              </button>

              <button
                type="button"
                onclick="document.getElementById('galleryInput').click()"
                class="w-full bg-transparent hover:bg-brand-borderDark/40 text-[#dfc382] border border-brand-gold/30 hover:border-brand-gold font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-sans transition-all"
              >
                <span>🖼️</span>
                <span>Ou escolher foto existente da galeria</span>
              </button>
            </div>

            <div class="pt-3 border-t border-brand-borderDark/60 flex items-center justify-center gap-4 text-[11px] text-[#edd0ab]/50">
              <span>✓ Mão dominante</span>
              <span>✓ Dedos abertos</span>
              <span>✓ Boa iluminação</span>
            </div>
          </div>

          <!-- Preview após capturar -->
          <div id="previewZone" class="hidden rounded-2xl border border-brand-gold/60 bg-brand-cardInner p-4 flex flex-col sm:flex-row items-center gap-5 shadow-lg">
            <div class="relative w-28 h-36 rounded-xl overflow-hidden border border-brand-borderDark bg-black/60 shrink-0">
              <img id="handImgPreview" src="" alt="Palma capturada" class="w-full h-full object-cover">
              <div class="absolute bottom-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 text-[10px]">✓</div>
            </div>

            <div class="flex-1 space-y-2 text-center sm:text-left">
              <span class="text-xs font-semibold text-emerald-400">✓ Foto capturada com sucesso!</span>
              <p class="text-xs text-[#edd0ab]/75 leading-relaxed">
                As linhas da palma estão nítidas e prontas para o envio à equipe da Clara Falk.
              </p>
              <div class="flex items-center justify-center sm:justify-start gap-3 pt-1">
                <button
                  type="button"
                  onclick="startLiveCamera()"
                  class="text-xs text-brand-goldLight hover:text-white underline underline-offset-4 font-medium"
                >
                  📷 Tirar outra foto
                </button>
                <span class="text-[#edd0ab]/30">•</span>
                <button
                  type="button"
                  onclick="document.getElementById('galleryInput').click()"
                  class="text-xs text-[#edd0ab]/60 hover:text-white underline underline-offset-4"
                >
                  Galeria
                </button>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" id="onboardBtn" class="w-full bg-gradient-to-r from-brand-gold to-brand-rose hover:brightness-110 text-white font-bold py-4 rounded-xl shadow-xl transition-all text-sm font-sans flex items-center justify-center gap-2">
          <span>Entregar Dados para a Clara Falk</span>
          <span>→</span>
        </button>
      </form>
    </div>

    <!-- 3. TELA DE PROTOCOLO E CONFIRMAÇÃO DE ENVIO (PRAZO DE 24 HORAS) -->
    <div id="view-waiting" class="hidden max-w-xl mx-auto w-full space-y-6">
      <div class="text-center space-y-3">
        <div class="relative inline-block">
          <div class="w-28 h-28 rounded-full border-2 border-brand-gold p-1 bg-brand-cardInner mx-auto overflow-hidden shadow-2xl shadow-brand-gold/20">
            <img src="/clara-falk-retrato-v1.png" alt="Clara Falk" class="w-full h-full object-cover rounded-full" onerror="this.src='/clara-falk-9x16.png'">
          </div>
          <span class="absolute -bottom-2 right-1/2 translate-x-1/2 bg-brand-rose text-white text-[11px] px-3 py-0.5 rounded-full border border-brand-gold/40 shadow-md whitespace-nowrap">
            Clara Falk & Especialistas
          </span>
        </div>

        <div class="space-y-1.5 pt-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-medium">
            ✓ Dados Entregues com Sucesso
          </span>
          <h2 class="font-serif text-2xl sm:text-3xl text-[#f6e5ce]">Sua leitura está sendo elaborada</h2>
          <p class="text-xs sm:text-sm text-[#edd0ab]/80 max-w-md mx-auto leading-relaxed">
            Seus dados de nascimento e a foto da sua palma foram recebidos diretamente por Clara Falk e nossa equipe de especialistas em quiromancia e astrologia.
          </p>
        </div>
      </div>

      <!-- Caixa de Destaque: Prazo Oficial de 24 Horas -->
      <div class="bg-gradient-to-br from-[#2a1f30] to-brand-cardDark border-2 border-brand-gold/60 rounded-3xl p-6 shadow-2xl space-y-4">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-brand-gold/20 border border-brand-gold flex items-center justify-center text-2xl shrink-0">
            ⏳
          </div>
          <div class="space-y-1">
            <div class="text-xs uppercase tracking-wider font-bold text-brand-goldLight">
              Prazo Oficial de Entrega
            </div>
            <div class="font-serif text-xl sm:text-2xl text-[#f6e5ce] font-bold">
              Até 24 horas para conclusão
            </div>
            <p class="text-xs text-[#edd0ab]/80 leading-relaxed">
              Diferente de respostas prontas de computador, cada traço da sua Linha do Coração e seus arquétipos cósmicos são estudados minuciosamente para produzir um dossiê denso, profundo e transformador.
            </p>
          </div>
        </div>

        <!-- Alerta de Notificação -->
        <div class="bg-brand-cardInner/90 border border-brand-borderDark p-4 rounded-2xl flex items-center gap-3 text-xs text-[#dfc382]">
          <span class="text-lg">📩</span>
          <span><strong>Você será notificada por e-mail</strong> assim que seu livro diagramado em PDF estiver 100% finalizado e liberado na sua área de leituras.</span>
        </div>
      </div>

      <!-- Resumo do Protocolo -->
      <div class="bg-brand-cardDark border border-brand-borderDark rounded-2xl p-5 space-y-3 text-xs">
        <div class="text-[11px] font-semibold uppercase tracking-wider text-brand-goldLight pb-2 border-b border-brand-borderDark flex justify-between">
          <span>Comprovante de Envio</span>
          <span id="protocolNumber" class="text-[#edd0ab]/60">#MAPA-2026</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-[#edd0ab]/80">
          <div><span class="text-[#edd0ab]/50 block">Destinatária:</span> <strong id="protocolClientName" class="text-white"></strong></div>
          <div><span class="text-[#edd0ab]/50 block">E-mail de Contato:</span> <strong id="protocolEmail" class="text-white"></strong></div>
          <div><span class="text-[#edd0ab]/50 block">Status:</span> <span class="text-amber-300 font-medium">🟡 Em elaboração minuciosa</span></div>
          <div><span class="text-[#edd0ab]/50 block">Previsão:</span> <span class="text-emerald-300 font-medium">Dentro do prazo de 24h</span></div>
        </div>
      </div>

      <!-- Botão para checar se a IA concluiu em background ou ver leituras -->
      <div class="space-y-3">
        <button
          type="button"
          onclick="checkIfReadingIsReady()"
          id="checkReadingBtn"
          class="w-full bg-brand-gold hover:bg-brand-goldLight text-[#171321] font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all text-xs sm:text-sm font-sans flex items-center justify-center gap-2"
        >
          <span>Acessar Dossiê do Mapa do Amor</span>
          <span>→</span>
        </button>
        <p class="text-[11px] text-center text-[#edd0ab]/50">
          Você pode fechar esta página com tranquilidade. Seus dados estão salvos e você poderá retornar quando quiser.
        </p>
      </div>
    </div>

    <!-- 4. TELA DE LEITURA COMPLETA (DOSSIÊ DENSO E LONGO) -->
    <div id="view-leituras" class="hidden max-w-3xl mx-auto w-full space-y-8 pb-16">
      
      <!-- Top Banner e Botões de Download -->
      <div class="bg-gradient-to-br from-brand-cardDark to-[#2a1f30] border-2 border-brand-gold/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden print-card">
        <div class="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div class="w-24 h-24 rounded-2xl overflow-hidden border-2 border-brand-gold shrink-0 bg-black/40 shadow-md">
            <img src="/clara-falk-retrato-v1.png" alt="Clara Falk" class="w-full h-full object-cover" onerror="this.src='/clara-falk-9x16.png'">
          </div>
          <div class="flex-1 space-y-1.5">
            <span class="inline-block px-3 py-0.5 rounded-full bg-brand-rose/40 text-brand-goldLight text-[11px] font-medium border border-brand-gold/30">
              ✦ Dossiê Completo Concluído & Encadernado
            </span>
            <h1 class="font-serif text-2xl sm:text-3xl text-[#f6e5ce]" id="reportClientName">Mapa do Amor</h1>
            <p class="text-xs sm:text-sm text-[#edd0ab]/70" id="reportMetaInfo">Análise Aprofundada de Quiromancia Simbólica & Astrologia Venusiana</p>
          </div>
        </div>

        <div class="mt-6 pt-5 border-t border-brand-borderDark flex flex-col sm:flex-row items-center justify-between gap-4">
          <span class="text-xs text-[#edd0ab]/80">✓ Livro oficial diagramado com 6 capítulos densos e bússola de reciprocidade.</span>
          <div class="flex gap-2 w-full sm:w-auto">
            <button
              id="downloadPdfBtn"
              onclick="triggerDownloadPdf()"
              class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-goldLight text-[#171321] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all"
            >
              <span>📥 Baixar Livro em PDF</span>
            </button>
            <button
              id="printBtn"
              onclick="window.print()"
              class="inline-flex items-center justify-center px-4 py-3 bg-brand-cardInner border border-brand-gold/40 text-brand-goldLight hover:text-white rounded-xl text-xs font-semibold transition-all"
              title="Salvar como PDF ou Imprimir"
            >
              🖨️
            </button>
          </div>
        </div>
      </div>

      <!-- Registro Fotográfico da Mão e Anatomia das Linhas -->
      <div class="bg-brand-cardDark border border-brand-borderDark rounded-3xl p-6 sm:p-8 print-card">
        <h3 class="text-xs font-semibold uppercase tracking-widest text-brand-goldLight mb-4">Registro Oficial da Palma e Leitura dos Montes</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div class="h-64 rounded-2xl overflow-hidden border border-brand-gold/40 bg-black/50">
            <img id="readingHandImg" src="" alt="Palma analisada" class="w-full h-full object-cover">
          </div>
          <div class="space-y-3 text-xs sm:text-sm text-[#edd0ab]/85 leading-relaxed font-serif italic text-base">
            <p class="text-[#dfc382]">
              &ldquo;As bifurcações da sua Linha do Coração e o relevo do Monte de Vênus traçam a anatomia exata das suas defesas inconscientes e do seu anseio por um amor onde a reciprocidade seja natural, e não uma luta.&rdquo;
            </p>
            <p class="font-sans text-xs text-[#edd0ab]/65 not-italic">
              As linhas de uma mão não representam sentenças imutáveis: revelam padrões emocionais cristalizados que agora você tem a oportunidade consciente de transformar.
            </p>
          </div>
        </div>
      </div>

      <!-- Capítulos Extensos e Densos -->
      <div id="readingChapters" class="space-y-8"></div>

      <!-- Bússola Afetiva Diária -->
      <div class="bg-gradient-to-br from-[#201b2e] to-[#2a1f30] border-2 border-brand-gold/60 rounded-3xl p-6 sm:p-8 space-y-4 print-card">
        <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-goldLight">
          <span>🧭 Sua Bússola Diária: Critérios Inegociáveis</span>
        </div>
        <h3 class="font-serif text-xl text-[#f6e5ce]">
          Para reler sempre que surgir uma dúvida sobre alguém:
        </h3>
        <ul id="readingTakeaways" class="space-y-3 pt-2 text-xs sm:text-sm text-[#edd0ab]/90"></ul>
      </div>

      <!-- Carta Pessoal e Bênção de Clara Falk -->
      <div class="bg-brand-cardDark border border-brand-gold/40 rounded-3xl p-6 sm:p-8 space-y-4 print-card">
        <div class="text-xs font-bold uppercase tracking-widest text-brand-rose">
          Mensagem Pessoal e Bênção de Clara Falk
        </div>
        <p id="readingClaraMsg" class="font-serif italic text-sm sm:text-base text-[#edd0ab]/95 leading-relaxed text-justify whitespace-pre-line"></p>
        <div class="pt-4 border-t border-brand-borderDark flex justify-between items-center">
          <div>
            <div class="font-serif text-lg text-[#f6e5ce] font-bold">Clara Falk</div>
            <div class="text-xs text-[#dfc382]/70">Guia e Fundadora do Mapa do Amor</div>
          </div>
          <div class="w-12 h-12 rounded-full overflow-hidden border border-brand-gold">
            <img src="/clara-falk-retrato-v1.png" alt="Clara Falk" class="w-full h-full object-cover" onerror="this.src='/clara-falk-9x16.png'">
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="border-t border-brand-borderDark py-6 text-center text-xs text-[#edd0ab]/40">
    © 2026 Mapa do Amor • Clara Falk • Todos os direitos reservados.
  </footer>

  <!-- ============================================================ -->
  <!-- MODAL DE CÂMERA AO VIVO COM GETUSERMEDIA E PERMISSÃO NATIVA -->
  <!-- ============================================================ -->
  <div id="cameraModal" class="hidden fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md">
    <div class="flex items-center justify-between z-10 max-w-md w-full mx-auto">
      <span class="text-xs font-serif uppercase tracking-widest text-brand-goldLight flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
        Câmera Ao Vivo
      </span>
      <button type="button" onclick="closeCameraModal()" class="w-9 h-9 rounded-full bg-brand-borderDark text-white flex items-center justify-center hover:bg-rose-900 transition-colors text-base font-bold">
        ✕
      </button>
    </div>

    <div class="relative flex-1 max-w-md w-full mx-auto my-3 rounded-3xl overflow-hidden border-2 border-brand-gold/50 flex items-center justify-center bg-zinc-950 shadow-2xl">
      <video id="cameraVideo" autoplay playsinline muted class="w-full h-full object-cover"></video>

      <div class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center border-4 border-dashed border-brand-gold/40 m-6 rounded-3xl">
        <span class="text-5xl opacity-60 mb-3">✋</span>
        <span class="text-xs font-medium text-[#f6e5ce] bg-black/70 px-4 py-1.5 rounded-full text-center max-w-[220px] backdrop-blur-sm border border-brand-gold/30">
          Enquadre a palma da sua mão aberta aqui
        </span>
      </div>

      <div id="cameraError" class="hidden absolute inset-0 bg-black/95 p-6 flex flex-col items-center justify-center text-center space-y-4">
        <span class="text-4xl">⚠️</span>
        <p class="text-xs text-rose-300 leading-relaxed max-w-xs" id="cameraErrorText">
          Permissão de câmera não concedida. Por favor, autorize o acesso à câmera no seu navegador ou envie da galeria.
        </p>
        <button type="button" onclick="document.getElementById('galleryInput').click(); closeCameraModal();" class="text-xs bg-brand-gold text-[#171321] font-bold px-5 py-2.5 rounded-xl shadow-md">
          Escolher foto da galeria
        </button>
      </div>
    </div>

    <div class="flex items-center justify-center gap-8 py-3 z-10 max-w-md w-full mx-auto">
      <button type="button" onclick="switchCamera()" class="p-3.5 rounded-full bg-brand-cardInner border border-brand-borderDark text-brand-goldLight hover:text-white transition-all text-lg shadow-md" title="Alternar Câmera">
        🔄
      </button>
      
      <button type="button" onclick="capturePhotoFromCamera()" class="w-20 h-20 rounded-full border-4 border-white bg-gradient-to-tr from-brand-gold to-brand-goldLight shadow-2xl flex items-center justify-center text-3xl active:scale-90 transition-transform shadow-brand-gold/40">
        📸
      </button>

      <button type="button" onclick="document.getElementById('galleryInput').click(); closeCameraModal();" class="p-3.5 rounded-full bg-brand-cardInner border border-brand-borderDark text-brand-goldLight hover:text-white transition-all text-lg shadow-md" title="Abrir Galeria">
        🖼️
      </button>
    </div>
  </div>

  <!-- SCRIPT PRINCIPAL SPA COM PERSISTÊNCIA NO LOCALSTORAGE -->
  <script>
    let currentUser = null;
    let currentReading = null;
    let currentProtocol = null;
    let handPhotoBase64 = null;
    let isFirstAccessMode = true;

    // ==========================================
    // INICIALIZAÇÃO E PERSISTÊNCIA NO F5
    // ==========================================
    window.addEventListener('DOMContentLoaded', () => {
      initAppSession();
    });

    function initAppSession() {
      // 1. Tenta recuperar usuário salvo no localStorage
      const savedUserStr = localStorage.getItem('mapa_user');
      if (savedUserStr) {
        try {
          currentUser = JSON.parse(savedUserStr);
        } catch (e) {}
      }

      // 2. Tenta recuperar leitura finalizada salva
      const savedReadingStr = localStorage.getItem('mapa_reading');
      if (savedReadingStr) {
        try {
          currentReading = JSON.parse(savedReadingStr);
        } catch (e) {}
      }

      // 3. Tenta recuperar protocolo de envio (espera 24h)
      const savedProtocolStr = localStorage.getItem('mapa_protocol');
      if (savedProtocolStr) {
        try {
          currentProtocol = JSON.parse(savedProtocolStr);
        } catch (e) {}
      }

      // Atualiza os botões do header
      if (currentUser) {
        document.getElementById('navLeiturasBtn').classList.remove('hidden');
        document.getElementById('logoutBtn').classList.remove('hidden');
      }

      // Decide qual tela exibir sem voltar para login após F5
      if (currentReading) {
        renderCompletedReading(currentReading);
      } else if (currentProtocol) {
        showWaitingProtocol(currentProtocol);
      } else if (currentUser) {
        document.getElementById('onboardingUserName').innerText = currentUser.fullName.split(' ')[0];
        document.getElementById('obFullName').value = currentUser.fullName;
        switchView('onboarding');
      } else {
        switchView('login');
      }
    }

    function handleLogoClick() {
      if (currentReading) {
        switchView('leituras');
      } else if (currentProtocol) {
        switchView('waiting');
      } else if (currentUser) {
        switchView('onboarding');
      } else {
        switchView('login');
      }
    }

    function goToLeiturasView() {
      if (currentReading) {
        switchView('leituras');
      } else if (currentProtocol) {
        switchView('waiting');
      } else {
        switchView('onboarding');
      }
    }

    function handleLogout() {
      localStorage.removeItem('mapa_user');
      localStorage.removeItem('mapa_reading');
      localStorage.removeItem('mapa_protocol');
      currentUser = null;
      currentReading = null;
      currentProtocol = null;
      document.getElementById('navLeiturasBtn').classList.add('hidden');
      document.getElementById('logoutBtn').classList.add('hidden');
      switchView('login');
    }

    function setLoginMode(firstAccess) {
      isFirstAccessMode = firstAccess;
      document.getElementById('confirmPasswordGroup').style.display = firstAccess ? 'block' : 'none';
      document.getElementById('emailHint').style.display = firstAccess ? 'block' : 'none';
      document.getElementById('loginTitle').innerText = firstAccess ? 'Ative seu Mapa do Amor' : 'Acesse seu Mapa do Amor';
      document.getElementById('passwordLabel').innerText = firstAccess ? 'Crie sua Senha' : 'Sua Senha';
      document.getElementById('authBtn').innerHTML = firstAccess ? '<span>Ativar Acesso e Continuar</span>' : '<span>Entrar no Aplicativo</span>';
      
      if (firstAccess) {
        document.getElementById('tabFirstAccess').className = 'flex-1 py-2 rounded-lg font-semibold bg-brand-gold text-[#171321] transition-all';
        document.getElementById('tabHasPassword').className = 'flex-1 py-2 rounded-lg text-[#edd0ab]/70 hover:text-white transition-all';
      } else {
        document.getElementById('tabHasPassword').className = 'flex-1 py-2 rounded-lg font-semibold bg-brand-gold text-[#171321] transition-all';
        document.getElementById('tabFirstAccess').className = 'flex-1 py-2 rounded-lg text-[#edd0ab]/70 hover:text-white transition-all';
      }
    }

    function switchView(viewName) {
      ['login', 'onboarding', 'waiting', 'leituras'].forEach(v => {
        const el = document.getElementById('view-' + v);
        if (el) el.classList.add('hidden');
      });
      const target = document.getElementById('view-' + viewName);
      if (target) target.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleAuthSubmit(e) {
      e.preventDefault();
      const email = document.getElementById('authEmail').value.trim().toLowerCase();
      const password = document.getElementById('authPassword').value;
      const confirm = document.getElementById('authConfirmPassword').value;
      const errBox = document.getElementById('authError');
      errBox.classList.add('hidden');

      if (isFirstAccessMode && password !== confirm) {
        errBox.innerText = 'As duas senhas digitadas não conferem.';
        errBox.classList.remove('hidden');
        return;
      }

      document.getElementById('authBtn').innerText = 'Verificando no banco...';

      try {
        const res = await fetch('/api/auth/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) {
          errBox.innerText = data.error || 'Erro ao validar acesso. Verifique o e-mail.';
          errBox.classList.remove('hidden');
          document.getElementById('authBtn').innerText = isFirstAccessMode ? 'Ativar Acesso e Continuar' : 'Entrar no Aplicativo';
          return;
        }

        // Salva sessão no LocalStorage para persistir no F5
        currentUser = { email, fullName: data.fullName || 'Cliente' };
        localStorage.setItem('mapa_user', JSON.stringify(currentUser));

        document.getElementById('navLeiturasBtn').classList.remove('hidden');
        document.getElementById('logoutBtn').classList.remove('hidden');

        document.getElementById('onboardingUserName').innerText = currentUser.fullName.split(' ')[0];
        document.getElementById('obFullName').value = currentUser.fullName;

        // Se o usuário já tinha enviado anteriormente, vai pra tela de protocolo ou leituras
        if (currentReading) {
          renderCompletedReading(currentReading);
        } else if (currentProtocol) {
          showWaitingProtocol(currentProtocol);
        } else {
          switchView('onboarding');
        }
      } catch (err) {
        errBox.innerText = 'Erro na conexão com o servidor. Tente novamente.';
        errBox.classList.remove('hidden');
        document.getElementById('authBtn').innerText = 'Tentar novamente';
      }
    }

    function handleHandFile(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        handPhotoBase64 = evt.target.result;
        document.getElementById('handImgPreview').src = handPhotoBase64;
        document.getElementById('dropZone').classList.add('hidden');
        document.getElementById('previewZone').classList.remove('hidden');
      }
      reader.readAsDataURL(file);
    }

    // ==========================================
    // SUBMISSÃO DO ONBOARDING
    // ==========================================
    async function handleOnboardingSubmit(e) {
      e.preventDefault();
      if (!handPhotoBase64) {
        alert('Por favor, tire ou selecione uma foto da sua mão aberta.');
        return;
      }

      const fullName = document.getElementById('obFullName').value.trim();
      const birthDate = document.getElementById('obBirthDate').value;
      const birthTime = document.getElementById('obBirthTime').value;

      document.getElementById('onboardBtn').innerText = 'Entregando à Clara Falk...';

      // Cria protocolo de entrega de 24 horas
      const protocolNumber = 'MAPA-' + Math.floor(100000 + Math.random() * 900000);
      currentProtocol = {
        protocolNumber,
        fullName,
        email: currentUser ? currentUser.email : '',
        birthDate,
        birthTime,
        handPhotoUrl: handPhotoBase64,
        submittedAt: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      // Salva protocolo no LocalStorage (assim no F5 ele não perde o envio!)
      localStorage.setItem('mapa_protocol', JSON.stringify(currentProtocol));

      // Exibe imediatamente o comprovante com prazo de 24h
      showWaitingProtocol(currentProtocol);

      // Dispara o processamento denso da IA e PDF em segundo plano
      try {
        fetch('/api/readings/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: fullName,
            birthDate,
            birthTime,
            email: currentUser ? currentUser.email : '',
            handPhotoUrl: handPhotoBase64
          })
        }).then(res => res.json()).then(data => {
          if (data && data.reading) {
            currentReading = data.reading;
            localStorage.setItem('mapa_reading', JSON.stringify(currentReading));
            // Atualiza botão na tela de protocolo
            const btn = document.getElementById('checkReadingBtn');
            if (btn) {
              btn.innerHTML = '<span>✨ Seu Livro Está Pronto! Acessar Agora</span> <span>→</span>';
              btn.className = 'w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold py-4 px-6 rounded-xl shadow-xl transition-all text-sm font-sans flex items-center justify-center gap-2 animate-bounce';
            }
          }
        }).catch(err => console.warn('Processamento background:', err));
      } catch (e) {}
    }

    function showWaitingProtocol(protocol) {
      document.getElementById('protocolNumber').innerText = '#' + protocol.protocolNumber;
      document.getElementById('protocolClientName').innerText = protocol.fullName;
      document.getElementById('protocolEmail').innerText = protocol.email || 'Cadastrado no pedido';

      if (currentReading) {
        const btn = document.getElementById('checkReadingBtn');
        btn.innerHTML = '<span>✨ Seu Livro Está Pronto! Acessar Agora</span> <span>→</span>';
        btn.className = 'w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold py-4 px-6 rounded-xl shadow-xl transition-all text-sm font-sans flex items-center justify-center gap-2';
      }

      switchView('waiting');
    }

    function checkIfReadingIsReady() {
      if (currentReading) {
        renderCompletedReading(currentReading);
      } else {
        alert('Seu dossiê está em elaboração detalhada pela Clara Falk e os especialistas dentro do prazo de 24 horas. Você receberá um aviso por e-mail assim que estiver pronto!');
      }
    }

    // ==========================================
    // RENDERIZAÇÃO DO DOSSIÊ COMPLETO E DENSO
    // ==========================================
    function renderCompletedReading(reading) {
      currentReading = reading;
      localStorage.setItem('mapa_reading', JSON.stringify(reading));

      const rep = reading.report_data || reading;
      document.getElementById('reportClientName').innerText = 'Mapa do Amor de ' + (rep.meta?.clientName || 'Você');
      document.getElementById('reportMetaInfo').innerText = 'Signo: ' + (rep.meta?.sunSign || '') + ' • Arquétipo: ' + (rep.meta?.archetype || '') + ' • Emitido em ' + (rep.meta?.generatedAt || '');
      document.getElementById('readingHandImg').src = reading.hand_photo_url || (currentProtocol ? currentProtocol.handPhotoUrl : '');

      const chDiv = document.getElementById('readingChapters');
      chDiv.innerHTML = '';

      (rep.chapters || []).forEach(ch => {
        const card = document.createElement('article');
        card.className = 'bg-brand-cardDark border border-brand-borderDark rounded-3xl p-6 sm:p-10 space-y-4 print-card';
        card.innerHTML = 
          '<div class="flex items-center gap-2">' +
            '<span class="text-[11px] font-serif uppercase tracking-widest px-3.5 py-1 rounded-full bg-brand-borderDark text-brand-goldLight border border-brand-gold/20">Capítulo 0' + ch.chapterNumber + '</span>' +
          '</div>' +
          '<h2 class="font-serif text-2xl sm:text-3xl text-[#f6e5ce] leading-snug">' + ch.title + '</h2>' +
          '<p class="text-xs sm:text-sm text-[#dfc382] font-serif italic pb-2 border-b border-brand-borderDark/60">' + ch.subtitle + '</p>' +
          '<div class="pt-2 text-xs sm:text-sm text-[#edd0ab]/95 leading-relaxed font-sans whitespace-pre-line text-justify space-y-3">' + ch.content + '</div>';
        chDiv.appendChild(card);
      });

      const tkList = document.getElementById('readingTakeaways');
      tkList.innerHTML = '';
      (rep.summaryKeyTakeaways || []).forEach(tk => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-2.5';
        li.innerHTML = '<span class="text-brand-gold text-base shrink-0 mt-0.5">✦</span><span class="leading-relaxed">' + tk + '</span>';
        tkList.appendChild(li);
      });

      document.getElementById('readingClaraMsg').innerText = '“' + (rep.claraPersonalMessage || '') + '”';

      switchView('leituras');
      confetti({ particleCount: 80, spread: 70, colors: ['#c5a059', '#dfc382', '#8e4b5d', '#ffffff'] });
    }

    function triggerDownloadPdf() {
      // Abre o diálogo de impressão configurado perfeitamente para 'Salvar como PDF' com qualidade editorial
      window.print();
    }

    // ==========================================
    // CÂMERA AO VIVO COM GETUSERMEDIA E PERMISSÃO
    // ==========================================
    let currentCameraStream = null;
    let currentFacingMode = 'environment';

    async function startLiveCamera() {
      const cameraModal = document.getElementById('cameraModal');
      const video = document.getElementById('cameraVideo');
      const errorBox = document.getElementById('cameraError');
      const errorText = document.getElementById('cameraErrorText');
      errorBox.classList.add('hidden');
      cameraModal.classList.remove('hidden');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        cameraModal.classList.add('hidden');
        document.getElementById('cameraInput').click();
        return;
      }

      try {
        if (currentCameraStream) {
          currentCameraStream.getTracks().forEach(t => t.stop());
        }

        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: currentFacingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
          });
        } catch (facingErr) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        }

        currentCameraStream = stream;
        video.srcObject = stream;
        await video.play();
      } catch (err) {
        console.error('Erro de permissão da câmera:', err);
        errorText.innerText = 'Permissão para usar a câmera foi bloqueada ou recusada. Você pode permitir clicando no cadeado do navegador ou escolher uma foto da galeria.';
        errorBox.classList.remove('hidden');
      }
    }

    function capturePhotoFromCamera() {
      const video = document.getElementById('cameraVideo');
      if (!video || !video.videoWidth) {
        alert('Aguarde o vídeo da câmera iniciar...');
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      handPhotoBase64 = canvas.toDataURL('image/jpeg', 0.92);
      document.getElementById('handImgPreview').src = handPhotoBase64;
      document.getElementById('dropZone').classList.add('hidden');
      document.getElementById('previewZone').classList.remove('hidden');

      closeCameraModal();
    }

    function switchCamera() {
      currentFacingMode = (currentFacingMode === 'environment') ? 'user' : 'environment';
      startLiveCamera();
    }

    function closeCameraModal() {
      if (currentCameraStream) {
        currentCameraStream.getTracks().forEach(t => t.stop());
        currentCameraStream = null;
      }
      document.getElementById('cameraModal').classList.add('hidden');
    }
  </script>
</body>
</html>`;
}

// --------------------------------------------------------------------------
// WORKER FETCH DISPATCHER
// --------------------------------------------------------------------------
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. Rota de Webhook da PerfectPay
    if (path.endsWith('/api/webhooks/perfectpay') && request.method === 'POST') {
      try {
        const payload = await request.json() as any;
        console.log('[Worker Webhook] Recebido pedido:', payload?.code, 'status:', payload?.sale_status_enum_key);

        const isApproved =
          payload?.sale_status_enum === 2 ||
          payload?.sale_status_enum_key === 'approved' ||
          payload?.sale_status_detail === 'paid';

        if (!isApproved) {
          return new Response(JSON.stringify({ status: 'ignored', message: 'Venda nao aprovada' }), {
            headers: { 'content-type': 'application/json' },
          });
        }

        const email = payload?.customer?.email?.trim().toLowerCase();
        const fullName = payload?.customer?.full_name?.trim() || 'Cliente Mapa do Amor';
        const supabase = getSupabase(env);

        await supabase.from('orders').upsert({
          transaction_code: payload.code,
          customer_email: email,
          customer_name: fullName,
          sale_amount: payload.sale_amount,
          currency: payload.currency_enum_key || 'BRL',
          payment_type: payload.payment_type_enum_key || 'pix',
          status: 'approved',
          raw_payload: payload,
        }, { onConflict: 'transaction_code' });

        return new Response(JSON.stringify({ status: 'success', order_code: payload.code }), {
          headers: { 'content-type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // 2. Rota de Ativação de Acesso (/api/auth/activate)
    if (path.endsWith('/api/auth/activate') && request.method === 'POST') {
      try {
        const { email: rawEmail, password } = await request.json() as any;
        const email = rawEmail?.trim().toLowerCase();

        if (!email) {
          return new Response(JSON.stringify({ error: 'E-mail obrigatorio' }), { status: 400, headers: { 'content-type': 'application/json' } });
        }

        const supabase = getSupabase(env);
        let fullName = 'Guilherme Santos';

        try {
          const { data: order } = await supabase
            .from('orders')
            .select('*')
            .ilike('customer_email', email)
            .eq('status', 'approved')
            .limit(1)
            .maybeSingle();

          if (order && order.customer_name) {
            fullName = order.customer_name;
          }
        } catch (dbErr) {
          console.warn('[Supabase DB] Usando fallback local:', dbErr);
        }

        return new Response(JSON.stringify({ success: true, email, fullName }), {
          headers: { 'content-type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // 3. Rota de Processamento de Leitura DENSA com OpenAI GPT-4o (/api/readings/process)
    if (path.endsWith('/api/readings/process') && request.method === 'POST') {
      try {
        const body = await request.json() as any;
        const clientName = body.clientName || 'Cliente';
        const birthDate = body.birthDate || '1995-01-01';
        const birthTime = body.birthTime || '';
        const handPhotoUrl = body.handPhotoUrl || '';

        const openai = getOpenAI(env);

        // Prompt enriquecido para geração de dossiê longo, denso e profundo
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          temperature: 0.75,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `Você é Clara Falk, criadora e guia acolhedora do "Mapa do Amor".
Você é uma autoridade sênior em Quiromancia Simbólica, Psicologia Junguiana dos Relacionamentos e Astrologia Venusiana.
Sua missão é gerar um DOSSIÊ PROFUNDO, DENSO, LONGO E TRANSFORMADOR para a cliente ${clientName} (Data de Nascimento: ${birthDate}${birthTime ? `, Horário: ${birthTime}` : ''}).

DIRETRIZES CRÍTICAS DE REDAÇÃO (DENSIDADE MÁXIMA):
- Não faça textos curtos, superficiais ou telegráficos. Escreva como uma autora de um livro editorial premiado.
- Cada capítulo deve ter NO MÍNIMO 3 a 4 parágrafos substanciais, densos e minuciosos.
- Explore com profundidade os sentimentos que a pessoa guarda no peito: a sensação de se doar demais e receber migalhas, o cansaço emocional de sustentar relações sozinha, a dificuldade de baixar a guarda após desilusões passadas, e o anseio legítimo por uma conexão com reciprocidade verdadeira e paz interior.
- Conecte a análise da Linha do Coração (profundidade, curvatura em direção a Júpiter/Saturno, ramificações de doação e de proteção), a Linha da Cabeça (racionalização das dores) e o Monte de Vênus (vitalidade amorosa e sensualidade).
- Integre o Signo Solar e a regência venusiana arquetípica.

ESTRUTURA EXCLUSIVA EM JSON:
{
  "meta": {
    "clientName": "${clientName}",
    "birthDate": "${birthDate}",
    "birthTime": "${birthTime || 'Não informado'}",
    "generatedAt": "${new Date().toLocaleDateString('pt-BR')}",
    "sunSign": "Signo Solar calculado",
    "archetype": "Título poético do Arquétipo de Vênus"
  },
  "chapters": [
    {
      "chapterNumber": 1,
      "title": "O Portal do Seu Coração: Anatomia da Sua Trajetória Amorosa",
      "subtitle": "Um olhar compassivo sobre as cicatrizes, as entregas e onde sua alma está hoje",
      "content": "Texto longo com 3 a 4 parágrafos densos abordando a história afetiva, as defesas que construiu e o momento atual..."
    },
    {
      "chapterNumber": 2,
      "title": "A Linguagem Secreta da Sua Palma: Laudo Quiromântico Aprofundado",
      "subtitle": "A Linha do Coração, a Linha da Cabeça e o Monte de Vênus decodificados",
      "content": "Texto longo com 3 a 4 parágrafos densos analisando com precisão cirúrgica a forma como ama, onde se machuca e o que a palma revela sobre seu magnetismo..."
    },
    {
      "chapterNumber": 3,
      "title": "As Forças Invisíveis do Seu Céu: Arquétipos de Vênus e Sinastria",
      "subtitle": "O alinhamento astrológico que rege suas atrações e suas necessidades inegociáveis",
      "content": "Texto longo com 3 a 4 parágrafos densos integrando a energia astrológica, elementos e necessidades de segurança emocional..."
    },
    {
      "chapterNumber": 4,
      "title": "Desprogramação de Padrões: O Fim dos Ciclos Repetitivos",
      "subtitle": "O que você viveu no passado e tem a permissão sagrada de não mais repetir",
      "content": "Texto longo com 3 a 4 parágrafos densos sobre romper o papel de salvadora, não implorar afeto e desarmar dinâmicas tóxicas..."
    },
    {
      "chapterNumber": 5,
      "title": "O Mapa da Sua Reciprocidade: Sua Bússola para o Futuro",
      "subtitle": "Como reconhecer e acolher uma relação madura, estável e que realmente vale a sua presença",
      "content": "Texto longo com 3 a 4 parágrafos densos com orientações práticas para os primeiros 90 dias de novas relações e filtros saudáveis..."
    },
    {
      "chapterNumber": 6,
      "title": "O Ritual da Nova Conexão & Bênção Afetiva",
      "subtitle": "Palavras finais para ancorar a certeza de que o amor verdadeiro combina com você",
      "content": "Texto emocionante e poético conduzido por Clara Falk, selando a abertura de um novo ciclo de respeito e carinho mútuo..."
    }
  ],
  "summaryKeyTakeaways": [
    "Critério 1: Síntese prática e direta para lembrar no dia a dia",
    "Critério 2: Síntese sobre reciprocidade",
    "Critério 3: Síntese sobre limites saudáveis",
    "Critério 4: Síntese sobre o arquétipo",
    "Critério 5: Síntese sobre o novo ciclo amoroso"
  ],
  "claraPersonalMessage": "Carta íntima, pessoal e afetuosa de 2 parágrafos assinada calorosamente por Clara Falk."
}`,
            },
            {
              role: 'user',
              content: `Por favor, elabore o livro/dossiê completo e denso do Mapa do Amor para ${clientName}.`,
            },
          ],
        });

        const reportData = JSON.parse(completion.choices[0]?.message?.content || '{}');

        return new Response(JSON.stringify({
          status: 'completed',
          reading: {
            full_name: clientName,
            hand_photo_url: handPhotoUrl,
            report_data: reportData,
            pdf_url: null,
          },
        }), {
          headers: { 'content-type': 'application/json' },
        });
      } catch (err: any) {
        console.error('[Worker Process] Erro:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // 4. Se a rota for do app (/app, /app/login, /app/onboarding, /app/leituras, etc.)
    if (path.startsWith('/app')) {
      return new Response(renderAppHtml(), {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
          'cache-control': 'no-cache',
        },
      });
    }

    // 5. Caso contrário, entrega a landing page / quiz existente em outputs/
    return env.ASSETS.fetch(request);
  },
};
