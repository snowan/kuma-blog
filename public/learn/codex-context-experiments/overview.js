'use strict';
const rootSource = 'https://github.com/openai/codex/blob/6af345407d9c2a568da9d01b6c4b81a9e61495c0/codex-rs/';
const nodeDetails = {
  context: ['WORKING CONTEXT', '当前可见，不等于全部历史。', '模型本次只使用已组装进来的输入。存储在笔记或历史中的信息，需要成功读取并进入上下文，才成为当前可用的材料。', 'core/src/session/mod.rs#L4219'],
  model: ['MODEL', '模型选择动作，工具接口执行动作。', '模型可以维护笔记、请求历史或主动调用 new_context。它不是直接操纵后端数据库；调用需要经过客户端工具处理。模型也可能漏记、找错记录或未及时主动换窗。', 'core/src/tools/handlers/new_context_window_spec.rs#L9'],
  harness: ['HARNESS / SESSION', '管理有限输入，并执行窗口交接。', '客户端检查实验资格、提供预算提示，并处理换窗。new_context 重建初始上下文与 world state、替换活跃历史；这条路径不生成新的历史摘要。达到限制时还可能触发自动 fallback。', 'core/src/session/token_budget.rs#L21'],
  adapter: ['HISTORY-NOTES EXTENSION', '把恢复工具连接到后端接口。', '扩展定义 notes / history 工具，向 Codex 后端发送带 session_id 与 current_agent_name 的请求。它还可能贡献一个大小受限的 thread_hint；不能据此推断提示的生成方式或底层数据库。', 'ext/history-notes/src/backend.rs#L30'],
  notes: ['NOTES', '保存恢复线索，而非保证事实永远正确。', '模型可读、写、追加和搜索虚拟笔记。成功写入后的直接读取立即反映写入；列举与搜索有最终一致性。笔记可能遗漏或过时，引用出处能帮助后续核对。这里的虚拟路径不是本机文件路径。', 'ext/history-notes/src/tools.rs#L24'],
  history: ['HISTORY', '按窗口、消息和内容找回过去。', '历史提供列窗口、列消息、按 ID 读取，以及区分大小写的字面子串搜索。可见性存在最终一致性；空结果不证明记录被删除。查到过去的 PASS 也不能证明新版本已经正确。', 'ext/history-notes/src/tools.rs#L142'],
  environment: ['ENVIRONMENT', '窗口换了，文件不会因此被重置。', 'new_context 不重置任务环境。文件和运行环境的状态与活跃输入分开；恢复历史之后仍需核对当前代码、版本和测试。环境中的其他动作可以改变状态，换窗本身不会把失败修复好。', 'core/src/tools/handlers/new_context_window_spec.rs#L9']
};
const $o = (id) => document.getElementById(id);
document.querySelectorAll('button[disabled]').forEach((button) => { button.disabled = false; });
const compactMap = window.matchMedia('(max-width: 680px)');
function positionInspector() {
  const anchor = compactMap.matches ? document.querySelector('[data-node][aria-pressed="true"]') : document.querySelector('[data-node="environment"]');
  if (anchor) anchor.after($o('node-inspector'));
}
compactMap.addEventListener('change', positionInspector);
function inspectNode(key) {
  const [label, title, description, source] = nodeDetails[key];
  $o('node-label').textContent = label;
  $o('node-title').textContent = title;
  $o('node-description').textContent = description;
  $o('node-source').href = rootSource + source;
  document.querySelectorAll('[data-node]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.node === key)));
  positionInspector();
}
document.querySelectorAll('[data-node]').forEach((button) => button.addEventListener('click', () => inspectNode(button.dataset.node)));
inspectNode('context');

const stages = [
  ['MODEL + ENVIRONMENT', '任务进行中，证据进入 W1。', '模型读到用户约束和 b24 的 FAIL。a17 曾经 PASS，但不能证明当前代码正确。'],
  ['HARNESS → MODEL', '预算提示：开始考虑如何接续。', 'harness 提供预算信息；模型决定要保留哪些线索。提醒阈值依赖配置与模型，这里不使用虚构的统一 token 上限。'],
  ['MODEL → NOTES', '把目标、版本和出处写进笔记。', '示例笔记：pageSize=37 不变；b24 FAIL，见 W1 / m04；下一步修正 offset=37 的边界并重新测。笔记提供导航，不复制所有历史。'],
  ['MODEL → HARNESS', 'new_context：W1 退出活跃输入。', 'harness 更换工作上下文，构建 W2 的初始上下文与状态片段。这条路径不再生成历史摘要；旧细节不会全部自动复制进来。'],
  ['MODEL → NOTES / HISTORY', '按线索读笔记、定位并读取 m04。', '新窗口取得有关记录后，把 b24、offset=37 和 FAIL 重新带入输入。检索结果也占上下文，因此恢复是有选择地读入，而非无限扩容。'],
  ['MODEL → ENVIRONMENT', '回到当前代码，继续修复与验证。', '下一步是核对工作区、修正边界并重跑相关测试。此模拟停在待验证状态；找到旧记录不等于已经修复成功。']
];
let flowStep = 0;
let flowTimer = null;
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
function stopFlow() {
  if (flowTimer !== null) window.clearInterval(flowTimer);
  flowTimer = null;
  $o('flow-play').textContent = motionPreference.matches ? '减少动态效果 · 请单步' : '▶ 自动播放';
  $o('flow-play').disabled = motionPreference.matches;
}
function showFlow() {
  const scenario = $o('flow-scenario').value;
  const noNotes = scenario === 'no-notes';
  const lag = scenario === 'index-lag';
  let [owner, title, description] = stages[flowStep];
  if (noNotes && flowStep === 2) {
    owner = 'MODEL · RECOVERY RISK'; title = '这一回，没有留下笔记。';
    description = '缺少便签不会阻止换窗。历史仍可能提供恢复入口，但新窗口需要付出更多检索与核对工作；不能假设模型必然找对。';
  }
  if (flowStep === 4 && noNotes) {
    title = '没有便签，转向历史恢复线索。';
    description = '从可用窗口标识列举消息，搜索 boundary 并阅读候选记录，核对版本与用户约束。示例假设成功定位 m04；真实恢复并不保证成功。';
  }
  if (flowStep === 4 && lag) {
    title = '搜索返回空，先诊断可见性。';
    description = '已知 m04 时可尝试直接读取，同时检查大小写、过滤条件与索引延迟。直接读取历史也不保证立即可见；未恢复时应保留不确定性，等待或重新获取证据。';
  }
  $o('flow-owner').textContent = `${owner} · 0${flowStep + 1} / 06`;
  $o('flow-title').textContent = title;
  $o('flow-description').textContent = description;
  document.querySelectorAll('[data-step]').forEach((button) => {
    if (Number(button.dataset.step) === flowStep) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  document.querySelector('[data-step="2"] strong').textContent = noNotes ? '未写笔记' : '保存笔记';
  $o('state-context').textContent = flowStep < 3 ? 'W1 · 需求与失败结果' : flowStep === 3 ? 'W2 · 新的初始上下文' : lag ? 'W2 · 恢复证据仍有缺口' : 'W2 · 已取回相关证据';
  $o('context-detail').textContent = flowStep < 3 ? '当前窗口直接看得到相关消息。' : flowStep === 3 ? '旧的详细消息不再全部直接可见。' : lag ? '空结果不应转化成确定结论。' : '本例把 m04 的版本与结果重新读入。';
  $o('state-notes').textContent = flowStep < 2 || noNotes ? '尚未写入' : '约束 + b24 FAIL + m04';
  $o('notes-detail').textContent = noNotes ? '换窗前没有维护恢复线索。' : flowStep < 2 ? '模型还没有维护恢复线索。' : '线索可帮助恢复，但不等于当前验证。';
  $o('state-history').textContent = lag && flowStep >= 3 ? '搜索可见性延迟' : 'W1 / m04 可回查';
  $o('history-detail').textContent = lag && flowStep >= 3 ? '存在记录与搜索可见是不同状态。' : '过去的工具结果与版本绑定。';
  $o('state-environment').textContent = flowStep === 5 ? '当前修复仍待验证' : '文件仍在 · b24';
  $o('flow-branch').textContent = noNotes ? '缺少笔记 → 从历史重建线索 → 核对约束与版本 → 验证当前状态。恢复成本增加，结果不保证。' : lag ? '空结果 → 检查查询 / 尝试按 ID 读取 / 考虑可见性延迟 → 仍不可用则保留不确定性或重新获取证据。' : '正常路径：先保存线索，再切窗，按需读取历史。不是源码保证执行的固定程序。';
  $o('flow-next').disabled = flowStep === stages.length - 1;
}
document.querySelectorAll('[data-step]').forEach((button) => button.addEventListener('click', () => { stopFlow(); flowStep = Number(button.dataset.step); showFlow(); }));
$o('flow-next').addEventListener('click', () => { stopFlow(); flowStep = Math.min(flowStep + 1, stages.length - 1); showFlow(); });
$o('flow-replay').addEventListener('click', () => { stopFlow(); flowStep = 0; showFlow(); });
$o('flow-scenario').addEventListener('change', () => { stopFlow(); showFlow(); });
$o('flow-play').addEventListener('click', () => {
  if (flowTimer !== null) { stopFlow(); return; }
  if (motionPreference.matches) return;
  if (flowStep === stages.length - 1) flowStep = 0;
  showFlow();
  $o('flow-play').textContent = 'Ⅱ 暂停';
  flowTimer = window.setInterval(() => { flowStep += 1; showFlow(); if (flowStep === stages.length - 1) stopFlow(); }, 4000);
});
motionPreference.addEventListener('change', stopFlow);
document.addEventListener('visibilitychange', () => { if (document.hidden) stopFlow(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') stopFlow(); });
window.addEventListener('pagehide', stopFlow);
stopFlow(); showFlow();

document.querySelectorAll('[data-check]').forEach((button) => button.addEventListener('click', () => {
  const correct = button.dataset.check === 'correct';
  document.querySelectorAll('[data-check]').forEach((choice) => choice.setAttribute('aria-pressed', String(choice === button)));
  $o('overview-feedback').className = 'feedback ' + (correct ? 'success' : 'retry');
  $o('overview-feedback').textContent = correct ? '对。笔记给出处，历史提供过去的证据，环境核查确认现在。直接读取也可能暂不可见，不能把空结果或旧 PASS 当作完成证明。' : '再看“历史”节点与索引延迟分支：搜索为空不证明删除，a17 的结果也不能替代 b24 的验证。';
}));
function setOverviewTheme(theme) {
  document.documentElement.dataset.theme = ['control', 'journal', 'mori'].includes(theme) ? theme : 'control';
  $o('overview-theme').value = document.documentElement.dataset.theme;
}
try { setOverviewTheme(localStorage.getItem('kuma-context-overview-theme') || JSON.parse(localStorage.getItem('kuma-codex-context-lab-v1') || '{}').theme); } catch { setOverviewTheme('control'); }
$o('overview-theme').addEventListener('change', () => {
  setOverviewTheme($o('overview-theme').value);
  try { localStorage.setItem('kuma-context-overview-theme', $o('overview-theme').value); } catch { /* Optional preference only. */ }
});
