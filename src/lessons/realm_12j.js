// REALM 12 — THE MASTER GATE — part J (lessons 67-69: the pipeline capstone)
const eqJ = (arr, prefix) => '[l for l in lines if not l.startswith("' + prefix + '")]==' + JSON.stringify(arr);
const eqJt = arr => 'lines[-' + arr.length + ':]==' + JSON.stringify(arr);

const hdr67 = R`import csv
import json
import math
from datetime import date

`;
const stub67 = R`def check(row, seen):
    """Return (record, None) for a good row, or (None, reason) for a bad one."""
    pass

`;
const chk67 = R`def check(row, seen):
    """Return (record, None) for a good row, or (None, reason) for a bad one."""
    raw_id = (row.get("id") or "").strip()
    if not (raw_id.isascii() and raw_id.isdigit()):
        return None, "bad id"
    if int(raw_id) in seen:
        return None, "duplicate id"
    client = (row.get("client") or "").strip()
    if not client:
        return None, "blank client"
    try:
        qty = int(row.get("qty") or "")
    except ValueError:
        return None, "bad qty"
    if qty <= 0:
        return None, "bad qty"
    try:
        price = float(row.get("price") or "")
    except ValueError:
        return None, "bad price"
    if price < 0 or not math.isfinite(price):
        return None, "bad price"
    try:
        day = date.fromisoformat((row.get("date") or "").strip())
    except ValueError:
        return None, "bad date"
    record = {"id": int(raw_id), "client": client, "item": (row.get("item") or "").strip(),
              "qty": qty, "price": price, "date": day.isoformat()}
    return record, None

`;
const main67 = R`valid, rejects, seen = [], [], set()
with open("contracts.csv", newline="") as f:
    for number, row in enumerate(csv.DictReader(f), start=2):
        record, reason = check(row, seen)
        if reason:
            rejects.append(f"line {number}: {reason}")
        else:
            seen.add(record["id"])
            valid.append(record)

valid.sort(key=lambda r: r["id"])
with open("clean.json", "w") as f:
    json.dump(valid, f, indent=2)
with open("rejects.txt", "w") as f:
    f.write("".join(line + "\n" for line in rejects))
print("Valid:", len(valid))
print("Rejected:", len(rejects))`;
const e67 = R`import csv
import io
import json

raw = "id,qty\n1,5\nx,2\n3,-4\n"
good, bad = [], []
for number, row in enumerate(csv.DictReader(io.StringIO(raw)), start=2):   # line 1 is the header
    if not row["id"].isdigit():
        bad.append(f"line {number}: bad id")
    elif int(row["qty"]) <= 0:
        bad.append(f"line {number}: bad qty")
    else:
        good.append({"id": int(row["id"]), "qty": int(row["qty"])})
print(good)
print(bad)
text = json.dumps(good, indent=2)          # json.dump(obj, file) writes to a file
print(json.loads(text) == good)            # round trip: what you save is what you load`;

const hdr68 = R`import json
import sqlite3

conn = sqlite3.connect("contracts.db")
`;
const main68 = R`conn.execute(
    "CREATE TABLE IF NOT EXISTS contracts ("
    "id INTEGER PRIMARY KEY, client TEXT NOT NULL, item TEXT, "
    "qty INTEGER CHECK (qty > 0), price REAL, date TEXT)"
)
while True:
    parts = input("> ").split()
    if not parts or parts[0] == "quit":
        break
    if parts == ["load"]:
        with open("clean.json") as f:
            records = json.load(f)
        with conn:
            conn.executemany(
                "INSERT OR REPLACE INTO contracts (id, client, item, qty, price, date) "
                "VALUES (?, ?, ?, ?, ?, ?)",
                [(r["id"], r["client"], r["item"], r["qty"], r["price"], r["date"]) for r in records],
            )
        print("Loaded", len(records))
    elif parts == ["count"]:
        print("Rows:", conn.execute("SELECT COUNT(*) FROM contracts").fetchone()[0])
    elif len(parts) == 2 and parts[0] == "top" and parts[1].isdigit():
        rows = conn.execute(
            "SELECT client, SUM(qty * price) AS revenue FROM contracts "
            "GROUP BY client ORDER BY revenue DESC, client LIMIT ?",
            (int(parts[1]),),
        ).fetchall()
        for client, revenue in rows:
            print(f"{client}: {revenue:.2f}")
    else:
        print("Unknown command")
conn.close()`;
const e68 = R`import json
import sqlite3

records = [{"id": 1, "client": "Ada", "qty": 2, "price": 50.0}]
conn = sqlite3.connect("demo.db")                           # a real file this time
conn.execute("CREATE TABLE IF NOT EXISTS c (id INTEGER PRIMARY KEY, client TEXT, qty INTEGER, price REAL)")
for _ in range(2):                                          # run the load twice on purpose
    with conn:                                              # commit when the block succeeds
        conn.executemany("INSERT OR REPLACE INTO c VALUES (?, ?, ?, ?)",
                         [(r["id"], r["client"], r["qty"], r["price"]) for r in records])
print(conn.execute("SELECT COUNT(*) FROM c").fetchone()[0])  # 1: loading twice changed nothing
conn.close()
other = sqlite3.connect("demo.db")                          # a second connection sees the saved data
print(other.execute("SELECT client, qty * price FROM c").fetchall())`;

