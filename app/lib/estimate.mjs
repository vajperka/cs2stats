// Model estimate, not FACEIT's actual Elo formula. Never store estimates as observations.
export function estimateDelta(match,id){
 const teams=Object.entries(match?.teams||{}); if(teams.length!==2)return null;
 const index=teams.findIndex(([,t])=>t.roster?.some(p=>p.player_id===id)); if(index<0)return null;
 const averages=teams.map(([,t])=>{const a=t.roster?.map(p=>p.elo??p.faceit_elo);return a?.length===5&&a.every(v=>typeof v==='number'&&v>0)?a.reduce((s,v)=>s+v,0)/5:null});
 const winner=match.results?.winner;if(!teams.some(([k])=>k===winner)||averages.some(v=>v===null))return null;
 const probability=1/(1+10**((averages[1-index]-averages[index])/400));return Math.round(50*((teams[index][0]===winner?1:0)-probability));
}
export function reconstruct(items,tracked,current,estimates){
 let anchor=Number.isFinite(current)?current:null, uncertain=false;
 for(const x of items){const s=x.stats;if(!s) {anchor=null;continue}const id=s['Match Id']??x.match_id;const known=tracked.points.find(p=>p.match_id===id)?.elo;const exact=s.Elo??known;
 if(exact!=null&&Number(exact)>0){anchor=Number(exact);uncertain=false;s.Elo=anchor;}else if(anchor!==null&&anchor>0){s.Elo=anchor;if(uncertain)s.eloEstimated=true;}
 const d=s['Elo Change']??tracked.changes[id];if(d!=null&&Number.isFinite(Number(d))){s['Elo Change']=Number(d);if(anchor!==null)anchor-=Number(d);}else if(Number.isFinite(estimates[id])){s['Elo Change']=estimates[id];s.deltaEstimated=true;uncertain=true;if(anchor!==null)anchor-=estimates[id];}else{anchor=null;uncertain=true;}
 }
}
