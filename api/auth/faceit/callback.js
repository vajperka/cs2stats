const crypto=require('node:crypto');
const matchId='1-a7c4186e-7572-4f8a-8a3f-a013766add6d';
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('Set-Cookie','faceit_test=; Path=/api/auth/faceit; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
 if(req.method!=='GET')return res.status(405).end();
 const cookie=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('faceit_test='))?.slice(12)||'';
 const [state,verifier]=cookie.split('.'); const code=req.query.code, returned=req.query.state;
 if(typeof code!=='string'||typeof returned!=='string'||!state||!verifier||state.length!==returned.length||!crypto.timingSafeEqual(Buffer.from(state),Buffer.from(returned)))return res.status(400).json({stage:'authorization',error:'Autorizace zamítnuta nebo neplatný state. Spusť test znovu.'});
 const {FACEIT_CLIENT_ID:id,FACEIT_CLIENT_SECRET:secret,FACEIT_REDIRECT_URI:redirect}=process.env;
 try{
 const headers={'Content-Type':'application/x-www-form-urlencoded',Accept:'application/json'};
 if(secret)headers.Authorization='Basic '+Buffer.from(id+':'+secret).toString('base64');
 const token=await fetch('https://api.faceit.com/auth/v1/oauth/token',{method:'POST',headers,body:new URLSearchParams({grant_type:'authorization_code',client_id:id,redirect_uri:redirect,code,code_verifier:verifier}),redirect:'error',signal:AbortSignal.timeout(7000)});
 if(!token.ok)return res.status(200).json({stage:'token',httpStatus:token.status,clientSecretConfigured:!!secret,success:false});
 const t=await token.json();if(typeof t.access_token!=='string')return res.json({stage:'token',success:false,error:'Chybí access token'});
 const r=await fetch('https://www.faceit.com/api/statistics/v1/cs2/matches/'+matchId+'/scoreboard-summary?statsType=2',{headers:{Authorization:'Bearer '+t.access_token,Accept:'application/json'},redirect:'error',signal:AbortSignal.timeout(7000)});
 let ratings=0,mvp=false;if(r.ok){const p=(await r.json()).payload;if(p?.id===matchId){ratings=(p.cs2?.teams||[]).flatMap(t=>t.players||[]).filter(p=>Number.isFinite(p.stats?.faceit_rating??p.stats?.faceitRating)).length;mvp=!!(p.cs2?.mvp_player_id??p.cs2?.mvpPlayerId);}}
 return res.json({stage:'scoreboard',tokenSuccess:true,httpStatus:r.status,ratings,mvp,success:r.ok&&ratings===10&&mvp,matchId});
 }catch{return res.status(200).json({stage:'network',success:false,error:'Požadavek selhal nebo vypršel časový limit'});}
};
