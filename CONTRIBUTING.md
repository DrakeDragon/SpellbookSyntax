# Contributing

1. Edit lessons in `src/lessons/` (or Realm 14 specs in `tools/spec14*.py`).
2. `cd tools && npm install && node verify.mjs` must report 0 problems.
3. `node build.mjs`, then commit the regenerated `index.html` with your change. CI fails if it is stale.
4. For engine changes, run `node uitest.mjs` and `node uitest2.mjs`.

Keep lessons beginner-friendly in the early realms, never use a concept before it is taught, and give every challenge realistic wrong answers.
