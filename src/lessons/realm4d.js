// REALM 4 — THE SATCHEL — part D (lessons 34-44)
LESSONS.push(
{
  id:'r4-34', realm:4, n:34, title:'List comprehensions: build a list in one line',
  teaches:['comp-list'], requires:['mission4a'],
  story:`Hopper grins. "You've been building lists the slow way: empty bag, loop, append. There's a one-line spell for that, and every Python pro uses it daily."`,
  concept:{
    html:`A **list comprehension** builds a list in one line:\n\n\`\`\`\nsquares = [n * n for n in range(1, 6)]\n\`\`\`\n\nRead it left to right as English: "**n times n, for each n in 1 to 5**".\n\nIt is the same as:\n\n\`\`\`\nsquares = []\nfor n in range(1, 6):\n    squares.append(n * n)\n\`\`\`\n\nPattern: \`[ expression  for item in iterable ]\`. It works with any list, text or range.`,
    analogy:`A stamping machine: feed it items, it stamps out a new one for each.`,
    example:R`squares = [n * n for n in range(1, 6)]
print(squares)
words = ["fire", "ice"]
print([len(w) for w in words])`},
  predict:{code:R`print([n * 2 for n in range(1, 4)])`, q:'What prints?', opts:['[2, 4, 6]','[1, 2, 3]','[2, 4, 6, 8]'], ans:0,
    why:'For n = 1, 2, 3 the expression n * 2 gives 2, 4, 6.'},
  cast:{code:R`squares = [n * n for n in range(1, 6)]
print(squares)
words = ["fire", "ice"]
print([len(w) for w in words])`, task:'Cast it. Make a list of cubes.'},
  bug:{broken:R`squares = [for n in range(1, 5): n * n]
print(squares)`, task:'The expression goes FIRST, with no colon: [expression for item in iterable]. Fix it.',
    cases:[{inputs:[],tests:[['squares is [1, 4, 9, 16]','g.get("squares")==[1,4,9,16]']]}],
    sol:R`squares = [n * n for n in range(1, 5)]
print(squares)`, wrong:[R`squares = [for n in range(1, 5): n * n]
print(squares)`]},
  write:{prompt:'Using list comprehensions create `doubled` (each price doubled) and `lengths` (the length of each word). Print both lists.',
    starter:R`prices = [4, 9, 3]
words = ["fire", "ice", "wind"]
`,
    cases:[{inputs:[],tests:[['doubled','g.get("doubled")==[8,18,6]'],['lengths','g.get("lengths")==[4,3,4]'],['Prints both','lines==["[8, 18, 6]","[4, 3, 4]"]'],['Uses comprehensions','len(re.findall(r"\\[[^\\]]*\\bfor\\b", src))>=2']]}],
    sol:R`prices = [4, 9, 3]
words = ["fire", "ice", "wind"]
doubled = [p * 2 for p in prices]
lengths = [len(w) for w in words]
print(doubled)
print(lengths)`,
    wrong:[R`prices = [4, 9, 3]
words = ["fire", "ice", "wind"]
doubled = []
for p in prices:
    doubled.append(p * 2)
lengths = []
for w in words:
    lengths.append(len(w))
print(doubled)
print(lengths)`, R`prices = [4, 9, 3]
words = ["fire", "ice", "wind"]
doubled = [8, 18, 6]
lengths = [4, 3, 4]
print(doubled)
print(lengths)`],
    hints:['[expression for item in list]','doubled = [p * 2 for p in prices]','lengths = [len(w) for w in words]','prices = [4, 9, 3]\nwords = ["fire", "ice", "wind"]\ndoubled = [p * 2 for p in prices]\nlengths = [len(w) for w in words]\nprint(doubled)\nprint(lengths)']},
  power:{can:['Transform every item in one line','Read comprehensions in other people\'s code'],
    expand:'Write the squares of 1 to 10, then the first letters of a list of words using w[0].',
    where:'Data cleaning, mapping IDs to names and converting units all use comprehensions.',
    next:'Next: add a condition to keep only some items.'},
  codex:{title:'List comprehension',body:'[expr for x in items]. Same as an append loop, in one line.',snip:R`[n * n for n in range(1, 6)]`}
},
{
  id:'r4-35', realm:4, n:35, title:'Comprehensions with a condition',
  teaches:['comp-if'], requires:['comp-list','filter-list'],
  story:`"Now teach the stamping machine to *skip* things," Hopper says. She adds a small gate at the end of the machine: only items that pass fall through.`,
  concept:{
    html:`Add an \`if\` at the **end** to filter:\n\n\`\`\`\nevens = [n for n in range(1, 11) if n % 2 == 0]\n\`\`\`\n\nPattern: \`[ expression  for item in iterable  if condition ]\`.\n\nTo **change** the value instead of filtering, put the \`if/else\` **before** the \`for\`:\n\n\`\`\`\ncapped = [min(s + 10, 100) for s in scores]\nlabels = ["pass" if s >= 60 else "fail" for s in scores]\n\`\`\`\n\nIf a comprehension gets hard to read, use a normal loop. Readability wins.`,
    analogy:`A stamping machine with a gate that only lets matching items through.`,
    example:R`nums = [3, 8, 12, 5, 20]
big = [n for n in nums if n >= 10]
print(big)
labels = ["big" if n >= 10 else "small" for n in nums]
print(labels)`},
  predict:{code:R`print([n for n in range(10) if n % 3 == 0])`, q:'What prints?', opts:['[0, 3, 6, 9]','[3, 6, 9]','[0, 3, 6]'], ans:0,
    why:'0, 3, 6 and 9 are all multiples of 3 below 10.'},
  cast:{code:R`nums = [3, 8, 12, 5, 20]
big = [n for n in nums if n >= 10]
print(big)
labels = ["big" if n >= 10 else "small" for n in nums]
print(labels)`, task:'Cast it. Change the limit to 5.'},
  bug:{broken:R`nums = [3, 8, 12, 5, 20]
big = [n if n >= 10 for n in nums]
print(big)`, task:'To FILTER, the if goes at the END, after the for part. Fix the order.',
    cases:[{inputs:[],tests:[['big is [12, 20]','g.get("big")==[12,20]']]}],
    sol:R`nums = [3, 8, 12, 5, 20]
big = [n for n in nums if n >= 10]
print(big)`, wrong:[R`nums = [3, 8, 12, 5, 20]
big = [n if n >= 10 for n in nums]
print(big)`]},
  write:{prompt:'Using comprehensions: `passed` is the scores of 60 or more; `labels` is `"pass"` or `"fail"` for every score. Print both.',
    starter:R`scores = [72, 55, 90, 40, 60]
`,
    cases:[{inputs:[],tests:[['passed','g.get("passed")==[72,90,60]'],['labels','g.get("labels")==["pass","fail","pass","fail","pass"]'],['Prints both','lines==["[72, 90, 60]","[\'pass\', \'fail\', \'pass\', \'fail\', \'pass\']"]'],['Uses comprehensions','len(re.findall(r"\\[[^\\]]*\\bfor\\b", src))>=2']]}],
    sol:R`scores = [72, 55, 90, 40, 60]
passed = [s for s in scores if s >= 60]
labels = ["pass" if s >= 60 else "fail" for s in scores]
print(passed)
print(labels)`,
    wrong:[R`scores = [72, 55, 90, 40, 60]
passed = [s for s in scores if s > 60]
labels = ["pass" if s >= 60 else "fail" for s in scores]
print(passed)
print(labels)`, R`scores = [72, 55, 90, 40, 60]
passed = []
for s in scores:
    if s >= 60:
        passed.append(s)
labels = []
for s in scores:
    labels.append("pass" if s >= 60 else "fail")
print(passed)
print(labels)`],
    hints:['Filtering: [s for s in scores if s >= 60]','Changing values: ["pass" if s >= 60 else "fail" for s in scores]','Print both lists.','scores = [72, 55, 90, 40, 60]\npassed = [s for s in scores if s >= 60]\nlabels = ["pass" if s >= 60 else "fail" for s in scores]\nprint(passed)\nprint(labels)']},
  power:{can:['Filter and transform in one line','Know where the if goes in each case'],
    expand:'Build a list of the names longer than 3 letters from a list of names.',
    where:'Quick filters over data show up in nearly every script.',
    next:'Next: the same idea for dictionaries and sets.'},
  codex:{title:'Comprehension filters',body:'[x for x in items if cond] filters. [a if cond else b for x in items] transforms.',snip:R`[n for n in nums if n > 0]`}
},
{
  id:'r4-36', realm:4, n:36, title:'Dict and set comprehensions',
  teaches:['comp-dict'], requires:['comp-if','dict-loop','sets'],
  story:`The stamping machine has two more settings: one stamps out **labelled drawers**, one stamps **guest books**. "Same machine," Hopper says. "Different brackets."`,
  concept:{
    html:`Comprehensions work with curly braces too:\n\n- **Dict**: \`{key: value for item in iterable}\`\n- **Set**: \`{expression for item in iterable}\`\n\n\`\`\`\nwords = ["fire", "ice", "wind"]\nlengths = {w: len(w) for w in words}     # {'fire': 4, 'ice': 3, 'wind': 4}\nunique_lengths = {len(w) for w in words} # {3, 4}\n\`\`\`\n\nYou can add an \`if\` at the end for both. Handy for turning a list into a lookup table.`,
    analogy:`Same stamping machine; the output tray changes shape.`,
    example:R`words = ["fire", "ice", "wind"]
lengths = {w: len(w) for w in words}
print(lengths)
print(sorted({len(w) for w in words}))`},
  predict:{code:R`print({n: n * n for n in range(1, 4)})`, q:'What prints?', opts:['{1: 1, 2: 4, 3: 9}','[1, 4, 9]','{1, 4, 9}'], ans:0,
    why:'A dict comprehension: key n, value n * n.'},
  cast:{code:R`words = ["fire", "ice", "wind"]
lengths = {w: len(w) for w in words}
print(lengths)
print(sorted({len(w) for w in words}))`, task:'Cast it. Add an if to keep only words longer than 3.'},
  bug:{broken:R`words = ["fire", "ice"]
lengths = [w: len(w) for w in words]
print(lengths)`, task:'key: value pairs need curly braces. Fix the brackets.',
    cases:[{inputs:[],tests:[['lengths is a dict','g.get("lengths")=={"fire":4,"ice":3}']]}],
    sol:R`words = ["fire", "ice"]
lengths = {w: len(w) for w in words}
print(lengths)`, wrong:[R`words = ["fire", "ice"]
lengths = [w: len(w) for w in words]
print(lengths)`]},
  write:{prompt:'Build `lengths` (a dict of word to length) and `distinct` (a set of the different lengths) using comprehensions. Print `lengths`, then `sorted(distinct)`.',
    starter:R`words = ["fire", "ice", "wind", "snow"]
`,
    cases:[{inputs:[],tests:[['lengths','g.get("lengths")=={"fire":4,"ice":3,"wind":4,"snow":4}'],['distinct','g.get("distinct")=={3,4}'],['Prints both','lines==["{\'fire\': 4, \'ice\': 3, \'wind\': 4, \'snow\': 4}","[3, 4]"]'],['Uses brace comprehensions','len(re.findall(r"\\{[^}]*\\bfor\\b", src))>=2']]}],
    sol:R`words = ["fire", "ice", "wind", "snow"]
lengths = {w: len(w) for w in words}
distinct = {len(w) for w in words}
print(lengths)
print(sorted(distinct))`,
    wrong:[R`words = ["fire", "ice", "wind", "snow"]
lengths = {}
for w in words:
    lengths[w] = len(w)
distinct = set(lengths.values())
print(lengths)
print(sorted(distinct))`, R`words = ["fire", "ice", "wind", "snow"]
lengths = {w: len(w) for w in words}
distinct = [len(w) for w in words]
print(lengths)
print(sorted(distinct))`],
    hints:['{w: len(w) for w in words} makes the dict.','{len(w) for w in words} makes the set.','Print lengths and sorted(distinct).','words = ["fire", "ice", "wind", "snow"]\nlengths = {w: len(w) for w in words}\ndistinct = {len(w) for w in words}\nprint(lengths)\nprint(sorted(distinct))']},
  power:{can:['Turn a list into a lookup table in one line','Build a set of distinct values'],
    expand:'Invert a dict: build {value: key} from {key: value}.',
    where:'Index tables, ID lookups and cleaning data often use dict comprehensions.',
    next:'Next: which structure should you actually pick?'},
  codex:{title:'Dict / set comprehensions',body:'{k: v for ...} makes a dict. {x for ...} makes a set.',snip:R`{w: len(w) for w in words}`}
},
{
  id:'r4-37', realm:4, n:37, title:'Choosing the right structure',
  teaches:['choose-struct'], requires:['comp-dict'],
  story:`"List, tuple, dict, set," Hopper recites, tapping four containers. "Four bags. The skill isn't knowing how each works. It's knowing **which to reach for**."`,
  concept:{
    html:`A quick decision guide:\n\n| You need... | Use |\n|---|---|\n| An ordered collection you will change | **list** |\n| A fixed bundle that should not change | **tuple** |\n| Lookup by a name or ID | **dict** |\n| Unique items, or "is it in there?" fast | **set** |\n| Counting things | **dict** (tally) |\n| A table of records | **list of dicts** |\n\nAsk: *Does order matter? Will it change? Do I look up by position or by name? Do duplicates matter?*`,
    analogy:`Choosing between a shelf, a sealed box, a labelled drawer wall and a guest book.`,
    example:R`visits = ["ada", "bo", "ada", "cy"]
unique = sorted(set(visits))
counts = {}
for v in visits:
    counts[v] = counts.get(v, 0) + 1
print(unique)
print(counts)`},
  predict:{code:R`visits = ["ada", "bo", "ada"]
print(len(set(visits)), len(visits))`, q:'What prints?', opts:['2 3','3 3','2 2'], ans:0,
    why:'Two distinct names, three visits in total.'},
  cast:{code:R`visits = ["ada", "bo", "ada", "cy"]
unique = sorted(set(visits))
counts = {}
for v in visits:
    counts[v] = counts.get(v, 0) + 1
print(unique)
print(counts)`, task:'Cast it. Notice each structure answers a different question.'},
  bug:{broken:R`visits = ["ada", "bo", "ada", "cy", "bo", "ada"]
unique = visits
print(len(unique))`, task:'We want how many DIFFERENT visitors. A list keeps duplicates. Pick the structure that does not.',
    cases:[{inputs:[],tests:[['Prints 3','out.strip()=="3"'],['Uses set','"set(" in src']]}],
    sol:R`visits = ["ada", "bo", "ada", "cy", "bo", "ada"]
unique = set(visits)
print(len(unique))`, wrong:[R`visits = ["ada", "bo", "ada", "cy", "bo", "ada"]
unique = visits
print(len(unique))`]},
  write:{prompt:'From `visits` create `unique` (a sorted list of different visitors), `counts` (a dict of visits per visitor) and `top` (the visitor with the most visits; the first one wins a tie). Print all three.',
    starter:R`visits = ["ada", "bo", "ada", "cy", "bo", "ada"]
`,
    cases:[{inputs:[],tests:[['unique','g.get("unique")==["ada","bo","cy"]'],['counts','g.get("counts")=={"ada":3,"bo":2,"cy":1}'],['top','g.get("top")=="ada"'],['Prints all three','lines==["[\'ada\', \'bo\', \'cy\']","{\'ada\': 3, \'bo\': 2, \'cy\': 1}","ada"]']]}],
    sol:R`visits = ["ada", "bo", "ada", "cy", "bo", "ada"]
unique = sorted(set(visits))
counts = {}
for v in visits:
    counts[v] = counts.get(v, 0) + 1
top = None
for name, n in counts.items():
    if top is None or n > counts[top]:
        top = name
print(unique)
print(counts)
print(top)`,
    wrong:[R`visits = ["ada", "bo", "ada", "cy", "bo", "ada"]
unique = sorted(visits)
counts = {}
for v in visits:
    counts[v] = counts.get(v, 0) + 1
top = None
for name, n in counts.items():
    if top is None or n > counts[top]:
        top = name
print(unique)
print(counts)
print(top)`, R`visits = ["ada", "bo", "ada", "cy", "bo", "ada"]
unique = sorted(set(visits))
counts = {}
for v in visits:
    counts[v] = counts.get(v, 0) + 1
top = "cy"
print(unique)
print(counts)
print(top)`],
    hints:['unique = sorted(set(visits)) for the distinct names.','counts is the tally pattern: counts[v] = counts.get(v, 0) + 1.','For top, loop over counts.items() tracking the biggest n; only replace when n is strictly greater.','visits = ["ada", "bo", "ada", "cy", "bo", "ada"]\nunique = sorted(set(visits))\ncounts = {}\nfor v in visits:\n    counts[v] = counts.get(v, 0) + 1\ntop = None\nfor name, n in counts.items():\n    if top is None or n > counts[top]:\n        top = name\nprint(unique)\nprint(counts)\nprint(top)']},
  power:{can:['Pick the right collection for the job','Combine set, dict and loops to answer data questions'],
    expand:'Take a list of orders (dicts) and answer: who ordered most, and how many different products?',
    where:'Choosing the right structure is half of designing any program.',
    next:'Next: sorting records by a field.'},
  codex:{title:'Choosing structures',body:'list = ordered and changeable. tuple = fixed. dict = lookup by key. set = unique.',snip:R`# list / tuple / dict / set`}
},
{
  id:'r4-38', realm:4, n:38, title:'Sorting records with key=',
  teaches:['sort-key'], requires:['choose-struct','sorting'],
  story:`"Rank them by score," Hopper says, handing over the ledger. But each row is a dict. How do you tell Python *which field* to sort by?`,
  concept:{
    html:`\`sorted(items, key=...)\` sorts by whatever the **key function** returns for each item.\n\n- Sort words by length: \`sorted(words, key=len)\`\n- Sort records by a field:\n\n\`\`\`\nranked = sorted(students, key=lambda s: s["score"], reverse=True)\n\`\`\`\n\n\`lambda s: s["score"]\` is a **tiny unnamed function**: "given s, give back s['score']". You will learn real functions in Realm 6; for now treat \`key=lambda s: s["field"]\` as a **recipe**.\n\nSorting is **stable**: equal items keep their original order.`,
    analogy:`Telling the librarian *"sort these cards by the number in the top-right corner."*`,
    example:R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}]
ranked = sorted(students, key=lambda s: s["score"], reverse=True)
for s in ranked:
    print(s["name"], s["score"])`},
  predict:{code:R`words = ["pear", "fig", "apple"]
print(sorted(words, key=len))`, q:'What prints?', opts:["['fig', 'pear', 'apple']","['apple', 'fig', 'pear']","['apple', 'pear', 'fig']"], ans:0,
    why:'Sorted by length: fig (3), pear (4), apple (5).'},
  cast:{code:R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}]
ranked = sorted(students, key=lambda s: s["score"], reverse=True)
for s in ranked:
    print(s["name"], s["score"])`, task:'Cast it. Remove reverse=True and see the order flip.'},
  bug:{broken:R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}]
