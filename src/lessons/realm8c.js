// REALM 8 — THE ARCHIVE — part C (lessons 19-30: CSV)
LESSONS.push(
{
  id:'r8-19', realm:8, n:19, title:'CSV: the spreadsheet in a text file',
  teaches:['csv-reader'], requires:['file-config'],
  story:`Orrin leads you to a vault of ledgers: rows and columns of figures, commas between them. "**CSV**: comma-separated values. Every spreadsheet on Earth can export one. Read it well and you can read *anything* a company keeps."`,
  concept:{
    html:`A CSV file is plain text: one **row** per line, **columns** separated by commas:\n\n\`\`\`\nAda,Oslo,30\nBo,Rome,25\n\`\`\`\n\nUse the \`csv\` module (don't just \`split(",")\`, because a field can itself contain a comma, like \`"Smith, Jo"\`):\n\n\`\`\`\nimport csv\n\nwith open("people.csv", newline="") as f:\n    for row in csv.reader(f):\n        print(row)          # ['Ada', 'Oslo', '30']\n\`\`\`\n\n- Each \`row\` is a **list of strings**.\n- Open with \`newline=""\`: the csv module handles line endings itself.\n- A blank line gives an **empty list** \`[]\`, so \`row[0]\` would crash. Check \`if not row: continue\`.`,
    analogy:`An unrolled spreadsheet: lines are rows, commas are the column walls.`,
    example:R`import csv

with open("people.csv", newline="") as f:
    for row in csv.reader(f):
        print(row)`},
  predict:{code:R`import csv
rows = list(csv.reader(['a,"b,c",d']))
print(len(rows[0]))`, q:'How many fields are in the row?', opts:['3','4','2'], ans:0, why:'The comma inside the quotes belongs to the field "b,c".'},
  cast:{code:R`import csv

with open("people.csv", newline="") as f:
    for row in csv.reader(f):
        print(row)`, task:'Cast it.', files:{'people.csv':'Ada,Oslo,30\nBo,Rome,25\n'}},
  bug:{broken:R`import csv
with open("people.csv", newline="") as f:
    for row in csv.reader(f):
        print(row[0])`, task:'IndexError: there is a blank line in the file, which gives an empty row. Skip empty rows.',
    files:{'people.csv':'Ada,Oslo,30\n\nBo,Rome,25\n'},
    cases:[{inputs:[],tests:[['Names','lines==["Ada","Bo"]']]}],
    sol:R`import csv
with open("people.csv", newline="") as f:
    for row in csv.reader(f):
        if not row:
            continue
        print(row[0])`, wrong:[R`import csv
with open("people.csv", newline="") as f:
    for row in csv.reader(f):
        print(row[0])`]},
  write:{prompt:'`people.csv` has no header: `name,city,age`. Print `<name> lives in <city>` for every row. Skip blank lines.',
    starter:R`import csv
`,
    files:{'people.csv':'Ada,Oslo,30\n"Smith, Jo",Rome,40\n\nBo,Lima,25\n'},
    cases:[{inputs:[],files:{'people.csv':'Ada,Oslo,30\n"Smith, Jo",Rome,40\n\nBo,Lima,25\n'},tests:[['Rows','lines==["Ada lives in Oslo","Smith, Jo lives in Rome","Bo lives in Lima"]']]},{inputs:[],files:{'people.csv':'Cy,Pune,9'},tests:[['No final newline','lines==["Cy lives in Pune"]']]},{inputs:[],files:{'people.csv':''},tests:[['Empty file','lines==[]'],['Uses csv','"csv.reader" in src']]}],
    sol:R`import csv

with open("people.csv", newline="") as f:
    for row in csv.reader(f):
        if not row:
            continue
        print(f"{row[0]} lives in {row[1]}")`,
    wrong:[R`with open("people.csv") as f:
    for line in f:
        parts = line.strip().split(",")
        if len(parts) < 2:
            continue
        print(f"{parts[0]} lives in {parts[1]}")`, R`import csv

with open("people.csv", newline="") as f:
    for row in csv.reader(f):
        print(f"{row[0]} lives in {row[1]}")`],
    hints:['import csv, then for row in csv.reader(f): inside a with open(..., newline="").','Skip rows that are empty lists: if not row: continue.','row[0] is the name and row[1] the city.','import csv\n\nwith open("people.csv", newline="") as f:\n    for row in csv.reader(f):\n        if not row:\n            continue\n        print(f"{row[0]} lives in {row[1]}")']},
  power:{can:['Read a CSV file row by row','Handle quoted commas and blank lines'],
    expand:'Print only the rows where the age is over 28 (convert it with int).',
    where:'Bank exports, spreadsheets, survey tools and analytics all give you CSV.',
    next:'Next: using the header row.'},
  codex:{title:'csv.reader',body:'import csv; for row in csv.reader(f): row is a list of strings. Open with newline="". Skip empty rows.',snip:R`for row in csv.reader(f):
    if not row: continue`}
},
{
  id:'r8-20', realm:8, n:20, title:'Header rows and column positions',
  teaches:['csv-header'], requires:['csv-reader'],
  story:`"The first row of most ledgers isn't data," Orrin says. "It's the **labels**. Use it: find the column by name, not by guessing a number."`,
  concept:{
    html:`Most CSV files start with a **header row** naming the columns:\n\n\`\`\`\nname,score,team\nAda,90,red\n\`\`\`\n\nPull the header off with \`next(reader)\`, then look up a column's position:\n\n\`\`\`\nreader = csv.reader(f)\nheader = next(reader)           # ['name', 'score', 'team']\nindex = header.index("score")   # 1\nfor row in reader:\n    print(row[index])\n\`\`\`\n\n- \`next(reader)\` takes **one** row and moves on.\n- \`header.index("x")\` raises \`ValueError\` if the column is missing: check \`"x" in header\` first.\n- Column positions can change when someone re-exports the file; names are safer than numbers.`,
    analogy:`Reading the labels at the top of each shelf before looking inside.`,
    example:R`import csv

with open("scores.csv", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    print(header)
    print(header.index("score"))`},
  predict:{code:R`import csv
reader = csv.reader(["a,b", "1,2", "3,4"])
next(reader)
print(next(reader))`, q:'What prints?', opts:["['1', '2']","['a', 'b']","['3', '4']"], ans:0, why:'The first next() consumed the header; the second gives the first data row.'},
  cast:{code:R`import csv

with open("scores.csv", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    print(header)
    print(header.index("score"))`, task:'Cast it.', files:{'scores.csv':'name,score,team\nAda,90,red\nBo,75,blue\n'}},
  bug:{broken:R`import csv
with open("scores.csv", newline="") as f:
    for row in csv.reader(f):
        print(row[1])`, task:'It prints the word score as if it were data. Skip the header row.',
    files:{'scores.csv':'name,score\nAda,90\nBo,75\n'},
    cases:[{inputs:[],tests:[['Only data','lines==["90","75"]']]}],
    sol:R`import csv
with open("scores.csv", newline="") as f:
    reader = csv.reader(f)
    next(reader)
    for row in reader:
        print(row[1])`, wrong:[R`import csv
with open("scores.csv", newline="") as f:
    for row in csv.reader(f):
        print(row[1])`]},
  write:{prompt:'Ask `Column: `. Print every value in that column of `scores.csv` (which has a header row), one per line. If the column does not exist, print `No such column: <name>`.',
    starter:R`import csv
column = input("Column: ")
`,
    inputs:['score'],
    files:{'scores.csv':'name,score,team\nAda,90,red\nBo,75,blue\n'},
    cases:[{inputs:['score'],files:{'scores.csv':'name,score,team\nAda,90,red\nBo,75,blue\n'},tests:[['Score','[l for l in lines if l!="Column: score"]==["90","75"]']]},{inputs:['team'],files:{'scores.csv':'name,score,team\nAda,90,red\nBo,75,blue\n'},tests:[['Team','[l for l in lines if l!="Column: team"]==["red","blue"]']]},{inputs:['name'],files:{'scores.csv':'score,name\n1,Zed\n2,Yan\n'},tests:[['Moved column','[l for l in lines if l!="Column: name"]==["Zed","Yan"]']]},{inputs:['age'],files:{'scores.csv':'name,score\nA,1\n'},tests:[['Missing','lines[-1]=="No such column: age"']]},{inputs:['name'],files:{'scores.csv':'name,score\n'},tests:[['Header only','[l for l in lines if l!="Column: name"]==[]']]},{inputs:['score'],files:{'scores.csv':'name,score\nA,1\n\nB,2\n'},tests:[['Blank row','[l for l in lines if l!="Column: score"]==["1","2"]']]}],
    sol:R`import csv
column = input("Column: ")
with open("scores.csv", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    if column not in header:
        print("No such column:", column)
    else:
        index = header.index(column)
        for row in reader:
            if row:
                print(row[index])`,
    wrong:[R`import csv
column = input("Column: ")
with open("scores.csv", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    if column not in header:
        print("No such column:", column)
    else:
        for row in reader:
            if row:
                print(row[1])`, R`import csv
column = input("Column: ")
with open("scores.csv", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    index = header.index(column)
    for row in reader:
        if row:
            print(row[index])`],
    hints:['header = next(reader), then column not in header means the column is missing.','index = header.index(column) gives its position.','Loop the remaining rows, skip empty ones, print row[index].','import csv\ncolumn = input("Column: ")\nwith open("scores.csv", newline="") as f:\n    reader = csv.reader(f)\n    header = next(reader)\n    if column not in header:\n        print("No such column:", column)\n    else:\n        index = header.index(column)\n        for row in reader:\n            if row:\n                print(row[index])']},
  power:{can:['Separate the header from the data','Look up a column by name'],
    expand:'Print the header names numbered, then let the user pick one.',
    where:'Importers must survive re-exported files whose columns have moved.',
    next:'Next: DictReader, rows as dictionaries.'},
  codex:{title:'Headers',body:'header = next(reader). header.index(name) gives the column position. Check membership first.',snip:R`header = next(reader)
i = header.index("score")`}
},
{
  id:'r8-21', realm:8, n:21, title:'DictReader: rows with names',
  teaches:['csv-dictreader'], requires:['csv-header'],
  story:`"Counting columns on your fingers is how errors are born," Orrin says. "Let each row **carry its own labels**."`,
  concept:{
    html:`\`csv.DictReader\` uses the header for you: each row is a **dict**.\n\n\`\`\`\nimport csv\n\nwith open("scores.csv", newline="") as f:\n    for row in csv.DictReader(f):\n        print(row["name"], row["score"])\n\`\`\`\n\n- No index numbers: \`row["score"]\` works even if the columns are reordered.\n- Values are still **strings**.\n- Completely blank lines are skipped automatically.\n- A missing column raises \`KeyError\`. A row with too few fields gives \`None\` for the missing ones.\n- \`reader.fieldnames\` lists the header names.\n\nThis is the version you will use most.`,
    analogy:`Name tags on every column, so nobody has to count.`,
    example:R`import csv

with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        print(row["name"], row["score"])`},
  predict:{code:R`import csv
rows = list(csv.DictReader(["a,b", "1,2"]))
print(rows[0]["b"])`, q:'What prints?', opts:['2','b','1'], ans:0, why:'The row is {"a": "1", "b": "2"}.'},
  cast:{code:R`import csv

with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        print(row["name"], row["score"])`, task:'Cast it.', files:{'scores.csv':'name,score\nAda,90\nBo,75\n'}},
  bug:{broken:R`import csv
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        print(row[0], row[1])`, task:'KeyError: 0. Rows are dicts: use the column names name and score.',
    files:{'scores.csv':'name,score\nAda,90\n'},
    cases:[{inputs:[],tests:[['Names used','lines==["Ada 90"]']]}],
    sol:R`import csv
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        print(row["name"], row["score"])`, wrong:[R`import csv
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        print(row[0], row[1])`]},
  write:{prompt:'`scores.csv` has columns `name` and `score` (in **any order**). Print each row as `<name>: <score>`, then `Players: <n>`.',
    starter:R`import csv
`,
    files:{'scores.csv':'name,score\nAda,90\nBo,75\n'},
    cases:[{inputs:[],files:{'scores.csv':'name,score\nAda,90\nBo,75\n'},tests:[['Rows','lines==["Ada: 90","Bo: 75","Players: 2"]']]},{inputs:[],files:{'scores.csv':'score,name\n80,Cy\n60,Di\n'},tests:[['Swapped columns','lines==["Cy: 80","Di: 60","Players: 2"]']]},{inputs:[],files:{'scores.csv':'id,name,note,score\n1,Ed,hi,5\n\n2,Flo,yo,6\n'},tests:[['Extra columns and a blank line','lines==["Ed: 5","Flo: 6","Players: 2"]']]},{inputs:[],files:{'scores.csv':'name,score\n'},tests:[['No players','lines==["Players: 0"]'],['Uses DictReader','"DictReader" in src']]}],
    sol:R`import csv

count = 0
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        print(f"{row['name']}: {row['score']}")
        count += 1
print("Players:", count)`,
    wrong:[R`import csv

count = 0
with open("scores.csv", newline="") as f:
    for row in csv.reader(f):
        if row[0] == "name":
            continue
        print(f"{row[0]}: {row[1]}")
        count += 1
print("Players:", count)`, R`import csv

count = 0
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        print(f"{row['name']}: {row['score']}")
        count += 1
print("Players:", count + 1)`],
    hints:['csv.DictReader(f) gives dict rows.','Use row["name"] and row["score"]. In an f-string with double quotes outside, use single quotes inside the brackets.','Count rows as you print them.','import csv\n\ncount = 0\nwith open("scores.csv", newline="") as f:\n    for row in csv.DictReader(f):\n        print(f"{row[\'name\']}: {row[\'score\']}")\n        count += 1\nprint("Players:", count)']},
  power:{can:['Read CSV rows as dictionaries','Ignore column order and extra columns'],
    expand:'Print the field names with reader.fieldnames before the rows.',
    where:'pandas, databases and APIs all give you rows keyed by column name.',
    next:'Next: turning text columns into numbers.'},
  codex:{title:'DictReader',body:'for row in csv.DictReader(f): row["column"]. Values are strings. Order of columns does not matter.',snip:R`for row in csv.DictReader(f):
    print(row["name"])`}
},
{
  id:'r8-22', realm:8, n:22, title:'Numbers from CSV columns',
  teaches:['csv-types'], requires:['csv-dictreader'],
  story:`"A price of 12.50 in a ledger is only ink until you tell Python it's a **number**," Orrin says. "Everything in CSV arrives as text."`,
  concept:{
    html:`CSV values are **always strings**. Convert them before doing maths:\n\n\`\`\`\nunits = int(row["units"])\nprice = float(row["price"])\nrevenue += units * price\n\`\`\`\n\n- \`int("3")\` is 3 but \`int("12.50")\` is a **ValueError**. Use \`float\` for decimals.\n- Adding strings glues them: \`"3" + "2"\` is \`"32"\`.\n- Format money at the **end**: \`f"{revenue:.2f}"\`. Don't round in the middle.\n- Empty files with only a header must still give \`0\` rather than crash.`,
    analogy:`Ink on a ledger vs coins in a purse.`,
    example:R`import csv

units = 0
revenue = 0
for row in csv.DictReader(["item,units,price", "lamp,3,12.50"]):
    units += int(row["units"])
    revenue += int(row["units"]) * float(row["price"])
print(units, revenue)`},
  predict:{code:R`print("3" + "2", int("3") + int("2"))`, q:'What prints?', opts:['32 5','5 5','32 32'], ans:0, why:'Strings concatenate; integers add.'},
  cast:{code:R`import csv

units = 0
revenue = 0
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        units += int(row["units"])
        revenue += int(row["units"]) * float(row["price"])
print("Units:", units)
print(f"Revenue: {revenue:.2f}")`, task:'Cast it.', files:{'sales.csv':'item,units,price\nlamp,3,12.50\nbook,2,20\n'}},
  bug:{broken:R`import csv
total = 0
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        total += int(row["price"])
print(total)`, task:'ValueError: 12.50 is not a whole number. Use the right conversion. Expected: 32.5',
    files:{'sales.csv':'item,units,price\nlamp,3,12.50\nbook,2,20\n'},
    cases:[{inputs:[],tests:[['Total','lines==["32.5"]']]}],
    sol:R`import csv
total = 0
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        total += float(row["price"])
print(total)`, wrong:[R`import csv
total = 0
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        total += int(row["price"])
print(total)`]},
  write:{prompt:'`sales.csv` has `item,units,price`. Print `Units: <total units>` and `Revenue: <sum of units × price>` with 2 decimals.',
    starter:R`import csv
`,
    files:{'sales.csv':'item,units,price\nlamp,3,12.50\nbook,2,20\n'},
    cases:[{inputs:[],files:{'sales.csv':'item,units,price\nlamp,3,12.50\nbook,2,20\n'},tests:[['Totals','lines==["Units: 5","Revenue: 77.50"]']]},{inputs:[],files:{'sales.csv':'item,units,price\nink,10,0.1\n'},tests:[['Small price','lines==["Units: 10","Revenue: 1.00"]']]},{inputs:[],files:{'sales.csv':'item,units,price\n'},tests:[['Header only','lines==["Units: 0","Revenue: 0.00"]']]},{inputs:[],files:{'sales.csv':'item,units,price\nq,1,5\nq,2,5\nq,3,5\n'},tests:[['Three rows','lines==["Units: 6","Revenue: 30.00"]']]}],
    sol:R`import csv

units = 0
revenue = 0
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        u = int(row["units"])
        units += u
        revenue += u * float(row["price"])
print("Units:", units)
print(f"Revenue: {revenue:.2f}")`,
    wrong:[R`import csv

units = 0
revenue = 0
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        units += 1
        revenue += float(row["price"])
print("Units:", units)
print(f"Revenue: {revenue:.2f}")`, R`import csv

units = 0
revenue = 0
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        u = int(row["units"])
        units += u
        revenue = u * float(row["price"])
print("Units:", units)
print(f"Revenue: {revenue:.2f}")`],
    hints:['Start units and revenue at 0.','Inside the loop: u = int(row["units"]); units += u; revenue += u * float(row["price"]).','Format revenue with :.2f at the end.','import csv\n\nunits = 0\nrevenue = 0\nwith open("sales.csv", newline="") as f:\n    for row in csv.DictReader(f):\n        u = int(row["units"])\n        units += u\n        revenue += u * float(row["price"])\nprint("Units:", units)\nprint(f"Revenue: {revenue:.2f}")']},
  power:{can:['Convert CSV text to int and float','Compute totals from real columns'],
    expand:'Also print the average price per unit.',
    where:'Every report, invoice and chart starts by turning text columns into numbers.',
    next:'Next: filtering rows.'},
  codex:{title:'CSV types',body:'Everything from csv is a string. int() for whole numbers, float() for decimals. Format at the end.',snip:R`revenue += int(row["units"]) * float(row["price"])`}
},
{
  id:'r8-23', realm:8, n:23, title:'Filtering rows',
  teaches:['csv-filter'], requires:['csv-types'],
  story:`"The whole ledger is too much," says a clerk. "Just show me **North**." Orrin nods. "Filtering: keep the rows that match, forget the rest."`,
  concept:{
    html:`Filter while you loop:\n\n\`\`\`\nwanted = input("Region: ").strip().lower()\nmatches = 0\nfor row in csv.DictReader(f):\n    if row["region"].strip().lower() == wanted:\n        print(row["item"], "x" + row["units"])\n        matches += 1\nif matches == 0:\n    print("No sales in", region)\n\`\`\`\n\n- Compare in **lower case** (and stripped) so "north", "North" and " NORTH " match.\n- Keep a count so you can tell the user when nothing matched.\n- You can also collect matches into a **list of dicts** for later use.`,
    analogy:`A sieve for rows.`,
    example:R`rows = [{"region": "North", "item": "lamp"}, {"region": "South", "item": "book"}]
print([r["item"] for r in rows if r["region"].lower() == "north"])`},
  predict:{code:R`rows = [{"n": 1}, {"n": 5}, {"n": 9}]
print(len([r for r in rows if r["n"] > 2]))`, q:'What prints?', opts:['2','3','1'], ans:0, why:'5 and 9 pass the filter.'},
  cast:{code:R`import csv

with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        if row["region"] == "North":
            print(row["item"], row["units"])`, task:'Cast it.', files:{'sales.csv':'region,item,units\nNorth,lamp,3\nSouth,book,2\nNorth,quill,10\n'}},
  bug:{broken:R`import csv
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        if row["region"] == "north":
            print(row["item"])`, task:'Nothing prints: the file says North with a capital N. Make the comparison ignore case.',
    files:{'sales.csv':'region,item,units\nNorth,lamp,3\nSouth,book,2\n'},
    cases:[{inputs:[],tests:[['Found','lines==["lamp"]']]}],
    sol:R`import csv
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        if row["region"].lower() == "north":
            print(row["item"])`, wrong:[R`import csv
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        if row["region"] == "north":
            print(row["item"])`]},
  write:{prompt:'Ask `Region: `. From `sales.csv` (`region,item,units`) print each sale in that region (ignoring case and spaces) as `<item> x<units>`, then `Rows: <n>`. If nothing matches print `No sales in <region as typed>`.',
    starter:R`import csv
region = input("Region: ")
`,
    inputs:['north'],
    files:{'sales.csv':'region,item,units\nNorth,lamp,3\nSouth,book,2\nnorth ,quill,10\n'},
    cases:[{inputs:['north'],files:{'sales.csv':'region,item,units\nNorth,lamp,3\nSouth,book,2\nnorth ,quill,10\n'},tests:[['Matches','lines[1:]==["lamp x3","quill x10","Rows: 2"]']]},{inputs:['SOUTH'],files:{'sales.csv':'region,item,units\nNorth,lamp,3\nSouth,book,2\n'},tests:[['Upper-case input','lines[1:]==["book x2","Rows: 1"]']]},{inputs:['West'],files:{'sales.csv':'region,item,units\nNorth,lamp,3\n'},tests:[['None','lines[1:]==["No sales in West"]']]},{inputs:['north'],files:{'sales.csv':'region,item,units\nNortheast,ink,9\nNorth,lamp,1\n'},tests:[['Whole name only','lines[1:]==["lamp x1","Rows: 1"]']]},{inputs:['  east '],files:{'sales.csv':'region,item,units\nEast,ink,4\n'},tests:[['Spaces in input','lines[1:]==["ink x4","Rows: 1"]']]}],
    sol:R`import csv
region = input("Region: ")
wanted = region.strip().lower()
matches = 0
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        if row["region"].strip().lower() == wanted:
            print(f"{row['item']} x{row['units']}")
            matches += 1
if matches == 0:
    print("No sales in", region)
else:
    print("Rows:", matches)`,
    wrong:[R`import csv
region = input("Region: ")
matches = 0
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        if row["region"] == region:
            print(f"{row['item']} x{row['units']}")
            matches += 1
if matches == 0:
    print("No sales in", region)
else:
    print("Rows:", matches)`, R`import csv
region = input("Region: ")
wanted = region.strip().lower()
matches = 0
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        if wanted in row["region"].lower():
            print(f"{row['item']} x{row['units']}")
            matches += 1
if matches == 0:
    print("No sales in", region)
else:
    print("Rows:", matches)`],
    hints:['Normalise both sides: strip() and lower().','Count matches; print the sale as an f-string.','After the loop: no matches → the No sales message, else the Rows line.','import csv\nregion = input("Region: ")\nwanted = region.strip().lower()\nmatches = 0\nwith open("sales.csv", newline="") as f:\n    for row in csv.DictReader(f):\n        if row["region"].strip().lower() == wanted:\n            print(f"{row[\'item\']} x{row[\'units\']}")\n            matches += 1\nif matches == 0:\n    print("No sales in", region)\nelse:\n    print("Rows:", matches)']},
  power:{can:['Filter CSV rows by a column value','Match text without caring about case or spaces'],
    expand:'Let the user filter by a minimum units number too.',
    where:'Dashboards and reports are filters on bigger tables.',
    next:'Next: totals per group.'},
  codex:{title:'Filtering',body:'if row["col"].strip().lower() == wanted: keep it. Count matches so you can say "none".',snip:R`if row["region"].lower() == wanted:`}
},
{
  id:'r8-24', realm:8, n:24, title:'Totals per group',
  teaches:['csv-group'], requires:['csv-filter','dict-count'],
  story:`"One number is nice," Orrin says. "But the baker wants **a number for each region**. Group the rows and add them up."`,
  concept:{
    html:`A dict is the tool for grouping: key = the group, value = the running total.\n\n\`\`\`\ntotals = {}\nfor row in csv.DictReader(f):\n    region = row["region"]\n    amount = int(row["units"]) * float(row["price"])\n    totals[region] = totals.get(region, 0) + amount\n\nfor region in sorted(totals):\n    print(f"{region}: {totals[region]:.2f}")\n\`\`\`\n\n- \`totals.get(region, 0) + amount\` starts a new group at 0 the first time.\n- \`sorted(totals)\` gives alphabetical order. A plain \`for\` uses **insertion order**, which is just the order they first appeared.\n- This is the pattern behind a spreadsheet's **pivot table**.`,
    analogy:`Sorting coins into jars, one jar per region.`,
    example:R`totals = {}
for region, amount in [("N", 5), ("S", 2), ("N", 1)]:
    totals[region] = totals.get(region, 0) + amount
print(totals)`},
  predict:{code:R`t = {}
for k in "abab":
    t[k] = t.get(k, 0) + 1
print(t)`, q:'What prints?', opts:["{'a': 2, 'b': 2}","{'a': 1, 'b': 1}","{'a': 4}"], ans:0, why:'Each letter appears twice.'},
  cast:{code:R`import csv

totals = {}
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        amount = int(row["units"]) * float(row["price"])
        totals[row["region"]] = totals.get(row["region"], 0) + amount

for region in sorted(totals):
    print(f"{region}: {totals[region]:.2f}")`, task:'Cast it.', files:{'sales.csv':'region,units,price\nSouth,2,20\nNorth,3,10\nNorth,1,5\n'}},
  bug:{broken:R`import csv
totals = {}
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        totals[row["region"]] = int(row["units"])
print(totals)`, task:'Each row replaces the last one instead of adding to it. North should be 4. Add to the running total.',
    files:{'sales.csv':'region,units\nNorth,3\nNorth,1\n'},
    cases:[{inputs:[],tests:[['Accumulated','lines==["{\'North\': 4}"]']]}],
    sol:R`import csv
totals = {}
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        totals[row["region"]] = totals.get(row["region"], 0) + int(row["units"])
print(totals)`, wrong:[R`import csv
totals = {}
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        totals[row["region"]] = int(row["units"])
print(totals)`]},
  write:{prompt:'From `sales.csv` (`region,units,price`) print revenue per region as `<region>: <revenue>` (2 decimals), **alphabetically by region**. Then print `Total: <all revenue>`.',
    starter:R`import csv
`,
    files:{'sales.csv':'region,units,price\nSouth,2,20\nNorth,3,10\nNorth,1,5\n'},
    cases:[{inputs:[],files:{'sales.csv':'region,units,price\nSouth,2,20\nNorth,3,10\nNorth,1,5\n'},tests:[['Groups','lines==["North: 35.00","South: 40.00","Total: 75.00"]']]},{inputs:[],files:{'sales.csv':'region,units,price\nEast,1,1.5\n'},tests:[['One region','lines==["East: 1.50","Total: 1.50"]']]},{inputs:[],files:{'sales.csv':'region,units,price\n'},tests:[['Empty','lines==["Total: 0.00"]']]},{inputs:[],files:{'sales.csv':'region,units,price\nb,1,1\na,1,2\nb,1,3\nc,2,2\n'},tests:[['Sorted keys','lines==["a: 2.00","b: 4.00","c: 4.00","Total: 10.00"]']]}],
    sol:R`import csv

totals = {}
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        amount = int(row["units"]) * float(row["price"])
        totals[row["region"]] = totals.get(row["region"], 0) + amount

for region in sorted(totals):
    print(f"{region}: {totals[region]:.2f}")
print(f"Total: {sum(totals.values()):.2f}")`,
    wrong:[R`import csv

totals = {}
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        amount = int(row["units"]) * float(row["price"])
        totals[row["region"]] = totals.get(row["region"], 0) + amount

for region in totals:
    print(f"{region}: {totals[region]:.2f}")
print(f"Total: {sum(totals.values()):.2f}")`, R`import csv

totals = {}
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        amount = int(row["units"]) * float(row["price"])
        totals[row["region"]] = amount

for region in sorted(totals):
    print(f"{region}: {totals[region]:.2f}")
print(f"Total: {sum(totals.values()):.2f}")`],
    hints:['Use a dict: totals[region] = totals.get(region, 0) + amount.','amount = int(units) * float(price) for each row.','Loop sorted(totals); the grand total is sum(totals.values()).','import csv\n\ntotals = {}\nwith open("sales.csv", newline="") as f:\n    for row in csv.DictReader(f):\n        amount = int(row["units"]) * float(row["price"])\n        totals[row["region"]] = totals.get(row["region"], 0) + amount\n\nfor region in sorted(totals):\n    print(f"{region}: {totals[region]:.2f}")\nprint(f"Total: {sum(totals.values()):.2f}")']},
  power:{can:['Group rows and total each group','Build a pivot-table style report'],
    expand:'Also count the number of sales per region.',
    where:'"Revenue by region" is the most common business report there is.',
    next:'Next: sorting and ranking rows.'},
  codex:{title:'Group totals',body:'totals[key] = totals.get(key, 0) + amount. Loop sorted(totals) for a stable order.',snip:R`totals[k] = totals.get(k, 0) + amount`}
},
{
  id:'r8-25', realm:8, n:25, title:'Ranking: the top three',
  teaches:['csv-sort'], requires:['csv-group','sort-key'],
  story:`"Which three items earn the most?" the baker asks. Orrin hands you a quill. "Rank them. And when two tie, be **fair**: alphabetical."`,
  concept:{
    html:`Build a list of rows, then sort it with a **key** (you know this from Realm 4):\n\n\`\`\`\nrows = []\nfor row in csv.DictReader(f):\n    revenue = int(row["units"]) * float(row["price"])\n    rows.append((row["item"], revenue))\n\nrows.sort(key=lambda r: (-r[1], r[0]))     # highest revenue first, then A-Z\nfor rank, (item, revenue) in enumerate(rows[:3], 1):\n    print(f"{rank}. {item} ({revenue:.2f})")\n\`\`\`\n\n- Sorting by \`(-revenue, name)\` gives *descending revenue* with *ascending name* for ties.\n- \`rows[:3]\` takes the first three (fewer if there are fewer).\n- \`reverse=True\` alone keeps tied items in **file order**, which is not fair or predictable.`,
    analogy:`A leaderboard with a polite tiebreak.`,
    example:R`rows = [("lamp", 30.0), ("ink", 40.0), ("book", 40.0)]
rows.sort(key=lambda r: (-r[1], r[0]))
print(rows)`},
  predict:{code:R`rows = [("b", 5), ("a", 5), ("c", 9)]
rows.sort(key=lambda r: (-r[1], r[0]))
print(rows[0][0], rows[1][0])`, q:'What prints?', opts:['c a','c b','a b'], ans:0, why:'c has the highest score; a and b tie, and a comes first alphabetically.'},
  cast:{code:R`rows = [("lamp", 30.0), ("ink", 40.0), ("book", 40.0)]
rows.sort(key=lambda r: (-r[1], r[0]))
for rank, (item, revenue) in enumerate(rows[:3], 1):
    print(f"{rank}. {item} ({revenue:.2f})")`, task:'Cast it.'},
  bug:{broken:R`rows = [("ink", 40.0), ("book", 40.0), ("lamp", 30.0)]
rows.sort(key=lambda r: r[1], reverse=True)
print(rows[0][0])`, task:'On a tie, the first-listed wins (ink). The fair answer is alphabetical: book. Sort by revenue (descending) then name.',
    cases:[{inputs:[],tests:[['Fair tie','lines==["book"]']]}],
    sol:R`rows = [("ink", 40.0), ("book", 40.0), ("lamp", 30.0)]
rows.sort(key=lambda r: (-r[1], r[0]))
print(rows[0][0])`, wrong:[R`rows = [("ink", 40.0), ("book", 40.0), ("lamp", 30.0)]
rows.sort(key=lambda r: r[1], reverse=True)
print(rows[0][0])`]},
  write:{prompt:'From `sales.csv` (`item,units,price`) print the **top 3 items by revenue** (units × price) as `<rank>. <item> (<revenue>)` with 2 decimals. Break ties alphabetically. If the file has fewer than 3 items, print what there is.',
    starter:R`import csv
`,
    files:{'sales.csv':'item,units,price\nlamp,3,10\nink,4,10\nquill,10,1\nbook,2,20\n'},
    cases:[{inputs:[],files:{'sales.csv':'item,units,price\nlamp,3,10\nink,4,10\nquill,10,1\nbook,2,20\n'},tests:[['Top three','lines==["1. book (40.00)","2. ink (40.00)","3. lamp (30.00)"]']]},{inputs:[],files:{'sales.csv':'item,units,price\nx,1,5\n'},tests:[['One item','lines==["1. x (5.00)"]']]},{inputs:[],files:{'sales.csv':'item,units,price\n'},tests:[['No items','lines==[]']]},{inputs:[],files:{'sales.csv':'item,units,price\na,1,1\nb,1,2\nc,1,3\nd,1,4\ne,1,5\n'},tests:[['Five items','lines==["1. e (5.00)","2. d (4.00)","3. c (3.00)"]']]}],
    sol:R`import csv

rows = []
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        rows.append((row["item"], int(row["units"]) * float(row["price"])))

rows.sort(key=lambda r: (-r[1], r[0]))
for rank, (item, revenue) in enumerate(rows[:3], 1):
    print(f"{rank}. {item} ({revenue:.2f})")`,
    wrong:[R`import csv

rows = []
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        rows.append((row["item"], int(row["units"]) * float(row["price"])))

rows.sort(key=lambda r: r[1], reverse=True)
for rank, (item, revenue) in enumerate(rows[:3], 1):
    print(f"{rank}. {item} ({revenue:.2f})")`, R`import csv

rows = []
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        rows.append((row["item"], int(row["units"]) * float(row["price"])))

rows.sort(key=lambda r: (-r[1], r[0]))
for rank, (item, revenue) in enumerate(rows, 1):
    print(f"{rank}. {item} ({revenue:.2f})")`],
    hints:['Collect (item, revenue) tuples in a list.','rows.sort(key=lambda r: (-r[1], r[0])).','Use enumerate(rows[:3], 1) to number the top three.','import csv\n\nrows = []\nwith open("sales.csv", newline="") as f:\n    for row in csv.DictReader(f):\n        rows.append((row["item"], int(row["units"]) * float(row["price"])))\n\nrows.sort(key=lambda r: (-r[1], r[0]))\nfor rank, (item, revenue) in enumerate(rows[:3], 1):\n    print(f"{rank}. {item} ({revenue:.2f})")']},
  power:{can:['Rank rows by a computed value','Break ties fairly with a tuple key'],
    expand:'Print the bottom 3 as well.',
    where:'Leaderboards, "best sellers" and "top customers" are all sort-and-slice.',
    next:'Next: writing CSV files.'},
  codex:{title:'Ranking',body:'sort(key=lambda r: (-score, name)) then slice [:n]. reverse=True alone leaves ties in file order.',snip:R`rows.sort(key=lambda r: (-r[1], r[0]))`}
},
{
  id:'r8-26', realm:8, n:26, title:'Writing CSV files',
  teaches:['csv-writer'], requires:['csv-sort'],
  story:`"Reading is half," Orrin says, presenting a blank ledger. "Now **write** one other programs can read. And do not glue commas by hand: names *contain* commas."`,
  concept:{
    html:`\`csv.writer\` writes rows and quotes fields **when needed**:\n\n\`\`\`\nimport csv\n\nwith open("names.csv", "w", newline="") as f:\n    writer = csv.writer(f)\n    writer.writerow(["id", "name"])         # one row\n    writer.writerow([1, "Smith, Jo"])       # -> 1,"Smith, Jo"\n    writer.writerows([[2, "Bo"], [3, "Cy"]])  # many rows\n\`\`\`\n\n- Always open with \`newline=""\` when writing too.\n- Numbers are converted to text for you.\n- Doing \`f"{id},{name}\\n"\` yourself **breaks** on a name containing a comma or a quote; \`csv.writer\` adds the quotes.`,
    analogy:`A careful typist who adds the quote marks whenever a cell needs them.`,
    example:R`import csv

with open("names.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["id", "name"])
    writer.writerow([1, "Smith, Jo"])

print(open("names.csv").read())`},
  predict:{code:R`import csv, io
buf = io.StringIO()
csv.writer(buf, lineterminator="\n").writerow(["a", "b,c"])
print(buf.getvalue().strip())`, q:'What prints?', opts:['a,"b,c"','a,b,c','"a","b,c"'], ans:0, why:'Only the field containing a comma is quoted.'},
  cast:{code:R`import csv

with open("names.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["id", "name"])
    writer.writerow([1, "Smith, Jo"])

print(open("names.csv").read())`, task:'Cast it.'},
  bug:{broken:R`names = ["Ada", "Smith, Jo"]
with open("names.csv", "w") as f:
    for i, name in enumerate(names, 1):
        f.write(f"{i},{name}\n")
print(open("names.csv").read().splitlines()[1])`, task:'The comma inside "Smith, Jo" is not quoted, so a reader sees 3 columns. Use csv.writer so that line comes out as 2,"Smith, Jo".',
    cases:[{inputs:[],tests:[['Quoted','lines==["2,\\"Smith, Jo\\""]'],['Uses csv.writer','"csv.writer" in src']]}],
    sol:R`import csv
names = ["Ada", "Smith, Jo"]
with open("names.csv", "w", newline="") as f:
    writer = csv.writer(f)
    for i, name in enumerate(names, 1):
        writer.writerow([i, name])
print(open("names.csv").read().splitlines()[1])`, wrong:[R`names = ["Ada", "Smith, Jo"]
with open("names.csv", "w") as f:
    for i, name in enumerate(names, 1):
        f.write(f"{i},{name}\n")
print(open("names.csv").read().splitlines()[1])`]},
  write:{prompt:'Read `names.txt` (one name per line, skip blank lines). Write `names.csv` with a header `id,name` and one row per name, numbered from 1. Use `csv.writer`. Print `Wrote <n> names`.',
    starter:R`import csv
`,
    files:{'names.txt':'Ada\nSmith, Jo\n\nBo\n'},
    cases:[{inputs:[],files:{'names.txt':'Ada\nSmith, Jo\n\nBo\n'},tests:[['CSV content','read("names.csv")=="id,name\\n1,Ada\\n2,\\"Smith, Jo\\"\\n3,Bo\\n"'],['Message','lines[-1]=="Wrote 3 names"']]},{inputs:[],files:{'names.txt':'Zed\n'},tests:[['One name','read("names.csv")=="id,name\\n1,Zed\\n"']]},{inputs:[],files:{'names.txt':''},tests:[['No names','read("names.csv")=="id,name\\n" and lines[-1]=="Wrote 0 names"']]},{inputs:[],files:{'names.txt':'Say "hi"\n'},tests:[['Quotes doubled','read("names.csv")=="id,name\\n1,\\"Say \\"\\"hi\\"\\"\\"\\n" and "csv.writer" in src']]}],
    sol:R`import csv

with open("names.txt") as f:
    names = [line.strip() for line in f if line.strip() != ""]

with open("names.csv", "w", newline="") as out:
    writer = csv.writer(out)
    writer.writerow(["id", "name"])
    for i, name in enumerate(names, 1):
        writer.writerow([i, name])
print("Wrote", len(names), "names")`,
    wrong:[R`with open("names.txt") as f:
    names = [line.strip() for line in f if line.strip() != ""]

with open("names.csv", "w") as out:
    out.write("id,name\n")
    for i, name in enumerate(names, 1):
        out.write(f"{i},{name}\n")
print("Wrote", len(names), "names")`, R`import csv

with open("names.txt") as f:
    names = [line.strip() for line in f if line.strip() != ""]

with open("names.csv", "w", newline="") as out:
    writer = csv.writer(out)
    for i, name in enumerate(names, 1):
        writer.writerow([i, name])
print("Wrote", len(names), "names")`],
    hints:['Read the names first: strip each line and drop empty ones.','writer.writerow(["id", "name"]) for the header, then one writerow([i, name]) per name.','Open the output with "w" and newline="".','import csv\n\nwith open("names.txt") as f:\n    names = [line.strip() for line in f if line.strip() != ""]\n\nwith open("names.csv", "w", newline="") as out:\n    writer = csv.writer(out)\n    writer.writerow(["id", "name"])\n    for i, name in enumerate(names, 1):\n        writer.writerow([i, name])\nprint("Wrote", len(names), "names")']},
  power:{can:['Write CSV files other programs can open','Trust csv.writer to quote fields correctly'],
    expand:'Add a third column with the name length.',
    where:'Exports for Excel, Google Sheets and databases are CSV files made this way.',
    next:'Next: DictWriter, writing dict rows.'},
  codex:{title:'csv.writer',body:'writer = csv.writer(f); writer.writerow([...]); writerows([[...]]). Open with "w", newline="".',snip:R`writer.writerow([i, name])`}
},
{
  id:'r8-27', realm:8, n:27, title:'DictWriter: saving records',
  teaches:['csv-dictwriter'], requires:['csv-writer'],
  story:`"Your program keeps its records as **dicts**," Orrin says. "Writing them out should be as natural as keeping them."`,
  concept:{
    html:`\`csv.DictWriter\` writes a list of dicts, in the column order **you** choose:\n\n\`\`\`\nimport csv\n\ndef save_people(path, people):\n    with open(path, "w", newline="") as f:\n        writer = csv.DictWriter(f, fieldnames=["name", "age"], extrasaction="ignore")\n        writer.writeheader()\n        writer.writerows(people)\n\`\`\`\n\n- \`fieldnames\` fixes the columns and their order.\n- \`writeheader()\` writes the header row.\n- \`extrasaction="ignore"\` skips dict keys that are not columns. Without it, an extra key raises \`ValueError\`.\n- A dict missing a column writes an **empty** cell.\n\nYou can round-trip: \`save_people\` then read back with \`DictReader\` and get the same data (as strings).`,
    analogy:`A form-filler that copies each dict onto the right line.`,
    example:R`import csv

people = [{"name": "Ada", "age": 30}, {"name": "Bo", "age": 25}]
with open("people.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age"])
    writer.writeheader()
    writer.writerows(people)
print(open("people.csv").read())`},
  predict:{code:R`import csv, io
buf = io.StringIO()
w = csv.DictWriter(buf, fieldnames=["a", "b"], lineterminator="\n")
w.writeheader()
w.writerow({"b": 2, "a": 1})
print(buf.getvalue().splitlines()[1])`, q:'What prints?', opts:['1,2','2,1','a,b'], ans:0, why:'Columns follow fieldnames, not the dict\'s own key order.'},
  cast:{code:R`import csv

people = [{"name": "Ada", "age": 30}, {"name": "Bo", "age": 25}]
with open("people.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age"])
    writer.writeheader()
    writer.writerows(people)
print(open("people.csv").read())`, task:'Cast it.'},
  bug:{broken:R`import csv
with open("p.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age"])
    writer.writerow({"name": "Ada", "age": 30, "id": 1})
print("saved")`, task:'ValueError: the dict has a key (id) that is not a column. Tell DictWriter to ignore extras.',
    cases:[{inputs:[],tests:[['Saved','lines==["saved"]'],['Row written','read("p.csv")=="Ada,30\\n"']]}],
    sol:R`import csv
with open("p.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age"], extrasaction="ignore")
    writer.writerow({"name": "Ada", "age": 30, "id": 1})
print("saved")`, wrong:[R`import csv
with open("p.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age"])
    writer.writerow({"name": "Ada", "age": 30, "id": 1})
print("saved")`]},
  write:{prompt:'Write `save_people(path, people)` that saves a list of dicts with columns `name,age` (header first, extra keys ignored). Save `[{"name": "Ada", "age": 30, "id": 1}, {"name": "Smith, Jo", "age": 41}]` to `people.csv`, then read it back with `DictReader` and print `<name> is <age>` for each row.',
    starter:R`import csv

people = [{"name": "Ada", "age": 30, "id": 1}, {"name": "Smith, Jo", "age": 41}]
`,
    cases:[{inputs:[],tests:[['Printed','lines==["Ada is 30","Smith, Jo is 41"]'],['File','read("people.csv")=="name,age\\nAda,30\\n\\"Smith, Jo\\",41\\n"'],['Function','(g["save_people"]("z.csv",[{"name":"X","age":1}]), read("z.csv"))[1]=="name,age\\nX,1\\n"'],['Empty list','(g["save_people"]("e.csv",[]), read("e.csv"))[1]=="name,age\\n"'],['Uses DictWriter','"DictWriter" in src and "DictReader" in src']]}],
    sol:R`import csv

people = [{"name": "Ada", "age": 30, "id": 1}, {"name": "Smith, Jo", "age": 41}]

def save_people(path, people):
    with open(path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "age"], extrasaction="ignore")
        writer.writeheader()
        writer.writerows(people)

save_people("people.csv", people)
with open("people.csv", newline="") as f:
    for row in csv.DictReader(f):
        print(f"{row['name']} is {row['age']}")`,
    wrong:[R`import csv

people = [{"name": "Ada", "age": 30, "id": 1}, {"name": "Smith, Jo", "age": 41}]

def save_people(path, people):
    with open(path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "age"], extrasaction="ignore")
        writer.writerows(people)

save_people("people.csv", people)
with open("people.csv", newline="") as f:
    for row in csv.DictReader(f, fieldnames=["name", "age"]):
        print(f"{row['name']} is {row['age']}")`, R`import csv

people = [{"name": "Ada", "age": 30, "id": 1}, {"name": "Smith, Jo", "age": 41}]

def save_people(path, people):
    with open(path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "age"])
        writer.writeheader()
        writer.writerows(people)

save_people("people.csv", people)
with open("people.csv", newline="") as f:
    for row in csv.DictReader(f):
        print(f"{row['name']} is {row['age']}")`],
    hints:['DictWriter(f, fieldnames=["name", "age"], extrasaction="ignore").','Call writeheader() before writerows(people).','Read back with csv.DictReader and print row["name"] and row["age"].','import csv\n\npeople = [{"name": "Ada", "age": 30, "id": 1}, {"name": "Smith, Jo", "age": 41}]\n\ndef save_people(path, people):\n    with open(path, "w", newline="") as f:\n        writer = csv.DictWriter(f, fieldnames=["name", "age"], extrasaction="ignore")\n        writer.writeheader()\n        writer.writerows(people)\n\nsave_people("people.csv", people)\nwith open("people.csv", newline="") as f:\n    for row in csv.DictReader(f):\n        print(f"{row[\'name\']} is {row[\'age\']}")']},
  power:{can:['Save dict records to CSV with chosen columns','Round-trip data through a file'],
    expand:'Add a `load_people(path)` that returns the list back with ages as ints.',
    where:'Exporting database-style records to a spreadsheet is a daily job.',
    next:'Next: fields with commas, quotes and odd characters.'},
  codex:{title:'DictWriter',body:'DictWriter(f, fieldnames=[...], extrasaction="ignore"); writeheader(); writerows(list_of_dicts).',snip:R`writer.writeheader()
writer.writerows(rows)`}
},
{
  id:'r8-28', realm:8, n:28, title:'Tricky fields: quotes, commas and one-liners',
  teaches:['csv-quotes'], requires:['csv-dictwriter'],
  story:`A clerk slides over a crumpled ledger: **"Smith, Jo"**, **"6"" ruler"**, a cell holding a whole sentence with commas. "Your split(',') will shred this," Orrin smiles. "The csv module won't."`,
  concept:{
    html:`CSV has rules for awkward fields:\n\n- A field with a **comma** is wrapped in quotes: \`"Smith, Jo"\`.\n- A **quote** inside a quoted field is doubled: \`"6"" ruler"\` means \`6" ruler\`.\n- A quoted field may even contain a **newline**.\n\n\`csv.reader\` accepts **any list of lines**, not just a file, so you can parse one line from a string:\n\n\`\`\`\nimport csv\n\ndef parse_line(line):\n    for row in csv.reader([line]):\n        return row\n    return []\n\nparse_line('a,"b,c",d')       # ['a', 'b,c', 'd']\nparse_line('"6"" ruler",9')   # ['6" ruler', '9']\n\`\`\`\n\nNever parse CSV with \`split(",")\` unless you control the data.`,
    analogy:`Customs rules for packing odd items so they arrive intact.`,
    example:R`import csv

line = 'a,"b,c",d'
print(next(csv.reader([line])))`},
  predict:{code:R`import csv
print(next(csv.reader(['"say ""hi""",x'])))`, q:'What prints?', opts:['[\'say "hi"\', \'x\']','[\'"say ""hi"""\', \'x\']','[\'say\', \'hi\', \'x\']'], ans:0, why:'Doubled quotes inside a quoted field become one literal quote.'},
  cast:{code:R`import csv

line = 'a,"b,c",d'
print(next(csv.reader([line])))`, task:'Cast it, then try a doubled quote.'},
  bug:{broken:R`line = 'Ada,"Smith, Jo",30'
fields = line.split(",")
print(len(fields))`, task:'It reports 4 fields instead of 3, because the comma in "Smith, Jo" fooled split. Parse it with the csv module.',
    cases:[{inputs:[],tests:[['Three fields','lines==["3"]'],['Uses csv','"csv.reader" in src']]}],
    sol:R`import csv
line = 'Ada,"Smith, Jo",30'
fields = next(csv.reader([line]))
print(len(fields))`, wrong:[R`line = 'Ada,"Smith, Jo",30'
fields = line.split(",")
print(len(fields))`]},
  write:{prompt:'Write `parse_line(line)` that returns the list of fields of one CSV line (an empty line gives `[]`). Then ask `Line: ` and print `Fields: <n>` followed by `<position>: <value>` for each field, numbered from 1.',
    starter:R`import csv

# define parse_line, then use it
`,
    inputs:['a,"b,c",d'],
    cases:[{inputs:['a,"b,c",d'],tests:[['Quoted comma','[l for l in lines if not l.startswith("Line: ")]==["Fields: 3","1: a","2: b,c","3: d"]']]},{inputs:['"6"" ruler",9'],tests:[['Doubled quote','[l for l in lines if not l.startswith("Line: ")]==["Fields: 2","1: 6\\" ruler","2: 9"]']]},{inputs:[''],tests:[['Empty','[l for l in lines if not l.startswith("Line: ")]==["Fields: 0"]']]},{inputs:['x,,y'],tests:[['Empty middle field','[l for l in lines if not l.startswith("Line: ")]==["Fields: 3","1: x","2: ","3: y"]'],['Function','g["parse_line"]("p,q")==["p","q"] and g["parse_line"]("")==[]']]}],
    sol:R`import csv

def parse_line(line):
    return next(csv.reader([line]))

fields = parse_line(input("Line: "))
print("Fields:", len(fields))
for position, value in enumerate(fields, 1):
    print(f"{position}: {value}")`,
    wrong:[R`def parse_line(line):
    if line == "":
        return []
    return line.split(",")

fields = parse_line(input("Line: "))
print("Fields:", len(fields))
for position, value in enumerate(fields, 1):
    print(f"{position}: {value}")`, R`import csv

def parse_line(line):
    return list(csv.reader(line))

fields = parse_line(input("Line: "))
print("Fields:", len(fields))
for position, value in enumerate(fields, 1):
    print(f"{position}: {value}")`],
    hints:['csv.reader([line]) treats the one string as a one-line file.','csv.reader wants a LIST of lines, so wrap your one line in [ ]. next(...) takes its first row. (An empty line gives an empty list.)','Number the fields with enumerate(fields, 1).','import csv\n\ndef parse_line(line):\n    return next(csv.reader([line]))\n\nfields = parse_line(input("Line: "))\nprint("Fields:", len(fields))\nfor position, value in enumerate(fields, 1):\n    print(f"{position}: {value}")']},
  power:{can:['Parse awkward CSV fields correctly','Use csv.reader on plain strings, not just files'],
    expand:'Parse a whole multi-line string by passing text.splitlines() to csv.reader.',
    where:'Text that arrives from the web or an API is often CSV in a string.',
    next:'Next: cleaning missing and bad values.'},
  codex:{title:'CSV quoting',body:'Quotes wrap fields with commas; "" means a literal quote. csv.reader([line]) parses a string.',snip:R`next(csv.reader([line]))`}
},
{
  id:'r8-29', realm:8, n:29, title:'Missing and bad values',
  teaches:['csv-clean'], requires:['csv-quotes','err-multi'],
  story:`"Real ledgers have holes," Orrin sighs. "Blank cells, **N/A**, someone's coffee stain read as *abc*. A good keeper counts what is valid, counts what isn't, and **never lets one bad cell sink the report**."`,
  concept:{
    html:`Real data is messy. A robust loop:\n\n\`\`\`\nvalid = []\nskipped = 0\nfor row in csv.DictReader(f):\n    text = (row.get("score") or "").strip()    # None-safe\n    try:\n        valid.append(int(text))\n    except ValueError:\n        skipped += 1\n\`\`\`\n\n- \`row.get("score")\` is \`None\` if the cell is missing; \`or ""\` turns \`None\` into an empty string.\n- \`int("")\`, \`int("N/A")\` and \`int("abc")\` all raise \`ValueError\`. One handler covers them all.\n- Report **how many** were skipped, so nobody trusts a number built on half the data.\n- Guard the average: no valid values means no average.`,
    analogy:`A quality inspector: keep the good parts, count the rejects.`,
    example:R`for text in ["90", "", "N/A", " 70 "]:
    try:
        print(int(text.strip()))
    except ValueError:
        print("skip")`},
  predict:{code:R`row = {"score": None}
text = (row.get("score") or "").strip()
print(repr(text))`, q:'What prints?', opts:["''","None","'None'"], ans:0, why:'None or "" is "", and "".strip() is still "".'},
  cast:{code:R`import csv

valid = []
skipped = 0
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        text = (row.get("score") or "").strip()
        try:
            valid.append(int(text))
        except ValueError:
            skipped += 1
print(valid, skipped)`, task:'Cast it.', files:{'scores.csv':'name,score\nAda,90\nBo,\nCy,N/A\nDi, 70 \n'}},
  bug:{broken:R`import csv
total = 0
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        total += int(row["score"])
print(total)`, task:'ValueError on the blank score. Skip rows whose score is not a whole number. Expected total: 160',
    files:{'scores.csv':'name,score\nAda,90\nBo,\nDi,70\n'},
    cases:[{inputs:[],tests:[['Total','lines==["160"]']]}],
    sol:R`import csv
total = 0
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        try:
            total += int(row["score"])
        except ValueError:
            pass
print(total)`, wrong:[R`import csv
total = 0
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        total += int(row["score"])
print(total)`]},
  write:{prompt:'From `scores.csv` (`name,score`) print `Valid: <n>`, `Skipped: <n>` and `Average: <x.xx>` over the valid whole-number scores (spaces allowed). A missing, blank or non-number score is skipped. If there are no valid scores print `No valid scores` instead of the average.',
    starter:R`import csv
`,
    files:{'scores.csv':'name,score\nAda,90\nBo,\nCy,N/A\nDi, 70 \nEd,abc\n'},
    cases:[{inputs:[],files:{'scores.csv':'name,score\nAda,90\nBo,\nCy,N/A\nDi, 70 \nEd,abc\n'},tests:[['Mixed','lines==["Valid: 2","Skipped: 3","Average: 80.00"]']]},{inputs:[],files:{'scores.csv':'name,score\nAda,90\nBo,85\n'},tests:[['All good','lines==["Valid: 2","Skipped: 0","Average: 87.50"]']]},{inputs:[],files:{'scores.csv':'name,score\nAda,x\n'},tests:[['None valid','lines==["Valid: 0","Skipped: 1","No valid scores"]']]},{inputs:[],files:{'scores.csv':'name,score\nAda\nBo,60\n'},tests:[['Short row','lines==["Valid: 1","Skipped: 1","Average: 60.00"]']]},{inputs:[],files:{'scores.csv':'name,score\nAda,7.5\nBo,-5\n'},tests:[['Decimal rejected, negative allowed','lines==["Valid: 1","Skipped: 1","Average: -5.00"]']]}],
    sol:R`import csv

valid = []
skipped = 0
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        text = (row.get("score") or "").strip()
        try:
            valid.append(int(text))
        except ValueError:
            skipped += 1

print("Valid:", len(valid))
print("Skipped:", skipped)
if valid:
    print(f"Average: {sum(valid) / len(valid):.2f}")
else:
    print("No valid scores")`,
    wrong:[R`import csv

valid = []
skipped = 0
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        text = (row.get("score") or "").strip()
        if text.isdigit():
            valid.append(int(text))
        else:
            skipped += 1

print("Valid:", len(valid))
print("Skipped:", skipped)
if valid:
    print(f"Average: {sum(valid) / len(valid):.2f}")
else:
    print("No valid scores")`, R`import csv

valid = []
skipped = 0
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        text = row["score"].strip()
        try:
            valid.append(int(text))
        except ValueError:
            skipped += 1

print("Valid:", len(valid))
print("Skipped:", skipped)
if valid:
    print(f"Average: {sum(valid) / len(valid):.2f}")
else:
    print("No valid scores")`],
    hints:['Get the cell safely: (row.get("score") or "").strip().','try: valid.append(int(text)) except ValueError: skipped += 1.','After the loop guard the average with if valid:.','import csv\n\nvalid = []\nskipped = 0\nwith open("scores.csv", newline="") as f:\n    for row in csv.DictReader(f):\n        text = (row.get("score") or "").strip()\n        try:\n            valid.append(int(text))\n        except ValueError:\n            skipped += 1\n\nprint("Valid:", len(valid))\nprint("Skipped:", skipped)\nif valid:\n    print(f"Average: {sum(valid) / len(valid):.2f}")\nelse:\n    print("No valid scores")']},
  power:{can:['Survive blank, missing and bad cells','Report how much data was usable'],
    expand:'Print the names of the skipped rows too.',
    where:'Data cleaning is often most of a data job; this is its core loop.',
    next:'Next: Real-World Mission: the Sales Report.'},
  codex:{title:'Cleaning CSV',body:'(row.get(col) or "").strip(); try int(); count skipped; guard the average.',snip:R`text = (row.get("score") or "").strip()`}
},
{
  id:'r8-30', realm:8, n:30, title:'Real-World Mission: The Sales Report',
  teaches:['mission8b'], requires:['csv-clean','csv-sort'],
  story:`The baker's rival has a huge sales ledger and a bigger mess. "Month-end," the clerk groans. "Dirty rows, missing prices, and the owner wants a **one-page report** by morning." Orrin hands you the keys to the vault.`,
  concept:{
    html:`**Mission brief:** read \`sales.csv\` with columns \`date,region,item,units,price\` and produce a report.\n\nA row is **valid** if it has a non-blank \`region\` and \`item\`, \`units\` is a whole number above 0, and \`price\` is a number that is 0 or more. Anything else (including missing fields) is **skipped**.\n\nPrint exactly:\n\n\`\`\`\nRows: <valid rows>\nSkipped: <invalid rows>\nTotal units: <units>\nRevenue: $<x.xx>\nBest region: <name> ($<x.xx>)\nTop item: <name> (<units> units)\n\`\`\`\n\n- **Best region** = highest revenue (ties → alphabetical first).\n- **Top item** = most units (ties → alphabetical first).\n- If there are no valid rows print \`No valid sales\` instead.\n\nAlso **write** \`regions.csv\` with header \`region,revenue\` and one row per region (alphabetical), revenue to 2 decimals.`,
    analogy:`The monthly report every business needs.`,
    example:R`rows = [("N", 10.0), ("S", 10.0)]
best = sorted(rows, key=lambda r: (-r[1], r[0]))[0]
print(best)`},
  predict:{code:R`d = {"b": 2, "a": 2, "c": 1}
print(sorted(d, key=lambda k: (-d[k], k))[0])`, q:'What prints?', opts:['a','b','c'], ans:0, why:'Highest value 2 is shared by a and b; alphabetically a comes first.'},
  cast:{code:R`d = {"b": 2, "a": 2, "c": 1}
print(sorted(d, key=lambda k: (-d[k], k))[0])`, task:'Cast it. This is the tie-break trick you need for the report.'},
  bug:{broken:R`totals = {"South": 69.5, "North": 105.0}
best = max(totals)
print(best)`, task:'max(totals) compares the names, not the revenue. Pick the region with the biggest revenue. Expected: North',
    cases:[{inputs:[],tests:[['Best','lines==["North"]']]}],
    sol:R`totals = {"South": 69.5, "North": 105.0}
best = max(totals, key=lambda k: totals[k])
print(best)`, wrong:[R`totals = {"South": 69.5, "North": 105.0}
best = max(totals)
print(best)`]},
  write:{prompt:'Build the Sales Report exactly as the brief says, including `regions.csv`.',
    starter:R`import csv

# read sales.csv, then print the report and write regions.csv
`,
    files:{'sales.csv':'date,region,item,units,price\n2026-01-02,North,lamp,3,12.50\n2026-01-02,South,lamp,2,12.50\n2026-01-03,North,book,1,20\n2026-01-03,East,lamp,x,12.50\n2026-01-04,South,book,4,20\n2026-01-04,East,,2,5\n2026-01-05,North,quill,10,1.2\n'},
    cases:[{inputs:[],files:{'sales.csv':'date,region,item,units,price\n2026-01-02,North,lamp,3,12.50\n2026-01-02,South,lamp,2,12.50\n2026-01-03,North,book,1,20\n2026-01-03,East,lamp,x,12.50\n2026-01-04,South,book,4,20\n2026-01-04,East,,2,5\n2026-01-05,North,quill,10,1.2\n'},tests:[['Report','lines==["Rows: 5","Skipped: 2","Total units: 20","Revenue: $174.50","Best region: South ($105.00)","Top item: quill (10 units)"]'],['regions.csv','read("regions.csv")=="region,revenue\\nNorth,69.50\\nSouth,105.00\\n"']]},{inputs:[],files:{'sales.csv':'date,region,item,units,price\nd,B,x,1,5\nd,A,y,1,5\nd,B,y,1,0\n'},tests:[['Ties go alphabetical','lines==["Rows: 3","Skipped: 0","Total units: 3","Revenue: $10.00","Best region: A ($5.00)","Top item: y (2 units)"]']]},{inputs:[],files:{'sales.csv':'date,region,item,units,price\nd,A,x,0,5\nd,A,x,1,-1\nd,,x,1,1\nd,A\n'},tests:[['Nothing valid','lines==["No valid sales"]']]},{inputs:[],files:{'sales.csv':'date,region,item,units,price\n'},tests:[['Header only','lines==["No valid sales"]']]},{inputs:[],files:{'sales.csv':'date,region,item,units,price\nd, North ,lamp, 2 , 1.5 \n'},tests:[['Spaces trimmed','lines[0]=="Rows: 1" and lines[3]=="Revenue: $3.00" and lines[4]=="Best region: North ($3.00)"']]},{inputs:[],files:{'sales.csv':'date,region,item,units,price\nd,A,x,1.5,2\n'},tests:[['Decimal units invalid','lines==["No valid sales"]']]}],
    sol:R`import csv

rows = 0
skipped = 0
units_total = 0
revenue_total = 0.0
by_region = {}
by_item = {}

with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        try:
            region = (row.get("region") or "").strip()
            item = (row.get("item") or "").strip()
            units = int((row.get("units") or "").strip())
            price = float((row.get("price") or "").strip())
        except ValueError:
            skipped += 1
            continue
        if region == "" or item == "" or units <= 0 or price < 0:
            skipped += 1
            continue
        rows += 1
        units_total += units
        revenue = units * price
        revenue_total += revenue
        by_region[region] = by_region.get(region, 0) + revenue
        by_item[item] = by_item.get(item, 0) + units

if rows == 0:
    print("No valid sales")
else:
    best_region = sorted(by_region, key=lambda r: (-by_region[r], r))[0]
    top_item = sorted(by_item, key=lambda i: (-by_item[i], i))[0]
    print("Rows:", rows)
    print("Skipped:", skipped)
    print("Total units:", units_total)
    print(f"Revenue: $@{revenue_total:.2f}")
    print(f"Best region: {best_region} ($@{by_region[best_region]:.2f})")
    print(f"Top item: {top_item} ({by_item[top_item]} units)")
    with open("regions.csv", "w", newline="") as out:
        writer = csv.writer(out)
        writer.writerow(["region", "revenue"])
        for region in sorted(by_region):
            writer.writerow([region, f"{by_region[region]:.2f}"])`,
    wrong:[R`import csv

rows = 0
skipped = 0
units_total = 0
revenue_total = 0.0
by_region = {}
by_item = {}

with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        try:
            region = (row.get("region") or "").strip()
            item = (row.get("item") or "").strip()
            units = int((row.get("units") or "").strip())
            price = float((row.get("price") or "").strip())
        except ValueError:
            skipped += 1
            continue
        if region == "" or item == "" or units <= 0 or price < 0:
            skipped += 1
            continue
        rows += 1
        units_total += units
        revenue = units * price
        revenue_total += revenue
        by_region[region] = by_region.get(region, 0) + revenue
        by_item[item] = by_item.get(item, 0) + units

if rows == 0:
    print("No valid sales")
else:
    best_region = max(by_region, key=lambda r: by_region[r])
    top_item = max(by_item, key=lambda i: by_item[i])
    print("Rows:", rows)
    print("Skipped:", skipped)
    print("Total units:", units_total)
    print(f"Revenue: $@{revenue_total:.2f}")
    print(f"Best region: {best_region} ($@{by_region[best_region]:.2f})")
    print(f"Top item: {top_item} ({by_item[top_item]} units)")
    with open("regions.csv", "w", newline="") as out:
        writer = csv.writer(out)
        writer.writerow(["region", "revenue"])
        for region in sorted(by_region):
            writer.writerow([region, f"{by_region[region]:.2f}"])`, R`import csv

rows = 0
skipped = 0
units_total = 0
revenue_total = 0.0
by_region = {}
by_item = {}

with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        try:
            region = (row.get("region") or "").strip()
            item = (row.get("item") or "").strip()
            units = int((row.get("units") or "").strip())
            price = float((row.get("price") or "").strip())
        except ValueError:
            skipped += 1
            continue
        if region == "" or item == "" or units <= 0 or price < 0:
            skipped += 1
            continue
        rows += 1
        units_total += units
        revenue = units * price
        revenue_total += revenue
        by_region[region] = by_region.get(region, 0) + revenue
        by_item[item] = by_item.get(item, 0) + units

if rows == 0:
    print("No valid sales")
else:
    best_region = sorted(by_region, key=lambda r: (-by_region[r], r))[0]
    top_item = sorted(by_item, key=lambda i: (-by_item[i], i))[0]
    print("Rows:", rows)
    print("Skipped:", skipped)
    print("Total units:", units_total)
    print(f"Revenue: $@{revenue_total:.2f}")
    print(f"Best region: {best_region} ($@{by_region[best_region]:.2f})")
    print(f"Top item: {top_item} ({by_item[top_item]} units)")`],
    hints:['Loop with DictReader. In a try, read region, item (strings, stripped) and units (int), price (float). On ValueError count a skip and continue. Then also skip blank names, units <= 0, negative prices.','Keep dicts by_region (revenue) and by_item (units), plus running totals.','Best region and top item: sorted(d, key=lambda k: (-d[k], k))[0]. If rows == 0 print No valid sales. Write regions.csv with csv.writer, regions sorted.','import csv\n\nrows = 0\nskipped = 0\nunits_total = 0\nrevenue_total = 0.0\nby_region = {}\nby_item = {}\n\nwith open("sales.csv", newline="") as f:\n    for row in csv.DictReader(f):\n        try:\n            region = (row.get("region") or "").strip()\n            item = (row.get("item") or "").strip()\n            units = int((row.get("units") or "").strip())\n            price = float((row.get("price") or "").strip())\n        except ValueError:\n            skipped += 1\n            continue\n        if region == "" or item == "" or units <= 0 or price < 0:\n            skipped += 1\n            continue\n        rows += 1\n        units_total += units\n        revenue = units * price\n        revenue_total += revenue\n        by_region[region] = by_region.get(region, 0) + revenue\n        by_item[item] = by_item.get(item, 0) + units\n\nif rows == 0:\n    print("No valid sales")\nelse:\n    best_region = sorted(by_region, key=lambda r: (-by_region[r], r))[0]\n    top_item = sorted(by_item, key=lambda i: (-by_item[i], i))[0]\n    print("Rows:", rows)\n    print("Skipped:", skipped)\n    print("Total units:", units_total)\n    print(f"Revenue: $@{revenue_total:.2f}")\n    print(f"Best region: {best_region} ($@{by_region[best_region]:.2f})")\n    print(f"Top item: {top_item} ({by_item[top_item]} units)")\n    with open("regions.csv", "w", newline="") as out:\n        writer = csv.writer(out)\n        writer.writerow(["region", "revenue"])\n        for region in sorted(by_region):\n            writer.writerow([region, f"{by_region[region]:.2f}"])']},
  power:{can:['Turn a messy CSV into a clean business report','Combine reading, cleaning, grouping, ranking and writing'],
    expand:'Add a "Worst region" line and a monthly breakdown using the date column.',
    where:'This is the daily bread of data and finance roles: ingest, clean, summarise, export.',
    next:'Next: JSON, the language of the web.'},
  codex:{title:'Report pipeline',body:'Read → validate (skip + count) → accumulate in dicts → rank with a tie-break → print → write a summary CSV.',snip:R`best = sorted(d, key=lambda k: (-d[k], k))[0]`}
}
);
