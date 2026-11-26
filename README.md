# FRAG//INDEX
Next.js App Router. Node 20+. `npm install`, copy `.env.example` to `.env.local`, set FACEIT_API_KEY, `npm run dev`. Deploy by importing repository in Vercel, set FACEIT_API_KEY in Project Settings > Environment Variables, redeploy. Demo at /profile/demo. No registration. Key is server-only. Live data not verified without key. ELO history, per-match ELO changes and weapon stats are shown only when available; additional historical data provider or demo parsing is needed. Artwork cropped from approved concepts; responsive UI is implemented in CSS, not a screenshot. No database required for current API lookup.

V2: animované vlastní SVG ranky 1–20 (11–20 nejsou oficiální FACEIT levely), plnošířkové pozadí, ELO změna pouze z dostupných hodnot API. Pokud FACEIT neposkytne historii ELO, změna zůstává nedostupná. Pro spolehlivé budoucí sledování je potřeba persistentní databáze a pravidelný sběr ELO.

## V3
Vlastní SVG emblémy pro FACEIT levely 1–10, barevně odlišené animace všech ranků, výraznější animace aktivního ranku a podpora omezeného pohybu.

V5: Official circular levels 1–10 and Challenger reference badge. Browser-local observed Elo changes only, polling every 90 seconds while profile is open. No historical backfill; Challenger status not automatically verified.

## V6 – Neon
Set DATABASE_URL (or POSTGRES_URL) and FACEIT_API_KEY in Vercel. Tables frag_players, frag_elo_history and frag_match_elo are created on first profile request. No existing tables are deleted. The first observation establishes a baseline. Only a single newly visible match with changed Elo is attributed; observations are not official match Elo and can be affected by adjustments. Historical gaps remain unknown. Open profiles refresh every 90 seconds. Optional protected GET /api/cron checks up to 10 tracked players; configure CRON_SECRET and a scheduler compatible with your Vercel plan. No schedule is enabled by default. Live database and build not tested.

V8: Experimental read-only ELO diagnostics: /api/elo-probe?nick=vajperka . No historical data is imported until response semantics are verified.
