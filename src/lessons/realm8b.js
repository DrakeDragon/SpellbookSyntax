// REALM 8 — THE ARCHIVE — part B (lessons 10-18: file tools and the persistent to-do mission)
LESSONS.push(
{
  id:'r8-10', realm:8, n:10, title:'Paths: folders, names and extensions',
  teaches:['file-paths'], requires:['file-notfound'],
  story:`"A book's name is not enough," Orrin says, sliding a drawer open. "You need the **shelf**, the **title** and the **kind of binding**. Together that's a path, and Python can take it apart."`,
  concept:{
    html:`A **path** says where a file lives: \`reports/2026/jan.csv\`. Never glue paths together with \`+ "/" +\`; use \`os.path\`:\n\n\`\`\`\nimport os\n\nos.path.join("reports", "2026", "jan.csv")   # 'reports/2026/jan.csv'\nos.path.dirname("reports/2026/jan.csv")      # 'reports/2026'\nos.path.basename("reports/2026/jan.csv")     # 'jan.csv'\nos.path.splitext("jan.csv")                  # ('jan', '.csv')\n\`\`\`\n\n- \`join\` uses the right separator for the computer you are on.\n- \`splitext\` splits at the **last** dot: \`("archive.tar", ".gz")\` for \`archive.tar.gz\`.\n- A name with no dot has extension \`""\`; a name with no folder has \`dirname\` \`""\`.\n\nPython also has a modern tool, \`pathlib\`, which you will meet in the next Realm.`,
    analogy:`An address: street, house number, and which door.`,
    example:R`import os

path = "reports/2026/jan.csv"
print(os.path.dirname(path))
print(os.path.basename(path))
print(os.path.splitext(path)[1])`},
  predict:{code:R`import os
print(os.path.splitext("archive.tar.gz"))`, q:'What prints?', opts:["('archive.tar', '.gz')","('archive', '.tar.gz')","('archive.tar.gz', '')"], ans:0, why:'splitext cuts at the last dot only.'},
  cast:{code:R`import os

path = "reports/2026/jan.csv"
print(os.path.dirname(path))
print(os.path.basename(path))
print(os.path.splitext(path)[1])`, task:'Cast it, then try your own path.'},
  bug:{broken:R`import os
folder = "data"
name = "notes.txt"
path = folder + name
print(path)`, task:'The path comes out as datanotes.txt. Join them properly with os.path.join. Expected: data/notes.txt',
    cases:[{inputs:[],tests:[['Joined','lines==["data/notes.txt"]'],['Uses join','"os.path.join" in src']]}],
    sol:R`import os
folder = "data"
name = "notes.txt"
path = os.path.join(folder, name)
print(path)`, wrong:[R`import os
folder = "data"
name = "notes.txt"
path = folder + name
print(path)`]},
  write:{prompt:'Ask `Path: `. Print `Folder: <dirname>`, `Name: <basename>`, `Extension: <ext>`. If the folder or extension is empty, print `(none)` in its place.',
    starter:R`import os
path = input("Path: ")
`,
    inputs:['reports/2026/jan.csv'],
    cases:[{inputs:['reports/2026/jan.csv'],tests:[['Full path','lines[-3:]==["Folder: reports/2026","Name: jan.csv","Extension: .csv"]']]},{inputs:['readme'],tests:[['Bare name','lines[-3:]==["Folder: (none)","Name: readme","Extension: (none)"]']]},{inputs:['archive.tar.gz'],tests:[['Last dot','lines[-3:]==["Folder: (none)","Name: archive.tar.gz","Extension: .gz"]']]},{inputs:['a/b.txt'],tests:[['One folder','lines[-3:]==["Folder: a","Name: b.txt","Extension: .txt"]'],['Uses os.path','"os.path" in src']]}],
    sol:R`import os
path = input("Path: ")
folder = os.path.dirname(path) or "(none)"
name = os.path.basename(path)
ext = os.path.splitext(name)[1] or "(none)"
print("Folder:", folder)
print("Name:", name)
print("Extension:", ext)`,
    wrong:[R`path = input("Path: ")
parts = path.split("/")
folder = "/".join(parts[:-1]) or "(none)"
name = parts[-1]
ext = "." + name.split(".")[-1] if "." in name else "(none)"
print("Folder:", folder)
print("Name:", name)
print("Extension:", ext)`, R`import os
path = input("Path: ")
folder = os.path.dirname(path)
name = os.path.basename(path)
ext = os.path.splitext(name)[1]
print("Folder:", folder)
print("Name:", name)
print("Extension:", ext)`],
    hints:['dirname, basename and splitext(name)[1] give the three parts.','An empty string is falsy, so `os.path.dirname(path) or "(none)"` fills the gap.','Print each with its label.','import os\npath = input("Path: ")\nfolder = os.path.dirname(path) or "(none)"\nname = os.path.basename(path)\next = os.path.splitext(name)[1] or "(none)"\nprint("Folder:", folder)\nprint("Name:", name)\nprint("Extension:", ext)']},
  power:{can:['Build and take apart file paths safely','Find a file\'s extension reliably'],
    expand:'Change a file\'s extension: turn report.txt into report.md using splitext.',
    where:'Upload checkers, build tools and importers all sort files by their extension.',
    next:'Next: your first file tool, a word counter.'},
  codex:{title:'os.path',body:'join, dirname, basename, splitext. Use join instead of + "/" +.',snip:R`os.path.join("data", "notes.txt")`}
},
{
  id:'r8-11', realm:8, n:11, title:'A word counter for files',
  teaches:['file-wc'], requires:['file-paths'],
  story:`A scribe drops a heap of scrolls on your desk. "How long is each? **Lines, words, characters?** Count them all, and be exact, because we bill by the word."`,
  concept:{
    html:`The classic Unix tool \`wc\` counts lines, words and characters. You can build it from what you know:\n\n\`\`\`\nwith open("story.txt") as f:\n    text = f.read()\n\nlines = len(text.splitlines())\nwords = len(text.split())\nchars = len(text)\n\`\`\`\n\n- \`text.splitlines()\` counts lines correctly **even if the last line has no newline**.\n- \`text.split()\` (no argument) splits on any whitespace, so extra spaces and blank lines don't create empty words.\n- Counting \`"\\n"\` characters instead gives the wrong number for a file that doesn't end in a newline.\n\nTools like this are small, but they show the pattern: **read → compute → report**.`,
    analogy:`A shop assistant counting stock, shelf by shelf.`,
    example:R`text = "one two\nthree\n"
print(len(text.splitlines()), len(text.split()), len(text))`},
  predict:{code:R`text = "a b\nc"
print(text.count("\n"), len(text.splitlines()))`, q:'What prints?', opts:['1 2','2 2','1 1'], ans:0, why:'There is one newline character, but two lines, because the last line has no newline.'},
  cast:{code:R`with open("story.txt") as f:
    text = f.read()

print("Lines:", len(text.splitlines()))
print("Words:", len(text.split()))
print("Characters:", len(text))`, task:'Cast it.', files:{'story.txt':'Once upon a time\nthere was a ferret.\n'}},
  bug:{broken:R`with open("story.txt") as f:
    text = f.read()
print("Lines:", text.count("\n"))`, task:'The file has 2 lines but the last one has no final newline, so it reports 1. Count the lines properly.',
    files:{'story.txt':'one\ntwo'},
    cases:[{inputs:[],tests:[['Right count','lines==["Lines: 2"]']]}],
    sol:R`with open("story.txt") as f:
    text = f.read()
print("Lines:", len(text.splitlines()))`, wrong:[R`with open("story.txt") as f:
    text = f.read()
print("Lines:", text.count("\n"))`]},
  write:{prompt:'Ask `File: `. Print `Lines: n`, `Words: n`, `Characters: n` for that file. If it does not exist print `No such file: <name>`.',
    starter:R`name = input("File: ")
`,
    inputs:['story.txt'],
    files:{'story.txt':'Once upon a time\nthere was a ferret.\n'},
    cases:[{inputs:['story.txt'],files:{'story.txt':'Once upon a time\nthere was a ferret.\n'},tests:[['Counts','lines[-3:]==["Lines: 2","Words: 8","Characters: 37"]']]},{inputs:['a.txt'],files:{'a.txt':'one\ntwo'},tests:[['No final newline','lines[-3:]==["Lines: 2","Words: 2","Characters: 7"]']]},{inputs:['e.txt'],files:{'e.txt':''},tests:[['Empty','lines[-3:]==["Lines: 0","Words: 0","Characters: 0"]']]},{inputs:['gone.txt'],files:{'a.txt':'x'},tests:[['Missing','lines[-1]=="No such file: gone.txt"']]},{inputs:['sp.txt'],files:{'sp.txt':'  a   b  \n\n  c\n'},tests:[['Messy spacing','lines[-3:]==["Lines: 3","Words: 3","Characters: 15"]']]}],
    sol:R`name = input("File: ")
try:
    with open(name) as f:
        text = f.read()
except FileNotFoundError:
    print("No such file:", name)
else:
    print("Lines:", len(text.splitlines()))
    print("Words:", len(text.split()))
    print("Characters:", len(text))`,
    wrong:[R`name = input("File: ")
try:
    with open(name) as f:
        text = f.read()
except FileNotFoundError:
    print("No such file:", name)
else:
    print("Lines:", text.count("\n"))
    print("Words:", len(text.split(" ")))
    print("Characters:", len(text))`, R`name = input("File: ")
try:
    with open(name) as f:
        text = f.read()
except FileNotFoundError:
    print("No such file:", name)
else:
    print("Lines:", len(text.splitlines()))
    print("Words:", len(text.split()))
    print("Characters:", len(text.strip()))`],
    hints:['Read the whole file in a try, with except FileNotFoundError.','Lines: len(text.splitlines()). Words: len(text.split()). Characters: len(text).','Put the printing in the else block so it only runs when the file opened.','name = input("File: ")\ntry:\n    with open(name) as f:\n        text = f.read()\nexcept FileNotFoundError:\n    print("No such file:", name)\nelse:\n    print("Lines:", len(text.splitlines()))\n    print("Words:", len(text.split()))\n    print("Characters:", len(text))']},
  power:{can:['Build a real command-line style tool','Count lines, words and characters exactly'],
    expand:'Also print the longest line and its length.',
    where:'wc, grep and cat are the same idea: read, compute, report.',
    next:'Next: summing numbers stored in a file.'},
  codex:{title:'Counting text',body:'len(text.splitlines()), len(text.split()), len(text). Don\'t count \\n characters for lines.',snip:R`len(text.splitlines())`}
},
{
  id:'r8-12', realm:8, n:12, title:'Numbers in a file',
  teaches:['file-numbers'], requires:['file-wc','err-multi'],
  story:`Orrin unrolls a ledger. "Each line is a number: coins taken in each day. Some clerks wrote **words** in it. Total the honest lines and tell me about the rest."`,
  concept:{
    html:`File lines are always **text**. To do maths you convert them, and real files contain surprises (blank lines, words, typos):\n\n\`\`\`\ntotal = 0\ncount = 0\nwith open("coins.txt") as f:\n    for line in f:\n        text = line.strip()\n        if text == "":\n            continue              # blank: ignore quietly\n        try:\n            total += float(text)\n            count += 1\n        except ValueError:\n            print("Skipped:", text)\n\`\`\`\n\n- \`float(text)\` handles \`"4"\`, \`"-2.5"\` and \`"1e3"\`.\n- Report skipped lines instead of hiding them. That is how you find data problems.\n- Guard the average: dividing by zero when nothing was valid is a bug.`,
    analogy:`Counting a till, setting aside anything that isn't money.`,
    example:R`total = 0
for text in ["4", "x", "6.5"]:
    try:
        total += float(text)
    except ValueError:
        print("Skipped:", text)
print(total)`},
  predict:{code:R`values = []
for t in ["3", "", "x", "5"]:
    try:
        values.append(float(t))
    except ValueError:
        pass
print(len(values))`, q:'What prints?', opts:['2','4','3'], ans:0, why:'Both "" and "x" raise ValueError and are skipped, leaving 3 and 5.'},
  cast:{code:R`total = 0
count = 0
with open("coins.txt") as f:
    for line in f:
        text = line.strip()
        if text == "":
            continue
        try:
            total += float(text)
            count += 1
        except ValueError:
            print("Skipped:", text)

print("Count:", count)
print("Total:", total)`, task:'Cast it.', files:{'coins.txt':'12\n8.5\nbroken\n\n3\n'}},
  bug:{broken:R`total = 0
with open("coins.txt") as f:
    for line in f:
        total += line
print(total)`, task:'TypeError: lines are text, not numbers. Convert each line to float before adding. Expected: 15.5',
    files:{'coins.txt':'10\n5.5\n'},
    cases:[{inputs:[],tests:[['Total','lines==["15.5"]']]}],
    sol:R`total = 0
with open("coins.txt") as f:
    for line in f:
        total += float(line)
print(total)`, wrong:[R`total = 0
with open("coins.txt") as f:
    for line in f:
        total += line
print(total)`]},
  write:{prompt:'Read `coins.txt` (one number per line). Ignore blank lines. For any other line that is not a number print `Skipped: <text>`. Then print `Count: n`, `Total: t` and `Average: a`, with t and a to 2 decimals. If no numbers were valid print `No numbers` instead of the last three.',
    starter:R`# total the numbers in coins.txt
`,
    files:{'coins.txt':'12\n8.5\nbroken\n\n3\n'},
    cases:[{inputs:[],files:{'coins.txt':'12\n8.5\nbroken\n\n3\n'},tests:[['Mixed','lines==["Skipped: broken","Count: 3","Total: 23.50","Average: 7.83"]']]},{inputs:[],files:{'coins.txt':'4\n6\n'},tests:[['Clean','lines==["Count: 2","Total: 10.00","Average: 5.00"]']]},{inputs:[],files:{'coins.txt':'a\nb\n'},tests:[['None valid','lines==["Skipped: a","Skipped: b","No numbers"]']]},{inputs:[],files:{'coins.txt':'\n\n'},tests:[['Only blanks','lines==["No numbers"]']]},{inputs:[],files:{'coins.txt':'-2\n 4 \n1e1\n'},tests:[['Negative, spaces, exponent','lines==["Count: 3","Total: 12.00","Average: 4.00"]']]}],
    sol:R`total = 0
count = 0
with open("coins.txt") as f:
    for line in f:
        text = line.strip()
        if text == "":
            continue
        try:
            total += float(text)
            count += 1
        except ValueError:
            print("Skipped:", text)

if count == 0:
    print("No numbers")
else:
    print("Count:", count)
    print(f"Total: {total:.2f}")
    print(f"Average: {total / count:.2f}")`,
    wrong:[R`total = 0
count = 0
with open("coins.txt") as f:
    for line in f:
        text = line.strip()
        if text.isdigit():
            total += float(text)
            count += 1
        elif text != "":
            print("Skipped:", text)

if count == 0:
    print("No numbers")
else:
    print("Count:", count)
    print(f"Total: {total:.2f}")
    print(f"Average: {total / count:.2f}")`, R`total = 0
count = 0
with open("coins.txt") as f:
    for line in f:
        text = line.strip()
        if text == "":
            continue
        try:
            total += float(text)
            count += 1
        except ValueError:
            print("Skipped:", text)

print("Count:", count)
print(f"Total: {total:.2f}")
print(f"Average: {total / count:.2f}")`],
    hints:['Loop the lines; strip; continue on blank lines.','try: total += float(text); count += 1. except ValueError: print("Skipped:", text).','After the loop: if count == 0: print("No numbers") else print the three lines with :.2f.','total = 0\ncount = 0\nwith open("coins.txt") as f:\n    for line in f:\n        text = line.strip()\n        if text == "":\n            continue\n        try:\n            total += float(text)\n            count += 1\n        except ValueError:\n            print("Skipped:", text)\n\nif count == 0:\n    print("No numbers")\nelse:\n    print("Count:", count)\n    print(f"Total: {total:.2f}")\n    print(f"Average: {total / count:.2f}")']},
  power:{can:['Do arithmetic on numbers stored in files','Report bad data rather than hiding it'],
    expand:'Print the smallest and largest valid number too.',
    where:'Expense trackers, lab logs and sensor readers all start as numbers in a file.',
    next:'Next: transforming one file into another.'},
  codex:{title:'Numbers from files',body:'Lines are text: convert with float(). Skip blanks, catch ValueError, report skipped lines, guard the average.',snip:R`try: total += float(text)
except ValueError: ...`}
},
{
  id:'r8-13', realm:8, n:13, title:'Transform one file into another',
  teaches:['file-copy'], requires:['file-numbers'],
  story:`"Never edit the original scroll," Orrin says. "Copy it, change the copy, leave the master untouched. That is how an Archive earns trust."`,
  concept:{
    html:`A common pattern: **read** a source file, **transform** each line, **write** a new file.\n\n\`\`\`\nwith open("source.txt") as f:\n    lines = f.read().splitlines()\n\nwith open("shout.txt", "w") as out:\n    for line in lines:\n        out.write(line.upper() + "!\\n")\n\`\`\`\n\n- Read **first**, then write. Opening the same name with \`"w"\` while still reading it would erase it.\n- You can have two \`with\` blocks one after another, or nest them.\n- Keep the original file untouched: write to a new name.\n- Report what you did: \`Wrote 3 lines\`.`,
    analogy:`A photocopier: the original stays on the shelf.`,
    example:R`with open("source.txt") as f:
    lines = f.read().splitlines()

with open("shout.txt", "w") as out:
    for line in lines:
        out.write(line.upper() + "!\n")

print("Wrote", len(lines), "lines")`},
  predict:{code:R`with open("a.txt", "w") as f:
    f.write("x\n")
with open("b.txt", "w") as g:
    for line in open("a.txt"):
        g.write(line.upper())
print(open("b.txt").read().strip(), open("a.txt").read().strip())`, q:'What prints?', opts:['X x','X X','x x'], ans:0, why:'b.txt got the upper-case copy; a.txt is unchanged.'},
  cast:{code:R`with open("source.txt") as f:
    lines = f.read().splitlines()

with open("shout.txt", "w") as out:
    for line in lines:
        out.write(line.upper() + "!\n")

print("Wrote", len(lines), "lines")`, task:'Cast it.', files:{'source.txt':'hello\nworld\n'}},
  bug:{broken:R`with open("source.txt", "w") as out:
    for line in open("source.txt"):
        out.write(line.upper())
print("done")`, task:'Opening source.txt for writing erases it before it is read. Read the lines first, then write them to shout.txt instead.',
    files:{'source.txt':'hello\nworld\n'},
    cases:[{inputs:[],tests:[['Source safe','read("source.txt")=="hello\\nworld\\n"'],['Copy made','read("shout.txt")=="HELLO\\nWORLD\\n"']]}],
    sol:R`with open("source.txt") as f:
    lines = f.read().splitlines()
with open("shout.txt", "w") as out:
    for line in lines:
        out.write(line.upper() + "\n")
print("done")`, wrong:[R`with open("source.txt", "w") as out:
    for line in open("source.txt"):
        out.write(line.upper())
print("done")`]},
  write:{prompt:'Read `source.txt`. Write `shout.txt` with every line UPPER CASE and a `!` on the end. Skip blank lines. Leave `source.txt` untouched. Print `Wrote <n> lines`.',
    starter:R`# copy source.txt into shout.txt, shouting
`,
    files:{'source.txt':'hello\nworld\n'},
    cases:[{inputs:[],files:{'source.txt':'hello\nworld\n'},tests:[['Copy','read("shout.txt")=="HELLO!\\nWORLD!\\n"'],['Source untouched','read("source.txt")=="hello\\nworld\\n"'],['Message','lines[-1]=="Wrote 2 lines"']]},{inputs:[],files:{'source.txt':'a\n\nb\n\n'},tests:[['Skips blanks','read("shout.txt")=="A!\\nB!\\n" and lines[-1]=="Wrote 2 lines"']]},{inputs:[],files:{'source.txt':'Mixed Case here'},tests:[['No final newline in source','read("shout.txt")=="MIXED CASE HERE!\\n" and read("source.txt")=="Mixed Case here"']]},{inputs:[],files:{'source.txt':''},tests:[['Empty','read("shout.txt")=="" and lines[-1]=="Wrote 0 lines"']]}],
    sol:R`with open("source.txt") as f:
    lines = f.read().splitlines()

count = 0
with open("shout.txt", "w") as out:
    for line in lines:
        if line.strip() == "":
            continue
        out.write(line.upper() + "!\n")
        count += 1
print("Wrote", count, "lines")`,
    wrong:[R`with open("source.txt") as f:
    lines = f.read().splitlines()

with open("shout.txt", "w") as out:
    for line in lines:
        out.write(line.upper() + "!\n")
print("Wrote", len(lines), "lines")`, R`with open("source.txt") as f:
    lines = f.read().splitlines()

count = 0
with open("source.txt", "w") as out:
    for line in lines:
        if line.strip() == "":
            continue
        out.write(line.upper() + "!\n")
        count += 1
print("Wrote", count, "lines")`],
    hints:['Read the lines first into a list.','Open shout.txt with "w". For each non-blank line write line.upper() + "!\\n".','Keep a counter for the message.','with open("source.txt") as f:\n    lines = f.read().splitlines()\n\ncount = 0\nwith open("shout.txt", "w") as out:\n    for line in lines:\n        if line.strip() == "":\n            continue\n        out.write(line.upper() + "!\\n")\n        count += 1\nprint("Wrote", count, "lines")']},
  power:{can:['Transform data from one file into another','Protect the original by writing a new file'],
    expand:'Make the new file name from the old one with splitext (notes.txt → notes_shout.txt).',
    where:'Converters, exporters and cleaners are all read-transform-write.',
    next:'Next: the last few lines of a file (tail).'},
  codex:{title:'Read → transform → write',body:'Read first, then write to a NEW file. Never open the source with "w".',snip:R`with open("out.txt", "w") as out:
    out.write(line.upper() + "\n")`}
},
{
  id:'r8-14', realm:8, n:14, title:'Tail: the last N lines',
  teaches:['file-tail'], requires:['file-copy'],
  story:`"The newest news is at the *bottom* of the log," Orrin says. "Nobody reads ten thousand lines. Show me just the **last few**."`,
  concept:{
    html:`Use a list slice from the end:\n\n\`\`\`\nlines = text.splitlines()\nlast_three = lines[-3:]\n\`\`\`\n\n- If the file has fewer than 3 lines, \`lines[-3:]\` simply gives all of them. No error.\n- **Trap:** \`lines[-0:]\` is the same as \`lines[0:]\`, which is **everything**. For N = 0 you must handle it yourself.\n- Always validate N: it must be a whole number, and not negative.\n\nThis "show only the end" idea is how \`tail\` and log viewers work.`,
    analogy:`Turning to the last pages of a diary.`,
    example:R`lines = ["a", "b", "c", "d", "e"]
print(lines[-3:])
print(lines[-9:])
print(lines[-0:])`},
  predict:{code:R`items = [1, 2, 3, 4]
n = 0
print(items[-n:])`, q:'What prints?', opts:['[1, 2, 3, 4]','[]','[4]'], ans:0, why:'-0 is just 0, so the slice starts at the beginning and returns everything.'},
  cast:{code:R`with open("log.txt") as f:
    lines = f.read().splitlines()
for line in lines[-3:]:
    print(line)`, task:'Cast it.', files:{'log.txt':'boot\nlogin\nclick\nclick\nlogout\n'}},
  bug:{broken:R`n = 0
lines = ["a", "b", "c"]
for line in lines[-n:]:
    print(line)
print("end")`, task:'Asking for the last 0 lines prints everything. It should print only end.',
    cases:[{inputs:[],tests:[['Nothing before end','lines==["end"]']]}],
    sol:R`n = 0
lines = ["a", "b", "c"]
if n > 0:
    for line in lines[-n:]:
        print(line)
print("end")`, wrong:[R`n = 0
lines = ["a", "b", "c"]
for line in lines[-n:]:
    print(line)
print("end")`]},
  write:{prompt:'Ask `N: `. Print the last N lines of `log.txt`, one per line. If the file is shorter, print all. If N is 0, print nothing. If N is not a whole number, or is negative, print `Invalid N`.',
    starter:R`text_n = input("N: ")
`,
    inputs:['3'],
    files:{'log.txt':'boot\nlogin\nclick\nclick\nlogout\n'},
    cases:[{inputs:['3'],files:{'log.txt':'boot\nlogin\nclick\nclick\nlogout\n'},tests:[['Last three','[l for l in lines if l!="N: 3"]==["click","click","logout"]']]},{inputs:['10'],files:{'log.txt':'a\nb\n'},tests:[['Short file','[l for l in lines if l!="N: 10"]==["a","b"]']]},{inputs:['0'],files:{'log.txt':'a\nb\n'},tests:[['Zero','[l for l in lines if l!="N: 0"]==[]']]},{inputs:['x'],files:{'log.txt':'a\n'},tests:[['Not a number','lines[-1]=="Invalid N"']]},{inputs:['-2'],files:{'log.txt':'a\nb\n'},tests:[['Negative','lines[-1]=="Invalid N"']]},{inputs:['1'],files:{'log.txt':'a\nb\nc'},tests:[['No final newline','lines[-1]=="c"']]}],
    sol:R`text_n = input("N: ")
try:
    n = int(text_n)
except ValueError:
    n = -1
if n < 0:
    print("Invalid N")
elif n > 0:
    with open("log.txt") as f:
        lines = f.read().splitlines()
    for line in lines[-n:]:
        print(line)`,
    wrong:[R`text_n = input("N: ")
try:
    n = int(text_n)
except ValueError:
    n = -1
if n < 0:
    print("Invalid N")
else:
    with open("log.txt") as f:
        lines = f.read().splitlines()
    for line in lines[-n:]:
        print(line)`, R`text_n = input("N: ")
n = int(text_n)
with open("log.txt") as f:
    lines = f.read().splitlines()
for line in lines[-n:]:
    print(line)`],
    hints:['Convert N inside try/except ValueError and treat a failure as invalid.','Negative or invalid: print Invalid N. Zero: print nothing. Only slice when n > 0.','lines[-n:] then loop and print.','text_n = input("N: ")\ntry:\n    n = int(text_n)\nexcept ValueError:\n    n = -1\nif n < 0:\n    print("Invalid N")\nelif n > 0:\n    with open("log.txt") as f:\n        lines = f.read().splitlines()\n    for line in lines[-n:]:\n        print(line)']},
  power:{can:['Show the end of a file with a negative slice','Spot the -0 slice trap'],
    expand:'Add a `head` version that shows the first N lines.',
    where:'Operations teams read the tail of logs every day.',
    next:'Next: searching a file for a word.'},
  codex:{title:'tail',body:'lines[-n:] gives the last n. Beware n = 0: lines[-0:] is everything.',snip:R`lines[-3:]`}
},
{
  id:'r8-15', realm:8, n:15, title:'Search a file: grep',
  teaches:['file-grep'], requires:['file-tail'],
  story:`"A needle in ten thousand lines," Orrin sighs. "**Find the word, and tell me which line it was on**, so I can go look."`,
  concept:{
    html:`\`grep\` prints the lines containing a word, with their line numbers:\n\n\`\`\`\nword = "error"\nmatches = 0\nwith open("log.txt") as f:\n    for number, line in enumerate(f, 1):\n        if word in line.lower():\n            print(f"{number}: {line.strip()}")\n            matches += 1\nprint("Matches:", matches)\n\`\`\`\n\n- \`enumerate(f, 1)\` numbers **every** line, so a match on line 7 reports 7 even if only 2 lines match.\n- Lower-case the line (and the word) for a **case-insensitive** search.\n- Do not use the match count as the line number; those are different things.`,
    analogy:`Running a highlighter down the page and noting the page number.`,
    example:R`lines = ["OK", "Error: disk", "OK", "error again"]
for number, line in enumerate(lines, 1):
    if "error" in line.lower():
        print(number, line)`},
  predict:{code:R`for n, line in enumerate(["a", "b", "c"], 1):
    if line != "b":
        print(n)`, q:'What prints?', opts:['1\n3','1\n2','2'], ans:0, why:'enumerate numbers all lines, so "c" is line 3 even though "b" was skipped.'},
  cast:{code:R`word = "error"
matches = 0
with open("log.txt") as f:
    for number, line in enumerate(f, 1):
        if word in line.lower():
            print(f"{number}: {line.strip()}")
            matches += 1
print("Matches:", matches)`, task:'Cast it.', files:{'log.txt':'ok\nError: disk full\nok\nerror again\n'}},
  bug:{broken:R`word = "error"
count = 0
with open("log.txt") as f:
    for line in f:
        if word in line.lower():
            count += 1
            print(f"{count}: {line.strip()}")`, task:'The numbers are match counts (1, 2), not line numbers (2, 4). Report the real line number.',
    files:{'log.txt':'ok\nError: disk full\nok\nerror again\n'},
    cases:[{inputs:[],tests:[['Real line numbers','lines==["2: Error: disk full","4: error again"]']]}],
    sol:R`word = "error"
with open("log.txt") as f:
    for number, line in enumerate(f, 1):
        if word in line.lower():
            print(f"{number}: {line.strip()}")`, wrong:[R`word = "error"
count = 0
with open("log.txt") as f:
    for line in f:
        if word in line.lower():
            count += 1
            print(f"{count}: {line.strip()}")`]},
  write:{prompt:'Ask `Word: `. Search `log.txt` (ignoring case) and print each matching line as `<line number>: <line>`. Finish with `Matches: <n>`. If the file is missing print `No log file`.',
    starter:R`word = input("Word: ").lower()
`,
    inputs:['error'],
    files:{'log.txt':'ok\nError: disk full\nok\nerror again\n'},
    cases:[{inputs:['error'],files:{'log.txt':'ok\nError: disk full\nok\nerror again\n'},tests:[['Matches','lines[1:]==["2: Error: disk full","4: error again","Matches: 2"]']]},{inputs:['ERROR'],files:{'log.txt':'fine\nan error\n'},tests:[['Upper-case search','lines[1:]==["2: an error","Matches: 1"]']]},{inputs:['zzz'],files:{'log.txt':'a\nb\n'},tests:[['None found','lines[1:]==["Matches: 0"]']]},{inputs:['x'],files:{},tests:[['No file','lines[-1]=="No log file"']]},{inputs:['a'],files:{'log.txt':'\n\n  A  \n'},tests:[['Blank lines count in numbering','lines[1:]==["3: A","Matches: 1"]']]}],
    sol:R`word = input("Word: ").lower()
try:
    with open("log.txt") as f:
        matches = 0
        for number, line in enumerate(f, 1):
            if word in line.lower():
                print(f"{number}: {line.strip()}")
                matches += 1
    print("Matches:", matches)
except FileNotFoundError:
    print("No log file")`,
    wrong:[R`word = input("Word: ").lower()
try:
    with open("log.txt") as f:
        matches = 0
        for number, line in enumerate(f, 1):
            if word in line:
                print(f"{number}: {line.strip()}")
                matches += 1
    print("Matches:", matches)
except FileNotFoundError:
    print("No log file")`, R`word = input("Word: ").lower()
try:
    with open("log.txt") as f:
        matches = 0
        for line in f:
            if word in line.lower():
                matches += 1
                print(f"{matches}: {line.strip()}")
    print("Matches:", matches)
except FileNotFoundError:
    print("No log file")`],
    hints:['Wrap everything in try/except FileNotFoundError.','enumerate(f, 1) gives the real line number; compare word in line.lower().','Print f"{number}: {line.strip()}" and count matches separately.','word = input("Word: ").lower()\ntry:\n    with open("log.txt") as f:\n        matches = 0\n        for number, line in enumerate(f, 1):\n            if word in line.lower():\n                print(f"{number}: {line.strip()}")\n                matches += 1\n    print("Matches:", matches)\nexcept FileNotFoundError:\n    print("No log file")']},
  power:{can:['Search a file and report line numbers','Search without worrying about case'],
    expand:'Print one line of context before each match.',
    where:'grep is one of the most-used tools in all of computing; you just built it.',
    next:'Next: working with folders.'},
  codex:{title:'grep',body:'enumerate(f, 1) for real line numbers. word in line.lower() for a case-insensitive match.',snip:R`for number, line in enumerate(f, 1):`}
},
{
  id:'r8-16', realm:8, n:16, title:'Folders: list, make, move, delete',
  teaches:['file-folders'], requires:['file-grep'],
  story:`The Archive has a messy back room: papers heaped on the floor. Orrin hands you a ribbon of labels. "Make **shelves** (folders). Sort the papers onto them."`,
  concept:{
    html:`More \`os\` tools for whole folders:\n\n\`\`\`\nimport os\n\nos.listdir(".")                       # names in a folder (any order!)\nos.makedirs("logs", exist_ok=True)    # make a folder; fine if it exists\nos.rename("a.log", "logs/a.log")      # move or rename\nos.remove("old.txt")                  # delete a file\nos.path.isdir("logs")                 # is it a folder?\n\`\`\`\n\n- \`os.listdir\` order is **not guaranteed**: wrap it in \`sorted(...)\` when output order matters.\n- \`exist_ok=True\` prevents an error when the folder is already there.\n- \`os.remove\` deletes **permanently**. Check twice, delete once.\n- Use \`os.path.join("logs", name)\` for the destination.`,
    analogy:`Sorting papers into labelled shelves.`,
    example:R`import os

os.makedirs("logs", exist_ok=True)
print(os.path.isdir("logs"))
print(sorted(os.listdir(".")))`},
  predict:{code:R`import os
os.makedirs("a", exist_ok=True)
os.makedirs("a", exist_ok=True)
print(os.path.isdir("a"))`, q:'What prints?', opts:['True','False','Error'], ans:0, why:'exist_ok=True means asking for an existing folder is not an error.'},
  cast:{code:R`import os

os.makedirs("logs", exist_ok=True)
print(os.path.isdir("logs"))
print(sorted(os.listdir(".")))`, task:'Cast it.', files:{'a.txt':'x','c.log':'y'}},
  bug:{broken:R`import os
os.rename("c.log", "logs/c.log")
print(os.path.exists("logs/c.log"))`, task:'FileNotFoundError: the logs folder does not exist yet. Create it first.',
    files:{'c.log':'y'},
    cases:[{inputs:[],tests:[['Moved','lines==["True"]']]}],
    sol:R`import os
os.makedirs("logs", exist_ok=True)
os.rename("c.log", "logs/c.log")
print(os.path.exists("logs/c.log"))`, wrong:[R`import os
os.rename("c.log", "logs/c.log")
print(os.path.exists("logs/c.log"))`]},
  write:{prompt:'Make a folder called `logs` (fine if it already exists). Move every file in the current folder whose name ends in `.log` into it. Print `Moved: <name>` for each (in alphabetical order), then `Moved <n> file(s)`.',
    starter:R`import os
`,
    files:{'a.txt':'x','c.log':'y','b.log':'z'},
    cases:[{inputs:[],files:{'a.txt':'x','c.log':'y','b.log':'z'},tests:[['Output','lines==["Moved: b.log","Moved: c.log","Moved 2 file(s)"]'],['Moved','exists("logs/b.log") and exists("logs/c.log") and not exists("b.log") and not exists("c.log")'],['Others stay','sorted(listdir())==["a.txt","logs"]']]},{inputs:[],files:{'a.txt':'x'},tests:[['None to move','lines==["Moved 0 file(s)"] and exists("logs") and sorted(listdir())==["a.txt","logs"]']]},{inputs:[],files:{'one.log':'1','two.LOG':'2','x.log.txt':'3'},tests:[['Exact ending only','lines==["Moved: one.log","Moved 1 file(s)"] and sorted(listdir())==["logs","two.LOG","x.log.txt"]']]},{inputs:[],files:{'a.log':'keep me'},tests:[['Content kept','read("logs/a.log")=="keep me"']]}],
    sol:R`import os

os.makedirs("logs", exist_ok=True)
moved = 0
for name in sorted(os.listdir(".")):
    if os.path.isfile(name) and name.endswith(".log"):
        os.rename(name, os.path.join("logs", name))
        print("Moved:", name)
        moved += 1
print("Moved", moved, "file(s)")`,
    wrong:[R`import os

os.makedirs("logs", exist_ok=True)
moved = 0
for name in sorted(os.listdir(".")):
    if os.path.isfile(name) and ".log" in name:
        os.rename(name, os.path.join("logs", name))
        print("Moved:", name)
        moved += 1
print("Moved", moved, "file(s)")`, R`import os

os.makedirs("logs", exist_ok=True)
moved = 0
for name in os.listdir("."):
    if os.path.isfile(name) and name.endswith(".log"):
        os.rename(name, os.path.join("logs", name))
        print("Moved:", name)
        moved += 1
print("Moved", moved, "file(s)")
print(sorted(os.listdir(".")) == ["x"])`],
    hints:['os.makedirs("logs", exist_ok=True) first.','Loop over sorted(os.listdir(".")). Check os.path.isfile(name) and name.endswith(".log").','os.rename(name, os.path.join("logs", name)), then print and count.','import os\n\nos.makedirs("logs", exist_ok=True)\nmoved = 0\nfor name in sorted(os.listdir(".")):\n    if os.path.isfile(name) and name.endswith(".log"):\n        os.rename(name, os.path.join("logs", name))\n        print("Moved:", name)\n        moved += 1\nprint("Moved", moved, "file(s)")']},
  power:{can:['List, create, move and test folders from code','Sort files into folders automatically'],
    expand:'Move files into folders named after their extension (txt, log, csv).',
    where:'File organisers, backups and download sorters are built on exactly these calls.',
    next:'Next: Real-World Mission: the To-Do Keeper.'},
  codex:{title:'Folders',body:'os.listdir, os.makedirs(exist_ok=True), os.rename, os.remove, os.path.isdir. Sort listdir results.',snip:R`os.makedirs("logs", exist_ok=True)`}
},
{
  id:'r8-17', realm:8, n:17, title:'Real-World Mission: The To-Do Keeper',
  teaches:['mission8a'], requires:['file-folders','dict-edit'],
  story:`A tired baker slumps across the counter. "Every morning I write my jobs on a napkin, and every night the napkin is lost. Make me a to-do list that **remembers**, even when the program is closed."`,
  concept:{
    html:`**Mission brief:** a to-do list kept in \`todo.txt\` (one task per line). Loop asking \`Cmd: \`:\n\n| Command | Output |\n|---|---|\n| \`add <text>\` | adds the task, prints \`Added: <text>\` |\n| \`add\` (no text) | \`Usage: add <text>\` |\n| \`list\` | \`1. first\`, \`2. second\` ... or \`Nothing to do\` |\n| \`done <n>\` | removes task n (counting from 1), prints \`Done: <text>\` |\n| \`done\` with a bad number | \`No such task\` |\n| \`quit\` | prints \`Saved\` and stops |\n| anything else | \`Unknown command\` |\n\nThe list must be **loaded from the file when the program starts** (no file yet means an empty list) and **saved to the file after every change**.\n\nTip: \`cmd, _, rest = line.partition(" ")\` splits off the first word and keeps the rest intact.`,
    analogy:`A napkin that can't be lost.`,
    example:R`line = "add feed the ferret"
cmd, _, rest = line.partition(" ")
print(cmd)
print(rest.strip())`},
  predict:{code:R`cmd, _, rest = "done 2".partition(" ")
print(cmd, repr(rest))
cmd, _, rest = "list".partition(" ")
print(cmd, repr(rest))`, q:'What prints?', opts:["done '2'\nlist ''","done 2\nlist","done ' 2'\nlist ' '"], ans:0, why:'partition splits at the first space; with no space, rest is an empty string.'},
  cast:{code:R`line = "add feed the ferret"
cmd, _, rest = line.partition(" ")
print(cmd)
print(rest.strip())`, task:'Cast it.'},
  bug:{broken:R`tasks = ["a", "b", "c"]
n = int("2")
removed = tasks.pop(n)
print("Done:", removed)`, task:'Task numbers count from 1 for the user, but lists count from 0. Remove the 2nd task (b). Expected: Done: b',
    cases:[{inputs:[],tests:[['Right task','lines==["Done: b"]']]}],
    sol:R`tasks = ["a", "b", "c"]
n = int("2")
removed = tasks.pop(n - 1)
print("Done:", removed)`, wrong:[R`tasks = ["a", "b", "c"]
n = int("2")
removed = tasks.pop(n)
print("Done:", removed)`]},
  write:{prompt:'Build the To-Do Keeper exactly as the brief says. Load `todo.txt` at the start (missing file = empty list) and save after every change.',
    starter:R`# load todo.txt, then run the Cmd: loop
`,
    inputs:['list','add feed Sudo','list','quit'],
    files:{'todo.txt':'sweep\n'},
    cases:[{inputs:['list','add feed Sudo','add write spell','list','done 1','done 9','done x','list','bogus','add','quit'],files:{'todo.txt':'sweep\n'},tests:[['Whole session','[l for l in lines if not l.startswith("Cmd: ")]==["1. sweep","Added: feed Sudo","Added: write spell","1. sweep","2. feed Sudo","3. write spell","Done: sweep","No such task","No such task","1. feed Sudo","2. write spell","Unknown command","Usage: add <text>","Saved"]'],['Saved file','read("todo.txt")=="feed Sudo\\nwrite spell\\n"']]},{inputs:['list','add a','quit'],files:{},tests:[['No file yet','[l for l in lines if not l.startswith("Cmd: ")]==["Nothing to do","Added: a","Saved"]'],['File created','read("todo.txt")=="a\\n"']]},{inputs:['done 1','done 0','quit'],files:{'todo.txt':'only\n'},tests:[['Edge numbers','[l for l in lines if not l.startswith("Cmd: ")]==["Done: only","No such task","Saved"]'],['Empty list saved','read("todo.txt")==""']]},{inputs:['add  spaced  out ','list','quit'],files:{},tests:[['Text trimmed','"Added: spaced  out" in lines and "1. spaced  out" in lines']]},{inputs:['done -1','quit'],files:{'todo.txt':'x\ny\n'},tests:[['Negative number','"No such task" in lines and read("todo.txt")=="x\\ny\\n"']]}],
    sol:R`import os

def load_tasks():
    try:
        with open("todo.txt") as f:
            return f.read().splitlines()
    except FileNotFoundError:
        return []

def save_tasks(tasks):
    with open("todo.txt", "w") as f:
        for task in tasks:
            f.write(task + "\n")

tasks = load_tasks()
while True:
    line = input("Cmd: ")
    cmd, _, rest = line.partition(" ")
    rest = rest.strip()
    if cmd == "quit":
        save_tasks(tasks)
        print("Saved")
        break
    elif cmd == "add":
        if rest == "":
            print("Usage: add <text>")
        else:
            tasks.append(rest)
            save_tasks(tasks)
            print("Added:", rest)
    elif cmd == "list":
        if not tasks:
            print("Nothing to do")
        for i, task in enumerate(tasks, 1):
            print(f"{i}. {task}")
    elif cmd == "done":
        if rest.isdigit() and 1 <= int(rest) <= len(tasks):
            removed = tasks.pop(int(rest) - 1)
            save_tasks(tasks)
            print("Done:", removed)
        else:
            print("No such task")
    else:
        print("Unknown command")`,
    wrong:[R`def load_tasks():
    try:
        with open("todo.txt") as f:
            return f.read().splitlines()
    except FileNotFoundError:
        return []

tasks = load_tasks()
while True:
    line = input("Cmd: ")
    cmd, _, rest = line.partition(" ")
    rest = rest.strip()
    if cmd == "quit":
        print("Saved")
        break
    elif cmd == "add":
        if rest == "":
            print("Usage: add <text>")
        else:
            tasks.append(rest)
            print("Added:", rest)
    elif cmd == "list":
        if not tasks:
            print("Nothing to do")
        for i, task in enumerate(tasks, 1):
            print(f"{i}. {task}")
    elif cmd == "done":
        if rest.isdigit() and 1 <= int(rest) <= len(tasks):
            removed = tasks.pop(int(rest) - 1)
            print("Done:", removed)
        else:
            print("No such task")
    else:
        print("Unknown command")`, R`def load_tasks():
    try:
        with open("todo.txt") as f:
            return f.read().splitlines()
    except FileNotFoundError:
        return []

def save_tasks(tasks):
    with open("todo.txt", "w") as f:
        for task in tasks:
            f.write(task + "\n")

tasks = load_tasks()
while True:
    line = input("Cmd: ")
    cmd, _, rest = line.partition(" ")
    rest = rest.strip()
    if cmd == "quit":
        save_tasks(tasks)
        print("Saved")
        break
    elif cmd == "add":
        if rest == "":
            print("Usage: add <text>")
        else:
            tasks.append(rest)
            save_tasks(tasks)
            print("Added:", rest)
    elif cmd == "list":
        if not tasks:
            print("Nothing to do")
        for i, task in enumerate(tasks, 1):
            print(f"{i}. {task}")
    elif cmd == "done":
        if rest.isdigit() and int(rest) <= len(tasks):
            removed = tasks.pop(int(rest) - 1)
            save_tasks(tasks)
            print("Done:", removed)
        else:
            print("No such task")
    else:
        print("Unknown command")`],
    hints:['Write load_tasks() (missing file → []) and save_tasks(tasks).','In the loop use line.partition(" ") to split the command from the rest. Handle quit, add, list, done and the else branch.','For done: rest.isdigit() and 1 <= int(rest) <= len(tasks), then tasks.pop(int(rest) - 1). Save after each change.','def load_tasks():\n    try:\n        with open("todo.txt") as f:\n            return f.read().splitlines()\n    except FileNotFoundError:\n        return []\n\ndef save_tasks(tasks):\n    with open("todo.txt", "w") as f:\n        for task in tasks:\n            f.write(task + "\\n")\n\ntasks = load_tasks()\nwhile True:\n    line = input("Cmd: ")\n    cmd, _, rest = line.partition(" ")\n    rest = rest.strip()\n    if cmd == "quit":\n        save_tasks(tasks)\n        print("Saved")\n        break\n    elif cmd == "add":\n        if rest == "":\n            print("Usage: add <text>")\n        else:\n            tasks.append(rest)\n            save_tasks(tasks)\n            print("Added:", rest)\n    elif cmd == "list":\n        if not tasks:\n            print("Nothing to do")\n        for i, task in enumerate(tasks, 1):\n            print(f"{i}. {task}")\n    elif cmd == "done":\n        if rest.isdigit() and 1 <= int(rest) <= len(tasks):\n            removed = tasks.pop(int(rest) - 1)\n            save_tasks(tasks)\n            print("Done:", removed)\n        else:\n            print("No such task")\n    else:\n        print("Unknown command")']},
  power:{can:['Build a program that remembers between runs','Combine files, functions, loops and validation'],
    expand:'Add an `undo` command that restores the last removed task.',
    where:'Every note-taking, task and journal app saves its state like this.',
    next:'Next: settings files with key=value lines.'},
  codex:{title:'Persistent state',body:'Load at start (missing file = fresh), change in memory, save after each change.',snip:R`cmd, _, rest = line.partition(" ")`}
},
{
  id:'r8-18', realm:8, n:18, title:'Settings files: key = value',
  teaches:['file-config'], requires:['mission8a'],
  story:`"Programs need *settings*," Orrin says, hanging a lantern. "Volume, name, colour. Hard-wiring them is for fools. Keep them in a plain **settings file** that anyone can edit."`,
  concept:{
    html:`A simple, popular format: one \`key = value\` per line, with \`#\` comments:\n\n\`\`\`\n# my settings\nname = Ada\nvolume=7\n\`\`\`\n\nParse it into a dict, **starting from defaults** so missing keys still work:\n\n\`\`\`\ndef load_settings(path, defaults):\n    settings = dict(defaults)            # copy, don't change the original\n    try:\n        with open(path) as f:\n            for line in f:\n                line = line.strip()\n                if line == "" or line.startswith("#") or "=" not in line:\n                    continue\n                key, _, value = line.partition("=")\n                settings[key.strip()] = value.strip()\n    except FileNotFoundError:\n        pass\n    return settings\n\`\`\`\n\n- \`partition("=")\` splits at the **first** \`=\`, so values may contain \`=\`.\n- Values come back as **text**; convert with \`int()\` when you need numbers.\n- \`dict(defaults)\` copies, so the caller's defaults are not modified.`,
    analogy:`A hotel room card: sensible defaults, guest changes what they like.`,
    example:R`line = "volume = 7 "
key, _, value = line.partition("=")
print(repr(key.strip()), repr(value.strip()))`},
  predict:{code:R`defaults = {"a": "1"}
s = dict(defaults)
s["a"] = "2"
print(defaults["a"])`, q:'What prints?', opts:['1','2','Error'], ans:0, why:'dict(defaults) made a copy, so the original is untouched.'},
  cast:{code:R`line = "volume = 7 "
key, _, value = line.partition("=")
print(repr(key.strip()), repr(value.strip()))`, task:'Cast it.'},
  bug:{broken:R`line = "link=http://x.com/?a=1"
key, value = line.split("=")
print(key, value)`, task:'ValueError: too many values. The value contains an =. Split only at the first one. Expected: link http://x.com/?a=1',
    cases:[{inputs:[],tests:[['Parsed','lines==["link http://x.com/?a=1"]']]}],
    sol:R`line = "link=http://x.com/?a=1"
key, _, value = line.partition("=")
print(key, value)`, wrong:[R`line = "link=http://x.com/?a=1"
key, value = line.split("=")
print(key, value)`]},
  write:{prompt:'Write `load_settings(path, defaults)` returning a dict: a copy of `defaults`, overridden by the `key = value` lines in the file. Ignore blank lines, `#` comments and lines with no `=`. Strip spaces around keys and values. A missing file just gives the defaults. Then load `settings.txt` with defaults `name=Hero`, `volume=5`, `theme=dark`, and print `key=value` for each key in alphabetical order.',
    starter:R`defaults = {"name": "Hero", "volume": "5", "theme": "dark"}

# define load_settings, then print the result
`,
    files:{'settings.txt':'# my settings\nname = Ada\nvolume=7\n'},
    cases:[{inputs:[],files:{'settings.txt':'# my settings\nname = Ada\nvolume=7\n'},tests:[['Merged','lines==["name=Ada","theme=dark","volume=7"]'],['Defaults not changed','g["defaults"]=={"name":"Hero","volume":"5","theme":"dark"}']]},{inputs:[],files:{},tests:[['Missing file','lines==["name=Hero","theme=dark","volume=5"]']]},{inputs:[],files:{'settings.txt':'\n   \n# only comments\nnoequals\n'},tests:[['Junk lines','lines==["name=Hero","theme=dark","volume=5"]']]},{inputs:[],files:{'settings.txt':'theme = light=blue\nextra = yes\n'},tests:[['Value with equals, new key','lines==["extra=yes","name=Hero","theme=light=blue","volume=5"]']]},{inputs:[],files:{'settings.txt':'name=Zed'},tests:[['Function direct','g["load_settings"]("settings.txt", {"a":"1"})=={"a":"1","name":"Zed"}']]}],
    sol:R`defaults = {"name": "Hero", "volume": "5", "theme": "dark"}

def load_settings(path, defaults):
    settings = dict(defaults)
    try:
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line == "" or line.startswith("#") or "=" not in line:
                    continue
                key, _, value = line.partition("=")
                settings[key.strip()] = value.strip()
    except FileNotFoundError:
        pass
    return settings

settings = load_settings("settings.txt", defaults)
for key in sorted(settings):
    print(f"{key}={settings[key]}")`,
    wrong:[R`defaults = {"name": "Hero", "volume": "5", "theme": "dark"}

def load_settings(path, defaults):
    settings = defaults
    try:
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line == "" or line.startswith("#") or "=" not in line:
                    continue
                key, _, value = line.partition("=")
                settings[key.strip()] = value.strip()
    except FileNotFoundError:
        pass
    return settings

settings = load_settings("settings.txt", defaults)
for key in sorted(settings):
    print(f"{key}={settings[key]}")`, R`defaults = {"name": "Hero", "volume": "5", "theme": "dark"}

def load_settings(path, defaults):
    settings = dict(defaults)
    try:
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line == "" or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=")
                settings[key.strip()] = value.strip()
    except FileNotFoundError:
        pass
    return settings

settings = load_settings("settings.txt", defaults)
for key in sorted(settings):
    print(f"{key}={settings[key]}")`],
    hints:['Start with settings = dict(defaults) (a copy).','For each stripped line: skip blank, "#" comments, and lines without "=". Use line.partition("=") and strip both parts.','Catch FileNotFoundError and just return the defaults.','defaults = {"name": "Hero", "volume": "5", "theme": "dark"}\n\ndef load_settings(path, defaults):\n    settings = dict(defaults)\n    try:\n        with open(path) as f:\n            for line in f:\n                line = line.strip()\n                if line == "" or line.startswith("#") or "=" not in line:\n                    continue\n                key, _, value = line.partition("=")\n                settings[key.strip()] = value.strip()\n    except FileNotFoundError:\n        pass\n    return settings\n\nsettings = load_settings("settings.txt", defaults)\nfor key in sorted(settings):\n    print(f"{key}={settings[key]}")']},
  power:{can:['Read a settings file into a dict','Layer file values over safe defaults'],
    expand:'Convert `volume` to an int and clamp it between 0 and 10.',
    where:'Config files drive almost every real application; this is the heart of a config loader.',
    next:'Next: CSV, the spreadsheet format.'},
  codex:{title:'Settings files',body:'dict(defaults) copy, then override with key=value lines. Use partition("=") so values can contain =.',snip:R`key, _, value = line.partition("=")`}
}
);
