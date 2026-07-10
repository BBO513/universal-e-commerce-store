-- Migration: Universal products and store settings
-- Add JSONB columns for flexible product data and a store settings table

ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}';

CREATE TABLE IF NOT EXISTS store_settings (
    id SERIAL PRIMARY KEY,
    store_name TEXT NOT NULL DEFAULT 'My Store',
    logo_url TEXT,
    primary_color TEXT DEFAULT '#0F4B5F',
    currency TEXT DEFAULT 'AUD',
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO store_settings (store_name) VALUES ('My Store') ON CONFLICT DO NOTHING;
