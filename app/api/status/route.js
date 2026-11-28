import {db} from '../../lib/elo';
import {NextResponse} from 'next/server';
export const dynamic='force-dynamic';
export async function GET(){try{const sql=db();await sql`SELECT 1`;const tables=await sql`SELECT tablename FROM pg_tables WHERE schemaname=current_schema()`;const names=new Set(tables.map(x=>x.tablename));const counts={};for(const name of ['frag_players','frag_api_match_archive','frag_wok_history','frag_elo_history','frag_api_cache']){counts[name]=names.has(name)?Number((await sql.query('SELECT count(*) AS n FROM '+name))[0].n):0;}return NextResponse.json({database:true,counts,faceitConfigured:!!process.env.FACEIT_API_KEY,wokConfigured:!!process.env.WOK_API_KEY});}catch{return NextResponse.json({database:false},{status:503})}}
