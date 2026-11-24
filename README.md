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
