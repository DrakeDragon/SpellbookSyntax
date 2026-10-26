// End-to-end UI test: loads the built index.html in jsdom, uses real Python (Pyodide in node),
// and plays EVERY lesson through the actual UI like a player would.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';
import { loadPyodide } from 'pyodide';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const PYO_LOCAL = process.env.PYO_LOCAL;
const py = await (PYO_LOCAL ? loadPyodide({ indexURL: PYO_LOCAL }) : loadPyodide());
if (PYO_LOCAL) await py.loadPackage(['sqlite3', 'pandas', 'numpy']);
py.runPython(fs.readFileSync(path.join(root, 'src', 'runner.py'), 'utf8'));
const runJob = py.globals.get('run_job');

const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { if (!/not implemented/i.test(e.message)) errors.push('jsdomError: ' + e.message); });
vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));

const dom = new JSDOM(html, {
  runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://example.com/', virtualConsole: vc,
  beforeParse(w) {
    w.__PYRUN__ = (jobStr) => Promise.resolve(JSON.parse(runJob(jobStr)));
    w.scrollTo = () => {};
    w.matchMedia = w.matchMedia || (() => ({ matches: false }));
  },
});
const { window } = dom; const { document } = window;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const $ = s => document.querySelector(s); const $$ = s => [...document.querySelectorAll(s)];
async function waitFor(fn, what, ms = 8000) { const t0 = Date.now(); for (;;) { const v = fn(); if (v) return v; if (Date.now() - t0 > ms) throw new Error('timeout waiting for ' + what); await sleep(15); } }
const btnByText = (txt, root = document) => [...root.querySelectorAll('button')].find(b => b.textContent.trim().startsWith(txt) && !b.disabled);
async function clickText(txt, what) { const b = await waitFor(() => btnByText(txt), what || ('button "' + txt + '"')); b.click(); await sleep(5); return b; }
async function closeModals() { for (let i = 0; i < 6; i++) { const o = $('#overlay'); if (o && o.classList.contains('on')) { const b = o.querySelector('button'); if (b) b.click(); await sleep(30); } else break; } }
function setCode(sol) { const ta = $('.ed-ta'); ta.value = sol; ta.dispatchEvent(new window.Event('input', { bubbles: true })); }
async function castAndCheck() { const b = await waitFor(() => btnByText('⚡ Cast & check'), 'cast&check'); b.click(); await waitFor(() => !$('.runbtn[data-busy]'), 'run to finish'); await sleep(10); }

const SB = window.__SB__;
await waitFor(() => SB, 'boot');
let fails = 0; const log = (...a) => console.log(...a);
const assert = (c, m) => { if (!c) { fails++; log('  ✗ ASSERT:', m); } };

// welcome
assert($('h1') && /SPELLBOOK/.test($('h1').textContent), 'welcome screen shows title');
$('input[type=text]').value = 'Tim'; await clickText('Open the Spellbook');
assert(SB.S().name === 'Tim', 'name saved');
assert(/Welcome, Tim/.test($('.hero h1').textContent), 'map greets by name');

