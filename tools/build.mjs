import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const ctx = { LESSONS: [], R: String.raw };
vm.createContext(ctx);
const dir = path.join(root, 'src', 'lessons');
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort()) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f });
function fix(o){ if (typeof o === 'string') return o.split('$@{').join('${'); if (Array.isArray(o)) return o.map(fix); if (o && typeof o === 'object') for (const k of Object.keys(o)) o[k] = fix(o[k]); return o; }
const lessons = fix(JSON.parse(JSON.stringify(ctx.LESSONS)));
const runner = fs.readFileSync(path.join(root, 'src', 'runner.py'), 'utf8');
let html = fs.readFileSync(path.join(root, 'src', 'index.template.html'), 'utf8');
const j = o => JSON.stringify(o).replace(/<\/script/gi, '<\\/script').split(String.fromCharCode(0x2028)).join('\\u2028').split(String.fromCharCode(0x2029)).join('\\u2029');
html = html.split('__RUNNER_JSON__').join(j(runner)).split('__LESSONS_JSON__').join(j(lessons));
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('built index.html', (html.length/1024).toFixed(0)+' KB,', lessons.length, 'lessons');
