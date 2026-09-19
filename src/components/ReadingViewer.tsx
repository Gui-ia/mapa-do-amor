'use client';

import React from 'react';
import { Download, Sparkles, Heart, Compass, Bookmark, ShieldCheck, ChevronRight } from 'lucide-react';
import { FullLoveMapReport } from '@/lib/ai/clara-synthesizer';

interface ReadingViewerProps {
  report: FullLoveMapReport;
  pdfUrl?: string | null;
  handPhotoUrl?: string;
}

export default function ReadingViewer({ report, pdfUrl, handPhotoUrl }: ReadingViewerProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-16">
      {/* Top Banner de Parabéns e Ação de Download */}
      <div className="bg-gradient-to-br from-[#201b2e] to-[#2a1f30] border border-[#c5a059]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left relative z-10">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#c5a059] shrink-0 bg-black/40 shadow-md">
            <img
              src="/app/assets/clara-falk-retrato-v1.png"
              alt="Clara Falk"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8e4b5d]/30 border border-[#8e4b5d]/60 text-[#dfc382] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Leitura Oficial Finalizada</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-[#f6e5ce] leading-tight">
              Mapa do Amor de {report.meta.clientName}
            </h1>

            <p className="text-xs sm:text-sm text-[#edd0ab]/70">
              {report.meta.sunSign} • {report.meta.archetype} • Emitido em {report.meta.generatedAt}
            </p>
          </div>
        </div>

        {/* Botão de Download em Destaque */}
        {pdfUrl && (
          <div className="mt-6 pt-6 border-t border-[#332b47] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#edd0ab]/80 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Seu livro em PDF de alta qualidade foi gerado e salvo.</span>
            </div>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={`Mapa_do_Amor_${report.meta.clientName}.pdf`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#c5a059] hover:bg-[#dfc382] text-[#171321] font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Livro em PDF</span>
            </a>
          </div>
        )}
      </div>

      {/* Registro Fotográfico da Palma */}
      {handPhotoUrl && (
        <div className="bg-[#201b2e] border border-[#332b47] rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#dfc382]">
            <Compass className="w-4 h-4" />
            <span>Registro das Linhas da Palma da Mão</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="h-64 rounded-2xl overflow-hidden border border-[#c5a059]/40 bg-black/50">
              <img
                src={handPhotoUrl}
                alt="Palma da mão enviada"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-[#edd0ab]/80 leading-relaxed">
              <p className="font-serif italic text-base text-[#dfc382]">
                &ldquo;Cada bifurcação e profundidade no topo da sua palma conta a história de como você se protege e como anseia por entrega recíproca.&rdquo;
              </p>
              <p>
                A quiromancia simbólica não prevê nomes ou datas com uma bola de cristal: ela mapeia a sua anatomia emocional, seus filtros inconscientes e sua propensão a determinados tipos de parceiro.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Capítulos do Mapa do Amor */}
      <div className="space-y-8">
        {report.chapters.map((chapter) => (
          <article
            key={chapter.chapterNumber}
            className="bg-[#201b2e]/70 border border-[#332b47] rounded-3xl p-6 sm:p-10 space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-serif uppercase tracking-widest px-3 py-1 rounded-full bg-[#332b47] text-[#dfc382] border border-[#c5a059]/30">
                Capítulo 0{chapter.chapterNumber}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="font-serif text-xl sm:text-2xl text-[#f6e5ce]">
                {chapter.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#dfc382]/80 font-serif italic">
                {chapter.subtitle}
              </p>
            </div>

            <div className="pt-2 text-sm sm:text-base text-[#edd0ab]/90 leading-relaxed space-y-4 font-sans whitespace-pre-line text-justify">
              {chapter.content}
            </div>
          </article>
        ))}
      </div>

      {/* Pontos-Chave da Bússola */}
      {report.summaryKeyTakeaways?.length > 0 && (
        <div className="bg-gradient-to-br from-[#2a1f30] to-[#201b2e] border border-[#c5a059]/60 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#dfc382]">
            <Bookmark className="w-4 h-4" />
            <span>Sua Bússola Diária: Síntese Prática</span>
          </div>

          <h3 className="font-serif text-xl text-[#f6e5ce]">
            Para lembrar sempre que a dúvida bater:
          </h3>

          <ul className="space-y-3 pt-2">
            {report.summaryKeyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#edd0ab]/90">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] mt-2 shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Carta e Assinatura de Clara Falk */}
      <div className="bg-[#201b2e] border border-[#c5a059]/40 rounded-3xl p-6 sm:p-10 space-y-6 relative">
        <div className="flex items-center gap-2 text-[#8e4b5d]">
          <Heart className="w-5 h-5 fill-[#8e4b5d]" />
          <span className="text-xs uppercase tracking-wider font-semibold text-[#dfc382]">
            Mensagem Especial de Clara Falk
          </span>
        </div>

        <div className="font-serif italic text-sm sm:text-base text-[#edd0ab]/90 leading-relaxed whitespace-pre-line text-justify">
          &ldquo;{report.claraPersonalMessage}&rdquo;
        </div>

        <div className="pt-4 border-t border-[#332b47] flex items-center justify-between">
          <div>
            <div className="font-serif text-lg text-[#f6e5ce]">Clara Falk</div>
            <div className="text-xs text-[#dfc382]/70">Guia e Fundadora do Mapa do Amor</div>
          </div>

          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#c5a059]">
            <img
              src="/app/assets/clara-falk-retrato-v1.png"
              alt="Clara Falk"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
