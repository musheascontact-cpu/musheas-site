-- Add city/commune field to orders and customers table for better shipping integration
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_city text;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS city text;
