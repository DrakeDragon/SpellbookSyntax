# Deploying Spellbook Syntax

The game is one static file, so any static host works.

## GitHub Pages (recommended)

1. Push this repository to GitHub (`main` branch).
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Branch `main`, folder `/ (root)`, **Save**.
4. Wait about a minute. The site appears at `https://<user>.github.io/<repo>/`.

`index.html` at the repository root is what Pages serves. `.nojekyll` stops GitHub from processing the file.

### Custom domain
In **Settings → Pages → Custom domain**, enter your domain and add the DNS records GitHub shows. Tick **Enforce HTTPS**.

## Other hosts
Netlify, Cloudflare Pages, Vercel or any web server: upload `index.html` (the `src/` and `tools/` folders are not needed to play).

## After you deploy: 5-minute check
Open the live URL on your phone and:
1. Let the Python engine finish loading on the first visit (about 10 MB, one time).
2. Complete a Realm 0 lesson and confirm code runs.
3. Open the Sandbox and run `import numpy as np; print(np.arange(3))` (downloads numpy on first use).
4. Run `import sqlite3; print(sqlite3.sqlite_version)` and `import pandas as pd; print(pd.__version__)`.
5. Reload and confirm your progress is still there.

If step 1 never finishes, check that the device can reach `cdn.jsdelivr.net` (some school or work networks block it). You can self-host Pyodide by copying the 0.27.7 distribution to your repo and changing the `PYO` constant near the top of `src/index.template.html`, then rebuilding.

## Updating the game
1. Edit files in `src/`.
2. `cd tools && node build.mjs`.
3. Commit `index.html` together with the source change and push. Pages redeploys automatically.

Players keep their progress across updates (saved under the key `spellbook-syntax-v1`). Changing lesson ids can shift old saves, so avoid renumbering shipped lessons.
