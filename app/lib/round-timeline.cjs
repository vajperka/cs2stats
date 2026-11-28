// FACEIT /stats rounds are map aggregates, not individual CS2 rounds.
// Only accept an explicit ordered round history with identifiable team winners.
function timeline(stats,summary){
 const map=stats?.rounds?.[0]; if(stats?.rounds?.length!==1||map?.teams?.length!==2)return null;
 const teams=map.teams; const scores=teams.map(t=>Number(t.team_stats?.['Final Score']));
 if(scores.some(s=>!Number.isInteger(s)||s<0)||scores[0]+scores[1]<1)return null;
 const cs=summary?.payload?.cs2;
 for(const history of [cs?.roundHistory,cs?.round_history,cs?.rounds,map.roundHistory,map.round_history]){
 if(!Array.isArray(history)||history.length!==scores[0]+scores[1])continue;
 const rounds=history.map(r=>({number:Number(r.roundNumber??r.round_number??r.number),winner:teams.findIndex(t=>t.team_id===(r.winnerTeamId??r.winner_team_id??r.winnerId??r.winner_id??r.winner))})).sort((a,b)=>a.number-b.number);
 if(rounds.some((r,i)=>r.number!==i+1||r.winner<0)||scores.some((s,i)=>rounds.filter(r=>r.winner===i).length!==s))continue;
 return rounds;
 }return null;
}
module.exports={timeline};