ranked = sorted(students, key=s["score"])
print(ranked[0]["name"])`, task:'NameError: key needs a small function (lambda), not a bare lookup. Sort highest first so Ada comes first.',
    cases:[{inputs:[],tests:[['Prints Ada','out.strip()=="Ada"']]}],
    sol:R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}]
ranked = sorted(students, key=lambda s: s["score"], reverse=True)
print(ranked[0]["name"])`, wrong:[R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}]
ranked = sorted(students, key=s["score"])
print(ranked[0]["name"])`, R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}]
ranked = sorted(students, key=lambda s: s["score"])
print(ranked[0]["name"])`]},
  write:{prompt:'Create `ranked` (students sorted by score, highest first, without changing `students`) and print `1. Ada: 95` style lines using `enumerate` from 1.',
    starter:R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}, {"name": "Cy", "score": 78}]
`,
    cases:[{inputs:[],tests:[['Ranked lines','lines==["1. Ada: 95","2. Cy: 78","3. Bo: 60"]'],['students order unchanged','[s["name"] for s in g.get("students")]==["Bo","Ada","Cy"]'],['Uses key=','"key=" in src']]}],
    sol:R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}, {"name": "Cy", "score": 78}]
ranked = sorted(students, key=lambda s: s["score"], reverse=True)
for i, s in enumerate(ranked, 1):
    print(f"{i}. {s['name']}: {s['score']}")`,
    wrong:[R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}, {"name": "Cy", "score": 78}]
