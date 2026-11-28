const time=v=>{if(v==null||v==='')return null;const n=Number(v);const t=Number.isFinite(n)?(n<1e12?n*1000:n):Date.parse(v);return Number.isFinite(t)?t:null};
export function unifiedElo(rows,samples,current,stored=[]){
 const historical=rows.flatMap(r=>{const v=r.Elo??r.ELO??r.elo??r['Faceit Elo'];const t=time(r['Match Finished At']);if(v==null||v===''||!Number.isFinite(Number(v))||Number(v)<=0||t===null)return [];const d=r['Elo Change']??r['ELO Change']??r.elo_change;return [{elo:Number(v),date:t,map:r.Map,change:d!=null&&d!==''&&Number.isFinite(Number(d))?Number(d):null,source:'Historie zápasů'}]});
 const live=samples.flatMap(s=>{const t=time(s.observed_at);return t!==null&&Number(s.elo)>0?[{elo:Number(s.elo),date:t,source:'FRAG / FACEIT',observed:true,change:null}]:[]}).sort((a,b)=>a.date-b.date);
 for(let i=1;i<live.length;i++)live[i].change=live[i].elo-live[i-1].elo;
 const all=[...stored,...historical,...live].sort((a,b)=>a.date-b.date);const out=[];
 for(const p of all){if(out.at(-1)?.elo===p.elo)continue;out.push(p)}
 if(!out.length&&Number(current)>0)out.push({elo:Number(current),change:null,observed:true});return out;
}
