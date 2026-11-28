import {Header} from '../ui';
export const metadata={title:'Changelog | FRAG//INDEX',description:'Historie aktualizací FRAG//INDEX'};
const releases=[
[70,"FRAG Data Engine · 28. 11. 2026",[["new","Samostatný archiv skutečných ELO snímků z FACEIT."],["ui","Chráněný sběr na pozadí bez spotřeby WOK tokenů; WOK historie zachována."]]],
[69,"Jednotné rozhraní · 28. 11. 2026",[["ui","Odstranění přepínače kompaktního a rozšířeného režimu. Zachováno výchozí rozložení webu."]]],
[68,"Zjednodušení navigace · 28. 11. 2026",[["ui","Odstranění stránky Stav systému, jejího odkazu v navigaci a samostatného stavového API. Ostatní funkce zůstávají zachovány."]]],
[67,"Player Comparison & UI · 28. 11. 2026",[["new","Porovnání hráčů, stav databáze a náhled uloženého profilu."],["ui","Mobilní menu, kompaktní režim, částice, návrat nahoru a chybové stránky."]]],
[66,'Changelog',[['new','Samostatná stránka s historií aktualizací a odkazem v navigaci.']]],
[65,'Recent Form',[['fix','Zarovnání hlavičky k hornímu okraji panelu.']]],
[64,'Kompaktní přehled',[['fix','Zmenšení výšky karet souhrnu výkonu.']]],
[63,'Recent Form redesign',[['ui','Nové pozadí, neonové efekty a rozložení výsledků.']]],
[62,'Souhrn výkonu',[['ui','Čtyři karty s minigrafy a porovnáním výkonu.']]],
[61,'Motion & UI',[['ui','Načítací obrazovka, animované statistiky a oznámení postupu na vyšší level.']]],
[60,'Nové pozadí',[['ui','Širokoúhlé pozadí hlavní stránky s plynulými přechody.']]],
[59,'Statistické karty',[['ui','Minigrafy a trendy výkonu podle dostupných zápasů.']]],
[58,'Match Timeline',[['new','Časová osa kol, pokud jsou skutečné výsledky kol dostupné.']]],
[57,'Databázový archiv',[['new','Trvalá cache získaných statistik a historie zápasů v Neonu.']]],
[56,'Jednotné nadpisy',[['fix','Kompaktní typografie a zarovnání hlaviček.']]],
[55,'Sjednocení designu',[['ui','Společné hlavičky statistických sekcí.']]],
[54,'WOK a Neon',[['fix','Návrat ke skutečným hodnotám ELO a jejich trvalé ukládání.']]],
[47,'Historie zápasů',[['ui','Přepracované zobrazení výsledků a statistik.']]],
[27,'Trofeje',[['new','Trofeje za dokončené sezóny Friends League.']]],
[24,'Analýza hráče',[['new','Player DNA, Recent Form a postup na další level.']]],
[21,'Graf ELO',[['ui','Interaktivní graf s ovládáním myší, dotykem a klávesnicí.']]],
[19,'Performance Lab',[['new','Analýza výkonu, rekordy a kalendář ELO.']]],
[16,'Friends League',[['new','Vlastní liga a sezónní soutěž o ELO.']]],
[12,'Historie ELO',[['new','Integrace WOK jako zdroje historického ELO.']]],
[11,'Match Center',[['new','Detail zápasu a statistiky obou týmů.']]],
[6,'Neon',[['new','Databázové sledování ELO.']]]
];
const labels={new:'Novinka',ui:'Vylepšení',fix:'Oprava'};
export default function Changelog(){return <div className="fi-home"><Header/><main className="cl-page"><div className="cl-hero"><div className="cl-kicker">FRAG//INDEX / DEVELOPMENT LOG</div><h1>Changelog<span>.</span></h1><p>Nové funkce, vylepšení a opravy na jednom místě.</p><div className="cl-current"><i/> Aktuální verze projektu <strong>V{releases[0][0]}</strong></div></div><div className="cl-list">{releases.map(([v,title,items],i)=><article className="cl-release" key={v}><div className="cl-version">V{v}</div><div className="cl-card"><div className="cl-heading"><h2>{title}</h2>{i===0&&<span className="cl-latest">NEJNOVĚJŠÍ</span>}</div>{items.map(([type,desc],j)=><div className="cl-entry" key={j}><span className={'cl-tag cl-'+type}>{labels[type]}</span><span>{desc}</span></div>)}</div></article>)}</div><p className="cl-note">Přehled vybraných vydání projektu. Neobsahuje všechny interní meziverze.</p></main></div>}
