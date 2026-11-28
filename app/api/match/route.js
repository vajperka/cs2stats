import roundTimeline from '../../lib/round-timeline.cjs';
import apiCache from '../../lib/api-cache.cjs';
import summaryFetch from '../../lib/summary-fetch.cjs';
import scoreboard from '../../lib/scoreboard.cjs';
import {NextResponse} from 'next/server';
export async function GET(req){const id=new URL(req.url).searchParams.get('id');if(!id||!process.env.FACEIT_API_KEY)return NextResponse.json({error:'Detail není dostupný.'},{status:400});try{const get=async suffix=>{const r=await apiCache.cachedFetch('https://open.faceit.com/data/v4/matches/'+encodeURIComponent(id)+suffix,{headers:{Authorization:'Bearer '+process.env.FACEIT_API_KEY},cache:'no-store'});if(!r.ok)throw Error('FACEIT '+r.status);return r.json()};const [stats,meta]=await Promise.all([get('/stats'),get('').catch(()=>null)]);const result=await summaryFetch.getSummary(id);if(result.summary)scoreboard.mergeScoreboard(stats,result.summary,id);return NextResponse.json({...stats,meta,roundTimeline:roundTimeline.timeline(stats,result.summary),ratingStatus:result.status})}catch(e){return NextResponse.json({error:e.message},{status:502})}}
