-- 1. إنشاء جدول المنتجات (Products)
CREATE TABLE products (
  id text PRIMARY KEY,
  name jsonb NOT NULL,
  slug text NOT NULL UNIQUE,
  description jsonb NOT NULL,
  price numeric NOT NULL,
  sale_price numeric,
  image_url text NOT NULL,
  image_hint text,
  category text NOT NULL,
  ingredients jsonb,
  application jsonb,
  benefits jsonb,
  type text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. تفعيل الأمان (Row Level Security) للسماح بقراءة البيانات
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON products
  FOR DELETE USING (true);

-- 3. إدخال منتجات تجريبية (Sample Data)
INSERT INTO products (id, name, slug, description, price, sale_price, image_url, image_hint, category, ingredients, application, benefits, type)
VALUES
  (
    'prod_001', 
    '{"en": "Reishi Spore Extract", "ar": "مستخلص فطر الريشي"}', 
    'reishi-spore-extract', 
    '{"en": "A potent antioxidant powerhouse derived from the revered Reishi mushroom.", "ar": "قوة مضادة للأكسدة مستمدة من فطر الريشي الموقر."}', 
    8500, 
    7500, 
    'https://picsum.photos/seed/101/600/600', 
    'cosmetic bottle', 
    'Extracts', 
    '{"en": ["Ganoderma Lucidum (Reishi) Spore Extract"], "ar": ["مستخلص فطر الريشي"]}', 
    '{"en": "Apply 2-3 drops to clean skin.", "ar": "ضعي 2-3 قطرات على بشرة نظيفة."}', 
    '{"en": ["Anti-aging", "Reduces Inflammation"], "ar": ["مكافحة الشيخوخة", "يقلل الالتهاب"]}', 
    'b2b'
  ),
  (
    'prod_005', 
    '{"en": "Shiitake Brightening Complex", "ar": "مركب تفتيح شيتاكي"}', 
    'shiitake-brightening-complex', 
    '{"en": "A concentrated extract from Shiitake mushrooms, rich in kojic acid.", "ar": "مستخلص مركز من فطر شيتاكي، غني بحمض الكوجيك."}', 
    7800, 
    NULL, 
    'https://picsum.photos/seed/105/600/600', 
    'glowing serum', 
    'Extracts', 
    '{"en": ["Lentinus Edodes (Shiitake) Extract"], "ar": ["مستخلص فطر شيتاكي"]}', 
    '{"en": "Apply to dark spots.", "ar": "يوضع على البقع الداكنة."}', 
    '{"en": ["Fades Hyperpigmentation", "Brightening"], "ar": ["يلاشي فرط التصبغ", "تفتيح"]}', 
    'b2b'
  );
