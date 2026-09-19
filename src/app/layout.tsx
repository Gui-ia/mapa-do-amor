import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mapa do Amor • Clara Falk',
  description: 'Sua jornada amorosa através da quiromancia simbólica e astrologia com Clara Falk',
  icons: {
    icon: '/app/assets/logo-mapa-do-amor-rosa.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#120f1a] text-[#f6e5ce] antialiased selection:bg-[#8e4b5d] selection:text-white">
        <main className="min-h-screen flex flex-col justify-between">
          {children}
        </main>
      </body>
    </html>
  );
}
