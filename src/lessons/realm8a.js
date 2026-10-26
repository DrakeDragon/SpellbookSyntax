// REALM 8 — THE ARCHIVE — part A (lessons 1-9: reading and writing files)
LESSONS.push(
{
  id:'r8-01', realm:8, n:1, title:'Programs that remember: writing a file',
  teaches:['file-write'], requires:['realm7-gap'],
  story:`Past the Hall of Mirrors, a door of old oak opens onto the **Archive**: miles of shelves, every one empty. A tiny archivist in ink-stained gloves looks up. "I am Orrin. Every spell you cast so far **forgets** the moment it ends. Here, we fix that. We teach programs to *write things down*."`,
  concept:{
    html:`Variables vanish when a program ends. A **file** survives.\n\n\`\`\`\nf = open("note.txt", "w")   # "w" = write\nf.write("Hello, Archive\\n")\nf.close()\n\`\`\`\n\n- \`open(name, "w")\` creates the file (or **empties** it if it exists) and gives you a file object.\n- \`.write(text)\` puts **text** in it. It writes exactly what you give it, so add \`"\\n"\` where a line should end.\n- \`.close()\` finishes the job and saves it safely.\n\nTo read it back: \`open("note.txt").read()\` gives the whole content as one string.\n\n(In this Spellbook, files live in a private little folder for each cast. They are real Python files, and they are cleared between casts, just like a fresh start.)`,
    analogy:`A notebook: write a line, close the cover, and the words are still there tomorrow.`,
    example:R`f = open("note.txt", "w")
f.write("Hello, Archive\n")
f.close()

print(open("note.txt").read())`},
  predict:{code:R`f = open("a.txt", "w")
f.write("one")
f.write("two")
f.close()
print(open("a.txt").read())`, q:'What prints?', opts:['onetwo','one\ntwo','two'], ans:0, why:'write() adds exactly the text given. Without "\\n" the pieces run together.'},
  cast:{code:R`f = open("note.txt", "w")
f.write("Hello, Archive\n")
f.close()

print(open("note.txt").read())`, task:'Cast it, then change the text.'},
  bug:{broken:R`f = open("list.txt", "w")
f.write("eggs")
f.write("milk")
f.write("tea")
f.close()
print(open("list.txt").read().count("\n"))`, task:'The three lines are glued into one. Make the file hold 3 separate lines, so the program prints 3.',
    cases:[{inputs:[],tests:[['Three lines','lines==["3"]']]}],
    sol:R`f = open("list.txt", "w")
f.write("eggs\n")
f.write("milk\n")
f.write("tea\n")
f.close()
print(open("list.txt").read().count("\n"))`, wrong:[R`f = open("list.txt", "w")
f.write("eggs")
f.write("milk")
f.write("tea")
f.close()
print(open("list.txt").read().count("\n"))`]},
  write:{prompt:'Ask `Note: `. Save it to `notes.txt` as one line (end it with a newline). Then read the file back and print `Saved: ` followed by the note.',
    starter:R`note = input("Note: ")
`,
    inputs:['Buy lamp oil'],
    cases:[{inputs:['Buy lamp oil'],tests:[['File content','read("notes.txt")=="Buy lamp oil\\n"'],['Message','lines[-1]=="Saved: Buy lamp oil"']]},{inputs:['x'],tests:[['Short note','read("notes.txt")=="x\\n" and lines[-1]=="Saved: x"']]},{inputs:['two words'],tests:[['Spaces','read("notes.txt")=="two words\\n"']]}],
    sol:R`note = input("Note: ")
f = open("notes.txt", "w")
f.write(note + "\n")
f.close()
text = open("notes.txt").read()
print("Saved:", text.strip())`,
    wrong:[R`note = input("Note: ")
f = open("notes.txt", "w")
f.write(note)
f.close()
print("Saved:", note)`, R`note = input("Note: ")
print("Saved:", note)`],
    hints:['f = open("notes.txt", "w") then f.write(note + "\\n") then f.close().','Read it back with open("notes.txt").read().','Strip the trailing newline before printing, or the output gets a blank line.','note = input("Note: ")\nf = open("notes.txt", "w")\nf.write(note + "\\n")\nf.close()\ntext = open("notes.txt").read()\nprint("Saved:", text.strip())']},
  power:{can:['Create a file and put text in it','Read a whole file back as a string'],
    expand:'Write three lines to a file in a loop, then read them back.',
    where:'Saving anything (settings, scores, logs, reports) starts with writing to a file.',
    next:'Next: the safer way to open files, with with.'},
  codex:{title:'Writing a file',body:'open(name, "w") makes or empties a file. write(text) adds exactly that text (add \\n for new lines). close() finishes.',snip:R`f = open("note.txt", "w")
f.write("hi\n")
f.close()`}
},
{
  id:'r8-02', realm:8, n:2, title:'with open(): never forget to close',
  teaches:['file-with'], requires:['file-write'],
  story:`Orrin holds up a jar of dried ink. "A file you forget to close is an uncapped bottle: it dries out, spills, or locks the shelf. So the Archive has one rule. Use **with**, and the cap goes on by itself."`,
  concept:{
    html:`Forgetting \`.close()\` is easy, and an error in the middle can skip it. Use a **with block**:\n\n\`\`\`\nwith open("score.txt", "w") as f:\n    f.write("Name: Ada\\n")\n    f.write("Score: 90\\n")\n\`\`\`\n\n- The file is open **inside** the indented block.\n- When the block ends (even after an error) Python closes it for you.\n- \`as f\` names the file object.\n\nFrom now on, **always** open files with \`with\`.`,
    analogy:`An automatic door: it closes behind you whether you remember or not.`,
    example:R`with open("score.txt", "w") as f:
    f.write("Name: Ada\n")
    f.write("Score: 90\n")

with open("score.txt") as f:
    print(f.read())`},
  predict:{code:R`with open("t.txt", "w") as f:
    f.write("hi")
print(f.closed)`, q:'What prints?', opts:['True','False','Error'], ans:0, why:'After the with block ends, the file is closed. The variable f still exists but the file is shut.'},
  cast:{code:R`with open("score.txt", "w") as f:
    f.write("Name: Ada\n")
    f.write("Score: 90\n")

with open("score.txt") as f:
    print(f.read())`, task:'Cast it. Change the name and score.'},
  bug:{broken:R`with open("log.txt", "w") as f:
    f.write("start\n")
f.write("end\n")
print(open("log.txt").read())`, task:'ValueError: I/O operation on closed file. The second write is outside the with block. Move it inside.',
    cases:[{inputs:[],tests:[['Both lines','out=="start\\nend\\n\\n" or out=="start\\nend\\n"']]}],
    sol:R`with open("log.txt", "w") as f:
    f.write("start\n")
    f.write("end\n")
print(open("log.txt").read())`, wrong:[R`with open("log.txt", "w") as f:
    f.write("start\n")
f.write("end\n")
print(open("log.txt").read())`]},
  write:{prompt:'Ask `Name: ` and `Score: `. Using `with open`, write `Name: <name>` and `Score: <score>` as two lines to `score.txt`. Then print `Done`.',
    starter:R`name = input("Name: ")
score = input("Score: ")
`,
    inputs:['Ada','90'],
    cases:[{inputs:['Ada','90'],tests:[['File content','read("score.txt")=="Name: Ada\\nScore: 90\\n"'],['Done','lines[-1]=="Done"'],['Uses with','"with open" in src']]},{inputs:['Bo','7'],tests:[['Other values','read("score.txt")=="Name: Bo\\nScore: 7\\n"']]}],
    sol:R`name = input("Name: ")
score = input("Score: ")
with open("score.txt", "w") as f:
    f.write(f"Name: {name}\n")
    f.write(f"Score: {score}\n")
print("Done")`,
    wrong:[R`name = input("Name: ")
score = input("Score: ")
f = open("score.txt", "w")
f.write(f"Name: {name}\n")
f.write(f"Score: {score}\n")
f.close()
print("Done")`, R`name = input("Name: ")
score = input("Score: ")
with open("score.txt", "w") as f:
    f.write(f"Name: {name} Score: {score}\n")
print("Done")`],
    hints:['with open("score.txt", "w") as f: then indent the writes.','Two f.write calls, each ending in \\n.','Print Done after the with block.','name = input("Name: ")\nscore = input("Score: ")\nwith open("score.txt", "w") as f:\n    f.write(f"Name: {name}\\n")\n    f.write(f"Score: {score}\\n")\nprint("Done")']},
  power:{can:['Open files safely with with','Know that the file is closed after the block'],
    expand:'Write a list of 5 items to a file, one per line, inside one with block.',
    where:'Professional code uses with for every file, network connection and database.',
    next:'Next: reading files.'},
  codex:{title:'with open',body:'with open(name, mode) as f: closes the file automatically when the block ends.',snip:R`with open("x.txt", "w") as f:
    f.write("hi\n")`}
},
{
  id:'r8-03', realm:8, n:3, title:'Reading a whole file',
  teaches:['file-read'], requires:['file-with'],
  story:`Orrin slides a dusty scroll across the desk. "Reading is the other half. The scroll is **already in your folder**: you can see it under the editor."`,
  concept:{
    html:`Open a file for reading (the default mode is \`"r"\`) and call \`.read()\`:\n\n\`\`\`\nwith open("poem.txt") as f:\n    text = f.read()\n\nprint(len(text))\nprint(text.upper())\n\`\`\`\n\n- \`.read()\` returns **one string** with the whole file, newlines included.\n- A file that does not exist raises \`FileNotFoundError\` (we handle that soon).\n- The text is yours once it's read; the file can close.\n\nYou can use every string method you already know: \`.upper()\`, \`.split()\`, \`.count()\`, \`.replace()\`.`,
    analogy:`Photocopying a whole page into your notebook.`,
    example:R`with open("poem.txt") as f:
    text = f.read()

print(len(text))
print(text.upper())`},
  predict:{code:R`with open("w.txt", "w") as f:
    f.write("a b\nc")
with open("w.txt") as f:
    print(len(f.read()))`, q:'What prints?', opts:['5','4','3'], ans:0, why:'"a b\\nc" has 5 characters: a, space, b, newline, c.'},
  cast:{code:R`with open("poem.txt") as f:
    text = f.read()

print(len(text))
print(text.upper())`, task:'Cast it.', files:{'poem.txt':'roses are red\nviolets are blue\n'}},
  bug:{broken:R`with open("poem.txt", "w") as f:
    text = f.read()
print(len(text))`, task:'It says UnsupportedOperation: not readable. "w" is for writing (and it just emptied the poem!). Open it for reading instead. Expected: 14',
    files:{'poem.txt':'roses are red\n'},
    cases:[{inputs:[],tests:[['Length','lines==["14"]']]}],
    sol:R`with open("poem.txt") as f:
    text = f.read()
print(len(text))`, wrong:[R`with open("poem.txt", "w") as f:
    text = f.read()
print(len(text))`]},
  write:{prompt:'Read `poem.txt`. Print `Characters: <n>`, then `Words: <n>`, then the whole text in UPPER CASE (use `end=""` so no extra blank line is added).',
    starter:R`# read poem.txt
`,
    files:{'poem.txt':'roses are red\nviolets are blue\n'},
    cases:[{inputs:[],files:{'poem.txt':'roses are red\nviolets are blue\n'},tests:[['Characters','lines[0]=="Characters: 31"'],['Words','lines[1]=="Words: 6"'],['Upper','lines[2:]==["ROSES ARE RED","VIOLETS ARE BLUE"]'],['No extra blank line','out.endswith("BLUE\\n") and not out.endswith("BLUE\\n\\n")']]},{inputs:[],files:{'poem.txt':'hi\n'},tests:[['Other file','lines==["Characters: 3","Words: 1","HI"]']]},{inputs:[],files:{'poem.txt':'a b c\nd\n\ne f\n'},tests:[['With a gap','lines[0]=="Characters: 13" and lines[1]=="Words: 6"']]}],
    sol:R`with open("poem.txt") as f:
    text = f.read()
print("Characters:", len(text))
print("Words:", len(text.split()))
print(text.upper(), end="")`,
    wrong:[R`print("Characters: 31")
print("Words: 6")
print("ROSES ARE RED")
print("VIOLETS ARE BLUE")`, R`with open("poem.txt") as f:
    text = f.read()
print("Characters:", len(text))
print("Words:", len(text.split()))
print(text.upper())`],
    hints:['with open("poem.txt") as f: text = f.read().','len(text) counts characters; len(text.split()) counts words.','print(text.upper(), end="") avoids a blank line because text already ends with a newline.','with open("poem.txt") as f:\n    text = f.read()\nprint("Characters:", len(text))\nprint("Words:", len(text.split()))\nprint(text.upper(), end="")']},
  power:{can:['Read a whole file into a string','Analyse file text with string methods'],
    expand:'Count how many times the word "the" appears in a file.',
    where:'Reading a file whole works for notes, configs and anything that fits in memory.',
    next:'Next: reading one line at a time.'},
  codex:{title:'Reading',body:'with open(name) as f: text = f.read() gives the whole file as one string.',snip:R`with open("poem.txt") as f:
    text = f.read()`}
},
{
  id:'r8-04', realm:8, n:4, title:'Reading line by line',
  teaches:['file-lines'], requires:['file-read'],
  story:`"Some scrolls are too long to swallow whole," Orrin says. "Take them **one line at a time**, like a good reader, and keep a finger on the page."`,
  concept:{
    html:`A file object is **iterable**: loop over it and you get one line per turn.\n\n\`\`\`\nwith open("todo.txt") as f:\n    for line in f:\n        print(line.strip())\n\`\`\`\n\n- Each \`line\` still ends with \`"\\n"\`. Call \`.strip()\` (or \`.rstrip("\\n")\`) to remove it.\n- Without it, \`print\` adds a second newline, giving blank lines.\n- Add \`enumerate(f, 1)\` for line numbers.\n- This works on **huge** files because it reads lazily: only one line is in memory at a time.\n\n\`\`\`\nfor n, line in enumerate(f, 1):\n    print(f"{n}: {line.strip()}")\n\`\`\``,
    analogy:`Reading a book a page at a time instead of memorising the whole thing.`,
    example:R`with open("todo.txt") as f:
    for n, line in enumerate(f, 1):
        print(f"{n}: {line.strip()}")`},
  predict:{code:R`with open("x.txt", "w") as f:
    f.write("a\nb\n")
with open("x.txt") as f:
    for line in f:
        print(line)`, q:'How many lines of output (counting blank ones)?', opts:['4','2','3'], ans:0, why:'Each line keeps its \\n and print adds another: "a", blank, "b", blank.'},
  cast:{code:R`with open("todo.txt") as f:
    for n, line in enumerate(f, 1):
        print(f"{n}: {line.strip()}")`, task:'Cast it.', files:{'todo.txt':'sweep floors\nfeed ferret\nwrite spell\n'}},
  bug:{broken:R`with open("todo.txt") as f:
    for line in f:
        print(line)`, task:'Every line is followed by a blank line. Remove the extra newline.',
    files:{'todo.txt':'one\ntwo\n'},
    cases:[{inputs:[],tests:[['No blank lines','lines==["one","two"]']]}],
    sol:R`with open("todo.txt") as f:
    for line in f:
        print(line.strip())`, wrong:[R`with open("todo.txt") as f:
    for line in f:
        print(line)`]},
  write:{prompt:'Read `todo.txt` line by line. Print each non-empty line as `<number>. <text>`, numbering from 1 and **skipping blank lines** (blank lines do not use up a number).',
    starter:R`# number the lines of todo.txt
`,
    files:{'todo.txt':'sweep floors\nfeed ferret\n\nwrite spell\n'},
    cases:[{inputs:[],files:{'todo.txt':'sweep floors\nfeed ferret\n\nwrite spell\n'},tests:[['Numbered','lines==["1. sweep floors","2. feed ferret","3. write spell"]']]},{inputs:[],files:{'todo.txt':'only\n'},tests:[['One line','lines==["1. only"]']]},{inputs:[],files:{'todo.txt':'\n\nx\n\ny'},tests:[['Blanks and no final newline','lines==["1. x","2. y"]']]},{inputs:[],files:{'todo.txt':'  padded  \nb\n'},tests:[['Strips spaces','lines==["1. padded","2. b"]']]}],
    sol:R`n = 0
with open("todo.txt") as f:
    for line in f:
        text = line.strip()
        if text == "":
            continue
        n += 1
        print(f"{n}. {text}")`,
    wrong:[R`with open("todo.txt") as f:
    for n, line in enumerate(f, 1):
        print(f"{n}. {line.strip()}")`, R`n = 0
with open("todo.txt") as f:
    for line in f:
        n += 1
        print(f"{n}. {line.strip()}")`],
    hints:['Keep your own counter n and only add 1 for non-empty lines.','text = line.strip(); if text == "": continue.','Print an f-string: f"{n}. {text}".','n = 0\nwith open("todo.txt") as f:\n    for line in f:\n        text = line.strip()\n        if text == "":\n            continue\n        n += 1\n        print(f"{n}. {text}")']},
  power:{can:['Process a file one line at a time','Strip newlines and skip blank lines'],
    expand:'Print only the lines that contain a keyword you ask for.',
    where:'Log analysers and data tools read files line by line so they never run out of memory.',
    next:'Next: reading all lines into a list.'},
  codex:{title:'Looping a file',body:'for line in f: gives one line per turn, each ending in \\n. Use .strip() to clean it.',snip:R`for line in f:
    print(line.strip())`}
},
{
  id:'r8-05', realm:8, n:5, title:'Lines as a list',
  teaches:['file-readlines'], requires:['file-lines'],
  story:`"Sometimes you need the whole shelf laid out," Orrin says, "to count it, sort it, or read it backwards. Turn the file into a **list**."`,
  concept:{
    html:`Two ways to get all lines as a list:\n\n\`\`\`\nwith open("tasks.txt") as f:\n    a = f.readlines()          # each item keeps "\\n"\n\nwith open("tasks.txt") as f:\n    b = f.read().splitlines()  # newlines removed (preferred)\n\`\`\`\n\n- \`.splitlines()\` is usually what you want: clean items, no trailing blank item.\n- \`.split("\\n")\` leaves an **empty string** at the end if the file ends with a newline. Avoid it here.\n- With a list you can use \`len()\`, slicing, \`sorted()\`, \`reversed()\`, \`[-1]\`.\n\nFor huge files, loop instead; for ordinary files, a list is easy.`,
    analogy:`Taking every card out of the box and laying them in a row.`,
    example:R`with open("tasks.txt") as f:
    items = f.read().splitlines()

print(len(items))
print(items[-1])`},
  predict:{code:R`text = "a\nb\n"
print(text.splitlines(), text.split("\n"))`, q:'What prints?', opts:["['a', 'b'] ['a', 'b', '']","['a', 'b'] ['a', 'b']","['a\\n', 'b\\n'] ['a', 'b']"], ans:0, why:'split("\\n") leaves an empty string after the final newline; splitlines() does not.'},
  cast:{code:R`with open("tasks.txt") as f:
    items = f.read().splitlines()

print(len(items))
print(items[-1])`, task:'Cast it.', files:{'tasks.txt':'wash cups\nsort scrolls\nfeed Sudo\n'}},
  bug:{broken:R`with open("tasks.txt") as f:
    items = f.read().split("\n")
print("Tasks:", len(items))`, task:'It counts one task too many. Use the right method.',
    files:{'tasks.txt':'a\nb\nc\n'},
    cases:[{inputs:[],tests:[['Count','lines==["Tasks: 3"]']]}],
    sol:R`with open("tasks.txt") as f:
    items = f.read().splitlines()
print("Tasks:", len(items))`, wrong:[R`with open("tasks.txt") as f:
    items = f.read().split("\n")
print("Tasks:", len(items))`]},
  write:{prompt:'Read `tasks.txt` into a list. Print `Tasks: <count>`, then `First: <first task>` and `Last: <last task>`. If the file is empty print `No tasks`.',
    starter:R`# read tasks.txt into a list
`,
    files:{'tasks.txt':'wash cups\nsort scrolls\nfeed Sudo\n'},
    cases:[{inputs:[],files:{'tasks.txt':'wash cups\nsort scrolls\nfeed Sudo\n'},tests:[['Three','lines==["Tasks: 3","First: wash cups","Last: feed Sudo"]']]},{inputs:[],files:{'tasks.txt':'solo\n'},tests:[['One','lines==["Tasks: 1","First: solo","Last: solo"]']]},{inputs:[],files:{'tasks.txt':''},tests:[['Empty','lines==["No tasks"]']]},{inputs:[],files:{'tasks.txt':'a\nb'},tests:[['No final newline','lines==["Tasks: 2","First: a","Last: b"]']]}],
    sol:R`with open("tasks.txt") as f:
    items = f.read().splitlines()
if len(items) == 0:
    print("No tasks")
else:
    print("Tasks:", len(items))
    print("First:", items[0])
    print("Last:", items[-1])`,
    wrong:[R`with open("tasks.txt") as f:
    items = f.read().split("\n")
if len(items) == 0:
    print("No tasks")
else:
    print("Tasks:", len(items))
    print("First:", items[0])
    print("Last:", items[-1])`, R`with open("tasks.txt") as f:
    items = f.readlines()
if len(items) == 0:
    print("No tasks")
else:
    print("Tasks:", len(items))
    print("First:", items[0])
    print("Last:", items[-1])`],
    hints:['items = f.read().splitlines()','An empty file gives an empty list: check len(items) == 0 first.','Use items[0] and items[-1].','with open("tasks.txt") as f:\n    items = f.read().splitlines()\nif len(items) == 0:\n    print("No tasks")\nelse:\n    print("Tasks:", len(items))\n    print("First:", items[0])\n    print("Last:", items[-1])']},
  power:{can:['Load a file as a list of clean lines','Count, index and slice file contents'],
    expand:'Print the last 3 tasks using a slice.',
    where:'Loading a file into a list is the first step of most small data scripts.',
    next:'Next: adding to a file without erasing it.'},
  codex:{title:'Lines as a list',body:'f.read().splitlines() gives clean lines. split("\\n") leaves an empty item at the end.',snip:R`items = f.read().splitlines()`}
},
{
  id:'r8-06', realm:8, n:6, title:'Append mode: adding without erasing',
  teaches:['file-append'], requires:['file-readlines'],
  story:`Orrin gasps and snatches a pen away. "You opened the ledger with **"w"**! It wiped every page. To add a line to the *end* of a book, you need a different key: **"a"**."`,
  concept:{
    html:`File **modes** decide what \`open\` does:\n\n| Mode | Meaning | If file exists |\n|---|---|---|\n| \`"r"\` | read (default) | must exist |\n| \`"w"\` | write | **erased** first |\n| \`"a"\` | append | kept; new text goes on the end |\n\n\`\`\`\nwith open("log.txt", "a") as f:\n    f.write("new entry\\n")\n\`\`\`\n\nAppend creates the file if it is missing, so it is perfect for **logs**, **histories** and **high-score lists**.\n\n**Warning:** \`"w"\` on the wrong file destroys its content immediately, before you write a single character.`,
    analogy:`"w" is a fresh page, "a" is adding to the last line of the diary.`,
    example:R`with open("log.txt", "a") as f:
    f.write("first\n")
with open("log.txt", "a") as f:
    f.write("second\n")
print(open("log.txt").read())`},
  predict:{code:R`with open("l.txt", "w") as f:
    f.write("A\n")
with open("l.txt", "w") as f:
    f.write("B\n")
print(open("l.txt").read().strip())`, q:'What prints?', opts:['B','A\nB','A'], ans:0, why:'The second "w" erased the file before writing B.'},
  cast:{code:R`with open("log.txt", "a") as f:
    f.write("first\n")
with open("log.txt", "a") as f:
    f.write("second\n")
print(open("log.txt").read())`, task:'Cast it, then change "a" to "w" and see what disappears.'},
  bug:{broken:R`with open("log.txt", "w") as f:
    f.write("login\n")
print(open("log.txt").read().splitlines())`, task:'The log already has entries, but "w" wiped them. Keep old entries and add "login". Expected: [\'boot\', \'login\']',
    files:{'log.txt':'boot\n'},
    cases:[{inputs:[],tests:[['Both','lines==["[\'boot\', \'login\']"]']]}],
    sol:R`with open("log.txt", "a") as f:
    f.write("login\n")
print(open("log.txt").read().splitlines())`, wrong:[R`with open("log.txt", "w") as f:
    f.write("login\n")
print(open("log.txt").read().splitlines())`]},
  write:{prompt:'`log.txt` already holds earlier entries. Ask `Entry: `, **append** it as a new line, then print `Entries: <total lines in the file>`.',
    starter:R`entry = input("Entry: ")
`,
    inputs:['feed Sudo'],
    files:{'log.txt':'boot\nlogin\n'},
    cases:[{inputs:['feed Sudo'],files:{'log.txt':'boot\nlogin\n'},tests:[['Appended','read("log.txt")=="boot\\nlogin\\nfeed Sudo\\n"'],['Count','lines[-1]=="Entries: 3"']]},{inputs:['x'],files:{},tests:[['New file','read("log.txt")=="x\\n" and lines[-1]=="Entries: 1"']]},{inputs:['z'],files:{'log.txt':'a\n'},tests:[['One before','read("log.txt")=="a\\nz\\n" and lines[-1]=="Entries: 2"']]}],
    sol:R`entry = input("Entry: ")
with open("log.txt", "a") as f:
    f.write(entry + "\n")
with open("log.txt") as f:
    total = len(f.read().splitlines())
print("Entries:", total)`,
    wrong:[R`entry = input("Entry: ")
with open("log.txt", "w") as f:
    f.write(entry + "\n")
with open("log.txt") as f:
    total = len(f.read().splitlines())
print("Entries:", total)`, R`entry = input("Entry: ")
with open("log.txt", "a") as f:
    f.write(entry)
with open("log.txt") as f:
    total = len(f.read().splitlines())
print("Entries:", total)`],
    hints:['Open with mode "a" and write entry + "\\n".','Open again for reading (default mode) to count lines.','len(f.read().splitlines()) is the count.','entry = input("Entry: ")\nwith open("log.txt", "a") as f:\n    f.write(entry + "\\n")\nwith open("log.txt") as f:\n    total = len(f.read().splitlines())\nprint("Entries:", total)']},
  power:{can:['Add to a file without erasing it','Know the difference between r, w and a'],
    expand:'Make a guestbook: append a name each run and show all names.',
    where:'Every log file, history and audit trail is built with append mode.',
    next:'Next: a function that saves in either mode.'},
  codex:{title:'File modes',body:'"r" read (default). "w" write and ERASE first. "a" append to the end.',snip:R`open("log.txt", "a")`}
},
{
  id:'r8-07', realm:8, n:7, title:'Saving with a helper function',
  teaches:['file-helpers'], requires:['file-append','fn-defaults'],
  story:`"Writing the same four lines in every spell is how typos breed," Orrin says. "Wrap the ritual in a function. Then saving is **one word**."`,
  concept:{
    html:`File handling repeats, so wrap it in functions with sensible defaults:\n\n\`\`\`\ndef save_line(filename, text, mode="w"):\n    with open(filename, mode) as f:\n        f.write(text + "\\n")\n\ndef load_lines(filename):\n    with open(filename) as f:\n        return f.read().splitlines()\n\nsave_line("a.txt", "one")          # creates / replaces\nsave_line("a.txt", "two", "a")     # appends\nprint(load_lines("a.txt"))         # ['one', 'two']\n\`\`\`\n\n- The default \`mode="w"\` keeps the common case short.\n- \`return\` inside \`with\` is fine: the file still closes.\n- Small, named helpers make later programs far easier to read.`,
    analogy:`A rubber stamp: do the careful part once, then press.`,
    example:R`def save_line(filename, text, mode="w"):
    with open(filename, mode) as f:
        f.write(text + "\n")

def load_lines(filename):
    with open(filename) as f:
        return f.read().splitlines()

save_line("a.txt", "one")
save_line("a.txt", "two", "a")
print(load_lines("a.txt"))`},
  predict:{code:R`def save(name, text, mode="w"):
    with open(name, mode) as f:
        f.write(text)

save("q.txt", "A")
save("q.txt", "B")
print(open("q.txt").read())`, q:'What prints?', opts:['B','AB','A'], ans:0, why:'Both calls use the default "w", so the second one replaces the first.'},
  cast:{code:R`def save_line(filename, text, mode="w"):
    with open(filename, mode) as f:
        f.write(text + "\n")

def load_lines(filename):
    with open(filename) as f:
        return f.read().splitlines()

save_line("a.txt", "one")
save_line("a.txt", "two", "a")
print(load_lines("a.txt"))`, task:'Cast it.'},
  bug:{broken:R`def save_line(filename, text, mode="w"):
    with open(filename) as f:
        f.write(text + "\n")

save_line("a.txt", "one")
print(open("a.txt").read().strip())`, task:'FileNotFoundError: the mode is never passed to open(), so the file is opened for reading. Pass it.',
    cases:[{inputs:[],tests:[['Works','lines==["one"]']]}],
    sol:R`def save_line(filename, text, mode="w"):
    with open(filename, mode) as f:
        f.write(text + "\n")

save_line("a.txt", "one")
print(open("a.txt").read().strip())`, wrong:[R`def save_line(filename, text, mode="w"):
    with open(filename) as f:
        f.write(text + "\n")

save_line("a.txt", "one")
print(open("a.txt").read().strip())`]},
  write:{prompt:'Write `save_line(filename, text, mode="w")` (writes `text` plus a newline) and `load_lines(filename)` (returns a list of lines). Then: save `one` to `a.txt`, append `two` and `three`, and print the list from `load_lines`.',
    starter:R`# define save_line and load_lines, then use them
`,
    cases:[{inputs:[],tests:[['Printed','lines==["[\'one\', \'two\', \'three\']"]'],['File content','read("a.txt")=="one\\ntwo\\nthree\\n"'],['Replaces by default','(g["save_line"]("z.txt","x"), g["save_line"]("z.txt","y"), read("z.txt"))[2]=="y\\n"'],['Append works','(g["save_line"]("p.txt","x"), g["save_line"]("p.txt","y","a"), read("p.txt"))[2]=="x\\ny\\n"'],['load_lines clean','(g["save_line"]("q.txt","k"), g["load_lines"]("q.txt"))[1]==["k"]'],['Uses with','"with open" in src']]}],
    sol:R`def save_line(filename, text, mode="w"):
    with open(filename, mode) as f:
        f.write(text + "\n")

def load_lines(filename):
    with open(filename) as f:
        return f.read().splitlines()

save_line("a.txt", "one")
save_line("a.txt", "two", "a")
save_line("a.txt", "three", "a")
print(load_lines("a.txt"))`,
    wrong:[R`def save_line(filename, text, mode="a"):
    with open(filename, mode) as f:
        f.write(text + "\n")

def load_lines(filename):
    with open(filename) as f:
        return f.read().splitlines()

save_line("a.txt", "one")
save_line("a.txt", "two")
save_line("a.txt", "three")
print(load_lines("a.txt"))`, R`def save_line(filename, text, mode="w"):
    with open(filename, mode) as f:
        f.write(text + "\n")

def load_lines(filename):
    with open(filename) as f:
        return f.readlines()

save_line("a.txt", "one")
save_line("a.txt", "two", "a")
save_line("a.txt", "three", "a")
print(load_lines("a.txt"))`],
    hints:['save_line: open(filename, mode) inside with, write text + "\\n".','load_lines: return f.read().splitlines() from inside the with block.','First call uses the default mode; the next two pass "a".','def save_line(filename, text, mode="w"):\n    with open(filename, mode) as f:\n        f.write(text + "\\n")\n\ndef load_lines(filename):\n    with open(filename) as f:\n        return f.read().splitlines()\n\nsave_line("a.txt", "one")\nsave_line("a.txt", "two", "a")\nsave_line("a.txt", "three", "a")\nprint(load_lines("a.txt"))']},
  power:{can:['Wrap repeated file code in reusable helpers','Use a default mode argument to keep calls short'],
    expand:'Add a `count_lines(filename)` helper built on load_lines.',
    where:'Real projects keep file helpers in one place so every part of the code saves the same way.',
    next:'Next: check whether a file exists.'},
  codex:{title:'File helpers',body:'Small functions like save_line and load_lines hide the open/with details. return inside with is fine.',snip:R`def load_lines(name):
    with open(name) as f:
        return f.read().splitlines()`}
},
{
  id:'r8-08', realm:8, n:8, title:'Does the file exist?',
  teaches:['file-exists'], requires:['file-helpers'],
  story:`"Never assume a shelf holds a book," Orrin says, tapping a card. "Ask the Archive **first**."`,
  concept:{
    html:`The \`os.path\` tools answer questions about paths without opening the file:\n\n\`\`\`\nimport os\n\nos.path.exists("notes.txt")      # True / False\nos.path.getsize("notes.txt")     # size in bytes\nos.path.isfile("notes.txt")      # a file (not a folder)?\n\`\`\`\n\n\`import os\` brings in Python's built-in operating-system toolkit. (We study imports properly in the next Realm; for now just copy the line.)\n\n\`\`\`\nif os.path.exists(name):\n    print("found")\nelse:\n    print("missing")\n\`\`\`\n\nChecking first is **LBYL** ("look before you leap"). The next lesson shows the **EAFP** way with \`try\`/\`except\`.`,
    analogy:`Knocking before you open the door.`,
    example:R`import os

print(os.path.exists("notes.txt"))
print(os.path.exists("nope.txt"))`},
  predict:{code:R`import os
open("k.txt", "w").close()
print(os.path.exists("k.txt"), os.path.getsize("k.txt"))`, q:'What prints?', opts:['True 0','False 0','True 1'], ans:0, why:'The empty file was created, so it exists and has 0 bytes.'},
  cast:{code:R`import os

print(os.path.exists("notes.txt"))
print(os.path.exists("nope.txt"))`, task:'Cast it.', files:{'notes.txt':'remember the milk\n'}},
  bug:{broken:R`import os
name = "notes.txt"
if os.path.exists("name"):
    print("found")
else:
    print("missing")`, task:'It says missing even though notes.txt exists: the quotes turned the variable into text. Fix it.',
    files:{'notes.txt':'x\n'},
    cases:[{inputs:[],tests:[['Found','lines==["found"]']]}],
    sol:R`import os
name = "notes.txt"
if os.path.exists(name):
    print("found")
else:
    print("missing")`, wrong:[R`import os
name = "notes.txt"
if os.path.exists("name"):
    print("found")
else:
    print("missing")`]},
  write:{prompt:'Ask `File: `. If it exists, print `<name> has <n> bytes`; otherwise print `<name> is missing`. Use `os.path`.',
    starter:R`import os
name = input("File: ")
`,
    inputs:['notes.txt'],
    files:{'notes.txt':'hello\n'},
    cases:[{inputs:['notes.txt'],files:{'notes.txt':'hello\n'},tests:[['Found','lines[-1]=="notes.txt has 6 bytes"']]},{inputs:['nope.txt'],files:{'notes.txt':'hello\n'},tests:[['Missing','lines[-1]=="nope.txt is missing"']]},{inputs:['empty.txt'],files:{'empty.txt':''},tests:[['Empty file','lines[-1]=="empty.txt has 0 bytes"']]},{inputs:['u.txt'],files:{'u.txt':'é'},tests:[['Bytes not characters','lines[-1]=="u.txt has 2 bytes"']]},{inputs:['big.txt'],files:{'big.txt':'abcdefghij'},tests:[['Ten bytes','lines[-1]=="big.txt has 10 bytes"'],['Uses os.path','"os.path" in src']]}],
    sol:R`import os
name = input("File: ")
if os.path.exists(name):
    print(name, "has", os.path.getsize(name), "bytes")
else:
    print(name, "is missing")`,
    wrong:[R`import os
name = input("File: ")
if os.path.exists(name):
    print(name, "has", len(open(name).read()), "bytes")
else:
    print(name, "is missing")`, R`import os
name = input("File: ")
print(name, "is missing")`],
    hints:['os.path.exists(name) is True or False.','os.path.getsize(name) gives the size in bytes.','Print with commas or an f-string.','import os\nname = input("File: ")\nif os.path.exists(name):\n    print(name, "has", os.path.getsize(name), "bytes")\nelse:\n    print(name, "is missing")']},
  power:{can:['Check a file exists before using it','Find a file\'s size without opening it'],
    expand:'Also report whether the name is a file with os.path.isfile.',
    where:'Installers, backups and build tools check paths constantly.',
    next:'Next: catching FileNotFoundError.'},
  codex:{title:'os.path',body:'import os; os.path.exists(p), os.path.getsize(p), os.path.isfile(p).',snip:R`os.path.exists("notes.txt")`}
},
{
  id:'r8-09', realm:8, n:9, title:'FileNotFoundError: the Pythonic way',
  teaches:['file-notfound'], requires:['file-exists','err-specific'],
  story:`"Checking and then opening has a gap between the two," Orrin warns. "A file can vanish in between. The Archive's favourite method is to **just try**, and handle the miss."`,
  concept:{
    html:`Opening a missing file raises \`FileNotFoundError\`. Catch it (EAFP, as you saw in the Wards):\n\n\`\`\`\ndef load_text(path):\n    try:\n        with open(path) as f:\n            return f.read()\n    except FileNotFoundError:\n        return ""\n\`\`\`\n\n- No race between "check" and "open".\n- Other file errors exist too: \`PermissionError\`, \`IsADirectoryError\`. All of them are kinds of \`OSError\`.\n- Choose what a missing file **means** for your program: an empty result, a default, or a clear message.\n\nA **first run** with no save file yet is the classic case: treat "missing" as "start fresh".`,
    analogy:`Trying the door handle rather than phoning ahead.`,
    example:R`def load_text(path):
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        return ""

print(repr(load_text("nope.txt")))`},
  predict:{code:R`try:
    open("ghost.txt")
except FileNotFoundError:
    print("none")
print("end")`, q:'What prints?', opts:['none\nend','end','none'], ans:0, why:'The error is caught, then the program carries on.'},
  cast:{code:R`def load_text(path):
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        return ""

print(repr(load_text("nope.txt")))`, task:'Cast it.'},
  bug:{broken:R`name = "ghost.txt"
with open(name) as f:
    print(f.read())
print("finished")`, task:'The crash stops everything. Catch FileNotFoundError, print Missing: ghost.txt, and still print finished.',
    cases:[{inputs:[],tests:[['Handled','lines==["Missing: ghost.txt","finished"]']]}],
    sol:R`name = "ghost.txt"
try:
    with open(name) as f:
        print(f.read())
except FileNotFoundError:
    print("Missing:", name)
print("finished")`, wrong:[R`name = "ghost.txt"
with open(name) as f:
    print(f.read())
print("finished")`]},
  write:{prompt:'Write `load_lines(path)` that returns the file\'s lines, or `[]` if it does not exist (use `try/except FileNotFoundError`). Ask `File: `, and print `Lines: <n>`. If the file was missing print `No such file: <name>` instead.',
    starter:R`# define load_lines, then use it
`,
    inputs:['todo.txt'],
    files:{'todo.txt':'a\nb\n'},
    cases:[{inputs:['todo.txt'],files:{'todo.txt':'a\nb\n'},tests:[['Found','lines[-1]=="Lines: 2"']]},{inputs:['nope.txt'],files:{'todo.txt':'a\n'},tests:[['Missing','lines[-1]=="No such file: nope.txt"']]},{inputs:['e.txt'],files:{'e.txt':''},tests:[['Empty is not missing','lines[-1]=="Lines: 0"']]},{inputs:['todo.txt'],files:{'todo.txt':'a\n'},tests:[['Function','g["load_lines"]("todo.txt")==["a"] and g["load_lines"]("zzz.txt")==[]'],['Uses except','"except FileNotFoundError" in src']]}],
    sol:R`def load_lines(path):
    try:
        with open(path) as f:
            return f.read().splitlines()
    except FileNotFoundError:
        return []

name = input("File: ")
items = load_lines(name)
import os
if items == [] and not os.path.exists(name):
    print("No such file:", name)
else:
    print("Lines:", len(items))`,
    wrong:[R`import os
def load_lines(path):
    if os.path.exists(path):
        with open(path) as f:
            return f.read().splitlines()
    return []

name = input("File: ")
items = load_lines(name)
if items == [] and not os.path.exists(name):
    print("No such file:", name)
else:
    print("Lines:", len(items))`, R`def load_lines(path):
    with open(path) as f:
        return f.read().splitlines()

name = input("File: ")
print("Lines:", len(load_lines(name)))`],
    hints:['In load_lines: try: open and return the lines. except FileNotFoundError: return [].','To tell "missing" from "empty" you can check os.path.exists(name) after loading.','import os at the top or just before you use it.','import os\n\ndef load_lines(path):\n    try:\n        with open(path) as f:\n            return f.read().splitlines()\n    except FileNotFoundError:\n        return []\n\nname = input("File: ")\nitems = load_lines(name)\nif items == [] and not os.path.exists(name):\n    print("No such file:", name)\nelse:\n    print("Lines:", len(items))']},
  power:{can:['Handle a missing file gracefully','Treat first-run "no save yet" as normal'],
    expand:'Return a default list like ["welcome"] when the file is missing.',
    where:'Every app that has settings or saves needs this first-run logic.',
    next:'Next: building file paths properly.'},
  codex:{title:'FileNotFoundError',body:'try: open(path) … except FileNotFoundError: handle it. All file problems are OSError kinds.',snip:R`except FileNotFoundError:
    return []`}
}
);