async function playLesson(L) {
  if (SB.ui.view === 'map') { const b = await waitFor(() => btnByText('▶'), 'continue button'); b.click(); await sleep(10); }
  assert(SB.ui.lesson && SB.ui.lesson.id === L.id, 'opened the expected lesson ' + L.id);
  const steps = SB.ui.steps; let guard = 0;
  while (guard++ < 60) {
    await closeModals();
    const st = SB.ui.steps[SB.ui.si]; if (!st) break;
    const t = st.t;
    if (t === 'story') await clickText('Begin');
    else if (t === 'concept') await clickText('Got it');
    else if (t === 'predict') {
      const q = L.predict; const wrongIdx = q.opts.findIndex((_, i) => i !== q.ans);
      // first try a wrong answer to test feedback, then the right one
      const wrong = $$('.opt').find(o => o.textContent === q.opts[wrongIdx]); wrong.click(); await sleep(5);
      assert(wrong.classList.contains('bad'), 'wrong predict marked bad');
      const good = $$('.opt').find(o => o.textContent === q.opts[q.ans]); good.click(); await sleep(5);
      assert(good.classList.contains('good'), 'right predict marked good');
      await clickText('Continue');
    }
    else if (t === 'cast') {
      const rb = await waitFor(() => btnByText('⚡ Cast'), 'cast btn'); rb.click(); await waitFor(() => !$('.runbtn[data-busy]'), 'cast finish'); await sleep(10);
      assert($('.out'), 'cast shows output panel');
      await clickText('Continue');
    }
    else if (t === 'bug' || t === 'write') {
      const spec = t === 'bug' ? L.bug : L.write;
      // try the wrong answer first -> should NOT pass
      setCode(spec.wrong[0]); await castAndCheck();
      assert(!$('.note.good'), `${L.id} ${t}: wrong answer must not pass`);
      assert($$('.checklist li.no').length > 0 || $('.out pre.err'), `${L.id} ${t}: failure feedback shown`);
      setCode(spec.sol); await castAndCheck();
      assert($('.note.good'), `${L.id} ${t}: solution should pass`);
      const nb = $$('.nav .btn').find(b => !b.disabled); assert(nb, 'nav enabled after pass'); nb.click(); await sleep(5);
    }
    else if (t === 'phase') {
      const p = L.phases[st.i];
      if (p.type === 'mcq') {
        if (L.kind === 'gap') { const good = $$('.opt').find(o => o.textContent === p.opts[p.ans]); good.click(); }
        else { const wi = p.opts.findIndex((_, i) => i !== p.ans); $$('.opt').find(o => o.textContent === p.opts[wi]).click(); await sleep(3); $$('.opt').find(o => o.textContent === p.opts[p.ans]).click(); }
        await sleep(5);
      } else { setCode(p.sol); await castAndCheck(); assert($('.note.good'), `${L.id} phase ${st.i + 1}: solution should pass`); }
      const nb = await waitFor(() => $$('.nav .btn').find(b => !b.disabled), 'phase nav'); nb.click(); await sleep(5);
    }
    else if (t === 'result') { await clickText('Continue'); }
    else if (t === 'power') {
      const mpText = $('.mpgain').textContent; assert(/\+\d+ MP|Practice/.test(mpText), 'power-up shows MP: ' + mpText);
      const nb = btnByText('Next lesson') || btnByText('Finish');
      const before = SB.S().mp; nb.click();
      await waitFor(() => SB.S().done[L.id], 'lesson recorded'); await sleep(20); await closeModals();
      log(`  ${L.id} done  (+${SB.S().mp - before} MP, total ${SB.S().mp}, level ${SB.levelFor(SB.S().mp)})`);
      return true;
    }
  }
  assert(false, L.id + ' did not finish'); return false;
}

for (const L of SB.LESSONS) await playLesson(L);

const S = SB.S();
log('\n--- RESULTS ---');
log('lessons done:', Object.keys(S.done).length, '/', SB.LESSONS.length);
log('MP:', S.mp, ' level:', SB.levelFor(S.mp));
log('achievements:', Object.keys(S.ach).join(', '));
log('bestiary:', Object.keys(S.bestiary).join(', '));
assert(Object.keys(S.done).length === SB.LESSONS.length, 'all lessons completed');
assert(S.ach.first_spell && S.ach.realm0 && S.ach.realm1 && S.ach.realm2 && S.ach.realm3 && S.ach.apprentice_seal && S.ach.hired_hand && S.ach.loop_survivor && S.ach.gap_free, 'key achievements granted');
assert(['SyntaxError','NameError','TypeError','IndentationError','SpellTimeout'].every(e => S.bestiary[e]), 'bestiary has the expected monsters');

// views render without throwing
for (const v of ['map', 'echo', 'codex', 'trophies', 'more', 'sandbox', 'settings']) { SB.go(v); assert($('#view').children.length > 0, 'view renders: ' + v); }
// echoes flow
SB.go('echo'); await clickText('⚡ Start 5 Echoes'); await sleep(10);
for (let i = 0; i < 5; i++) {
  const q = $$('.opt'); assert(q.length >= 2, 'echo question has options'); q[0].click(); await sleep(10);
  const nb = $$('.nav .btn').find(b => !b.disabled); if (nb) { nb.click(); await sleep(10); }
  await closeModals();
}
await sleep(80); assert(/Echoes done/.test($('#view').textContent), 'echoes finish screen');
// save/restore roundtrip
const saved = JSON.stringify(SB.S()); assert(JSON.parse(window.localStorage.getItem('spellbook-syntax-v1')).mp === SB.S().mp, 'save persisted to localStorage');

log('\nJS/console errors captured:', errors.length); errors.slice(0, 10).forEach(e => log('  ', e));
log(fails || errors.length ? `\nFAILED (${fails} assertion failures, ${errors.length} JS errors)` : '\nALL UI TESTS PASSED');
process.exit(fails || errors.length ? 1 : 0);
