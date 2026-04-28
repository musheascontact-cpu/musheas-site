-- Add shipping integration fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_status text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_label text; -- URL to PDF
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipment_id text; -- ID in Swift Express system
