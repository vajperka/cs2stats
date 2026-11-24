ALTER TABLE cs2_demo_jobs ADD COLUMN IF NOT EXISTS stats jsonb;
ALTER TABLE cs2_demo_jobs ADD COLUMN IF NOT EXISTS analyzed_at timestamptz;
