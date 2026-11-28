import {NextResponse} from 'next/server';
export const dynamic='force-dynamic';
export const maxDuration=60;
export async function GET(req){
 const q=new URL(req.url).searchParams,a=q.get('id'),b=q.get('mate'),days=Number(q.get('days'));
 if(![a,b].every(x=>x&&/^[a-f0-9-]{36}$/i.test(x))||a===b||![30,90,365].includes(days))return NextResponse.json({error:'Neplatné parametry.'},{status:400});
 if(!process.env.FACEIT_API_KEY)return NextResponse.json({error:'FACEIT API není nastaveno.'},{status:503});
 const get=async path=>{const r=await fetch('https://open.faceit.com/data/v4'+path,{headers:{Authorization:'Bearer '+process.env.FACEIT_API_KEY},next:{revalidate:180},signal:AbortSignal.timeout(6000)});if(!r.ok)throw Error('FACEIT API '+r.status);return r.json()};
 const to=Math.floor(Date.now()/1000),from=to-days*86400;
 async function history(id){const map=new Map();let partial=false;for(let offset=0;offset<500;offset+=100){try{const {items}=await get(`/players/${id}/history?game=cs2&from=${from}&to=${to}&offset=${offset}&limit=100`);if(!Array.isArray(items))throw Error('Neplatná historie');for(const m of items)if(m.match_id)map.set(m.match_id,m);if(items.length<100)break;if(offset===400)partial=true;}catch(e){if(!map.size)throw e;partial=true;break;}}return {map,partial};}
 try{const [x,y]=await Promise.all([history(a),history(b)]);const common=[...x.map.values()].filter(m=>y.map.has(m.match_id));let matches=0,wins=0,last=0,unknown=0,opponents=0;const locate=(m,id)=>Object.entries(m.teams||{}).find(([,t])=>[...(t.roster||[]),...(t.players||[])].some(p=>(p.player_id||p.id)===id))?.[0];
 for(const m of common){const n=y.map.get(m.match_id);let ta=locate(m,a)||locate(n,a),tb=locate(m,b)||locate(n,b),winner=m.results?.winner||n.results?.winner;if(!ta||!tb||!winner){unknown++;continue;}if(ta!==tb){opponents++;continue;}if(!Object.keys(m.teams||n.teams||{}).includes(winner)){unknown++;continue;}matches++;wins+=Number(ta===winner);last=Math.max(last,m.finished_at||n.finished_at||0);}
 return NextResponse.json({matches,wins,losses:matches-wins,rate:matches?Math.round(wins/matches*100):null,last,partial:x.partial||y.partial||unknown>0,unknown,opponents,common:common.length});
 }catch(e){return NextResponse.json({error:'Porovnání historie selhalo: '+e.message},{status:502});}
}
