// REALM 12 — THE MASTER GATE — part H (lessons 52-60: SQL with sqlite3)
const eqH = (arr, prefix) => '[l for l in lines if not l.startswith("' + prefix + '")]==' + JSON.stringify(arr);
const eqHt = arr => 'lines[-' + arr.length + ':]==' + JSON.stringify(arr);

// ---------- 52 create / insert / select
const s52 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE heroes (id INTEGER PRIMARY KEY, name TEXT, level INTEGER)")
for item in input("Heroes: ").split():
    name, level = item.split(":")
    conn.execute("INSERT INTO heroes (name, level) VALUES (?, ?)", (name, int(level)))
conn.commit()
count = conn.execute("SELECT COUNT(*) FROM heroes").fetchone()[0]
print("Stored:", count)
for name, level in conn.execute("SELECT name, level FROM heroes ORDER BY level DESC, name"):
    print(name, level)`;
const e52 = R`import sqlite3

conn = sqlite3.connect(":memory:")            # a throwaway database in memory
conn.execute("CREATE TABLE heroes (id INTEGER PRIMARY KEY, name TEXT, level INTEGER)")
conn.execute("INSERT INTO heroes (name, level) VALUES (?, ?)", ("ada", 5))
conn.executemany("INSERT INTO heroes (name, level) VALUES (?, ?)", [("bob", 3), ("cy", 9)])
conn.commit()
print(conn.execute("SELECT COUNT(*) FROM heroes").fetchone())       # a tuple
for row in conn.execute("SELECT id, name FROM heroes ORDER BY level DESC"):
    print(row)
print(conn.execute("SELECT name FROM heroes WHERE id = 99").fetchone())   # None: no row`;

// ---------- 53 where / order / limit
const h53 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE heroes (name TEXT, class TEXT, level INTEGER)")
conn.executemany("INSERT INTO heroes VALUES (?, ?, ?)", [
    ("eve", "mage", 5), ("bob", "rogue", 3), ("cy", "mage", 9),
    ("di", "rogue", 7), ("ada", "mage", 5), ("fay", "bard", 2),
])
cls = input("Class: ").strip()
n = int(input("How many: "))
`;
const g53 = R`rows = conn.execute(
    "SELECT name, level FROM heroes WHERE class = ? ORDER BY level DESC, name LIMIT ?",
    (cls, n),
).fetchall()
if not rows:
    print("None")
for name, level in rows:
    print(f"{name}: {level}")`;
const e53 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE heroes (name TEXT, class TEXT, level INTEGER)")
conn.executemany("INSERT INTO heroes VALUES (?, ?, ?)",
                 [("ada", "mage", 5), ("bob", "rogue", 3), ("cy", "mage", 9)])
q = "SELECT name FROM heroes WHERE class = ? AND level >= ? ORDER BY level DESC LIMIT 1"
print(conn.execute(q, ("mage", 1)).fetchall())          # a list of tuples
print([r[0] for r in conn.execute("SELECT name FROM heroes ORDER BY name")])
print(conn.execute("SELECT name FROM heroes WHERE level > 100").fetchall())    # [] when nothing matches`;

// ---------- 54 parameters / injection
const h54 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE heroes (name TEXT, level INTEGER)")
conn.executemany("INSERT INTO heroes VALUES (?, ?)", [("ada", 5), ("bob", 3), ("o'neil", 4)])
name = input("Name: ")
`;
const g54 = R`row = conn.execute("SELECT name, level FROM heroes WHERE name = ?", (name,)).fetchone()
if row is None:
    print("Not found")
else:
    print(f"{row[0]} is level {row[1]}")`;
const e54 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE users (name TEXT, secret TEXT)")
conn.executemany("INSERT INTO users VALUES (?, ?)", [("ada", "red"), ("bob", "blue")])
evil = "x' OR '1'='1"

unsafe = f"SELECT secret FROM users WHERE name = '{evil}'"      # NEVER do this
print(len(conn.execute(unsafe).fetchall()), "rows leaked")

safe = "SELECT secret FROM users WHERE name = ?"                # placeholder: data stays data
print(len(conn.execute(safe, (evil,)).fetchall()), "rows from the safe query")`;

// ---------- 55 update / delete
const h55 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE heroes (name TEXT, level INTEGER)")
conn.executemany("INSERT INTO heroes VALUES (?, ?)", [("ada", 5), ("bob", 3), ("cy", 9)])
`;
const g55 = R`while True:
    parts = input("> ").split()
    if not parts or parts[0] == "quit":
        break
    if parts[0] == "up" and len(parts) == 2:
        cur = conn.execute("UPDATE heroes SET level = level + 1 WHERE name = ?", (parts[1],))
        print("Updated", cur.rowcount)
    elif parts[0] == "del" and len(parts) == 2:
        cur = conn.execute("DELETE FROM heroes WHERE name = ?", (parts[1],))
        print("Deleted", cur.rowcount)
    elif parts[0] == "show":
        for name, level in conn.execute("SELECT name, level FROM heroes ORDER BY name"):
            print(name, level)
    else:
        print("Unknown command")
conn.commit()`;
const e55 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE heroes (name TEXT, level INTEGER)")
conn.executemany("INSERT INTO heroes VALUES (?, ?)", [("ada", 5), ("bob", 3)])

cur = conn.execute("UPDATE heroes SET level = level + 1 WHERE name = ?", ("ada",))
print(cur.rowcount)                       # rows changed
cur = conn.execute("UPDATE heroes SET level = 0 WHERE name = ?", ("nobody",))
print(cur.rowcount)                       # 0: the WHERE matched nothing
cur = conn.execute("DELETE FROM heroes WHERE level < ?", (4,))
print(cur.rowcount, conn.execute("SELECT COUNT(*) FROM heroes").fetchone()[0])
# DANGER: no WHERE changes EVERY row
conn.execute("UPDATE heroes SET level = 1")
print(conn.execute("SELECT level FROM heroes").fetchall())`;

// ---------- 56 aggregates
const s56 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE orders (region TEXT, amount INTEGER)")
conn.executemany("INSERT INTO orders VALUES (?, ?)", [
    ("north", 100), ("south", 50), ("north", 20), ("east", 50), ("south", 10), ("west", 2), ("west", 2), ("west", 2),
])
minimum = int(input("Min orders: "))
rows = conn.execute(
    "SELECT region, COUNT(*), SUM(amount), AVG(amount) FROM orders "
    "GROUP BY region HAVING COUNT(*) >= ? ORDER BY SUM(amount) DESC, region",
    (minimum,),
).fetchall()
if not rows:
    print("No regions")
for region, n, total, avg in rows:
    print(f"{region}: orders={n} total={total:g} avg={avg:g}")`;
const e56 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE orders (region TEXT, amount INTEGER)")
conn.executemany("INSERT INTO orders VALUES (?, ?)", [("n", 100), ("s", 50), ("n", 20)])
print(conn.execute("SELECT COUNT(*), SUM(amount), AVG(amount), MAX(amount) FROM orders").fetchone())
print(conn.execute("SELECT region, SUM(amount) FROM orders GROUP BY region ORDER BY region").fetchall())
# WHERE filters rows BEFORE grouping; HAVING filters groups AFTER
print(conn.execute("SELECT region FROM orders GROUP BY region HAVING COUNT(*) > 1").fetchall())
print(conn.execute("SELECT SUM(amount) FROM orders WHERE amount > 1000").fetchone())   # (None,)`;

// ---------- 57 joins
const h57 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE heroes (id INTEGER PRIMARY KEY, name TEXT)")
conn.execute("CREATE TABLE quests (hero_id INTEGER, reward INTEGER)")
conn.executemany("INSERT INTO heroes VALUES (?, ?)", [(1, "ada"), (2, "bob"), (3, "cy")])
for item in input("Quests: ").split():
    hero_id, reward = item.split(":")
    conn.execute("INSERT INTO quests VALUES (?, ?)", (int(hero_id), int(reward)))
`;
const g57 = R`rows = conn.execute(
    "SELECT h.name, COUNT(q.reward), COALESCE(SUM(q.reward), 0) AS total "
    "FROM heroes h LEFT JOIN quests q ON q.hero_id = h.id "
    "GROUP BY h.id ORDER BY total DESC, h.name"
).fetchall()
for name, n, total in rows:
    print(f"{name}: quests={n} total={total}")
