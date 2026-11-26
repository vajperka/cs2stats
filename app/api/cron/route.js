import {db,init,observe} from '../../lib/elo';
export const dynamic='force-dynamic';
export async function GET(req){
 if(!process.env.CRON_SECRET||req.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)return Response.json({error:'Unauthorized'},{status:401});
 const sql=db();await init(sql);const players=await sql`SELECT player_id FROM frag_players ORDER BY updated_at ASC LIMIT 10`;
 const get=async path=>{const r=await fetch('https://open.faceit.com/data/v4'+path,{headers:{Authorization:'Bearer '+process.env.FACEIT_API_KEY},cache:'no-store'});if(!r.ok)throw Error('FACEIT '+r.status);return r.json()};
 let ok=0;for(const row of players){try{const id=encodeURIComponent(row.player_id);const [p,h]=await Promise.all([get('/players/'+id),get('/players/'+id+'/games/cs2/stats?limit=30')]);await observe(p,h);await sql`UPDATE frag_players SET updated_at=now() WHERE player_id=${row.player_id}`;ok++}catch(e){console.error('Cron tracking failed',e.name)}}return Response.json({checked:players.length,ok});
}