const hdr69 = R`import csv
import math
import sqlite3
from datetime import date

`;
const main69 = R`valid, rejects, seen = [], [], set()
with open("contracts.csv", newline="") as f:
    for number, row in enumerate(csv.DictReader(f), start=2):
        record, reason = check(row, seen)
        if reason:
            rejects.append(f"line {number}: {reason}")
        else:
            seen.add(record["id"])
            valid.append(record)

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE contracts (id INTEGER PRIMARY KEY, client TEXT, qty INTEGER, price REAL, date TEXT)")
conn.executemany(
    "INSERT INTO contracts VALUES (?, ?, ?, ?, ?)",
    [(r["id"], r["client"], r["qty"], r["price"], r["date"]) for r in valid],
)

lines = [f"Contracts: {len(valid)} valid, {len(rejects)} rejected"]
if not valid:
    lines.append("No valid contracts")
else:
    revenue = conn.execute("SELECT SUM(qty * price) FROM contracts").fetchone()[0]
    month, month_total = conn.execute(
        "SELECT substr(date, 1, 7) AS m, SUM(qty * price) AS t FROM contracts "
        "GROUP BY m ORDER BY t DESC, m LIMIT 1"
    ).fetchone()
    lines.append(f"Revenue: {revenue:.2f}")
    lines.append(f"Best month: {month} ({month_total:.2f})")
    lines.append("Top clients:")
    top = conn.execute(
        "SELECT client, SUM(qty * price) AS t FROM contracts GROUP BY client ORDER BY t DESC, client LIMIT 3"
    ).fetchall()
    for rank, (client, total) in enumerate(top, start=1):
        lines.append(f"{rank}. {client} - {total:.2f}")

with open("report.txt", "w") as f:
    f.write("\n".join(lines) + "\n")
with open("rejects.txt", "w") as f:
    f.write("".join(line + "\n" for line in rejects))
print(lines[0])
print("Report written to report.txt")`;
const e69 = R`import sqlite3

# The whole pipeline in miniature: raw rows -> validated records -> SQL summary -> text report
raw = [("1", "Ada", "2", "50"), ("2", "", "1", "10"), ("3", "Bob", "x", "5"), ("4", "Cy", "3", "10")]
valid, rejects = [], []
for number, (rid, client, qty, price) in enumerate(raw, start=2):
    if not client:
        rejects.append(f"line {number}: blank client")
    elif not qty.isdigit():
        rejects.append(f"line {number}: bad qty")
    else:
        valid.append((int(rid), client, int(qty), float(price)))
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE c (id INTEGER PRIMARY KEY, client TEXT, qty INTEGER, price REAL)")
conn.executemany("INSERT INTO c VALUES (?, ?, ?, ?)", valid)
total = conn.execute("SELECT SUM(qty * price) FROM c").fetchone()[0]
print(f"{len(valid)} valid, {len(rejects)} rejected, revenue {total:.2f}")
print(rejects)`;

