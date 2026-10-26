# Authoring lessons

## Schema (normal lesson)
```js
LESSONS.push({
  id:'r5-07', realm:5, n:7, title:'...',
  teaches:['tag-a'], requires:['earlier-tag'],
  story:'...',
  concept:{ html:'...', analogy:'...', example:'...' },
  predict:{ code:'...', q:'What prints?', opts:['a','b','c'], ans:1, why:'...' },
  cast:{ code:'...', task:'...' },
  bug:{ broken:'...', task:'...', cases:[...], sol:'...', wrong:['...'] },
  write:{ prompt:'...', starter:'...', inputs:[...],
          cases:[{ inputs:[...], tests:["lines==['x']"], files:{} }],
          sol:'...', wrong:['...'], hints:['h1','h2','h3','<solution>'] },
  power:{ can:[...], expand:'...', where:'...', next:'...' },
  codex:{ title:'...', body:'...', snip:'...' }
});
```
Boss: `kind:'boss', boss:{name,hp}, phases[]`. Gap check: `kind:'gap', passPct:80`, multiple-choice phases only. Phase `tags` must be lesson ids.

## Test expressions
Available names: `out`, `lines`, `g` (player variables), `src`, `inputs`, `err`, `last(n)`, `norm()`, `re`, `read`, `exists`, `listdir`, `os`, `json`.

## Rules the quality gate enforces
- `sol` passes every test; every `wrong[]` entry fails at least one test.
- `bug.broken` fails; the starter does not already pass.
- Predict answers equal the real output (single-line output).
- At least 3 hints; the last hint is the solution.
- Every `requires` tag is taught earlier.

Write wrong answers that represent real mistakes **and** lazy shortcuts (printing the expected output directly). Add a source check (`'"= int(" in src'`-style) when needed to catch shortcuts, and avoid tokens that also match `print(`.

## Realm 14 pipeline
Realm 14 lessons come from `tools/spec14a.py` through `spec14e.py` using helpers in `tools/gen14.py`. Reference solutions are run locally (`tools/run_local.py`) so expected output is computed, not typed. Wrong answers are `(old, new)` replace pairs applied to the solution. Each spec writes `src/lessons/realm_14*.js`.

## Workflow
```bash
cd tools
npm install
node verify.mjs            # or: ONLY='^r14-' PYO_LOCAL=/path/to/pyodide/ node verify.mjs
node build.mjs
node uitest.mjs            # optional full play-through (~20 min)
```
Do not run verify and uitest at the same time.
