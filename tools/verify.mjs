// Quality gate: runs every lesson's reference solutions and wrong answers through the REAL runner in REAL Python (Pyodide).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const lessonDir = path.join(root, 'src', 'lessons');

const ctx = { LESSONS: [], R: String.raw };
vm.createContext(ctx);
for (const f of fs.readdirSync(lessonDir).filter(f => f.endsWith('.js')).sort()) {
  vm.runInContext(fs.readFileSync(path.join(lessonDir, f), 'utf8'), ctx, { filename: f });
}
function fix(o){ if(typeof o==='string') return o.split('$@{').join('${'); if(Array.isArray(o)) return o.map(fix); if(o&&typeof o==='object'){ for(const k of Object.keys(o)) o[k]=fix(o[k]); } return o; }
const LESSONS = fix(ctx.LESSONS);

const PYO_LOCAL = process.env.PYO_LOCAL;
const py = await (PYO_LOCAL ? loadPyodide({ indexURL: PYO_LOCAL }) : loadPyodide());
if (PYO_LOCAL) await py.loadPackage(['sqlite3', 'pandas', 'numpy']);
py.runPython(fs.readFileSync(path.join(root, 'src', 'runner.py'), 'utf8'));
const runJob = py.globals.get('run_job');
const job = (code, inputs = [], cases = [], files = undefined) => JSON.parse(runJob(JSON.stringify({ code, inputs, cases, files })));

let problems = 0, checks = 0;
const bad = (id, msg) => { problems++; console.log(`  ✗ [${id}] ${msg}`); };
const passAll = (r) => r.cases.length > 0 && r.cases.every(c => !c.err && c.results.every(t => t.ok));
const failsSome = (r) => r.cases.some(c => c.err || c.results.some(t => !t.ok));

function checkTask(id, label, t, starterField) {
  const cases = t.cases;
  if (!cases || !cases.length) return bad(id, `${label}: no cases`);
  checks++;
  const sol = job(t.sol, [], cases, t.files);
  if (!passAll(sol)) { bad(id, `${label}: reference solution FAILS tests: ` + JSON.stringify(sol.cases.map(c => c.err || c.results.filter(x => !x.ok)))); if (process.env.DBG) console.log(JSON.stringify(sol.cases.map(c=>c.out || c.output || c)).slice(0,1500)); }
  for (const [i, w] of (t.wrong || []).entries()) {
    checks++;
    if (!failsSome(job(w, [], cases, t.files))) bad(id, `${label}: wrong answer #${i} PASSES (tests too weak)`);
  }
  if (!(t.wrong || []).length) bad(id, `${label}: no wrong answers listed`);
  const start = starterField ? job(starterField, [], cases, t.files) : null;
  if (start && passAll(start)) bad(id, `${label}: starter/broken code already passes`);
  if (!t.hints || t.hints.length < 3) bad(id, `${label}: needs at least 3 hints (4th = solution is automatic)`);
  // inputs given to Cast must satisfy the first case
}

const ONLY = process.env.ONLY ? new RegExp(process.env.ONLY) : null;
const taught = new Set();
const ids = new Set();
for (const L of LESSONS) {
  if (ids.has(L.id)) bad(L.id, 'duplicate id'); ids.add(L.id);
  for (const r of L.requires || []) if (!taught.has(r)) bad(L.id, `requires "${r}" which no earlier lesson teaches`);
  for (const t of L.teaches || []) taught.add(t);
  if (ONLY && !ONLY.test(L.id)) continue;
  console.log(`${L.id}  ${L.title}`);
  if (!L.story || !L.power || !L.codex) bad(L.id, 'missing story/power/codex');
  if (L.power && (!L.power.can?.length || !L.power.expand || !L.power.where || !L.power.next)) bad(L.id, 'incomplete power-up panel');

  if (!L.kind || L.kind === 'normal') {
    if (!L.concept || !L.predict || !L.cast || !L.write) bad(L.id, 'normal lesson missing concept/predict/cast/write');
    if (L.predict) {
      if (L.predict.code) {
        const r = job(L.predict.code, L.predict.inputs || [], [], L.predict.files);
        console.log(`    predict output: ${JSON.stringify((r.display.out || r.display.err?.text || '').slice(0, 90))}  -> answer: "${L.predict.opts[L.predict.ans]}"`);
      }
    }
    if (L.cast) {
      const r = job(L.cast.code, L.cast.inputs || [], [], L.cast.files);
      if (L.cast.expectError ? !r.display.err : r.display.err) bad(L.id, `cast ${L.cast.expectError ? 'should error but did not' : 'errored: ' + r.display.err?.text}`);
    }
    if (L.bug) {
      const t = { files: L.bug.files, cases: L.bug.cases, sol: L.bug.sol, wrong: L.bug.wrong, hints: ['','','', L.bug.sol] };
      checkTask(L.id, 'bug', t, L.bug.broken);
      if (L.bug.inputs && !L.bug.cases) bad(L.id, 'bug inputs without cases');
    }
    if (L.write) checkTask(L.id, 'write', L.write, L.write.starter);
  } else {
    const phases = L.phases || [];
    if (!phases.length) bad(L.id, 'no phases');
    phases.forEach((p, i) => {
      if (p.type === 'mcq') {
        if (p.ans < 0 || p.ans >= p.opts.length) bad(L.id, `phase ${i} bad answer index`);
        if (p.code) {
          const r = job(p.code, p.inputs || [], [], p.files);
          console.log(`    phase ${i + 1} mcq output: ${JSON.stringify((r.display.out || r.display.err?.text || '').slice(0, 80))}  -> answer: "${p.opts[p.ans]}"`);
        }
      } else if (p.type === 'write') checkTask(L.id, `phase ${i + 1} write`, p, p.starter);
      else bad(L.id, `phase ${i} unknown type`);
    });
  }
}
console.log(`\n${LESSONS.length} lessons, ${checks} checks, ${problems} problem(s).`);
process.exit(problems ? 1 : 0);
