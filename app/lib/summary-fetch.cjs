const {cachedFetch}=require('./api-cache.cjs');
async function getSummary(id){
 try {const r=await cachedFetch('https://www.faceit.com/api/statistics/v1/cs2/matches/'+encodeURIComponent(id)+'/scoreboard-summary?statsType=2',{headers:{Accept:'application/json'},redirect:'error',signal:AbortSignal.timeout(6000)});if(!r.ok)return {status:r.status};const summary=await r.json();if(summary?.payload?.id!==id)return {status:'invalid payload'};return {status:200,summary};}catch{return {status:'network or JSON error'};}
}
module.exports={getSummary};
