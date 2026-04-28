-- ==========================================
-- MUSHEAS DATABASE IMPROVEMENTS (V2)
-- ==========================================

-- 1. إنشاء جدول العملاء (Customers Table)
-- يتيح تتبع سجل العميل، طلباته السابقة، والقيمة الإجمالية لمشترياته
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  wilaya text,
  address text,
  total_spent numeric DEFAULT 0,
  total_orders integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. تحديث جدول الطلبات (Orders)
-- إضافة معرّف العميل، ومعلومات تتبع الشحن
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS tracking_number text,
ADD COLUMN IF NOT EXISTS shipping_company text DEFAULT 'Yalidine';

-- 3. تحديث جدول المنتجات (Products)
-- إضافة نظام تتبع المخزون والرموز الشريطية (SKU)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS sku text UNIQUE;

-- 4. تحديث جدول الاستفسارات (Inquiries)
-- ربط الاستفسار بمنتج معين (B2B)
ALTER TABLE inquiries 
ADD COLUMN IF NOT EXISTS product_id text REFERENCES products(id) ON DELETE SET NULL;

-- 5. تحديث جدول العروض (Promotions)
-- إضافة حقل JSONB موحد للغات ليكون جاهزاً للاستخدام والتوسع مستقبلاً
ALTER TABLE promotions 
ADD COLUMN IF NOT EXISTS title jsonb;

-- ==========================================
-- سياسات الأمان (Row Level Security - RLS)
-- ==========================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- السماح للعامة (أو السيرفر) بإنشاء عملاء جدد
CREATE POLICY "Allow public insert to customers" 
ON customers FOR INSERT 
WITH CHECK (true);

-- السماح للسيرفر بقراءة العملاء لتحديث إحصائياتهم
CREATE POLICY "Allow read access to customers" 
ON customers FOR SELECT 
USING (true);

CREATE POLICY "Allow update access to customers" 
ON customers FOR UPDATE 
USING (true);
