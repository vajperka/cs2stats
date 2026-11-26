import {neon} from '@neondatabase/serverless';
export const db=()=>neon(process.env.DATABASE_URL||process.env.POSTGRES_URL);
export async function init(sql){
 await sql`CREATE TABLE IF NOT EXISTS frag_players (player_id text PRIMARY KEY,nickname text NOT NULL,elo integer NOT NULL,latest_match text NOT NULL,updated_at timestamptz NOT NULL DEFAULT now())`;
 await sql`CREATE TABLE IF NOT EXISTS frag_elo_history (player_id text NOT NULL,match_id text NOT NULL,elo integer NOT NULL,observed_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(player_id,match_id))`;
 await sql`CREATE TABLE IF NOT EXISTS frag_match_elo (player_id text NOT NULL,match_id text NOT NULL,delta integer NOT NULL,PRIMARY KEY(player_id,match_id))`;
}
export async function observe(p,history){
 const sql=db(); await init(sql);
 const id=p.player_id, elo=p.games?.cs2?.faceit_elo, items=history.items||[], mid=x=>x?.stats?.['Match Id']||x?.match_id;
 const latest=mid(items[0]), previous=mid(items[1])||'';
 if(!id||!latest||!Number.isInteger(elo))return {changes:{},points:[]};
 // Atomic compare-and-update; only attribute a difference across exactly one visible match.
 await sql`WITH old AS (SELECT * FROM frag_players WHERE player_id=${id} FOR UPDATE), changed AS (UPDATE frag_players SET nickname=${p.nickname},elo=${elo},latest_match=${latest},updated_at=now() WHERE player_id=${id} AND latest_match<>${latest} AND elo<>${elo} AND latest_match=${previous} RETURNING player_id), delta AS (INSERT INTO frag_match_elo(player_id,match_id,delta) SELECT old.player_id,${latest},${elo}-old.elo FROM old JOIN changed USING(player_id) ON CONFLICT DO NOTHING RETURNING player_id) INSERT INTO frag_elo_history(player_id,match_id,elo) SELECT player_id,${latest},${elo} FROM changed ON CONFLICT DO NOTHING`;
 // Gaps establish a fresh baseline, never invent per-match deltas. Same-match changes are not attributed.
 await sql`INSERT INTO frag_players(player_id,nickname,elo,latest_match) VALUES(${id},${p.nickname},${elo},${latest}) ON CONFLICT(player_id) DO UPDATE SET nickname=excluded.nickname,elo=excluded.elo,latest_match=excluded.latest_match,updated_at=now() WHERE frag_players.latest_match<>excluded.latest_match AND frag_players.latest_match<>${previous}`;
 await sql`INSERT INTO frag_elo_history(player_id,match_id,elo) SELECT player_id,latest_match,elo FROM frag_players WHERE player_id=${id} AND latest_match=${latest} ON CONFLICT DO NOTHING`;
 const changes=await sql`SELECT match_id,delta FROM frag_match_elo WHERE player_id=${id}`;
 const points=await sql`SELECT match_id,elo,observed_at FROM frag_elo_history WHERE player_id=${id} ORDER BY observed_at DESC LIMIT 100`;
 return {changes:Object.fromEntries(changes.map(r=>[r.match_id,r.delta])),points:points.reverse()};
}
