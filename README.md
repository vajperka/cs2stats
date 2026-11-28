# FRAG//INDEX
Next.js App Router. Node 20+. `npm install`, copy `.env.example` to `.env.local`, set FACEIT_API_KEY, `npm run dev`. Deploy by importing repository in Vercel, set FACEIT_API_KEY in Project Settings > Environment Variables, redeploy. Demo at /profile/demo. No registration. Key is server-only. Live data not verified without key. ELO history, per-match ELO changes and weapon stats are shown only when available; additional historical data provider or demo parsing is needed. Artwork cropped from approved concepts; responsive UI is implemented in CSS, not a screenshot. No database required for current API lookup.

V2: animované vlastní SVG ranky 1–20 (11–20 nejsou oficiální FACEIT levely), plnošířkové pozadí, ELO změna pouze z dostupných hodnot API. Pokud FACEIT neposkytne historii ELO, změna zůstává nedostupná. Pro spolehlivé budoucí sledování je potřeba persistentní databáze a pravidelný sběr ELO.

## V3
Vlastní SVG emblémy pro FACEIT levely 1–10, barevně odlišené animace všech ranků, výraznější animace aktivního ranku a podpora omezeného pohybu.

V5: Official circular levels 1–10 and Challenger reference badge. Browser-local observed Elo changes only, polling every 90 seconds while profile is open. No historical backfill; Challenger status not automatically verified.

## V6 – Neon
Set DATABASE_URL (or POSTGRES_URL) and FACEIT_API_KEY in Vercel. Tables frag_players, frag_elo_history and frag_match_elo are created on first profile request. No existing tables are deleted. The first observation establishes a baseline. Only a single newly visible match with changed Elo is attributed; observations are not official match Elo and can be affected by adjustments. Historical gaps remain unknown. Open profiles refresh every 90 seconds. Optional protected GET /api/cron checks up to 10 tracked players; configure CRON_SECRET and a scheduler compatible with your Vercel plan. No schedule is enabled by default. Live database and build not tested.

V8: Experimental read-only ELO diagnostics: /api/elo-probe?nick=vajperka . No historical data is imported until response semantics are verified.

## V10
Skóre z pohledu hráče, čas Europe/Prague, K/D/A, K/R, MVP, multikilly a barevné metriky. Historické ELO bez zdroje zůstává nedostupné; neoficiální endpointy v diagnostice vrátily 403.

## V11
Scoreboard využívá oficiální match stats a match details. ELO: interní endpoint vrací 403; přesné starší hodnoty nejsou dostupné. Pro průběžné sledování nastav CRON_SECRET ve Vercelu a autorizovaný plánovač GET /api/cron (Bearer CRON_SECRET), ideálně každou minutu, pokud tarif dovolí. Bez plánovače zůstává kontrola při otevřeném profilu. Pozorované změny nejsou ověřená historická data a při více zápasech mezi kontrolami se nerozpočítávají.

## V12
Set WOK_API_KEY in Vercel (same key as old CS2STATS). WOK history is joined by match ID; missing values remain unavailable. FACEIT scoreboard-summary is optional and may reject server requests. No database migration required. Live provider access not verified.

## V14
Responsive rank grid without scrollbar; distinct motion presets for all FACEIT ranks and Challenger.

## V15
Distinct CSS effects for every FACEIT rank; no API changes.

## Friends League V16
Public `/league` page. Set `LEAGUE_JOIN_CODE` to a private shared code in Vercel to allow adding members without accounts. Existing DATABASE_URL and FACEIT_API_KEY are used. Monthly seasons use UTC. Baseline is first successful observation in the month (or at joining); no retroactive history. Refresh on page visit and every two minutes while open; no background scheduler. Previous season scores remain in the database. No deletion UI. Maximum 30 members.

## V17 – správa sezóny
Nastavte samostatný silný náhodný `LEAGUE_ADMIN_CODE` ve Vercelu (jiný než LEAGUE_JOIN_CODE). V /league otevřete Administrace, vyberte konec v místním čase a uložte. Termín je uložen v nové tabulce frag_league_schedule; skóre zůstává pod původním ID. Ručně nastavená sezóna po konci zůstává zobrazena, automatická další sezóna se nezakládá. Výsledky se přestanou aktualizovat po konci; poslední zaznamenané ELO nemusí odpovídat přesně okamžiku konce. Ukončenou sezónu nelze prodloužit.

## V19 Performance Lab
Profile tab: custom rating, recent match records, map analysis, calendar (only confirmed match deltas), manual matchroom lookup and uncalibrated ELO estimate. Existing league unchanged. Discord delivery, background match archival, season Wrapped and automatic live detection are not included in this release. Live API requires deployment verification.

## V21
Interactive ELO chart with hover, touch and keyboard points. Missing per-match changes remain unknown.

## V23
Map previews: Valve game assets via https://github.com/MurkyYT/cs2-map-icons (remote images; fallback to unnumbered thumbnail, then map icon, then neutral placeholder). Artwork belongs to Valve and respective creators.

## V24
Profile DNA, recent form, observed peak, next-level progress, daily league snapshots, season race, ELO comparison, ELO King and historical season winners. Daily snapshots begin at deployment; no historical interpolation. Other awards and match-level league analytics require persistent match ingestion. No new environment variables.

V27: profile trophies derived from completed league seasons by FACEIT player ID; tied leaders share the award. No new environment variables.

## V29
Redesigned landing only: responsive hero, existing operator artwork, feature cards, Friends League CTA, scoped animations.

V31: Compact Match Room next to ELO History; responsive single column on smaller screens.

V41: Recent Form – green wins, red losses, consistent tile sizing.

## V44
Redesigned profile map performance sidebar; existing MapArt images retained. Overall winrate weighted by match count.
