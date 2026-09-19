'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, BookOpen, Calendar, Download, Plus, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ReadingViewer from '@/components/ReadingViewer';
import { createClient } from '@/lib/supabase/client';

function LeiturasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const specificId = searchParams.get('id');

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [readings, setReadings] = useState<any[]>([]);
  const [activeReading, setActiveReading] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Modo convidado / demonstração ou redireciona
        setUserEmail(null);
      } else {
        setUserEmail(user.email || null);
      }

      // Se temos um ID específico passado pela URL
      if (specificId) {
        try {
          const res = await fetch(`/app/api/readings/${specificId}`);
          const data = await res.json();
          if (data?.reading) {
            setActiveReading(data.reading);
          }
        } catch (e) {
          console.error('Erro ao buscar leitura específica:', e);
        }
      }

      // Busca todas as leituras do usuário logado se houver
      if (user) {
        const { data: userReadings } = await supabase
          .from('readings')
          .select('*')
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false });

        if (userReadings && userReadings.length > 0) {
          setReadings(userReadings);
          // Se não havia ID específico selecionado, seleciona o mais recente
          if (!specificId && !activeReading) {
            setActiveReading(userReadings[0]);
          }
        }
      }

      setIsLoading(false);
    }

    loadData();
  }, [supabase, specificId]);

  return (
    <div className="min-h-screen bg-[#120f1a] flex flex-col">
      <Navbar userEmail={userEmail} />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 sm:py-12 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="w-8 h-8 text-[#dfc382] animate-spin" />
            <p className="text-xs text-[#edd0ab]/70">Buscando suas leituras da Clara Falk...</p>
          </div>
        ) : activeReading ? (
          <div className="space-y-6">
            {/* Navegação entre leituras se tiver mais de uma */}
            {readings.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#332b47]">
                <span className="text-xs text-[#edd0ab]/60 uppercase tracking-wider font-semibold mr-2 shrink-0">
                  Histórico:
                </span>
                {readings.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveReading(r)}
                    className={`text-xs px-4 py-1.5 rounded-full border transition-all shrink-0 ${
                      activeReading.id === r.id
                        ? 'bg-[#c5a059] text-[#171321] border-[#c5a059] font-medium'
                        : 'bg-[#201b2e] text-[#edd0ab]/70 border-[#332b47] hover:border-[#c5a059]/50'
                    }`}
                  >
                    {new Date(r.created_at).toLocaleDateString('pt-BR')} • {r.full_name}
                  </button>
                ))}
              </div>
            )}

            {/* Visualizador da Leitura */}
            <ReadingViewer
              report={activeReading.report_data}
              pdfUrl={activeReading.pdf_url}
              handPhotoUrl={activeReading.hand_photo_url}
            />
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-16 px-4 bg-[#171321] border border-[#332b47] rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#201b2e] border border-[#c5a059]/40 flex items-center justify-center mx-auto text-[#dfc382]">
              <BookOpen className="w-8 h-8" />
            </div>

            <h2 className="font-serif text-xl text-[#f6e5ce]">
              Nenhuma leitura gerada ainda
            </h2>

            <p className="text-xs text-[#edd0ab]/70 leading-relaxed">
              Você ainda não enviou as informações para a Clara Falk gerar o seu primeiro Mapa do Amor.
            </p>

            <button
              onClick={() => router.push('/onboarding')}
              className="inline-flex items-center gap-2 bg-[#c5a059] hover:bg-[#dfc382] text-[#171321] font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-md mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Iniciar Meu Mapa Agora</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function LeiturasPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#edd0ab]">Carregando leituras...</div>}>
      <LeiturasContent />
    </Suspense>
  );
}
