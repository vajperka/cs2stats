'use client';
import {MapArt,mapLabel} from './map-art';
import {useState,useId} from 'react';
export default function EloChart({points}){
 const [active,setActive]=useState(null); const fillId=useId();
 const low=Math.min(...points.map(p=>p.elo))-10,high=Math.max(...points.map(p=>p.elo))+10;
 const coords=points.map((p,i)=>({...p,x:12+i/Math.max(1,points.length-1)*676,y:140-(p.elo-low)/(high-low)*126}));
 const path=coords.map(p=>`${p.x},${p.y}`).join(' '),selected=coords[active];
 const color=p=>p.change==null||p.change===0?'#a4a4ae':p.change>0?'#43df91':'#ff515c';
 const change=p=>p.change==null?'Změna není dostupná':`${p.change>0?'+':''}${p.change} ELO`;
 return <div className="elo-interactive" onMouseLeave={()=>setActive(null)} onKeyDown={e=>{if(e.key==='Escape')setActive(null)}}>
 <svg viewBox="0 0 700 150" width="100%" aria-label="Vývoj ELO" role="group">
 <defs><linearGradient id={fillId} x2="0" y2="1"><stop stopColor="#ff303b" stopOpacity=".5"/><stop offset="1" stopColor="#ff303b" stopOpacity="0"/></linearGradient></defs>
 <polygon points={`12,150 ${path} 688,150`} fill={`url(#${fillId})`}/><polyline className="chartline" points={path} fill="none" stroke="#ff303b" strokeWidth="3"/>
 {selected&&<line x1={selected.x} x2={selected.x} y1="5" y2="150" stroke="#ffffff55" strokeDasharray="4 4"/>}
 {coords.map((p,i)=><g key={i} role="button" tabIndex={0} aria-label={`${p.elo} ELO, ${change(p)}`} onFocus={()=>setActive(i)} onBlur={()=>setActive(null)} onPointerEnter={()=>setActive(i)} onClick={()=>setActive(i)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setActive(i)}}} className="elo-chart-point"><circle cx={p.x} cy={p.y} r={active===i?8:4} fill={color(p)} stroke="#171419" strokeWidth="1.5"/><rect x={p.x-Math.min(12,338/Math.max(1,coords.length-1))} y={0} width={2*Math.min(12,338/Math.max(1,coords.length-1))} height={150} fill="transparent"/></g>)}
 </svg>
 {selected&&<div className="elo-chart-tooltip" style={{left:`${Math.max(15,Math.min(85,selected.x/7))}%`}} role="status"><small>{selected.map?<><MapArt map={selected.map}/>{mapLabel(selected.map)}</>:'Záznam ELO'}</small><strong>{selected.elo} ELO</strong><b style={{color:color(selected)}}>{change(selected)}</b>{selected.source&&<small>{selected.source} · {new Date(selected.date).toLocaleString("cs-CZ",{timeZone:"Europe/Prague"})}</small>}{selected.observed&&<small>Pozorovaná hodnota</small>}</div>}
 </div>
}
