import {db} from './elo';
import wok from './wok.cjs';
export async function enrichStored(id, rows){
 let sql, saved=[], claimed=false, warning=null;
 try{
  sql=db();
  await sql`CREATE TABLE IF NOT EXISTS frag_wok_history (player_id text NOT NULL, match_id text NOT NULL, elo integer, delta integer, saved_at timestamptz DEFAULT now(), PRIMARY KEY(player_id,match_id))`;
  await sql`CREATE TABLE IF NOT EXISTS frag_wok_refresh (player_id text PRIMARY KEY, attempted_at timestamptz NOT NULL)`;
  saved=await sql`SELECT match_id,elo,delta FROM frag_wok_history WHERE player_id=${id}`;
  wok.merge(rows,saved.map(r=>({...r,elo_delta:r.delta})));
  if(rows.some(r=>r.match_id&&(r.detail?.elo==null||r.detail?.delta==null))){
   const lock=await sql`INSERT INTO frag_wok_refresh(player_id,attempted_at) VALUES(${id},now()) ON CONFLICT(player_id) DO UPDATE SET attempted_at=now() WHERE frag_wok_refresh.attempted_at < now()-interval '10 minutes' RETURNING player_id`;
   claimed=lock.length>0;
  }
 }catch(e){warning='Ukládání ELO do databáze není dostupné.'; console.error('WOK storage',e.code||e.name); claimed=true;}
 let source={message:null};
 if(claimed){
  source=await wok.enrich(id,rows);
  if(sql&&source.items?.length){try{
   const valid=source.items.filter(x=>x.match_id&&(Number.isInteger(x.elo)||Number.isInteger(x.delta)));
   await sql`INSERT INTO frag_wok_history(player_id,match_id,elo,delta) SELECT ${id},x.match_id,x.elo,x.delta FROM jsonb_to_recordset(${JSON.stringify(valid)}::jsonb) AS x(match_id text,elo integer,delta integer) ON CONFLICT(player_id,match_id) DO UPDATE SET elo=COALESCE(excluded.elo,frag_wok_history.elo),delta=COALESCE(excluded.delta,frag_wok_history.delta),saved_at=now()`;
  }catch(e){warning='Nová ELO data se nepodařilo uložit.';console.error('WOK save',e.code||e.name);}}
 }
 const matched=rows.filter(r=>r.detail?.elo!=null||r.detail?.delta!=null).length;
 return {matched,message:warning||(!matched?source.message:null),cached:saved.length};
}