const c67 = 'id,client,item,qty,price,date\n1,Ada,Sword,2,50.00,2026-01-05\n2,Bob,Shield,1,40.50,2026-01-20\n3,Ada,Potion,10,3,2026-02-02\nx,Cy,Sword,1,50,2026-02-14\n2,Dee,Sword,1,50,2026-02-15\n5,,Sword,1,50,2026-02-16\n6,Eve,Sword,0,50,2026-02-17\n7,Fay,Sword,1,abc,2026-02-18\n8,Gus,Sword,1,50,2026-13-01\n9,Bob,Potion,4,2.5,2026-03-05\n';
const clean67 = [
  {id:1,client:'Ada',item:'Sword',qty:2,price:50,date:'2026-01-05'},
  {id:2,client:'Bob',item:'Shield',qty:1,price:40.5,date:'2026-01-20'},
  {id:3,client:'Ada',item:'Potion',qty:10,price:3,date:'2026-02-02'},
  {id:9,client:'Bob',item:'Potion',qty:4,price:2.5,date:'2026-03-05'}];
const rej67 = ['line 5: bad id','line 6: duplicate id','line 7: blank client','line 8: bad qty','line 9: bad price','line 10: bad date'];
const c67b = 'id,client,item,qty,price,date\na,,x,0,-1,nope\n5,,x,0,-1,nope\n6,Z,x,0,-1,nope\n7,Z,x,1,-1,nope\n8,Z,x,1,0,nope\n9,Z,x,1,0,2026-02-29\n10,Z,x,1,nan,2026-02-28\n11,Z,x,1,0,2026-02-28\n';
const rej67b = ['line 2: bad id','line 3: blank client','line 4: bad qty','line 5: bad price','line 6: bad date','line 7: bad date','line 8: bad price'];
const c67c = 'id,client,item,qty,price,date\n 3 , Ann ,Axe, 2 ,5, 2026-01-01 \n';
const c67d = 'id,client,item,qty,price,date\n3,A,x,1,1,2026-01-01\n1,B,x,1,1,2026-01-02\n';
const jsonT = (arr) => 'json.loads(read("clean.json"))==' + JSON.stringify(arr);

const clean68 = JSON.stringify(clean67);
const clean68b = JSON.stringify([{id:1,client:'Ada',item:'x',qty:1,price:10,date:'2026-01-01'},{id:1,client:'Ada',item:'x',qty:5,price:10,date:'2026-01-02'}]);
const q68 = ['load','load','count','top 2','top 5','top x','quit'];
const o68 = ['Loaded 4','Loaded 4','Rows: 4','Ada: 130.00','Bob: 50.50','Ada: 130.00','Bob: 50.50','Unknown command'];

const c69 = 'id,client,item,qty,price,date\n1,Ada,Sword,2,50,2026-01-10\n2,Bob,Shield,1,40.5,2026-02-10\n3,Cy,Potion,10,3,2026-02-11\n4,Ada,Potion,5,3,2026-03-01\n5,Bob,Sword,1,50,2026-03-02\n6,Cy,Sword,x,50,2026-03-03\n7,Dee,Bow,2,25,2026-13-45\n2,Eve,Bow,1,10,2026-03-04\n';
const rep69 = 'Contracts: 5 valid, 3 rejected\nRevenue: 235.50\nBest month: 2026-01 (100.00)\nTop clients:\n1. Ada - 115.00\n2. Bob - 90.50\n3. Cy - 30.00\n';
const c69t = 'id,client,item,qty,price,date\n1,Zed,A,1,10,2026-02-01\n2,Amy,B,1,10,2026-01-01\n';
const rep69t = 'Contracts: 2 valid, 0 rejected\nRevenue: 20.00\nBest month: 2026-01 (10.00)\nTop clients:\n1. Amy - 10.00\n2. Zed - 10.00\n';
const c69four = 'id,client,item,qty,price,date\n1,A,x,1,1,2026-01-01\n2,B,x,1,2,2026-01-02\n3,C,x,1,3,2026-01-03\n4,D,x,1,4,2026-01-04\n';
const rep69four = 'Contracts: 4 valid, 0 rejected\nRevenue: 10.00\nBest month: 2026-01 (10.00)\nTop clients:\n1. D - 4.00\n2. C - 3.00\n3. B - 2.00\n';
const rep69e = 'Contracts: 0 valid, 0 rejected\nNo valid contracts\n';
const rp = (s) => 'read("report.txt")==' + JSON.stringify(s);

