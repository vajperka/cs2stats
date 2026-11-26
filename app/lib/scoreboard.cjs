function mergeScoreboard(data, summary, id) {
 const payload=summary?.payload;
 if(payload?.id!==id || !Array.isArray(payload?.cs2?.teams)) return false;
 // Summary is match-wide; do not apply aggregate ratings to individual maps in a series.
 if(data.rounds?.length!==1) return false;
 const players=new Map(payload.cs2.teams.flatMap(t=>(t.players||[]).map(p=>[p.playerId??p.player_id,p])));
 let count=0;
 data.mvpPlayerId=payload.cs2.mvpPlayerId??payload.cs2.mvp_player_id??null;
 for(const team of data.rounds[0].teams||[]) for(const p of team.players||[]) {
  const source=players.get(p.player_id); const s=source?.stats;
  const rating=s?.faceitRating??s?.faceit_rating;
  if(typeof rating!=='number'||!Number.isFinite(rating)||rating<0) continue;
  const target=p.player_stats={...p.player_stats};
  for(const key of Object.keys(target)) if(['rating','faceitrating'].includes(key.toLowerCase().replace(/[^a-z]/g,''))) delete target[key];
  for(const [key,value] of Object.entries({'FACEIT Rating':rating,'Kills':s.kills,'Deaths':s.deaths,'Assists':s.assists,'K/D Ratio':s.kd,'ADR':s.adr,'KAST':typeof s.kast==='number'?s.kast*100:undefined,'Round Swing':typeof (s.faceitRatingSwing??s.faceit_rating_swing)==='number'?(s.faceitRatingSwing??s.faceit_rating_swing)*100:undefined})) if(typeof value==='number'&&Number.isFinite(value)) target[key]=['K/D Ratio','ADR','KAST','Round Swing'].includes(key)?value.toFixed(2):value;
  p.extendedStats=s; p.match_elo=source.elo; p.match_elo_delta=(source.eloDelta??source.elo_delta); count++;
 }
 data.ratingSource=count?'FACEIT scoreboard-summary':null;
 return count===players.size && count===data.rounds[0].teams.flatMap(t=>t.players||[]).length;
}
module.exports={mergeScoreboard};
