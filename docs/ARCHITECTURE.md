# Architecture

## Build model
`tools/build.mjs` reads every `src/lessons/*.js` (each pushes objects onto `LESSONS`), the engine `src/index.template.html` and the Python runner `src/runner.py`, and writes one `index.html` with the lessons and runner embedded as JSON. In lesson snippets, `$@{` stands for `${` and is converted at build time.

## Runtime
- **Engine (`index.template.html`)**: a no-framework single-page app. State object `S` persists to `localStorage` (`spellbook-syntax-v1`). Views: Quest map, lesson player, Echoes, Codex, Trophies, More (Sandbox, Bestiary, Portfolio, Settings).
- **Python**: Pyodide 0.27.7 in a Blob Web Worker (main-thread fallback). The page sends a job (code, inputs, files, tests) and receives output, error and test results.
- **Runner (`runner.py`)**: executes code with `sys.settrace` for a 4-second timeout, caps output at 20,000 characters, runs every case in a fresh temporary directory (optionally pre-seeded with files), echoes prompt and answer for `input()`, evaluates test expressions, auto-loads packages with `loadPackagesFromImports`, and sweeps garbage after each run.

## Progression
- **MP**: 9 per normal lesson, 23 per boss, 36 per gap check (perfect run), reduced by hints and retries.
- **Levels**: 54, thresholds keyed to cumulative perfect-run MP; beyond the last, MP keeps counting.
- **Ranks**: Apprentice, Journeyman, Adept, Artisan, Archmage, Guildmaster.
- **Missions**: `MISSION_IDS` lists lessons whose solutions are captured into the Portfolio.
- **Revisit buttons**: boss and gap phases carry `tags` that are lesson ids; the engine looks them up in `LESSONS`.

## Lesson kinds
- normal: story, concept, predict, cast, bug, write, power-up, codex.
- `boss`: `boss:{name,hp}` plus `phases[]`.
- `gap`: `passPct:80`, multiple-choice phases only.
