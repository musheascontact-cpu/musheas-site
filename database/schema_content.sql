-- إنشاء جدول لمحتوى الموقع القابل للتعديل
CREATE TABLE site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL, -- { "en": "...", "ar": "...", "fr": "..." }
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- تفعيل الأمان (RLS)
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- صلاحيات القراءة (للجميع)
CREATE POLICY "Allow public read to site_content" ON site_content FOR SELECT USING (true);

-- صلاحيات التحديث (للمشرفين - مفتوحة للتطوير)
CREATE POLICY "Allow public update to site_content" ON site_content FOR UPDATE USING (true);
CREATE POLICY "Allow public insert to site_content" ON site_content FOR INSERT WITH CHECK (true);

-- إضافة بعض المحتوى الأولي (كمثال)
INSERT INTO site_content (key, value)
VALUES 
  ('hero_title_1', '{"en": "Where", "ar": "حيث تلتقي"}'),
  ('hero_title_2', '{"en": "Mycology", "ar": "الفطريات"}'),
  ('hero_title_3', '{"en": "Meets Biotechnology", "ar": "بالبيوتكنولوجيا"}'),
  ('hero_description', '{"en": "We are a premier producer of mushroom-based cosmetic actives...", "ar": "نحن منتج رائد للمكونات التجميلية النشطة القائمة على الفطر..."}'),
  ('about_hero_image', '{"en": "https://picsum.photos/seed/about-hero/1600/800", "ar": "https://picsum.photos/seed/about-hero/1600/800"}'),
  ('about_story_image', '{"en": "https://picsum.photos/seed/story-img/600/600", "ar": "https://picsum.photos/seed/story-img/600/600"}'),
  ('about_mission_image', '{"en": "https://picsum.photos/seed/mission-img/600/600", "ar": "https://picsum.photos/seed/mission-img/600/600"}'),
  ('about_vision_image', '{"en": "https://picsum.photos/seed/vision-img/600/600", "ar": "https://picsum.photos/seed/vision-img/600/600"}')
ON CONFLICT (key) DO NOTHING;
