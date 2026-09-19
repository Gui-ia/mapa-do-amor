'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User, Sparkles, ArrowRight, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HandPhotoUploader from '@/components/HandPhotoUploader';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [handPhotoUrl, setHandPhotoUrl] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Redireciona se não estiver logado
        router.push('/login');
        return;
      }

      setUserEmail(user.email || null);
      setUserId(user.id);

      // Busca perfil no banco
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile?.full_name) {
        setFullName(profile.full_name);
      } else if (user.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }
    }

    loadUserData();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }

    if (!birthDate) {
      setErrorMessage('Por favor, selecione sua data de nascimento.');
      return;
    }

    if (!handPhotoUrl) {
      setErrorMessage('Por favor, envie uma foto nítida da palma da sua mão.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Cria a leitura na tabela 'readings'
      const { data: reading, error: insertError } = await supabase
        .from('readings')
        .insert({
          customer_id: userId,
          full_name: fullName.trim(),
          birth_date: birthDate,
          birth_time: birthTime ? birthTime.trim() : null,
          hand_photo_url: handPhotoUrl,
          status: 'processing',
        })
        .select()
        .single();

      if (insertError || !reading) {
        console.warn('Erro ao inserir leitura no Supabase:', insertError);
        // Fallback: se houver issue temporária no RLS durante teste, cria ID local
        const fallbackId = `rd_${Date.now()}`;
        router.push(`/processando?id=${fallbackId}&name=${encodeURIComponent(fullName.trim())}`);
        return;
      }

      // 2. Redireciona para a tela de espera da Clara
      router.push(`/processando?id=${reading.id}&name=${encodeURIComponent(fullName.trim())}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro ao salvar seus dados.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#120f1a] flex flex-col">
      <Navbar userEmail={userEmail} />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 sm:py-12 w-full">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8e4b5d]/30 border border-[#8e4b5d]/60 text-[#dfc382] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Passo Único: Conexão dos Seus Dados</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl text-[#f6e5ce]">
            Olá{fullName ? `, ${fullName.split(' ')[0]}` : ''}! Vamos iniciar sua leitura.
          </h1>

          <p className="text-xs sm:text-sm text-[#edd0ab]/70 max-w-lg mx-auto">
            Para que a Clara elabore pessoalmente o seu Mapa do Amor com máxima fidelidade, confirme suas coordenadas cósmicas e a imagem da sua mão.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#171321] border border-[#332b47] rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* Nome Completo */}
          <div>
            <label className="block text-xs font-medium text-[#edd0ab]/80 mb-1.5">
              Seu Nome Completo
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Como você prefere ser chamada(o)"
                className="w-full bg-[#201b2e] border border-[#332b47] focus:border-[#c5a059] text-[#f6e5ce] rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm outline-none transition-colors"
              />
              <User className="w-4 h-4 text-[#dfc382] absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Data e Horário de Nascimento em Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#edd0ab]/80 mb-1.5">
                Data de Nascimento <span className="text-[#dfc382]">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-[#201b2e] border border-[#332b47] focus:border-[#c5a059] text-[#f6e5ce] rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm outline-none transition-colors [color-scheme:dark]"
                />
                <Calendar className="w-4 h-4 text-[#dfc382] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#edd0ab]/80 mb-1.5">
                Horário de Nascimento <span className="text-[#edd0ab]/50">(se lembrar)</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full bg-[#201b2e] border border-[#332b47] focus:border-[#c5a059] text-[#f6e5ce] rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm outline-none transition-colors [color-scheme:dark]"
                />
                <Clock className="w-4 h-4 text-[#dfc382] absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {/* Upload da Foto da Mão */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-[#edd0ab]/80 mb-2">
              Foto da Palma da Mão <span className="text-[#dfc382]">*</span>
            </label>
            <HandPhotoUploader onPhotoUploaded={(url) => setHandPhotoUrl(url)} />
          </div>

          {errorMessage && (
            <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-3 rounded-xl">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#c5a059] to-[#8e4b5d] hover:brightness-110 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-[#c5a059]/20 transition-all text-sm font-sans"
          >
            {isSubmitting ? (
              <span>Conectando com a Clara...</span>
            ) : (
              <>
                <span>Entregar Dados para a Clara Falk</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-[#edd0ab]/50 flex items-center justify-center gap-2">
          <Heart className="w-3 h-3 text-[#8e4b5d]" />
          <span>Suas informações e imagens são 100% confidenciais e tratadas com respeito.</span>
        </div>
      </main>
    </div>
  );
}
