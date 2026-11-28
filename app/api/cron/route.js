import apiCache from '../../lib/api-cache.cjs';
import {capture} from '../../lib/collector';
import {db,init,observe} from '../../lib/elo';
export const maxDuration=60;
export const dynamic='force-dynamic';
export async function GET(req){
 if(!process.env.CRON_SECRET||req.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)return Response.json({error:'Unauthorized'},{status:401});
 const sql=db();await init(sql);const players=await sql`SELECT player_id FROM frag_players ORDER BY updated_at ASC LIMIT 5`;
 const get=async path=>{const r=await fetch('https://open.faceit.com/data/v4'+path,{headers:{Authorization:'Bearer '+process.env.FACEIT_API_KEY},cache:'no-store',signal:AbortSignal.timeout(5000)});if(r.headers.has('x-frag-cache'))throw Error('Cached data cannot be observed');if(!r.ok)throw Error('FACEIT '+r.status);return r.json()};
 let ok=0;for(const row of players){try{const id=encodeURIComponent(row.player_id);const [p,h]=await Promise.all([get('/players/'+id),get('/players/'+id+'/games/cs2/stats?limit=30')]);await observe(p,h);await capture(p,h);await sql`UPDATE frag_players SET updated_at=now() WHERE player_id=${row.player_id}`;ok++}catch(e){console.error('Cron tracking failed',e.name)}}return Response.json({checked:players.length,ok});
}
