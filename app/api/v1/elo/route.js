import {db} from '../../../lib/elo';
export const dynamic='force-dynamic';
export async function GET(req){
 const id=new URL(req.url).searchParams.get('id');
 if(!id||!/^[a-zA-Z0-9-]{1,80}$/.test(id))return Response.json({error:'Invalid player id'},{status:400});
 try{const sql=db();const rows=await sql`SELECT observed_at,elo,level,latest_match FROM frag_elo_samples WHERE player_id=${id} ORDER BY observed_at DESC LIMIT 500`;return Response.json({source:'FACEIT observed snapshots',player_id:id,items:rows.reverse()},{headers:{'Cache-Control':'public, s-maxage=60'}})}catch(e){if(e.code==='42P01')return Response.json({source:'FACEIT observed snapshots',player_id:id,items:[]});return Response.json({error:'Archive unavailable'},{status:503})}
}
