// REALM 12 — THE MASTER GATE — part K (lessons 70-71: Boss and Gap Check)
const eqK = arr => 'lines[-' + arr.length + ':]==' + JSON.stringify(arr);

const h70b = R`version = input("Version: ").strip()
bump = input("Bump: ").strip().lower()
`;
const s70b = R`version = input("Version: ").strip()
bump = input("Bump: ").strip().lower()
parts = version.split(".")
if len(parts) != 3 or not all(p.isascii() and p.isdigit() for p in parts):
    print("Bad version")
elif bump not in ("major", "minor", "patch"):
    print("Bad bump")
else:
    major, minor, patch = (int(p) for p in parts)
    if bump == "major":
        major, minor, patch = major + 1, 0, 0
    elif bump == "minor":
        minor, patch = minor + 1, 0
    else:
        patch += 1
    print(f"{major}.{minor}.{patch}")`;

const h70d = R`import sqlite3

conn = sqlite3.connect(":memory:")
`;
const s70d = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE stock (name TEXT, qty INTEGER, price REAL)")
for item in input("Items: ").split():
    name, qty, price = item.split(":")
    conn.execute("INSERT INTO stock VALUES (?, ?, ?)", (name, int(qty), float(price)))
minimum = float(input("Min value: "))
rows = conn.execute(
    "SELECT name, SUM(qty * price) AS value FROM stock GROUP BY name "
    "HAVING SUM(qty * price) >= ? ORDER BY value DESC, name",
    (minimum,),
).fetchall()
if not rows:
    print("None")
for name, value in rows:
    print(f"{name}: {value:.2f}")`;

const h70e = R`from pathlib import Path

`;
const s70e = R`from pathlib import Path

def skipped(path):
    return any(part == "venv" or part.startswith(".") for part in path.parts[:-1])

found = []
for path in Path(".").rglob("*"):
    if path.is_file() and path.suffix.lower() == ".py" and not skipped(path):
        found.append((path.as_posix(), len(path.read_text().splitlines())))
found.sort()
if not found:
    print("No Python files")
else:
    for name, count in found:
        print(name, count)
    print("Total:", sum(count for _, count in found))`;

const items70 = 'sword:2:50 potion:10:3 sword:1:50 shield:1:40.5';

LESSONS.push(
{
  id:'r12-70', realm:12, n:70, title:'Boss: The Gatewright Colossus', kind:'boss',
  teaches:['realm12-boss'], requires:['mission12j'],
  story:`The Master Gate groans and a **Gatewright Colossus** steps out of the stonework, riveted from pinned versions, git hashes, test tubes, query plans and conveyor belts. Orrin steps back. "This is the final test of the professional's toolbox. **Five strikes.** Show it you can version, test, query and automate."`,
  boss:{name:'The Gatewright Colossus', hp:5},
  phases:[
    {type:'mcq', code:R`def key(v):
    return tuple(int(x) for x in v.split("."))

