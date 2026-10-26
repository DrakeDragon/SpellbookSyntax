<div align="center">

# 📖 Spellbook Syntax

### Learn real Python by casting it.

A phone-first LitRPG that teaches Python from your very first `print()` to job-ready skills, entirely inside your browser.
No install. No account. No server. Every line you write runs as **real Python**.

![Lessons](https://img.shields.io/badge/lessons-532-7c4dff)
![Realms](https://img.shields.io/badge/realms-15-00bcd4)
![Levels](https://img.shields.io/badge/levels-54-e91e8c)
![Python](https://img.shields.io/badge/Python-3.12%20via%20Pyodide%200.27.7-3776ab)
![Build](https://img.shields.io/badge/build-single%20HTML%20file-success)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

</div>

---

## Table of contents

1. [What is this?](#what-is-this)
2. [Quick start](#quick-start)
3. [Host it on GitHub Pages](#host-it-on-github-pages)
4. [How a lesson works](#how-a-lesson-works)
5. [Game systems](#game-systems)
6. [The curriculum: 15 realms](#the-curriculum-15-realms)
7. [Levels, ranks and achievements](#levels-ranks-and-achievements)
8. [Portfolio export](#portfolio-export)
9. [How the Python runs](#how-the-python-runs)
10. [Quality gate: how every lesson is verified](#quality-gate-how-every-lesson-is-verified)
11. [Project layout](#project-layout)
12. [Developer commands](#developer-commands)
13. [Adding or changing lessons](#adding-or-changing-lessons)
14. [Known limits](#known-limits)
15. [Privacy](#privacy)
16. [Version history](#version-history)
17. [License](#license)

---

## What is this?

**Spellbook Syntax** is an educational RPG in a single HTML file. You play an apprentice who finds a spellbook whose spells are Python. Each lesson is a short story beat, a concept, a prediction, a guided cast, a bug to fix and a real coding challenge. You level up, defeat bosses, collect achievements and end with a portfolio you can export.

- **Complete beginner to job-level.** Realm 0 starts with "what is code?". Realm 13 is a full interview arena. Realm 14 splits into four career specialisations.
- **Real Python, not a simulation.** Code runs in [Pyodide](https://pyodide.org) (CPython compiled to WebAssembly). Errors, tracebacks, imports, files and the standard library are the real thing.
- **Built for phones.** Large tap targets, a code editor that behaves on touch keyboards, one-hand navigation.
- **One file.** `index.html` is the whole game: engine, 532 lessons and the Python runner. Drop it anywhere that serves static files.

## Quick start

**Play it:** open `index.html` in a modern browser (Chrome, Edge, Safari, Firefox).
The first launch downloads the Python engine once (about 10 MB) and the browser caches it. An internet connection is needed for that first download.

> Opening `index.html` straight from your disk works in most browsers. If your browser blocks Web Workers on `file://`, the game automatically falls back to running Python on the main thread. Hosting it (below) is the smoothest option.

## Host it on GitHub Pages

1. Create a new GitHub repository and upload everything in this package (or push it with git).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and folder `/ (root)`, then **Save**.
4. After a minute your game is live at `https://<your-username>.github.io/<repo-name>/`.

The `.nojekyll` file is included so GitHub serves the file exactly as it is. Full steps, custom domains and troubleshooting are in [`docs/DEPLOY.md`](docs/DEPLOY.md).

## How a lesson works

Every normal lesson follows the same loop:

| Step | What happens |
|---|---|
| **Story** | A short narrative beat sets the scene. |
| **Concept** | The idea in plain words, an analogy and an example. |
| **Predict** | You guess what a snippet prints before it runs, then see the real result. |
| **Cast** | You run a guided snippet and change it. |
| **Bug Hunt** | Broken code. Read the error, find the bug, fix it. |
| **Write** | A real challenge. Your code is tested against hidden cases. A four-step hint ladder is available (the last hint is the solution, at a Mastery Point cost). |
| **Power-Up** | What you can now do, how it grows, where it is used in real jobs, what comes next. |
| **Codex card** | A reusable reference card is added to your Codex. |

Bosses combine several phases (multiple choice and write challenges) and have health. **Gap Checks** are pass-mark quizzes (80%) that point you back to the exact lessons you should revisit.

## Game systems

- **Mastery Points (MP) and levels.** First-try passes, fewer hints, bosses and Echoes earn MP. 54 levels across six ranks.
- **Bug Bestiary.** Every distinct real error you hit becomes a monster you can study.
- **Echoes.** Spaced-repetition review questions that resurface what you learned.
- **Codex.** A reference of cards unlocked by lessons.
- **Sandbox.** A free editor to experiment with.
- **Files panel.** Shows the sandbox folder a program runs in, for the file, module and package lessons.
- **Achievements.** 78 trophies in bronze, silver and gold tiers.
- **Realm themes.** Each realm has its own colour theme and skyline.
- **Save code.** Progress lives in the browser; Settings gives you a code to back up or move to another device.

## The curriculum: 15 realms

532 lessons, 46 portfolio missions, 15 bosses, 14 gap checks. The full lesson-by-lesson list is in [`docs/CURRICULUM.md`](docs/CURRICULUM.md).

| Realm | Title | Lessons | Highlights |
|---:|---|---:|---|
| 0 | The Awakening | 12 | What code is, `print`, strings, calculator, comments, reading your first error |
| 1 | Cantrips: Values & Variables | 24 | Variables, types, input, f-strings, type conversion |
| 2 | Runes of Choice: Decisions | 22 | `if/elif/else`, comparisons, logic, validation, shipping-calculator mission |
| 3 | Loops of Repetition | 26 | `while`, `for`, `range`, `break/continue`, accumulators, random, simulations |
| 4 | The Satchel: Collections | 44 | Lists, slicing, tuples, dicts, sets, comprehensions, sorting; Inventory and Gradebook missions |
| 5 | Scrolls & Ink: Text | 24 | String methods, formatting, ciphers, regex, CSV parsing; Contact Extractor, Receipt Printer |
| 6 | The Spell Forge: Functions | 36 | Parameters, scope, `*args/**kwargs`, lambda, closures, dispatch tables |
| 7 | The Wards: Recursion & Errors | 28 | Recursion, memoisation, `try/except`, raising, defensive code, debugging method |
| 8 | The Archive: Files, CSV & JSON | 42 | Reading/writing files, paths, `csv`, `json`; To-Do Keeper, Sales Report |
| 9 | The Workshop: Modules & Stdlib | 44 | Imports, `collections`, `itertools`, `functools`, `datetime`, `pathlib`, your own packages, `logging`, `Decimal` |
| 10 | The Guildhall: Classes & Objects | 35 | Classes, properties, inheritance, composition, mixins, dunder methods |
| 11 | The Iterator Gate | 24 | Dataclasses, enums, generators, decorators, context managers, type hints |
| 12 | The Master Gate: Professional Tools | 71 | venvs, git internals, testing and mocks, linting, argparse CLIs, HTTP clients, pandas, SQL, automation |
| 13 | The Interview Arena | 58 | Big-O, data structures, graph/DP/greedy patterns, mock interviews, clean architecture, Portfolio mission |
| 14 | The Four Doors | 42 | Four specialisation guilds: Clockwork (async), Web, Data, Craft |

### Realm 14: The Four Doors (optional career tracks)

| Guild | What you build | Mission |
|---|---|---|
| **Clockwork** | Generators, then async from first principles: coroutines, a virtual-clock event loop, `gather`, timeouts and cancellation, channels, locks and race conditions | Download Simulator |
| **Web** | HTTP request parsing and responses, routing, query strings, decorator routes, middleware, password hashing, validation, REST CRUD | Mini Web Framework |
| **Data** | NumPy arrays, axes and broadcasting, masks, statistics, linear regression, k-NN, train/test split, precision/recall, scaling | House Price Predictor |
| **Craft** | Dataclasses, enums with `match`, type hints, context managers, retry decorator, logging, `itertools`, property-style tests, event bus | Task Tracker Core |

Then the **Four-Door Chimera** boss and the **Four Doors** gap check.

## Levels, ranks and achievements

Levels run 1 to 54 and sit in six ranks:

| Ranks | Levels |
|---|---|
| Apprentice | 1–8 |
| Journeyman | 9–21 |
| Adept | 22–34 |
| Artisan | 35–45 |
| Archmage | 46–50 |
| Guildmaster | 51–54 |

Every level has a title and a plain-language "You can now…" line, so progress maps to real ability. Level thresholds are tied to Mastery Points earned on a perfect run.

Achievements include First Spell, Spell-Slinger, Monster Collector, Echo Keeper, Codex Keeper, Sandbox Tinkerer, Portfolio Ready, Interview Survivor, Chimera Tamer, Four Doors Seal, Guildmaster and a trophy for each Realm 14 mission (Clockmaker, Server Smith, Data Diviner, Taskmaster).

## Portfolio export

Each mission you finish is captured. **More → Portfolio** shows your projects, and the export downloads `my-python-portfolio.html`, a standalone page containing your mission projects and code, ready to show an employer or drop into a GitHub repo of your own.

## How the Python runs

- **Engine:** Pyodide 0.27.7 loaded from jsDelivr (the URL is the `PYO` constant near the top of the script).
- **Isolation:** Python runs in a Web Worker created from a Blob, so a runaway loop cannot freeze the page. If workers are unavailable it falls back to the main thread.
- **Runner (`src/runner.py`):** `sys.settrace`-based 4-second timeout, 20,000-character output cap, a **fresh sandbox folder for every run** (optionally pre-filled with files for lessons that need them), simulated `input()` for tests, and a post-run garbage sweep so stray warnings cannot leak between runs.
- **Packages:** `numpy`, `pandas` and `sqlite3` are fetched by Pyodide the first time a lesson imports them (a few seconds, then cached).
- **Tests:** a challenge is a list of cases, each with simulated inputs, optional seeded files and test expressions over the program output (`out`, `lines`), the player's variables (`g`), the source (`src`), and helpers (`last`, `norm`, `re`, `read`, `exists`, `listdir`, `json`).

## Quality gate: how every lesson is verified

`tools/verify.mjs` runs all 532 lessons through real Python and refuses to pass unless:

- the reference solution passes **every** test,
- every listed wrong answer **fails** at least one test (so shortcuts like hard-coding the output are caught),
- the broken Bug Hunt code fails and the starter code does not already pass,
- every Predict and quiz answer matches the real output of the code,
- there are at least three hints and the last one is the solution,
- every `requires` tag was taught by an earlier lesson (no forward references).

Current state: **532 lessons, 3,106 checks, 0 problems.**

`tools/uitest.mjs` plays **every lesson through the real UI** (jsdom plus real Python): story, predict, cast, bug, write, power-up, achievements, level-ups, trophies and the portfolio. Current state: **all UI tests pass, 532/532, level 54 reached.** `tools/uitest2.mjs` covers failure paths: hints, a failed Gap Check, retake and persistence.

## Project layout

```
index.html                 The built game (single file). Host this.
src/
  index.template.html      Engine: UI, levels, achievements, themes, portfolio
  runner.py                Python-side sandbox, timeout and test checker
  lessons/                 Lesson data, one or more files per realm
tools/
  build.mjs                Builds index.html from the template and lessons
  verify.mjs               Quality gate (real Python)
  uitest.mjs               Full UI play-through
  uitest2.mjs              Failure-path UI tests
  gen14.py                 Authoring helpers for Realm 14
  spec14a..e.py            Realm 14 lesson specs (generate src/lessons/realm_14*.js)
  run_local.py             Local runner used by the generators
docs/
  CURRICULUM.md            Every lesson, by realm
  ARCHITECTURE.md          How the engine works
  AUTHORING.md             How to write lessons
  DEPLOY.md                GitHub Pages and other hosting
  CHANGELOG.md             Version history
.github/workflows/ci.yml   Rebuilds index.html and fails if it is out of date
```

## Developer commands

Run from the `tools/` folder. Node 18+ is required.

```bash
npm install                 # jsdom + pyodide (for testing only)
node build.mjs              # writes ../index.html from src/
node verify.mjs             # quality gate for all lessons
ONLY='^r14-' node verify.mjs   # verify only lessons whose id matches a regex
node uitest.mjs             # full play-through (about 20 minutes)
node uitest2.mjs            # failure paths
```

**Full verification needs the numpy, pandas and sqlite3 packages.** Download the full Pyodide 0.27.7 distribution, extract it, and point the tools at it:

```bash
PYO_LOCAL=/path/to/pyodide/ node verify.mjs
```

Without `PYO_LOCAL`, lessons that import those packages cannot load them in Node.

**Always rebuild after editing anything in `src/`** and commit the regenerated `index.html`. CI fails if it is out of date.

## Adding or changing lessons

See [`docs/AUTHORING.md`](docs/AUTHORING.md) for the full lesson schema. In short: add a lesson object to a file in `src/lessons/`, run `node verify.mjs`, then `node build.mjs`.

Realm 14 is generated from Python specs: expected outputs are computed by running the reference solutions, so tests cannot drift from the solution. Edit `tools/spec14*.py`, run `python3 tools/spec14a.py` (and b through e), then verify and build.

## Known limits

- **Real device testing.** Layout and logic were tested in a simulated browser with real Python, not on every physical phone. Do a real-device pass before sharing widely.
- **Browser Python limits.** Real `asyncio`, threads and `hashlib.pbkdf2_hmac` do not run in the Pyodide build. The async lessons build the same ideas by hand (coroutines driven manually, a virtual-clock event loop), and the password lesson stretches SHA-256 by hand. The lesson text says so.
- **First-use downloads.** `numpy`, `pandas` and `sqlite3` download the first time they are needed. They were tested against a local Pyodide copy; check them once on your hosted URL.
- **Internet needed at first launch** for the Python engine and Google Fonts (system fonts are the fallback). After caching, play is smooth but a first visit offline will not load the engine.
- **Browser storage.** Progress is stored in `localStorage`. Clearing site data or private browsing loses it, so use the Save code in Settings for backups.

## Privacy

There is no server, analytics or account. Your code and progress stay in your browser. The page loads the Python engine from jsDelivr and fonts from Google Fonts.

## Version history

Nine delivered stages, from the first two realms to the career specialisations. See [`docs/CHANGELOG.md`](docs/CHANGELOG.md).

## License

MIT. See [`LICENSE`](LICENSE). Change the copyright holder to whatever you prefer. Pyodide is MPL-2.0 and is loaded from its CDN, not bundled.
