
-- Step 1: Add missing columns to cart_items for price, name, image_url (all optional for now)
ALTER TABLE public.cart_items
  ADD COLUMN IF NOT EXISTS price numeric,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS name text;

-- Step 2: Optional, set defaults for new columns so adding items always works.
ALTER TABLE public.cart_items
  ALTER COLUMN price SET DEFAULT 0,
  ALTER COLUMN image_url SET DEFAULT '',
  ALTER COLUMN name SET DEFAULT '';

-- Note: Existing values for these columns will be null until set by your app.
