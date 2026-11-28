import {capture} from '../../lib/collector';
import {db,init} from '../../lib/elo';
export const maxDuration=60;
export const dynamic='force-dynamic';
export async function GET(req){
 if(!process.env.CRON_SECRET||req.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)return Response.json({error:'Unauthorized'},{status:401});
 const sql=db();await init(sql);await sql`ALTER TABLE frag_players ADD COLUMN IF NOT EXISTS collector_checked_at timestamptz`; const players=await sql`SELECT player_id FROM frag_players ORDER BY collector_checked_at ASC NULLS FIRST,player_id LIMIT 10`;
 const get=async path=>{const r=await fetch('https://open.faceit.com/data/v4'+path,{headers:{Authorization:'Bearer '+process.env.FACEIT_API_KEY},cache:'no-store',signal:AbortSignal.timeout(5000)});if(r.headers.has('x-frag-cache'))throw Error('Cached data cannot be observed');if(!r.ok)throw Error('FACEIT '+r.status);return r.json()};
 let ok=0,checked=0;const start=Date.now();for(let i=0;i<players.length&&Date.now()-start<40000;i+=5){await Promise.all(players.slice(i,i+5).map(async row=>{checked++;try{const id=encodeURIComponent(row.player_id);const [p,h]=await Promise.all([get('/players/'+id),get('/players/'+id+'/games/cs2/stats?limit=30')]);if(!Number.isInteger(p.games?.cs2?.faceit_elo))throw Error("Missing ELO");await capture(p,h);await sql`UPDATE frag_players SET collector_checked_at=now() WHERE player_id=${row.player_id}`;ok++}catch(e){await sql`UPDATE frag_players SET collector_checked_at=now() WHERE player_id=${row.player_id}`;console.error('Cron tracking failed',e.name)}}));}return Response.json({checked,ok});
}
