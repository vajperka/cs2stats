export function buildEloPoints(rows, tracked, current, changes={}) {
 const num=v=>v==null||v===''||!Number.isFinite(Number(v))?null:Number(v);
 const stored=new Map((tracked||[]).map(p=>[p.match_id,p]));
 const values=rows.map(r=>num(r.Elo??r.ELO??r.elo??r['Faceit Elo'])??num(stored.get(r['Match Id'])?.elo));
 const deltas=rows.map(r=>num(r['Elo Change']??r['ELO Change']??r.elo_change)??num(changes[r['Match Id']]));
 // Reconstruct only across consecutive matches with known changes.
 for(let pass=0;pass<rows.length;pass++)for(let i=0;i<rows.length-1;i++){
  if(deltas[i]===null)continue;
  if(values[i]!==null&&values[i+1]===null)values[i+1]=values[i]-deltas[i];
  if(values[i]===null&&values[i+1]!==null)values[i]=values[i+1]+deltas[i];
 }
 const seen=new Set(rows.map(r=>r['Match Id']));
 const points=[...(tracked||[]).filter(p=>!seen.has(p.match_id)).map(p=>({elo:num(p.elo),change:num(changes[p.match_id]),date:p.observed_at,observed:true})),...rows.map((r,i)=>({elo:values[i],change:deltas[i],date:r['Match Finished At'],map:r.Map,observed:num(r.Elo??r.ELO??r.elo??r['Faceit Elo'])===null})).reverse()].filter(p=>p.elo!==null&&p.elo>0);
 const now=num(current);if(now>0&&(!points.length||points.at(-1).elo!==now))points.push({elo:now,change:null,observed:true});
 return points;
}
