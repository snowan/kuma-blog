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


// Diagram geometry. These drive the SVG pictures, so a wrong layout is a wrong explanation.
for(const target of ['D','F','Z']){
 const g=e.treeGeometry(target,false);
 check(g.nodes.length===8&&g.edges.length===7,`Tree keeps its full shape for target ${target}`);
 check(g.nodes.every(n=>n.x>=n.w/2&&n.x+n.w/2<=600&&n.y>=16&&n.y<=290),`Tree nodes stay inside the frame: ${target}`);
 check(g.nodes.filter(n=>n.leaf).map(n=>n.id).join(',')==='Z,D,F','Only D, F and Z are selectable leaves');
 const roles=Object.fromEntries(g.nodes.map(n=>[n.id,n.role]));
 for(const id of g.model.shared)check(roles[id]==='shared',`Shared ancestor is drawn as shared: ${id}/${target}`);
 for(const id of g.model.to)check(roles[id]==='shared'||roles[id]==='target',`Target path is never drawn as leaving: ${id}/${target}`);
 for(const id of g.model.leaving)check(roles[id]==='leaving',`The path being left is drawn as leaving: ${id}/${target}`);
 check(g.edges.every(x=>x.role!=='idle'||!(g.model.to.includes(x.a)&&g.model.to.includes(x.b))),`No target edge is dimmed: ${target}`);
 check(e.treeStageRole('idle',0)==='idle'&&e.treeStageRole('shared',0)==='target','Before a branch is chosen only the current path is highlighted');
 check(e.treeStageRole('shared',2)==='shared'&&e.treeStageRole('leaving',2)==='leaving','From the shared-ancestor step the three roles are distinct');
}
check(e.treeGeometry('D',false).model.leaving.length===0,'Staying on D leaves no path behind');
check(e.treeGeometry('Z',false).edges.find(x=>x.a==='A'&&x.b==='B').role==='leaving','Reaching Z leaves the A→B edge behind');
for(const scenario of ['append','timestamp','tool','deferred','prune','branch','model']){
 for(const resident of [true,false]){
  const s=e.prefixSpans(e.cacheModel(scenario,resident));
  check(s.matched+s.diverged===s.total,`Prefix bar 1 spans the whole input: ${scenario}/${resident}`);
  check(s.reused+s.recomputed===s.total,`Prefix bar 2 spans the whole input: ${scenario}/${resident}`);
  check(s.matchRatio>=0&&s.matchRatio<=1&&s.reuseRatio>=0&&s.reuseRatio<=1,`Bar ratios stay drawable: ${scenario}`);
  check(s.reuseRatio<=s.matchRatio,`Reuse never exceeds the matching prefix: ${scenario}/${resident}`);
 }
}
check(e.prefixSpans(e.cacheModel('append',false)).cacheLost,'An unreachable cache is shown as the two bars disagreeing');
check(!e.prefixSpans(e.cacheModel('append',true)).cacheLost,'A usable cache keeps the two bars in agreement');
check(!e.prefixSpans(e.cacheModel('timestamp',false)).cacheLost,'A prefix that already diverged is not reported as a lost cache');
for(let ctx=40000;ctx<=128000;ctx+=8000){
 for(let keep=8000;keep<=32000;keep+=4000){
  const shape=e.shapeModel(e.compactionModel(ctx,keep));
  check(shape.beforeTotal===ctx,`Pre-compaction shape totals the context: ${ctx}/${keep}`);
  check(shape.afterTotal===e.compactionModel(ctx,keep).after,`Post-compaction shape matches the budget model: ${ctx}/${keep}`);
  check(shape.before.every(x=>x.tokens>=0)&&shape.after.every(x=>x.tokens>0),`No negative segment: ${ctx}/${keep}`);
  check(shape.afterTotal<=shape.beforeTotal,`The drawn post-compaction input is never longer: ${ctx}/${keep}`);
 }
}
for(const point of ['accepted','uncertain','settled','complete']){
 for(const policy of ['never','safe']){
  const t=e.recoveryTimelineModel(point,policy);
  check(t.index>=0&&t.index<t.marks.length,`Crash marker lands on a durable checkpoint: ${point}`);
  check(t.uncertain===(point==='uncertain'),`The unknown window is drawn only when the effect is unknown: ${point}`);
  check(t.windowFrom<t.windowTo,'The unknown window has a start before its end');
  check(t.replays===e.recoveryModel(point,policy).replays,`Timeline replay count matches the recovery model: ${point}/${policy}`);
 }
}
check(e.recoveryTimelineModel('uncertain','never').replays===0,'An unsafe unknown effect draws no replay arc');
check(e.shapeModel(e.compactionModel(115000,20000)).afterTotal===28000,'At the default settings the drawn input gets much shorter');
check(e.shapeModel(e.compactionModel(40000,32000)).afterTotal===40000,'At the smallest window and the largest keepRecent this illustration saves nothing, and the picture says so');

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
 for(const r of d.rows)check(['user','assistant','tool','compaction','header','config'].includes(e.traceCategory(r)),`Every row gets a map colour: ${r.id}`);
 check(e.traceCategory(d.rows[0])==='header','The session header is not drawn as a message');
 check(d.rows.filter(r=>e.traceCategory(r)==='compaction').length===d.stats.compaction,'Map compaction ticks match the counted compactions');
 check(d.rows.filter(r=>e.traceCategory(r)==='tool').length===d.stats.toolResult,'Map tool ticks match the counted tool results');
 check(d.rows.filter(r=>e.traceCategory(r)==='assistant').length===d.stats.assistant,'Map assistant ticks match the counted assistant messages');
 check(d.rows.filter(r=>e.traceCategory(r)==='user').length===d.stats.user,'Map user ticks match the counted user messages');
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
check(app.includes("aria-keyshortcuts")&&app.includes("e.key==='ArrowRight'"),'Flows can be stepped from the keyboard');
check(html.includes('.diagram:not(.strip){min-width')&&html.includes('.diagram-wrap{overflow-x:auto}'),'Narrow screens scroll a diagram instead of shrinking its labels');
check(!/<svg[^>]*class="diagram[^"]*"(?![^>]*role="img")/.test(app),'Every diagram is exposed as an image');
check((app.match(/<title>\$\{esc\(title\)\}<\/title><desc>/g)||[]).length===1,'Diagrams carry a title and a description');
check(app.includes('data-branch-node')&&app.includes('class="tree-controls"'),'The tree picture has real buttons behind it');
for(const file of ['README.md','sources.md','validation.md'])check(existsSync(path.join(dir,file)),`Companion link resolves: ${file}`);
console.log(JSON.stringify({status:'passed',assertions,scope:'Teaching models and structural projections only; not Pi or provider behavior'},null,2));
