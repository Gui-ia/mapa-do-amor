'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, BookOpen, LogOut, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Navbar({ userEmail }: { userEmail?: string | null }) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="border-b border-[#332b47] bg-[#171321]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border border-[#c5a059] p-0.5 overflow-hidden bg-[#201b2e] flex items-center justify-center">
            <img
              src="/app/assets/clara-falk-retrato-v1.png"
              alt="Clara Falk"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <span className="font-serif text-lg font-medium tracking-wide gold-gradient-text block leading-none">
              Mapa do Amor
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#dfc382]/70 font-sans block mt-0.5">
              com Clara Falk
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/leituras"
            className="flex items-center gap-2 text-xs md:text-sm text-[#dfc382] hover:text-white px-3 py-1.5 rounded-full border border-[#c5a059]/30 hover:border-[#c5a059] transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Minhas Leituras</span>
          </Link>

          {userEmail && (
            <div className="flex items-center gap-2 border-l border-[#332b47] pl-4">
              <span className="text-xs text-[#edd0ab]/60 hidden sm:inline max-w-[150px] truncate">
                {userEmail}
              </span>
              <button
                onClick={handleLogout}
                title="Sair da conta"
                className="text-[#edd0ab]/60 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-[#201b2e]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
