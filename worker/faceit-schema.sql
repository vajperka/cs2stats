CREATE TABLE IF NOT EXISTS faceit_demo_analysis (id text PRIMARY KEY, result jsonb, attempts integer NOT NULL DEFAULT 0, next_try timestamptz NOT NULL DEFAULT now());