students.sort(key=lambda s: s["score"], reverse=True)
for i, s in enumerate(students, 1):
    print(f"{i}. {s['name']}: {s['score']}")`, R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}, {"name": "Cy", "score": 78}]
ranked = sorted(students, key=lambda s: s["score"])
for i, s in enumerate(ranked, 1):
    print(f"{i}. {s['name']}: {s['score']}")`],
    hints:['sorted(students, key=lambda s: s["score"], reverse=True)','Loop with enumerate(ranked, 1).','Print f"{i}. {s[\'name\']}: {s[\'score\']}".','students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}, {"name": "Cy", "score": 78}]\nranked = sorted(students, key=lambda s: s["score"], reverse=True)\nfor i, s in enumerate(ranked, 1):\n    print(f"{i}. {s[\'name\']}: {s[\'score\']}")']},
  power:{can:['Sort records by any field','Build a leaderboard'],
    expand:'Sort by score descending, then by name for ties (key=lambda s: (-s["score"], s["name"])).',
    where:'Leaderboards, product listings by price and reports sorted by date all use key=.',
    next:'Next: the best, the worst and the top few.'},
  codex:{title:'sorted with key',body:'sorted(items, key=lambda x: x["field"], reverse=True) sorts records by a field.',snip:R`sorted(rows, key=lambda r: r["score"])`}
},
{
  id:'r4-39', realm:4, n:39, title:'min and max with key=, and top-N',
  teaches:['key-minmax'], requires:['sort-key'],
  story:`"Who's best? Who's worst? Who are the top two?" Three questions, and Hopper wants answers in three lines, not thirty.`,
  concept:{
    html:`\`max\` and \`min\` take the same \`key=\`:\n\n\`\`\`\nbest = max(students, key=lambda s: s["score"])\nworst = min(students, key=lambda s: s["score"])\nprint(best["name"])\n\`\`\`\n\nFor the **top N**, sort descending and slice:\n\n\`\`\`\ntop2 = sorted(students, key=lambda s: s["score"], reverse=True)[:2]\n\`\`\`\n\n\`max\`/\`min\` return the **whole record**, not just the number. If two tie, the first one wins.`,
    analogy:`Asking "who tops the leaderboard?" without reading every line.`,
    example:R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}]