LESSONS.push(
{
  id:'r12-67', realm:12, n:67, title:'Pipeline I: ingest and validate',
  teaches:['pipe-ingest'], requires:['mission12i'],
  story:`The **Great Workshop** lies beyond the Annex, where raw contracts arrive by the cartload: half of them smudged, duplicated or simply wrong. "Every real system begins as a **pipeline**," Orrin says, rolling up his sleeves. "Raw data in one end, trustworthy data out the other. Stage one: **let nothing bad through, and say exactly why.**"`,
  concept:{
    html:`A **data pipeline** is a chain of small, testable stages:\n\n\`\`\`\nCSV file  ->  validate  ->  clean.json (+ rejects.txt)  ->  database  ->  report\n  (this lesson)               (next)                      (then)\n\`\`\`\n\n**Ingest & validate** rules for stage one:\n\n1. Put the rules in one function, \`check(row, seen)\`, returning \`(record, None)\` or \`(None, reason)\`. Small functions are easy to test.\n2. Check in a **fixed order** so the reason is predictable (id, duplicate, client, qty, price, date).\n3. Accept only what you can fully trust: \`isdigit()\` for ids, \`int()\`/\`float()\` in \`try/except ValueError\`, \`date.fromisoformat\` for dates.\n4. \`float("nan")\` and \`"inf"\` parse as valid floats! Reject them with \`math.isfinite\`.\n5. **Never silently drop**: write each reject with its **line number** (\`enumerate(reader, start=2)\`, the header is line 1) to \`rejects.txt\`.\n6. Save the clean records as **JSON** with \`json.dump\`: a simple, universal hand-off format between stages.\n7. Sort the output so reruns give identical files.\n\nThe pattern, validate at the edge, then trust the inside, appears in every serious system.`,
    analogy:`A customs desk: every parcel is checked against the rules, stamped or refused with a written reason.`,
    example:e67},
  predict:{code:R`print("12".isdigit(), "x1".isdigit(), "".isdigit())`, q:'What prints?', opts:['True False False','True False True','True True False'], ans:0, why:'isdigit() needs at least one character and all digits; an empty string is False.'},
  cast:{code:e67, task:'Cast it.'},
  bug:{broken:R`price = float("nan")
print("valid" if not price < 0 else "invalid")`, task:'"nan" slips through a plain comparison and is called valid. Use math.isfinite so a NaN price is "invalid". Expected: invalid',
    cases:[{inputs:[],tests:[['Works','lines==["invalid"]'],['isfinite','"isfinite" in src']]}],
    sol:R`import math
price = float("nan")
print("valid" if price >= 0 and math.isfinite(price) else "invalid")`, wrong:[R`print("invalid")`]},
  write:{prompt:'`contracts.csv` has `id,client,item,qty,price,date`. Finish the function `check(row, seen)` (it gets a dict and the set of ids already accepted) so it returns `(record, None)` or `(None, reason)`. The reasons, checked **in this order**: `bad id` (not all ASCII digits), `duplicate id`, `blank client`, `bad qty` (not an int, or below 1), `bad price` (not a finite number, or below 0), `bad date` (not `YYYY-MM-DD`). Fields may have stray spaces. A record is `{"id": int, "client", "item", "qty": int, "price": float, "date": "YYYY-MM-DD"}`. Then write the pipeline: valid records **sorted by id** go to `clean.json` (use `json.dump`); every rejected row goes to `rejects.txt` as `line <n>: <reason>` (header = line 1); print `Valid: <n>` and `Rejected: <n>`.',
    starter:hdr67 + stub67,
    inputs:[],
    cases:[{inputs:[],files:{'contracts.csv':c67},tests:[['Output',eqJt(['Valid: 4','Rejected: 6'])],['clean.json',jsonT(clean67)],['rejects.txt','read("rejects.txt").splitlines()==' + JSON.stringify(rej67)],['Uses json','"json.dump" in src']]},{inputs:[],files:{'contracts.csv':c67b},tests:[['Order of checks and edge cases',eqJt(['Valid: 1','Rejected: 7'])],['Reasons','read("rejects.txt").splitlines()==' + JSON.stringify(rej67b)],['Good row',jsonT([{id:11,client:'Z',item:'x',qty:1,price:0,date:'2026-02-28'}])]]},{inputs:[],files:{'contracts.csv':'id,client,item,qty,price,date\n'},tests:[['Header only',eqJt(['Valid: 0','Rejected: 0'])],['Empty outputs','json.loads(read("clean.json"))==[] and read("rejects.txt")==""']]},{inputs:[],files:{'contracts.csv':c67c},tests:[['Spaces are stripped',jsonT([{id:3,client:'Ann',item:'Axe',qty:2,price:5,date:'2026-01-01'}])]]},{inputs:[],files:{'contracts.csv':c67d},tests:[['Sorted by id',jsonT([{id:1,client:'B',item:'x',qty:1,price:1,date:'2026-01-02'},{id:3,client:'A',item:'x',qty:1,price:1,date:'2026-01-01'}])]]}],
    sol:hdr67 + chk67 + main67,
    wrong:[hdr67 + chk67.replace('    if int(raw_id) in seen:\n        return None, "duplicate id"\n','') + main67,hdr67 + chk67.replace('    if qty <= 0:','    if qty < 0:') + main67,hdr67 + chk67.replace('date.fromisoformat((row.get("date") or "").strip())','date(2000, 1, 1)') + main67,hdr67 + chk67 + main67.replace('start=2','start=1'),hdr67 + chk67.replace(' or not math.isfinite(price)','') + main67,hdr67 + chk67 + main67.replace('valid.sort(key=lambda r: r["id"])\n',''),hdr67 + chk67.replace('if price < 0','if price <= 0') + main67,hdr67 + chk67.replace('    if not (raw_id.isascii() and raw_id.isdigit()):\n        return None, "bad id"\n','') + main67],
    hints:['check(): strip the fields, then test in order: id (isdigit), duplicate (in seen), client (blank), qty (int > 0), price (float, finite, >= 0), date (fromisoformat). Return (None, "reason") at the first failure.','Main loop: for number, row in enumerate(csv.DictReader(f), start=2): record, reason = check(row, seen); add the id to seen for good rows.','Write valid.sort(key=...) to clean.json with json.dump(valid, f, indent=2) and one "line N: reason" per reject to rejects.txt; print the two counts.',hdr67 + chk67 + main67]},
  power:{can:['Validate untrusted data with clear, ordered rules and reasons','Hand off clean data and a reject log to the next pipeline stage as JSON and text'],
    expand:'Add a `reject-summary` line: how many rows failed for each reason, using `collections.Counter`.',
    where:'Every data team, import tool and onboarding script validates at the edge exactly like this.',
    next:'Next: stage two, loading the clean data into a database.'},
  codex:{title:'Validate at the edge',body:'One check(row, seen) -> (record, None) | (None, reason); fixed check order; isdigit / try-int / try-float / math.isfinite / fromisoformat; never drop silently (line numbers: enumerate(start=2)); json.dump the clean output; sort for stable reruns.',snip:R`record, reason = check(row, seen)
if reason:
    rejects.append(f"line {number}: {reason}")`}
},
{
  id:'r12-68', realm:12, n:68, title:'Pipeline II: load and query a database',
  teaches:['pipe-load'], requires:['pipe-ingest'],
  story:`The clean contracts glow on the Workshop bench, but a folder of JSON cannot answer *who earned the most*. "Stage two," says Orrin. "Put them where questions can be asked: a **database file** that survives the night. And make it safe to load **twice**."`,
  concept:{
    html:`Stage two **loads** clean data into SQLite and answers questions.\n\n\`\`\`\nconn = sqlite3.connect("contracts.db")        # a FILE: data survives after the program ends\nconn.execute("CREATE TABLE IF NOT EXISTS contracts (...)")   # safe to run every time\nwith conn:                                      # one transaction: all rows or none\n    conn.executemany("INSERT OR REPLACE INTO contracts VALUES (?, ?, ?, ?, ?, ?)", rows)\n\`\`\`\n\n- **Idempotent load**: \`INSERT OR REPLACE\` (an *upsert*) with a \`PRIMARY KEY\` means reloading the same file changes nothing, and a corrected record replaces the old one. A plain \`INSERT\` would crash with \`IntegrityError\` on the second run.\n- \`CREATE TABLE IF NOT EXISTS\` lets the script run repeatedly.\n- \`with conn:\` commits on success and rolls back on error. **Without a commit, other connections see nothing.**\n- Keep \`CHECK\` and \`NOT NULL\` constraints as the second line of defence.\n- Questions are just SQL: revenue per client is \`SUM(qty * price) ... GROUP BY client ORDER BY revenue DESC, client LIMIT ?\`.\n- \`float\` money is fine for a demo; real finance code stores integer cents or uses \`decimal\`.`,
    analogy:`Shelving every clean parcel in a labelled warehouse, in such a way that re-shelving the same parcel never makes duplicates.`,
    example:e68},
  predict:{code:R`import sqlite3
c = sqlite3.connect(":memory:")
c.execute("CREATE TABLE t (id INTEGER PRIMARY KEY, v TEXT)")
c.execute("INSERT OR REPLACE INTO t VALUES (1, 'a')")
c.execute("INSERT OR REPLACE INTO t VALUES (1, 'b')")
print(c.execute("SELECT COUNT(*), MAX(v) FROM t").fetchone())`, q:'What prints?', opts:["(1, 'b')","(2, 'b')","(1, 'a')"], ans:0, why:'The second insert replaces the row with the same primary key.'},
  cast:{code:e68, task:'Cast it.'},
  bug:{broken:R`import sqlite3
c = sqlite3.connect(":memory:")
c.execute("CREATE TABLE t (id INTEGER PRIMARY KEY, v TEXT)")
for value in ("a", "b"):
    c.execute("INSERT INTO t VALUES (1, ?)", (value,))
print(c.execute("SELECT v FROM t").fetchone()[0])`, task:'The second insert crashes with IntegrityError. Make the load safe to repeat (the later value wins). Expected: b',
    cases:[{inputs:[],tests:[['Works','lines==["b"]'],['Upsert','"OR REPLACE" in src.upper()']]}],
    sol:R`import sqlite3
c = sqlite3.connect(":memory:")
c.execute("CREATE TABLE t (id INTEGER PRIMARY KEY, v TEXT)")
for value in ("a", "b"):
    c.execute("INSERT OR REPLACE INTO t VALUES (1, ?)", (value,))
print(c.execute("SELECT v FROM t").fetchone()[0])`, wrong:[R`print("b")`]},
  write:{prompt:'`clean.json` (a list of contract records with `id, client, item, qty, price, date`) exists. The connection `conn` to the file `contracts.db` is open. Create the table `contracts` if needed (`id` primary key, `client` not null, `qty` must be above 0). Loop on `input("> ")`: `load` reads `clean.json`, **upserts** every record in one transaction and prints `Loaded <n>`; `count` prints `Rows: <n>`; `top N` (N digits) prints the N clients with the highest revenue (`SUM(qty * price)`) as `<client>: <revenue with 2 decimals>`, biggest first, ties by name; `quit` stops; anything else prints `Unknown command`.',
    starter:hdr68,
    inputs:q68,
    cases:[{inputs:q68,files:{'clean.json':clean68},tests:[['Whole session',eqJ(o68,'> ')],['Saved to a file','__import__("sqlite3").connect("contracts.db").execute("SELECT COUNT(*) FROM contracts").fetchone()[0]==4']]},{inputs:['count','quit'],files:{'clean.json':clean68},tests:[['Empty database',eqJ(['Rows: 0'],'> ')]]},{inputs:['load','count','top 1','quit'],files:{'clean.json':clean68b},tests:[['Later record wins',eqJ(['Loaded 2','Rows: 1','Ada: 50.00'],'> ')]]},{inputs:['load','top 0','top','quit'],files:{'clean.json':clean68},tests:[['Edge commands',eqJ(['Loaded 4','Unknown command'],'> ')]]},{inputs:['load','top 3','quit'],files:{'clean.json':JSON.stringify([{id:1,client:'Zed',item:'x',qty:1,price:10,date:'2026-01-01'},{id:2,client:'Amy',item:'x',qty:2,price:5,date:'2026-01-01'}])},tests:[['Ties by name',eqJ(['Loaded 2','Amy: 10.00','Zed: 10.00'],'> ')]]}],
    sol:hdr68 + main68,
    wrong:[(hdr68 + main68).replace('sqlite3.connect("contracts.db")','sqlite3.connect(":memory:")'),(hdr68 + main68).replace('INSERT OR REPLACE INTO','INSERT INTO'),(hdr68 + main68).replace('ORDER BY revenue DESC, client','ORDER BY revenue, client'),(hdr68 + main68).replace('SUM(qty * price)','SUM(price)'),(hdr68 + main68).replace('        with conn:\n            conn.executemany(','        if True:\n            conn.executemany('),(hdr68 + main68).replace('revenue DESC, client LIMIT ?','revenue DESC, client'),(hdr68 + main68).replace(' and parts[1].isdigit()','')],
    hints:['conn.execute("CREATE TABLE IF NOT EXISTS contracts (id INTEGER PRIMARY KEY, client TEXT NOT NULL, item TEXT, qty INTEGER CHECK (qty > 0), price REAL, date TEXT)").','load: records = json.load(f); with conn: conn.executemany("INSERT OR REPLACE INTO contracts (...) VALUES (?, ?, ?, ?, ?, ?)", [...]); print("Loaded", len(records)).','top N: SELECT client, SUM(qty * price) AS revenue ... GROUP BY client ORDER BY revenue DESC, client LIMIT ?. Check parts[1].isdigit().',hdr68 + main68]},
  power:{can:['Load records into a SQLite file idempotently with upserts','Answer business questions with SQL from a persistent database'],
    expand:'Add a `month` command: `GROUP BY substr(date, 1, 7)` for revenue per month.',
    where:'Every ETL job and nightly import ends with an idempotent load into a database.',
    next:'Next: the mission, the whole pipeline end to end.'},
  codex:{title:'Idempotent load',body:'connect("file.db"); CREATE TABLE IF NOT EXISTS; with conn: executemany("INSERT OR REPLACE ..."); PRIMARY KEY makes reloads safe; commit or other connections see nothing; SUM(qty * price) GROUP BY ... ORDER BY ..., name LIMIT ?.',snip:R`with conn:
    conn.executemany("INSERT OR REPLACE INTO contracts VALUES (?, ?, ?, ?, ?, ?)", rows)`}
},
{
  id:'r12-69', realm:12, n:69, title:'Real-World Mission: The Gatewright\'s Pipeline',
  teaches:['mission12j'], requires:['pipe-load'],
  story:`The Workshop doors thunder open. Orrin sets a brass key on the bench. "Everything you have learned: files, validation, SQL, reports. **One script. One run. A report the Guild council can trust.** Build me the Gatewright's Pipeline, and the key is yours."`,
  concept:{
    html:`Time to join every stage into **one script**:\n\n1. **Ingest**: \`csv.DictReader\` + your \`check()\` function (given) -> \`valid\` and \`rejects\`.\n2. **Load**: put the valid records in an in-memory SQLite table.\n3. **Summarise with SQL**: total revenue, best month (\`substr(date, 1, 7)\`; ties -> earliest), top 3 clients (ties -> name).\n4. **Report**: build a list of lines, write them to \`report.txt\`, print the headline.\n5. **Audit trail**: write \`rejects.txt\`.\n6. **Edge cases**: when nothing is valid, say \`No valid contracts\` and skip the maths (no \`None\` formatting errors!).\n\n- Each stage hands a simple structure (list of dicts, rows, list of strings) to the next: that is what makes pipelines easy to debug.\n- Build the report once as data (a list of lines) and then write it: no formatting scattered across the script.\n- Deterministic output (sorted, tie-broken) makes reports **diffable** and testable.\n- Real pipelines add logging, config and a scheduler, which you already know how to build.`,
    analogy:`The whole assembly line, running end to end, with a quality inspector at the start and a ledger at the end.`,
    example:e69},
  predict:{code:R`rows = [("a", 3), ("b", 3), ("c", 1)]
print(sorted(rows, key=lambda r: (-r[1], r[0]))[0])`, q:'What prints?', opts:["('a', 3)","('b', 3)","('c', 1)"], ans:0, why:'Highest number first; the tie between a and b goes to the earlier name.'},
  cast:{code:e69, task:'Cast it.'},
  bug:{broken:R`months = {"2026-02": 10, "2026-01": 10}
best = max(months, key=months.get)
print(best)`, task:'On a tie the first key wins (February). The earliest month should win. Expected: 2026-01',
    cases:[{inputs:[],tests:[['Works','lines==["2026-01"]'],['Explicit tie-break','"months.get" not in src and ("min(" in src or "sorted(" in src)']]}],
    sol:R`months = {"2026-02": 10, "2026-01": 10}
best = min(months, key=lambda m: (-months[m], m))
print(best)`, wrong:[R`print("2026-01")`]},
  write:{prompt:'`contracts.csv` has `id,client,item,qty,price,date` and your `check(row, seen)` from before is supplied. Build the report. Write `report.txt` with: `Contracts: <v> valid, <r> rejected`, then (if any valid) `Revenue: <total, 2 decimals>`, `Best month: <YYYY-MM> (<revenue>)` (ties: earliest month), `Top clients:` and up to three lines `<rank>. <client> - <revenue>` (ties: name A-Z). With no valid contract the second line is `No valid contracts`. Also write `rejects.txt` (`line <n>: <reason>`, header = line 1). Print the first report line, then `Report written to report.txt`. Use SQL for the sums.',
    starter:hdr69 + chk67,
    inputs:[],
    cases:[{inputs:[],files:{'contracts.csv':c69},tests:[['Output',eqJt(['Contracts: 5 valid, 3 rejected','Report written to report.txt'])],['report.txt',rp(rep69)],['rejects.txt','read("rejects.txt").splitlines()==["line 7: bad qty","line 8: bad date","line 9: duplicate id"]']]},{inputs:[],files:{'contracts.csv':c69t},tests:[['Ties',rp(rep69t)]]},{inputs:[],files:{'contracts.csv':c69four},tests:[['Only top three',rp(rep69four)]]},{inputs:[],files:{'contracts.csv':'id,client,item,qty,price,date\n'},tests:[['Nothing valid',rp(rep69e)],['Output',eqJt(['Contracts: 0 valid, 0 rejected','Report written to report.txt'])]]},{inputs:[],files:{'contracts.csv':'id,client,item,qty,price,date\nq,A,x,1,1,2026-01-01\n'},tests:[['Only rejects',rp('Contracts: 0 valid, 1 rejected\nNo valid contracts\n')]]}],
    sol:hdr69 + chk67 + main69,
    wrong:[hdr69 + chk67 + main69.replace('GROUP BY m ORDER BY t DESC, m LIMIT 1','GROUP BY m ORDER BY t DESC, m DESC LIMIT 1'),hdr69 + chk67 + main69.replace('t DESC, client LIMIT 3','t DESC, client LIMIT 5'),hdr69 + chk67 + main69.replace('t DESC, client LIMIT 3','t, client LIMIT 3'),hdr69 + chk67 + main69.replace('SELECT SUM(qty * price) FROM','SELECT SUM(qty + price) FROM'),hdr69 + chk67 + main69.replace('t DESC, client LIMIT 3','t DESC LIMIT 3'),hdr69 + chk67 + main69.replace('if not valid:\n    lines.append("No valid contracts")','if False:\n    pass'),hdr69 + chk67 + main69.replace('with open("rejects.txt", "w") as f:\n    f.write("".join(line + "\\n" for line in rejects))\n',''),hdr69 + chk67 + main69.replace('lines.append(f"Revenue: {revenue:.2f}")','lines.append(f"Revenue: {revenue:.1f}")')],
    hints:['Reuse the ingest loop from the last pipeline lesson with check(); then CREATE TABLE contracts in sqlite3.connect(":memory:") and executemany the valid records.','SQL: SELECT SUM(qty * price) for revenue; SELECT substr(date, 1, 7) AS m, SUM(qty * price) AS t ... GROUP BY m ORDER BY t DESC, m LIMIT 1; clients GROUP BY client ORDER BY t DESC, client LIMIT 3.','Build lines = [...] first, handle the "no valid contracts" case before running the SQL maths, then write report.txt, rejects.txt and print the two output lines.',hdr69 + chk67 + main69]},
  power:{can:['Combine ingest, validation, SQL and reporting into one reliable pipeline','Handle empty and edge-case inputs without crashing'],
    expand:'Turn it into a command-line tool with `argparse` (`--input`, `--report`) and a `--top` option for the number of clients.',
    where:'This is exactly what data engineers, backend developers and analysts ship every day.',
    next:'Next: the Master Gate Boss. Everything you have built is tested at once.'},
  codex:{title:'End-to-end pipeline',body:'ingest (DictReader + check) -> load (sqlite3 :memory: or file) -> summarise with SQL (SUM, GROUP BY, ORDER BY ..., tiebreak, LIMIT) -> report as a list of lines -> write files + print headline. Handle the empty case first. Deterministic ordering everywhere.',snip:R`lines = [f"Contracts: {len(valid)} valid, {len(rejects)} rejected"]
if not valid:
    lines.append("No valid contracts")`}
}
);