print(max(["1.9.5", "1.10.0", "1.2.30"], key=key))`, q:'Strike 1: Which release is the newest?', opts:['1.10.0','1.9.5','1.2.30'], ans:0,
     why:'Versions compare number by number: (1, 10, 0) beats (1, 9, 5). Compared as text, "1.9.5" would wrongly win.', tags:['r12-12']},
    {type:'write', prompt:'Strike 2: Ask `Version: ` (like `1.4.2`) and `Bump: ` (`major`, `minor` or `patch`, any capitalisation). Print the next version: a **major** bump resets minor and patch to 0, a **minor** bump resets patch to 0. A version must be exactly three whole numbers separated by dots, otherwise print `Bad version`; an unknown bump prints `Bad bump` (check the version first).',
     starter:h70b,
     inputs:['1.4.2','minor'],
     cases:[{inputs:['1.4.2','minor'],tests:[['Minor',eqK(['1.5.0'])]]},{inputs:['1.4.2','major'],tests:[['Major',eqK(['2.0.0'])]]},{inputs:['1.4.2','patch'],tests:[['Patch',eqK(['1.4.3'])]]},{inputs:['1.9.9','Patch'],tests:[['Carry-free and case-insensitive',eqK(['1.9.10'])]]},{inputs:[' 1.0.0 ','MAJOR'],tests:[['Spaces',eqK(['2.0.0'])]]},{inputs:['0.0.0','patch'],tests:[['Zero',eqK(['0.0.1'])]]},{inputs:['1.2','patch'],tests:[['Too short',eqK(['Bad version'])]]},{inputs:['1.2.3.4','patch'],tests:[['Too long',eqK(['Bad version'])]]},{inputs:['1.x.2','minor'],tests:[['Not numbers',eqK(['Bad version'])]]},{inputs:['','patch'],tests:[['Empty',eqK(['Bad version'])]]},{inputs:['1.2.3','huge'],tests:[['Bad bump',eqK(['Bad bump'])]]},{inputs:['bad','huge'],tests:[['Version is checked first',eqK(['Bad version'])]]}],
     sol:s70b,
     wrong:[s70b.replace('minor, patch = minor + 1, 0','minor += 1'),s70b.replace('major, minor, patch = major + 1, 0, 0','major += 1'),s70b.replace('.strip().lower()\nparts','.strip()\nparts'),s70b.replace('elif bump not in ("major", "minor", "patch"):\n    print("Bad bump")\nelse:','else:').replace('    else:\n        patch += 1','    elif bump == "patch":\n        patch += 1\n    else:\n        print("Bad bump")\n        raise SystemExit'),s70b.replace('len(parts) != 3 or ',''),s70b.replace('    else:\n        patch += 1','    else:\n        patch += 2')],
     hints:['Split on ".": exactly 3 parts, all digits. Check the version before the bump name.','major: (major + 1, 0, 0); minor: (major, minor + 1, 0); patch: (major, minor, patch + 1).','Lower-case the bump word and strip both inputs. Print f"{major}.{minor}.{patch}".',s70b],
     tags:['r12-12','r12-13']},
    {type:'mcq', code:R`import io
import unittest

class T(unittest.TestCase):
    def test_zero(self):
        with self.assertRaises(ZeroDivisionError):
            10 / 2

