-- =====================================================
-- EliteClub Smart Trading Journal — Supabase Schema
-- انسخ هذا الكود كله والصقه في Supabase SQL Editor
-- =====================================================

-- 1. جدول الملفات الشخصية
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  username TEXT UNIQUE,
  role TEXT DEFAULT 'trader' CHECK (role IN ('admin', 'coach', 'trader')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. جدول الصفقات
CREATE TABLE trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  trader_name TEXT,
  asset TEXT NOT NULL,
  market_type TEXT CHECK (market_type IN ('Forex', 'Gold', 'Indices', 'Crypto')),
  direction TEXT CHECK (direction IN ('Buy', 'Sell')),
  entry_price NUMERIC,
  stop_loss NUMERIC,
  take_profit_1 NUMERIC,
  take_profit_2 NUMERIC,
  take_profit_3 NUMERIC,
  exit_price NUMERIC,
  lot_size NUMERIC,
  risk_percentage NUMERIC,
  result TEXT CHECK (result IN ('Win', 'Loss', 'BE')),
  pips NUMERIC DEFAULT 0,
  profit_loss NUMERIC DEFAULT 0,
  timeframe TEXT CHECK (timeframe IN ('1M','5M','15M','1H','4H','Daily')),
  session TEXT CHECK (session IN ('Asia','London','New York')),
  strategy_setup TEXT,
  entry_reason TEXT,
  mistake_made TEXT,
  chart_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول الملاحظات من المدرب
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES auth.users(id),
  feedback_text TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول التقارير الأسبوعية
CREATE TABLE weekly_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  report_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY — كل مستخدم يشوف بياناته بس
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: كل شخص يقرأ ويعدل ملفه الشخصي بس
CREATE POLICY "profiles_own" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Trades: كل شخص يتحكم بصفقاته بس
CREATE POLICY "trades_own" ON trades
  FOR ALL USING (auth.uid() = user_id);

-- Feedback: كل شخص يقرأ الفيدباك اللي على صفقاته
CREATE POLICY "feedback_read_own" ON feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trades WHERE trades.id = feedback.trade_id AND trades.user_id = auth.uid()
    )
  );

-- Weekly Reports: كل شخص يتحكم بتقاريره بس
CREATE POLICY "reports_own" ON weekly_reports
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- AUTO CREATE PROFILE ON SIGNUP
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
