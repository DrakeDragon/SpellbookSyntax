// REALM 8 — THE ARCHIVE — part E (lessons 41-42: boss and gap check)
LESSONS.push(
{
  id:'r8-41', realm:8, n:41, title:'Boss: The Ledger Wyrm', kind:'boss',
  teaches:['realm8-boss'], requires:['mission8d'],
  story:`The shelves shudder. Every ledger in the Archive lifts into the air, pages flapping, and fuses into the **Ledger Wyrm**, a serpent made of unfiled records, half-erased lines and corrupted JSON. "It eats whatever you forget to close!" Orrin shouts. "**Write it down properly, and it can't touch you.**"`,
  boss:{name:'The Ledger Wyrm', hp:5},
  phases:[
    {type:'mcq', code:R`with open("a.txt", "w") as f:
    f.write("A\n")
with open("a.txt", "w") as f:
    f.write("B\n")
print(open("a.txt").read().strip())`, q:'Strike 1: What prints?', opts:['B','A\nB','A'], ans:0,
     why:'The second "w" erased the file before writing B.', tags:['r8-06']},
    {type:'write', prompt:'Strike 2: Read `notes.txt`. Print `Lines: <n>` (counting only non-blank lines) and `Longest: <text>` (the longest line, stripped; the first one if tied). If the file is missing print `No notes`. If it has no non-blank lines print `Lines: 0` only.',
     starter:R`# read notes.txt
`,
     files:{'notes.txt':'feed Sudo\n\nsweep the long hall\nwrite\n'},
     cases:[{inputs:[],files:{'notes.txt':'feed Sudo\n\nsweep the long hall\nwrite\n'},tests:[['Count and longest','lines==["Lines: 3","Longest: sweep the long hall"]']]},{inputs:[],files:{},tests:[['Missing','lines==["No notes"]']]},{inputs:[],files:{'notes.txt':'\n  \n'},tests:[['Only blanks','lines==["Lines: 0"]']]},{inputs:[],files:{'notes.txt':'abc\nxyz\n'},tests:[['Tie','lines==["Lines: 2","Longest: abc"]']]},{inputs:[],files:{'notes.txt':'  padded  \nab'},tests:[['Stripped','lines==["Lines: 2","Longest: padded"]']]}],
     sol:R`try:
    with open("notes.txt") as f:
        notes = [line.strip() for line in f if line.strip() != ""]
except FileNotFoundError:
    print("No notes")
else:
    print("Lines:", len(notes))
    if notes:
        longest = notes[0]
        for n in notes:
            if len(n) > len(longest):
                longest = n
        print("Longest:", longest)`,
     wrong:[R`try:
    with open("notes.txt") as f:
        notes = [line.strip() for line in f]
except FileNotFoundError:
    print("No notes")
else:
    print("Lines:", len(notes))
    if notes:
        longest = notes[0]
        for n in notes:
            if len(n) > len(longest):
                longest = n
        print("Longest:", longest)`, R`try:
    with open("notes.txt") as f:
        notes = [line.strip() for line in f if line.strip() != ""]
except FileNotFoundError:
    print("No notes")
else:
    print("Lines:", len(notes))
    if notes:
        print("Longest:", max(notes, key=len)[::-1][::-1] if False else sorted(notes, key=len)[-1])`],
     hints:['try/except FileNotFoundError around the open. Collect stripped, non-empty lines in a list.','Print Lines: len(notes). Only if the list is non-empty, find the longest (first wins a tie, so only replace when strictly longer).','Use else on the try so the printing runs only when the file opened.','try:\n    with open("notes.txt") as f:\n        notes = [line.strip() for line in f if line.strip() != ""]\nexcept FileNotFoundError:\n    print("No notes")\nelse:\n    print("Lines:", len(notes))\n    if notes:\n        longest = notes[0]\n        for n in notes:\n            if len(n) > len(longest):\n                longest = n\n        print("Longest:", longest)'], tags:['r8-05','r8-09','r8-04']},
    {type:'mcq', code:R`import csv
row = next(csv.reader(['x,"y,z",w']))
print(len(row), row[1])`, q:'Strike 3: What prints?', opts:['3 y,z','4 y','3 y'], ans:0,
     why:'The comma inside quotes stays in the field, so there are 3 fields and the second is y,z.', tags:['r8-19','r8-28']},
    {type:'write', prompt:'Strike 4: Keep an inventory in `inventory.json` (a list of `{"item": ..., "qty": ...}`). Ask `Item: ` and `Qty: ` (whole number). If the item is already listed, add to its qty; otherwise add a new entry at the end. Save, then print `<item>: <qty>`. A missing or corrupt file means an empty inventory.',
     starter:R`import json
`,
     inputs:['lamp','2'],
     files:{'inventory.json':'[{"item": "lamp", "qty": 3}, {"item": "key", "qty": 1}]'},
     cases:[{inputs:['lamp','2'],files:{'inventory.json':'[{"item": "lamp", "qty": 3}, {"item": "key", "qty": 1}]'},tests:[['Existing item','lines[-1]=="lamp: 5"'],['Saved','json.loads(read("inventory.json"))==[{"item":"lamp","qty":5},{"item":"key","qty":1}]']]},{inputs:['oil','4'],files:{'inventory.json':'[{"item": "lamp", "qty": 3}]'},tests:[['New item','lines[-1]=="oil: 4" and json.loads(read("inventory.json"))==[{"item":"lamp","qty":3},{"item":"oil","qty":4}]']]},{inputs:['wick','1'],files:{},tests:[['No file','lines[-1]=="wick: 1" and json.loads(read("inventory.json"))==[{"item":"wick","qty":1}]']]},{inputs:['wick','2'],files:{'inventory.json':'[{"item": "wick"'},tests:[['Corrupt file','lines[-1]=="wick: 2" and json.loads(read("inventory.json"))==[{"item":"wick","qty":2}]']]},{inputs:['Lamp','1'],files:{'inventory.json':'[{"item": "lamp", "qty": 3}]'},tests:[['Names are exact','lines[-1]=="Lamp: 1" and len(json.loads(read("inventory.json")))==2']]}],
     sol:R`import json

item = input("Item: ")
qty = int(input("Qty: "))

try:
    with open("inventory.json") as f:
        inventory = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    inventory = []

for entry in inventory:
    if entry["item"] == item:
        entry["qty"] += qty
        total = entry["qty"]
        break
else:
    inventory.append({"item": item, "qty": qty})
    total = qty

with open("inventory.json", "w") as f:
    json.dump(inventory, f)
print(f"{item}: {total}")`,
     wrong:[R`import json

item = input("Item: ")
qty = int(input("Qty: "))

try:
    with open("inventory.json") as f:
        inventory = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    inventory = []

inventory.append({"item": item, "qty": qty})

with open("inventory.json", "w") as f:
    json.dump(inventory, f)
print(f"{item}: {qty}")`, R`import json

item = input("Item: ")
qty = int(input("Qty: "))

try:
    with open("inventory.json") as f:
        inventory = json.load(f)
except FileNotFoundError:
    inventory = []

for entry in inventory:
    if entry["item"] == item:
        entry["qty"] += qty
        total = entry["qty"]
        break
else:
    inventory.append({"item": item, "qty": qty})
    total = qty

with open("inventory.json", "w") as f:
    json.dump(inventory, f)
print(f"{item}: {total}")`],
     hints:['Load with try/except (FileNotFoundError, json.JSONDecodeError) and fall back to [].','Loop the entries; if the item matches, add to qty. A for/else (or a flag) lets you append a new entry when none matched.','Save with json.dump and print the item and its total qty.','import json\n\nitem = input("Item: ")\nqty = int(input("Qty: "))\n\ntry:\n    with open("inventory.json") as f:\n        inventory = json.load(f)\nexcept (FileNotFoundError, json.JSONDecodeError):\n    inventory = []\n\nfor entry in inventory:\n    if entry["item"] == item:\n        entry["qty"] += qty\n        total = entry["qty"]\n        break\nelse:\n    inventory.append({"item": item, "qty": qty})\n    total = qty\n\nwith open("inventory.json", "w") as f:\n    json.dump(inventory, f)\nprint(f"{item}: {total}")'], tags:['r8-36','r8-37','r8-38']},
    {type:'mcq', code:R`import json
print(json.loads(json.dumps({"a": (1, 2)})))`, q:'Strike 5: What prints?', opts:["{'a': [1, 2]}","{'a': (1, 2)}",'{"a": [1, 2]}'], ans:0, why:'The tuple becomes a JSON array and returns as a list. print shows Python notation (single quotes).', tags:['r8-32']}
  ],
  power:{can:['Read, write and append files safely','Process CSV and JSON data with care for bad input'],
    expand:'Rebuild strike 4 as three functions (load, save, add) with a docstring each.',
    where:'Data in files is the bridge between programs and the real world.',
    next:'One more gate: the Gap Check for the Archive.'},
  codex:{title:'Realm 8 boss',body:'You can read and write files with with, handle missing and corrupt data, and move data through CSV and JSON.',snip:R`with open(path, "w") as f:
    json.dump(data, f)`}
},
{
  id:'r8-42', realm:8, n:42, title:'Gap Check: the Archive Trial', kind:'gap', passPct:80,
  teaches:['realm8-gap'], requires:['realm8-boss'],
  story:`The Wyrm collapses into a neat stack of labelled folders. Orrin stamps your hand with a tiny ink seal. "Eighty percent. Then the **Workshop** opens: the whole Python standard library, the tools other programmers already built for you."`,
  phases:[
    {type:'mcq', code:R`with open("x.txt", "w") as f:
    f.write("one")
    f.write("two")
print(open("x.txt").read())`, q:'What prints?', opts:['onetwo','one\ntwo','two'], ans:0, why:'write() adds exactly the text given, with no newline unless you include it.', tags:['r8-01']},
    {type:'mcq', code:R`with open("t.txt", "w") as f:
    f.write("hi")
print(f.closed)`, q:'What prints?', opts:['True','False','Error'], ans:0, why:'A with block closes the file when it ends.', tags:['r8-02']},
    {type:'mcq', code:R`text = "a\nb\n"
print(len(text.split("\n")), len(text.splitlines()))`, q:'What prints?', opts:['3 2','2 2','2 3'], ans:0, why:'split("\\n") leaves an empty string at the end; splitlines() does not.', tags:['r8-05']},
    {type:'mcq', code:R`with open("l.txt", "w") as f:
    f.write("A\n")
with open("l.txt", "a") as f:
    f.write("B\n")
print(open("l.txt").read().count("\n"))`, q:'What prints?', opts:['2','1','0'], ans:0, why:'Append mode keeps A and adds B, so two newlines.', tags:['r8-06']},
    {type:'mcq', code:R`try:
    open("ghost.txt")
except FileNotFoundError:
    print("none")
print("end")`, q:'What prints (in order)?', opts:['none end','end','none'], ans:0, why:'The error is caught, then the program carries on.', tags:['r8-09']},
    {type:'mcq', code:R`import csv
rows = list(csv.reader(["a,b", "", "1,2"]))
print(len(rows), rows[1])`, q:'What prints?', opts:['3 []','2 []','3 [\'\']'], ans:0, why:'A blank line becomes an empty row, so there are 3 rows and the second is [].', tags:['r8-19']},
    {type:'mcq', code:R`import csv
rows = list(csv.DictReader(["n,v", "a,1", "b,2"]))
print(rows[1]["v"])`, q:'What prints?', opts:['2','b','n'], ans:0, why:'The second data row is {"n": "b", "v": "2"}.', tags:['r8-21']},
    {type:'mcq', code:R`import csv
row = next(csv.DictReader(["n", "2"]))
print(row["n"] + row["n"])`, q:'What prints?', opts:['22','4','Error'], ans:0, why:'CSV values are strings, so + glues them together.', tags:['r8-22']},
    {type:'mcq', code:R`import json
print(json.dumps({"a": True, "b": None}))`, q:'What prints?', opts:['{"a": true, "b": null}','{"a": True, "b": None}','{\'a\': True, \'b\': None}'], ans:0, why:'JSON uses true, null and double quotes.', tags:['r8-31']},
    {type:'mcq', code:R`import json
print(json.loads(json.dumps({1: "a"})))`, q:'What prints?', opts:["{'1': 'a'}","{1: 'a'}",'Error'], ans:0, why:'JSON object keys are always strings.', tags:['r8-32']},
    {type:'write', pts:2, prompt:'Final trial: read `scores.csv` (`name,score`). Write `top.json` as a JSON list of the **names** of everyone whose score is 50 or more, sorted A-Z (rows with a missing or non-whole-number score are ignored). Print `Passed: <n>`.',
     starter:R`import csv
import json
`,
     files:{'scores.csv':'name,score\nZed,70\nAda,50\nBo,49\nCy,\nDi,x\nEd,90\n'},
     cases:[{inputs:[],files:{'scores.csv':'name,score\nZed,70\nAda,50\nBo,49\nCy,\nDi,x\nEd,90\n'},tests:[['top.json','json.loads(read("top.json"))==["Ada","Ed","Zed"]'],['Message','lines[-1]=="Passed: 3"']]},{inputs:[],files:{'scores.csv':'name,score\nAmy,10\n'},tests:[['Nobody','json.loads(read("top.json"))==[] and lines[-1]=="Passed: 0"']]},{inputs:[],files:{'scores.csv':'name,score\nB,100\nA,100\n'},tests:[['Sorted','json.loads(read("top.json"))==["A","B"]'],['Uses csv and json','"csv." in src and "json.dump" in src']]}],
     sol:R`import csv
import json

names = []
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        try:
            score = int((row.get("score") or "").strip())
        except ValueError:
            continue
        if score >= 50:
            names.append(row["name"])

names.sort()
with open("top.json", "w") as out:
    json.dump(names, out)
print("Passed:", len(names))`,
     wrong:[R`import csv
import json

names = []
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        try:
            score = int((row.get("score") or "").strip())
        except ValueError:
            continue
        if score >= 50:
            names.append(row["name"])

with open("top.json", "w") as out:
    json.dump(names, out)
print("Passed:", len(names))`, R`import csv
import json

names = []
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        try:
            score = int((row.get("score") or "").strip())
        except ValueError:
            continue
        if score > 50:
            names.append(row["name"])

names.sort()
with open("top.json", "w") as out:
    json.dump(names, out)
print("Passed:", len(names))`],
     hints:['DictReader, then int() the score inside a try; skip on ValueError.','Keep names with score >= 50, then sort them.','json.dump(names, out) and print the count.','import csv\nimport json\n\nnames = []\nwith open("scores.csv", newline="") as f:\n    for row in csv.DictReader(f):\n        try:\n            score = int((row.get("score") or "").strip())\n        except ValueError:\n            continue\n        if score >= 50:\n            names.append(row["name"])\n\nnames.sort()\nwith open("top.json", "w") as out:\n    json.dump(names, out)\nprint("Passed:", len(names))'], tags:['r8-22','r8-29','r8-33']}
  ],
  power:{can:['Read and write files safely','Parse CSV and JSON and handle bad data'],
    expand:'Pick the question you missed and write a similar one yourself.',
    where:'Reading, cleaning and writing files is most of what real scripts do.',
    next:'Next: the Workshop, where Python\'s standard library gives you ready-made tools.'},
  codex:{title:'Realm 8 gap check',body:'Files: with open, modes r/w/a, read/splitlines, FileNotFoundError. CSV: reader/DictReader/writer, strings. JSON: dumps/loads/dump/load.',snip:R`with open("x.json") as f:
    data = json.load(f)`}
}
);
