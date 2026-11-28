import faceit from '../../lib/faceit-history.cjs';
export const dynamic='force-dynamic';
export async function GET(req){const id=new URL(req.url).searchParams.get('id')||'';if(!/^[a-f0-9-]{36}$/i.test(id))return Response.json({error:'Invalid player ID'},{status:400});const result=await faceit.fetchHistory(id,{pages:1});return Response.json({status:result.status,verified:result.items.length,latest:result.items[0]||null});}
