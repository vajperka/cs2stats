# CS2STATS V5
Nahraj obsah archivu do kořene GitHub repozitáře. Vercel: Other, output public, bez build command. Nastav serverovou proměnnou FACEIT_API_KEY a redeploy. Statické HTML/CSS/JS + Node serverless API. Profil, statistiky, mapy a zápasy čerpají z FACEIT. Chybějící hodnoty jsou označeny —. Graf je průběžná winrate, nikoli historické ELO. Premier, Steam login, radar dovedností, klipy a premium platby nejsou implementovány. Sledování je lokální v prohlížeči. Banner je výřez dekorativní grafiky z dodaného návrhu. Živé API nebylo testováno s klíčem. 

V6: Premier ruční import výsledku a ratingu (lokální úložiště podle FACEIT ID); žádné automatické Valve napojení. FACEIT ELO graf používá pouze dostupné hodnoty z API, jinak aktuální ELO. Náhledy pěti map jsou výřezy schváleného konceptu, nikoli oficiální screenshoty. Radar zobrazuje dostupné metriky, ostatní zůstávají prázdné. 

V7: Skutečné ELO se ukládá při otevření profilu do localStorage. Historické hodnoty před prvním měřením nejsou garantovány.

## V8 – WOK ELO
Nastav WOK_API_KEY ve Vercelu, ponech FACEIT_API_KEY. Posledních 20 zápasů se páruje podle match_id. Chybějící hodnoty se neodhadují. Cache 5 minut není trvalá a limit WOK platí i pro jeho vlastní cache.

V10: Neon dashboard; FACEIT CDN level icons with numeric fallback. External icon URLs not verified. Existing API unchanged.

