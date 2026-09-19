'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle2, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface HandPhotoUploaderProps {
  onPhotoUploaded: (url: string) => void;
}

export default function HandPhotoUploader({ onPhotoUploaded }: HandPhotoUploaderProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor, selecione um arquivo de imagem válido (JPG, PNG ou HEIC).');
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);

    // Cria preview local imediato
    const localUrl = URL.createObjectURL(file);
    setPhotoPreview(localUrl);

    try {
      // Gera nome único para o arquivo
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `hand_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload para o Supabase Storage no bucket 'hand-photos'
      const { data, error } = await supabase.storage
        .from('hand-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.warn('[HandPhotoUploader] Fallback no upload Storage:', error.message);
        // Fallback: Se o bucket ainda não tiver permissão pública ou em localhost, converte para Base64 Data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          onPhotoUploaded(base64String);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      // Obtém URL pública da foto
      const { data: publicData } = supabase.storage
        .from('hand-photos')
        .getPublicUrl(fileName);

      const finalUrl = publicData?.publicUrl || localUrl;
      onPhotoUploaded(finalUrl);
    } catch (err: any) {
      console.error('[HandPhotoUploader] Erro:', err);
      // Garante envio mesmo com fallback
      onPhotoUploaded(localUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setPhotoPreview(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Input de Câmera Direta */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />
      {/* Input de Galeria */}
      <input
        type="file"
        id="galleryInputComp"
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {!photoPreview ? (
        <div className="border-2 border-dashed border-[#c5a059]/50 bg-[#201b2e] rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#332b47] border border-[#c5a059]/60 flex items-center justify-center text-3xl mx-auto shadow-inner">
            📸
          </div>

          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="text-base font-serif font-bold text-[#f6e5ce]">
              Tirar foto da sua mão aberta
            </h4>
            <p className="text-xs text-[#edd0ab]/70">
              Posicione sua mão dominante em um local iluminado com os dedos abertos.
            </p>
          </div>

          <div className="pt-2 space-y-2.5 max-w-sm mx-auto">
            {/* Opção Principal: Abrir Câmera */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-[#c5a059] to-[#a66236] hover:brightness-110 text-[#171321] font-bold py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all active:scale-95"
            >
              <Camera className="w-5 h-5" />
              <span>Tirar Foto Agora (Abrir Câmera)</span>
            </button>

            {/* Opção Secundária: Galeria */}
            <button
              type="button"
              onClick={() => document.getElementById('galleryInputComp')?.click()}
              className="w-full bg-transparent hover:bg-[#332b47]/40 text-[#dfc382] border border-[#c5a059]/30 hover:border-[#c5a059] font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Ou escolher foto existente da galeria</span>
            </button>
          </div>

          <div className="pt-3 border-t border-[#332b47]/60 flex items-center justify-center gap-4 text-[11px] text-[#edd0ab]/50">
            <span>✓ Mão dominante</span>
            <span>✓ Luz natural sem sombras</span>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-[#c5a059]/60 bg-[#201b2e] p-4 flex flex-col sm:flex-row items-center gap-5 shadow-lg">
          <div className="relative w-28 h-36 rounded-xl overflow-hidden border border-[#332b47] shrink-0 bg-black/40">
            <img
              src={photoPreview}
              alt="Foto da Palma da Mão"
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-center p-2">
                <RefreshCw className="w-5 h-5 text-[#dfc382] animate-spin" />
                <span className="text-[10px] text-[#dfc382]">Preparando imagem...</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[#dfc382]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium">Foto capturada com sucesso!</span>
            </div>
            <p className="text-xs text-[#edd0ab]/70 leading-relaxed">
              As linhas do seu coração e monte de Vênus estão prontas para a análise da Clara Falk.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-xs text-[#dfc382] hover:text-white underline underline-offset-4 font-medium"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Tirar outra foto</span>
              </button>
              <span className="text-[#edd0ab]/30">•</span>
              <button
                type="button"
                onClick={() => document.getElementById('galleryInputComp')?.click()}
                className="inline-flex items-center gap-1 text-xs text-[#edd0ab]/60 hover:text-white underline underline-offset-4"
              >
                Escolher da galeria
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mt-2 flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
