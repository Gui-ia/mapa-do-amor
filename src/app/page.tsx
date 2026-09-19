import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redireciona para o fluxo de onboarding ou login
  redirect('/onboarding');
}
