-- إضافة روابط التواصل الاجتماعي لجدول المحتوى
INSERT INTO site_content (key, value)
VALUES 
  ('facebook_url', '{"en": "https://facebook.com", "ar": "https://facebook.com"}'),
  ('instagram_url', '{"en": "https://instagram.com", "ar": "https://instagram.com"}'),
  ('youtube_url', '{"en": "https://youtube.com", "ar": "https://youtube.com"}'),
  ('linkedin_url', '{"en": "https://linkedin.com", "ar": "https://linkedin.com"}')
ON CONFLICT (key) DO NOTHING;
