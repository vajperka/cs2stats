import {db,init} from '../../../lib/elo';
import {capture} from '../../../lib/collector';
export const dynamic='force-dynamic';
export const maxDuration=60;
export async function POST(req){
 if(!process.env.FACEIT_WEBHOOK_SECRET||req.headers.get('x-frag-secret')!==process.env.FACEIT_WEBHOOK_SECRET)return Response.json({error:'Unauthorized'},{status:401});
 let event;try{event=await req.json()}catch{return Response.json({error:'Invalid JSON'},{status:400})}
 if(event.event!=='match_status_finished'&&event.event_type!=='match_status_finished')return Response.json({ignored:true});
 const id=event.payload?.id||event.payload?.match_id;if(typeof id!=='string'||!/^[\w-]{1,100}$/.test(id))return Response.json({error:'Missing match id'},{status:400});
 const get=async path=>{const r=await fetch('https://open.faceit.com/data/v4'+path,{headers:{Authorization:'Bearer '+process.env.FACEIT_API_KEY},cache:'no-store',signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error('FACEIT '+r.status);return r.json()};
 try{const match=await get('/matches/'+encodeURIComponent(id));if(match.game!=='cs2')return Response.json({ignored:true});const ids=[...new Set(Object.values(match.teams||{}).flatMap(t=>(t.roster||[]).map(p=>p.player_id)).filter(Boolean))];const sql=db();await init(sql);const tracked=await sql`SELECT player_id FROM frag_players WHERE player_id=ANY(${ids}::text[])`;const results=await Promise.allSettled(tracked.map(async ({player_id})=>{const p=await get('/players/'+encodeURIComponent(player_id));await capture(p,{items:[]});}));return Response.json({checked:tracked.length,ok:results.filter(r=>r.status==='fulfilled').length},{status:results.some(r=>r.status==='rejected')?503:200});}catch{return Response.json({error:'Collection failed'},{status:503})}
}
