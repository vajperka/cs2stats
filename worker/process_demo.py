"""Trusted operator: manually match a downloaded demo to its sharing code."""
import argparse, os, json, subprocess, sys
from pathlib import Path
import psycopg
p=argparse.ArgumentParser(); p.add_argument('demo'); p.add_argument('steamid'); p.add_argument('code'); a=p.parse_args()
with psycopg.connect(os.environ['DATABASE_URL']) as conn:
    if not conn.execute('SELECT 1 FROM cs2_demo_jobs WHERE steamid=%s AND code=%s',(a.steamid,a.code)).fetchone():
        raise SystemExit('Match not queued')
    result=json.loads(subprocess.check_output([sys.executable,str(Path(__file__).with_name('analyze.py')),a.demo,a.steamid],text=True))
    conn.execute('UPDATE cs2_demo_jobs SET stats=%s::jsonb, analyzed_at=now() WHERE steamid=%s AND code=%s',(json.dumps(result),a.steamid,a.code))
print('Saved analysis')
