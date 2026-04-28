-- إنشاء جدول لرسائل الاتصال والاستفسارات (B2B Inquiries)
CREATE TABLE inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new', -- new, read, replied, archived
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- تفعيل الأمان (RLS)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- صلاحيات القراءة والكتابة
-- السماح للجميع بإرسال استفسارات
CREATE POLICY "Allow public insert to inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- السماح للمشرفين بقراءة وتحديث الاستفسارات (مفتوحة للتطوير)
CREATE POLICY "Allow public read to inquiries" ON inquiries FOR SELECT USING (true);
CREATE POLICY "Allow public update to inquiries" ON inquiries FOR UPDATE USING (true);
