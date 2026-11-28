export function resolveElo(rows, tracked, current, changes={}, estimates={}, fallback=false) {
 const num=v=>v==null||v===''||!Number.isFinite(Number(v))?null:Number(v);
 const stored=new Map((tracked||[]).map(p=>[p.match_id,p]));
 const values=rows.map(r=>num(r.Elo??r.ELO??r.elo??r['Faceit Elo'])??num(stored.get(r['Match Id'])?.elo));
 const deltas=rows.map(r=>num(r['Elo Change']??r['ELO Change']??r.elo_change)??num(changes[r['Match Id']]));
 const estimated=rows.map(()=>false), deltaEstimated=rows.map(()=>false);
 if(values.length && values[0]===null && num(current)>0)values[0]=num(current);
 if(fallback)for(let i=0;i<rows.length;i++){
  if(deltas[i]!==null)continue;
  const result=String(rows[i].Result??'');
  const model=num(estimates[rows[i]['Match Id']]);
  if(model!==null && model!==0){deltas[i]=model;deltaEstimated[i]=true;}
  else if(result==='1'||result==='0'){deltas[i]=result==='1'?25:-25;deltaEstimated[i]=true;}
 }
 for(let i=0;i<rows.length-1;i++){
  if(values[i]!==null&&values[i+1]===null&&deltas[i]!==null&&values[i]-deltas[i]>0){values[i+1]=values[i]-deltas[i];estimated[i+1]=estimated[i]||deltaEstimated[i];}
 }
 const resolvedRows=rows.map((r,i)=>({...r,Elo:values[i], 'Elo Change':deltas[i]??(values[i]!=null&&values[i+1]!=null?values[i]-values[i+1]:null),eloEstimated:estimated[i],deltaEstimated:deltaEstimated[i]||(deltas[i]===null&&(estimated[i]||!!estimated[i+1]))}));
 const seen=new Set(rows.map(r=>r['Match Id']));
 const points=[...(tracked||[]).filter(p=>!seen.has(p.match_id)).map(p=>({elo:num(p.elo),change:num(changes[p.match_id]),date:p.observed_at,observed:true})),...rows.map((r,i)=>({elo:values[i],change:deltas[i]??(values[i]!=null&&values[i+1]!=null?values[i]-values[i+1]:null),date:r['Match Finished At'],map:r.Map,estimated:estimated[i],deltaEstimated:deltaEstimated[i]||estimated[i]||!!estimated[i+1],observed:num(r.Elo??r.ELO??r.elo??r['Faceit Elo'])===null})).reverse()].filter(p=>p.elo!==null&&p.elo>0);
 const now=num(current);if(now>0&&(!points.length||points.at(-1).elo!==now))points.push({elo:now,change:null,observed:true});
 return {points,rows:resolvedRows};
}

export function buildEloPoints(...args){return resolveElo(...args).points;}
