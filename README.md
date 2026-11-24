# CS2STATS V5
Nahraj obsah archivu do kořene GitHub repozitáře. Vercel: Other, output public, bez build command. Nastav serverovou proměnnou FACEIT_API_KEY a redeploy. Statické HTML/CSS/JS + Node serverless API. Profil, statistiky, mapy a zápasy čerpají z FACEIT. Chybějící hodnoty jsou označeny —. Graf je průběžná winrate, nikoli historické ELO. Premier, Steam login, radar dovedností, klipy a premium platby nejsou implementovány. Sledování je lokální v prohlížeči. Banner je výřez dekorativní grafiky z dodaného návrhu. Živé API nebylo testováno s klíčem. 

V6: Premier ruční import výsledku a ratingu (lokální úložiště podle FACEIT ID); žádné automatické Valve napojení. FACEIT ELO graf používá pouze dostupné hodnoty z API, jinak aktuální ELO. Náhledy pěti map jsou výřezy schváleného konceptu, nikoli oficiální screenshoty. Radar zobrazuje dostupné metriky, ostatní zůstávají prázdné. 

V7: Skutečné ELO se ukládá při otevření profilu do localStorage. Historické hodnoty před prvním měřením nejsou garantovány.

## V8 – WOK ELO
Nastav WOK_API_KEY ve Vercelu, ponech FACEIT_API_KEY. Posledních 20 zápasů se páruje podle match_id. Chybějící hodnoty se neodhadují. Cache 5 minut není trvalá a limit WOK platí i pro jeho vlastní cache.
