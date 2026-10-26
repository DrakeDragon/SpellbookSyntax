// REALM 12 — THE MASTER GATE — part I (lessons 61-66: automation with pathlib, shutil, datetime, templates, zipfile)
const eqI = (arr, prefix) => '[l for l in lines if not l.startswith("' + prefix + '")]==' + JSON.stringify(arr);
const eqIt = arr => 'lines[-' + arr.length + ':]==' + JSON.stringify(arr);

// ---------- 61 inventory
const s61 = R`from pathlib import Path

def plural(n):
    return f"{n} file{'s' if n != 1 else ''}"

counts = {}
for path in Path(".").rglob("*"):
    if path.is_file():
        ext = path.suffix.lower() or "(none)"
        files, size = counts.get(ext, (0, 0))
        counts[ext] = (files + 1, size + path.stat().st_size)
if not counts:
    print("Empty folder")
else:
    for ext in sorted(counts):
        files, size = counts[ext]
        print(f"{ext}: {plural(files)}, {size} B")
    total_files = sum(c[0] for c in counts.values())
    total_size = sum(c[1] for c in counts.values())
    print(f"Total: {plural(total_files)}, {total_size} B")`;
const e61 = R`from pathlib import Path

Path("notes").mkdir(exist_ok=True)                 # create a folder (no error if it exists)
Path("notes/a.txt").write_text("hello")            # write a whole file in one call
p = Path("notes") / "a.txt"                         # join paths with /
print(p.name, p.stem, p.suffix, p.parent)           # a.txt a .txt notes
print(p.exists(), p.is_file(), p.stat().st_size)    # True True 5
print(p.read_text())
for f in sorted(Path(".").rglob("*.txt")):          # search every folder below
    print("found", f.as_posix())
print(Path("missing.txt").exists())`;

// ---------- 62 organize
const s62 = R`import shutil
from pathlib import Path

for path in sorted(p for p in Path(".").iterdir() if p.is_file()):
    if not path.suffix:
        print("Skipped", path.name)
        continue
    folder = Path(path.suffix.lower().lstrip("."))
    folder.mkdir(exist_ok=True)
    target = folder / path.name
    n = 0
    while target.exists():
        n += 1
        target = folder / f"{path.stem}_{n}{path.suffix}"
    shutil.move(str(path), str(target))
    print(f"Moved {path.name} -> {target.as_posix()}")`;
const e62 = R`import shutil
from pathlib import Path

Path("a.txt").write_text("A")
Path("old").mkdir(exist_ok=True)
shutil.copy("a.txt", "old/copy.txt")           # copy: the original stays
shutil.move("a.txt", "old/moved.txt")          # move: the original is gone
print(sorted(p.as_posix() for p in Path(".").rglob("*") if p.is_file()))
target = Path("old") / "moved.txt"
print(target.exists())                          # check BEFORE you overwrite anything
Path("old/moved.txt").rename("old/final.txt")  # rename in place
Path("old/final.txt").unlink()                  # delete one file
print(sorted(p.name for p in Path("old").iterdir()))`;

// ---------- 63 dates
const s63 = R`import calendar
from datetime import date, timedelta

start_text = input("Start: ").strip()
rule = input("Every: ").strip().lower()
count = int(input("Count: "))
try:
    start = date.fromisoformat(start_text)
except ValueError:
    start = None
if start is None:
    print("Bad date")
elif rule not in ("daily", "weekly", "monthly"):
    print("Bad rule")
else:
    for i in range(count):
        if rule == "daily":
            d = start + timedelta(days=i)
        elif rule == "weekly":
            d = start + timedelta(weeks=i)
        else:
            month_index = start.month - 1 + i
            year = start.year + month_index // 12
            month = month_index % 12 + 1
            day = min(start.day, calendar.monthrange(year, month)[1])
            d = date(year, month, day)
        print(d.strftime("%Y-%m-%d (%a)"))`;
const e63 = R`import calendar
from datetime import date, datetime, timedelta

d = date(2026, 1, 31)
print(d + timedelta(days=30), (d + timedelta(weeks=1)).strftime("%A"))
print(date.fromisoformat("2026-03-05") - date(2026, 3, 1))             # a timedelta
print((date(2026, 12, 25) - date(2026, 10, 23)).days, "days to go")
print(calendar.monthrange(2028, 2))                                    # (weekday of the 1st, days in month)
try:
    date.fromisoformat("2026-02-30")
except ValueError as error:
    print("bad date:", error)
print(datetime(2026, 1, 5, 14, 30).strftime("%d %b %Y, %H:%M"))`;

// ---------- 64 templates
const t64 = 'Dear $name,\nYou are a level $level $role.\nGuild fee: $$5.\n';
const csv64 = 'name,role,level\nAda,mage,5\nBob,rogue,\n,bard,3\nCy,cleric,9\n';
const s64 = R`import csv
from pathlib import Path
from string import Template

template = Template(Path("template.txt").read_text())
out_dir = Path("letters")
out_dir.mkdir(exist_ok=True)
written = 0
with open("people.csv", newline="") as f:
    for number, row in enumerate(csv.DictReader(f), start=2):
        name = (row.get("name") or "").strip()
        if not name:
            print(f"Skipped line {number}")
            continue
        text = template.safe_substitute(
            name=name,
            role=(row.get("role") or "adventurer").strip(),
            level=(row.get("level") or "").strip() or "?",
        )
        (out_dir / f"{name.lower()}.txt").write_text(text)
        print(f"Wrote letters/{name.lower()}.txt")
        written += 1
print(f"{written} letters")`;
const e64 = R`from string import Template

t = Template("Dear $name, you owe $$$amount.")        # $$ is a literal dollar sign
print(t.substitute(name="Ada", amount=5))
print(t.safe_substitute(name="Ada"))                  # missing keys are left as they are
try:
    t.substitute(name="Ada")
except KeyError as error:
    print("missing", error)
print("{:>6.2f}|{:<6}|{:^6}".format(3.14159, "ab", "mid"))
rows = [("ada", 5), ("bob", 12)]
print("\n".join(f"{n:<6}{lvl:>3}" for n, lvl in rows))`;