suite = unittest.defaultTestLoader.loadTestsFromTestCase(T)
result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
print(result.wasSuccessful())`, q:'Strike 3: What prints?', opts:['False','True','Error'], ans:0,
     why:'assertRaises fails when the code inside does NOT raise the expected exception: 10 / 2 is fine, so the test fails.', tags:['r12-15']},
    {type:'write', prompt:'Strike 4: Ask `Items: ` (space-separated `name:qty:price`) and `Min value: ` (a number). Store the items in an in-memory SQLite table using `?` placeholders. Print `<name>: <total value, 2 decimals>` for each name whose **total value** (sum of qty x price over all its rows) is **at least** the minimum, biggest first (ties by name). If none qualify print `None`.',
     starter:h70d,
     inputs:[items70,'40'],
     cases:[{inputs:[items70,'40'],tests:[['Threshold',eqK(['sword: 150.00','shield: 40.50'])],['Uses SQL','"GROUP BY" in src.upper()']]},{inputs:[items70,'0'],tests:[['Everything',eqK(['sword: 150.00','shield: 40.50','potion: 30.00'])]]},{inputs:[items70,'200'],tests:[['Nothing qualifies',eqK(['None'])]]},{inputs:['a:1:5 b:5:1','5'],tests:[['Inclusive, ties by name',eqK(['a: 5.00','b: 5.00'])]]},{inputs:['','0'],tests:[['No items',eqK(['None'])]]},{inputs:["x'y:1:1",'1'],tests:[['Apostrophe is safe',eqK(["x'y: 1.00"])]]},{inputs:['a:1:2 a:1:2 b:1:3','4'],tests:[['Rows of one name are added up',eqK(['a: 4.00'])]]}],
     sol:s70d,
     wrong:[s70d.replace('HAVING SUM(qty * price) >= ?','HAVING SUM(qty * price) > ?'),s70d.replace('ORDER BY value DESC, name','ORDER BY value, name'),s70d.replace('SUM(qty * price) AS value','SUM(qty) AS value').replace('HAVING SUM(qty * price)','HAVING SUM(qty)'),s70d.replace('conn.execute("INSERT INTO stock VALUES (?, ?, ?)", (name, int(qty), float(price)))','conn.execute(f"INSERT INTO stock VALUES (\'{name}\', {qty}, {price})")'),s70d.replace('GROUP BY name ','GROUP BY name, qty '),s70d.replace('value DESC, name','value DESC')],
     hints:['CREATE TABLE stock (name TEXT, qty INTEGER, price REAL); insert each item with (name, int(qty), float(price)) placeholders.','SELECT name, SUM(qty * price) AS value FROM stock GROUP BY name HAVING SUM(qty * price) >= ? ORDER BY value DESC, name.','Pass (minimum,) as the parameter; if fetchall() is empty print "None"; print f"{name}: {value:.2f}".',s70d],
     tags:['r12-52','r12-54','r12-56']},
    {type:'write', prompt:'Strike 5: Count the lines of Python in the current folder tree. For every `.py` file (the extension in any capitalisation) below the current folder, **except** files inside a folder named `venv` or whose name starts with `.`, print `<path> <number of lines>` (path with `/`), sorted as text by the printed path. Finish with `Total: <sum>`. If there are none print `No Python files`.',
     starter:h70e,
     inputs:[],
     cases:[{inputs:[],files:{'main.py':'a\nb\nc\n','pkg/util.py':'x\ny\n','pkg/data.txt':'q','venv/lib/site.py':'1\n2\n3\n4\n','.git/hooks/h.py':'z\n','Tool.PY':'t\n'},tests:[['Report',eqK(['Tool.PY 1','main.py 3','pkg/util.py 2','Total: 6'])],['Uses pathlib','"pathlib" in src']]},{inputs:[],files:{'a.py':'1\n','a/b.py':'1\n2\n'},tests:[['Sorted as text',eqK(['a.py 1','a/b.py 2','Total: 3'])]]},{inputs:[],files:{},tests:[['Empty',eqK(['No Python files'])]]},{inputs:[],files:{'x.txt':'t'},tests:[['No .py files',eqK(['No Python files'])]]},{inputs:[],files:{'.hidden.py':'1\n'},tests:[['A hidden FILE still counts',eqK(['.hidden.py 1','Total: 1'])]]},{inputs:[],files:{'src/venv/x.py':'1\n','src/ok.py':'1\n2\n'},tests:[['venv anywhere is skipped',eqK(['src/ok.py 2','Total: 2'])]]},{inputs:[],files:{'venvx/a.py':'1\n'},tests:[['venvx is not venv',eqK(['venvx/a.py 1','Total: 1'])]]},{inputs:[],files:{'a.py':'x','b.py':''},tests:[['No trailing newline and empty file',eqK(['a.py 1','b.py 0','Total: 1'])]]}],
     sol:s70e,
     wrong:[s70e.replace('for path in Path(".").rglob("*"):','for path in Path(".").glob("*"):'),s70e.replace('path.suffix.lower() == ".py"','path.suffix == ".py"'),s70e.replace('part == "venv" or part.startswith(".") for part in path.parts[:-1]','"venv" in str(path) or str(path).startswith(".")'),s70e.replace('path.parts[:-1]','path.parts'),s70e.replace('found.sort()\n',''),s70e.replace('len(path.read_text().splitlines())','len(path.read_text().split("\\n"))'),s70e.replace('part == "venv" or ','')],
     hints:['for path in Path(".").rglob("*"): keep files where path.suffix.lower() == ".py".','Skip when any parent folder (path.parts[:-1]) is "venv" or starts with ".": the file name itself does not count.','Build (path.as_posix(), len(path.read_text().splitlines())) pairs, sort them, print them and the total.',s70e],
     tags:['r12-61','r12-62']}
  ],
  power:{can:['Version software, test behaviour, query databases and automate files in one sitting','Spot classic traps: lexical version compare, string-built SQL, venv look-alike folders'],
    expand:'Turn the four strikes into one small release-and-report toolkit and add unit tests for each function.',
    where:'Bumping versions, safe SQL, folder scans and tests are weekly work for professional developers.',
    next:'One more gate: the Master Gate Gap Check.'},
  codex:{title:'Realm 12 boss',body:'You can bump semantic versions, read test results, aggregate data safely with SQL placeholders and walk folder trees with pathlib, skipping what you must.',snip:R`rows = conn.execute("SELECT name, SUM(qty * price) FROM stock GROUP BY name HAVING SUM(qty * price) >= ?", (minimum,))`}
},
{
  id:'r12-71', realm:12, n:71, title:'Gap Check: the Master Gate Trial', kind:'gap', passPct:80,
  teaches:['realm12-gap'], requires:['realm12-boss'],
  story:`The Colossus crumbles into a neat stack of tools: a trowel, a lens, a brass key. Orrin hands you the key. "Eighty percent opens the final door. Beyond it lie the **Interview Arena** and the **Portfolio Hall**, where everything you have built becomes a career."`,
  phases:[
    {type:'mcq', code:R`def key(v):
    return tuple(int(x) for x in v.split("."))

