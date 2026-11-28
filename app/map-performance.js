'use client';import SectionHeading from "./section-heading";
import {MapArt,mapLabel} from './map-art';
export default function MapPerformance({maps}){
 const total=maps.reduce((s,[,v])=>s+v[0],0), wins=maps.reduce((s,[,v])=>s+v[1],0);
 const best=maps.reduce((a,b)=>!a||b[1][1]/b[1][0]>a[1][1]/a[1][0]|| (b[1][1]/b[1][0]===a[1][1]/a[1][0]&&b[1][0]>a[1][0])?b:a,null);
 return <article className="mp-panel"><div className="mp-head"><SectionHeading eyebrow="MAP PERFORMANCE" title="Výkon na mapách" description="Výhernost podle map" icon="map"/><div className="mp-average"><strong>{total?Math.round(wins/total*100)+' %':'—'}</strong><small>Celkový winrate</small></div></div><div className="mp-list">{maps.map(([n,[count,w]])=>{const rate=Math.round(w/count*100),top=best?.[0]===n&&w>0;return <div className={'mp-row'+(top?' mp-best':'')} key={n}><MapArt map={n}/><div className="mp-info"><b>{mapLabel(n)}</b><small>⚔ {count} {count===1?'zápas':count<5?'zápasy':'zápasů'}</small></div><div className="mp-track" role="progressbar" aria-label={mapLabel(n)+' winrate'} aria-valuenow={rate} aria-valuemin={0} aria-valuemax={100}><i style={{width:rate+'%'}}/></div><strong className={'mp-rate '+(rate>50?'mp-positive':rate<50?'mp-negative':'')}>{rate} % {top&&<span title="Nejvyšší výhernost v dostupných zápasech">♛</span>}</strong></div>})}{!maps.length&&<p>Žádné dostupné zápasy.</p>}</div></article>
}
