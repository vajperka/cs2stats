function radarRate(kind){
 const keys={entry:['Entry Success Rate','entrySuccessRate','entry_success_rate'],clutch:['Clutch Success Rate','clutchSuccessRate','clutch_success_rate'],utility:['Flash Success Rate','Flash Success %','Flash Success Rate %']}[kind];
 const pairs={entry:[['Entry Wins','Entry Count'],['entry_kills','entry_attempts'],['entryKills','entryAttempts'],['First Kills','First Kill Attempts']],clutch:[['Clutch Wins','Clutch Count'],['clutch_rounds_won','clutch_rounds'],['clutchRoundsWon','clutchRounds']],utility:[['Flash Successes','Flash Count']]}[kind];
 let rates=[],wins=0,total=0;
 for(const m of player.history||[]){const s=m.detail?.rawStats||{};let found=false;for(const [a,b] of pairs){const x=number(s[a]),y=number(s[b]);if(x!=null&&y>0&&x>=0&&x<=y){wins+=x;total+=y;found=true;break}}if(found)continue;for(const k of keys){const raw=s[k];let n=number(typeof raw==='string'?raw.replace(/%$/,''):raw);if(n!=null&&n>=0&&n<=100){if(n<=1&&!String(raw).includes('%')&&!k.endsWith('%'))n*=100;rates.push(n);break}}}
 return total?Math.round(100*wins/total):rates.length?Math.round(rates.reduce((a,b)=>a+b,0)/rates.length):null;
}
