-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for partners" ON partners
  FOR SELECT USING (true);

CREATE POLICY "Admin full access for partners" ON partners
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Initial data
INSERT INTO partners (name, logo_url, display_order)
VALUES 
  ('Partner One', 'https://picsum.photos/seed/p1/400/200', 1),
  ('Partner Two', 'https://picsum.photos/seed/p2/400/200', 2),
  ('Partner Three', 'https://picsum.photos/seed/p3/400/200', 3),
  ('Partner Four', 'https://picsum.photos/seed/p4/400/200', 4),
  ('Partner Five', 'https://picsum.photos/seed/p5/400/200', 5),
  ('Partner Six', 'https://picsum.photos/seed/p6/400/200', 6)
ON CONFLICT DO NOTHING;
