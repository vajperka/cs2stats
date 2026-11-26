// Browser-local observations, not official historical match Elo.
export function observeElo(data){
 const player=data?.p, current=Number(player?.games?.cs2?.faceit_elo), items=data?.history?.items||[];
 const id=x=>x?.stats?.['Match Id']||x?.match_id;
 if(!player?.player_id||!Number.isFinite(current)||!id(items[0]))return {};
 const key='frag-elo-v1:'+player.player_id;
 try{
 const old=JSON.parse(localStorage.getItem(key)||'null');const latest=id(items[0]);const changes=old?.changes||{};
 // Only attribute an observed change when exactly one new match is visible.
 if(old&&old.latest!==latest&&id(items[1])===old.latest&&current!==old.current){changes[latest]=current-old.current;}
 const kept=Object.fromEntries(Object.entries(changes).filter(([k])=>items.some(x=>id(x)===k)));
 localStorage.setItem(key,JSON.stringify({latest,current,changes:kept}));return kept;
 }catch{return {}}
}
