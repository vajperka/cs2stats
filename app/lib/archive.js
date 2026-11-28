import {db} from './elo';
export async function archive(id){const sql=db();try{return await sql`SELECT observed_at,elo,level,latest_match FROM frag_elo_samples WHERE player_id=${id} ORDER BY observed_at DESC LIMIT 500`}catch(e){if(e.code==='42P01')return [];throw e}}
