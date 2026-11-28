import {db} from './elo';
export async function initMatchCapture(sql){
 await sql`CREATE TABLE IF NOT EXISTS frag_match_capture (player_id text NOT NULL,match_id text NOT NULL,before_elo integer NOT NULL,previous_match text NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),after_elo integer,finished_at timestamptz,PRIMARY KEY(player_id,match_id))`;
}
export const latestId=h=>h.items?.[0]?.stats?.['Match Id']||h.items?.[0]?.match_id||'';
export async function matchCapture(id){const sql=db();await initMatchCapture(sql);return await sql`SELECT match_id,after_elo AS elo,after_elo-before_elo AS delta FROM frag_match_capture WHERE player_id=${id} AND after_elo IS NOT NULL`;}