orphans = conn.execute(
    "SELECT COUNT(*) FROM quests q LEFT JOIN heroes h ON h.id = q.hero_id WHERE h.id IS NULL"
).fetchone()[0]
print("Orphan quests:", orphans)`;
const e57 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE heroes (id INTEGER PRIMARY KEY, name TEXT)")
conn.execute("CREATE TABLE quests (hero_id INTEGER, title TEXT)")
conn.executemany("INSERT INTO heroes VALUES (?, ?)", [(1, "ada"), (2, "bob")])
conn.executemany("INSERT INTO quests VALUES (?, ?)", [(1, "rats"), (1, "bats"), (9, "ghost")])

print(conn.execute("SELECT h.name, q.title FROM heroes h JOIN quests q ON q.hero_id = h.id").fetchall())
print(conn.execute("SELECT h.name, q.title FROM heroes h LEFT JOIN quests q ON q.hero_id = h.id").fetchall())
print(conn.execute("SELECT h.name, COUNT(q.title) FROM heroes h LEFT JOIN quests q ON q.hero_id = h.id GROUP BY h.id").fetchall())`;

// ---------- 58 constraints and indexes
const h58 = R`import sqlite3

conn = sqlite3.connect(":memory:")
`;
const g58 = R`conn.execute("CREATE TABLE heroes (name TEXT NOT NULL UNIQUE, level INTEGER NOT NULL CHECK (level >= 1))")
conn.execute("CREATE INDEX idx_heroes_level ON heroes (level)")
while True:
    parts = input("> ").split()
    if not parts or parts[0] == "quit":
        break
    if parts[0] == "add" and len(parts) == 3:
        try:
            conn.execute("INSERT INTO heroes (name, level) VALUES (?, ?)", (parts[1], int(parts[2])))
            print("Added", parts[1])
        except sqlite3.IntegrityError as err:
            if "UNIQUE" in str(err):
                print("Duplicate", parts[1])
            else:
                print("Invalid level", parts[1])
    elif parts[0] == "show":
        for name, level in conn.execute("SELECT name, level FROM heroes ORDER BY name"):
            print(name, level)
    else:
        print("Unknown command")`;
const e58 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE heroes (name TEXT NOT NULL UNIQUE, level INTEGER CHECK (level >= 1))")
conn.execute("CREATE INDEX idx_level ON heroes (level)")       # makes lookups by level fast
conn.execute("INSERT INTO heroes VALUES ('ada', 5)")
for sql in ["INSERT INTO heroes VALUES ('ada', 7)",              # UNIQUE
            "INSERT INTO heroes VALUES ('bob', 0)",              # CHECK
            "INSERT INTO heroes VALUES (NULL, 3)"]:              # NOT NULL
    try:
        conn.execute(sql)
    except sqlite3.IntegrityError as err:
        print("Rejected:", err)
print(conn.execute("SELECT COUNT(*) FROM heroes").fetchone()[0])`;

// ---------- 59 transactions
const h59 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE purses (name TEXT PRIMARY KEY, gold INTEGER)")
conn.executemany("INSERT INTO purses VALUES (?, ?)", [("ada", 100), ("bob", 20)])
conn.commit()
`;
const g59 = R`while True:
    parts = input("> ").split()
    if not parts or parts[0] == "quit":
        break
    if parts[0] == "pay" and len(parts) == 4:
        src, dst, amount = parts[1], parts[2], int(parts[3])
        try:
            with conn:
                cur = conn.execute("UPDATE purses SET gold = gold - ? WHERE name = ?", (amount, src))
                if cur.rowcount != 1:
                    raise ValueError("no such sender")
                cur = conn.execute("UPDATE purses SET gold = gold + ? WHERE name = ?", (amount, dst))
                if cur.rowcount != 1:
                    raise ValueError("no such recipient")
                balance = conn.execute("SELECT gold FROM purses WHERE name = ?", (src,)).fetchone()[0]
                if balance < 0:
                    raise ValueError("insufficient gold")
            print("Paid")
        except ValueError as err:
            print("Failed:", err)
    elif parts[0] == "show":
        for name, gold in conn.execute("SELECT name, gold FROM purses ORDER BY name"):
            print(name, gold)
    else:
        print("Unknown command")`;
const e59 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE purses (name TEXT PRIMARY KEY, gold INTEGER)")
conn.execute("INSERT INTO purses VALUES ('ada', 100)")
conn.commit()

try:
    with conn:                                   # commit on success, ROLLBACK on any exception
        conn.execute("UPDATE purses SET gold = gold - 40 WHERE name = 'ada'")
        raise RuntimeError("crash halfway!")
except RuntimeError:
    pass
print(conn.execute("SELECT gold FROM purses").fetchone()[0])      # still 100

with conn:
    conn.execute("UPDATE purses SET gold = gold - 40 WHERE name = 'ada'")
print(conn.execute("SELECT gold FROM purses").fetchone()[0])      # 60: committed`;

// ---------- 60 mission
const h60 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, copies INTEGER)")
conn.execute("CREATE TABLE loans (book_id INTEGER, member TEXT, returned INTEGER DEFAULT 0)")
`;
const g60 = R`def available(book_id):
    return conn.execute(
        "SELECT copies - (SELECT COUNT(*) FROM loans WHERE book_id = books.id AND returned = 0) "
        "FROM books WHERE id = ?", (book_id,)).fetchone()[0]

while True:
    parts = input("> ").split()
    if not parts or parts[0] == "quit":
        break
    cmd = parts[0]
    if cmd == "add" and len(parts) == 3:
        cur = conn.execute("INSERT INTO books (title, copies) VALUES (?, ?)", (parts[1], int(parts[2])))
        print(f"Added {parts[1]} (#{cur.lastrowid})")
    elif cmd == "borrow" and len(parts) == 3:
        book = conn.execute("SELECT title FROM books WHERE id = ?", (int(parts[1]),)).fetchone()
        if book is None:
            print("No such book")
        elif available(int(parts[1])) <= 0:
            print("No copies left")
        else:
            conn.execute("INSERT INTO loans (book_id, member) VALUES (?, ?)", (int(parts[1]), parts[2]))
            print("Borrowed", book[0])
    elif cmd == "return" and len(parts) == 3:
        cur = conn.execute(
            "UPDATE loans SET returned = 1 WHERE rowid = (SELECT MIN(rowid) FROM loans "
            "WHERE book_id = ? AND member = ? AND returned = 0)", (int(parts[1]), parts[2]))
        if cur.rowcount == 0:
            print("No such loan")
        else:
            print("Returned", conn.execute("SELECT title FROM books WHERE id = ?", (int(parts[1]),)).fetchone()[0])
    elif cmd == "report":
        for book_id, title, copies in conn.execute("SELECT id, title, copies FROM books ORDER BY title"):
            print(f"{title}: {available(book_id)}/{copies}")
        active = conn.execute("SELECT COUNT(*) FROM loans WHERE returned = 0").fetchone()[0]
        print("Active loans:", active)
    else:
        print("Unknown command")
conn.commit()`;
const e60 = R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, copies INTEGER)")
conn.execute("CREATE TABLE loans (book_id INTEGER, member TEXT, returned INTEGER DEFAULT 0)")
cur = conn.execute("INSERT INTO books (title, copies) VALUES (?, ?)", ("Dune", 2))
book_id = cur.lastrowid                       # the id SQLite just generated
conn.execute("INSERT INTO loans (book_id, member) VALUES (?, ?)", (book_id, "ada"))
out = conn.execute("SELECT COUNT(*) FROM loans WHERE book_id = ? AND returned = 0", (book_id,)).fetchone()[0]
print(book_id, "available:", 2 - out)         # copies minus active loans
conn.execute("UPDATE loans SET returned = 1 WHERE book_id = ? AND member = ?", (book_id, "ada"))
print(conn.execute("SELECT COUNT(*) FROM loans WHERE returned = 0").fetchone()[0])`;

const sess52 = ['ada:5 bob:3 cy:9','b:5 a:5'];
const sess55 = ['up ada','up zed','show','del bob','del bob','show','quit'];
const out55 = ['Updated 1','Updated 0','ada 6','bob 3','cy 9','Deleted 1','Deleted 0','ada 6','cy 9'];
const sess58 = ['add ada 5','add ada 7','add bob 0','add cy 1','add dee 3','show','quit'];
const out58 = ['Added ada','Duplicate ada','Invalid level bob','Added cy','Added dee','ada 5','cy 1','dee 3'];
const sess59 = ['pay ada bob 30','pay bob ada 500','pay ada zed 10','pay zed ada 5','show','quit'];
const out59 = ['Paid','Failed: insufficient gold','Failed: no such recipient','Failed: no such sender','ada 70','bob 50'];
const sess60 = ['add Dune 2','add Arc 1','borrow 1 ada','borrow 1 bob','borrow 1 cy','borrow 9 ada','return 1 cy','return 1 ada','return 1 ada','borrow 1 cy','report','fly','quit'];
const out60 = ['Added Dune (#1)','Added Arc (#2)','Borrowed Dune','Borrowed Dune','No copies left','No such book','No such loan','Returned Dune','No such loan','Borrowed Dune','Arc: 1/1','Dune: 0/2','Active loans: 2','Unknown command'];

