-- Migration: Remove vehicle/automotive-specific tables and columns
-- Revert this migration to restore vehicle functionality

ALTER TABLE products DROP COLUMN IF EXISTS model_compatibility;
ALTER TABLE products DROP COLUMN IF EXISTS vehicle_year_start;
ALTER TABLE products DROP COLUMN IF EXISTS vehicle_year_end;

DROP TABLE IF EXISTS product_vehicle_map;
DROP TABLE IF EXISTS vehicles;