// ---------- 65 zip
const s65 = R`import zipfile
from pathlib import Path

files = sorted(p for p in Path("data").rglob("*") if p.is_file() and not p.name.startswith("."))
if not files:
    print("Nothing to back up")
else:
    with zipfile.ZipFile("backup.zip", "w", zipfile.ZIP_DEFLATED) as zf:
        for path in files:
            zf.write(path, path.as_posix())
    with zipfile.ZipFile("backup.zip") as zf:
        bad = zf.testzip()
        print("Archived", len(zf.namelist()), "files")
        for info in zf.infolist():
            print(f"{info.filename} ({info.file_size} B)")
    print("Backup OK" if bad is None else f"Corrupt: {bad}")`;
const e65 = R`import zipfile
from pathlib import Path

Path("data").mkdir(exist_ok=True)
Path("data/a.txt").write_text("alpha")
with zipfile.ZipFile("backup.zip", "w", zipfile.ZIP_DEFLATED) as zf:
    zf.write("data/a.txt", "data/a.txt")               # (file on disk, name inside the zip)
    zf.writestr("notes/readme.txt", "made by Python")   # or write text straight in
with zipfile.ZipFile("backup.zip") as zf:
    print(zf.namelist())
    print(zf.read("data/a.txt"))                         # bytes
    print(zf.testzip())                                  # None = every file is intact
    zf.extract("notes/readme.txt", "restored")
print(Path("restored/notes/readme.txt").read_text())`;

// ---------- 66 mission
const s66 = R`import shutil
from pathlib import Path

inbox = Path("inbox")
if not inbox.is_dir():
    print("No inbox")
else:
    lines = []
    processed = rejected = skipped = 0
    for path in sorted(p for p in inbox.iterdir() if p.is_file()):
        suffix = path.suffix.lower()
        if suffix in (".csv", ".txt"):
            if (Path("done") / path.name).exists():
                lines.append(f"{path.name}: already done")
                skipped += 1
                continue
            text = path.read_text()
            if suffix == ".csv":
                rows = [ln for ln in text.splitlines() if ln.strip()]
                lines.append(f"{path.name}: {max(len(rows) - 1, 0)} rows")
            else:
                lines.append(f"{path.name}: {len(text.split())} words")
            Path("done").mkdir(exist_ok=True)
            shutil.move(str(path), str(Path("done") / path.name))
            processed += 1
        else:
            Path("rejected").mkdir(exist_ok=True)
            shutil.move(str(path), str(Path("rejected") / path.name))
            lines.append(f"{path.name}: unsupported")
            rejected += 1
    lines.append(f"Processed {processed}, rejected {rejected}, skipped {skipped}")
    Path("report.txt").write_text("\n".join(lines) + "\n")
    print("\n".join(lines))`;
const e66 = R`import shutil
from pathlib import Path

Path("inbox").mkdir(exist_ok=True)
Path("inbox/a.txt").write_text("one two three")
Path("inbox/b.dat").write_text("???")
for path in sorted(Path("inbox").iterdir()):
    if path.suffix == ".txt":
        print(path.name, len(path.read_text().split()), "words")
        Path("done").mkdir(exist_ok=True)
        shutil.move(str(path), "done/" + path.name)      # a processed file leaves the inbox
    else:
        print(path.name, "unsupported")
print(sorted(p.as_posix() for p in Path(".").rglob("*") if p.is_file()))`;

const files62 = {'b.txt':'B','a.txt':'A','pic.PNG':'P','README':'R','txt/a.txt':'OLD','txt/a_1.txt':'OLD2'};
const files66 = {'inbox/a.csv':'name,qty\nx,1\ny,2\n\n','inbox/b.txt':'four small words here','inbox/c.exe':'MZ','inbox/d.txt':'again','done/d.txt':'old','inbox/E.CSV':'h\n'};
const out66 = ['E.CSV: 0 rows','a.csv: 2 rows','b.txt: 4 words','c.exe: unsupported','d.txt: already done','Processed 3, rejected 1, skipped 1'];