LESSONS.push(
{
  id:'r12-52', realm:12, n:52, title:'SQL basics with sqlite3',
  teaches:['sql-basic'], requires:['mission12g'],
  story:`Deep beneath the Ledger Hall lies the **Vault of Tables**, where the Guild keeps its records. "Spreadsheets are for one person," Orrin says. "Real systems keep their data in a **database**, and speak to it in **SQL**. Python already carries one: **sqlite3**, no install needed."`,
  concept:{
    html:`**SQL** is the language for asking databases questions. Python's built-in \`sqlite3\` module gives you a small, real database.\n\n\`\`\`\nimport sqlite3\nconn = sqlite3.connect(":memory:")      # or a filename like "guild.db" to keep it on disk\nconn.execute("CREATE TABLE heroes (id INTEGER PRIMARY KEY, name TEXT, level INTEGER)")\nconn.execute("INSERT INTO heroes (name, level) VALUES (?, ?)", ("ada", 5))\nconn.commit()                           # save the changes\nfor row in conn.execute("SELECT name, level FROM heroes ORDER BY level DESC"):\n    print(row)                          # each row is a tuple\n\`\`\`\n\n- A **table** has typed **columns**; each **row** is one record. \`INTEGER PRIMARY KEY\` gives each row a unique id automatically.\n- \`?\` are **placeholders**: the values go in a separate tuple (next lessons explain why this matters).\n- \`fetchone()\` returns one row or \`None\`; \`fetchall()\` returns a list.\n- \`executemany(sql, list_of_tuples)\` inserts lots of rows.\n- \`SELECT COUNT(*)\` counts rows. \`ORDER BY a DESC, b\` sorts with a tie-break.\n- Without \`commit()\`, changes may be lost when the connection closes.\n\nℹ️ In the browser, sqlite3 is downloaded the first time you import it.`,
    analogy:`A set of very strict spreadsheets that you query with sentences instead of clicking.`,
    example:e52},
  predict:{code:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (x INTEGER)")
conn.executemany("INSERT INTO t VALUES (?)", [(3,), (1,), (2,)])
print(conn.execute("SELECT x FROM t ORDER BY x DESC").fetchone())`, q:'What prints?', opts:['(3,)','3','(1,)'], ans:0, why:'Sorted descending the first row is 3, and rows are tuples, so (3,).'},
  cast:{code:e52, task:'Cast it.'},
  bug:{broken:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (x INTEGER)")
conn.execute("INSERT INTO t VALUES (?, ?)", (5,))
print(conn.execute("SELECT x FROM t").fetchone()[0])`, task:'Two placeholders but one value: ProgrammingError. Match them up. Expected: 5',
    cases:[{inputs:[],tests:[['Works','lines==["5"]'],['One placeholder','"VALUES (?)" in src']]}],
    sol:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (x INTEGER)")
conn.execute("INSERT INTO t VALUES (?)", (5,))
print(conn.execute("SELECT x FROM t").fetchone()[0])`, wrong:[R`print(5)`]},
  write:{prompt:'Ask `Heroes: ` (space-separated `name:level`). Create an in-memory table `heroes` (`id`, `name`, `level`), insert every hero with `?` placeholders, then print `Stored: <count>` (use `SELECT COUNT(*)`) and one `<name> <level>` line per hero, highest level first, ties by name.',
    starter:R`import sqlite3

conn = sqlite3.connect(":memory:")
`,
    inputs:['ada:5 bob:3 cy:9'],
    cases:[{inputs:['ada:5 bob:3 cy:9'],tests:[['Stored and sorted',eqHt(['Stored: 3','cy 9','ada 5','bob 3'])],['Uses SQL','"INSERT" in src.upper() and "SELECT" in src.upper()'],['Placeholders','"?" in src']]},{inputs:['b:5 a:5'],tests:[['Tie by name',eqHt(['Stored: 2','a 5','b 5'])]]},{inputs:[''],tests:[['Empty','lines[-1]=="Stored: 0"']]},{inputs:['x:1'],tests:[['One hero',eqHt(['Stored: 1','x 1'])]]}],
    sol:s52,
    wrong:[s52.replace('level DESC, name','level, name'),s52.replace('level DESC, name','level DESC'),s52.replace('COUNT(*)','SUM(level)'),s52.replace('ORDER BY level DESC, name','ORDER BY name')],
    hints:['CREATE TABLE heroes (id INTEGER PRIMARY KEY, name TEXT, level INTEGER), then loop and conn.execute("INSERT ... VALUES (?, ?)", (name, int(level))).','conn.execute("SELECT COUNT(*) FROM heroes").fetchone()[0] is the count.','SELECT name, level FROM heroes ORDER BY level DESC, name; loop over the cursor and print.',s52]},
  power:{can:['Create a SQLite database, table and rows from Python','Read data back with SELECT, ORDER BY and fetchone/fetchall'],
    expand:'Pass a filename like `"guild.db"` to `connect` so the data survives after the program ends.',
    where:'Phone apps, websites and desktop programs all keep their data in SQL databases like this.',
    next:'Next: filtering with WHERE and LIMIT.'},
  codex:{title:'sqlite3',body:'conn = sqlite3.connect(":memory:" or "file.db"); conn.execute(sql, params); ? placeholders with a tuple; conn.commit(); fetchone() -> row or None; fetchall() -> list; executemany; SELECT COUNT(*); ORDER BY col DESC, tiebreak.',snip:R`conn.execute("INSERT INTO heroes (name, level) VALUES (?, ?)", ("ada", 5))
conn.commit()`}
},
{
  id:'r12-53', realm:12, n:53, title:'WHERE, ORDER BY and LIMIT',
  teaches:['sql-where'], requires:['sql-basic'],
  story:`"A vault with a million records is useless if you can only read it front to back," says Orrin. "Ask precise questions: *only mages*, *the best three*, *nothing under level five*. The database does the filtering, far faster than your loops."`,
  concept:{
    html:`Let the **database** filter and sort, not Python loops.\n\n\`\`\`\nSELECT name, level FROM heroes\nWHERE class = ? AND level >= 5      -- conditions: = != < <= > >= AND OR NOT, IN (...), LIKE 'a%'\nORDER BY level DESC, name           -- sort, with a tie-break\nLIMIT 3                             -- only the first 3 rows\n\`\`\`\n\n- Clause order is fixed: \`SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT\`.\n- \`WHERE\` keeps only matching rows. Compare text with \`=\` (single \`=\`, not \`==\`).\n- \`LIMIT ?\` works with a placeholder too. \`LIMIT 0\` returns nothing.\n- \`ORDER BY\` without \`DESC\` is ascending. Add a second column to break ties so output is predictable.\n- \`fetchall()\` returns \`[]\` when nothing matches: test with \`if not rows:\`.\n- Always put **user input** in placeholders, never into the SQL text.`,
    analogy:`A librarian who fetches only the books you describe, in the order you ask, and stops at the number you give.`,
    example:e53},
  predict:{code:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (x INTEGER)")
conn.executemany("INSERT INTO t VALUES (?)", [(5,), (2,), (9,)])
print(conn.execute("SELECT x FROM t WHERE x > 3 ORDER BY x LIMIT 1").fetchall())`, q:'What prints?', opts:['[(5,)]','[(9,)]','[(5,), (9,)]'], ans:0, why:'Rows above 3 are 5 and 9; sorted ascending then limited to one: 5.'},
  cast:{code:e53, task:'Cast it.'},
  bug:{broken:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (x INTEGER)")
conn.executemany("INSERT INTO t VALUES (?)", [(5,), (2,), (9,)])
print(conn.execute("SELECT x FROM t LIMIT 2 ORDER BY x DESC").fetchall())`, task:'Clause order is wrong (syntax error). ORDER BY comes before LIMIT. Expected: [(9,), (5,)]',
    cases:[{inputs:[],tests:[['Works','lines==["[(9,), (5,)]"]'],['Order then limit','src.upper().index("ORDER BY") < src.upper().index("LIMIT")']]}],
    sol:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (x INTEGER)")
conn.executemany("INSERT INTO t VALUES (?)", [(5,), (2,), (9,)])
print(conn.execute("SELECT x FROM t ORDER BY x DESC LIMIT 2").fetchall())`, wrong:[R`print("[(9,), (5,)]")`]},
  write:{prompt:'The `heroes` table is created for you. Read `Class:` and `How many:`. Print the top N heroes of that class as `<name>: <level>`, highest level first, ties by name. If there are none, print `None`. Let SQL do the filtering, sorting and limiting.',
    starter:h53,
    inputs:['mage','2'],
    cases:[{inputs:['mage','2'],tests:[['Top two mages',eqHt(['cy: 9','ada: 5'])],['LIMIT in SQL','"LIMIT" in src.upper()']]},{inputs:['mage','3'],tests:[['Tie by name',eqHt(['cy: 9','ada: 5','eve: 5'])]]},{inputs:['rogue','5'],tests:[['Fewer than N',eqHt(['di: 7','bob: 3'])]]},{inputs:['knight','3'],tests:[['No such class','lines[-1]=="None"']]},{inputs:['bard','0'],tests:[['Zero asked','lines[-1]=="None"']]},{inputs:['mage','1'],tests:[['Just one',eqHt(['cy: 9'])]]}],
    sol:h53 + g53,
    wrong:[h53 + g53.replace('level DESC, name LIMIT ?','level DESC, name'),h53 + g53.replace('ORDER BY level DESC, name','ORDER BY level, name'),h53 + g53.replace('level DESC, name LIMIT','level DESC LIMIT'),h53 + g53.replace('WHERE class = ?','WHERE class != ?'),h53 + g53.replace('print(f"{name}: {level}")','print(f"{name}: {level}")\nbreak')],
    hints:['SELECT name, level FROM heroes WHERE class = ? ... with (cls, n) as the parameters.','Add ORDER BY level DESC, name, then LIMIT ?.','fetchall(); if the list is empty print "None", else print f"{name}: {level}" for each.',h53 + g53]},
  power:{can:['Filter, sort and limit rows inside the database','Break sorting ties for predictable output'],
    expand:'Add `AND level >= ?` with a minimum-level input; try `LIKE ?` with `"a%"` for names starting with a.',
    where:'"Top 10 products", "latest 5 orders": nearly every screen of every app is a query like this.',
    next:'Next: why placeholders protect you from SQL injection.'},
  codex:{title:'WHERE / ORDER BY / LIMIT',body:'SELECT cols FROM t WHERE cond ORDER BY col DESC, tiebreak LIMIT ?. Order of clauses is fixed. = (single), AND/OR/NOT, IN, LIKE. fetchall() -> [] when empty.',snip:R`SELECT name FROM heroes WHERE class = ? ORDER BY level DESC LIMIT ?`}
},
{
  id:'r12-54', realm:12, n:54, title:'Placeholders and SQL injection',
  teaches:['sql-params'], requires:['sql-where'],
  story:`A thief strolls up to the Vault gate and says his name is *x' OR '1'='1*. The careless clerk pastes it into a query... and the vault swings open to **everyone's** secrets. Orrin slams a book shut. "Never. Paste. User text. Into. SQL."`,
  concept:{
    html:`**SQL injection** is one of the most common and costly security holes. It happens when user text is glued into a query.\n\n\`\`\`\n# DANGEROUS: the text becomes part of the SQL\nconn.execute(f"SELECT secret FROM users WHERE name = '{evil}'")\n# With evil = x' OR '1'='1  the query becomes ... WHERE name = 'x' OR '1'='1'   -> matches EVERY row\n\n# SAFE: placeholder, the driver treats it purely as data\nconn.execute("SELECT secret FROM users WHERE name = ?", (evil,))\n\`\`\`\n\n- Use \`?\` for **values**; pass them as a **tuple** (note the comma in a 1-tuple: \`(name,)\`).\n- Placeholders also fix quote problems: a name like \`o'neil\` breaks string-built SQL but works fine with \`?\`.\n- Placeholders are for **values**, not for table or column names. If you must choose a column, check it against an allow-list in Python first.\n- This rule applies to *every* database library and every language.\n- Never "clean" input by hand-escaping quotes: use placeholders.`,
    analogy:`Handing the clerk a sealed envelope with the name inside instead of dictating a sentence he might obey.`,
    example:e54},
  predict:{code:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE u (n TEXT)")
conn.executemany("INSERT INTO u VALUES (?)", [("a",), ("b",)])
bad = "zzz' OR '1'='1"
print(len(conn.execute(f"SELECT n FROM u WHERE n = '{bad}'").fetchall()))`, q:'How many rows come back?', opts:['2','0','1'], ans:0, why:'The injected OR clause makes every row match.'},
  cast:{code:e54, task:'Cast it.'},
  bug:{broken:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE u (n TEXT)")
conn.execute("INSERT INTO u VALUES ('ada')")
name = "x' OR '1'='1"
rows = conn.execute(f"SELECT n FROM u WHERE n = '{name}'").fetchall()
print(len(rows))`, task:'Injectable! Use a placeholder so the hostile text matches nothing. Expected: 0',
    cases:[{inputs:[],tests:[['Safe','lines==["0"]'],['Placeholder','"?" in src and "{name}" not in src']]}],
    sol:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE u (n TEXT)")
conn.execute("INSERT INTO u VALUES ('ada')")
name = "x' OR '1'='1"
rows = conn.execute("SELECT n FROM u WHERE n = ?", (name,)).fetchall()
print(len(rows))`, wrong:[R`print(0)`]},
  write:{prompt:'The `heroes` table is created for you (it even holds a hero named `o\'neil`). Read `Name:` and look the hero up **safely**. Print `<name> is level <level>`, or `Not found`.',
    starter:h54,
    inputs:['ada'],
    cases:[{inputs:['ada'],tests:[['Found','lines[-1]=="ada is level 5"'],['Placeholder','"?" in src']]},{inputs:["x' OR '1'='1"],tests:[['Injection fails','lines[-1]=="Not found"']]},{inputs:["o'neil"],tests:[['Apostrophe works','lines[-1]=="o\'neil is level 4"']]},{inputs:['zed'],tests:[['Missing','lines[-1]=="Not found"']]},{inputs:["' OR 1=1 --"],tests:[['Comment trick fails','lines[-1]=="Not found"']]},{inputs:['bob'],tests:[['Another hero','lines[-1]=="bob is level 3"']]},{inputs:['a%'],tests:[['No wildcard','lines[-1]=="Not found"']]},{inputs:['ADA'],tests:[['Exact case','lines[-1]=="Not found"']]}],
    sol:h54 + g54,
    wrong:[h54 + R`row = conn.execute(f"SELECT name, level FROM heroes WHERE name = '{name}'").fetchone()
if row is None:
    print("Not found")
else:
    print(f"{row[0]} is level {row[1]}")`,h54 + g54.replace('(name,)','(name.lower(),)').replace('WHERE name = ?','WHERE name LIKE ?'),h54 + g54.replace('is level {row[1]}','is level {row[1] + 1}'),h54 + g54.replace('fetchone()','fetchall()')],
    hints:['Write the SQL with a ? where the name goes.','Pass the value as a tuple: conn.execute(sql, (name,)).','fetchone() returns None when nothing matches; print "Not found" then.',h54 + g54]},
  power:{can:['Spot and prevent SQL injection','Query safely with user-supplied values'],
    expand:'For a sort-by option, check the requested column against `{"name", "level"}` before putting it in the SQL.',
    where:'Login forms and search boxes are attacked with these tricks every day. Placeholders stop them.',
    next:'Next: changing and deleting data.'},
  codex:{title:'Placeholders',body:'Never build SQL with f-strings from user input. Use ? and a tuple: execute(sql, (value,)). Placeholders are for values only; allow-list column/table names. Injection: x\' OR \'1\'=\'1.',snip:R`conn.execute("SELECT * FROM users WHERE name = ?", (name,))`}
},
{
  id:'r12-55', realm:12, n:55, title:'UPDATE and DELETE: changing data safely',
  teaches:['sql-update'], requires:['sql-params'],
  story:`"Reading is harmless," says Orrin. "**Writing** is where careers end. A forgotten WHERE and every hero in the realm drops to level one. Learn to change data on purpose, and to *check what you changed*."`,
  concept:{
    html:`\`\`\`\nUPDATE heroes SET level = level + 1 WHERE name = ?\nDELETE FROM heroes WHERE name = ?\n\`\`\`\n\n- **No WHERE = every row.** \`UPDATE heroes SET level = 1\` rewrites the whole table. Always write the WHERE first.\n- \`execute\` returns a **cursor**; \`cur.rowcount\` tells you how many rows changed. \`0\` means "that name doesn't exist": report it instead of pretending success.\n- \`SET level = level + 1\` computes from the current value inside the database (safer than read-modify-write in Python).\n- Changes are pending until \`conn.commit()\`.\n- Test your WHERE with a \`SELECT\` first, then switch to \`UPDATE\`/\`DELETE\`.\n- Real systems often **soft delete** (a \`deleted\` flag) so mistakes can be undone.`,
    analogy:`A rubber stamp: powerful, permanent, and only as safe as where you aim it.`,
    example:e55},
  predict:{code:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (n TEXT, v INTEGER)")
conn.executemany("INSERT INTO t VALUES (?, ?)", [("a", 1), ("b", 2)])
cur = conn.execute("UPDATE t SET v = v * 10 WHERE n = 'a'")
print(cur.rowcount, conn.execute("SELECT v FROM t ORDER BY n").fetchall())`, q:'What prints?', opts:['1 [(10,), (2,)]','2 [(10,), (20,)]','1 [(10,), (20,)]'], ans:0, why:'Only row a matches; rowcount is 1 and b is untouched.'},
  cast:{code:e55, task:'Cast it.'},
  bug:{broken:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (n TEXT, v INTEGER)")
conn.executemany("INSERT INTO t VALUES (?, ?)", [("a", 1), ("b", 2)])
conn.execute("DELETE FROM t")
print(conn.execute("SELECT COUNT(*) FROM t").fetchone()[0])`, task:'We only meant to delete row a! Add the WHERE. Expected: 1',
    cases:[{inputs:[],tests:[['Works','lines==["1"]'],['Has WHERE','"WHERE" in src.upper()']]}],
    sol:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (n TEXT, v INTEGER)")
conn.executemany("INSERT INTO t VALUES (?, ?)", [("a", 1), ("b", 2)])
conn.execute("DELETE FROM t WHERE n = 'a'")
print(conn.execute("SELECT COUNT(*) FROM t").fetchone()[0])`, wrong:[R`print(1)`]},
  write:{prompt:'A `heroes` table (ada 5, bob 3, cy 9) is created. Loop with `input("> ")` handling: `up NAME` (level +1, print `Updated <rowcount>`), `del NAME` (print `Deleted <rowcount>`), `show` (print `name level` sorted by name), `quit` to stop. Anything else prints `Unknown command`.',
    starter:h55,
    inputs:sess55,
    cases:[{inputs:sess55,tests:[['Whole session',eqH(out55,'> ')],['Placeholders','"?" in src']]},{inputs:['up bob','up bob','show','quit'],tests:[['Repeated updates',eqH(['Updated 1','Updated 1','ada 5','bob 5','cy 9'],'> ')]]},{inputs:['del ada','del cy','show','quit'],tests:[['Deletes',eqH(['Deleted 1','Deleted 1','bob 3'],'> ')]]},{inputs:['dance','up','quit'],tests:[['Unknown',eqH(['Unknown command','Unknown command'],'> ')]]}],
    sol:h55 + g55,
    wrong:[h55 + g55.replace('SET level = level + 1 WHERE name = ?','SET level = level + 1').replace('(parts[1],))\n        print("Updated"','()  )\n        print("Updated"'),h55 + g55.replace('DELETE FROM heroes WHERE name = ?','DELETE FROM heroes WHERE name != ?'),h55 + g55.replace('print("Updated", cur.rowcount)','print("Updated", 1)'),h55 + g55.replace('print("Deleted", cur.rowcount)','print("Deleted", 1)'),h55 + g55.replace('level = level + 1','level = 1')],
    hints:['cur = conn.execute("UPDATE heroes SET level = level + 1 WHERE name = ?", (name,)); print cur.rowcount.','DELETE FROM heroes WHERE name = ? works the same way.','show: SELECT name, level FROM heroes ORDER BY name. Loop until "quit".',h55 + g55]},
  power:{can:['Update and delete rows safely with WHERE','Use rowcount to report what really changed'],
    expand:'Add `rename OLD NEW` using `UPDATE heroes SET name = ? WHERE name = ?`.',
    where:'"Edit profile", "cancel order", "mark as read": every button that changes something runs UPDATE or DELETE.',
    next:'Next: GROUP BY and aggregates.'},
  codex:{title:'UPDATE / DELETE',body:'UPDATE t SET col = expr WHERE cond; DELETE FROM t WHERE cond. No WHERE = all rows! cur.rowcount = rows changed (0 = no match). commit() to save. Test the WHERE with SELECT first.',snip:R`cur = conn.execute("DELETE FROM heroes WHERE name = ?", (name,))
print(cur.rowcount)`}
},
{
  id:'r12-56', realm:12, n:56, title:'Aggregates, GROUP BY and HAVING',
  teaches:['sql-agg'], requires:['sql-update'],
  story:`"Which region earns the most? Which one has hardly any orders?" Orrin points at the Vault's thousand scrolls. "Don't loop over them in Python. **Ask the database to add them up.** It has been waiting for this."`,
  concept:{
    html:`**Aggregate functions** collapse many rows into one value: \`COUNT(*)\`, \`SUM(x)\`, \`AVG(x)\`, \`MIN(x)\`, \`MAX(x)\`.\n\n\`\`\`\nSELECT region, COUNT(*), SUM(amount), AVG(amount)\nFROM orders\nGROUP BY region                  -- one result row per region\nHAVING COUNT(*) >= 2             -- keep only groups that pass\nORDER BY SUM(amount) DESC, region\n\`\`\`\n\n- Same idea as pandas \`groupby\`, but done inside the database.\n- **WHERE** filters *rows* before grouping; **HAVING** filters *groups* after. Use HAVING for conditions on aggregates.\n- Every non-aggregated column in SELECT must be in GROUP BY.\n- On an empty set, \`COUNT\` gives 0 but \`SUM\`/\`AVG\` give \`None\`: handle it (\`COALESCE(SUM(x), 0)\`).\n- \`SUM\` of integers is an int; \`AVG\` is a float.`,
    analogy:`A tally clerk who makes a pile per region, counts each pile, and discards small piles on request.`,
    example:e56},
  predict:{code:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (g TEXT, v INTEGER)")
conn.executemany("INSERT INTO t VALUES (?, ?)", [("a", 1), ("a", 2), ("b", 5)])
print(conn.execute("SELECT g, SUM(v) FROM t GROUP BY g HAVING SUM(v) > 3 ORDER BY g").fetchall())`, q:'What prints?', opts:["[('b', 5)]","[('a', 3), ('b', 5)]","[('a', 3)]"], ans:0, why:'Group a sums to 3, which fails HAVING > 3.'},
  cast:{code:e56, task:'Cast it.'},
  bug:{broken:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (g TEXT, v INTEGER)")
conn.executemany("INSERT INTO t VALUES (?, ?)", [("a", 1), ("a", 2), ("b", 5)])
print(conn.execute("SELECT g FROM t WHERE COUNT(*) > 1 GROUP BY g").fetchall())`, task:'Aggregates cannot go in WHERE (error). Use HAVING. Expected: [(\'a\',)]',
    cases:[{inputs:[],tests:[['Works','lines==["[(\'a\',)]"]'],['HAVING','"HAVING" in src.upper()']]}],
    sol:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (g TEXT, v INTEGER)")
conn.executemany("INSERT INTO t VALUES (?, ?)", [("a", 1), ("a", 2), ("b", 5)])
print(conn.execute("SELECT g FROM t GROUP BY g HAVING COUNT(*) > 1").fetchall())`, wrong:[R`print("[('a',)]")`]},
  write:{prompt:'An `orders` table (region, amount) is created. Read `Min orders: `. Print, for every region with **at least** that many orders, `<region>: orders=<n> total=<sum> avg=<mean>` (biggest total first; numbers shown with `:g`). If no region qualifies print `No regions`. Do the grouping in SQL.',
    starter:R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE orders (region TEXT, amount INTEGER)")
conn.executemany("INSERT INTO orders VALUES (?, ?)", [
    ("north", 100), ("south", 50), ("north", 20), ("east", 50), ("south", 10), ("west", 2), ("west", 2), ("west", 2),
])
minimum = int(input("Min orders: "))
`,
    inputs:['1'],
    cases:[{inputs:['1'],tests:[['All regions',eqHt(['north: orders=2 total=120 avg=60','south: orders=2 total=60 avg=30','east: orders=1 total=50 avg=50','west: orders=3 total=6 avg=2'])],['GROUP BY','"GROUP BY" in src.upper()']]},{inputs:['2'],tests:[['Two or more',eqHt(['north: orders=2 total=120 avg=60','south: orders=2 total=60 avg=30','west: orders=3 total=6 avg=2'])]]},{inputs:['3'],tests:[['Only west',eqHt(['west: orders=3 total=6 avg=2'])]]},{inputs:['4'],tests:[['None qualify','lines[-1]=="No regions"']]},{inputs:['0'],tests:[['Zero minimum','len(lines)>=5 and lines[-1]=="west: orders=3 total=6 avg=2"']]},{inputs:['2'],tests:[['HAVING used','"HAVING" in src.upper()']]}],
    sol:s56,
    wrong:[s56.replace('COUNT(*) >= ?','COUNT(*) > ?'),s56.replace('SUM(amount) DESC','SUM(amount)'),s56.replace('AVG(amount) FROM','MAX(amount) FROM'),s56.replace('SUM(amount) DESC, region','COUNT(*) DESC, region')],
    hints:['SELECT region, COUNT(*), SUM(amount), AVG(amount) FROM orders GROUP BY region.','Add HAVING COUNT(*) >= ? with (minimum,) as the parameter.','ORDER BY SUM(amount) DESC, region; if fetchall() is empty print "No regions".',s56]},
  power:{can:['Summarise data with COUNT, SUM and AVG','Group rows and filter groups with HAVING'],
    expand:'Add `MAX(amount)` to show each region\'s biggest order.',
    where:'Dashboards, reports and analytics are GROUP BY queries underneath.',
    next:'Next: JOINs, combining tables.'},
  codex:{title:'Aggregates',body:'COUNT(*) SUM AVG MIN MAX; GROUP BY col; WHERE filters rows, HAVING filters groups; COALESCE(SUM(x), 0) for empty sets; non-aggregated columns must be in GROUP BY.',snip:R`SELECT region, SUM(amount) FROM orders GROUP BY region HAVING COUNT(*) >= 2`}
},
{
  id:'r12-57', realm:12, n:57, title:'JOINs: combining tables',
  teaches:['sql-join'], requires:['sql-agg'],
  story:`"Heroes are in one scroll, quests in another," Orrin says, "tied together by an **id**. This is the heart of databases: store each fact once, and *join* them when you need the whole picture. But beware the hero with no quests, and the quest with no hero."`,
  concept:{
    html:`Relational databases split data into tables linked by **ids** (a **foreign key**). A \`JOIN\` reunites them.\n\n\`\`\`\nSELECT h.name, q.title\nFROM heroes h\nJOIN quests q ON q.hero_id = h.id          -- INNER JOIN: only heroes that HAVE quests\n\nSELECT h.name, COUNT(q.title)\nFROM heroes h\nLEFT JOIN quests q ON q.hero_id = h.id     -- LEFT JOIN: ALL heroes, NULL where no quest\nGROUP BY h.id\n\`\`\`\n\n- \`heroes h\` gives the table a short **alias**; \`h.id\` says which table a column belongs to.\n- **INNER JOIN** drops unmatched rows. **LEFT JOIN** keeps every left row; missing partners are \`NULL\` (\`None\` in Python).\n- \`COUNT(q.title)\` counts non-NULL values, so heroes with no quests get 0. (\`COUNT(*)\` would give 1: the lone NULL row.)\n- \`COALESCE(SUM(q.reward), 0)\` turns a NULL sum into 0.\n- **Orphans** (quests whose hero doesn't exist): \`LEFT JOIN ... WHERE h.id IS NULL\`. Use \`IS NULL\`, never \`= NULL\`.\n- Same idea as pandas \`merge\`.`,
    analogy:`Matching claim tickets to coats; some tickets have no coat, some coats have no ticket.`,
    example:e57},
  predict:{code:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE a (id INTEGER)")
conn.execute("CREATE TABLE b (aid INTEGER)")
conn.executemany("INSERT INTO a VALUES (?)", [(1,), (2,)])
conn.execute("INSERT INTO b VALUES (1)")
print(conn.execute("SELECT a.id, b.aid FROM a LEFT JOIN b ON b.aid = a.id ORDER BY a.id").fetchall())`, q:'What prints?', opts:['[(1, 1), (2, None)]','[(1, 1)]','[(1, 1), (2, 2)]'], ans:0, why:'LEFT JOIN keeps a=2 and fills the missing partner with None.'},
  cast:{code:e57, task:'Cast it.'},
  bug:{broken:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE a (id INTEGER)")
conn.execute("CREATE TABLE b (aid INTEGER)")
conn.executemany("INSERT INTO a VALUES (?)", [(1,), (2,)])
conn.execute("INSERT INTO b VALUES (1)")
print(conn.execute("SELECT a.id FROM a JOIN b ON b.aid = a.id").fetchall())`, task:'We want EVERY row of a, even without a match. Use a LEFT JOIN. Expected: [(1,), (2,)]',
    cases:[{inputs:[],tests:[['Works','lines==["[(1,), (2,)]"]'],['LEFT JOIN','"LEFT JOIN" in src.upper()']]}],
    sol:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE a (id INTEGER)")
conn.execute("CREATE TABLE b (aid INTEGER)")
conn.executemany("INSERT INTO a VALUES (?)", [(1,), (2,)])
conn.execute("INSERT INTO b VALUES (1)")
print(conn.execute("SELECT a.id FROM a LEFT JOIN b ON b.aid = a.id ORDER BY a.id").fetchall())`, wrong:[R`print("[(1,), (2,)]")`]},
  write:{prompt:'Tables `heroes` (ada=1, bob=2, cy=3) and `quests` (hero_id, reward) exist; quests are read from `Quests: ` as `hero_id:reward`. Print `<name>: quests=<count> total=<sum>` for **every** hero (biggest total first, ties by name; 0 when none). Then print `Orphan quests: <n>` for quests whose hero_id matches no hero.',
    starter:h57,
    inputs:['1:10 1:15 2:100 9:7'],
    cases:[{inputs:['1:10 1:15 2:100 9:7'],tests:[['Report',eqHt(['bob: quests=1 total=100','ada: quests=2 total=25','cy: quests=0 total=0','Orphan quests: 1'])],['LEFT JOIN','"LEFT JOIN" in src.upper()']]},{inputs:[''],tests:[['No quests',eqHt(['ada: quests=0 total=0','bob: quests=0 total=0','cy: quests=0 total=0','Orphan quests: 0'])]]},{inputs:['3:5 3:5 2:10'],tests:[['Ties by name',eqHt(['bob: quests=1 total=10','cy: quests=2 total=10','ada: quests=0 total=0','Orphan quests: 0'])]]},{inputs:['8:1 9:2'],tests:[['Only orphans',eqHt(['ada: quests=0 total=0','bob: quests=0 total=0','cy: quests=0 total=0','Orphan quests: 2'])]]}],
    sol:h57 + g57,
    wrong:[h57 + g57.replace('LEFT JOIN quests q ON q.hero_id = h.id "','JOIN quests q ON q.hero_id = h.id "'),h57 + g57.replace('COALESCE(SUM(q.reward), 0)','SUM(q.reward)'),h57 + g57.replace('COUNT(q.reward)','COUNT(*)'),h57 + g57.replace('ORDER BY total DESC, h.name','ORDER BY total, h.name'),h57 + g57.replace('WHERE h.id IS NULL','')],
    hints:['FROM heroes h LEFT JOIN quests q ON q.hero_id = h.id keeps heroes with no quests.','COUNT(q.reward) counts only real quests; COALESCE(SUM(q.reward), 0) avoids None. GROUP BY h.id.','Orphans: FROM quests q LEFT JOIN heroes h ON h.id = q.hero_id WHERE h.id IS NULL, then COUNT(*).',h57 + g57]},
  power:{can:['Combine related tables with INNER and LEFT JOIN','Find missing partners and orphan records'],
    expand:'Add a `quests` title column and list each hero\'s quest titles with `GROUP_CONCAT(q.title)`.',
    where:'Orders and customers, posts and authors, students and classes: all relational data is joined.',
    next:'Next: constraints and indexes keep data clean and fast.'},
  codex:{title:'JOIN',body:'JOIN ... ON a.id = b.a_id (inner, unmatched dropped); LEFT JOIN keeps all left rows with NULL partners; COUNT(col) skips NULL, COUNT(*) does not; COALESCE(x, 0); orphans: LEFT JOIN ... WHERE right.id IS NULL.',snip:R`FROM heroes h LEFT JOIN quests q ON q.hero_id = h.id`}
},
{
  id:'r12-58', realm:12, n:58, title:'Constraints and indexes',
  teaches:['sql-constraints'], requires:['sql-join'],
  story:`"A good vault refuses bad data at the door," Orrin says, rapping a brass sign: *NO DUPLICATES. NO BLANKS. NO NEGATIVE LEVELS.* "Let the **database** be your last line of defence. And when the vault grows huge, add an **index**: a table of contents."`,
  concept:{
    html:`**Constraints** make the database reject bad data, whatever the program does.\n\n\`\`\`\nCREATE TABLE heroes (\n    name  TEXT    NOT NULL UNIQUE,                   -- must exist, and no duplicates\n    level INTEGER NOT NULL CHECK (level >= 1)        -- must satisfy a rule\n)\nCREATE INDEX idx_heroes_level ON heroes (level)      -- speeds up searching/sorting by level\n\`\`\`\n\nA violating insert raises \`sqlite3.IntegrityError\`:\n\n\`\`\`\ntry:\n    conn.execute("INSERT INTO heroes VALUES (?, ?)", ("ada", 7))\nexcept sqlite3.IntegrityError as err:\n    print(err)       # UNIQUE constraint failed: heroes.name\n\`\`\`\n\n- Also useful: \`PRIMARY KEY\`, \`DEFAULT value\`, and \`FOREIGN KEY\` (needs \`PRAGMA foreign_keys = ON\`).\n- The error message names the rule that was broken: use it to give users a precise message.\n- An **index** is extra bookkeeping that makes lookups on a column fast, at the cost of slower writes and more space. Index columns you search, join or sort by often, not everything.\n- \`UNIQUE\` automatically creates an index.\n- Validate in Python **and** constrain in the database: two layers are safer than one.`,
    analogy:`Bouncers at the door (constraints) and a table of contents at the front (index).`,
    example:e58},
  predict:{code:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (x INTEGER UNIQUE)")
conn.execute("INSERT INTO t VALUES (1)")
try:
    conn.execute("INSERT INTO t VALUES (1)")
except sqlite3.IntegrityError:
    print("dup")
print(conn.execute("SELECT COUNT(*) FROM t").fetchone()[0])`, q:'What prints?', opts:['dup then 1','dup then 2','1 only'], ans:0, why:'The second insert is rejected, so one row remains.'},
  cast:{code:e58, task:'Cast it.'},
  bug:{broken:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (x INTEGER UNIQUE)")
conn.execute("INSERT INTO t VALUES (1)")
conn.execute("INSERT INTO t VALUES (1)")
print("done")`, task:'The duplicate raises IntegrityError and crashes. Catch it and print "duplicate". Expected: duplicate',
    cases:[{inputs:[],tests:[['Works','lines==["duplicate","done"]'],['Catches the right error','"IntegrityError" in src']]}],
    sol:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (x INTEGER UNIQUE)")
conn.execute("INSERT INTO t VALUES (1)")
try:
    conn.execute("INSERT INTO t VALUES (1)")
except sqlite3.IntegrityError:
    print("duplicate")
print("done")`, wrong:[R`print("duplicate")
print("done")`]},
  write:{prompt:'Create (in the connection) a `heroes` table where `name` is `NOT NULL UNIQUE` and `level` is `NOT NULL` and `CHECK (level >= 1)`, plus an index on `level`. Loop on `input("> ")`: `add NAME LEVEL` prints `Added NAME`, or `Duplicate NAME` if the name exists, or `Invalid level NAME` if the level breaks the rule (let the **database** decide and catch `sqlite3.IntegrityError`); `show` prints `name level` sorted by name; `quit` stops; else `Unknown command`.',
    starter:h58,
    inputs:sess58,
    cases:[{inputs:sess58,tests:[['Whole session',eqH(out58,'> ')],['Index','"CREATE INDEX" in src.upper()'],['Catches IntegrityError','"IntegrityError" in src']]},{inputs:['add a 1','add a 2','add b 0','add b -3','show','quit'],tests:[['Rejected rows stay out',eqH(['Added a','Duplicate a','Invalid level b','Invalid level b','a 1'],'> ')]]},{inputs:['show','quit'],tests:[['Nothing yet',eqH([],'> ')]]},{inputs:['zap','add x','quit'],tests:[['Unknown',eqH(['Unknown command','Unknown command'],'> ')]]},{inputs:['add b 2','add a 2','show','quit'],tests:[['Sorted by name',eqH(['Added b','Added a','a 2','b 2'],'> ')]]}],
    sol:h58 + g58,
    wrong:[h58 + g58.replace('NOT NULL UNIQUE','NOT NULL'),h58 + g58.replace(' CHECK (level >= 1)',''),h58 + g58.replace('"UNIQUE" in str(err)','"CHECK" in str(err)'),h58 + g58.replace('except sqlite3.IntegrityError as err:','except Exception as err:\n            raise'),h58 + g58.replace('level >= 1','level >= 2')],
    hints:['CREATE TABLE heroes (name TEXT NOT NULL UNIQUE, level INTEGER NOT NULL CHECK (level >= 1)); CREATE INDEX idx_heroes_level ON heroes (level).','Wrap the INSERT in try/except sqlite3.IntegrityError as err.','"UNIQUE" in str(err) means a duplicate name; otherwise the CHECK failed.',h58 + g58]},
  power:{can:['Make the database enforce rules with NOT NULL, UNIQUE and CHECK','Catch IntegrityError and add an index'],
    expand:'Add `PRAGMA foreign_keys = ON` and a `quests` table with a `FOREIGN KEY` to heroes.',
    where:'Usernames must be unique and prices non-negative: the database guarantees it even when code has a bug.',
    next:'Next: transactions, all-or-nothing changes.'},
  codex:{title:'Constraints',body:'NOT NULL, UNIQUE, CHECK(expr), PRIMARY KEY, DEFAULT; violations raise sqlite3.IntegrityError (message names the rule). CREATE INDEX name ON t (col) speeds reads, slows writes.',snip:R`try:
    conn.execute("INSERT INTO heroes VALUES (?, ?)", row)
except sqlite3.IntegrityError as err:
    print(err)`}
},
{
  id:'r12-59', realm:12, n:59, title:'Transactions: all or nothing',
  teaches:['sql-tx'], requires:['sql-constraints'],
  story:`Ada pays Bob thirty gold. The clerk subtracts it from Ada... and the lights go out. Did Bob get paid? "That," says Orrin gravely, "is why we have **transactions**: either *everything* happens, or *nothing* does."`,
  concept:{
    html:`A **transaction** groups several changes into one all-or-nothing unit.\n\n\`\`\`\ntry:\n    with conn:                       # commits on success, ROLLS BACK if an exception escapes\n        conn.execute("UPDATE purses SET gold = gold - ? WHERE name = ?", (amount, src))\n        conn.execute("UPDATE purses SET gold = gold + ? WHERE name = ?", (amount, dst))\n        if balance < 0:\n            raise ValueError("insufficient gold")   # undoes BOTH updates\nexcept ValueError as err:\n    print("Failed:", err)\n\`\`\`\n\n- \`with conn:\` is a **transaction block**: no exception = \`commit()\`; exception = \`rollback()\`, then the exception continues upward (so catch it outside).\n- Think of money transfers, stock changes, order + payment: half-done is worse than not done.\n- **ACID**: Atomic (all or nothing), Consistent (rules hold), Isolated (others don't see halfway states), Durable (committed means saved).\n- Check things *inside* the block (rowcount, balance) and raise to undo.\n- \`with conn:\` does **not** close the connection.`,
    analogy:`Writing in pencil on a draft; \`commit\` inks it, \`rollback\` erases the draft.`,
    example:e59},
  predict:{code:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (x INTEGER)")
conn.execute("INSERT INTO t VALUES (1)")
conn.commit()
try:
    with conn:
        conn.execute("UPDATE t SET x = 99")
        raise ValueError
except ValueError:
    pass
print(conn.execute("SELECT x FROM t").fetchone()[0])`, q:'What prints?', opts:['1','99','Error'], ans:0, why:'The exception rolled the update back.'},
  cast:{code:e59, task:'Cast it.'},
  bug:{broken:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (x INTEGER)")
conn.execute("INSERT INTO t VALUES (1)")
conn.commit()
try:
    conn.execute("UPDATE t SET x = 99")
    raise ValueError("oops")
except ValueError:
    pass
print(conn.execute("SELECT x FROM t").fetchone()[0])`, task:'The failed update was NOT undone. Wrap the changes in a transaction block. Expected: 1',
    cases:[{inputs:[],tests:[['Works','lines==["1"]'],['Uses with conn','"with conn" in src']]}],
    sol:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (x INTEGER)")
conn.execute("INSERT INTO t VALUES (1)")
conn.commit()
try:
    with conn:
        conn.execute("UPDATE t SET x = 99")
        raise ValueError("oops")
except ValueError:
    pass
print(conn.execute("SELECT x FROM t").fetchone()[0])`, wrong:[R`print(1)`]},
  write:{prompt:'A `purses` table (ada 100, bob 20) exists. Loop on `input("> ")`: `pay FROM TO AMOUNT` moves gold inside a transaction and prints `Paid`, or `Failed: no such sender`, `Failed: no such recipient`, or `Failed: insufficient gold` (the sender may not end below 0). A failed payment must leave **every** purse unchanged. `show` prints `name gold` sorted by name; `quit` stops; else `Unknown command`.',
    starter:h59,
    inputs:sess59,
    cases:[{inputs:sess59,tests:[['Whole session',eqH(out59,'> ')],['Transaction block','"with conn" in src']]},{inputs:['pay ada bob 100','show','quit'],tests:[['Exactly all your gold',eqH(['Paid','ada 0','bob 120'],'> ')]]},{inputs:['pay ada bob 101','show','quit'],tests:[['One too much',eqH(['Failed: insufficient gold','ada 100','bob 20'],'> ')]]},{inputs:['pay bob zed 5','pay zed bob 5','show','quit'],tests:[['Rollback of sender',eqH(['Failed: no such recipient','Failed: no such sender','ada 100','bob 20'],'> ')]]},{inputs:['pay ada bob 10','pay bob ada 30','show','quit'],tests:[['Back and forth',eqH(['Paid','Paid','ada 120','bob 0'],'> ')]]},{inputs:['hop','quit'],tests:[['Unknown',eqH(['Unknown command'],'> ')]]}],
    sol:h59 + g59,
    wrong:[h59 + g59.replace('            with conn:\n','            if True:\n').replace('                cur = conn.execute("UPDATE purses SET gold = gold - ?','                cur = conn.execute("UPDATE purses SET gold = gold - ?'),h59 + g59.replace('if balance < 0:','if balance < -1000:'),h59 + g59.replace('if balance < 0:','if balance <= 0:'),h59 + g59.replace('                if cur.rowcount != 1:\n                    raise ValueError("no such recipient")\n',''),h59 + g59.replace('gold = gold + ?','gold = gold + 1')],
    hints:['Wrap both UPDATEs in `with conn:`; raise ValueError to undo.','After the first UPDATE check cur.rowcount != 1 -> "no such sender"; after the second -> "no such recipient".','Read the sender\'s balance after the debit; if it is below 0 raise ValueError("insufficient gold"). Catch ValueError outside the with block.',h59 + g59]},
  power:{can:['Group changes into atomic transactions','Roll back automatically on errors'],
    expand:'Log each payment in a `ledger` table inside the same transaction so the log never disagrees with the purses.',
    where:'Banking, shopping carts and bookings all rely on transactions to avoid half-finished states.',
    next:'Next: Real-World Mission: the Guild Library.'},
  codex:{title:'Transactions',body:'with conn: ... commits on success, rolls back on exception (which keeps propagating: catch outside). Check rowcount/balances inside and raise to undo everything. ACID: atomic, consistent, isolated, durable.',snip:R`try:
    with conn:
        conn.execute(debit)
        conn.execute(credit)
except ValueError:
    print("rolled back")`}
},
{
  id:'r12-60', realm:12, n:60, title:'Real-World Mission: The Guild Library',
  teaches:['mission12h'], requires:['sql-tx'],
  story:`The Guild's library has run on scribbled notes for a century. Books vanish, nobody knows who has what. Orrin hands you a quill. "Build it a **database**. Books, copies, loans, returns, a report. Do it right, and the Guild will run on your system for years."`,
  concept:{
    html:`A real mini-application on a database:\n\n- **Two tables**: \`books(id, title, copies)\` and \`loans(book_id, member, returned)\`. A loan is a row; returning flips \`returned\` to 1. Availability is *computed*, never stored (stored counters drift out of sync):\n\n\`\`\`\ncopies - (SELECT COUNT(*) FROM loans WHERE book_id = books.id AND returned = 0)\n\`\`\`\n\n- \`cursor.lastrowid\` gives the id SQLite just generated for an insert.\n- Validate in order: *does the book exist?* then *is a copy free?* Answer with specific messages.\n- Return one specific loan: \`UPDATE ... WHERE rowid = (SELECT MIN(rowid) FROM loans WHERE ... AND returned = 0)\`, and use \`rowcount\` to detect "no such loan".\n- Put reusable queries in a **function** (\`available(book_id)\`).\n- Every value goes through \`?\` placeholders.\n- A command loop turns the database into a program.`,
    analogy:`The librarian's ledger, rebuilt as tables that can never lose a book.`,
    example:e60},
  predict:{code:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE b (id INTEGER PRIMARY KEY, t TEXT)")
a = conn.execute("INSERT INTO b (t) VALUES ('x')").lastrowid
c = conn.execute("INSERT INTO b (t) VALUES ('y')").lastrowid
print(a, c)`, q:'What prints?', opts:['1 2','0 1','2 2'], ans:0, why:'INTEGER PRIMARY KEY auto-numbers from 1.'},
  cast:{code:e60, task:'Cast it.'},
  bug:{broken:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE b (id INTEGER PRIMARY KEY, copies INTEGER)")
conn.execute("INSERT INTO b (copies) VALUES (3)")
conn.execute("CREATE TABLE l (book_id INTEGER, returned INTEGER DEFAULT 0)")
conn.executemany("INSERT INTO l (book_id, returned) VALUES (?, ?)", [(1, 0), (1, 1)])
print(3 - conn.execute("SELECT COUNT(*) FROM l WHERE book_id = 1").fetchone()[0])`, task:'A returned loan should not count. Only count loans with returned = 0. Expected: 2',
    cases:[{inputs:[],tests:[['Works','lines==["2"]'],['Filters returned','"returned = 0" in src']]}],
    sol:R`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE b (id INTEGER PRIMARY KEY, copies INTEGER)")
conn.execute("INSERT INTO b (copies) VALUES (3)")
conn.execute("CREATE TABLE l (book_id INTEGER, returned INTEGER DEFAULT 0)")
conn.executemany("INSERT INTO l (book_id, returned) VALUES (?, ?)", [(1, 0), (1, 1)])
print(3 - conn.execute("SELECT COUNT(*) FROM l WHERE book_id = 1 AND returned = 0").fetchone()[0])`, wrong:[R`print(2)`]},
  write:{prompt:'Tables `books` and `loans` exist. Loop on `input("> ")`: `add TITLE COPIES` -> `Added <title> (#<id>)`; `borrow ID MEMBER` -> `Borrowed <title>`, `No such book`, or `No copies left` (copies minus unreturned loans must be above 0); `return ID MEMBER` -> `Returned <title>` or `No such loan` (a loan can only be returned once); `report` -> one `<title>: <available>/<copies>` line per book sorted by title, then `Active loans: <n>`; `quit` stops; else `Unknown command`.',
    starter:h60,
    inputs:sess60,
    cases:[{inputs:sess60,tests:[['Whole session',eqH(out60,'> ')],['Placeholders','"?" in src']]},{inputs:['report','quit'],tests:[['Empty library',eqH(['Active loans: 0'],'> ')]]},{inputs:['add Solo 1','borrow 1 ada','borrow 1 ada','return 1 ada','borrow 1 bob','report','quit'],tests:[['One copy cycle',eqH(['Added Solo (#1)','Borrowed Solo','No copies left','Returned Solo','Borrowed Solo','Solo: 0/1','Active loans: 1'],'> ')]]},{inputs:['add Zed 2','add Amy 1','borrow 1 x','borrow 1 x','return 1 x','report','quit'],tests:[['Same member twice',eqH(['Added Zed (#1)','Added Amy (#2)','Borrowed Zed','Borrowed Zed','Returned Zed','Amy: 1/1','Zed: 1/2','Active loans: 1'],'> ')]]},{inputs:['borrow 1 a','return 1 a','quit'],tests:[['Nothing exists',eqH(['No such book','No such loan'],'> ')]]}],
    sol:h60 + g60,
    wrong:[h60 + g60.replace('FROM loans WHERE book_id = books.id AND returned = 0','FROM loans WHERE book_id = books.id'),h60 + g60.replace('AND member = ? AND returned = 0)','AND returned = 0)').replace('(int(parts[1]), parts[2]))\n        if cur.rowcount','(int(parts[1]),))\n        if cur.rowcount'),h60 + g60.replace('available(int(parts[1])) <= 0','available(int(parts[1])) < 0'),h60 + g60.replace('ORDER BY title','ORDER BY id'),h60 + g60.replace('SELECT COUNT(*) FROM loans WHERE returned = 0','SELECT COUNT(*) FROM loans'),h60 + g60.replace('WHERE rowid = (SELECT MIN(rowid) FROM loans "\n            "WHERE book_id = ? AND member = ? AND returned = 0)','WHERE book_id = ? AND member = ?').replace('(int(parts[1]), parts[2]))\n        if cur.rowcount','(int(parts[1]), parts[2]))\n        if cur.rowcount')],
    hints:['Create books with add (cursor.lastrowid is the new id); available = copies minus COUNT of loans with returned = 0.','borrow: check the book exists, then available() > 0, then INSERT INTO loans. return: UPDATE the one unreturned loan and look at rowcount.','report: SELECT id, title, copies FROM books ORDER BY title, then count unreturned loans.',h60 + g60]},
  power:{can:['Design two related tables and a command loop on top of them','Compute availability with SQL instead of storing counters'],
    expand:'Add a `due` date column to loans and a `late` command listing overdue loans (dates come in the automation realm).',
    where:'Libraries, rental shops, inventory and booking systems all work exactly like this.',
    next:'Next: automation, making Python do the chores.'},
  codex:{title:'Database app pattern',body:'Tables for entities + a link table; compute derived values with SQL; validate in order with specific messages; cursor.lastrowid; rowcount for "not found"; functions for reusable queries; placeholders always.',snip:R`available = copies - (SELECT COUNT(*) FROM loans WHERE book_id = ? AND returned = 0)`}
}
);
