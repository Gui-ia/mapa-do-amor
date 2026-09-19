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
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {!photoPreview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#c5a059]/40 hover:border-[#c5a059] bg-[#201b2e]/60 hover:bg-[#201b2e] transition-all rounded-2xl p-6 sm:p-8 text-center cursor-pointer group flex flex-col items-center justify-center gap-3 relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-full bg-[#332b47] border border-[#c5a059]/40 flex items-center justify-center text-[#dfc382] group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8" />
          </div>

          <div className="space-y-1 max-w-sm">
            <h4 className="text-base font-serif font-medium text-[#f6e5ce]">
              Tire ou envie uma foto da palma da sua mão
            </h4>
            <p className="text-xs text-[#edd0ab]/70">
              Mão aberta, bem iluminada e com as linhas do coração e da cabeça visíveis
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#c5a059] font-medium bg-[#171321] px-4 py-2 rounded-full border border-[#c5a059]/30 mt-2">
            <Upload className="w-3.5 h-3.5" />
            <span>Toque para tirar foto ou escolher da galeria</span>
          </div>

          <div className="mt-3 flex items-center gap-4 text-[11px] text-[#edd0ab]/50 border-t border-[#332b47]/60 pt-3">
            <span>✓ Preferencialmente a mão dominante</span>
            <span>✓ Luz natural sem sombras</span>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-[#c5a059]/60 bg-[#201b2e] p-4 flex flex-col sm:flex-row items-center gap-5">
          <div className="relative w-36 h-48 rounded-xl overflow-hidden border border-[#332b47] shrink-0 bg-black/40">
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

          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[#dfc382]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium">Foto recebida com sucesso!</span>
            </div>
            <p className="text-xs text-[#edd0ab]/70 leading-relaxed">
              Nossa equipe de especialistas e a Clara analisarão as bifurcações da sua linha do coração e o monte de Vênus a partir deste registro.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-[#dfc382] hover:text-white underline underline-offset-4"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tirar outra foto</span>
            </button>
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
