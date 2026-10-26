// REALM 12 — THE MASTER GATE — part G (lessons 45-51: pandas)
// NOTE: pandas is a separate download in the browser (Pyodide loads it on first use).

// ---------- 45 series
const s45 = R`import pandas as pd

text = input("Numbers: ").split()
if not text:
    print("No data")
else:
    s = pd.Series([float(x) for x in text])
    print("Count:", len(s))
    print("Mean:", f"{round(s.mean(), 2):g}")
    print("Max:", f"{s.max():g}")
    print("Above mean:", int((s > s.mean()).sum()))`;
const e45 = R`import pandas as pd

s = pd.Series([4, 8, 15, 16, 23, 42])
print(len(s), int(s.sum()), s.mean(), int(s.max()))
print((s * 2).tolist())                  # works on the whole column at once
print(s[s > 10].tolist())                # filter with a True/False mask
print((s > s.mean()).sum())              # how many are above average
print(s.iloc[0], s.iloc[-1])             # by position
print(pd.Series(["a", "b", "a"]).value_counts().to_dict())`;

// ---------- 46 dataframe
const s46 = R`import pandas as pd

rows = []
for item in input("Roster: ").split():
    name, hp, level = item.split(":")
    rows.append({"name": name, "hp": int(hp), "level": int(level)})
df = pd.DataFrame(rows, columns=["name", "hp", "level"])
df["power"] = df["hp"] * df["level"]
for _, row in df.sort_values(["power", "name"], ascending=[False, True]).iterrows():
    print(row["name"], int(row["power"]))
print("Total power:", int(df["power"].sum()))`;
const e46 = R`import pandas as pd

df = pd.DataFrame([
    {"name": "ada", "hp": 10, "level": 3},
    {"name": "bob", "hp": 20, "level": 2},
])
print(df.shape, list(df.columns))
df["power"] = df["hp"] * df["level"]       # a new column from existing ones
print(df["power"].tolist())
print(df.sort_values("power", ascending=False)["name"].tolist())
print(df.loc[0, "name"], df.iloc[1]["hp"])
for _, row in df.iterrows():
    print(row["name"], row["power"])`;

// ---------- 47 filter
const s47 = R`import pandas as pd

rows = []
for item in input("Heroes: ").split():
    name, cls, level = item.split(":")
    rows.append({"name": name, "class": cls, "level": int(level)})
df = pd.DataFrame(rows, columns=["name", "class", "level"])
cls = input("Class: ").strip()
minimum = int(input("Min level: "))
mask = df["level"] >= minimum
if cls != "any":
    mask &= df["class"] == cls
found = df[mask].sort_values(["level", "name"], ascending=[False, True])
if found.empty:
    print("No matches")
for _, row in found.iterrows():
    print(f"{row['name']} ({row['class']}, level {row['level']})")`;
const e47 = R`import pandas as pd

df = pd.DataFrame({"name": ["ada", "bob", "cy"], "class": ["mage", "rogue", "mage"], "level": [5, 3, 9]})
print(df[df["level"] > 4]["name"].tolist())
print(df[(df["class"] == "mage") & (df["level"] > 6)]["name"].tolist())    # & needs brackets
print(df[(df["class"] == "rogue") | (df["level"] > 8)]["name"].tolist())
print(df[df["class"].isin(["rogue", "bard"])]["name"].tolist())
df.loc[df["class"] == "mage", "level"] += 1                                # change matching rows
print(df["level"].tolist())`;

// ---------- 48 groupby
const s48 = R`import pandas as pd

rows = []
for item in input("Sales: ").split():
    region, amount = item.split(":")
    rows.append({"region": region, "amount": float(amount)})
df = pd.DataFrame(rows, columns=["region", "amount"])
if df.empty:
    print("No sales")
else:
    summary = df.groupby("region")["amount"].agg(["sum", "count", "mean"]).reset_index()
    summary = summary.sort_values(["sum", "region"], ascending=[False, True])
    for _, r in summary.iterrows():
        print(f"{r['region']}: total={r['sum']:g} count={int(r['count'])} avg={round(r['mean'], 2):g}")
    print("Best region:", summary.iloc[0]["region"])`;
const e48 = R`import pandas as pd

df = pd.DataFrame({"region": ["n", "s", "n", "e"], "amount": [100, 50, 20, 50]})
print(df.groupby("region")["amount"].sum().to_dict())
print(df.groupby("region")["amount"].count().to_dict())
summary = df.groupby("region")["amount"].agg(["sum", "mean"]).reset_index()
print(summary["region"].tolist(), summary["sum"].tolist())
print(df["amount"].describe()["max"])`;

// ---------- 49 merge
const h49 = R`import pandas as pd

def table(text, cols, types):
    rows = []
    for item in text.split():
        values = item.split(":")
        rows.append({c: t(v) for c, t, v in zip(cols, types, values)})
    return pd.DataFrame(rows, columns=cols).astype(dict(zip(cols, types)))

players = table(input("Players: "), ["id", "name"], [int, str])
scores = table(input("Scores: "), ["id", "score"], [int, int])
`;
const g49 = R`totals = scores.groupby("id", as_index=False)["score"].sum()
merged = players.merge(totals, on="id", how="left").fillna({"score": 0})
for _, row in merged.sort_values("name").iterrows():
    print(f"{row['name']}: {int(row['score'])}")
unknown = sorted(set(totals["id"]) - set(players["id"]))
for uid in unknown:
    print("Unknown id", uid)`;
const e49 = R`import pandas as pd

players = pd.DataFrame({"id": [1, 2, 3], "name": ["ada", "bob", "cy"]})
scores = pd.DataFrame({"id": [1, 2, 1], "score": [10, 5, 7]})

totals = scores.groupby("id", as_index=False)["score"].sum()
print(totals["score"].tolist())
left = players.merge(totals, on="id", how="left")      # keeps every player
print(left["score"].tolist())                           # cy has no score: NaN
print(left.fillna({"score": 0})["score"].tolist())
inner = players.merge(totals, on="id", how="inner")    # only players with scores
print(inner["name"].tolist())`;

