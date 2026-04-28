-- إضافة حقل الإخفاء (is_visible) للمنتجات
-- هذا يسمح بإخفاء المنتج من الموقع دون حذفه تماماً
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;

-- إضافة حقل المنتج المميز (is_featured) إذا لم يكن موجوداً
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
