"""Run locally with Python 3.11+, FACEIT_API_KEY and DATABASE_URL."""
import os, time, json, tempfile, bz2, urllib.request, urllib.parse, math
import psycopg
from demoparser2 import DemoParser

def get(path):
    req=urllib.request.Request('https://open.faceit.com/data/v4'+path,headers={'Authorization':'Bearer '+os.environ['FACEIT_API_KEY']})
    with urllib.request.urlopen(req,timeout=30) as r: return json.load(r)

def analyze(path, roster):
    parser=DemoParser(path)
    deaths=parser.parse_event('player_death').to_dict('records')
    hurt=parser.parse_event('player_hurt').to_dict('records')
    ends=parser.parse_event('round_end').to_dict('records')
    # Round count is based on recorded round-end events; reject incomplete demos.
    rounds=len(ends)
    if rounds<1: raise ValueError('No completed rounds')
    def sid(v): return str(v).split('.')[0] if v is not None else ''
    out={}
    enemies=enemy_kills(deaths,roster)
    for steam,pid in roster.items():
        k=[e for e in deaths if sid(e.get('attacker_steamid'))==steam and sid(e.get('user_steamid')) in roster and roster[sid(e.get('user_steamid'))][1]!=pid[1]]
        d=[e for e in deaths if sid(e.get('user_steamid'))==steam]
        a=[e for e in enemies if sid(e.get('assister_steamid'))==steam]
        damage=sum(max(0,min(float(e.get('dmg_health') or 0),100)) for e in hurt if sid(e.get('attacker_steamid'))==steam and sid(e.get('user_steamid')) in roster and roster[sid(e.get('user_steamid'))][1]!=pid[1])
        # Explicit custom score: weighted per-round rates, not FACEIT/HLTV.
        rating=round(.45*len(k)/rounds/.7+.25*damage/rounds/80+.15*len(a)/rounds/.2+.15*max(0,1-len(d)/rounds)/.3,3)
        out[pid[0]]={'rating':rating,'kills':len(k),'deaths':len(d),'assists':len(a),'adr':round(damage/rounds,2)}
    return out,rounds

def enemy_kills(events,roster):
    return [e for e in events if str(e.get('attacker_steamid')) in roster and str(e.get('user_steamid')) in roster and roster[str(e['attacker_steamid'])][1]!=roster[str(e['user_steamid'])][1]]

def process(mid):
    m=get('/matches/'+mid); roster={str(p['game_player_id']):(p['player_id'],team) for team,t in m['teams'].items() for p in t['roster'] if p.get('game_player_id')}
    urls=m.get('demo_url') or []
    if len(urls)!=1 or len(roster)!=10: raise ValueError('Single-map demo and ten players required')
    u=urls[0]; parsed=urllib.parse.urlparse(u)
    if parsed.scheme!='https': raise ValueError('HTTPS demo required')
    with tempfile.TemporaryDirectory() as td:
        path=td+'/match.dem'; total=0
        with urllib.request.urlopen(u,timeout=60) as r,open(path,'wb') as f:
            dec=bz2.BZ2Decompressor() if parsed.path.endswith('.bz2') else None
            while chunk:=r.read(65536):
                data=dec.decompress(chunk) if dec else chunk; total+=len(data)
                if total>1500_000_000: raise ValueError('Demo too large')
                f.write(data)
        stats,rounds=analyze(path,roster)
    official=get('/matches/'+mid+'/stats')['rounds'][0]
    expected={p['player_id']:int(p['player_stats']['Kills']) for t in official['teams'] for p in t['players']}
    if set(expected)!=set(stats) or any(stats[p]['kills']!=k for p,k in expected.items()): raise ValueError('Demo kill counts differ from official scoreboard')
    return {'players':stats,'rounds':rounds,'mvp':max(stats,key=lambda p:stats[p]['rating'])}

def main():
    while True:
        with psycopg.connect(os.environ['DATABASE_URL']) as c:
            row=c.execute("SELECT id FROM faceit_demo_analysis WHERE result IS NULL AND attempts<5 AND next_try<=now() ORDER BY next_try LIMIT 1 FOR UPDATE SKIP LOCKED").fetchone()
            if row: c.execute("UPDATE faceit_demo_analysis SET attempts=attempts+1,next_try=now()+interval '15 minutes' WHERE id=%s",row)
        if not row: time.sleep(30); continue
        try:
            result=process(row[0])
            with psycopg.connect(os.environ['DATABASE_URL']) as c: c.execute('UPDATE faceit_demo_analysis SET result=%s::jsonb WHERE id=%s',(json.dumps(result),row[0]))
            print('Saved',row[0],flush=True)
        except Exception as e: print('Failed',row[0],type(e).__name__,str(e)[:200],flush=True)
if __name__=='__main__': main()
