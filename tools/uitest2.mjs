// Failure-path UI tests: hint ladder, failed Gap Check -> Training Grounds -> retake, save persistence.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom'; import { loadPyodide } from 'pyodide';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const py = await loadPyodide(); py.runPython(fs.readFileSync(path.join(root, 'src', 'runner.py'), 'utf8')); const runJob = py.globals.get('run_job');
const errors = []; const vc = new VirtualConsole(); vc.on('jsdomError', e => { if (!/not implemented/i.test(e.message)) errors.push(e.message); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
function boot(seed) {
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://example.com/', virtualConsole: vc,
    beforeParse(w) { w.__PYRUN__ = j => Promise.resolve(JSON.parse(runJob(j))); w.scrollTo = () => {}; w.matchMedia = () => ({ matches: false }); if (seed) w.localStorage.setItem('spellbook-syntax-v1', JSON.stringify(seed)); } });
  return dom.window;
}
let fails = 0; const assert = (c, m) => { if (!c) { fails++; console.log('  ✗', m); } else console.log('  ✓', m); };
const mk = w => { const d = w.document; const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
  const wait = async (fn, what, ms = 8000) => { const t0 = Date.now(); for (;;) { const v = fn(); if (v) return v; if (Date.now() - t0 > ms) throw new Error('timeout ' + what); await sleep(15); } };
  const bt = t => $$('button').find(b => b.textContent.trim().startsWith(t) && !b.disabled);
  const click = async t => { (await wait(() => bt(t), t)).click(); await sleep(8); };
  const code = s => { const ta = $('.ed-ta'); ta.value = s; ta.dispatchEvent(new w.Event('input', { bubbles: true })); };
  const run = async lbl => { (await wait(() => bt(lbl), lbl)).click(); await wait(() => !$('.runbtn[data-busy]'), 'run'); await sleep(10); };
  return { d, $, $$, wait, bt, click, code, run }; };

// ---- Test A: hint ladder + MP reduction on r0-02 write
{
  console.log('A. hint ladder');
  const w = boot({ v:1, name:'T', mp:0, done:{ 'r0-01': { mp:9, hints:0, ts:1 } }, ach:{}, bestiary:{}, echo:{day:'',n:0}, echoSeen:{}, stats:{}, codexSeen:{}, settings:{sound:false,vib:false}, lastVisit:Date.now() });
  const t = mk(w); const SB = w.__SB__; await t.wait(() => SB, 'boot');
  SB.openLesson('r0-02'); await t.click('Begin'); await t.click('Got it');
  const L = SB.LESSONS.find(l => l.id === 'r0-02');
  t.$$('.opt').find(o => o.textContent === L.predict.opts[L.predict.ans]).click(); await t.click('Continue');
  await t.run('⚡ Cast'); await t.click('Continue');
  // bug step
  t.code(L.bug.sol); await t.run('⚡ Cast & check'); await t.click('Continue');
  // write step with hints
  await t.click('💡 Hint'); await t.click('💡 Hint');
  assert(t.$$('.hintbox').length === 2, 'two hints revealed');
  t.code(L.write.sol); await t.run('⚡ Cast & check');
  assert(t.$('.note.good'), 'solution passes after hints');
  await t.click('Finish lesson'); await t.wait(() => t.$('.mpgain'), 'power');
  const before = SB.S().mp; await t.click('🗺️ Map'); await t.wait(() => SB.S().done['r0-02'], 'saved');
  const gained = SB.S().mp - before;
  assert(gained >= 5 && gained <= 8, 'MP reduced for hints (gained ' + gained + ', max is 10)');
  assert(SB.S().done['r0-02'].hints === 2, 'hint count recorded');
}
// ---- Test B: failed gap check -> Training Grounds -> retake -> pass (no Gap-Free on retake)
{
  console.log('B. gap check fail then retake');
  const all = {}; const w0 = boot(); const ids = w0.__SB__.LESSONS.map(l => l.id).filter(id => id !== 'r1-24'); ids.forEach(id => all[id] = { mp:5, hints:0, ts:1 });
  const w = boot({ v:1, name:'T', mp:300, done:all, ach:{}, bestiary:{}, echo:{day:'',n:0}, echoSeen:{}, stats:{}, codexSeen:{}, settings:{sound:false,vib:false}, lastVisit:Date.now() });
  const t = mk(w); const SB = w.__SB__; await t.wait(() => SB, 'boot'); const L = SB.LESSONS.find(l => l.id === 'r1-24');
  SB.openLesson('r1-24'); await t.click('Begin');
  for (const p of L.phases) {
    if (p.type === 'mcq') { const bad = t.$$('.opt').find(o => o.textContent !== p.opts[p.ans]); bad.click(); await sleep(5); }
    else { t.code(p.sol); await t.run('⚡ Cast & check'); }
    (await t.wait(() => t.$$('.nav .btn').find(b => !b.disabled), 'nav')).click(); await sleep(8);
  }
  assert(/Training Grounds/.test(t.$('#view').textContent), 'failing shows Training Grounds');
  assert(t.$$('button').some(b => b.textContent.startsWith('↺')), 'Training Grounds lists lessons to revisit');
  assert(!SB.S().done['r1-24'], 'gap check not marked done when failed');
  await t.click('Retake the trial');
  await t.click('Begin');
  for (const p of L.phases) {
    if (p.type === 'mcq') t.$$('.opt').find(o => o.textContent === p.opts[p.ans]).click(); else { t.code(p.sol); await t.run('⚡ Cast & check'); }
    await sleep(8); (await t.wait(() => t.$$('.nav .btn').find(b => !b.disabled), 'nav')).click(); await sleep(8);
  }
  assert(/Gap Check passed/.test(t.$('#view').textContent), 'retake can pass');
  await t.click('Continue'); await t.click('Next lesson'); await t.wait(() => SB.S().done['r1-24'], 'saved'); await sleep(30);
  assert(!SB.S().ach.gap_free, 'Gap-Free NOT granted on a retake');
}
// ---- Test C: persistence across reload
{
  console.log('C. persistence');
  const w = boot({ v:1, name:'Zed', mp:150, done:{ 'r0-01': { mp:9, hints:0, ts:1 } }, ach:{ first_spell: 1 }, bestiary:{}, echo:{day:'',n:0}, echoSeen:{}, stats:{}, codexSeen:{}, settings:{sound:false,vib:false}, lastVisit:Date.now() });
  const t = mk(w); await t.wait(() => w.__SB__, 'boot');
  assert(w.__SB__.S().name === 'Zed' && /Welcome back, Zed/.test(t.$('.hero h1').textContent), 'returning player skips welcome and is greeted by name');
  assert(/Level 2/.test(t.$('.hero .sub').textContent), 'level computed from saved MP');
}
console.log(errors.length ? '\nJS errors: ' + errors.join('; ') : '\nno JS errors'); console.log(fails || errors.length ? 'FAILED' : 'ALL FAILURE-PATH TESTS PASSED'); process.exit(fails || errors.length ? 1 : 0);