print(key("2.10.1") > key("2.9.9"))`, q:'What prints?', opts:['True','False','Error'], ans:0, why:'(2, 10, 1) is bigger than (2, 9, 9) because 10 > 9.', tags:['r12-12']},
    {type:'mcq', code:R`import tomllib

data = tomllib.loads('[tool]\nname = "x"\nport = 80')
print(data["tool"]["port"] + 1)`, q:'What prints?', opts:['80','81','Error: port is a string'], ans:1, why:'TOML integers load as Python ints, so 80 + 1 is 81.', tags:['r12-04']},
    {type:'mcq', code:R`defaults = {"port": "80", "debug": "0"}
file_cfg = {"port": "8080"}
env = {"debug": "1"}
cfg = {**defaults, **file_cfg, **env}
print(cfg["port"], cfg["debug"])`, q:'What prints?', opts:['80 0','8080 1','8080 0'], ans:1, why:'Later layers override earlier ones: defaults < file < environment.', tags:['r12-05']},
    {type:'mcq', code:R`import hashlib

a = hashlib.sha1(b"hello").hexdigest()
b = hashlib.sha1(b"hello").hexdigest()
c = hashlib.sha1(b"Hello").hexdigest()
print(a == b, a == c)`, q:'What prints?', opts:['True True','False False','True False'], ans:2, why:'Same content, same hash; one changed letter, a completely different hash.', tags:['r12-07']},
    {type:'mcq', code:R`from fnmatch import fnmatch

print(fnmatch("a.py", "*.py"), fnmatch("dir/a.py", "*.py"))`, q:'What prints?', opts:['True False','True True','False False'], ans:1, why:'In fnmatch the * also matches slashes, so both paths match.', tags:['r12-11']},
    {type:'mcq', code:R`from unittest.mock import Mock

m = Mock(return_value=5)
m(1)
m(2)
print(m.call_count, m.call_args.args)`, q:'What prints?', opts:['1 (1,)','2 (2,)','2 (1,)'], ans:1, why:'The mock was called twice; call_args is the most recent call, with args (2,).', tags:['r12-20']},
    {type:'mcq', code:R`import argparse

p = argparse.ArgumentParser()
p.add_argument("name")
p.add_argument("--times", type=int, default=1)
a = p.parse_args(["ada", "--times", "3"])
print(a.name * a.times)`, q:'What prints?', opts:['ada3','adaadaada','ada ada ada'], ans:1, why:'--times is converted to the int 3, and "ada" * 3 repeats the text.', tags:['r12-31','r12-32']},
    {type:'mcq', code:R`import argparse

p = argparse.ArgumentParser()
p.add_argument("n", type=int)
try:
    p.parse_args(["abc"])
except SystemExit as error:
    print(error.code)`, q:'What prints on the screen (the usage message goes to stderr)?', opts:['0','1','2'], ans:2, why:'argparse exits with status 2 for command-line usage errors.', tags:['r12-34']},
    {type:'mcq', code:R`delays = [min(2 ** n, 5) for n in range(5)]
print(delays)`, q:'What prints?', opts:['[1, 2, 4, 8, 16]','[1, 2, 4, 5, 5]','[0, 1, 2, 3, 4]'], ans:1, why:'Exponential backoff doubles each time but is capped by min(..., 5).', tags:['r12-42']},
    {type:'mcq', code:R`import pandas as pd

