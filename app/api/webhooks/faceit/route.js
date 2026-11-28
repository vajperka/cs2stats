import {db,init} from '../../../lib/elo';
import {capture} from '../../../lib/collector';
import {initMatchCapture,latestId} from '../../../lib/match-capture';
export const dynamic='force-dynamic';
export const maxDuration=60;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
export async function POST(req){
 if(!process.env.FACEIT_WEBHOOK_SECRET||req.headers.get('x-frag-secret')!==process.env.FACEIT_WEBHOOK_SECRET)return Response.json({error:'Unauthorized'},{status:401});
 let event;try{event=await req.json()}catch{return Response.json({error:'Invalid JSON'},{status:400})}
 const type=event.event||event.event_type;if(!['match_status_created','match_status_finished'].includes(type))return Response.json({ignored:true});
 const id=event.payload?.id||event.payload?.match_id;if(typeof id!=='string'||!/^[\w-]{1,100}$/.test(id))return Response.json({error:'Missing match id'},{status:400});
 const get=async path=>{const r=await fetch('https://open.faceit.com/data/v4'+path,{headers:{Authorization:'Bearer '+process.env.FACEIT_API_KEY},cache:'no-store',signal:AbortSignal.timeout(5000)});if(!r.ok)throw Error('FACEIT '+r.status);return r.json()};
 const load=async id=>Promise.all([get('/players/'+encodeURIComponent(id)),get('/players/'+encodeURIComponent(id)+'/games/cs2/stats?limit=30')]);
 try{const match=await get('/matches/'+encodeURIComponent(id));if(match.game!=='cs2')return Response.json({ignored:true});const ids=[...new Set(Object.values(match.teams||{}).flatMap(t=>(t.roster||[]).map(p=>p.player_id)).filter(Boolean))];const sql=db();await init(sql);await initMatchCapture(sql);const tracked=await sql`SELECT player_id FROM frag_players WHERE player_id=ANY(${ids}::text[])`;
 const results=await Promise.allSettled(tracked.map(async ({player_id})=>{
 if(type==='match_status_created'){
 if(match.finished_at||['FINISHED','CANCELLED','ABORTED','ONGOING'].includes(String(match.status).toUpperCase()))return false;
 const [p,h]=await load(player_id);const elo=p.games?.cs2?.faceit_elo,prev=latestId(h);if(!Number.isInteger(elo)||!prev||prev===id)return false;
 await sql`INSERT INTO frag_match_capture(player_id,match_id,before_elo,previous_match) VALUES(${player_id},${id},${elo},${prev}) ON CONFLICT DO NOTHING`;return true;
 }
 const [base]=await sql`SELECT * FROM frag_match_capture WHERE player_id=${player_id} AND match_id=${id}`;
 if(base?.after_elo!=null)return true;
 // Old replay events may archive current observations, never assign a historical delta.
 const finished=Number(match.finished_at)*1000;const fresh=Number.isFinite(finished)&&finished>0&&Date.now()-finished<300000&&Date.now()>=finished;
 for(const delay of (base&&fresh?[0,8000,12000]:[0])){if(delay)await wait(delay);const [p,h]=await load(player_id);await capture(p,h);const elo=p.games?.cs2?.faceit_elo;const prev=h.items?.[1]?.stats?.['Match Id']||h.items?.[1]?.match_id;
 if(base&&fresh&&Date.parse(base.created_at)<finished&&latestId(h)===id&&prev===base.previous_match&&Number.isInteger(elo)&&elo!==base.before_elo){await sql`UPDATE frag_match_capture SET after_elo=${elo},finished_at=to_timestamp(${finished}/1000.0) WHERE player_id=${player_id} AND match_id=${id} AND after_elo IS NULL`;return true;}
 }return false;
 }));return Response.json({checked:tracked.length,ok:results.filter(r=>r.status==='fulfilled').length,paired:results.filter(r=>r.status==='fulfilled'&&r.value).length},{status:results.some(r=>r.status==='rejected')?503:200});}catch{return Response.json({error:'Collection failed'},{status:503})}
}
