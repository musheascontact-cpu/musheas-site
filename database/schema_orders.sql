-- 1. إنشاء جدول الطلبات (Orders)
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_wilaya text NOT NULL,
  customer_address text NOT NULL,
  delivery_type text NOT NULL DEFAULT 'home', -- home, office
  shipping_fee numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- الحالات: pending, processing, shipped, delivered, cancelled
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. إنشاء جدول عناصر الطلب (Order Items) لربط الطلبات بالمنتجات
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id text REFERENCES products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL,
  price_at_time numeric NOT NULL
);

-- 3. تفعيل الأمان (RLS) للجدولين
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 4. صلاحيات القراءة والكتابة
-- نسمح للجميع (العامة) بإنشاء طلبات جديدة
CREATE POLICY "Allow public insert to orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to order_items" ON order_items FOR INSERT WITH CHECK (true);

-- نسمح بقراءة وتعديل الطلبات للوحة التحكم (مفتوحة مؤقتاً للتطوير)
CREATE POLICY "Allow public read access to orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public read access to order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Allow public update access to orders" ON orders FOR UPDATE USING (true);