// ---------- 50 clean
const s50 = R`import io
import pandas as pd

text = input("CSV: ").replace(";", "\n")
df = pd.read_csv(io.StringIO(text), dtype=str, skipinitialspace=True)
read = len(df)
df["name"] = df["name"].fillna("").str.strip().str.title()
df = df[df["name"] != ""].copy()
df["age"] = pd.to_numeric(df["age"], errors="coerce")
df["score"] = pd.to_numeric(df["score"], errors="coerce").fillna(0)
median = df["age"].median()
median = 0 if pd.isna(median) else int(median)
df["age"] = df["age"].fillna(median)
df = df.drop_duplicates(subset="name", keep="first").sort_values("name")
print("Rows read:", read)
print("Rows kept:", len(df))
print("Median age:", median)
for _, row in df.iterrows():
    print(row["name"], f"{row['age']:g}", f"{row['score']:g}")`;
const e50 = R`import io
import pandas as pd

raw = "name,age\n ada ,30\nBOB,abc\n,22\nada,31"
df = pd.read_csv(io.StringIO(raw), dtype=str)
print(df["name"].tolist())
df["name"] = df["name"].fillna("").str.strip().str.title()
df["age"] = pd.to_numeric(df["age"], errors="coerce")      # junk becomes NaN
print(df["age"].tolist(), df["age"].median())
print(df["age"].fillna(0).tolist())
print(df.drop_duplicates(subset="name")["name"].tolist())
print(df.isna().sum().to_dict())`;

// ---------- 51 mission
const s51 = R`import pandas as pd

df = pd.read_csv("sales.csv", dtype=str, skipinitialspace=True)
df["qty"] = pd.to_numeric(df["qty"], errors="coerce")
df["price"] = pd.to_numeric(df["price"], errors="coerce")
df["date"] = pd.to_datetime(df["date"], errors="coerce", format="%Y-%m-%d")
df["region"] = df["region"].fillna("").str.strip()
df["product"] = df["product"].fillna("").str.strip()
valid = df.dropna(subset=["qty", "price", "date"])
valid = valid[(valid["region"] != "") & (valid["product"] != "")].copy()
print("Orders:", len(valid))
print("Skipped:", len(df) - len(valid))
if valid.empty:
    print("No valid orders")
else:
    valid["revenue"] = valid["qty"] * valid["price"]
    valid["month"] = valid["date"].dt.strftime("%Y-%m")
    print(f"Revenue: {valid['revenue'].sum():.2f}")
    print(f"Average order: {valid['revenue'].mean():.2f}")
    months = valid.groupby("month")["revenue"].sum().reset_index()
    months = months.sort_values(["revenue", "month"], ascending=[False, True])
    print(f"Best month: {months.iloc[0]['month']} ({months.iloc[0]['revenue']:.2f})")
    units = valid.groupby("product")["qty"].sum().reset_index()
    units = units.sort_values(["qty", "product"], ascending=[False, True])
    print(f"Top product: {units.iloc[0]['product']} ({units.iloc[0]['qty']:g} units)")
    regions = valid.groupby("region")["revenue"].sum().reset_index()
    regions = regions.sort_values(["revenue", "region"], ascending=[False, True])
    for _, r in regions.iterrows():
        print(f"{r['region']}: {r['revenue']:.2f}")`;
const e51 = R`import pandas as pd

df = pd.DataFrame({"date": ["2026-01-05", "2026-02-02", "oops"], "qty": [2, 10, 1], "price": [50, 3, 7]})
df["date"] = pd.to_datetime(df["date"], errors="coerce", format="%Y-%m-%d")
print(df["date"].isna().tolist())
good = df.dropna(subset=["date"]).copy()
good["revenue"] = good["qty"] * good["price"]
good["month"] = good["date"].dt.strftime("%Y-%m")
print(good.groupby("month")["revenue"].sum().to_dict())
print(len(df) - len(good), "skipped")`;
const f51a = `date,region,product,qty,price
2026-01-05,North,Sword,2,50
2026-01-20,South,Shield,1,40.5
2026-02-02,North,Potion,10,3
2026-02-14,East,Sword,1,50
bad-date,North,Sword,1,50
2026-02-20,South,Potion,x,3
2026-03-01,,Sword,1,50
2026-03-05,South,Sword,3,50
`;
const f51b = `date,region,product,qty,price
`;
const f51c = `date,region,product,qty,price
2026-02-01,A,Bolt,4,2.5
2026-01-15,B,Bolt,2,5
2026-01-20,A,Nut,1,10
2026-02-10,B,Nut,5,2
`;

