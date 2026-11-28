const n=v=>v==null||v===''?null:Number.isFinite(Number(v))?Number(v):null;
const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:null;
export function metricTrends(rows){
 const ordered=[...rows].reverse();
 const specs=[['matches',()=>1],['win',r=>String(r.Result)==='1'?100:String(r.Result)==='0'?0:null],['kd',r=>n(r['K/D Ratio'])??(n(r.Kills)!==null&&n(r.Deaths)>0?n(r.Kills)/n(r.Deaths):null)],['adr',r=>n(r.ADR)],['hs',r=>n(r['Headshots %'])]];
 return Object.fromEntries(specs.map(([key,get])=>{
 const values=ordered.map(get); const recent=values.slice(-10),previous=values.slice(-20,-10);
 const valid=a=>a.filter(v=>v!==null); const a=mean(valid(recent)),b=mean(valid(previous));
 const change=key==='matches'?null:recent.length===10&&previous.length===10&&valid(recent).length===10&&valid(previous).length===10?a-b:null;
 const points=key==='matches'?ordered.map((_,i)=>i+1):values.map((v,i)=>v===null?null:mean(valid(values.slice(Math.max(0,i-4),i+1))));
 return [key,{points,change}];
 }));
}
