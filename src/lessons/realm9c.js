// REALM 9 — THE WORKSHOP — part C (lessons 23-33: pathlib, writing and importing your own modules, packages, mission)
LESSONS.push(
{
  id:'r9-23', realm:9, n:23, title:'pathlib: paths as objects',
  teaches:['pathlib-basic'], requires:['datetime-arith'],
  story:`Master Cog unrolls a map of the Workshop's storerooms. "In the Archive you built file names out of text. Here we use **pathlib**: a path is an *object* that knows its own name, ending and parent folder."`,
  concept:{
    html:`\`\`\`\nfrom pathlib import Path\n\np = Path("docs") / "report.final.txt"   # join with /  (works on every OS)\np.name        # 'report.final.txt'\np.stem        # 'report.final'     (name without the LAST ending)\np.suffix      # '.txt'\np.parent      # Path('docs')\n\np.write_text("hello")      # create/overwrite a file\np.read_text()              # 'hello'\np.exists(), p.is_file(), p.is_dir()\n\`\`\`\n\n- Build paths with **\`/\`**, never with \`+\`. (\`Path + str\` is a \`TypeError\`.)\n- \`suffix\` is only the **last** ending: \`archive.tar.gz\` has suffix \`.gz\` and stem \`archive.tar\`. A name with no dot has an empty suffix.\n- \`write_text\` and \`read_text\` open, use and close the file for you, like \`with open\`.\n- \`print(path)\` shows the path as text.`,
    analogy:`A luggage tag that knows its own name, its type and the shelf it sits on.`,
    example:R`from pathlib import Path

p = Path("docs") / "report.final.txt"
print(p, p.name, p.stem, p.suffix, p.parent)

note = Path("note.txt")
note.write_text("hello")
print(note.read_text(), note.exists())`},
  predict:{code:R`from pathlib import Path
print(Path("a/b/c.txt").parent)`, q:'What prints?', opts:['a/b','c.txt','a'], ans:0, why:'parent is the folder containing the file: a/b.'},
  cast:{code:R`from pathlib import Path

p = Path("docs") / "report.final.txt"
print(p, p.name, p.stem, p.suffix, p.parent)

note = Path("note.txt")
note.write_text("hello")
print(note.read_text(), note.exists())`, task:'Cast it.'},
  bug:{broken:R`from pathlib import Path
p = Path("notes") + "day1.txt"
print(p)`, task:'TypeError: you cannot add a Path and a string. Join with /. Expected: notes/day1.txt',
    cases:[{inputs:[],tests:[['Joined','lines==["notes/day1.txt"]']]}],
    sol:R`from pathlib import Path
p = Path("notes") / "day1.txt"
print(p)`, wrong:[R`from pathlib import Path
p = Path("notes") + "day1.txt"
print(p)`]},
  write:{prompt:'Ask `File: ` (a plain file name). Using `Path`, print `Stem: <stem>` and `Suffix: <suffix>` (print `none` if it has no suffix). Then write the text `hi there` into that file and print `Saved: <number of characters read back> chars`.',
    starter:R`from pathlib import Path

path = Path(input("File: "))
`,
    inputs:['report.txt'],
    cases:[{inputs:['report.txt'],tests:[['Simple','lines[-3:]==["Stem: report","Suffix: .txt","Saved: 8 chars"]'],['File written','read("report.txt")=="hi there"']]},{inputs:['archive.tar.gz'],tests:[['Two dots','lines[-3:]==["Stem: archive.tar","Suffix: .gz","Saved: 8 chars"]'],['File written','exists("archive.tar.gz")']]},{inputs:['README'],tests:[['No suffix','lines[-3:]==["Stem: README","Suffix: none","Saved: 8 chars"]'],['Uses Path','"Path(" in src']]}],
    sol:R`from pathlib import Path

path = Path(input("File: "))
print("Stem:", path.stem)
print("Suffix:", path.suffix or "none")
path.write_text("hi there")
print("Saved:", len(path.read_text()), "chars")`,
    wrong:[R`from pathlib import Path

path = Path(input("File: "))
name = path.name
print("Stem:", name.split(".")[0])
print("Suffix:", path.suffix or "none")
path.write_text("hi there")
print("Saved:", len(path.read_text()), "chars")`, R`from pathlib import Path

path = Path(input("File: "))
print("Stem:", path.stem)
print("Suffix:", path.suffix or "none")
print("Saved:", len("hi there"), "chars")`],
    hints:['path.stem and path.suffix do the splitting for you.','suffix is empty for names without a dot: use `or "none"`.','path.write_text("hi there") then len(path.read_text()).','from pathlib import Path\n\npath = Path(input("File: "))\nprint("Stem:", path.stem)\nprint("Suffix:", path.suffix or "none")\npath.write_text("hi there")\nprint("Saved:", len(path.read_text()), "chars")']},
  power:{can:['Build paths with / and inspect their parts','Read and write small files with pathlib'],
    expand:'Print the file name with the suffix changed to .bak using path.with_suffix(".bak").',
    where:'pathlib is the modern way to handle files in scripts, tools and web apps.',
    next:'Next: finding, listing and creating folders.'},
  codex:{title:'Path',body:'Path(a) / b joins. .name .stem .suffix .parent. write_text / read_text. exists() is_file() is_dir().',snip:R`Path("docs") / "a.txt"`}
},
{
  id:'r9-24', realm:9, n:24, title:'pathlib: glob, iterdir and mkdir',
  teaches:['pathlib-glob'], requires:['pathlib-basic'],
  story:`"The storeroom is a mess," Master Cog groans, kicking a crate. "Hundreds of **.txt** notes mixed with other files. Sort them into their own shelf. No hand-written loops over directory listings."`,
  concept:{
    html:`\`\`\`\nfrom pathlib import Path\n\nfolder = Path(".")\nfor p in sorted(folder.glob("*.txt")):   # pattern match: all .txt here\n    print(p.name)\n\nlist(folder.iterdir())                   # everything inside (any order!)\nPath("logs/2026").mkdir(parents=True, exist_ok=True)   # make folders\np.rename(Path("archive") / p.name)       # move a file\n\`\`\`\n\n- \`glob("*.txt")\` finds matches in one folder; \`rglob("*.txt")\` searches **all sub-folders** too.\n- **Always \`sorted()\`** a glob or iterdir when order matters: the system gives no promised order.\n- \`mkdir()\` fails if the folder exists (\`FileExistsError\`) or its parent is missing (\`FileNotFoundError\`). Use \`exist_ok=True\` and \`parents=True\` to be safe.\n- \`rename\` moves a file; if you loop over a glob while moving files, make the list first (\`sorted(...)\` does).`,
    analogy:`A librarian who can say "bring me every red-covered book" and then shelve them in a new room.`,
    example:R`from pathlib import Path

for p in sorted(Path(".").glob("*.txt")):
    print(p.name)`},
  predict:{code:R`from pathlib import Path
print(len(list(Path(".").glob("*.txt"))))`, q:'What prints? (The folder holds a.txt, b.txt and c.md.)', opts:['2','3','1'], ans:0, why:'Only the two .txt files match the pattern.', files:{'a.txt':'','b.txt':'','c.md':''}},
  cast:{code:R`from pathlib import Path

for p in sorted(Path(".").glob("*.txt")):
    print(p.name)`, task:'Cast it. The folder already contains a few files.', files:{'b.txt':'B','a.txt':'A','c.md':'C'}},
  bug:{broken:R`from pathlib import Path
Path("logs/2026").mkdir()
print(Path("logs/2026").is_dir())`, task:'FileNotFoundError: the parent folder "logs" does not exist. Create parents too. Expected: True',
    cases:[{inputs:[],tests:[['Made','lines==["True"]']]}],
    sol:R`from pathlib import Path
Path("logs/2026").mkdir(parents=True, exist_ok=True)
print(Path("logs/2026").is_dir())`, wrong:[R`from pathlib import Path
Path("logs/2026").mkdir()
print(Path("logs/2026").is_dir())`]},
  write:{prompt:'Tidy the folder. Create a folder `archive` (fine if it already exists). Move every `.txt` file in the current folder into it, printing `Moved: <name>` in alphabetical order. Finally print `Archive has: <n> files` (everything inside `archive`).',
    starter:R`from pathlib import Path

archive = Path("archive")
`,
    files:{'b.txt':'B','a.txt':'A','c.md':'C'},
    cases:[{inputs:[],files:{'b.txt':'B','a.txt':'A','c.md':'C'},tests:[['Printed','lines==["Moved: a.txt","Moved: b.txt","Archive has: 2 files"]'],['Files moved','exists("archive/a.txt") and exists("archive/b.txt") and not exists("a.txt") and not exists("b.txt")'],['Other files stay','exists("c.md") and not exists("archive/c.md")']]},{inputs:[],files:{'readme.md':'x'},tests:[['Nothing to move','lines==["Archive has: 0 files"]'],['Folder still made','exists("archive")']]},{inputs:[],files:{'archive/old.txt':'o','new.txt':'n'},tests:[['Existing archive','lines==["Moved: new.txt","Archive has: 2 files"]'],['Both inside','exists("archive/old.txt") and exists("archive/new.txt")']]}],
    sol:R`from pathlib import Path

archive = Path("archive")
archive.mkdir(exist_ok=True)
for path in sorted(Path(".").glob("*.txt")):
    path.rename(archive / path.name)
    print("Moved:", path.name)
count = len(list(archive.iterdir()))
print("Archive has:", count, "files")`,
    wrong:[R`from pathlib import Path

archive = Path("archive")
archive.mkdir()
for path in sorted(Path(".").glob("*.txt")):
    path.rename(archive / path.name)
    print("Moved:", path.name)
count = len(list(archive.iterdir()))
print("Archive has:", count, "files")`, R`from pathlib import Path

archive = Path("archive")
archive.mkdir(exist_ok=True)
for path in sorted(Path(".").glob("*.txt")):
    (archive / path.name).write_text(path.read_text())
    print("Moved:", path.name)
count = len(list(archive.iterdir()))
print("Archive has:", count, "files")`],
    hints:['archive.mkdir(exist_ok=True) makes the folder safely.','Loop over sorted(Path(".").glob("*.txt")) and use path.rename(archive / path.name).','Count everything left in the archive with len(list(archive.iterdir())).','from pathlib import Path\n\narchive = Path("archive")\narchive.mkdir(exist_ok=True)\nfor path in sorted(Path(".").glob("*.txt")):\n    path.rename(archive / path.name)\n    print("Moved:", path.name)\ncount = len(list(archive.iterdir()))\nprint("Archive has:", count, "files")']},
  power:{can:['Find files by pattern with glob','Create folders and move files safely'],
    expand:'Use rglob("*.txt") to also find notes in sub-folders.',
    where:'File organisers, backup scripts and build tools are mostly glob + rename.',
    next:'Next: exploring modules you have never seen.'},
  codex:{title:'glob and folders',body:'glob("*.txt") matches; sorted() for order. mkdir(parents=True, exist_ok=True). rename moves.',snip:R`for p in sorted(Path(".").glob("*.txt")):`}
},
{
  id:'r9-25', realm:9, n:25, title:'dir(), help() and docstrings: explore any module',
  teaches:['module-explore'], requires:['pathlib-glob'],
  story:`A crate of unlabelled tools arrives from a far-off guild. "You'll meet modules nobody has taught you," Master Cog says. "A real programmer asks the module itself: **What do you contain? What do you do?**"`,
  concept:{
    html:`\`\`\`\nimport math\n\ndir(math)              # list of every name inside (strings)\nmath.sqrt.__doc__      # the docstring: built-in documentation text\nhelp(math.sqrt)        # prints a formatted help page\ntype(math.pi)          # <class 'float'>\ncallable(math.sqrt)    # True: it can be called\n\`\`\`\n\n- **dir(x)** lists names; names starting with \`_\` are internal. Filter them: \`[n for n in dir(x) if not n.startswith("_")]\`.\n- A **docstring** is the first string inside a function, class or module: \`def area(r): """Return circle area."""\`. Read it with \`.__doc__\` (it is \`None\` if the author wrote none).\n- A docstring may span lines. The **first line** is the summary.\n- \`help()\` and \`dir()\` are your first stop when you meet a new library.\n- Write docstrings for **your own** functions too.`,
    analogy:`Asking a tool to read its own label out loud.`,
    example:R`import math

names = [n for n in dir(math) if not n.startswith("_")]
print("sqrt" in names, "banana" in names)

def area(r):
    """Return circle area."""
    return math.pi * r * r

print(area.__doc__)`},
  predict:{code:R`import math
print(callable(math.pi), callable(math.sqrt))`, q:'What prints?', opts:['False True','True True','True False'], ans:0, why:'math.pi is a number; math.sqrt is a function.'},
  cast:{code:R`import math

names = [n for n in dir(math) if not n.startswith("_")]
print("sqrt" in names, "banana" in names)

def area(r):
    """Return circle area."""
    return math.pi * r * r

print(area.__doc__)`, task:'Cast it.'},
  bug:{broken:R`import math
print("sqrt" in dir(math.sqrt()))`, task:'TypeError: math.sqrt() was CALLED with nothing. You want the names inside the module. Expected: True',
    cases:[{inputs:[],tests:[['Found','lines==["True"]']]}],
    sol:R`import math
print("sqrt" in dir(math))`, wrong:[R`import math
print("sqrt" in dir(math.sqrt()))`]},
  write:{prompt:'Write `summary(obj)`: the **first line** of `obj.__doc__`, stripped (use `No docs` if there is no docstring). Write `public_names(module)`: a sorted list of the module\'s names that do not start with `_`. Then print `summary(area)` and whether `"mean"` is in `public_names(statistics)`.',
    starter:R`import statistics

def area(r):
    """Return the area of a circle."""
    return 3.14159 * r * r
`,
    cases:[{inputs:[],tests:[['Printed','lines==["Return the area of a circle.","True"]'],['No docs','g["summary"](lambda: 1)=="No docs"'],['First line only','g["summary"](type("X",(),{"__doc__":"  First line.\\n\\nMore detail."}))=="First line."'],['Names sorted','(lambda m,n: n==sorted(n) and "sqrt" in n and not any(x.startswith("_") for x in n))(__import__("math"), g["public_names"](__import__("math")))'],['Dunders hidden','"__name__" not in g["public_names"](__import__("statistics"))']]}],
    sol:R`import statistics

def area(r):
    """Return the area of a circle."""
    return 3.14159 * r * r

def summary(obj):
    doc = obj.__doc__
    if not doc:
        return "No docs"
    return doc.strip().splitlines()[0].strip()

def public_names(module):
    return sorted(n for n in dir(module) if not n.startswith("_"))

print(summary(area))
print("mean" in public_names(statistics))`,
    wrong:[R`import statistics

def area(r):
    """Return the area of a circle."""
    return 3.14159 * r * r

def summary(obj):
    doc = obj.__doc__
    if not doc:
        return "No docs"
    return doc.strip()

def public_names(module):
    return sorted(n for n in dir(module) if not n.startswith("_"))

print(summary(area))
print("mean" in public_names(statistics))`, R`import statistics

def area(r):
    """Return the area of a circle."""
    return 3.14159 * r * r

def summary(obj):
    doc = obj.__doc__
    if not doc:
        return "No docs"
    return doc.strip().splitlines()[0].strip()

def public_names(module):
    return sorted(dir(module))

print(summary(area))
print("mean" in public_names(statistics))`],
    hints:['summary: if not obj.__doc__, return "No docs". Otherwise take doc.strip().splitlines()[0].','Strip that first line too.','public_names: sorted(n for n in dir(module) if not n.startswith("_")).','import statistics\n\ndef area(r):\n    """Return the area of a circle."""\n    return 3.14159 * r * r\n\ndef summary(obj):\n    doc = obj.__doc__\n    if not doc:\n        return "No docs"\n    return doc.strip().splitlines()[0].strip()\n\ndef public_names(module):\n    return sorted(n for n in dir(module) if not n.startswith("_"))\n\nprint(summary(area))\nprint("mean" in public_names(statistics))']},
  power:{can:['Discover what a module offers with dir()','Read and write docstrings'],
    expand:'Print the summary of statistics.mean using your summary function.',
    where:'Reading docs inside the interpreter is how experts learn new libraries quickly.',
    next:'Next: writing your own module.'},
  codex:{title:'dir and docstrings',body:'dir(x) lists names (filter the _ ones). x.__doc__ is the docstring (None if missing). help(x) prints docs.',snip:R`[n for n in dir(m) if not n.startswith("_")]`}
},
{
  id:'r9-26', realm:9, n:26, title:'Your own module: a file you import',
  teaches:['module-own'], requires:['module-explore'],
  story:`"Here's a secret," Master Cog whispers, sliding a brass plate across. "**Every .py file is a module.** Put your best tools in one file, and any other program can import them."`,
  concept:{
    html:`A module is just a Python file. If \`pricing.py\` sits in the same folder as your program:\n\n\`\`\`\n# pricing.py\nTAX_RATE = 0.10\n\ndef with_tax(price):\n    return round(price * (1 + TAX_RATE), 2)\n\`\`\`\n\n\`\`\`\n# main program\nimport pricing\n\nprint(pricing.with_tax(100))     # 110.0\nprint(pricing.TAX_RATE)          # 0.1\n\`\`\`\n\n- The module name is the **file name without \`.py\`**. (\`pricing.py\` → \`import pricing\`.)\n- Use names that are valid Python identifiers: letters, digits, underscores, no spaces or dashes.\n- Everything defined at the top level (functions, constants) becomes an attribute of the module.\n- If you change the module file, the new code is used the **next time you run** the program.\n- **Why bother?** One copy of the logic, used everywhere. Fix a bug once; every program is fixed.\n\n(In this app the Files panel above each code box shows the files in your folder, including modules like \`pricing.py\`.)`,
    analogy:`A shared toolbox every program in the workshop can borrow from.`,
    example:R`import pricing

print(pricing.with_tax(100))
print(pricing.discount(100, 20))`},
  predict:{code:R`import pricing
print(pricing.TAX_RATE)`, q:'The folder contains pricing.py with TAX_RATE = 0.10. What prints?', opts:['0.1','10','NameError'], ans:0, why:'Module-level names become attributes, so pricing.TAX_RATE is 0.1.', files:{'pricing.py':'TAX_RATE = 0.10\n\ndef with_tax(price):\n    return round(price * (1 + TAX_RATE), 2)\n'}},
  cast:{code:R`import pricing

print(pricing.with_tax(100))
print(pricing.discount(100, 20))`, task:'Cast it. Open the Files panel to see pricing.py.', files:{'pricing.py':'TAX_RATE = 0.10\n\ndef with_tax(price):\n    return round(price * (1 + TAX_RATE), 2)\n\ndef discount(price, percent):\n    return round(price * (1 - percent / 100), 2)\n'}},
  bug:{broken:R`from pricing import with_tax
print(pricing.with_tax(50))`, task:'NameError: only with_tax was imported, not the name pricing. Call it directly. Expected: 55.0',
    files:{'pricing.py':'TAX_RATE = 0.10\n\ndef with_tax(price):\n    return round(price * (1 + TAX_RATE), 2)\n'},
    cases:[{inputs:[],tests:[['Right','lines==["55.0"]']]}],
    sol:R`from pricing import with_tax
print(with_tax(50))`, wrong:[R`from pricing import with_tax
print(pricing.with_tax(50))`]},
  write:{prompt:'`pricing.py` is in your folder (open the Files panel). Import it. Ask `Price: ` and print `With tax: <pricing.with_tax(price)>` and `Discounted 20%: <pricing.discount(price, 20)>`, both with 2 decimals.',
    starter:R`price = float(input("Price: "))
`,
    inputs:['100'],
    files:{'pricing.py':'TAX_RATE = 0.10\n\ndef with_tax(price):\n    return round(price * (1 + TAX_RATE), 2)\n\ndef discount(price, percent):\n    return round(price * (1 - percent / 100), 2)\n'},
    cases:[{inputs:['100'],tests:[['Standard','lines[-2:]==["With tax: 110.00","Discounted 20%: 80.00"]'],['Imports it','"import pricing" in src or "from pricing import" in src']]},{inputs:['50'],files:{'pricing.py':'TAX_RATE = 0.20\n\ndef with_tax(price):\n    return round(price * (1 + TAX_RATE), 2)\n\ndef discount(price, percent):\n    return round(price * (1 - percent / 100), 2)\n'},tests:[['A different module gives a different answer','lines[-2:]==["With tax: 60.00","Discounted 20%: 40.00"]']]},{inputs:['0'],tests:[['Zero','lines[-2:]==["With tax: 0.00","Discounted 20%: 0.00"]']]}],
    sol:R`import pricing

price = float(input("Price: "))
print(f"With tax: {pricing.with_tax(price):.2f}")
print(f"Discounted 20%: {pricing.discount(price, 20):.2f}")`,
    wrong:[R`price = float(input("Price: "))
print(f"With tax: {price * 1.1:.2f}")
print(f"Discounted 20%: {price * 0.8:.2f}")`, R`import pricing

price = float(input("Price: "))
print(f"With tax: {pricing.with_tax(price):.2f}")
print(f"Discounted 20%: {pricing.discount(price, 0.2):.2f}")`],
    hints:['Put import pricing at the top.','pricing.with_tax(price) and pricing.discount(price, 20).','Format both with :.2f.','import pricing\n\nprice = float(input("Price: "))\nprint(f"With tax: {pricing.with_tax(price):.2f}")\nprint(f"Discounted 20%: {pricing.discount(price, 20):.2f}")']},
  power:{can:['Import functions from your own file','Explain why shared modules beat copy-pasting'],
    expand:'Add a `with_tip(price, percent)` function to your own module file idea and list what else belongs in it.',
    where:'Every real project is split into modules: pricing, users, database, reports.',
    next:'Next: the __name__ guard, so modules stay quiet when imported.'},
  codex:{title:'Own module',body:'File pricing.py is imported as pricing. Top-level names become attributes. Use valid identifier names.',snip:R`import pricing
pricing.with_tax(100)`}
},
{
  id:'r9-27', realm:9, n:27, title:'if __name__ == "__main__": scripts that are also modules',
  teaches:['module-main'], requires:['module-own'],
  story:`"Disaster!" Master Cog cries. Every time a customer imports the Workshop's calculator file, it also prints a loud demo. "A module should be **quiet when imported** and only perform when run directly."`,
  concept:{
    html:`When Python **imports** a file it runs it top to bottom. Any \`print\` or other action at the top level happens at import time.\n\nEvery module has a built-in variable \`__name__\`:\n\n- run directly as the program: \`__name__\` is \`"__main__"\`\n- imported by another file: \`__name__\` is the **module's name** (e.g. \`"calculator"\`)\n\nSo guard your demo:\n\n\`\`\`\ndef double(n):\n    return n * 2\n\nif __name__ == "__main__":\n    print(double(21))      # runs only when this file is the program\n\`\`\`\n\n- Put **definitions** at the top level (safe to import) and **actions** under the guard.\n- This is the idiom you'll see at the bottom of nearly every Python script.\n- Two underscores each side. \`"__main__"\` is a string.`,
    analogy:`A shop sign that says "demo only when the owner is here".`,
    example:R`print(__name__)

def hello():
    print("hi")

if __name__ == "__main__":
    hello()`},
  predict:{code:R`print(__name__)`, q:'When you run this file directly, what prints?', opts:['__main__','main','the file name'], ans:0, why:'The file you run is called __main__.'},
  cast:{code:R`print(__name__)

def hello():
    print("hi")

if __name__ == "__main__":
    hello()`, task:'Cast it.'},
  bug:{broken:R`def double(n):
    return n * 2

print("self-test:", double(4))`, task:'This self-test would also print whenever another file imports this one. Guard it so it only runs when the file is the program. (It should still print when run directly.)',
    cases:[{inputs:[],tests:[['Still prints','lines==["self-test: 8"]'],['Silent when imported','(lambda calls: (exec(src, {"__name__":"lib","print":lambda *a,**k: calls.append(1)}), calls)[1])([])==[]']]}],
    sol:R`def double(n):
    return n * 2

if __name__ == "__main__":
    print("self-test:", double(4))`, wrong:[R`def double(n):
    return n * 2

print("self-test:", double(4))`]},
  write:{prompt:'Write `double(n)` and `triple(n)`. Add a guarded demo that prints `double(21)` then `triple(5)`. Nothing should print if the file is imported.',
    starter:R`def double(n):
    pass
`,
    cases:[{inputs:[],tests:[['Demo output','lines==["42","15"]'],['Functions work','g["double"](4)==8 and g["triple"](3)==9 and g["double"](-2)==-4'],['Silent when imported','(lambda calls: (exec(src, {"__name__":"lib","print":lambda *a,**k: calls.append(1)}), calls)[1])([])==[]'],['Uses the guard','"__name__" in src and "__main__" in src']]}],
    sol:R`def double(n):
    return n * 2

def triple(n):
    return n * 3

if __name__ == "__main__":
    print(double(21))
    print(triple(5))`,
    wrong:[R`def double(n):
    return n * 2

def triple(n):
    return n * 3

print(double(21))
print(triple(5))`, R`def double(n):
    return n * 2

def triple(n):
    return n * 3

if __name__ == "main":
    print(double(21))
    print(triple(5))`],
    hints:['Define double and triple at the top level.','Guard the demo: if __name__ == "__main__":','Inside the guard, print(double(21)) and print(triple(5)).','def double(n):\n    return n * 2\n\ndef triple(n):\n    return n * 3\n\nif __name__ == "__main__":\n    print(double(21))\n    print(triple(5))']},
  power:{can:['Write files that work as both a program and a module','Explain what __name__ is'],
    expand:'Put the demo into a function main() and call main() under the guard.',
    where:'Every script and library you read uses this idiom.',
    next:'Next: folders of modules, called packages.'},
  codex:{title:'__main__ guard',body:'Run directly: __name__ == "__main__". Imported: __name__ is the module name. Put demos under the guard.',snip:R`if __name__ == "__main__":
    main()`}
},
{
  id:'r9-28', realm:9, n:28, title:'Packages: folders of modules',
  teaches:['module-package'], requires:['module-main'],
  story:`The Workshop grows. Master Cog has a drawer for pricing, one for carts, one for receipts. "When one file isn't enough, a **folder** of modules becomes a package."`,
  concept:{
    html:`A **package** is a folder that contains modules and an \`__init__.py\` file (it may be empty). Layout:\n\n\`\`\`\nshop/\n    __init__.py      # runs when you import shop\n    prices.py\n    cart.py\n\`\`\`\n\nImport with dots:\n\n\`\`\`\nimport shop\nimport shop.prices                  # the module inside\nfrom shop.cart import total         # one name from a module in the package\n\nshop.VERSION                        # anything defined in __init__.py\nshop.prices.price_of("apple")\n\`\`\`\n\n- \`import shop\` runs \`__init__.py\`, but it does **not** automatically import \`shop.cart\` unless \`__init__.py\` does. Without \`import shop.cart\`, \`shop.cart\` is an \`AttributeError\`.\n- Inside the package, modules import each other with the full path (\`from shop.prices import price_of\`).\n- Big libraries (\`json\`, \`collections\`, \`email\`, \`urllib\`) are packages.\n- Good package design: small modules with one clear job each.`,
    analogy:`A filing cabinet: the cabinet is the package, each drawer is a module.`,
    example:R`import shop
from shop.cart import total

print(shop.VERSION)
print(total(["apple", "pear"]))`},
  predict:{code:R`import shop.prices
print(shop.prices.price_of("pear"))`, q:'The package has prices.py with PRICES = {"apple": 0.5, "pear": 0.75, ...}. What prints?', opts:['0.75','AttributeError','KeyError'], ans:0, why:'import shop.prices makes shop.prices available, so the call works.', files:{'shop/__init__.py':'VERSION = "1.0"\n','shop/prices.py':'PRICES = {"apple": 0.5, "pear": 0.75, "plum": 0.25}\n\ndef price_of(item):\n    return PRICES[item]\n'}},
  cast:{code:R`import shop
from shop.cart import total

print(shop.VERSION)
print(total(["apple", "pear"]))`, task:'Cast it. Open the Files panel to see the shop package.', files:{'shop/__init__.py':'"""A tiny shop package."""\nVERSION = "1.0"\n','shop/prices.py':'PRICES = {"apple": 0.5, "pear": 0.75, "plum": 0.25}\n\ndef price_of(item):\n    return PRICES[item]\n','shop/cart.py':'from shop.prices import price_of\n\ndef total(items):\n    return sum(price_of(i) for i in items)\n'}},
  bug:{broken:R`import shop
print(shop.cart.total(["apple"]))`, task:'AttributeError: importing shop does not import shop.cart. Import the module you use. Expected: 0.5',
    files:{'shop/__init__.py':'VERSION = "1.0"\n','shop/prices.py':'PRICES = {"apple": 0.5, "pear": 0.75, "plum": 0.25}\n\ndef price_of(item):\n    return PRICES[item]\n','shop/cart.py':'from shop.prices import price_of\n\ndef total(items):\n    return sum(price_of(i) for i in items)\n'},
    cases:[{inputs:[],tests:[['Right','lines==["0.5"]']]}],
    sol:R`import shop.cart
print(shop.cart.total(["apple"]))`, wrong:[R`import shop
print(shop.cart.total(["apple"]))`]},
  write:{prompt:'The `shop` package is in your folder. Ask `Items: ` (space-separated). Use `import shop` and `from shop.cart import total`. Print `Version: <shop.VERSION>`, then `Total: <total(items)>` with 2 decimals. If the shop does not sell an item, `total` raises `KeyError`: print `Unknown item: <name>` instead of the total.',
    starter:R`import shop

items = input("Items: ").split()
`,
    inputs:['apple pear'],
    files:{'shop/__init__.py':'"""A tiny shop package."""\nVERSION = "1.0"\n','shop/prices.py':'PRICES = {"apple": 0.5, "pear": 0.75, "plum": 0.25}\n\ndef price_of(item):\n    return PRICES[item]\n','shop/cart.py':'from shop.prices import price_of\n\ndef total(items):\n    return sum(price_of(i) for i in items)\n'},
    cases:[{inputs:['apple pear'],tests:[['Total','lines[-2:]==["Version: 1.0","Total: 1.25"]'],['Imports','"from shop.cart import" in src or "import shop.cart" in src']]},{inputs:['plum plum plum plum'],tests:[['Repeats','lines[-1]=="Total: 1.00"']]},{inputs:['kiwi'],tests:[['Unknown','lines[-2:]==["Version: 1.0","Unknown item: kiwi"]']]},{inputs:['apple kiwi'],tests:[['Unknown mid-list','lines[-1]=="Unknown item: kiwi"']]},{inputs:['apple pear'],files:{'shop/__init__.py':'VERSION = "2.0"\n','shop/prices.py':'PRICES = {"apple": 1.0, "pear": 0.5}\n\ndef price_of(item):\n    return PRICES[item]\n','shop/cart.py':'from shop.prices import price_of\n\ndef total(items):\n    return sum(price_of(i) for i in items)\n'},tests:[['Uses the package, not copies','lines[-2:]==["Version: 2.0","Total: 1.50"]']]}],
    sol:R`import shop
from shop.cart import total

items = input("Items: ").split()
print("Version:", shop.VERSION)
try:
    print(f"Total: {total(items):.2f}")
except KeyError as error:
    print("Unknown item:", error.args[0])`,
    wrong:[R`import shop

items = input("Items: ").split()
prices = {"apple": 0.5, "pear": 0.75, "plum": 0.25}
print("Version: 1.0")
try:
    print(f"Total: {sum(prices[i] for i in items):.2f}")
except KeyError as error:
    print("Unknown item:", error.args[0])`, R`import shop
from shop.cart import total

items = input("Items: ").split()
print("Version:", shop.VERSION)
print(f"Total: {total(items):.2f}")`],
    hints:['shop.VERSION comes from __init__.py.','total(items) may raise KeyError. Wrap it in try / except KeyError as error.','error.args[0] is the missing item name.','import shop\nfrom shop.cart import total\n\nitems = input("Items: ").split()\nprint("Version:", shop.VERSION)\ntry:\n    print(f"Total: {total(items):.2f}")\nexcept KeyError as error:\n    print("Unknown item:", error.args[0])']},
  power:{can:['Use packages with dotted imports','Know what __init__.py does'],
    expand:'Add a `receipts.py` module idea to the package and say which names it would import.',
    where:'Real applications are packages: django, flask, pandas, requests.',
    next:'Next: what happens when an import fails.'},
  codex:{title:'Packages',body:'Folder + __init__.py. import pkg.module, from pkg.module import name. __init__ runs on import pkg.',snip:R`from shop.cart import total`}
},
{
  id:'r9-29', realm:9, n:29, title:'Import errors and optional imports',
  teaches:['module-errors'], requires:['module-package'],
  story:`A parcel arrives from a guild whose tool you don't own. "The program should still run, with fewer features," Master Cog says. "Learn to **catch a missing import**."`,
  concept:{
    html:`Importing something that does not exist raises \`ModuleNotFoundError\` (a kind of \`ImportError\`):\n\n\`\`\`\ntry:\n    import fancy_colors\nexcept ModuleNotFoundError:\n    fancy_colors = None        # fall back: run without the extra\n\nif fancy_colors:\n    ...\nelse:\n    ...\n\`\`\`\n\n- **\`ModuleNotFoundError\`**: the module wasn't found. **\`ImportError\`**: the module exists but the name inside doesn't (\`from math import banana\`).\n- This **optional import** pattern is used by many libraries: "use the fast package if it is installed, otherwise the slow one".\n- To import a module whose name is **in a variable**, use \`importlib.import_module(name)\`:\n\n\`\`\`\nimport importlib\nmod = importlib.import_module("json")\n\`\`\`\n\n- Catch the specific error (\`ModuleNotFoundError\`), not a bare \`except:\`. A bare except would hide real bugs inside the module.`,
    analogy:`If the fancy tool isn't on the shelf, use the plain one instead of stopping the workshop.`,
    example:R`try:
    import fancy_colors
except ModuleNotFoundError:
    fancy_colors = None

print("fancy" if fancy_colors else "plain")`},
  predict:{code:R`try:
    from math import banana
except ImportError:
    print("nope")`, q:'What prints?', opts:['nope','Nothing, a crash','banana'], ans:0, why:'math exists but has no banana: that is an ImportError, which we caught.'},
  cast:{code:R`try:
    import fancy_colors
except ModuleNotFoundError:
    fancy_colors = None

print("fancy" if fancy_colors else "plain")`, task:'Cast it.'},
  bug:{broken:R`import statistics_pro
print("using statistics_pro")`, task:'ModuleNotFoundError: that package is not installed. Catch it and print "using fallback" instead.',
    cases:[{inputs:[],tests:[['Fallback','lines==["using fallback"]']]}],
    sol:R`try:
    import statistics_pro
    print("using statistics_pro")
except ModuleNotFoundError:
    print("using fallback")`, wrong:[R`import statistics_pro
print("using statistics_pro")`]},
  write:{prompt:'Ask `Module: ` (a module name). Try to import it with `importlib.import_module`. Print `Loaded <name>` if it works or `Missing <name>` if the module does not exist.',
    starter:R`import importlib

name = input("Module: ")
`,
    inputs:['math'],
    cases:[{inputs:['math'],tests:[['Built in','lines[-1]=="Loaded math"']]},{inputs:['json'],tests:[['Standard library','lines[-1]=="Loaded json"']]},{inputs:['collections.abc'],tests:[['Dotted','lines[-1]=="Loaded collections.abc"']]},{inputs:['not_a_real_module'],tests:[['Missing','lines[-1]=="Missing not_a_real_module"']]},{inputs:['shapes'],files:{'shapes.py':'def area(s):\n    return s * s\n'},tests:[['A module in your folder loads','lines[-1]=="Loaded shapes"']]},{inputs:['shapes'],tests:[['Without the file it is missing','lines[-1]=="Missing shapes"'],['Uses import_module','"import_module(" in src']]}],
    sol:R`import importlib

name = input("Module: ")
try:
    importlib.import_module(name)
    print("Loaded", name)
except ModuleNotFoundError:
    print("Missing", name)`,
    wrong:[R`import importlib

name = input("Module: ")
importlib.import_module(name)
print("Loaded", name)`, R`import sys

name = input("Module: ")
if name in sys.modules:
    print("Loaded", name)
else:
    print("Missing", name)`],
    hints:['importlib.import_module(name) imports by a name stored in a variable.','Wrap it in try / except ModuleNotFoundError.','Print Loaded or Missing with the name.','import importlib\n\nname = input("Module: ")\ntry:\n    importlib.import_module(name)\n    print("Loaded", name)\nexcept ModuleNotFoundError:\n    print("Missing", name)']},
  power:{can:['Catch a missing module and carry on','Import by a name held in a variable'],
    expand:'Try "fast_json" first and fall back to the standard json module.',
    where:'Plugin systems and optional features use try-import and import_module.',
    next:'Next: third-party packages and pip.'},
  codex:{title:'Import errors',body:'ModuleNotFoundError: no such module. ImportError: no such name inside it. try/except for optional imports. importlib.import_module(name).',snip:R`try:
    import extra
except ModuleNotFoundError:
    extra = None`}
},
{
  id:'r9-30', realm:9, n:30, title:'pip, PyPI and third-party packages',
  teaches:['module-pip'], requires:['module-errors'],
  story:`"The standard library is only the beginning," Master Cog says, opening a gate to a vast market. "Millions of programmers share tools there. Taking from it is called **installing a package**."`,
  concept:{
    html:`**Third-party packages** are tools written by other people and shared on **PyPI**, the Python Package Index (more than half a million packages).\n\nYou install them with **pip** in a **terminal** (not inside a Python program):\n\n\`\`\`\npip install requests\npip install pandas==2.2.0\npip list\npip freeze > requirements.txt     # save the exact versions you use\npip install -r requirements.txt   # install them all again\n\`\`\`\n\nThen in Python it is a normal import: \`import requests\`.\n\n- **Virtual environments** (\`python -m venv .venv\`) give each project its own set of packages, so projects can't break each other.\n- A \`requirements.txt\` file lists what a project needs so teammates can reproduce it.\n- **Be careful what you install:** check the name (typo-squatting happens), the project's popularity and its maintainers.\n- Packages are stored in a \`site-packages\` folder; Python finds them through \`sys.path\`.\n- To ask "can I import this?" **without crashing**, use \`importlib.util.find_spec(name)\`: it returns a spec if the module can be found and \`None\` if not.\n\nThis app's Python is sandboxed and offline, so we practise the checks, not the downloading.`,
    analogy:`pip is the delivery service; PyPI is the giant catalogue; a virtual environment is a separate toolbox per project.`,
    example:R`import importlib.util

print(importlib.util.find_spec("json") is not None)
print(importlib.util.find_spec("fancy_gizmo") is not None)`},
  predict:{code:R`import importlib.util
print(importlib.util.find_spec("no_such_pkg"))`, q:'What prints?', opts:['None','ModuleNotFoundError','False'], ans:0, why:'find_spec returns None when the module cannot be found.'},
  cast:{code:R`import importlib.util

print(importlib.util.find_spec("json") is not None)
print(importlib.util.find_spec("fancy_gizmo") is not None)`, task:'Cast it.'},
  bug:{broken:R`pip install fancy_gizmo
print("installed")`, task:'SyntaxError: pip is a terminal command, not Python. Replace this with a check that prints True if fancy_gizmo is missing. Expected: True',
    cases:[{inputs:[],tests:[['Missing','lines==["True"]'],['Uses find_spec','"find_spec" in src']]}],
    sol:R`import importlib.util
print(importlib.util.find_spec("fancy_gizmo") is None)`, wrong:[R`pip install fancy_gizmo
print("installed")`]},
  write:{prompt:'Write `have(name)` that returns `True` if a module can be found (use `importlib.util.find_spec`) and `False` otherwise. Ask `Package: ` and print `Available` or `Not available`.',
    starter:R`import importlib.util

def have(name):
    pass

name = input("Package: ")
`,
    inputs:['json'],
    cases:[{inputs:['json'],tests:[['Library','lines[-1]=="Available"'],['have is a bool','g["have"]("json") is True and g["have"]("zzz_nope") is False']]},{inputs:['zzz_not_installed'],tests:[['Missing','lines[-1]=="Not available"']]},{inputs:['localtool'],files:{'localtool.py':'X = 1\n'},tests:[['Local file counts','lines[-1]=="Available" and g["have"]("localtool") is True']]},{inputs:['localtool'],tests:[['Not there','lines[-1]=="Not available"'],['Uses find_spec','"find_spec(" in src']]}],
    sol:R`import importlib.util

def have(name):
    return importlib.util.find_spec(name) is not None

name = input("Package: ")
print("Available" if have(name) else "Not available")`,
    wrong:[R`import sys

def have(name):
    return name in sys.modules

name = input("Package: ")
print("Available" if have(name) else "Not available")`, R`import importlib.util

def have(name):
    return True

name = input("Package: ")
print("Available" if have(name) else "Not available")`],
    hints:['importlib.util.find_spec(name) returns None when not found.','have returns find_spec(name) is not None, so it is a real True/False.','Print Available / Not available from have(name).','import importlib.util\n\ndef have(name):\n    return importlib.util.find_spec(name) is not None\n\nname = input("Package: ")\nprint("Available" if have(name) else "Not available")']},
  power:{can:['Explain pip, PyPI, venv and requirements.txt','Check for a package without crashing'],
    expand:'Write the three terminal commands to make a venv, activate it and install requests.',
    where:'Day one on any real project: create a venv, run pip install -r requirements.txt.',
    next:'Next: why importing twice doesn\'t run a module twice.'},
  codex:{title:'pip & packages',body:'pip install name (in a terminal). requirements.txt lists needs. venv isolates projects. find_spec(name) is None if missing.',snip:R`importlib.util.find_spec("name") is None`}
},
{
  id:'r9-31', realm:9, n:31, title:'Modules run once: the import cache',
  teaches:['module-cache'], requires:['module-pip'],
  story:`"Does a module re-run every time someone imports it?" an apprentice asks. Master Cog smiles. "That would be chaos. Python keeps a ledger of what's already loaded."`,
  concept:{
    html:`The **first** \`import counter_mod\` runs the whole file and stores the finished module in \`sys.modules\` (a dict). Every later import just **reuses** that stored module: the file is not run again.\n\n\`\`\`\n# counter_mod.py\nprint("loading counter_mod")\ncount = 0\ndef bump():\n    global count\n    count += 1\n    return count\n\`\`\`\n\n\`\`\`\nimport counter_mod     # prints "loading counter_mod"\nimport counter_mod     # silent: reused\ncounter_mod.bump()     # 1\ncounter_mod.bump()     # 2: the same module keeps its state\n\`\`\`\n\n- A module therefore behaves like a **shared single copy**: state inside it is shared by everyone who imports it.\n- \`import importlib; importlib.reload(counter_mod)\` forces a re-run (rarely needed).\n- ⚠️ \`from counter_mod import count\` copies the **value at that moment**. After \`bump()\`, your \`count\` is stale. Read \`counter_mod.count\` instead.\n- You can peek at the ledger: \`"counter_mod" in sys.modules\`.`,
    analogy:`A library with one master copy of each book: borrowers share it, nobody re-prints it.`,
    example:R`import counter_mod
import counter_mod

print(counter_mod.bump())
print(counter_mod.bump())`},
  predict:{code:R`import counter_mod
import counter_mod
print("done")`, q:'The module prints "loading counter_mod" at the top. How many times does that line appear?', opts:['1','2','0'], ans:0, why:'The second import reuses the already-loaded module; the file runs once.', files:{'counter_mod.py':'print("loading counter_mod")\ncount = 0\n\ndef bump():\n    global count\n    count += 1\n    return count\n'}},
  cast:{code:R`import counter_mod
import counter_mod

print(counter_mod.bump())
print(counter_mod.bump())`, task:'Cast it. Notice "loading" appears only once.', files:{'counter_mod.py':'print("loading counter_mod")\ncount = 0\n\ndef bump():\n    global count\n    count += 1\n    return count\n'}},
  bug:{broken:R`from counter_mod import count, bump
bump()
print(count)`, task:'It prints 0 because from-import copied the value before bump(). Read the live value from the module. Expected: loading counter_mod, then 1',
    files:{'counter_mod.py':'print("loading counter_mod")\ncount = 0\n\ndef bump():\n    global count\n    count += 1\n    return count\n'},
    cases:[{inputs:[],tests:[['Live value','lines==["loading counter_mod","1"]']]}],
    sol:R`import counter_mod
counter_mod.bump()
print(counter_mod.count)`, wrong:[R`from counter_mod import count, bump
bump()
print(count)`]},
  write:{prompt:'`counter_mod.py` is in your folder. Import it **twice** with two separate `import counter_mod` lines. Then call `counter_mod.bump()` twice, printing each result. (The module prints `loading counter_mod` itself, once.)',
    starter:R`# two imports, then two prints
`,
    files:{'counter_mod.py':'print("loading counter_mod")\ncount = 0\n\ndef bump():\n    global count\n    count += 1\n    return count\n'},
    cases:[{inputs:[],tests:[['Loaded once, counted twice','lines==["loading counter_mod","1","2"]'],['Two imports written','src.count("import counter_mod")>=2']]}],
    sol:R`import counter_mod
import counter_mod

print(counter_mod.bump())
print(counter_mod.bump())`,
    wrong:[R`import counter_mod
import importlib
importlib.reload(counter_mod)

print(counter_mod.bump())
print(counter_mod.bump())`, R`import counter_mod
import counter_mod

print(counter_mod.bump())`],
    hints:['Write import counter_mod on two separate lines.','Then print(counter_mod.bump()) twice. The state is shared, so you get 1 then 2.','Do not reload: that would run the file (and its print) again.','import counter_mod\nimport counter_mod\n\nprint(counter_mod.bump())\nprint(counter_mod.bump())']},
  power:{can:['Explain that a module runs once and is cached','Avoid the stale from-import trap'],
    expand:'Print "counter_mod" in sys.modules before and after the import.',
    where:'Database connections and settings are often shared module-level objects for this reason.',
    next:'Next: how Python finds modules, and sys.path.'},
  codex:{title:'Import cache',body:'First import runs the file; later imports reuse it from sys.modules. from m import x copies the value (stale). importlib.reload re-runs.',snip:R`import counter_mod
counter_mod.count`}
},
{
  id:'r9-32', realm:9, n:32, title:'sys.path: where Python looks for modules',
  teaches:['module-path'], requires:['module-cache'],
  story:`"I wrote a great module and Python says it doesn't exist!" a weaver wails. Master Cog unrolls a list of folders. "Python only searches **certain places**, in order. Let's read the list."`,
  concept:{
    html:`When you \`import x\`, Python looks through the folders in the list **\`sys.path\`**, in order, and uses the first match:\n\n1. the folder of the running program (or the current folder)\n2. the standard library folders\n3. the \`site-packages\` folders (where pip installs things)\n\n\`\`\`\nimport sys\nprint(sys.path)             # a list of folder names (strings)\nsys.path.append("libs")     # also search the 'libs' folder\n\`\`\`\n\n- If your module sits in a sub-folder that is **not** on \`sys.path\`, you get \`ModuleNotFoundError\`. Add the folder, or make it a package with \`__init__.py\`.\n- **Shadowing trap:** because your own folder is searched **first**, a file called \`random.py\` or \`json.py\` of your own would hide the real standard-library module. Never name your files after standard modules.\n- Each module knows where it came from: \`module.__file__\` (built-in modules may have none).\n- Prefer packages and clean layouts to editing \`sys.path\`.`,
    analogy:`A treasure map with an ordered list of places to search: the first hit wins.`,
    example:R`import sys
import json

print(type(sys.path), len(sys.path) > 0)
print(json.__file__.endswith("__init__.py"))`},
  predict:{code:R`import sys
sys.path.append("libs")
print(sys.path[-1])`, q:'What prints?', opts:['libs','The current folder','Nothing, it errors'], ans:0, why:'append adds to the END of the list, so the last item is "libs".'},
  cast:{code:R`import sys
import json

print(type(sys.path), len(sys.path) > 0)
print(json.__file__.endswith("__init__.py"))`, task:'Cast it.'},
  bug:{broken:R`import extra
print(extra.hello())`, task:'ModuleNotFoundError: extra.py lives in the "libs" folder, which Python does not search. Add that folder to sys.path before importing. Expected: hi from extra',
    files:{'libs/extra.py':'def hello():\n    return "hi from extra"\n'},
    cases:[{inputs:[],tests:[['Found','lines==["hi from extra"]']]}],
    sol:R`import sys
sys.path.append("libs")
import extra
print(extra.hello())`, wrong:[R`import extra
print(extra.hello())`]},
  write:{prompt:'Write `is_local(name)`: import the module (`importlib.import_module`) and return `True` only if the module\'s `__file__` is inside the **current folder** (`os.getcwd()`). Modules without a `__file__` give `False`. Ask `Module: ` and print `Local` or `Library`. (Use `os.path.realpath` on both sides to compare.)',
    starter:R`import importlib
import os

def is_local(name):
    pass

name = input("Module: ")
`,
    inputs:['json'],
    cases:[{inputs:['json'],tests:[['Standard library','lines[-1]=="Library"'],['is_local bool','g["is_local"]("json") is False']]},{inputs:['math'],tests:[['Built in','lines[-1]=="Library"']]},{inputs:['helpers'],files:{'helpers.py':'def go():\n    return 1\n'},tests:[['Your own file','lines[-1]=="Local" and g["is_local"]("helpers") is True']]},{inputs:['collections'],tests:[['Package','lines[-1]=="Library"'],['Uses __file__','"__file__" in src']]}],
    sol:R`import importlib
import os

def is_local(name):
    module = importlib.import_module(name)
    path = getattr(module, "__file__", None)
    if not path:
        return False
    folder = os.path.dirname(os.path.realpath(path))
    return folder == os.path.realpath(os.getcwd())

name = input("Module: ")
print("Local" if is_local(name) else "Library")`,
    wrong:[R`import importlib
import os

def is_local(name):
    module = importlib.import_module(name)
    return hasattr(module, "__file__")

name = input("Module: ")
print("Local" if is_local(name) else "Library")`, R`import importlib
import os

def is_local(name):
    return False

name = input("Module: ")
print("Local" if is_local(name) else "Library")`],
    hints:['module = importlib.import_module(name), then getattr(module, "__file__", None).','No __file__ means False. Otherwise take os.path.dirname(os.path.realpath(path)).','Compare that folder with os.path.realpath(os.getcwd()).','import importlib\nimport os\n\ndef is_local(name):\n    module = importlib.import_module(name)\n    path = getattr(module, "__file__", None)\n    if not path:\n        return False\n    folder = os.path.dirname(os.path.realpath(path))\n    return folder == os.path.realpath(os.getcwd())\n\nname = input("Module: ")\nprint("Local" if is_local(name) else "Library")']},
  power:{can:['Explain how Python searches for modules','Fix not-found errors and avoid shadowing'],
    expand:'Print the first three entries of sys.path.',
    where:'"Works on my machine" import errors are almost always a sys.path or shadowing problem.',
    next:'Next: Mission! A dice-notation roller.'},
  codex:{title:'sys.path',body:'import searches sys.path in order. Your folder first, then the standard library, then site-packages. Never name a file like a standard module.',snip:R`sys.path.append("libs")`}
},
{
  id:'r9-33', realm:9, n:33, title:'Real-World Mission: The Dice Notation Roller',
  teaches:['mission9a'], requires:['module-path','random-sample'],
  story:`The tavern-keepers of the Workshop's guild hall are tired of arguing over house rules. "We write rolls like **2d6+3**: two six-sided dice, add three. Make us a roller that understands that notation, and never accepts nonsense."`,
  concept:{
    html:`**Dice notation** is the shorthand tabletop games use:\n\n- \`2d6\`: roll 2 dice with 6 sides, add them up\n- \`d20\`: no count means **1** die\n- \`3d8+2\` / \`1d10-1\`: add or subtract a **modifier**\n\nThis mission combines **\`re\`** (parse the text), **\`random\`** (roll), **functions**, **exceptions** (bad input) and **tuples** (return several values).\n\nA clean design has two layers:\n\n\`\`\`\nparse("2d6+3")  ->  (2, 6, 3)             # count, sides, modifier\nroll("2d6+3")   ->  ([4, 2], 9)           # the individual rolls, and the total\n\`\`\`\n\nUse \`re.fullmatch(r"(\\d*)d(\\d+)([+-]\\d+)?", text)\` and raise \`ValueError\` for anything that doesn't fit (or for 0 dice or 0 sides). \`int("+3")\` is 3 and \`int("-2")\` is -2, so you can convert the modifier straight away.\n\nTesting random code: roll **one-sided dice** (\`3d1+2\` is always 5) for exact answers, and check **ranges** for the rest.`,
    analogy:`A tavern referee who reads the shorthand and rolls the dice honestly.`,
    example:R`import re

m = re.fullmatch(r"(\d*)d(\d+)([+-]\d+)?", "2d6+3")
print(m.groups())`},
  predict:{code:R`import re
m = re.fullmatch(r"(\d*)d(\d+)([+-]\d+)?", "d20")
print(m.groups())`, q:'What prints?', opts:["('', '20', None)","('1', '20', '0')","None"], ans:0, why:'The count and modifier groups did not take part in the match: empty string and None.'},
  cast:{code:R`import re

m = re.fullmatch(r"(\d*)d(\d+)([+-]\d+)?", "2d6+3")
print(m.groups())`, task:'Cast it. Try "d20" and "2d6-1".'},
  bug:{broken:R`import re
m = re.fullmatch(r"(\d*)d(\d+)([+-]\d+)?", "d20")
count = int(m.group(1))
print(count)`, task:'ValueError: an empty count must mean 1 die. Fix it. Expected: 1',
    cases:[{inputs:[],tests:[['One die','lines==["1"]']]}],
    sol:R`import re
m = re.fullmatch(r"(\d*)d(\d+)([+-]\d+)?", "d20")
count = int(m.group(1)) if m.group(1) else 1
print(count)`, wrong:[R`import re
m = re.fullmatch(r"(\d*)d(\d+)([+-]\d+)?", "d20")
count = int(m.group(1))
print(count)`]},
  write:{prompt:'Build the roller. `parse(text)` returns `(count, sides, modifier)` (case-insensitive, no spaces, count defaults to 1, modifier to 0) and raises `ValueError` for bad text, 0 dice or 0 sides. `roll(text)` returns `(list_of_rolls, total)`. The program asks `Roll: ` and prints `Rolls: <numbers>` and `Total: <n>`, or `Invalid roll`.',
    starter:R`import re
import random

def parse(text):
    pass

def roll(text):
    pass

text = input("Roll: ")
`,
    inputs:['3d1+2'],
    cases:[{inputs:['3d1+2'],tests:[['Exact via one-sided dice','lines[-2:]==["Rolls: 1 1 1","Total: 5"]'],['parse','g["parse"]("2d6+3")==(2,6,3) and g["parse"]("d20")==(1,20,0) and g["parse"]("4D8-2")==(4,8,-2)'],['roll range','all(5<=g["roll"]("2d6+3")[1]<=15 for _ in range(300))'],['roll shape','(lambda r: len(r[0])==2 and all(1<=x<=6 for x in r[0]) and r[1]==sum(r[0])+3)(g["roll"]("2d6+3"))'],['roll d20 covers the range','{g["roll"]("d20")[1] for _ in range(1500)}>=set(range(2,20))'],['bad input raises','all(__import__("unittest").TestCase().assertRaises(ValueError, g["parse"], t) is None for t in ["abc","0d6","2d0","2d6+","","d","2d6+3x"])']]},{inputs:['d1-1'],tests:[['Negative modifier','lines[-2:]==["Rolls: 1","Total: 0"]']]},{inputs:['2D1'],tests:[['Upper case','lines[-2:]==["Rolls: 1 1","Total: 2"]']]},{inputs:['abc'],tests:[['Nonsense','lines[-1]=="Invalid roll"']]},{inputs:['0d6'],tests:[['No dice','lines[-1]=="Invalid roll"']]},{inputs:['2d0'],tests:[['No sides','lines[-1]=="Invalid roll"']]},{inputs:['2d6+'],tests:[['Dangling plus','lines[-1]=="Invalid roll"'],['Uses re','"re.fullmatch(" in src or "re.match(" in src']]}],
    sol:R`import re
import random

def parse(text):
    match = re.fullmatch(r"(\d*)d(\d+)([+-]\d+)?", text.strip().lower())
    if not match:
        raise ValueError("bad notation")
    count = int(match.group(1)) if match.group(1) else 1
    sides = int(match.group(2))
    modifier = int(match.group(3)) if match.group(3) else 0
    if count < 1 or sides < 1:
        raise ValueError("bad numbers")
    return count, sides, modifier

def roll(text):
    count, sides, modifier = parse(text)
    rolls = [random.randint(1, sides) for _ in range(count)]
    return rolls, sum(rolls) + modifier

text = input("Roll: ")
try:
    rolls, total = roll(text)
except ValueError:
    print("Invalid roll")
else:
    print("Rolls:", *rolls)
    print("Total:", total)`,
    wrong:[R`import re
import random

def parse(text):
    match = re.fullmatch(r"(\d*)d(\d+)([+-]\d+)?", text.strip().lower())
    if not match:
        raise ValueError("bad notation")
    count = int(match.group(1)) if match.group(1) else 1
    sides = int(match.group(2))
    modifier = int(match.group(3).lstrip("+-")) if match.group(3) else 0
    if count < 1 or sides < 1:
        raise ValueError("bad numbers")
    return count, sides, modifier

def roll(text):
    count, sides, modifier = parse(text)
    rolls = [random.randint(1, sides) for _ in range(count)]
    return rolls, sum(rolls) + modifier

text = input("Roll: ")
try:
    rolls, total = roll(text)
except ValueError:
    print("Invalid roll")
else:
    print("Rolls:", *rolls)
    print("Total:", total)`, R`import re
import random

def parse(text):
    match = re.fullmatch(r"(\d*)d(\d+)([+-]\d+)?", text.strip().lower())
    if not match:
        raise ValueError("bad notation")
    count = int(match.group(1) or 0)
    sides = int(match.group(2))
    modifier = int(match.group(3)) if match.group(3) else 0
    if count < 1 or sides < 1:
        raise ValueError("bad numbers")
    return count, sides, modifier

def roll(text):
    count, sides, modifier = parse(text)
    rolls = [random.randint(1, sides) for _ in range(count)]
    return rolls, sum(rolls) + modifier

text = input("Roll: ")
try:
    rolls, total = roll(text)
except ValueError:
    print("Invalid roll")
else:
    print("Rolls:", *rolls)
    print("Total:", total)`, R`import re
import random

def parse(text):
    match = re.fullmatch(r"(\d*)d(\d+)([+-]\d+)?", text.strip().lower())
    if not match:
        raise ValueError("bad notation")
    count = int(match.group(1)) if match.group(1) else 1
    sides = int(match.group(2))
    modifier = int(match.group(3)) if match.group(3) else 0
    return count, sides, modifier

def roll(text):
    count, sides, modifier = parse(text)
    rolls = [random.randint(1, sides) for _ in range(count)]
    return rolls, sum(rolls) + modifier

text = input("Roll: ")
try:
    rolls, total = roll(text)
except ValueError:
    print("Invalid roll")
else:
    print("Rolls:", *rolls)
    print("Total:", total)`],
    hints:['re.fullmatch(r"(\\d*)d(\\d+)([+-]\\d+)?", text.strip().lower()). If it returns None, raise ValueError.','count = int(group(1)) if group(1) else 1; modifier = int(group(3)) if group(3) else 0. Raise ValueError if count or sides is below 1.','roll: rolls = [random.randint(1, sides) for _ in range(count)] and return rolls, sum(rolls) + modifier.','import re\nimport random\n\ndef parse(text):\n    match = re.fullmatch(r"(\\d*)d(\\d+)([+-]\\d+)?", text.strip().lower())\n    if not match:\n        raise ValueError("bad notation")\n    count = int(match.group(1)) if match.group(1) else 1\n    sides = int(match.group(2))\n    modifier = int(match.group(3)) if match.group(3) else 0\n    if count < 1 or sides < 1:\n        raise ValueError("bad numbers")\n    return count, sides, modifier\n\ndef roll(text):\n    count, sides, modifier = parse(text)\n    rolls = [random.randint(1, sides) for _ in range(count)]\n    return rolls, sum(rolls) + modifier\n\ntext = input("Roll: ")\ntry:\n    rolls, total = roll(text)\nexcept ValueError:\n    print("Invalid roll")\nelse:\n    print("Rolls:", *rolls)\n    print("Total:", total)']},
  power:{can:['Parse a mini-language with a regular expression','Separate parsing from rolling and test random code properly'],
    expand:'Allow spaces like "2d6 + 3" by removing spaces before matching, and add a `keep highest` rule if you dare.',
    where:'Parsers like this are in chat bots, game engines and config readers.',
    next:'Next: logging, the grown-up replacement for print.'},
  codex:{title:'Mission: Dice Roller',body:'Parse with a regex, raise ValueError on bad input, separate parse() from roll(), test randomness with one-sided dice and ranges.',snip:R`re.fullmatch(r"(\d*)d(\d+)([+-]\d+)?", text)`}
}
);
