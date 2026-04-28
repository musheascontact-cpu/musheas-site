-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (Insert)
CREATE POLICY "Allow anonymous subscription" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Only authenticated admins can view subscribers
CREATE POLICY "Allow admins to view subscribers" ON newsletter_subscribers
  FOR SELECT TO authenticated USING (true);
