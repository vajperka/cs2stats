export default {async scheduled(controller,env,ctx){ctx.waitUntil(collect(env));}};
export async function collect(env){
 if(!env.CRON_SECRET)throw Error('Missing CRON_SECRET');
 const r=await fetch('https://cs2stats-cz.vercel.app/api/cron',{headers:{Authorization:`Bearer ${env.CRON_SECRET}`},redirect:'error'});
 if(!r.ok)throw Error(`Collector HTTP ${r.status}`);
 const result=await r.json();console.log('FRAG collection',result.checked,result.ok);
 if(result.checked!==result.ok)throw Error('Partial collection failure');
 return result;
}
