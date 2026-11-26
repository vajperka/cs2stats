export const dynamic='force-dynamic';
export const maxDuration=30;
export async function GET(req){
 const nick=new URL(req.url).searchParams.get('nick')||'vajperka';
 if(!/^[a-zA-Z0-9_-]{1,40}$/.test(nick))return Response.json({error:'Invalid nickname'},{status:400});
 try{
 const key=process.env.FACEIT_API_KEY;if(!key)return Response.json({error:'Missing FACEIT_API_KEY'},{status:503});
 const get=async(path)=>{const r=await fetch('https://open.faceit.com/data/v4'+path,{headers:{Authorization:'Bearer '+key},cache:'no-store',signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error('Official API HTTP '+r.status);return r.json()};
 const p=await get('/players?nickname='+encodeURIComponent(nick));const id=encodeURIComponent(p.player_id);
 const h=await get('/players/'+id+'/games/cs2/stats?limit=5');
 const urls=[`https://api.faceit.com/stats/v1/stats/time/users/${id}/games/cs2?size=5`,`https://api.faceit.com/stats/v1/stats/time/users/${id}/games/cs2?game_mode=5v5&size=5`];
 const probes=await Promise.all(urls.map(async url=>{try{const r=await fetch(url,{headers:{Accept:'application/json'},cache:'no-store',signal:AbortSignal.timeout(8000),redirect:'error'});const contentType=r.headers.get('content-type');if(!r.ok||!contentType?.includes('json'))return {url,status:r.status,contentType};const data=await r.json();return {url,status:r.status,sample:Array.isArray(data)?data.slice(0,3):data};}catch(e){return {url,error:e.name}}}));
 return Response.json({nickname:p.nickname,currentElo:p.games?.cs2?.faceit_elo,officialSamples:h.items?.slice(0,3),probes},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return Response.json({error:e.message},{status:502})}
}