LESSONS.push(
{
  id:'r12-61', realm:12, n:61, title:'Files and folders with pathlib',
  teaches:['auto-walk'], requires:['sql-tx'],
  story:`The **Clockwork Annex** hums with brass gears. "Work you do twice, a machine should do forever," Orrin says. "**Automation** is how one person does the work of ten. We start by teaching your code to walk through folders as easily as you do."`,
  concept:{
    html:`\`pathlib\` treats paths as objects instead of fragile strings.\n\n\`\`\`\nfrom pathlib import Path\n\np = Path("notes") / "a.txt"          # join with /\np.name, p.stem, p.suffix, p.parent   # a.txt  a  .txt  notes\np.exists(), p.is_file(), p.is_dir()\np.stat().st_size                      # size in bytes\np.read_text();  p.write_text("hi")   # whole-file read/write\nPath("notes").mkdir(exist_ok=True)    # create a folder, no error if it exists\nfor f in Path(".").rglob("*.txt"):    # recursive search; glob("*") is one level only\n    ...\n\`\`\`\n\n- \`rglob("*")\` returns files **and folders**: filter with \`is_file()\`.\n- Paths are returned in arbitrary order: wrap in \`sorted(...)\` for predictable output.\n- Use \`.suffix.lower()\` so \`.TXT\` and \`.txt\` count as the same type.\n- \`as_posix()\` prints \`/\` separators on every operating system.\n- A file with no extension (\`README\`) or a dotfile (\`.env\`) has an **empty suffix**: handle it on purpose.\n- Prefer \`pathlib\` over string concatenation and \`os.path\` in new code.`,
    analogy:`A tireless clerk who can open any drawer, read the label and weigh what is inside.`,
    example:e61},
  predict:{code:R`from pathlib import Path
p = Path("logs/app.tar.gz")
print(p.name, p.suffix, p.stem)`, q:'What prints?', opts:['app.tar.gz .gz app.tar','app.tar.gz .tar.gz app','app .gz app.tar.gz'], ans:0, why:'suffix is only the last extension; stem removes just that.'},
  cast:{code:e61, task:'Cast it.'},
  bug:{broken:R`from pathlib import Path
Path("a.txt").write_text("hi")
Path("sub").mkdir()
Path("sub").mkdir()
print("ok")`, task:'The second mkdir raises FileExistsError. Make creating the folder safe to repeat. Expected: ok',
    cases:[{inputs:[],tests:[['Works','lines==["ok"]'],['exist_ok','"exist_ok=True" in src']]}],
    sol:R`from pathlib import Path
Path("a.txt").write_text("hi")
Path("sub").mkdir(exist_ok=True)
Path("sub").mkdir(exist_ok=True)
print("ok")`, wrong:[R`print("ok")`]},
  write:{prompt:'Take inventory of the current folder **and every folder below it**. Group the **files** (not folders) by extension in lower case (`(none)` when there is no extension). Print `<ext>: <n> file(s), <bytes> B` in alphabetical order of extension (say `1 file`, `2 files`), then `Total: <n> file(s), <bytes> B`. An empty folder prints `Empty folder`.',
    starter:R`from pathlib import Path

counts = {}
`,
    inputs:[],
    cases:[{inputs:[],files:{'a.txt':'hello','b.TXT':'hi','notes/c.txt':'abc','img/p.png':'12345678','README':'x'},tests:[['Inventory',eqIt(['(none): 1 file, 1 B','.png: 1 file, 8 B','.txt: 3 files, 10 B','Total: 5 files, 19 B'])],['Uses pathlib','"pathlib" in src']]},{inputs:[],files:{},tests:[['Empty','lines==["Empty folder"]']]},{inputs:[],files:{'x.py':'print(1)'},tests:[['One file',eqIt(['.py: 1 file, 8 B','Total: 1 file, 8 B'])]]},{inputs:[],files:{'A/B/c.PY':'ab','d.py':'xyz'},tests:[['Deep folders',eqIt(['.py: 2 files, 5 B','Total: 2 files, 5 B'])]]},{inputs:[],files:{'.env':'k=v','dir/.hidden':'zz'},tests:[['Dotfiles have no suffix',eqIt(['(none): 2 files, 5 B','Total: 2 files, 5 B'])]]}],
    sol:s61,
    wrong:[s61.replace('rglob("*")','glob("*")'),s61.replace('path.suffix.lower()','path.suffix'),s61.replace('    if path.is_file():\n        ext','    if True:\n        ext'),s61.replace(' or "(none)"',''),s61.replace('path.stat().st_size','len(path.name)')],
    hints:['Path(".").rglob("*") walks every folder; keep only path.is_file().','ext = path.suffix.lower() or "(none)"; keep a dict of ext -> (files, bytes) using path.stat().st_size.','Print in sorted(counts) order, with a plural helper for "file"/"files", then the totals.',s61]},
  power:{can:['Walk folder trees and inspect files with pathlib','Group and total files by type'],
    expand:'Add the 3 largest files with `sorted(..., key=lambda p: p.stat().st_size, reverse=True)[:3]`.',
    where:'Disk-usage reports, cleanup scripts and backup tools all start by taking inventory like this.',
    next:'Next: moving files around with shutil, without destroying anything.'},
  codex:{title:'pathlib',body:'Path(...) / "x"; .name .stem .suffix .parent; exists() is_file() is_dir(); stat().st_size; read_text() write_text(); mkdir(exist_ok=True); iterdir() glob() rglob() (filter is_file, wrap in sorted); as_posix().',snip:R`for p in sorted(Path(".").rglob("*.txt")):
    print(p.as_posix(), p.stat().st_size)`}
},
{
  id:'r12-62', realm:12, n:62, title:'shutil: copy, move and never overwrite',
  teaches:['auto-organize'], requires:['auto-walk'],
  story:`The Annex floor is buried in loose files. "A script that tidies is a gift," Orrin says, "and a script that **destroys** is a curse. The difference is one question you must ask before every move: *is something already there?*"`,
  concept:{
    html:`\`shutil\` copies and moves files and folders.\n\n\`\`\`\nimport shutil\nshutil.copy("a.txt", "backup/a.txt")      # copy, original stays\nshutil.move("a.txt", "txt/a.txt")       # move; the original is gone\nPath("txt").mkdir(exist_ok=True)         # create the target folder first\nPath("a.txt").rename("b.txt")            # rename in place\nPath("b.txt").unlink()                   # delete a file (no recycle bin!)\n\`\`\`\n\n- ⚠️ \`shutil.move\` onto an existing file **silently replaces it**. Always check \`target.exists()\` first and pick another name (\`a_1.txt\`, \`a_2.txt\`...).\n- Build all the work in a list **before** changing the folder (\`sorted(...)\`), instead of moving files while the folder is still being scanned.\n- \`path.stem\` + \`path.suffix\` let you rebuild a new name.\n- \`shutil\` wants strings in older code: \`str(path)\` is a safe habit.\n- **Dry run**: print what *would* happen before doing it; ask before deleting.\n- Automation that runs unattended must never lose data: be conservative.`,
    analogy:`A careful mover who checks that the new shelf is empty before putting your things on it.`,
    example:e62},
  predict:{code:R`from pathlib import Path
t = Path("txt") / "a.txt"
n = 1
stem, suffix = "a", ".txt"
print(t.parent / f"{stem}_{n}{suffix}")`, q:'What prints (on Linux/Mac/browser)?', opts:['txt/a_1.txt','txt/a.txt_1','txt/a_1'], ans:0, why:'The new name is stem + _n + suffix, inside the same folder.'},
  cast:{code:e62, task:'Cast it.'},
  bug:{broken:R`import shutil
from pathlib import Path

Path("a.txt").write_text("NEW")
Path("txt").mkdir()
Path("txt/a.txt").write_text("OLD")
shutil.move("a.txt", "txt/a.txt")
print(Path("txt/a.txt").read_text(), Path("txt/a_1.txt").exists())`, task:'The move destroyed the old file. If the target exists, move to a_1.txt instead. Expected: OLD True',
    cases:[{inputs:[],tests:[['Works','lines==["OLD True"]'],['Checks first','".exists()" in src']]}],
    sol:R`import shutil
from pathlib import Path

Path("a.txt").write_text("NEW")
Path("txt").mkdir()
Path("txt/a.txt").write_text("OLD")
target = Path("txt/a.txt")
if target.exists():
    target = Path("txt/a_1.txt")
shutil.move("a.txt", str(target))
print(Path("txt/a.txt").read_text(), Path("txt/a_1.txt").exists())`, wrong:[R`print("OLD True")`]},
  write:{prompt:'Organise the **top-level files** of the current folder (in name order). A file goes into a folder named after its extension in lower case without the dot (`photo.PNG` -> `png/photo.PNG`). Print `Moved <name> -> <new path>` for each. Files with no extension are left alone: print `Skipped <name>`. Never overwrite: if the target exists, use `<stem>_1<suffix>`, then `_2`, and so on.',
    starter:R`import shutil
from pathlib import Path

`,
    inputs:[],
    cases:[{inputs:[],files:files62,tests:[['Output',eqIt(['Skipped README','Moved a.txt -> txt/a_2.txt','Moved b.txt -> txt/b.txt','Moved pic.PNG -> png/pic.PNG'])],['Old files untouched','read("txt/a.txt")=="OLD" and read("txt/a_1.txt")=="OLD2"'],['Moved safely','read("txt/a_2.txt")=="A" and not exists("a.txt") and exists("png/pic.PNG") and exists("README")']]},{inputs:[],files:{},tests:[['Nothing to do','lines==[]']]},{inputs:[],files:{'README':'r','.gitignore':'x'},tests:[['Only skips',eqIt(['Skipped .gitignore','Skipped README'])]]},{inputs:[],files:{'x.tar.gz':'z','y.GZ':'q'},tests:[['Last extension only',eqIt(['Moved x.tar.gz -> gz/x.tar.gz','Moved y.GZ -> gz/y.GZ'])]]},{inputs:[],files:{'a.md':'1','md/a.md':'0'},tests:[['One collision',eqIt(['Moved a.md -> md/a_1.md'])]]}],
    sol:s62,
    wrong:[s62.replace('    while target.exists():\n        n += 1\n        target = folder / f"{path.stem}_{n}{path.suffix}"\n',''),s62.replace('path.suffix.lower().lstrip(".")','path.suffix.lstrip(".")'),s62.replace('    if not path.suffix:\n        print("Skipped", path.name)\n        continue\n',''),s62.replace('if p.is_file()','if True'),s62.replace('shutil.move(str(path), str(target))','shutil.copy(str(path), str(target))')],
    hints:['Loop over sorted(p for p in Path(".").iterdir() if p.is_file()).','folder = Path(path.suffix.lower().lstrip(".")); folder.mkdir(exist_ok=True); target = folder / path.name.','while target.exists(): n += 1; target = folder / f"{path.stem}_{n}{path.suffix}". Then shutil.move(str(path), str(target)).',s62]},
  power:{can:['Copy, move, rename and delete files safely','Avoid overwriting by checking before you move'],
    expand:'Add a `--dry-run` input: when `yes`, only print what would be moved.',
    where:'Downloads folders, photo libraries and nightly clean-ups all use this pattern.',
    next:'Next: dates and schedules.'},
  codex:{title:'shutil',body:'shutil.copy(src, dst); shutil.move(src, dst) overwrites silently - check exists() first; Path.rename, Path.unlink; mkdir(exist_ok=True); stem + _n + suffix for unique names. Dry-run before destructive work.',snip:R`while target.exists():
    n += 1
    target = folder / f"{path.stem}_{n}{path.suffix}"`}
},
{
  id:'r12-63', realm:12, n:63, title:'Dates and scheduling logic',
  teaches:['auto-dates'], requires:['auto-organize'],
  story:`"A clockwork that runs at the wrong time is worse than none," Orrin says, pointing to a calendar jammed at the 31st of February. "**Dates** look easy and are famously treacherous. Let the library do the arithmetic."`,
  concept:{
    html:`\`\`\`\nfrom datetime import date, datetime, timedelta\nimport calendar\n\nd = date(2026, 1, 31)\nd + timedelta(days=30)                 # date arithmetic\n(date(2026, 12, 25) - d).days          # difference in days\ndate.fromisoformat("2026-03-05")       # parse YYYY-MM-DD (ValueError if impossible)\nd.strftime("%Y-%m-%d (%a)")            # format: %a weekday, %b month name, %H:%M time\ncalendar.monthrange(2028, 2)[1]        # days in that month: 29 (leap year)\n\`\`\`\n\n- There is **no** \`timedelta(months=1)\`: months have different lengths. Compute month steps yourself: \`month_index = start.month - 1 + i\`, \`year = start.year + month_index // 12\`, \`month = month_index % 12 + 1\`.\n- **Clamp the day**: Jan 31 plus a month is Feb 28/29: \`day = min(start.day, days_in_month)\`.\n- Always step from the **original** start (\`start + i months\`), not from the previous result, or Jan 31 -> Feb 28 -> Mar 28 drifts forever.\n- Validate user dates with \`try/except ValueError\`; check inputs in a fixed order so error messages are predictable.\n- Cron-style scheduling in real systems uses the same date maths. For time zones use \`zoneinfo\`.`,
    analogy:`A calendar that knows how long each month really is, so you do not have to.`,
    example:e63},
  predict:{code:R`from datetime import date, timedelta
print(date(2026, 2, 27) + timedelta(days=3))`, q:'What prints?', opts:['2026-03-02','2026-02-30','2026-03-03'], ans:0, why:'February 2026 has 28 days: 27 + 3 days lands on March 2.'},
  cast:{code:e63, task:'Cast it.'},
  bug:{broken:R`from datetime import date
print(date(2026, 2, 31))`, task:'February 31st does not exist (ValueError). Use the last day of February with calendar.monthrange. Expected: 2026-02-28',
    cases:[{inputs:[],tests:[['Works','lines==["2026-02-28"]'],['Uses monthrange','"monthrange" in src']]}],
    sol:R`import calendar
from datetime import date
last = calendar.monthrange(2026, 2)[1]
print(date(2026, 2, min(31, last)))`, wrong:[R`print("2026-02-28")`]},
  write:{prompt:'Ask `Start: ` (a date like `2026-01-31`), `Every: ` (`daily`, `weekly` or `monthly`, any capitalisation) and `Count: `. Print the first `Count` dates of the schedule as `YYYY-MM-DD (Mon)` (weekday abbreviation). Monthly schedules keep the start day but clamp to the month end (Jan 31 -> Feb 28 -> Mar 31). An impossible date prints `Bad date`; an unknown rule prints `Bad rule` (check the date first).',
    starter:R`import calendar
from datetime import date, timedelta

start_text = input("Start: ").strip()
rule = input("Every: ").strip().lower()
count = int(input("Count: "))
`,
    inputs:['2026-01-31','monthly','4'],
    cases:[{inputs:['2026-01-31','monthly','4'],tests:[['Month ends',eqIt(['2026-01-31 (Sat)','2026-02-28 (Sat)','2026-03-31 (Tue)','2026-04-30 (Thu)'])]]},{inputs:['2027-11-30','Monthly','4'],tests:[['Year rollover and leap day',eqIt(['2027-11-30 (Tue)','2027-12-30 (Thu)','2028-01-30 (Sun)','2028-02-29 (Tue)'])]]},{inputs:['2026-12-30','daily','3'],tests:[['Daily',eqIt(['2026-12-30 (Wed)','2026-12-31 (Thu)','2027-01-01 (Fri)'])]]},{inputs:['2026-03-01','weekly','3'],tests:[['Weekly',eqIt(['2026-03-01 (Sun)','2026-03-08 (Sun)','2026-03-15 (Sun)'])]]},{inputs:['2026-02-30','daily','3'],tests:[['Bad date','lines[-1]=="Bad date"']]},{inputs:['2026-03-01','hourly','3'],tests:[['Bad rule','lines[-1]=="Bad rule"']]},{inputs:['nope','hourly','2'],tests:[['Date is checked first','lines[-1]=="Bad date"']]},{inputs:['2026-03-01','daily','0'],tests:[['Count of zero','lines[-1]=="Count: 0"']]}],
    sol:s63,
    wrong:[s63.replace('timedelta(weeks=i)','timedelta(days=i)'),s63.replace('            day = min(start.day, calendar.monthrange(year, month)[1])\n','            day = start.day\n'),s63.replace('            month_index = start.month - 1 + i\n','            month_index = start.month - 1 + i\n            d = start + timedelta(days=30 * i)\n').replace('            d = date(year, month, day)\n','            pass\n'),s63.replace('elif rule not in ("daily", "weekly", "monthly"):\n    print("Bad rule")','elif rule not in ("daily", "weekly"):\n    print("Bad rule")'),s63.replace('d.strftime("%Y-%m-%d (%a)")','d.strftime("%Y-%m-%d (%A)")'),s63.replace('range(count)','range(1, count + 1)')],
    hints:['date.fromisoformat(start_text) raises ValueError for impossible dates: catch it.','daily: start + timedelta(days=i); weekly: timedelta(weeks=i).','monthly: month_index = start.month - 1 + i; year = start.year + month_index // 12; month = month_index % 12 + 1; day = min(start.day, calendar.monthrange(year, month)[1]).',s63]},
  power:{can:['Do date arithmetic and formatting safely','Build recurring schedules, including month-end rules'],
    expand:'Add a `biweekly` rule and a `weekdays` rule that skips Saturdays and Sundays.',
    where:'Billing cycles, reminders, rotas and report schedules all depend on this exact logic.',
    next:'Next: filling in templates to produce files in bulk.'},
  codex:{title:'datetime',body:'date(y,m,d); date.fromisoformat (ValueError); + timedelta(days/weeks); (d2 - d1).days; strftime("%Y-%m-%d %a"); calendar.monthrange(y, m)[1] = days in month. No month timedelta: use month_index arithmetic and clamp the day. Step from the ORIGINAL start.',snip:R`day = min(start.day, calendar.monthrange(year, month)[1])`}
},
{
  id:'r12-64', realm:12, n:64, title:'Templates and mail-merge',
  teaches:['auto-template'], requires:['auto-dates'],
  story:`A hundred members must each receive a personal letter. "Do not write a hundred," Orrin says, handing you one letter full of blanks. "Write **one template**, feed it a **table**, and let the machine fill in every name."`,
  concept:{
    html:`**Mail-merge** = one template + a row of data per output file.\n\n\`\`\`\nfrom string import Template\n\nt = Template("Dear $name, you owe $$$amount.")   # $$ = a literal $\nt.substitute(name="Ada", amount=5)         # raises KeyError if a key is missing\nt.safe_substitute(name="Ada")              # leaves $amount in place instead\n\`\`\`\n\n- \`string.Template\` is the right tool for templates **users** write: it has only \`$name\` placeholders, so a template cannot run code. (f-strings and \`str.format\` can reach into objects: avoid them for untrusted templates.)\n- \`csv.DictReader\` gives one dict per row. Use \`row.get("x") or default\` to survive missing or blank cells.\n- \`enumerate(reader, start=2)\` gives real file line numbers (the header is line 1) for friendly warnings.\n- Write each result with \`Path.write_text\`; create the output folder with \`mkdir(exist_ok=True)\`.\n- Format tables of text with \`f"{name:<6}{level:>3}"\` (left/right alignment).\n- Skip bad rows with a clear message instead of crashing the whole batch.`,
    analogy:`A form letter with blanks and a rubber stamp that fills in each person's details.`,
    example:e64},
  predict:{code:R`from string import Template
print(Template("$a costs $$$b").substitute(a="tea", b=3))`, q:'What prints?', opts:['tea costs $3','tea costs $$3','tea costs 3'], ans:0, why:'$$ becomes one literal dollar sign, then $b is replaced by 3.'},
  cast:{code:e64, task:'Cast it.'},
  bug:{broken:R`from string import Template
t = Template("Hi $name from $guild")
print(t.substitute(name="Ada"))`, task:'$guild has no value, so substitute raises KeyError. Leave unknown placeholders alone. Expected: Hi Ada from $guild',
    cases:[{inputs:[],tests:[['Works','lines==["Hi Ada from $guild"]'],['safe','"safe_substitute" in src']]}],
    sol:R`from string import Template
t = Template("Hi $name from $guild")
print(t.safe_substitute(name="Ada"))`, wrong:[R`print("Hi Ada from $guild")`]},
  write:{prompt:'`template.txt` (with `$name`, `$role`, `$level` placeholders) and `people.csv` (`name,role,level`) exist. For every person write `letters/<name in lower case>.txt` from the template: a blank level becomes `?`, a blank role becomes `adventurer`, and unknown placeholders stay as they are. Rows with a blank name are skipped: print `Skipped line <n>` (header = line 1). Print `Wrote letters/<file>` for each letter and finish with `<n> letters`.',
    starter:R`import csv
from pathlib import Path
from string import Template

template = Template(Path("template.txt").read_text())
`,
    inputs:[],
    cases:[{inputs:[],files:{'template.txt':t64,'people.csv':csv64},tests:[['Output',eqIt(['Wrote letters/ada.txt','Wrote letters/bob.txt','Skipped line 4','Wrote letters/cy.txt','3 letters'])],['Ada letter','read("letters/ada.txt")=="Dear Ada,\\nYou are a level 5 mage.\\nGuild fee: $5.\\n"'],['Blank level','read("letters/bob.txt")=="Dear Bob,\\nYou are a level ? rogue.\\nGuild fee: $5.\\n"'],['No blank-name file','not exists("letters/.txt") and sorted(listdir("letters"))==["ada.txt","bob.txt","cy.txt"]']]},{inputs:[],files:{'template.txt':'Hi $name from $guild','people.csv':'name,role,level\nAda,mage,5\n'},tests:[['Unknown placeholder stays','read("letters/ada.txt")=="Hi Ada from $guild"']]},{inputs:[],files:{'template.txt':'$name','people.csv':'name,role,level\nZed,,\n','letters/old.txt':'keep'},tests:[['Existing folder is fine','lines[-1]=="1 letters" and read("letters/old.txt")=="keep" and read("letters/zed.txt")=="Zed"']]},{inputs:[],files:{'template.txt':'$role','people.csv':'name,role,level\nQ,,1\n'},tests:[['Default role','read("letters/q.txt")=="adventurer"']]},{inputs:[],files:{'template.txt':'x','people.csv':'name,role,level\n'},tests:[['No people','lines[-1]=="0 letters"']]}],
    sol:s64,
    wrong:[s64.replace('safe_substitute','substitute'),s64.replace('{name.lower()}.txt").write_text','{name}.txt").write_text').replace('Wrote letters/{name.lower()}.txt','Wrote letters/{name}.txt'),s64.replace('        if not name:\n            print(f"Skipped line {number}")\n            continue\n',''),s64.replace('out_dir.mkdir(exist_ok=True)','out_dir.mkdir()'),s64.replace('start=2','start=1'),s64.replace(' or "?"','')],
    hints:['Template(Path("template.txt").read_text()); for each row from csv.DictReader build the mapping name, role, level.','Use template.safe_substitute(name=..., role=..., level=...) so unknown $placeholders survive.','out_dir.mkdir(exist_ok=True); (out_dir / f"{name.lower()}.txt").write_text(text); enumerate(reader, start=2) gives line numbers.',s64]},
  power:{can:['Generate many files from one template and a data table','Use string.Template safely and skip bad rows with clear messages'],
    expand:'Mail-merge to a single `all_letters.txt` with a `-----` divider, or add `$date` filled with today\'s date.',
    where:'Invoices, certificates, onboarding emails and report cards are all produced this way.',
    next:'Next: zip archives and backups you can verify.'},
  codex:{title:'Templates',body:'string.Template: $name, $$ for a literal $; substitute() raises KeyError, safe_substitute() leaves unknowns; DictReader + row.get(k) or default; enumerate(reader, start=2) for line numbers; mkdir(exist_ok=True); write_text().',snip:R`text = Template(body).safe_substitute(name=name, level=level)
Path("letters", f"{name.lower()}.txt").write_text(text)`}
},
{
  id:'r12-65', realm:12, n:65, title:'zipfile: backups you can verify',
  teaches:['auto-zip'], requires:['auto-template'],
  story:`"Backups that were never tested are wishes, not backups," Orrin says, tapping a dusty zip. "Pack it, then **open it again and check**. Only then may you sleep."`,
  concept:{
    html:`\`\`\`\nimport zipfile\n\nwith zipfile.ZipFile("backup.zip", "w", zipfile.ZIP_DEFLATED) as zf:\n    zf.write("data/a.txt", "data/a.txt")      # (file on disk, name inside the archive)\n    zf.writestr("notes/readme.txt", "text")    # write text/bytes directly\n\nwith zipfile.ZipFile("backup.zip") as zf:\n    zf.namelist()          # names inside\n    zf.infolist()          # details: .filename .file_size\n    zf.read("data/a.txt")  # bytes\n    zf.testzip()           # None if every file is intact, else the first bad name\n    zf.extract("data/a.txt", "restored")\n\`\`\`\n\n- The second argument of \`write\` is the **name inside the zip**: use the relative path (\`path.as_posix()\`) to keep the folder structure. \`path.name\` alone flattens everything.\n- Use \`with\` so the archive is properly closed before you reopen it.\n- Always **verify** after writing: reopen, \`testzip()\`, and compare the list of names with what you meant to store.\n- Skip hidden files (names starting with \`.\`) deliberately, and say so.\n- When there is nothing to back up, say so and do **not** create an empty archive.\n- \`shutil.make_archive\` is a one-line shortcut when you do not need control.`,
    analogy:`Packing a suitcase, then unpacking it at home plate to make sure nothing is missing.`,
    example:e65},
  predict:{code:R`import zipfile
with zipfile.ZipFile("t.zip", "w") as zf:
    zf.writestr("a/b.txt", "hello")
with zipfile.ZipFile("t.zip") as zf:
    print(zf.namelist(), zf.read("a/b.txt"))`, q:'What prints?', opts:["['a/b.txt'] b'hello'","['b.txt'] 'hello'","['a/b.txt'] hello"], ans:0, why:'Names keep their path; read() returns bytes.'},
  cast:{code:e65, task:'Cast it.'},
  bug:{broken:R`import zipfile
from pathlib import Path
Path("data").mkdir()
Path("data/a.txt").write_text("alpha")
with zipfile.ZipFile("b.zip", "w") as zf:
    zf.write("data/a.txt", Path("data/a.txt").name)
with zipfile.ZipFile("b.zip") as zf:
    print(zf.namelist())`, task:'The folder was lost (flattened). Keep the relative path inside the zip. Expected: [\'data/a.txt\']',
    cases:[{inputs:[],tests:[['Works','lines==["[\'data/a.txt\']"]'],['No .name','".name)" not in src'],['Real zip','"ZipFile" in src']]}],
    sol:R`import zipfile
from pathlib import Path
Path("data").mkdir()
Path("data/a.txt").write_text("alpha")
with zipfile.ZipFile("b.zip", "w") as zf:
    zf.write("data/a.txt", Path("data/a.txt").as_posix())
with zipfile.ZipFile("b.zip") as zf:
    print(zf.namelist())`, wrong:[R`print("['data/a.txt']")`]},
  write:{prompt:'Back up the folder `data` into `backup.zip`: every file below it (all sub-folders) **except hidden files** (names starting with `.`), stored under its relative path, sorted. Then reopen the archive, check it with `testzip()` and print `Archived <n> files`, one `<name> (<size> B)` line per entry, and `Backup OK` (or `Corrupt: <name>`). If there is nothing to back up print `Nothing to back up` and create no zip.',
    starter:R`import zipfile
from pathlib import Path

`,
    inputs:[],
    cases:[{inputs:[],files:{'data/a.txt':'alpha','data/sub/b.txt':'bravo!','data/.hidden':'x','other/z.txt':'zzz'},tests:[['Report',eqIt(['Archived 2 files','data/a.txt (5 B)','data/sub/b.txt (6 B)','Backup OK'])],['Verifies','"testzip" in src'],['Zip names','__import__("zipfile").ZipFile("backup.zip").namelist()==["data/a.txt","data/sub/b.txt"]'],['Zip content','__import__("zipfile").ZipFile("backup.zip").read("data/sub/b.txt")==b"bravo!"'],['Compressed','all(i.compress_type==8 for i in __import__("zipfile").ZipFile("backup.zip").infolist())']]},{inputs:[],files:{'other/z.txt':'zzz'},tests:[['No data folder','lines==["Nothing to back up"] and not exists("backup.zip")']]},{inputs:[],files:{'data/.only':'x'},tests:[['Only hidden files','lines==["Nothing to back up"] and not exists("backup.zip")']]},{inputs:[],files:{'data/Z.txt':'zz','data/a.txt':'a'},tests:[['Sorted',eqIt(['Archived 2 files','data/Z.txt (2 B)','data/a.txt (1 B)','Backup OK'])]]}],
    sol:s65,
    wrong:[s65.replace('zf.write(path, path.as_posix())','zf.write(path, path.name)'),s65.replace(' and not p.name.startswith(".")',''),s65.replace('        bad = zf.testzip()\n','        bad = None\n').replace('print("Backup OK" if bad is None else f"Corrupt: {bad}")','print("Backup OK")') + '\n',s65.replace(', zipfile.ZIP_DEFLATED',''),s65.replace('Path("data").rglob("*")','Path("data").glob("*")'),s65.replace('    print("Nothing to back up")','    print("Nothing to back up")\n    zipfile.ZipFile("backup.zip", "w").close()')],
    hints:['files = sorted(p for p in Path("data").rglob("*") if p.is_file() and not p.name.startswith(".")).','zf.write(path, path.as_posix()) keeps the relative path; open with mode "w" and ZIP_DEFLATED.','Reopen with ZipFile("backup.zip"): testzip(), namelist(), infolist() for names and file_size.',s65]},
  power:{can:['Create zip archives that keep folder structure','Verify a backup after writing it'],
    expand:'Add a timestamp to the file name (`backup-2026-10-23.zip`) using `date.today().isoformat()`.',
    where:'Nightly backups, release bundles and email attachments all use zip archives.',
    next:'Next: Real-World Mission: the Night Watch.'},
  codex:{title:'zipfile',body:'ZipFile(name, "w", ZIP_DEFLATED); zf.write(path, arcname=relative posix path); writestr; reopen: namelist(), infolist() (.filename .file_size), read(), testzip() (None = OK), extract(). Verify after writing. Skip hidden files on purpose.',snip:R`with zipfile.ZipFile("backup.zip") as zf:
    print(zf.testzip(), zf.namelist())`}
},
{
  id:'r12-66', realm:12, n:66, title:'Real-World Mission: The Night Watch',
  teaches:['mission12i'], requires:['auto-zip'],
  story:`Every night, drop-boxes in the Annex fill with reports, spreadsheets and junk. The **Night Watch** must sort it all while the Guild sleeps, and be safe to run twice. "If it breaks at 3 a.m.," Orrin says, "there is nobody to fix it. Make it boring and bulletproof."`,
  concept:{
    html:`A real overnight job, built from the pieces you know:\n\n1. **Check preconditions** (\`inbox\` exists?), say so clearly if not.\n2. Process files **in a stable order** (\`sorted\`).\n3. **Branch by type**: \`.csv\` -> count data rows (ignore blank lines and the header), \`.txt\` -> count words, anything else -> quarantine in \`rejected/\`.\n4. **Be idempotent**: if \`done/<name>\` already exists, do not touch the file and report \`already done\`. Running the job twice must not lose or duplicate work.\n5. **Move** (never copy then forget) processed files into \`done/\`.\n6. Write a **report file** and print the same lines; end with counts.\n\n- Idempotent = safe to repeat. That is the single most valuable property of automation.\n- Extensions: compare with \`suffix.lower()\`.\n- Build the report as a list of lines first, then both print and write it: one source of truth.\n- Real scripts add logging, error handling per file (one bad file must not stop the rest) and a lock file; start with the clear, simple core.`,
    analogy:`A night janitor with a checklist who can be called twice and never mops the same floor into a mess.`,
    example:e66},
  predict:{code:R`from pathlib import Path
Path("done").mkdir()
Path("done/a.txt").write_text("old")
print((Path("done") / "a.txt").exists(), (Path("done") / "b.txt").exists())`, q:'What prints?', opts:['True False','False False','True True'], ans:0, why:'Only a.txt was created in done.'},
  cast:{code:e66, task:'Cast it.'},
  bug:{broken:R`text = "name,qty\nx,1\ny,2\n"
rows = [ln for ln in text.splitlines() if ln.strip()]
print(len(rows), "rows")`, task:'The header line is counted as a row. Expected: 2 rows',
    cases:[{inputs:[],tests:[['Works','lines==["2 rows"]'],['Handles header','"- 1" in src or "[1:]" in src']]}],
    sol:R`text = "name,qty\nx,1\ny,2\n"
rows = [ln for ln in text.splitlines() if ln.strip()]
print(len(rows) - 1, "rows")`, wrong:[R`print("2 rows")`]},
  write:{prompt:'Run the nightly job on the folder `inbox` (top-level files, in name order). If `inbox` does not exist print `No inbox`. For `.csv`/`.txt` (any capitalisation): if `done/<name>` already exists leave the file and report `<name>: already done`; otherwise report `<name>: <n> rows` (CSV: non-blank lines minus the header, never below 0) or `<name>: <n> words`, and move it into `done/`. Any other file is moved into `rejected/` and reported as `<name>: unsupported`. Finish with `Processed <p>, rejected <r>, skipped <s>`. Print every report line and also save them in `report.txt`.',
    starter:R`import shutil
from pathlib import Path

inbox = Path("inbox")
`,
    inputs:[],
    cases:[{inputs:[],files:files66,tests:[['Report lines',eqIt(out66)],['report.txt matches','read("report.txt")==chr(10).join(' + JSON.stringify(out66) + ')+chr(10)'],['Moved to done','exists("done/a.csv") and exists("done/E.CSV") and exists("done/b.txt") and not exists("inbox/a.csv") and not exists("inbox/b.txt")'],['Rejected','exists("rejected/c.exe") and not exists("inbox/c.exe")'],['Already done untouched','read("done/d.txt")=="old" and read("inbox/d.txt")=="again"']]},{inputs:[],files:{},tests:[['No inbox','lines==["No inbox"] and not exists("report.txt")']]},{inputs:[],files:{'inbox/z.md':'# hi'},tests:[['Only unsupported',eqIt(['z.md: unsupported','Processed 0, rejected 1, skipped 0'])]]},{inputs:[],files:{'inbox/t.TXT':'  a  b\nc\n','inbox/h.csv':'only,header\n'},tests:[['Words and empty CSV',eqIt(['h.csv: 0 rows','t.TXT: 3 words','Processed 2, rejected 0, skipped 0'])]]}],
    sol:s66,
    wrong:[s66.replace('if (Path("done") / path.name).exists():','if False:'),s66.replace('max(len(rows) - 1, 0)','len(rows)'),s66.replace('rows = [ln for ln in text.splitlines() if ln.strip()]','rows = text.splitlines()'),s66.replace('suffix = path.suffix.lower()','suffix = path.suffix'),s66.replace('            shutil.move(str(path), str(Path("done") / path.name))','            shutil.copy(str(path), str(Path("done") / path.name))'),s66.replace('    Path("report.txt").write_text("\\n".join(lines) + "\\n")\n',''),s66.replace('skipped += 1\n                continue','skipped += 1')],
    hints:['Check inbox.is_dir() first. Loop over sorted(p for p in inbox.iterdir() if p.is_file()), branching on path.suffix.lower().','For done/ duplicates: if (Path("done") / path.name).exists(): add "already done", count skipped, continue. Otherwise count rows/words and shutil.move into done/.','Collect lines in a list, append the summary, write "\\n".join(lines) + "\\n" to report.txt and print the same text.',s66]},
  power:{can:['Build a complete, repeatable file-processing job','Make automation idempotent, reported and safe'],
    expand:'Add per-file `try/except` so one unreadable file is reported and the rest still run, then add a `logging` summary.',
    where:'This is the shape of every cron job, ETL nightly run and CI chore that keeps companies running.',
    next:'Next: the Pipeline Capstone, where all the tools join forces.'},
  codex:{title:'Automation job',body:'Check preconditions; sorted() stable order; branch on suffix.lower(); idempotent (skip when done/<name> exists); move, never lose; build report lines once, print + write; end with counts. Safe to run twice.',snip:R`if (Path("done") / path.name).exists():
    lines.append(f"{path.name}: already done")
    continue`}
}
);
