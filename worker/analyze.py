"""Offline analysis of a manually downloaded, trusted CS2 demo."""
import argparse,json
from demoparser2 import DemoParser
p=argparse.ArgumentParser();p.add_argument('demo');p.add_argument('steamid');a=p.parse_args()
d=DemoParser(a.demo);events=d.parse_event('player_death');sid=a.steamid
kills=events[(events.attacker_steamid.astype(str)==sid)&(events.user_steamid.astype(str)!=sid)]
deaths=events[events.user_steamid.astype(str)==sid]
assists=events[events.assister_steamid.astype(str)==sid]
print(json.dumps({'steamid':sid,'kills':len(kills),'deaths':len(deaths),'assists':len(assists),'hs':round(100*float(kills.headshot.mean()),2) if len(kills) else None,'rating':None,'mode':None},indent=2))
