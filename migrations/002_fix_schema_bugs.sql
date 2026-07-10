-- Migration: Fix schema bugs
-- 1. Add UNIQUE constraint on cart_items (user_id, product_id)
-- 2. Align reviews table with application code (is_approved, title)

-- cart_items: prevent duplicate product entries per user
ALTER TABLE cart_items ADD CONSTRAINT cart_items_user_product_unique UNIQUE (user_id, product_id);

-- reviews: add missing title column
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS title TEXT;

-- reviews: rename approved -> is_approved
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'reviews' AND column_name = 'approved'
    ) THEN
        ALTER TABLE reviews RENAME COLUMN approved TO is_approved;
    END IF;
END $$;
