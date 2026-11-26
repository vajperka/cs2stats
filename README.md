# FRAG//INDEX
Next.js App Router. Node 20+. `npm install`, copy `.env.example` to `.env.local`, set FACEIT_API_KEY, `npm run dev`. Deploy by importing repository in Vercel, set FACEIT_API_KEY in Project Settings > Environment Variables, redeploy. Demo at /profile/demo. No registration. Key is server-only. Live data not verified without key. ELO history, per-match ELO changes and weapon stats are shown only when available; additional historical data provider or demo parsing is needed. Artwork cropped from approved concepts; responsive UI is implemented in CSS, not a screenshot. No database required for current API lookup.

V2: animované vlastní SVG ranky 1–20 (11–20 nejsou oficiální FACEIT levely), plnošířkové pozadí, ELO změna pouze z dostupných hodnot API. Pokud FACEIT neposkytne historii ELO, změna zůstává nedostupná. Pro spolehlivé budoucí sledování je potřeba persistentní databáze a pravidelný sběr ELO.

## V3
Vlastní SVG emblémy pro FACEIT levely 1–10, barevně odlišené animace všech ranků, výraznější animace aktivního ranku a podpora omezeného pohybu.

V5: Official circular levels 1–10 and Challenger reference badge. Browser-local observed Elo changes only, polling every 90 seconds while profile is open. No historical backfill; Challenger status not automatically verified.
