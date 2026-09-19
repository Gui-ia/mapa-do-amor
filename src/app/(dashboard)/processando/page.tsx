'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ClaraWaitingScreen from '@/components/ClaraWaitingScreen';

function ProcessingContent() {
  const searchParams = useSearchParams();
  const readingId = searchParams.get('id') || '';
  const clientName = searchParams.get('name') || 'Você';

  return (
    <div className="min-h-screen bg-[#120f1a] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <ClaraWaitingScreen readingId={readingId} clientName={clientName} />
      </main>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#edd0ab]">Iniciando...</div>}>
      <ProcessingContent />
    </Suspense>
  );
}