## V11 — Steam Match Sharing
WOK dokumentace neobsahuje Premier historii. Nové tlačítko Import ze Steamu načítá až 10 dalších kódů přes oficiální Steam GetNextMatchSharingCode. Nastav STEAM_API_KEY (https://steamcommunity.com/dev/apikey). Autorizační kód se neukládá; match kódy zůstávají lokálně. Kódy samy neobsahují skóre, režim ani rating; automatická analýza dem a Steam login nejsou implementovány. Ruční Premier import zůstává. Živé API nebylo testováno.

## V12 — přípravná integrace Neon a offline analýzy
1. V Neon SQL Editor spusť worker/schema.sql.
2. Ve Vercelu přidej DATABASE_URL (Neon connection string), ponech ostatní klíče. Redeploy; instalace npm závislostí je nutná.
3. Import ze Steamu nyní ukládá nové ověřené kódy do databázové fronty. Autorizační kód se neukládá. Existující lokální kódy se nemigrují.
4. Lokální experimentální analyzátor: Python 3, pip install -r worker/requirements.txt, python worker/analyze.py zapas.dem STEAMID64. Používej pouze důvěryhodné soubory. Výstup je JSON s počty událostí, nikoli ověřený scoreboard. Neurčuje Premier režim ani rating. 
5. Automatické získávání dem přes Game Coordinator, běžící worker, zápis výsledků do DB a zobrazení automatických statistik nejsou implementovány. Offline analyzátor není propojen s frontou. Nebyl testován na skutečném demu. API nebylo testováno s živými klíči.

## V13 — ukládání analýzy dem
Spusť worker/migrate-v13.sql v Neon SQL Editoru. Nahraj projekt na GitHub a redeploy. Na důvěryhodném počítači nainstaluj Python závislosti: `pip install -r worker/requirements.txt`. Nastav DATABASE_URL jako lokální proměnnou prostředí (nikdy do GitHubu). Po importu Steam kódů stáhni odpovídající demo ručně a spusť `python worker/process_demo.py zapas.dem STEAMID64 CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx`. Správce musí ověřit, že demo odpovídá kódu. Výsledek se uloží do existující fronty. Tlačítko Analýza Steam zápasů zobrazí posledních 50 položek, počty čekajících a analyzované K/D/A a HS. Tyto agregáty jsou veřejné podle SteamID; autorizační a sdílecí kódy se nezobrazují. Automatické stahování, trvalý worker, ověření režimu Premier, rating a integrace do hlavního grafu nejsou implementovány. Živé testy vyžadují skutečné demo a databázi.

## V14 – Leetify
Optional server-side `LEETIFY_API_KEY` from https://leetify.com/app/developer . Premier rating is fetched by FACEIT-linked SteamID64. History only includes matchmaking entries with rank_type 11 and positive rating. No synthetic ratings. Private or unavailable profiles may have no data. Existing database schema unchanged. Official attribution logo still needs to be added according to https://leetify.com/blog/leetify-api-developer-guidelines/ before public release.

## V15
Dashboard CSS, local illustrated map thumbnails (not game screenshots), accessible reduced motion, Premier credit outside rating, local FACEIT-style fallback. No database migration.

## V17
Map assets: Valve game files via https://github.com/MurkyYT/cs2-map-icons . Run npm run maps:sync before deployment to cache PNGs locally. If unavailable the UI tries repository URLs. Assets remain property of Valve; review usage rights.

## V18
Detail zápasu: řazení podle ratingu pouze pokud jej API poskytne všem hráčům, jinak výchozí abecední pořadí s upozorněním. Přidáno volitelné řazení a odkaz na FACEIT.

## V19
Redesigned match detail. Real FACEIT ratings only; missing ratings use clearly labeled kills ordering. Avatars use official match metadata when available.

## V20
FACEIT scoreboard-summary integration, player ID join, match-wide single-map ratings. Public endpoint availability on Vercel not verified. No new keys.

## V21
Supports camelCase and snake_case scoreboard fields. If server receives 403, open the JSON link in your browser and paste the response into the match detail. Import is session-memory only, not shared or persisted; no credentials needed. Server-side 403 remains unresolved.

## V22
Saved FACEIT scoreboard fallback for match 1-a7c4186e-7572-4f8a-8a3f-a013766add6d only. Other matches still require live access or manual import.

## V23
Automatický serverový pokus a následný přímý anonymní požadavek z prohlížeče. Pokud FACEIT nepovolí CORS nebo vrátí 403, rating zůstane nedostupný. Bez proxy či obcházení ochrany. Ruční formulář odstraněn. WOK cache 15 sekund, profil bez CDN cache. Nulové ELO a nepotvrzené nulové změny jsou zobrazeny jako nedostupné; skutečná nula z detailního scoreboardu je zachována. Po otevření detailu se dostupná změna promítne do historie. Živé API nebylo ověřeno.

## V24
Radar používá skutečné dostupné statistiky z posledních zápasů. Chybějící údaje zůstávají prázdné. Volitelný Chrome/Edge doplněk v `extension/` načítá scoreboard při návštěvě oficiální stránky FACEIT a ukládá jej lokálně; následné otevření detailu na CS2STATS jej načte automaticky. Instalace: chrome://extensions, režim vývojáře, načíst rozbalené, vybrat extension. Podporované domény jsou v manifest.json a background.js; pro vlastní doménu uprav obě. Doplněk neposílá cookies ani tokeny. Neřeší serverovou 403 pro všechny návštěvníky. 

## V25
MVP is read from the actual scoreboard MVP player ID, not inferred from kills. No browser extension is required. If FACEIT returns 403, official rating and MVP remain unavailable. The radar substitutes explicitly labeled available metrics for missing axes. Live server access is not verified.

## V26 ELO
Automatic bounded refresh while profile is visible (up to five attempts); missing ELO is not estimated. Live WOK availability not tested.

## V27 – diagnostika FACEIT OAuth
Po nasazení otevřete `/api/auth/faceit/start`, potvrďte přístup a zkontrolujte JSON výsledku. Test používá PKCE a state, token neukládá ani nevypisuje. Volitelný FACEIT_CLIENT_SECRET nastavte pouze pokud jej FACEIT pro klienta vydal. Test nezaručuje přístup k interním statistikám a zatím nemění veřejnou synchronizaci ani databázi.

## V29 – anonymous scoreboard diagnostic
Based on V27, no local worker required for FACEIT rating. `/api/scoreboard-test` checks the newly supplied match without OAuth or cookies. HTTP 403 means server access remains unavailable. No new environment variables. Utility is not present in this summary. No persistent cache added in this diagnostic release.

## V32
Cinematic landing and profile redesign. Public nickname lookup; no account registration or login. Landing preview numbers are illustrative. Existing player and match APIs are unchanged. Artwork is cropped from the approved concept; no new external service is required. Original FACEIT rating remains subject to API availability.
