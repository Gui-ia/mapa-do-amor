'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2, Loader2, Heart, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClaraWaitingScreenProps {
  readingId: string;
  clientName: string;
}

export default function ClaraWaitingScreen({ readingId, clientName }: ClaraWaitingScreenProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const steps = [
    { title: 'Conectando à Clara Falk', desc: 'Iniciando a acolhida da sua energia e dados de nascimento' },
    { title: 'Mapeamento Quiromântico', desc: 'Especialista em quiromancia analisando a Linha do Coração e Monte de Vênus' },
    { title: 'Alinhamento Astrológico', desc: 'Calculando a influência cósmica de Vênus e seus arquétipos afetivos' },
    { title: 'Redação da Liebeslandkarte', desc: 'Clara Falk escrevendo a síntese da sua bússola do amor' },
    { title: 'Diagramação do Livro em PDF', desc: 'Gerando o documento oficial diagramado para download e leitura' },
  ];

  useEffect(() => {
    // 1. Inicia o processamento no backend se ainda não iniciou
    const startProcessing = async () => {
      try {
        await fetch('/app/api/readings/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ readingId }),
        });
      } catch (e) {
        console.error('Erro ao disparar processamento:', e);
      }
    };

    startProcessing();

    // 2. Animação de progresso visual das etapas
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 12000); // Avança etapa a cada 12 segundos

    // 3. Polling para verificar se a leitura foi completada
    const checkInterval = setInterval(async () => {
      try {
        const res = await fetch(`/app/api/readings/${readingId}`);
        const data = await res.json();

        if (data?.reading?.status === 'completed') {
          clearInterval(checkInterval);
          clearInterval(stepInterval);
          setCurrentStep(steps.length - 1);
          setIsCompleted(true);

          // Efeito comemorativo
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#c5a059', '#dfc382', '#8e4b5d', '#ffffff'],
          });

          // Redireciona após 2 segundos
          setTimeout(() => {
            router.push(`/leituras?id=${readingId}`);
          }, 2500);
        } else if (data?.reading?.status === 'failed') {
          clearInterval(checkInterval);
          clearInterval(stepInterval);
          setErrorMessage('Houve uma oscilação na conexão dos especialistas. Vamos tentar novamente.');
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 4000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(checkInterval);
    };
  }, [readingId, router]);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 text-center">
      {/* Retrato da Clara com borda mística pulsante */}
      <div className="relative inline-block mb-6">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-[#c5a059] p-1 bg-[#201b2e] mx-auto overflow-hidden relative shadow-2xl shadow-[#c5a059]/20">
          <img
            src="/app/assets/clara-falk-retrato-v1.png"
            alt="Clara Falk"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-[#8e4b5d] text-white text-[11px] font-medium px-3 py-0.5 rounded-full border border-[#c5a059]/40 flex items-center gap-1 shadow-lg whitespace-nowrap">
          <Sparkles className="w-3 h-3 text-[#dfc382]" />
          <span>Clara Falk & Equipe</span>
        </div>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#f6e5ce] mb-2">
        {isCompleted ? 'Seu Mapa do Amor está pronto!' : `Preparando a leitura de ${clientName}`}
      </h2>

      <p className="text-xs sm:text-sm text-[#edd0ab]/70 max-w-md mx-auto mb-8">
        {isCompleted
          ? 'Todas as análises foram concluídas e seu documento oficial está disponível.'
          : 'A Clara e os especialistas estão analisando as linhas da sua palma e seus aspectos astrais. Isso leva de 1 a 2 minutos.'}
      </p>

      {/* Lista de Etapas */}
      <div className="bg-[#201b2e] border border-[#332b47] rounded-2xl p-5 text-left space-y-4 mb-8">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep || isCompleted;
          const isCurrent = idx === currentStep && !isCompleted;

          return (
            <div key={idx} className="flex items-start gap-3.5 transition-all">
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-[#dfc382] animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-[#332b47] flex items-center justify-center text-[10px] text-[#edd0ab]/40">
                    {idx + 1}
                  </div>
                )}
              </div>

              <div>
                <div
                  className={`text-xs sm:text-sm font-medium ${
                    isDone
                      ? 'text-[#f6e5ce]'
                      : isCurrent
                      ? 'text-[#dfc382]'
                      : 'text-[#edd0ab]/40'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-[11px] text-[#edd0ab]/60 leading-tight mt-0.5">
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isCompleted ? (
        <button
          onClick={() => router.push(`/leituras?id=${readingId}`)}
          className="w-full bg-gradient-to-r from-[#c5a059] to-[#8e4b5d] hover:brightness-110 text-white font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/20 transition-all text-sm font-sans"
        >
          <BookOpen className="w-4 h-4" />
          <span>Acessar Meu Mapa do Amor Agora</span>
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 text-xs text-[#edd0ab]/60">
          <Heart className="w-3.5 h-3.5 text-[#8e4b5d] animate-pulse" />
          <span>Você também poderá acessar esta leitura a qualquer momento na sua área de membros.</span>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 text-xs text-rose-400 bg-rose-950/40 border border-rose-800 p-3 rounded-xl">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
