module.exports=async(req,res)=>{
 const id=req.query.steamid;
 if(typeof id!=='string'||!/^\d{17}$/.test(id))return res.status(400).json({error:'Neplatné SteamID64.'});
 if(req.method!=='GET')return res.status(405).end();
 try{
 const headers={Accept:'application/json'};if(process.env.LEETIFY_API_KEY)headers._leetify_key=process.env.LEETIFY_API_KEY;
 const r=await fetch('https://api-public.cs-prod.leetify.com/v3/profile?steam64_id='+id,{headers,signal:AbortSignal.timeout(10000)});
 if(!r.ok)return res.status(r.status===404?404:r.status===429?429:502).json({error:r.status===404?'Leetify nemá dostupný profil hráče.':r.status===429?'Dočasný limit Leetify API.':'Leetify API: HTTP '+r.status});
 const p=await r.json();const rating=Number.isFinite(p.ranks?.premier)&&p.ranks.premier>0?p.ranks.premier:null;
 const matches=(Array.isArray(p.recent_matches)?p.recent_matches:[]).filter(m=>m.data_source==='matchmaking'&&Number(m.rank_type)===11&&Number.isFinite(m.rank)&&m.rank>0&&Number.isFinite(Date.parse(m.finished_at))).map(m=>({date:Date.parse(m.finished_at),rating:m.rank})).sort((a,b)=>a.date-b.date);
 res.setHeader('Cache-Control','public, s-maxage=120');return res.json({rating,matches,source:'Leetify'});
 }catch{return res.status(502).json({error:'Leetify je momentálně nedostupné.'});}
};
