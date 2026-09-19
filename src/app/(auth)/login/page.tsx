'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, KeyRound, Mail, ArrowRight, Heart, ShieldCheck, HelpCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Inicia por padrão em 'Primeiro Acesso' já que a maioria virá da página de obrigado
  const [isFirstAccess, setIsFirstAccess] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam.trim().toLowerCase());
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isFirstAccess) {
        if (password.length < 6) {
          setErrorMessage('A sua senha deve ter no mínimo 6 caracteres.');
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMessage('As duas senhas digitadas não conferem. Verifique e tente novamente.');
          setIsLoading(false);
          return;
        }

        // 1. Valida se a compra existe no banco e define a senha
        const res = await fetch('/app/api/auth/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMessage(data.error || 'Não foi possível ativar seu acesso. Verifique o e-mail digitado.');
          setIsLoading(false);
          return;
        }

        // 2. Realiza o login imediato com a nova senha
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (signInError) {
          setErrorMessage('Sua senha foi registrada com sucesso, mas houve uma oscilação no login. Tente fazer o login na aba "Já tenho senha".');
          setIsFirstAccess(false);
          setIsLoading(false);
          return;
        }

        // Redireciona para o Onboarding da leitura
        router.push('/onboarding');
      } else {
        // Login tradicional
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          setErrorMessage('E-mail ou senha incorretos. Se esta é a sua primeira vez acessando, clique na aba "Primeiro Acesso" acima.');
          setIsLoading(false);
          return;
        }

        router.push('/onboarding');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro ao processar seu acesso.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#120f1a]">
      {/* Efeito místico suave de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#8e4b5d]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#171321] border border-[#332b47] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-[#c5a059] p-0.5 mx-auto overflow-hidden bg-[#201b2e] shadow-lg">
            <img
              src="/app/assets/clara-falk-retrato-v1.png"
              alt="Clara Falk"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div>
            <h1 className="font-serif text-2xl text-[#f6e5ce]">
              {isFirstAccess ? 'Ative seu Mapa do Amor' : 'Acesse seu Mapa do Amor'}
            </h1>
            <p className="text-xs text-[#edd0ab]/70 mt-1 max-w-xs mx-auto leading-relaxed">
              {isFirstAccess
                ? 'Insira o mesmo e-mail que você usou na compra e crie sua senha de acesso'
                : 'Entre com seu e-mail e senha cadastrados para ver suas leituras'}
            </p>
          </div>

          {/* Abas Alternadoras */}
          <div className="flex bg-[#201b2e] p-1 rounded-xl border border-[#332b47] text-xs">
            <button
              type="button"
              onClick={() => {
                setIsFirstAccess(true);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                isFirstAccess
                  ? 'bg-[#c5a059] text-[#171321] shadow-md font-semibold'
                  : 'text-[#edd0ab]/70 hover:text-white'
              }`}
            >
              Primeiro Acesso (Crie sua Senha)
            </button>
            <button
              type="button"
              onClick={() => {
                setIsFirstAccess(false);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                !isFirstAccess
                  ? 'bg-[#c5a059] text-[#171321] shadow-md font-semibold'
                  : 'text-[#edd0ab]/70 hover:text-white'
              }`}
            >
              Já tenho senha
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#edd0ab]/80 mb-1.5">
              E-mail utilizado na compra
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@gmail.com"
                className="w-full bg-[#201b2e] border border-[#332b47] focus:border-[#c5a059] text-[#f6e5ce] rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-[#dfc382] absolute left-3.5 top-3.5" />
            </div>
            {isFirstAccess && (
              <span className="text-[11px] text-[#edd0ab]/50 block mt-1">
                ✓ Usamos este e-mail para localizar seu pedido automaticamente.
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#edd0ab]/80 mb-1.5">
              {isFirstAccess ? 'Crie uma Senha para o seu Acesso' : 'Sua Senha'}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                className="w-full bg-[#201b2e] border border-[#332b47] focus:border-[#c5a059] text-[#f6e5ce] rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm outline-none transition-colors"
              />
              <KeyRound className="w-4 h-4 text-[#dfc382] absolute left-3.5 top-3.5" />
            </div>
          </div>

          {isFirstAccess && (
            <div>
              <label className="block text-xs font-medium text-[#edd0ab]/80 mb-1.5">
                Confirme sua Senha
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite a mesma senha novamente"
                  className="w-full bg-[#201b2e] border border-[#332b47] focus:border-[#c5a059] text-[#f6e5ce] rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm outline-none transition-colors"
                />
                <KeyRound className="w-4 h-4 text-[#dfc382] absolute left-3.5 top-3.5" />
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="text-xs text-rose-300 bg-rose-950/60 border border-rose-800/80 p-3 rounded-xl leading-relaxed">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#c5a059] to-[#8e4b5d] hover:brightness-110 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/20 transition-all text-xs sm:text-sm mt-4"
          >
            {isLoading ? (
              <span>Verificando seu pedido...</span>
            ) : (
              <>
                <span>{isFirstAccess ? 'Ativar Acesso e Continuar' : 'Entrar no Aplicativo'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#332b47] text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#edd0ab]/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Acesso exclusivo para quem adquiriu o Mapa do Amor</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#edd0ab]">Carregando...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