df = pd.DataFrame({"x": [1, 5, 9]})
print(df[(df["x"] > 2) & (df["x"] < 9)]["x"].tolist())`, q:'What prints?', opts:['[5, 9]','[5]','[1, 5, 9]'], ans:1, why:'Both conditions must hold: only 5 is above 2 and below 9.', tags:['r12-47']},
    {type:'mcq', code:R`import pandas as pd

a = pd.DataFrame({"id": [1, 2, 3]})
b = pd.DataFrame({"id": [2, 3, 4], "v": [20, 30, 40]})
print(len(a.merge(b, on="id")), len(a.merge(b, on="id", how="left")))`, q:'What prints?', opts:['3 3','2 3','2 2'], ans:1, why:'The default inner join keeps only ids in both tables (2); the left join keeps all 3 rows of a.', tags:['r12-49']},
    {type:'mcq', code:R`import sqlite3

c = sqlite3.connect(":memory:")
c.execute("CREATE TABLE u (n TEXT)")
c.executemany("INSERT INTO u VALUES (?)", [("a",), ("b",)])
name = "a' OR '1'='1"
print(len(c.execute("SELECT n FROM u WHERE n = ?", (name,)).fetchall()))`, q:'How many rows come back?', opts:['2','0','1'], ans:1, why:'With a placeholder the whole hostile string is just data, and no name equals it.', tags:['r12-54']},
    {type:'mcq', code:R`import sqlite3

c = sqlite3.connect(":memory:")
c.execute("CREATE TABLE a (id INTEGER)")
c.execute("CREATE TABLE b (aid INTEGER)")
c.executemany("INSERT INTO a VALUES (?)", [(1,), (2,)])
c.execute("INSERT INTO b VALUES (1)")
print(c.execute("SELECT COUNT(*) FROM a LEFT JOIN b ON b.aid = a.id").fetchone()[0],
      c.execute("SELECT COUNT(b.aid) FROM a LEFT JOIN b ON b.aid = a.id").fetchone()[0])`, q:'What prints?', opts:['2 1','2 2','1 1'], ans:0, why:'LEFT JOIN keeps both rows of a (COUNT(*) = 2), but COUNT(b.aid) skips the NULL for id 2.', tags:['r12-57']},
    {type:'mcq', code:R`import sqlite3

c = sqlite3.connect(":memory:")
c.execute("CREATE TABLE t (x INTEGER UNIQUE)")
c.commit()
try:
    with c:
        c.execute("INSERT INTO t VALUES (1)")
        c.execute("INSERT INTO t VALUES (1)")
except sqlite3.IntegrityError:
    pass
print(c.execute("SELECT COUNT(*) FROM t").fetchone()[0])`, q:'What prints?', opts:['1','2','0'], ans:2, why:'The duplicate raised inside the transaction block, so BOTH inserts were rolled back.', tags:['r12-58','r12-59']},
    {type:'mcq', code:R`import calendar
from datetime import date

print(calendar.monthrange(2028, 2)[1], (date(2026, 3, 1) - date(2026, 2, 1)).days)`, q:'What prints?', opts:['28 28','29 28','29 31'], ans:1, why:'2028 is a leap year (29 days in February); February 2026 has 28 days.', tags:['r12-63']}
  ],
  power:{can:['Recall the core of environments, git, testing, linting, CLI tools, web calls, pandas, SQL and automation','Pass the Master Gate trial'],
    expand:'Rebuild your three weakest phases as mini-programs and add a unit test for each.',
    where:'This professional toolbox is what employers mean by "can work on a real codebase".',
    next:'Next: the Interview Arena and the Portfolio Hall (Stage 8).'},
  codex:{title:'Realm 12 gap check',body:'Semantic versions, TOML, config layers, hashes, glob rules, unittest and mocks, argparse and exit codes, backoff, pandas filtering and merging, SQL injection, joins, transactions and dates: all checked.',snip:R`with conn:
    conn.execute(debit)
    conn.execute(credit)`}
}
);
