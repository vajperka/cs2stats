// Snapshots are observations, not authoritative historical match results.
export function matchObservations(rows,samples){
 const groups=new Map();
 for(const s of samples||[]){if(!s.latest_match||!Number.isInteger(Number(s.elo))||Number(s.elo)<=0)continue;const a=groups.get(s.latest_match)||[];a.push(s);groups.set(s.latest_match,a)}
 const stable=id=>{const a=groups.get(id)||[];const values=new Set(a.map(s=>Number(s.elo)));return values.size===1?Number(a[0].elo):null};
 const result={};
 for(let i=0;i<rows.length;i++){const id=rows[i]['Match Id'];if(!id)continue;const elo=stable(id);if(elo===null)continue;const prev=stable(rows[i+1]?.['Match Id']);result[id]={elo,delta:prev!==null&&elo!==prev?elo-prev:null};}
 return result;
}
