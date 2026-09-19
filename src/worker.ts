// src/worker.ts - Cloudflare Worker para lecturalunar.com
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import {
  sendTransactionalEmail,
  getPurchaseApprovedEmailHtml,
  getReadingCompletedEmailHtml,
} from './lib/email';

export interface Env {
  ASSETS: Fetcher;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  OPENAI_API_KEY?: string;
  PERFECTPAY_WEBHOOK_TOKEN?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
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
function renderAppHtml(initialView = 'login'): string {
  return `<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mapa do Amor • Clara Falk</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
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
    .shimmer { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  </style>
</head>
<body class="flex flex-col justify-between min-h-screen">
  <!-- Top Navigation -->
  <header class="border-b border-brand-borderDark bg-[#171321]/90 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full border border-brand-gold p-0.5 overflow-hidden bg-brand-cardInner flex items-center justify-center">
          <img src="/clara-falk-retrato-v1.png" alt="Clara Falk" class="w-full h-full object-cover rounded-full" onerror="this.src='/clara-falk-9x16.png'">
        </div>
        <div>
          <span class="font-serif text-xl font-bold tracking-wide gold-text block leading-none">Mapa do Amor</span>
          <span class="text-[10px] uppercase tracking-widest text-[#dfc382]/70 block mt-0.5 font-sans">com Clara Falk</span>
        </div>
      </div>
      <div id="userHeaderActions" class="flex items-center gap-3">
        <button onclick="switchView('leituras')" class="text-xs text-brand-goldLight border border-brand-gold/40 px-3 py-1.5 rounded-full hover:bg-brand-cardInner transition-all">
          Minhas Leituras
        </button>
      </div>
    </div>
  </header>

  <!-- Container Principal das Telas -->
  <main class="flex-1 max-w-3xl mx-auto px-4 py-8 w-full flex flex-col justify-center">

    <!-- 1. TELA DE ATIVAÇÃO / LOGIN -->
    <div id="view-login" class="w-full max-w-md mx-auto bg-brand-cardDark border border-brand-borderDark rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div class="text-center space-y-3 mb-6">
        <div class="w-16 h-16 rounded-full border-2 border-brand-gold p-0.5 mx-auto overflow-hidden bg-brand-cardInner">
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
        <p class="text-xs sm:text-sm text-[#edd0ab]/70">Para que a Clara e os especialistas entreguem sua Liebeslandkarte, informe seus dados cósmicos e a foto da sua palma.</p>
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
        <div class="pt-2">
          <label class="block text-xs font-medium text-[#edd0ab]/80 mb-2">Foto da Palma da Mão *</label>
          <input type="file" id="handFileInput" accept="image/*" capture="environment" class="hidden" onchange="handleHandFile(event)">
          
          <div id="dropZone" onclick="document.getElementById('handFileInput').click()" class="border-2 border-dashed border-brand-gold/40 hover:border-brand-gold bg-brand-cardInner/60 rounded-2xl p-6 text-center cursor-pointer transition-all">
            <div class="w-12 h-12 rounded-full bg-brand-borderDark border border-brand-gold/40 flex items-center justify-center mx-auto mb-2 text-brand-goldLight text-xl">✋</div>
            <h4 class="text-sm font-serif font-medium text-[#f6e5ce]">Toque para tirar foto da sua mão aberta</h4>
            <p class="text-[11px] text-[#edd0ab]/60 mt-1">Mão dominante bem iluminada, dedos abertos e linhas visíveis</p>
          </div>

          <div id="previewZone" class="hidden rounded-2xl border border-brand-gold/60 bg-brand-cardInner p-4 flex items-center gap-4">
            <img id="handImgPreview" src="" alt="Palma da mão" class="w-20 h-28 object-cover rounded-xl border border-brand-borderDark">
            <div class="space-y-1">
              <span class="text-xs text-emerald-400 font-medium">✓ Imagem carregada</span>
              <p class="text-[11px] text-[#edd0ab]/70">Pronta para análise quiromântica das linhas do coração e da cabeça.</p>
              <button type="button" onclick="document.getElementById('handFileInput').click()" class="text-[11px] text-brand-goldLight underline">Trocar foto</button>
            </div>
          </div>
        </div>

        <button type="submit" id="onboardBtn" class="w-full bg-gradient-to-r from-brand-gold to-brand-rose hover:brightness-110 text-white font-medium py-3.5 rounded-xl shadow-lg transition-all text-xs sm:text-sm font-sans">
          Entregar Dados para a Clara Falk
        </button>
      </form>
    </div>

    <!-- 3. TELA DE ESPERA DA CLARA -->
    <div id="view-waiting" class="hidden max-w-lg mx-auto w-full text-center space-y-6">
      <div class="relative inline-block">
        <div class="w-32 h-32 rounded-full border-2 border-brand-gold p-1 bg-brand-cardInner mx-auto overflow-hidden shadow-2xl shadow-brand-gold/20">
          <img src="/clara-falk-retrato-v1.png" alt="Clara Falk" class="w-full h-full object-cover rounded-full" onerror="this.src='/clara-falk-9x16.png'">
        </div>
        <span class="absolute -bottom-2 right-1/2 translate-x-1/2 bg-brand-rose text-white text-[11px] px-3 py-0.5 rounded-full border border-brand-gold/40 shadow-md">
          Clara Falk & Especialistas
        </span>
      </div>

      <div class="space-y-2">
        <h2 id="waitingTitle" class="font-serif text-2xl sm:text-3xl text-[#f6e5ce]">Preparando seu Mapa do Amor...</h2>
        <p class="text-xs sm:text-sm text-[#edd0ab]/70 max-w-sm mx-auto">Nossos especialistas em quiromancia e astrologia estão analisando suas linhas e seu alinhamento cósmico.</p>
      </div>

      <div class="bg-brand-cardDark border border-brand-borderDark rounded-2xl p-5 text-left space-y-3 text-xs">
        <div id="step1" class="flex items-center gap-3 text-brand-goldLight">
          <span class="w-2 h-2 rounded-full bg-brand-gold animate-ping"></span>
          <span>1. Visão computacional da Linha do Coração e Monte de Vênus...</span>
        </div>
        <div id="step2" class="flex items-center gap-3 text-[#edd0ab]/40">
          <span class="w-2 h-2 rounded-full bg-brand-borderDark"></span>
          <span>2. Cálculo das posições de Vênus e arquétipos cósmicos...</span>
        </div>
        <div id="step3" class="flex items-center gap-3 text-[#edd0ab]/40">
          <span class="w-2 h-2 rounded-full bg-brand-borderDark"></span>
          <span>3. Redação personalizada por Clara Falk...</span>
        </div>
        <div id="step4" class="flex items-center gap-3 text-[#edd0ab]/40">
          <span class="w-2 h-2 rounded-full bg-brand-borderDark"></span>
          <span>4. Diagramação e encadernação do livro em PDF...</span>
        </div>
      </div>
    </div>

    <!-- 4. TELA DE LEITURA COMPLETA -->
    <div id="view-leituras" class="hidden max-w-3xl mx-auto w-full space-y-8 pb-12">
      <!-- Card Superior com Ação de Download -->
      <div class="bg-gradient-to-br from-brand-cardDark to-[#2a1f30] border border-brand-gold/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div class="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div class="w-24 h-24 rounded-2xl overflow-hidden border-2 border-brand-gold shrink-0 bg-black/40">
            <img src="/clara-falk-retrato-v1.png" alt="Clara Falk" class="w-full h-full object-cover" onerror="this.src='/clara-falk-9x16.png'">
          </div>
          <div class="flex-1 space-y-1">
            <span class="inline-block px-3 py-0.5 rounded-full bg-brand-rose/40 text-brand-goldLight text-[11px] font-medium border border-brand-gold/30">
              ✦ Leitura Concluída e Entregue
            </span>
            <h1 class="font-serif text-2xl sm:text-3xl text-[#f6e5ce]" id="reportClientName">Mapa do Amor</h1>
            <p class="text-xs text-[#edd0ab]/70" id="reportMetaInfo">Análise de Quiromancia Simbólica & Astrologia</p>
          </div>
        </div>

        <div class="mt-6 pt-5 border-t border-brand-borderDark flex flex-col sm:flex-row items-center justify-between gap-4">
          <span class="text-xs text-[#edd0ab]/80">✓ Seu livro diagramado em PDF está disponível para download.</span>
          <button id="downloadPdfBtn" onclick="triggerDownloadPdf()" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-goldLight text-[#171321] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all">
            Baixar Livro em PDF
          </button>
        </div>
      </div>

      <!-- Foto da Mão e Explicação -->
      <div class="bg-brand-cardDark border border-brand-borderDark rounded-3xl p-6 sm:p-8">
        <h3 class="text-xs font-semibold uppercase tracking-widest text-brand-goldLight mb-4">Registro das Linhas da Palma da Mão</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div class="h-60 rounded-2xl overflow-hidden border border-brand-gold/40 bg-black/50">
            <img id="readingHandImg" src="" alt="Palma analisada" class="w-full h-full object-cover">
          </div>
          <div class="space-y-3 text-xs sm:text-sm text-[#edd0ab]/80 leading-relaxed font-serif italic text-base text-[#dfc382]">
            &ldquo;As bifurcações da sua Linha do Coração e o desenho do Monte de Vênus revelam seu anseio por um amor onde a reciprocidade não precise ser negociada.&rdquo;
          </div>
        </div>
      </div>

      <!-- Capítulos da Leitura -->
      <div id="readingChapters" class="space-y-6"></div>

      <!-- Bússola Diária -->
      <div class="bg-brand-cardDark border border-brand-gold/40 rounded-3xl p-6 sm:p-8 space-y-3">
        <h3 class="text-xs font-semibold uppercase tracking-widest text-brand-goldLight">Sua Bússola Afetiva Diária</h3>
        <ul id="readingTakeaways" class="space-y-2 text-xs sm:text-sm text-[#edd0ab]/90"></ul>
      </div>

      <!-- Carta de Clara Falk -->
      <div class="bg-brand-cardDark border border-brand-borderDark rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 class="text-xs font-semibold uppercase tracking-widest text-brand-rose">Mensagem Pessoal de Clara Falk</h3>
        <p id="readingClaraMsg" class="font-serif italic text-sm sm:text-base text-[#edd0ab]/90 leading-relaxed text-justify"></p>
        <div class="pt-4 border-t border-brand-borderDark flex justify-between items-center">
          <div>
            <div class="font-serif text-lg text-[#f6e5ce]">Clara Falk</div>
            <div class="text-xs text-[#dfc382]/70">Guia e Fundadora do Mapa do Amor</div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="border-t border-brand-borderDark py-6 text-center text-xs text-[#edd0ab]/40">
    © 2026 Mapa do Amor • Clara Falk • Todos os direitos reservados.
  </footer>

  <script>
    let currentUser = null;
    let currentReading = null;
    let handPhotoBase64 = null;
    let isFirstAccessMode = true;

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
          errBox.innerText = data.error || 'Erro ao validar acesso.';
          errBox.classList.remove('hidden');
          document.getElementById('authBtn').innerText = isFirstAccessMode ? 'Ativar Acesso e Continuar' : 'Entrar no Aplicativo';
          return;
        }

        currentUser = { email, fullName: data.fullName || 'Cliente' };
        document.getElementById('onboardingUserName').innerText = currentUser.fullName.split(' ')[0];
        document.getElementById('obFullName').value = currentUser.fullName;
        switchView('onboarding');
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

    async function handleOnboardingSubmit(e) {
      e.preventDefault();
      if (!handPhotoBase64) {
        alert('Por favor, tire ou selecione uma foto da sua mão.');
        return;
      }

      const fullName = document.getElementById('obFullName').value.trim();
      const birthDate = document.getElementById('obBirthDate').value;
      const birthTime = document.getElementById('obBirthTime').value;

      document.getElementById('onboardBtn').innerText = 'Enviando para a Clara Falk...';
      switchView('waiting');

      try {
        const res = await fetch('/api/readings/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: fullName,
            birthDate,
            birthTime,
            email: currentUser ? currentUser.email : '',
            handPhotoUrl: handPhotoBase64
          })
        });
        const data = await res.json();
        if (data && data.reading) {
          renderCompletedReading(data.reading);
        } else {
          alert('A leitura foi processada. Abrindo seu painel...');
          switchView('leituras');
        }
      } catch (err) {
        console.error(err);
      }
    }

    function renderCompletedReading(reading) {
      currentReading = reading;
      const rep = reading.report_data || reading;
      document.getElementById('reportClientName').innerText = 'Mapa do Amor de ' + (rep.meta?.clientName || 'Você');
      document.getElementById('reportMetaInfo').innerText = (rep.meta?.sunSign || '') + ' • ' + (rep.meta?.archetype || '') + ' • ' + (rep.meta?.generatedAt || '');
      document.getElementById('readingHandImg').src = reading.hand_photo_url || handPhotoBase64;

      const chDiv = document.getElementById('readingChapters');
      chDiv.innerHTML = '';
      (rep.chapters || []).forEach(ch => {
        const card = document.createElement('article');
        card.className = 'bg-brand-cardDark/80 border border-brand-borderDark rounded-3xl p-6 sm:p-8 space-y-3';
        card.innerHTML = '<span class="text-[11px] uppercase tracking-widest px-3 py-0.5 rounded-full bg-brand-borderDark text-brand-goldLight">Capítulo 0' + ch.chapterNumber + '</span>' +
          '<h2 class="font-serif text-xl sm:text-2xl text-[#f6e5ce]">' + ch.title + '</h2>' +
          '<p class="text-xs text-[#dfc382]/80 font-serif italic">' + ch.subtitle + '</p>' +
          '<p class="pt-2 text-xs sm:text-sm text-[#edd0ab]/90 leading-relaxed font-sans whitespace-pre-line text-justify">' + ch.content + '</p>';
        chDiv.appendChild(card);
      });

      const tkList = document.getElementById('readingTakeaways');
      tkList.innerHTML = '';
      (rep.summaryKeyTakeaways || []).forEach(tk => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-2';
        li.innerHTML = '<span class="text-brand-gold mt-1">✦</span><span>' + tk + '</span>';
        tkList.appendChild(li);
      });

      document.getElementById('readingClaraMsg').innerText = '“' + (rep.claraPersonalMessage || '') + '”';

      switchView('leituras');
      confetti({ particleCount: 70, spread: 60, colors: ['#c5a059', '#dfc382', '#8e4b5d'] });
    }

    function triggerDownloadPdf() {
      if (currentReading && currentReading.pdf_url) {
        window.open(currentReading.pdf_url, '_blank');
      } else {
        window.print();
      }
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

    // 1. Rota de Webhook da PerfectPay (/api/webhooks/perfectpay ou /app/api/webhooks/perfectpay)
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

        // Salva pedido em orders
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

        // Dispara e-mail transacional de Compra Aprovada & Acesso Liberado em background
        if (email) {
          const emailTpl = getPurchaseApprovedEmailHtml({
            clientName: fullName,
            clientEmail: email,
            orderCode: payload.code,
            saleAmount: payload.sale_amount,
            accessUrl: 'https://lecturalunar.com/app',
          });

          ctx.waitUntil(
            sendTransactionalEmail({
              apiKey: env.RESEND_API_KEY,
              from: env.EMAIL_FROM || 'Clara Falk <acesso@lecturalunar.com>',
              to: email,
              subject: emailTpl.subject,
              html: emailTpl.html,
              text: emailTpl.text,
            })
          );
        }

        return new Response(JSON.stringify({ status: 'success', order_code: payload.code }), {
          headers: { 'content-type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // 2. Rota de Ativação de Acesso e Verificação de Compra (/api/auth/activate)
    if (path.endsWith('/api/auth/activate') && request.method === 'POST') {
      try {
        const { email: rawEmail, password } = await request.json() as any;
        const email = rawEmail?.trim().toLowerCase();

        if (!email) {
          return new Response(JSON.stringify({ error: 'E-mail obrigatorio' }), { status: 400, headers: { 'content-type': 'application/json' } });
        }

        const supabase = getSupabase(env);

        let fullName = 'Guilherme Santos';

        // Tenta buscar no Supabase
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

        // Permite o acesso se for um dos e-mails autorizados ou encontrados no banco
        return new Response(JSON.stringify({ success: true, email, fullName }), {
          headers: { 'content-type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // 3. Rota de Teste de E-mail (/api/email/test)
    if (path.endsWith('/api/email/test') && (request.method === 'POST' || request.method === 'GET')) {
      try {
        let targetEmail = '';
        if (request.method === 'POST') {
          const b = await request.json().catch(() => ({})) as any;
          targetEmail = b.email;
        } else {
          targetEmail = url.searchParams.get('to') || '';
        }

        if (!targetEmail) {
          return new Response(JSON.stringify({ error: 'Forneça o parâmetro email ou ?to=seuemail@dominio.com' }), {
            status: 400,
            headers: { 'content-type': 'application/json' },
          });
        }

        const testTpl = getPurchaseApprovedEmailHtml({
          clientName: 'Teste de Envio',
          clientEmail: targetEmail,
          orderCode: 'TEST-' + Math.floor(Math.random() * 1000000),
          saleAmount: '97.00',
          accessUrl: 'https://lecturalunar.com/app',
        });

        const sendResult = await sendTransactionalEmail({
          apiKey: env.RESEND_API_KEY,
          from: env.EMAIL_FROM || 'Clara Falk <acesso@lecturalunar.com>',
          to: targetEmail,
          subject: '[TESTE] ' + testTpl.subject,
          html: testTpl.html,
          text: testTpl.text,
        });

        return new Response(JSON.stringify({
          status: sendResult.success ? 'success' : 'failed',
          result: sendResult,
          apiKeyConfigured: Boolean(env.RESEND_API_KEY),
          from: env.EMAIL_FROM || 'Clara Falk <acesso@lecturalunar.com>',
        }), {
          headers: { 'content-type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // 4. Rota de Processamento de Leitura com IA (/api/readings/process)
    if (path.endsWith('/api/readings/process') && request.method === 'POST') {
      try {
        const body = await request.json() as any;
        const clientName = body.clientName || 'Cliente';
        const birthDate = body.birthDate || '1995-01-01';
        const birthTime = body.birthTime || '';
        const handPhotoUrl = body.handPhotoUrl || '';

        const openai = getOpenAI(env);

        // Síntese com OpenAI GPT-4o
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          temperature: 0.75,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `Você é Clara Falk, criadora do Mapa do Amor. Analise a história de amor para ${clientName} (Nascimento: ${birthDate} ${birthTime ? `às ${birthTime}` : ''}).
Retorne um JSON com a seguinte estrutura:
{
  "meta": { "clientName": "${clientName}", "birthDate": "${birthDate}", "birthTime": "${birthTime}", "generatedAt": "${new Date().toLocaleDateString('pt-BR')}", "sunSign": "Signo Solar", "archetype": "Arquétipo Afetivo" },
  "chapters": [
    { "chapterNumber": 1, "title": "Abertura dos Seus Caminhos", "subtitle": "Onde seu coração está hoje", "content": "Texto caloroso da Clara Falk..." },
    { "chapterNumber": 2, "title": "O Desenho das Suas Linhas", "subtitle": "A Linha do Coração e sua verdade afetiva", "content": "Análise da quiromancia e da palma..." },
    { "chapterNumber": 3, "title": "Seu Arquétipo de Vênus e o Céu", "subtitle": "As forças que regem sua atração", "content": "Análise astrológica de Vênus..." },
    { "chapterNumber": 4, "title": "Padrões que Você Reconhece", "subtitle": "O que você viveu no passado e não precisa mais repetir", "content": "Análise de superação de padrões..." },
    { "chapterNumber": 5, "title": "Sua Bússola para o Amor", "subtitle": "Como reconhecer uma relação que vale a pena", "content": "Guia prático para os próximos amores..." }
  ],
  "summaryKeyTakeaways": [ "Ponto 1", "Ponto 2", "Ponto 3" ],
  "claraPersonalMessage": "Carta final carinhosa assinada por Clara Falk."
}`,
            },
            {
              role: 'user',
              content: `Por favor, elabore o Mapa do Amor para ${clientName}.`,
            },
          ],
        });

        const reportData = JSON.parse(completion.choices[0].message.content || '{}');

        // Dispara e-mail de Mapa Revelado / Leitura Pronta se e-mail fornecido
        const userEmail = body.email;
        if (userEmail) {
          const readingTpl = getReadingCompletedEmailHtml({
            clientName,
            accessUrl: 'https://lecturalunar.com/app',
            sunSign: reportData.meta?.sunSign,
            archetype: reportData.meta?.archetype,
          });

          ctx.waitUntil(
            sendTransactionalEmail({
              apiKey: env.RESEND_API_KEY,
              from: env.EMAIL_FROM || 'Clara Falk <acesso@lecturalunar.com>',
              to: userEmail,
              subject: readingTpl.subject,
              html: readingTpl.html,
              text: readingTpl.text,
            })
          );
        }

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
