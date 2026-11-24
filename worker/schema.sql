CREATE TABLE IF NOT EXISTS cs2_demo_jobs (steamid text NOT NULL, code text NOT NULL, created_at timestamptz DEFAULT now(), PRIMARY KEY(steamid,code));
