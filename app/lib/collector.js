import {db} from './elo';
export async function capture(p, history){
 const id=p.player_id, elo=p.games?.cs2?.faceit_elo;
 if(!id||!Number.isInteger(elo))return;
 const latest=history.items?.[0]; const match=latest?.stats?.['Match Id']||latest?.match_id||'';
 const sql=db();
 await sql`CREATE TABLE IF NOT EXISTS frag_elo_samples (player_id text NOT NULL, observed_at timestamptz NOT NULL DEFAULT now(), elo integer NOT NULL, level integer, latest_match text NOT NULL, PRIMARY KEY(player_id,observed_at))`;
 await sql`INSERT INTO frag_elo_samples(player_id,elo,level,latest_match) SELECT ${id},${elo},${p.games?.cs2?.skill_level??null},${match} WHERE NOT EXISTS (SELECT 1 FROM frag_elo_samples WHERE player_id=${id} AND observed_at>now()-interval '5 minutes' AND elo=${elo} AND latest_match=${match}) ON CONFLICT DO NOTHING`;
}