LESSONS.push(
{
  id:'r12-45', realm:12, n:45, title:'pandas Series: a column of data',
  teaches:['pd-series'], requires:['mission12f'],
  story:`In the **Ledger Hall**, a thousand clerks add numbers by hand. Orrin claps, and one tireless machine does it all in a blink. "**pandas**," he says. "The tool that data people reach for first. Pay attention: you will use this on the job."`,
  concept:{
    html:`**pandas** is Python's data-analysis library. Its basic building block, a **Series**, is a labelled column of values.\n\n\`\`\`\nimport pandas as pd\n\ns = pd.Series([4, 8, 15, 16, 23, 42])\ns.mean(), s.sum(), s.max(), len(s)\ns * 2                    # operates on EVERY element (no loop!)\ns[s > 10]                 # boolean mask: keep only values above 10\n(s > s.mean()).sum()      # True counts as 1 -> how many are above average\ns.iloc[0]                 # by position\n\`\`\`\n\n- **Vectorised**: \`s * 2\` and \`s > 10\` work on the whole column at once. Faster and shorter than loops.\n- A comparison gives a Series of \`True/False\`; **indexing with it filters**.\n- \`.sum()\` of booleans counts the Trues.\n- \`.tolist()\` converts to a plain Python list for printing (printing numpy numbers directly can show \`np.int64(...)\` in repr).\n- \`.value_counts()\` tallies how often each value appears.\n- Missing values are \`NaN\`; most statistics skip them automatically.\n\nℹ️ In the browser, pandas is downloaded the first time you import it (a few seconds, then cached).`,
    analogy:`A spreadsheet column that understands maths: tell it "double everything" once and it does.`,
    example:e45},
  predict:{code:R`import pandas as pd
s = pd.Series([1, 2, 3])
print((s * 2).tolist(), int(s.sum()))`, q:'What prints?', opts:['[2, 4, 6] 6','[1, 2, 3, 1, 2, 3] 6','[2, 4, 6] 12'], ans:0, why:'Multiplying a Series scales each value; the sum is still of the original.'},
  cast:{code:e45, task:'Cast it.'},
  bug:{broken:R`import pandas as pd
s = pd.Series([1, 2, 3, 4])
mask = (s > 1) and (s < 4)
print(int(mask.sum()))`, task:'`and` cannot combine whole columns (ValueError). Use & with brackets. Expected: 2',
    cases:[{inputs:[],tests:[['Works','lines==["2"]'],['Uses &','"&" in src']]}],
    sol:R`import pandas as pd
s = pd.Series([1, 2, 3, 4])
mask = (s > 1) & (s < 4)
print(int(mask.sum()))`, wrong:[R`print(2)`]},
  write:{prompt:'Ask `Numbers: ` (space-separated, may be decimals). With no numbers print `No data`. Otherwise build a `pd.Series` and print `Count:`, `Mean:` (rounded to 2 places), `Max:` and `Above mean:` (how many values are strictly above the mean). Show numbers without trailing `.0` (`f"{x:g}"`).',
    starter:R`import pandas as pd

text = input("Numbers: ").split()
`,
    inputs:['4 8 15 16 23 42'],
    cases:[{inputs:['4 8 15 16 23 42'],tests:[['Stats','lines[-4:]==["Count: 6","Mean: 18","Max: 42","Above mean: 2"]'],['Uses pandas','"pd.Series" in src']]},{inputs:['1 2 3 4'],tests:[['Decimal mean','lines[-4:]==["Count: 4","Mean: 2.5","Max: 4","Above mean: 2"]']]},{inputs:['1 2 4'],tests:[['Rounding','lines[-4:]==["Count: 3","Mean: 2.33","Max: 4","Above mean: 1"]']]},{inputs:['5'],tests:[['One value','lines[-4:]==["Count: 1","Mean: 5","Max: 5","Above mean: 0"]']]},{inputs:['-1 -5'],tests:[['Negative','lines[-4:]==["Count: 2","Mean: -3","Max: -1","Above mean: 1"]']]},{inputs:['2.5 3.5'],tests:[['Decimals','lines[-4:]==["Count: 2","Mean: 3","Max: 3.5","Above mean: 1"]']]},{inputs:[''],tests:[['Nothing','lines[-1]=="No data"']]}],
    sol:s45,
    wrong:[s45.replace('s > s.mean()','s >= s.mean()'),s45.replace('s > s.mean()','s > s.median()'),s45.replace('round(s.mean(), 2)','int(s.mean())'),s45.replace('s.max()','s.min()')],
    hints:['Build the Series from floats: pd.Series([float(x) for x in text]).','s.mean(), s.max() and len(s) give the stats; format with f"{value:g}" to drop the .0.','(s > s.mean()).sum() counts the values above average; wrap in int().',s45]},
  power:{can:['Create and summarise a pandas Series','Filter and count with boolean masks'],
    expand:'Add `Median:` and `Std dev:` using `s.median()` and `s.std()`.',
    where:'Every analyst starts with a column of numbers and the same few questions.',
    next:'Next: DataFrames, whole tables.'},
  codex:{title:'Series',body:'pd.Series(list). Vectorised maths (s * 2), masks (s[s > 10]), (mask).sum() counts Trues, .mean() .max() .median(), .tolist() to print, .value_counts(). Use & | with brackets, never and/or.',snip:R`s = pd.Series([4, 8, 15])
s[s > s.mean()]`}
},
{
  id:'r12-46', realm:12, n:46, title:'DataFrames: tables in Python',
  teaches:['pd-df'], requires:['pd-series'],
  story:`"One column is a list," Orrin says. "A **table** is the real beast: rows of records, columns of facts. Every spreadsheet, every database result, every CSV is one."`,
  concept:{
    html:`A **DataFrame** is a table: columns are Series sharing one row index.\n\n\`\`\`\ndf = pd.DataFrame([\n    {"name": "ada", "hp": 10, "level": 3},\n    {"name": "bob", "hp": 20, "level": 2},\n])\ndf.shape                 # (2, 3)  rows, columns\ndf.columns               # the names\ndf["hp"]                 # one column (a Series)\ndf["power"] = df["hp"] * df["level"]     # new column, computed for every row\ndf.sort_values("power", ascending=False)\ndf.loc[0, "name"]        # by label, df.iloc[1] by position\n\`\`\`\n\n- Build from a **list of dicts** (one per row) or a dict of lists (one per column).\n- Pass \`columns=[...]\` so an empty list still gives the right columns.\n- \`sort_values(["a", "b"], ascending=[False, True])\` sorts by several columns with different directions, which gives a stable, predictable tie-break.\n- \`for _, row in df.iterrows():\` visits rows (slow on big tables, fine for printing).\n- \`df["x"].sum()\` etc. work per column.`,
    analogy:`A spreadsheet where every column is a pandas Series and formulas apply to whole columns.`,
    example:e46},
  predict:{code:R`import pandas as pd
df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
print(df.shape, list(df.columns))`, q:'What prints?', opts:["(2, 2) ['a', 'b']","(2,) ['a', 'b']","(1, 2) ['a', 'b']"], ans:0, why:'2 rows by 2 columns.'},
  cast:{code:e46, task:'Cast it.'},
  bug:{broken:R`import pandas as pd
df = pd.DataFrame({"hp": [10], "level": [3]})
print(int(df["Hp"][0] * df["level"][0]))`, task:'KeyError: column names are case-sensitive. Fix the name. Expected: 30',
    cases:[{inputs:[],tests:[['Works','lines==["30"]'],['Right column','"df[\\"hp\\"]" in src or "df[\'hp\']" in src']]}],
    sol:R`import pandas as pd
df = pd.DataFrame({"hp": [10], "level": [3]})
print(int(df["hp"][0] * df["level"][0]))`, wrong:[R`print(30)`]},
  write:{prompt:'Ask `Roster: ` (space-separated `name:hp:level`). Build a DataFrame with those columns, add a `power` column (`hp * level`), then print `<name> <power>` for each hero sorted by power (highest first, ties by name A-Z), and finally `Total power: <sum>`. An empty roster just prints `Total power: 0`.',
    starter:R`import pandas as pd

rows = []
for item in input("Roster: ").split():
    pass
`,
    inputs:['ada:10:3 bob:20:2 cy:5:8'],
    cases:[{inputs:['ada:10:3 bob:20:2 cy:5:8'],tests:[['Sorted','lines[-4:]==["bob 40","cy 40","ada 30","Total power: 110"]'],['Uses a DataFrame','"DataFrame" in src']]},{inputs:[''],tests:[['Empty','lines[-1]=="Total power: 0"']]},{inputs:['x:1:1'],tests:[['One hero','lines[-2:]==["x 1","Total power: 1"]']]},{inputs:['b:5:2 a:2:5 c:1:1'],tests:[['Tie broken by name','lines[-4:]==["a 10","b 10","c 1","Total power: 21"]']]}],
    sol:s46,
    wrong:[s46.replace('ascending=[False, True]','ascending=[True, True]'),s46.replace('["power", "name"]','"power"').replace('ascending=[False, True]','ascending=False'),s46.replace('df["hp"] * df["level"]','df["hp"] + df["level"]'),s46.replace('df["power"].sum()','df["hp"].sum()')],
    hints:['Collect one dict per hero in rows, then pd.DataFrame(rows, columns=["name", "hp", "level"]).','df["power"] = df["hp"] * df["level"] creates the new column.','df.sort_values(["power", "name"], ascending=[False, True]), then iterrows() to print.',s46]},
  power:{can:['Build and extend a DataFrame','Sort by several columns with a stable tie-break'],
    expand:'Add a `rank` column with `df["power"].rank(ascending=False)`.',
    where:'Everything in data analysis lives in a DataFrame.',
    next:'Next: filtering rows.'},
  codex:{title:'DataFrame',body:'pd.DataFrame(list_of_dicts, columns=[...]); df["new"] = df["a"] * df["b"]; sort_values([cols], ascending=[...]); df.shape; iterrows(); .loc by label, .iloc by position.',snip:R`df["power"] = df["hp"] * df["level"]
df.sort_values(["power", "name"], ascending=[False, True])`}
},
{
  id:'r12-47', realm:12, n:47, title:'Filtering rows: masks, loc and isin',
  teaches:['pd-filter'], requires:['pd-df'],
  story:`"Ask the table a question," Orrin says, "and it keeps only the rows that answer yes. Mages above level 4. Rogues or anyone above 8. The art is combining conditions without tangling them."`,
  concept:{
    html:`Filtering = build a **True/False mask**, then index with it.\n\n\`\`\`\ndf[df["level"] > 4]                                  # one condition\ndf[(df["class"] == "mage") & (df["level"] > 6)]      # AND: use &, brackets REQUIRED\ndf[(df["class"] == "rogue") | (df["level"] > 8)]     # OR: use |\ndf[~(df["class"] == "mage")]                          # NOT: ~\ndf[df["class"].isin(["rogue", "bard"])]               # membership\ndf.loc[df["class"] == "mage", "level"] += 1           # CHANGE matching rows\n\`\`\`\n\n- Python's \`and\`, \`or\`, \`not\` do **not** work on columns. Use \`& | ~\`, and wrap each comparison in **brackets** (because \`&\` binds tighter than \`>\`).\n- You can build a mask in steps: \`mask = df["level"] >= 5\` then \`mask &= df["class"] == "mage"\`.\n- \`found.empty\` is \`True\` when nothing matched.\n- ⚠️ **Chained assignment** \`df[mask]["level"] += 1\` changes a temporary copy and silently does nothing. Use \`df.loc[mask, "level"] += 1\`.`,
    analogy:`A sieve: each condition is a mesh size; & stacks sieves, | pours two together.`,
    example:e47},
  predict:{code:R`import pandas as pd
df = pd.DataFrame({"x": [1, 5, 9]})
print(df[df["x"] > 3]["x"].tolist())`, q:'What prints?', opts:['[5, 9]','[True, True]','[1]'], ans:0, why:'The mask keeps rows where x > 3.'},
  cast:{code:e47, task:'Cast it.'},
  bug:{broken:R`import pandas as pd
df = pd.DataFrame({"class": ["mage", "rogue"], "level": [5, 3]})
df[df["class"] == "mage"]["level"] += 1
print(df["level"].tolist())`, task:'Chained indexing edits a temporary copy. Use .loc[mask, column]. Expected: [6, 3]',
    cases:[{inputs:[],tests:[['Works','lines==["[6, 3]"]'],['Uses loc','".loc" in src']]}],
    sol:R`import pandas as pd
df = pd.DataFrame({"class": ["mage", "rogue"], "level": [5, 3]})
df.loc[df["class"] == "mage", "level"] += 1
print(df["level"].tolist())`, wrong:[R`print([6, 3])`]},
  write:{prompt:'Ask `Heroes: ` (space-separated `name:class:level`), then `Class: ` (a class name, or `any`) and `Min level: ` (whole number). Show heroes whose level is **at least** the minimum and whose class matches (any matches all), highest level first, ties by name. Print each as `<name> (<class>, level <level>)`, or `No matches`.',
    starter:R`import pandas as pd

rows = []
for item in input("Heroes: ").split():
    name, cls, level = item.split(":")
    rows.append({"name": name, "class": cls, "level": int(level)})
df = pd.DataFrame(rows, columns=["name", "class", "level"])
cls = input("Class: ").strip()
minimum = int(input("Min level: "))
`,
    inputs:['ada:mage:5 bob:rogue:3 cy:mage:9 di:rogue:7','mage','4'],
    cases:[{inputs:['ada:mage:5 bob:rogue:3 cy:mage:9 di:rogue:7','mage','4'],tests:[['Mages','lines[-2:]==["cy (mage, level 9)","ada (mage, level 5)"]']]},{inputs:['ada:mage:5 bob:rogue:3 cy:mage:9 di:rogue:7','any','5'],tests:[['Any class','lines[-3:]==["cy (mage, level 9)","di (rogue, level 7)","ada (mage, level 5)"]']]},{inputs:['ada:mage:5 bob:rogue:3 cy:mage:9 di:rogue:7','rogue','8'],tests:[['No matches','lines[-1]=="No matches"']]},{inputs:['ada:mage:5 bob:rogue:3 cy:mage:9','mage','5'],tests:[['Minimum is inclusive','lines[-2:]==["cy (mage, level 9)","ada (mage, level 5)"]']]},{inputs:['a:x:5 b:x:5 c:y:5','x','1'],tests:[['Ties by name','lines[-2:]==["a (x, level 5)","b (x, level 5)"]']]},{inputs:['','any','0'],tests:[['Nobody','lines[-1]=="No matches"']]}],
    sol:s47,
    wrong:[s47.replace('df["level"] >= minimum','df["level"] > minimum'),s47.replace('mask &= df["class"] == cls','mask |= df["class"] == cls'),s47.replace('if cls != "any":\n    mask &= df["class"] == cls','mask &= df["class"] == cls'),s47.replace('ascending=[False, True]','ascending=[True, True]')],
    hints:['mask = df["level"] >= minimum is the level condition.','If the class is not "any", combine: mask &= df["class"] == cls.','df[mask] keeps the matches; sort with sort_values(["level", "name"], ascending=[False, True]); found.empty tells you if nothing matched.',s47]},
  power:{can:['Filter rows with combined conditions','Update matching rows safely with .loc'],
    expand:'Filter by several classes at once with `.isin([...])`.',
    where:'"Show me customers who...", every analysis starts by filtering.',
    next:'Next: groupby, summaries per category.'},
  codex:{title:'Filtering',body:'mask = df["x"] > 4; combine with & | ~ and brackets; df[mask]; .isin([...]); df.loc[mask, "col"] = value to update. found.empty. Never use and/or on columns; avoid chained assignment.',snip:R`df[(df["class"] == "mage") & (df["level"] > 6)]`}
},
{
  id:'r12-48', realm:12, n:48, title:'groupby: summaries per category',
  teaches:['pd-groupby'], requires:['pd-filter'],
  story:`"Which region earns most?" Orrin asks, pointing at a heap of receipts. "Split them into piles by region, add up each pile, compare the piles. Split, apply, combine. That is **groupby**."`,
  concept:{
    html:`\`groupby\` splits a table into groups, summarises each group, and combines the results:\n\n\`\`\`\ndf.groupby("region")["amount"].sum()                       # total per region (a Series indexed by region)\ndf.groupby("region")["amount"].count()                     # rows per region\ndf.groupby("region")["amount"].agg(["sum", "count", "mean"])   # several at once -> DataFrame\n.reset_index()                                             # turn the group names back into a normal column\n\`\`\`\n\n- Always **pick the column** (\`["amount"]\`) and **an aggregation** (\`sum\`, \`mean\`, \`count\`, \`min\`, \`max\`, \`first\`...). \`df.groupby("region")\` alone is just a recipe, not a result.\n- \`.reset_index()\` is the key to sorting and iterating afterwards.\n- Sorting by a total then by name makes ties deterministic.\n- \`count\` ignores missing values; \`size\` counts rows.\n- A group's average is *not* the average of the group averages: let pandas compute it from the raw rows.`,
    analogy:`Sorting receipts into labelled envelopes, then adding up each envelope.`,
    example:e48},
  predict:{code:R`import pandas as pd
df = pd.DataFrame({"g": ["a", "b", "a"], "v": [1, 2, 3]})
print(df.groupby("g")["v"].sum().to_dict())`, q:'What prints?', opts:["{'a': 4, 'b': 2}","{'a': 3, 'b': 2}","{'a': 2, 'b': 4}"], ans:0, why:'Group a: 1 + 3 = 4; group b: 2.'},
  cast:{code:e48, task:'Cast it.'},
  bug:{broken:R`import pandas as pd
df = pd.DataFrame({"region": ["north", "south", "north"], "amount": [100, 50, 20]})
print(df.groupby("region")["amount"].count()["north"])`, task:'count() counts rows, but we want the total amount. Use sum(). Expected: 120',
    cases:[{inputs:[],tests:[['Works','lines==["120"]'],['sum','".sum()" in src']]}],
    sol:R`import pandas as pd
df = pd.DataFrame({"region": ["north", "south", "north"], "amount": [100, 50, 20]})
print(df.groupby("region")["amount"].sum()["north"])`, wrong:[R`print(120)`]},
  write:{prompt:'Ask `Sales: ` (space-separated `region:amount`). With no sales print `No sales`. Otherwise group by region and print `<region>: total=<sum> count=<rows> avg=<mean rounded to 2>` for each region, biggest total first (ties by region name A-Z; numbers without trailing `.0`), then `Best region: <name>`.',
    starter:R`import pandas as pd

rows = []
for item in input("Sales: ").split():
    region, amount = item.split(":")
    rows.append({"region": region, "amount": float(amount)})
df = pd.DataFrame(rows, columns=["region", "amount"])
`,
    inputs:['north:100 south:50 north:20 east:50 south:10'],
    cases:[{inputs:['north:100 south:50 north:20 east:50 south:10'],tests:[['Summary','lines[-4:]==["north: total=120 count=2 avg=60","south: total=60 count=2 avg=30","east: total=50 count=1 avg=50","Best region: north"]'],['groupby','"groupby" in src']]},{inputs:['b:10 a:10'],tests:[['Tie by name','lines[-3:]==["a: total=10 count=1 avg=10","b: total=10 count=1 avg=10","Best region: a"]']]},{inputs:['x:1 x:2 x:2'],tests:[['Rounded mean','lines[-2:]==["x: total=5 count=3 avg=1.67","Best region: x"]']]},{inputs:[''],tests:[['No sales','lines[-1]=="No sales"']]},{inputs:['a:2.5 a:2.5 b:4'],tests:[['Decimals','lines[-3:]==["a: total=5 count=2 avg=2.5","b: total=4 count=1 avg=4","Best region: a"]']]}],
    sol:s48,
    wrong:[s48.replace('ascending=[False, True]','ascending=[True, True]'),s48.replace('ascending=[False, True]','ascending=[False, False]'),s48.replace('agg(["sum", "count", "mean"])','agg(["sum", "count", "max"])').replace("r['mean']","r['max']"),s48.replace('summary.iloc[0]["region"]','summary.iloc[-1]["region"]')],
    hints:['df.groupby("region")["amount"].agg(["sum", "count", "mean"]).reset_index() gives one row per region.','Sort with sort_values(["sum", "region"], ascending=[False, True]) then iterrows().','Format: total={r["sum"]:g}, count={int(r["count"])}, avg={round(r["mean"], 2):g}. Best region is the first row.',s48]},
  power:{can:['Summarise a table per category','Use several aggregations at once and sort the summary'],
    expand:'Add a `max` aggregation and print each region\'s biggest single sale.',
    where:'"Revenue by region/month/product" is the most common business question there is.',
    next:'Next: merging tables, like SQL joins.'},
  codex:{title:'groupby',body:'df.groupby("key")["col"].agg(["sum","count","mean"]).reset_index(). Split-apply-combine. Pick the column and an aggregation. Sort by total then key for stable ties.',snip:R`df.groupby("region")["amount"].sum()`}
},
{
  id:'r12-49', realm:12, n:49, title:'merge: joining tables',
  teaches:['pd-merge'], requires:['pd-groupby'],
  story:`"The players are in one scroll, their scores in another," Orrin says. "To answer 'who scored what', you must **join** them on the shared id. And decide what happens to players with no score, and scores from players nobody knows."`,
  concept:{
    html:`\`merge\` joins two DataFrames on a shared column, like a SQL JOIN.\n\n\`\`\`\nplayers.merge(totals, on="id", how="left")\n\`\`\`\n\n| \`how=\` | Keeps |\n|---|---|\n| \`inner\` (default) | only ids present in **both** |\n| \`left\` | every row of the left table; missing partner values become **NaN** |\n| \`right\` | every row of the right table |\n| \`outer\` | everything from both |\n\n- After a left join, rows without a match have \`NaN\`. Fill them: \`.fillna({"score": 0})\`. NaN also forces the column to **float**, so convert back with \`int()\`.\n- If the right table has several rows per key (many scores per player), **aggregate first** (\`groupby("id", as_index=False)["score"].sum()\`), or the left rows get duplicated.\n- Both key columns must have the **same type** (int vs text won't match).\n- Find mismatches with sets: \`set(a["id"]) - set(b["id"])\`.`,
    analogy:`Matching name tags to guest list entries; some guests have no tag, some tags have no guest.`,
    example:e49},
  predict:{code:R`import pandas as pd
a = pd.DataFrame({"id": [1, 2], "n": ["x", "y"]})
b = pd.DataFrame({"id": [1], "s": [5]})
print(a.merge(b, on="id", how="left")["s"].tolist())`, q:'What prints?', opts:['[5.0, nan]','[5, None]','[5]'], ans:0, why:'Row 2 has no partner, so NaN (which makes the column float).'},
  cast:{code:e49, task:'Cast it.'},
  bug:{broken:R`import pandas as pd
players = pd.DataFrame({"id": [1, 2], "name": ["ada", "bob"]})
totals = pd.DataFrame({"id": [1], "score": [17]})
merged = players.merge(totals, on="id", how="left")
print(merged["score"].astype(int).tolist())`, task:'Bob has no score, so NaN cannot become an int. Fill missing scores with 0 first. Expected: [17, 0]',
    cases:[{inputs:[],tests:[['Works','lines==["[17, 0]"]'],['fillna','"fillna" in src']]}],
    sol:R`import pandas as pd
players = pd.DataFrame({"id": [1, 2], "name": ["ada", "bob"]})
totals = pd.DataFrame({"id": [1], "score": [17]})
merged = players.merge(totals, on="id", how="left")
print(merged["score"].fillna(0).astype(int).tolist())`, wrong:[R`print([17, 0])`]},
  write:{prompt:'Two tables are read for you: `players` (`id`, `name`) and `scores` (`id`, `score`; a player may have several scores or none). Print `<name>: <total score>` for **every** player sorted by name (0 for players without scores), then `Unknown id <n>` for each score id that matches no player (ascending order).',
    starter:h49,
    inputs:['1:ada 2:bob 3:cy','1:10 2:5 1:7 9:4'],
    cases:[{inputs:['1:ada 2:bob 3:cy','1:10 2:5 1:7 9:4'],tests:[['Totals','lines[-4:]==["ada: 17","bob: 5","cy: 0","Unknown id 9"]'],['merge','".merge(" in src']]},{inputs:['1:ada 2:bob','1:3 1:4 1:5'],tests:[['Several scores','lines[-2:]==["ada: 12","bob: 0"]']]},{inputs:['1:ada 2:bob',''],tests:[['No scores at all','lines[-2:]==["ada: 0","bob: 0"]']]},{inputs:['','1:5'],tests:[['No players','lines[-1]=="Unknown id 1"']]},{inputs:['1:a','8:1 7:2'],tests:[['Unknown ids sorted','lines[-3:]==["a: 0","Unknown id 7","Unknown id 8"]']]},{inputs:['1:zed 2:amy','2:5 1:1'],tests:[['Sorted by name not id','lines[-2:]==["amy: 5","zed: 1"]']]}],
    sol:h49 + g49,
    wrong:[h49 + g49.replace('how="left"','how="inner"'),h49 + g49.replace('totals = scores.groupby("id", as_index=False)["score"].sum()\nmerged = players.merge(totals, on="id", how="left")','totals = scores\nmerged = players.merge(totals, on="id", how="left")'),h49 + g49.replace('.fillna({"score": 0})',''),h49 + g49.replace('sort_values("name")','sort_values("id")')],
    hints:['First total the scores: scores.groupby("id", as_index=False)["score"].sum().','players.merge(totals, on="id", how="left") keeps every player; fillna({"score": 0}) fills the gaps.','Unknown ids: set(totals["id"]) - set(players["id"]), sorted. Print players sorted by name.',h49 + g49]},
  power:{can:['Join tables with merge and choose the right join type','Handle missing partners and duplicate keys'],
    expand:'Try how="outer" and indicator=True to label where each row came from.',
    where:'Customers + orders, users + events: real data always lives in several tables.',
    next:'Next: cleaning messy data.'},
  codex:{title:'merge',body:'a.merge(b, on="key", how="left|inner|outer"). Left join leaves NaN for no match: fillna. Aggregate the many-side first. Keys must have the same dtype. Set differences find orphans.',snip:R`players.merge(totals, on="id", how="left").fillna({"score": 0})`}
},
{
  id:'r12-50', realm:12, n:50, title:'Cleaning messy data',
  teaches:['pd-clean'], requires:['pd-merge'],
  story:`"Real data arrives filthy," says Orrin, shaking dust from a CSV. "Names with stray spaces. Ages that say 'abc'. Blanks. The same hero listed twice. Analysts spend most of their time here, so do it well."`,
  concept:{
    html:`The cleaning toolkit:\n\n\`\`\`\ndf = pd.read_csv(io.StringIO(text), dtype=str, skipinitialspace=True)   # read everything as text first\ndf["name"].fillna("").str.strip().str.title()      # text tidy-up: str.* works on a whole column\npd.to_numeric(df["age"], errors="coerce")           # "abc" -> NaN instead of an error\ndf["age"].median()                                  # statistics skip NaN\ndf["age"].fillna(median)                            # fill the gaps\ndf.drop_duplicates(subset="name", keep="first")     # remove repeats\ndf[df["name"] != ""]                                # drop unusable rows\ndf.isna().sum()                                     # how many missing per column\n\`\`\`\n\n- Read as **text** (\`dtype=str\`) first, then convert on purpose. Surprise guesses by \`read_csv\` hide problems.\n- \`errors="coerce"\` turns junk into NaN, so you can decide what to do with it.\n- **Order of operations matters**: compute the median *before* removing duplicates, or after? Decide, write it down, and keep it consistent.\n- \`io.StringIO(text)\` makes a string behave like a file; real code passes a file path.\n- Report what you dropped: silently losing rows is how analyses go wrong.`,
    analogy:`Washing vegetables before cooking: unglamorous, but nobody wants gravel in the soup.`,
    example:e50},
  predict:{code:R`import pandas as pd
print(pd.to_numeric(pd.Series(["1", "z"]), errors="coerce").isna().tolist())`, q:'What prints?', opts:['[False, True]','[True, False]','Error'], ans:0, why:'"z" cannot be a number, so it becomes NaN.'},
  cast:{code:e50, task:'Cast it.'},
  bug:{broken:R`import pandas as pd
print(pd.to_numeric(pd.Series(["12", "abc"])).tolist())`, task:'"abc" raises ValueError. Coerce bad values to NaN instead. Expected: [12.0, nan]',
    cases:[{inputs:[],tests:[['Works','lines==["[12.0, nan]"]'],['coerce','"coerce" in src']]}],
    sol:R`import pandas as pd
print(pd.to_numeric(pd.Series(["12", "abc"]), errors="coerce").tolist())`, wrong:[R`print("[12.0, nan]")`]},
  write:{prompt:'Ask `CSV: ` (lines separated by `;`, the first is the header `name,age,score`). Clean it: strip and Title-Case names; drop rows with a blank name; turn `age` and `score` into numbers (junk becomes missing); fill missing scores with 0; fill missing ages with the **median age rounded down** (0 if there are no valid ages), computed over the named rows **before** removing duplicates; drop duplicate names (keep the first). Print `Rows read: <n>`, `Rows kept: <m>`, `Median age: <x>`, then `<Name> <age> <score>` per row sorted by name (no trailing `.0`).',
    starter:R`import io
import pandas as pd

text = input("CSV: ").replace(";", "\n")
`,
    inputs:['name,age,score; ada ,30,90; BOB,abc,70;cy,,;  ,22,50;ADA,31,10;di,40,x'],
    cases:[{inputs:['name,age,score; ada ,30,90; BOB,abc,70;cy,,;  ,22,50;ADA,31,10;di,40,x'],tests:[['Messy file','lines[-7:]==["Rows read: 6","Rows kept: 4","Median age: 31","Ada 30 90","Bob 31 70","Cy 31 0","Di 40 0"]'],['Uses pandas','"read_csv" in src']]},{inputs:['name,age,score'],tests:[['Header only','lines[-3:]==["Rows read: 0","Rows kept: 0","Median age: 0"]']]},{inputs:['name,age,score;a,,5;b,,6'],tests:[['No valid ages','lines[-5:]==["Rows read: 2","Rows kept: 2","Median age: 0","A 0 5","B 0 6"]']]},{inputs:['name,age,score;x,20,1;y,31,2'],tests:[['Median rounded down','lines[-3:]==["Median age: 25","X 20 1","Y 31 2"]']]},{inputs:['name,age,score;zed,20,1;amy,30,2;Zed,40,3'],tests:[['Median before dedupe, first wins','lines[-3:]==["Median age: 30","Amy 30 2","Zed 20 1"]']]}],
    sol:s50,
    wrong:[s50.replace('.str.strip().str.title()','.str.title()'),s50.replace('errors="coerce")\ndf["score"]','errors="raise")\ndf["score"]'),s50.replace('keep="first"','keep="last"'),s50.replace('df = df.drop_duplicates(subset="name", keep="first").sort_values("name")','df = df.sort_values("name")'),s50.replace('median = df["age"].median()\nmedian = 0 if pd.isna(median) else int(median)\ndf["age"] = df["age"].fillna(median)\ndf = df.drop_duplicates(subset="name", keep="first").sort_values("name")','df = df.drop_duplicates(subset="name", keep="first").sort_values("name")\nmedian = df["age"].median()\nmedian = 0 if pd.isna(median) else int(median)\ndf["age"] = df["age"].fillna(median)')],
    hints:['read_csv(io.StringIO(text), dtype=str, skipinitialspace=True). Names: fillna("").str.strip().str.title(); drop rows where name == "".','pd.to_numeric(..., errors="coerce") for age and score; scores fillna(0); median = df["age"].median() (NaN if none -> 0), int() rounds down.','Fill ages with the median BEFORE drop_duplicates(subset="name", keep="first"); then sort by name and print with :g.',s50]},
  power:{can:['Clean text and numbers in a DataFrame','Handle missing values, junk and duplicates with explicit rules'],
    expand:'Report how many ages were filled and how many rows were dropped for each reason.',
    where:'Data cleaning is 80% of a data analyst\'s real job.',
    next:'Next: Real-World Mission: the Treasury Ledger.'},
  codex:{title:'Cleaning',body:'read_csv(dtype=str); str.strip().str.title(); to_numeric(errors="coerce"); median/fillna; drop_duplicates(subset, keep); isna().sum(). Order of steps changes results: decide and document.',snip:R`df["age"] = pd.to_numeric(df["age"], errors="coerce")`}
},
{
  id:'r12-51', realm:12, n:51, title:'Real-World Mission: The Treasury Ledger',
  teaches:['mission12g'], requires:['pd-clean'],
  story:`The Guild treasurer drops a file on your desk: **sales.csv**, a season of orders, some of them mangled. "By tomorrow's council I need the revenue, the best month, the top seller and each region's take," she says. "And tell me how many rows you had to throw away."`,
  concept:{
    html:`A complete small analysis: read, validate, derive, summarise.\n\n1. **Read** the file as text and **convert** the columns you need: \`qty\`, \`price\` to numbers (\`coerce\`), \`date\` with \`pd.to_datetime(errors="coerce", format="%Y-%m-%d")\`.\n2. **Validate**: a row is usable only if qty, price and date parsed and region and product are non-empty. Count the rest as *skipped*.\n3. **Derive**: \`revenue = qty * price\`; \`month = date.dt.strftime("%Y-%m")\`.\n4. **Summarise** with groupby: best month by revenue (ties: earliest), top product by units (ties: name A-Z), revenue per region (biggest first, ties by name).\n5. Format money with \`:.2f\`.\n\n- The \`.dt\` accessor exposes date parts of a datetime column (\`.dt.year\`, \`.dt.month\`, \`.dt.strftime(...)\`).\n- \`df.dropna(subset=[...])\` drops rows missing the **listed** columns only.\n- Always handle the **empty** case (\`valid.empty\`).\n- Keep each step small and check it; this is how real reports are built.`,
    analogy:`An accountant's workflow: clean the ledger, then add up in the ways the council wants.`,
    example:e51},
  predict:{code:R`import pandas as pd
print(pd.to_datetime("2026-03-05").strftime("%Y-%m"))`, q:'What prints?', opts:['2026-03','2026-3-5','03/2026'], ans:0, why:'strftime with %Y-%m formats the year and month.'},
  cast:{code:e51, task:'Cast it.'},
  bug:{broken:R`import pandas as pd
qty = pd.Series(["3"])
price = pd.Series(["2"])
print(int((qty * price)[0]))`, task:'Text columns cannot be multiplied. Convert them to numbers first. Expected: 6',
    cases:[{inputs:[],tests:[['Works','lines==["6"]'],['Converts','"to_numeric" in src or "astype" in src']]}],
    sol:R`import pandas as pd
qty = pd.to_numeric(pd.Series(["3"]))
price = pd.to_numeric(pd.Series(["2"]))
print(int((qty * price)[0]))`, wrong:[R`print(6)`]},
  write:{prompt:'Read `sales.csv` (`date,region,product,qty,price`). A row is **valid** when qty and price are numbers, the date parses as `YYYY-MM-DD`, and region and product are non-blank; skip the others. Print `Orders: <valid>` and `Skipped: <invalid>`; if none are valid print `No valid orders` and stop. Otherwise print `Revenue:` (sum of qty x price), `Average order:` (both with 2 decimals), `Best month: <YYYY-MM> (<revenue>)` (ties: earliest), `Top product: <name> (<units> units)` (most units, ties by name) and one `<region>: <revenue>` line per region, biggest first (ties by name).',
    starter:R`import pandas as pd

df = pd.read_csv("sales.csv", dtype=str, skipinitialspace=True)
`,
    inputs:[],
    cases:[{inputs:[],files:{'sales.csv':f51a},tests:[['Report','lines[-9:]==["Orders: 5","Skipped: 3","Revenue: 370.50","Average order: 74.10","Best month: 2026-03 (150.00)","Top product: Potion (10 units)","South: 190.50","North: 130.00","East: 50.00"]']]},{inputs:[],files:{'sales.csv':f51b},tests:[['Empty file','lines[-3:]==["Orders: 0","Skipped: 0","No valid orders"]']]},{inputs:[],files:{'sales.csv':f51c},tests:[['Ties','lines[-8:]==["Orders: 4","Skipped: 0","Revenue: 40.00","Average order: 10.00","Best month: 2026-01 (20.00)","Top product: Bolt (6 units)","A: 20.00","B: 20.00"]']]}],
    sol:s51,
    wrong:[s51.replace('valid = valid[(valid["region"] != "") & (valid["product"] != "")].copy()','valid = valid.copy()'),s51.replace('ascending=[False, True]','ascending=[True, True]'),s51.replace('dropna(subset=["qty", "price", "date"])','dropna(subset=["qty", "price"])'),s51.replace('valid["qty"] * valid["price"]','valid["qty"] + valid["price"]'),s51.replace('print("Skipped:", len(df) - len(valid))','print("Skipped:", int(df.isna().any(axis=1).sum()))'),s51.replace('.sort_values(["qty", "product"], ascending=[False, True])','.sort_values(["qty", "product"], ascending=[False, False])')],
    hints:['Convert: qty and price with pd.to_numeric(errors="coerce"); date with pd.to_datetime(errors="coerce", format="%Y-%m-%d"); strip region/product.','valid = df.dropna(subset=[...]) then remove blank region/product. Skipped = len(df) - len(valid).','revenue = qty * price; month = date.dt.strftime("%Y-%m"); three groupby summaries, each sorted with a tie-break.',s51]},
  power:{can:['Run a complete read-validate-derive-summarise analysis','Report data quality (skipped rows) alongside the results'],
    expand:'Export the region totals back to a file with `to_csv("regions.csv", index=False)`.',
    where:'This is the daily job of analysts at every company that has data.',
    next:'Next: SQL with sqlite3: asking databases questions.'},
  codex:{title:'Analysis pipeline',body:'read -> to_numeric/to_datetime(coerce) -> validate (dropna, blanks) -> derive columns -> groupby summaries with tie-breaks -> format. Count and report skipped rows. Handle the empty case.',snip:R`df["date"] = pd.to_datetime(df["date"], errors="coerce", format="%Y-%m-%d")
valid = df.dropna(subset=["qty", "price", "date"])`}
}
);
