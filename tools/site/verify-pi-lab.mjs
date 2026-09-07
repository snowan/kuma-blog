import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const dir=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/learn/pi-design-lab');
const html=readFileSync(path.join(dir,'index.html'),'utf8');
const app=html.match(/<script id="lab-app">([\s\S]*?)<\/script>/)[1];
const context=vm.createContext({});
const start=app.indexOf('const BASE_PREFIX');
const end=app.indexOf('window.PI_LAB =');
vm.runInContext(app.slice(start,end)+'\nglobalThis.engine=Engine;',context);
const e=context.engine;
let assertions=0;
const check=(condition,message)=>{assert.ok(condition,message);assertions++;};

check(e.cacheModel('append',true).reusable===20000,'Stable append reuses the old prefix in the teaching model');
check(e.cacheModel('timestamp',true).reusable===0,'A first-segment mismatch cannot skip to later matching text');
check(e.cacheModel('tool',true).reusable===1000,'Traditional tool insertion invalidates following history');
check(e.cacheModel('deferred',true).reusable===20000,'Supported additive loading leaves the old prefix intact');
check(e.cacheModel('prune',true).reusable===6000,'Middle pruning invalidates the surviving suffix');
check(e.cacheModel('branch',true).reusable===4000,'Branch overlap is a prefix, not a session-ID guarantee');
for(const scenario of ['append','timestamp','tool','deferred','prune','branch','model']){
 for(const resident of [true,false]){
  const m=e.cacheModel(scenario,resident);
  check(m.reusable+m.recompute===m.total,`Token accounting: ${scenario}/${resident}`);
  check(m.reusable>=0&&m.reusable<=m.prefixTokens,`Reuse is bounded by shared prefix: ${scenario}`);
  if(!resident||scenario==='model')check(m.reusable===0,`No accessible/model-compatible cache: ${scenario}`);
 }
}
check(!e.compactionModel(111616,20000).trigger,'Equality does not cross the strict compaction threshold');
check(e.compactionModel(111617,20000).trigger,'One token above the threshold crosses it');
check(e.compactionModel(115000,20000).after===28000,'Illustrative post-compaction budget is explicit');
check(e.costModel(10000,80000,.1).breakEven===72,'Illustrative rewrite calculation');
check(e.costModel(10000,80000,1).breakEven===0,'No cached-read discount means no incremental rewrite penalty in this toy model');
check(e.treeModel('F',false).shared.join('/')==='root/A/B','F shares the correct ancestor path');
check(e.treeModel('Z',false).shared.join('/')==='root/A','Earlier branch does not include B');
check(e.treeModel('F',true).context.at(-1)==='离开分支摘要','Optional branch summary is appended to target');
check(!e.treeModel('D',true).summary,'No branch summary is invented when staying at the same leaf');
for(let mask=0;mask<8;mask++){
 const p={summary:!!(mask&1),tools:!!(mask&2),files:!!(mask&4)};
 check(e.portabilityModel({...p,opaque:true}).portable===(mask===7),'Opaque state cannot replace missing handoff material');
 check(e.portabilityModel({...p,opaque:false}).portable===(mask===7),'Opaque state is not required for this semantic handoff');
}
check(e.recoveryModel('uncertain','never').newCalls===0,'Unknown unsafe effect is never automatically repeated');
check(e.recoveryModel('uncertain','never').action==='形成 interrupted 结果','Unknown unsafe effect is not turned into success');
check(e.recoveryModel('uncertain','safe').replays===1,'Explicit safe replay is represented as another call');
check(e.recoveryModel('accepted','never').newCalls===1&&e.recoveryModel('accepted','never').replays===0,'Unstarted work is a first execution, not a replay');
for(const p of ['never','safe'])for(const point of ['settled','complete']){
 const first=e.recoveryModel(point,p),again=e.recoveryModel(point,p);
 check(first.newCalls===0&&again.newCalls===0,'Settled and terminal states do not repeat tools');
 check(JSON.stringify(first)===JSON.stringify(again),'Repeated terminal inspection has stable output');
}

const data=JSON.parse(html.match(/<script id="trace-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
check(data.map(x=>x.rows.length).join(',')==='33,495,383','The three source projections retain all source rows');
for(const d of data){
 const ids=new Set(d.rows.map(r=>r.id));
 check(ids.size===d.rows.length,'Entry IDs remain unique');
 for(const r of d.rows){
  if(r.parentId)check(ids.has(r.parentId),`Parent exists for ${r.id}`);
  check(!('content' in r)&&!('thinking' in r)&&!('arguments' in r)&&!('cwd' in r),'Projection excludes raw text, tool arguments, and local paths');
  if(r.type==='compaction')check(ids.has(r.firstKeptEntryId),'Compaction kept boundary exists in the sample');
 }
 check(d.stops.every((x,i)=>x>=0&&x<d.rows.length&&(i===0||x>d.stops[i-1])),'Tour stops follow file order');
}
const compact=data[1].rows.find(r=>r.type==='compaction');
check(compact.line===343&&compact.id==='4e5f9956'&&compact.firstKeptEntryId==='fdc4f4ef','Exact compaction evidence');
check(data[2].rows.filter(r=>r.parentId==='770e501b').map(r=>r.id).join(',')==='b4321223,d1241557','Exact real fork evidence');
check(data[2].stats.compaction===0&&!data[2].rows.some(r=>r.type==='branch_summary'),'No branch summary is invented in sample C');
const ids=[...html.matchAll(/\bid="([^"\n]+)"/g)].map(x=>x[1]).filter(x=>!x.includes('${'));
// Only static document IDs; template-generated strings inside the application script are excluded.
const markup=html.split('<script id="trace-data"')[0];
const staticIds=[...markup.matchAll(/\bid="([^"\n]+)"/g)].map(x=>x[1]);
check(new Set(staticIds).size===staticIds.length,'Static document IDs are unique');
check(!/<script[^>]+src=|<link[^>]+rel="stylesheet"/.test(html),'The HTML is standalone');
check(!/\bfetch\(|XMLHttpRequest|WebSocket|EventSource/.test(app),'The learning app makes no network calls');
check(html.includes('prefers-reduced-motion:reduce')&&app.includes('motion.matches'),'Reduced-motion policy exists');
check(app.includes('el.dataset.playing=String(this.playing)')&&html.includes('animation-play-state:paused'),'Paused flows also pause decorative flow particles');
check(html.includes('<noscript>'),'No-JS mechanism explanation exists');
for(const file of ['README.md','sources.md','validation.md'])check(existsSync(path.join(dir,file)),`Companion link resolves: ${file}`);
console.log(JSON.stringify({status:'passed',assertions,scope:'Teaching models and structural projections only; not Pi or provider behavior'},null,2));