best = max(students, key=lambda s: s["score"])
print(best["name"])`},
  predict:{code:R`words = ["pear", "fig", "apple"]
print(max(words, key=len))`, q:'What prints?', opts:['apple','pear','fig'], ans:0,
    why:'The longest word, apple, wins.'},
  cast:{code:R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}]
best = max(students, key=lambda s: s["score"])
print(best["name"])`, task:'Cast it. Change max to min.'},
  bug:{broken:R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}]
best = max(students)
print(best["name"])`, task:'TypeError: Python cannot compare two dicts. Tell max which field to compare.',
    cases:[{inputs:[],tests:[['Prints Ada','out.strip()=="Ada"']]}],
    sol:R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}]
best = max(students, key=lambda s: s["score"])
print(best["name"])`, wrong:[R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}]
best = max(students)
print(best["name"])`]},
  write:{prompt:'Print `Best: <name>`, `Worst: <name>`, then `Top 2:` followed by the names of the two highest scorers on separate lines (`1. Ada` and `2. Cy`).',
    starter:R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}, {"name": "Cy", "score": 78}]
`,
    cases:[{inputs:[],tests:[['Report','lines==["Best: Ada","Worst: Bo","Top 2:","1. Ada","2. Cy"]'],['Uses max and min with key','"max(" in src and "min(" in src and "key=" in src']]}],
    sol:R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}, {"name": "Cy", "score": 78}]
best = max(students, key=lambda s: s["score"])
worst = min(students, key=lambda s: s["score"])
print("Best:", best["name"])
print("Worst:", worst["name"])
print("Top 2:")
top2 = sorted(students, key=lambda s: s["score"], reverse=True)[:2]
for i, s in enumerate(top2, 1):
    print(f"{i}. {s['name']}")`,
    wrong:[R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}, {"name": "Cy", "score": 78}]
print("Best: Ada")
print("Worst: Bo")
print("Top 2:")
print("1. Ada")
print("2. Cy")`, R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}, {"name": "Cy", "score": 78}]
best = min(students, key=lambda s: s["score"])
worst = max(students, key=lambda s: s["score"])
print("Best:", best["name"])
print("Worst:", worst["name"])
print("Top 2:")
top2 = sorted(students, key=lambda s: s["score"], reverse=True)[:2]
for i, s in enumerate(top2, 1):
    print(f"{i}. {s['name']}")`],
    hints:['max(students, key=lambda s: s["score"]) gives the best record.','min(...) for the worst. Top 2 = sorted(..., reverse=True)[:2].','Loop the top 2 with enumerate from 1.','students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}, {"name": "Cy", "score": 78}]\nbest = max(students, key=lambda s: s["score"])\nworst = min(students, key=lambda s: s["score"])\nprint("Best:", best["name"])\nprint("Worst:", worst["name"])\nprint("Top 2:")\ntop2 = sorted(students, key=lambda s: s["score"], reverse=True)[:2]\nfor i, s in enumerate(top2, 1):\n    print(f"{i}. {s[\'name\']}")']},
  power:{can:['Find the best or worst record','Take the top N from a ranking'],
    expand:'Print the 3 most expensive products from a list of product dicts.',
    where:'"Top 10 customers", "cheapest option" and "most recent order" are everyday data questions.',
    next:'Mission: a gradebook that does all of this for real.'},
  codex:{title:'min / max with key',body:'max(rows, key=lambda r: r["f"]) returns the whole best record. Top N = sorted(...)[:N].',snip:R`best = max(rows, key=lambda r: r["score"])`}
},
{
  id:'r4-40', realm:4, n:40, title:'Real-World Mission: Gradebook',
  teaches:['mission4b'], requires:['key-minmax','ask-until-valid'],
  story:`Back at the Bazaar gates a teacher waits, a stack of marked papers under her arm. "I keep my grades in my head and it is going badly," she says. Ada's eyes glint. "This one **is** a job. Build her a gradebook."`,
  concept:{
    html:`**Mission brief:** a gradebook.\n\n**Part 1: collect.** Loop: ask \`Name (or done): \`. If \`done\`, stop. Otherwise ask \`Score: \` **until it is whole digits from 0 to 100** (print \`Score must be 0-100\` after each bad try). Store each student as a dict \`{"name": ..., "score": ...}\` in a list.\n\n**Part 2: report.** If nobody was entered print \`No students\`. Otherwise print \`Report\` then:\n- the ranking, best first: \`1. Ada: 95\`\n- \`Average: 77.67\` (2 decimals)\n- \`Top: Ada\`\n- \`Passed: 2/3\` (a pass is **70 or more**)\n\nYou have it all: dicts, a list of records, validation loops, sorting with key=.`,
    analogy:`A teacher's mark book as a small program.`,
    example:R`students = []
students.append({"name": "Ada", "score": 95})
ranked = sorted(students, key=lambda s: s["score"], reverse=True)
print(ranked[0]["name"])`},
  predict:{code:R`students = [{"name": "Ada", "score": 95}, {"name": "Bo", "score": 60}]
passed = [s for s in students if s["score"] >= 70]
print(len(passed), "/", len(students))`, q:'What prints?', opts:['1 / 2','2 / 2','0 / 2'], ans:0,
    why:'Only Ada reaches 70.'},
  cast:{code:R`students = []
while True:
    name = input("Name (or done): ")
    if name == "done":
        break
    score = int(input("Score: "))
    students.append({"name": name, "score": score})
print(len(students), "students")`, task:'Cast it with: Ada, 95, Bo, 60, done in the Inputs box.', inputs:['Ada','95','Bo','60','done']},
  bug:{broken:R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}]
