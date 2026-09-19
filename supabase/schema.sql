-- ==========================================================
-- MAPA DO AMOR (CLARA FALK) - SUPABASE DATABASE SCHEMA
-- Projeto: udxxcswwfuunvjelxalk
-- ==========================================================

-- Habilita UUID caso ainda não esteja habilitado
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE PERFIS DE CLIENTES (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  cpf TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativa RLS em profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem visualizar seu próprio perfil" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 2. TABELA DE PEDIDOS / TRANSAÇÕES (Orders - PerfectPay)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_code TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  sale_amount NUMERIC(10,2),
  currency TEXT DEFAULT 'BRL',
  payment_type TEXT,
  status TEXT NOT NULL DEFAULT 'approved',
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativa RLS em orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios pedidos" 
ON public.orders FOR SELECT 
USING (auth.uid() = customer_id);

-- 3. TABELA DE LEITURAS ENTREGÁVEIS (Readings)
CREATE TABLE IF NOT EXISTS public.readings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TEXT,
  hand_photo_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing', -- 'processing', 'completed', 'failed'
  report_data JSONB,                        -- Dados estruturados dos agentes
  pdf_url TEXT,                             -- Link para download do PDF
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Ativa RLS em readings
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias leituras" 
ON public.readings FOR SELECT 
USING (auth.uid() = customer_id);

CREATE POLICY "Usuários podem criar suas leituras" 
ON public.readings FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Usuários podem atualizar suas leituras" 
ON public.readings FOR UPDATE 
USING (auth.uid() = customer_id);

-- 4. STORAGE BUCKETS
-- Inserção de buckets para fotos e PDFs (se não existirem)
INSERT INTO storage.buckets (id, name, public)
VALUES ('hand-photos', 'hand-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('reading-reports', 'reading-reports', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para hand-photos
CREATE POLICY "Permitir upload autenticado de fotos da mão"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'hand-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Permitir leitura pública das fotos da mão"
ON storage.objects FOR SELECT
USING (bucket_id = 'hand-photos');

-- Políticas de Storage para reading-reports (PDFs)
CREATE POLICY "Permitir leitura pública dos relatórios em PDF"
ON storage.objects FOR SELECT
USING (bucket_id = 'reading-reports');

-- 5. TRIGGER AUTOMÁTICO: Criação de profile quando novo usuário é criado em auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, cpf)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Cliente Mapa do Amor'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'cpf'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    cpf = COALESCE(EXCLUDED.cpf, public.profiles.cpf),
    updated_at = NOW();

  -- Se houver pedidos pendentes com esse e-mail, vincula o customer_id
  UPDATE public.orders
  SET customer_id = NEW.id
  WHERE customer_email = NEW.email AND customer_id IS NULL;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
