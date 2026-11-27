'use client';
const root='https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/';
export function mapKey(value){return String(value||'').trim().toLowerCase().replace(/^(de|cs)_/,'').replace(/dust\s*(ii|2)/,'dust2').replace(/[^a-z0-9_]/g,'');}
export function mapLabel(value){const k=mapKey(value);return k==='dust2'?'Dust II':k?k[0].toUpperCase()+k.slice(1):'Neznámá mapa';}
export function mapPhoto(value){const k=mapKey(value);return k?root+'thumbs/'+(['office','italy','agency'].includes(k)?'cs_':'de_')+k+'_1_png.png':null;}
export function MapArt({map}){const k=mapKey(map),url=mapPhoto(map);return <span className="map-art" aria-hidden="true">{url&&<img key={url} src={url} alt="" loading="lazy" onError={e=>{const im=e.currentTarget;if(im.dataset.fallback==='2'){im.style.display='none';return}if(im.dataset.fallback==='1'){im.dataset.fallback='2';im.src=root+(['office','italy','agency'].includes(k)?'cs_':'de_')+k+'.png';return}im.dataset.fallback='1';im.src=url.replace('_1_png.png','_png.png')}}/>}</span>}
