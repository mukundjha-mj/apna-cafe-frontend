-- ============================================
-- Apna Cafe — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. CAFES TABLE
CREATE TABLE IF NOT EXISTS cafes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  cover_image TEXT,
  is_open BOOLEAN DEFAULT true,
  open_time TEXT,
  close_time TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cafe_id UUID REFERENCES cafes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price FLOAT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_veg BOOLEAN DEFAULT true,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  sizes JSONB, -- [{ "label": "Medium", "price": 99 }, ...]
  is_combo BOOLEAN DEFAULT false,
  combo_contents TEXT, -- e.g. "Aloo Tikki Burger + Classic Fries + Coke"
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PROFILES TABLE (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  phone TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  cafe_id UUID REFERENCES cafes(id) NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','ACCEPTED','PREPARING','READY','COMPLETED','REJECTED')),
  type TEXT NOT NULL CHECK (type IN ('DINE_IN','PICKUP')),
  table_number TEXT,
  total_amount FLOAT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES menu_items(id) NOT NULL,
  quantity INT NOT NULL,
  price FLOAT NOT NULL,
  item_name TEXT NOT NULL, -- snapshot of name at order time
  custom_note TEXT
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_menu_items_cafe_id ON menu_items(cafe_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_cafe_id ON orders(cafe_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- CAFES: anyone can read
CREATE POLICY "Cafes are publicly readable"
  ON cafes FOR SELECT
  USING (true);

-- MENU ITEMS: anyone can read
CREATE POLICY "Menu items are publicly readable"
  ON menu_items FOR SELECT
  USING (true);

-- PROFILES: users can read/update their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ORDERS: users can create and read their own orders
CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Allow dashboard to read all orders for a cafe (via service role or anon for now)
CREATE POLICY "Anyone can read orders for dashboard"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update order status"
  ON orders FOR UPDATE
  USING (true);

-- ORDER ITEMS: users can create and read their own order items
CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can view order items"
  ON order_items FOR SELECT
  USING (true);

-- ============================================
-- REALTIME: Enable for orders table
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP (trigger)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