ranked = sorted(students, key=lambda s: s["score"])
for i, s in enumerate(ranked, 1):
    print(f"{i}. {s['name']}: {s['score']}")`, task:'The ranking lists the LOWEST score first. Best first, please.',
    cases:[{inputs:[],tests:[['Best first','lines==["1. Ada: 95","2. Bo: 60"]']]}],
    sol:R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}]
ranked = sorted(students, key=lambda s: s["score"], reverse=True)
for i, s in enumerate(ranked, 1):
    print(f"{i}. {s['name']}: {s['score']}")`, wrong:[R`students = [{"name": "Bo", "score": 60}, {"name": "Ada", "score": 95}]
ranked = sorted(students, key=lambda s: s["score"])
for i, s in enumerate(ranked, 1):
    print(f"{i}. {s['name']}: {s['score']}")`]},
  write:{prompt:'Build the gradebook from the brief. Use the exact prompts and messages.',
    starter:R`students = []
`,
    inputs:['Bo','60','Ada','95','Cy','78','done'],
    cases:[{inputs:['Bo','60','Ada','95','Cy','78','done'],tests:[['Full report','lines[lines.index("Report")+1:]==["1. Ada: 95","2. Cy: 78","3. Bo: 60","Average: 77.67","Top: Ada","Passed: 2/3"]']]},{inputs:['Ada','abc','150','95','done'],tests:[['Validation retries then report','lines.count("Score must be 0-100")==2 and lines[lines.index("Report")+1:]==["1. Ada: 95","Average: 95.00","Top: Ada","Passed: 1/1"]']]},{inputs:['done'],tests:[['Empty gradebook','lines[-1]=="No students"']]},{inputs:['Ann','70','Ben','70','done'],tests:[['Ties keep entry order and 70 passes','lines[lines.index("Report")+1:]==["1. Ann: 70","2. Ben: 70","Average: 70.00","Top: Ann","Passed: 2/2"]']]}],
    sol:R`students = []
while True:
    name = input("Name (or done): ")
    if name == "done":
        break
    while True:
        text = input("Score: ")
        if text.isdigit() and 0 <= int(text) <= 100:
            break
        print("Score must be 0-100")
    students.append({"name": name, "score": int(text)})
if not students:
    print("No students")
else:
    ranked = sorted(students, key=lambda s: s["score"], reverse=True)
    total = sum(s["score"] for s in students)
    passed = [s for s in students if s["score"] >= 70]
    print("Report")
    for i, s in enumerate(ranked, 1):
        print(f"{i}. {s['name']}: {s['score']}")
    print(f"Average: {total / len(students):.2f}")
    print("Top:", ranked[0]["name"])
    print(f"Passed: {len(passed)}/{len(students)}")`,
    wrong:[R`students = []
while True:
    name = input("Name (or done): ")
    if name == "done":
        break
    text = input("Score: ")
    students.append({"name": name, "score": int(text)})
if not students:
    print("No students")
else:
    ranked = sorted(students, key=lambda s: s["score"], reverse=True)
    total = sum(s["score"] for s in students)
    passed = [s for s in students if s["score"] >= 70]
    print("Report")
    for i, s in enumerate(ranked, 1):
        print(f"{i}. {s['name']}: {s['score']}")
    print(f"Average: {total / len(students):.2f}")
    print("Top:", ranked[0]["name"])
    print(f"Passed: {len(passed)}/{len(students)}")`, R`students = []
while True:
    name = input("Name (or done): ")
    if name == "done":
        break
    while True:
        text = input("Score: ")
        if text.isdigit() and 0 <= int(text) <= 100:
            break
        print("Score must be 0-100")
    students.append({"name": name, "score": int(text)})
if not students:
    print("No students")
else:
    ranked = sorted(students, key=lambda s: s["score"], reverse=True)
    total = sum(s["score"] for s in students)
    passed = [s for s in students if s["score"] > 70]
    print("Report")
    for i, s in enumerate(ranked, 1):
        print(f"{i}. {s['name']}: {s['score']}")
    print(f"Average: {total / len(students):.2f}")
    print("Top:", ranked[0]["name"])
    print(f"Passed: {len(passed)}/{len(students)}")`],
    hints:['Outer loop for names; an inner loop asks Score until it is valid (isdigit and 0 to 100).','Store each student as a dict in the list; if the list is empty print No students.','Otherwise sort best-first, then print Report, the ranking, Average, Top and Passed.','students = []\nwhile True:\n    name = input("Name (or done): ")\n    if name == "done":\n        break\n    while True:\n        text = input("Score: ")\n        if text.isdigit() and 0 <= int(text) <= 100:\n            break\n        print("Score must be 0-100")\n    students.append({"name": name, "score": int(text)})\nif not students:\n    print("No students")\nelse:\n    ranked = sorted(students, key=lambda s: s["score"], reverse=True)\n    total = sum(s["score"] for s in students)\n    passed = [s for s in students if s["score"] >= 70]\n    print("Report")\n    for i, s in enumerate(ranked, 1):\n        print(f"{i}. {s[\'name\']}: {s[\'score\']}")\n    print(f"Average: {total / len(students):.2f}")\n    print("Top:", ranked[0]["name"])\n    print(f"Passed: {len(passed)}/{len(students)}")']},
  power:{can:['Build a complete data app with input, validation, records and a report','Combine nearly everything from Realms 1 to 4'],
    expand:'Add letter grades (A 90+, B 80+, C 70+, otherwise F) and a grade count tally.',
    where:'This is the skeleton of every small school, club and business record-keeper.',
    next:'Next: the mutability traps that bite everyone once.'},
  codex:{title:'Mission: gradebook',body:'Collect records in a list of dicts, validate input, sort with key=, report with f-strings.',snip:R`ranked = sorted(students, key=lambda s: s["score"], reverse=True)`}
},
{
  id:'r4-41', realm:4, n:41, title:'Mutability: what can change, and what must not',
  teaches:['mutability'], requires:['mission4b','copy-list'],
  story:`Hopper holds up a glass jar, a metal tin and a brass tube. "Some containers can be refilled. Some are sealed. And some things *look* fine while you're emptying them." She slides a warning across the counter.`,
  concept:{
    html:`**Mutable** (can change in place): list, dict, set.\n**Immutable** (cannot): text, numbers, tuples.\n\nThree consequences to remember:\n\n1. **Never change a list while looping over it.** Removing items shifts positions and the loop **skips** items. Build a **new** list instead.\n2. **Dict keys must be immutable.** \`{[1, 2]: "x"}\` raises \`TypeError: unhashable type: 'list'\`. Use a tuple \`(1, 2)\`.\n3. **Assigning does not copy** (last-but-one lesson): \`b = a\` shares the same list.\n\n\`\`\`\nnums = [n for n in nums if n % 2 != 0]   # safe way to remove\n\`\`\``,
    analogy:`Do not rearrange the shelf while someone is walking along it counting.`,
    example:R`temps = [-3, 5, -1, 8]
temps = [t for t in temps if t >= 0]
print(temps)`},
  predict:{code:R`nums = [2, 4, 6]
for n in nums:
    nums.remove(n)
print(nums)`, q:'What prints?', opts:['[]','[4]','[2, 4, 6]'], ans:1,
    why:'Removing while looping shifts everything left, so the loop skips items. Only 2 and 6 are removed, leaving [4].'},
  cast:{code:R`temps = [-3, 5, -1, 8]
temps = [t for t in temps if t >= 0]
print(temps)`, task:'Cast it. This is the safe way to remove items.'},
  bug:{broken:R`temps = [-3, 5, -1, -2, 8]
for t in temps:
    if t < 0:
        temps.remove(t)
print(temps)`, task:'A negative survives (-2)! Removing inside the loop skips items. Build a new list instead.',
    cases:[{inputs:[],tests:[['temps is [5, 8]','g.get("temps")==[5,8]']]}],
    sol:R`temps = [-3, 5, -1, -2, 8]
temps = [t for t in temps if t >= 0]
print(temps)`, wrong:[R`temps = [-3, 5, -1, -2, 8]
for t in temps:
    if t < 0:
        temps.remove(t)
print(temps)`]},
  write:{prompt:'Remove every negative number from `temps` WITHOUT removing inside a loop over `temps`. Make `temps` the cleaned list and print it.',
    starter:R`temps = [-3, 5, -1, -2, 8, -7]
`,
    cases:[{inputs:[],tests:[['temps is [5, 8]','g.get("temps")==[5,8]'],['Prints [5, 8]','lines==["[5, 8]"]'],['No remove inside loop','".remove(" not in src'],['Filters with a loop or comprehension','" for " in src']]}],
    sol:R`temps = [-3, 5, -1, -2, 8, -7]
temps = [t for t in temps if t >= 0]
print(temps)`,
    wrong:[R`temps = [-3, 5, -1, -2, 8, -7]
for t in temps:
    if t < 0:
        temps.remove(t)
print(temps)`, R`temps = [5, 8]
print(temps)`],
    hints:['Build a NEW list of the ones to keep.','[t for t in temps if t >= 0]','Assign it back to temps and print.','temps = [-3, 5, -1, -2, 8, -7]\ntemps = [t for t in temps if t >= 0]\nprint(temps)']},
  power:{can:['Avoid the shifting-list bug','Know which types can change in place','Use tuples as dict keys'],
    expand:'Store a grid position as a tuple key: visited = {(0, 0): True}.',
    where:'Iteration-modification bugs and unhashable-key errors are classic interview and production problems.',
    next:'Next: decode the error messages collections throw at you.'},
  codex:{title:'Mutability',body:'List, dict, set change in place; text, numbers, tuples do not. Never modify a list while looping it. Dict keys must be immutable.',snip:R`nums = [n for n in nums if keep(n)]`}
},
{
  id:'r4-42', realm:4, n:42, title:'Debugging collections: reading the errors',
  teaches:['debug-collections'], requires:['mutability'],
  story:`The Bazaar closes in on you: a chorus of hissing drawers, snapping keys, spider-legged indexes. Sudo pops out of your hat. "Every beast has a *name* in the last line of the error. Learn to read it and you can tame any of them."`,
  concept:{
    html:`Errors you will meet with collections, and what they mean:\n\n| Error | Usually means |\n|---|---|\n| \`IndexError: list index out of range\` | asked for a position that doesn't exist |\n| \`KeyError: 'x'\` | asked a dict for a key that isn't there |\n| \`TypeError: 'int' object is not subscriptable\` | used \`[ ]\` on something that isn't a list/dict/text |\n| \`TypeError: unhashable type: 'list'\` | used a list as a dict key or set item |\n| \`ValueError: x not in list\` | \`remove\`/\`index\` of a missing item |\n| \`AttributeError: 'dict' object has no attribute 'append'\` | called a method that type doesn't have |\n\nRead the **last line first**, then find the line number. Then ask: *what type is this really?* (\`print(type(x))\` is a great debugger.)`,
    analogy:`A doctor reading symptoms: the error name is the diagnosis.`,
    example:R`data = {"hp": 30, "items": ["rope", "map"]}
print(type(data["hp"]))
print(data.get("gold", 0))`},
  predict:{code:R`data = {"hp": 30}
print(data["hp"][0])`, q:'Which error does this raise?', opts:['IndexError','KeyError','TypeError'], ans:2,
    why:'data["hp"] is the number 30, and you cannot index a number: "int object is not subscriptable".'},
  cast:{code:R`data = {"hp": 30}
print(data["hp"][0])`, task:'Cast it and read the error. What type was hp really?', expectError:true},
  bug:{broken:R`data = {"hp": 30, "items": ["rope"]}
print(data["items"][3])`, task:'IndexError. We want the LAST item in the list. Use an index that always works.',
    cases:[{inputs:[],tests:[['Prints rope','out.strip()=="rope"'],['Uses a negative index','"[-1]" in src']]}],
    sol:R`data = {"hp": 30, "items": ["rope"]}
print(data["items"][-1])`, wrong:[R`data = {"hp": 30, "items": ["rope"]}
print(data["items"][3])`]},
  write:{prompt:'Ask `Key: ` and `Index: `. Using `data`, print the item at that index of the list stored under the key. If the key does not exist print `No such key`. If its value is not a list print `Not a list`. If the index is out of range print `No such index`.',
    starter:R`data = {"hp": 30, "items": ["rope", "map"]}
key = input("Key: ")
idx = int(input("Index: "))
`,
    inputs:['items','1'],
    cases:[{inputs:['items','1'],tests:[['items[1] is map','lines[-1]=="map"']]},{inputs:['items','5'],tests:[['Index 5 is out of range','lines[-1]=="No such index"']]},{inputs:['gold','0'],tests:[['gold is missing','lines[-1]=="No such key"']]},{inputs:['hp','0'],tests:[['hp is not a list','lines[-1]=="Not a list"']]},{inputs:['items','0'],tests:[['items[0] is rope','lines[-1]=="rope"']]}],
    sol:R`data = {"hp": 30, "items": ["rope", "map"]}
key = input("Key: ")
idx = int(input("Index: "))
value = data.get(key)
if value is None:
    print("No such key")
elif type(value) != list:
    print("Not a list")
elif not 0 <= idx < len(value):
    print("No such index")
else:
    print(value[idx])`,
    wrong:[R`data = {"hp": 30, "items": ["rope", "map"]}
key = input("Key: ")
idx = int(input("Index: "))
print(data[key][idx])`, R`data = {"hp": 30, "items": ["rope", "map"]}
key = input("Key: ")
idx = int(input("Index: "))
value = data.get(key)
if value is None:
    print("No such key")
elif not 0 <= idx < len(value):
    print("No such index")
else:
    print(value[idx])`],
    hints:['value = data.get(key) avoids the KeyError.','Check in order: missing key, wrong type (type(value) != list), bad index, then the happy path.','Use a guard clause chain: if / elif / elif / else.','data = {"hp": 30, "items": ["rope", "map"]}\nkey = input("Key: ")\nidx = int(input("Index: "))\nvalue = data.get(key)\nif value is None:\n    print("No such key")\nelif type(value) != list:\n    print("Not a list")\nelif not 0 <= idx < len(value):\n    print("No such index")\nelse:\n    print(value[idx])']},
  power:{can:['Name the error from its message','Guard each way a lookup can fail'],
    expand:'Add `print(type(value))` while debugging and make the program print the actual type in "Not a list".',
    where:'Reading error messages fast is the difference between a 2-minute fix and a 2-hour one.',
    next:'Boss time: The Hoarder of Pockets.'},
  codex:{title:'Collection errors',body:'IndexError = bad position. KeyError = bad key. TypeError = wrong type for the operation. Read the last line first.',snip:R`print(type(x))`}
},
{
  id:'r4-43', realm:4, n:43, title:'Boss: The Hoarder of Pockets', kind:'boss',
  teaches:['realm4-boss'], requires:['debug-collections','mission4b','comp-if'],
  story:`The Bazaar lights die. In the dark a mound of satchels shifts, then rises: the **Hoarder of Pockets**, a giant of straps and buckles that swallows anything it touches. "MINE," it rumbles. "ALL MINE." Hopper tosses you the satchel. "Show it what organised looks like."`,
  boss:{name:'The Hoarder of Pockets', hp:5},
  phases:[
    {type:'mcq', code:R`a = [1, 2, 3]
b = a
b.append(4)
print(len(a))`, q:'Strike 1: What prints?', opts:['3','4','7'], ans:1,
     why:'a and b are the same list, so the append is visible through both names.', tags:['r4-18']},
    {type:'write', prompt:'Strike 2: Ask `How many words? ` then read that many words (`Word: `). Print `Top: <word> (<count>)` for the word that appeared most. If two tie, the one seen first wins.',
     starter:R`n = int(input("How many words? "))
`,
     inputs:['3','a','b','a'],
     cases:[{inputs:['3','a','b','a'],tests:[['a wins','lines[-1]=="Top: a (2)"']]},{inputs:['4','x','y','y','x'],tests:[['tie goes to first seen','lines[-1]=="Top: x (2)"']]},{inputs:['1','solo'],tests:[['single word','lines[-1]=="Top: solo (1)"']]},{inputs:['5','b','c','c','b','c'],tests:[['c has 3','lines[-1]=="Top: c (3)"']]}],
     sol:R`n = int(input("How many words? "))
counts = {}
for i in range(n):
    w = input("Word: ")
    counts[w] = counts.get(w, 0) + 1
top = None
for word, c in counts.items():
    if top is None or c > counts[top]:
        top = word
print(f"Top: {top} ({counts[top]})")`,
     wrong:[R`n = int(input("How many words? "))
counts = {}
for i in range(n):
    w = input("Word: ")
    counts[w] = counts.get(w, 0) + 1
top = None
for word, c in counts.items():
    if top is None or c >= counts[top]:
        top = word
print(f"Top: {top} ({counts[top]})")`, R`n = int(input("How many words? "))
words = []
for i in range(n):
    words.append(input("Word: "))
print(f"Top: {words[0]} (1)")`],
     hints:['Count each word with the tally pattern.','Then loop over counts.items() tracking the biggest; replace only when strictly greater.','Print f"Top: {top} ({counts[top]})".','n = int(input("How many words? "))\ncounts = {}\nfor i in range(n):\n    w = input("Word: ")\n    counts[w] = counts.get(w, 0) + 1\ntop = None\nfor word, c in counts.items():\n    if top is None or c > counts[top]:\n        top = word\nprint(f"Top: {top} ({counts[top]})")'], tags:['r4-28','r4-37']},
    {type:'mcq', code:R`d = {"a": 1}
print(d.get("b"))`, q:'Strike 3: What prints?', opts:['KeyError','None','0'], ans:1,
     why:'.get returns None when the key is missing and no default is given.', tags:['r4-25']},
    {type:'write', prompt:'Strike 4: Ask `How many? ` and read that many whole numbers. Print the list of the **distinct numbers in the order first seen**, e.g. `[3, 1, 2]`. Use a `seen` set to remember.',
     starter:R`n = int(input("How many? "))
`,
     inputs:['5','3','1','3','2','1'],
     cases:[{inputs:['5','3','1','3','2','1'],tests:[['Distinct in order','lines[-1]=="[3, 1, 2]"']]},{inputs:['2','7','7'],tests:[['Duplicates collapse','lines[-1]=="[7]"']]},{inputs:['3','5','4','5'],tests:[['5 then 4','lines[-1]=="[5, 4]"']]},{inputs:['0'],tests:[['No numbers','lines[-1]=="[]"']]},{inputs:['4','1','2','3','4'],tests:[['All distinct','lines[-1]=="[1, 2, 3, 4]"'],['Uses a set','"set()" in src or "set(" in src or "{" in src']]}],
     sol:R`n = int(input("How many? "))
seen = set()
result = []
for i in range(n):
    x = int(input("Number: "))
    if x not in seen:
        seen.add(x)
        result.append(x)
print(result)`,
     wrong:[R`n = int(input("How many? "))
result = []
for i in range(n):
    result.append(int(input("Number: ")))
print(result)`, R`n = int(input("How many? "))
result = []
for i in range(n):
    result.append(int(input("Number: ")))
print(sorted(set(result)))`],
     hints:['Keep a seen set and a result list.','If x is not in seen: add it to seen and append it to result.','Print result at the end.','n = int(input("How many? "))\nseen = set()\nresult = []\nfor i in range(n):\n    x = int(input("Number: "))\n    if x not in seen:\n        seen.add(x)\n        result.append(x)\nprint(result)'], tags:['r4-31','r4-6']},
    {type:'mcq', code:R`print([n * n for n in range(4) if n % 2 == 0])`, q:'Strike 5: What prints?', opts:['[0, 4]','[0, 1, 4, 9]','[4]'], ans:0,
     why:'Only even n (0 and 2) pass the filter: 0 and 4.', tags:['r4-35']}
  ],
  power:{can:['Combine lists, dicts, sets and comprehensions confidently','Choose and use the right structure for real data problems'],
    expand:'Rebuild the boss round 2 as a function-free script that also prints the top 3 words.',
    where:'Counting, de-duplicating and ranking are the bread and butter of data work.',
    next:'One more gate: the Gap Check for the whole Satchel.'},
  codex:{title:'Realm 4 boss',body:'You can store, count, rank, de-duplicate and reshape data with lists, tuples, dicts and sets.',snip:R`seen = set()
counts[w] = counts.get(w, 0) + 1`}
},
{
  id:'r4-44', realm:4, n:44, title:'Gap Check: the Satchel Trial', kind:'gap', passPct:80,
  teaches:['realm4-gap'], requires:['realm4-boss'],
  story:`The Hoarder collapses into ordinary satchels, every one neatly buckled. Hopper wipes her brow and holds up a slate. "Last test before the Scrolls. Eighty percent, and the Archive opens."`,
  phases:[
    {type:'mcq', code:R`x = [1, 2, 3]
print(x[-1])`, q:'What prints?', opts:['1','3','Error'], ans:1, why:'-1 is the last item.', tags:['r4-03']},
    {type:'mcq', code:R`nums = [10, 20, 30, 40]
print(nums[1:3])`, q:'What prints?', opts:['[10, 20, 30]','[20, 30]','[20, 30, 40]'], ans:1, why:'Positions 1 and 2. The stop is excluded.', tags:['r4-11']},
    {type:'mcq', code:R`a = [3, 1, 2]
b = a.sort()
print(b)`, q:'What prints?', opts:['[1, 2, 3]','None','[3, 1, 2]'], ans:1, why:'sort() returns None.', tags:['r4-15']},
    {type:'mcq', code:R`print({"a": 1}.get("z", 5))`, q:'What prints?', opts:['5','None','KeyError'], ans:0, why:'The default 5 is returned for a missing key.', tags:['r4-25']},
    {type:'mcq', code:R`d = {"a": 1}
print(d["z"])`, q:'What error does this raise?', opts:['IndexError','KeyError','ValueError'], ans:1, why:'A missing dict key raises KeyError.', tags:['r4-25','r4-42']},
    {type:'mcq', code:R`print(len(set([1, 1, 2])))`, q:'What prints?', opts:['3','2','1'], ans:1, why:'Duplicates collapse: {1, 2}.', tags:['r4-31']},
    {type:'mcq', code:R`t = (1, 2)
t[0] = 9`, q:'What happens?', opts:['t becomes (9, 2)','TypeError','Nothing'], ans:1, why:'Tuples cannot be changed.', tags:['r4-20']},
    {type:'mcq', code:R`print([c * 2 for c in "ab"])`, q:'What prints?', opts:["['aa', 'bb']","['ab', 'ab']","['a', 'b']"], ans:0, why:'Each character is doubled.', tags:['r4-34']},
    {type:'mcq', code:R`print(list(zip([1, 2], ["a", "b"])))`, q:'What prints?', opts:["[(1, 'a'), (2, 'b')]","[1, 2, 'a', 'b']","[[1, 2], ['a', 'b']]"], ans:0, why:'zip pairs items side by side into tuples.', tags:['r4-22']},
    {type:'mcq', code:R`nums = [2, 4, 6]
for n in nums:
    nums.remove(n)
print(nums)`, q:'What prints?', opts:['[]','[4]','[2, 4, 6]'], ans:1, why:'Removing while looping skips items.', tags:['r4-41']},
    {type:'write', pts:2, prompt:'Final trial: ask `Limit: `. `scores` maps names to scores. Print the **sorted list of names** whose score is at or above the limit (use a comprehension).',
     starter:R`scores = {"Ada": 95, "Bo": 60, "Cy": 78}
limit = int(input("Limit: "))
`,
     inputs:['70'],
     cases:[{inputs:['70'],tests:[['70 keeps Ada and Cy','lines[-1]=="[\'Ada\', \'Cy\']"']]},{inputs:['90'],tests:[['90 keeps Ada','lines[-1]=="[\'Ada\']"']]},{inputs:['0'],tests:[['0 keeps all','lines[-1]=="[\'Ada\', \'Bo\', \'Cy\']"']]},{inputs:['100'],tests:[['100 keeps none','lines[-1]=="[]"']]},{inputs:['78'],tests:[['78 includes Cy','lines[-1]=="[\'Ada\', \'Cy\']"']]}],
     sol:R`scores = {"Ada": 95, "Bo": 60, "Cy": 78}
limit = int(input("Limit: "))
passed = [name for name, s in scores.items() if s >= limit]
print(sorted(passed))`,
     wrong:[R`scores = {"Ada": 95, "Bo": 60, "Cy": 78}
limit = int(input("Limit: "))
passed = [name for name, s in scores.items() if s > limit]
print(sorted(passed))`, R`scores = {"Ada": 95, "Bo": 60, "Cy": 78}
limit = int(input("Limit: "))
passed = [s for name, s in scores.items() if s >= limit]
print(sorted(passed))`],
     hints:['Loop over scores.items() to get name and score.','[name for name, s in scores.items() if s >= limit]','Print sorted(passed).','scores = {"Ada": 95, "Bo": 60, "Cy": 78}\nlimit = int(input("Limit: "))\npassed = [name for name, s in scores.items() if s >= limit]\nprint(sorted(passed))'], tags:['r4-35','r4-27','r4-15']}
  ],
  power:{can:['Handle lists, tuples, dicts and sets in real programs','Read collection errors and avoid their traps'],
    expand:'Revisit any lesson in your Training Grounds and retake the trial.',
    where:'These four structures plus loops cover most everyday data work. You are a Satchel-Master.',
    next:'Realm 5: text, regular expressions and the Scrolls & Ink.'},
  codex:{title:'Satchel Trial passed',body:'You can store, organise, search, rank and reshape data. Real programs are built from these.',snip:R`[name for name, s in scores.items() if s >= limit]`}
}
);
