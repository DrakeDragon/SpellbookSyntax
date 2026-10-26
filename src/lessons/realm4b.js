// REALM 4 — THE SATCHEL — part B (lessons 12-22)
LESSONS.push(
{
  id:'r4-12', realm:4, n:12, title:'Building lists in loops',
  teaches:['build-list'], requires:['slicing'],
  story:`"Most lists aren't typed out," Hopper says, pointing at a conveyor of crates. "They're **built**, one item per round. Start with an empty bag, and each time the loop turns, put something in."`,
  concept:{
    html:`The accumulator pattern from Realm 3 works for lists too. Start **empty**, \`append\` inside the loop:\n\n\`\`\`\nsquares = []\nfor n in range(1, 5):\n    squares.append(n * n)\nprint(squares)    # [1, 4, 9, 16]\n\`\`\`\n\nWatch out: **create the empty list before the loop**, and **append** inside. If you write \`squares = [n * n]\` inside the loop you replace the whole list each round and keep only the last item.`,
    analogy:`A conveyor belt dropping a new crate into the cart on every pass.`,
    example:R`squares = []
for n in range(1, 5):
    squares.append(n * n)
print(squares)`},
  predict:{code:R`doubles = []
for n in range(1, 4):
    doubles.append(n * 2)
print(doubles)`, q:'What prints?', opts:['[2, 4, 6]','[1, 2, 3]','[6]'], ans:0,
    why:'The loop appends 2, 4 and 6 in turn.'},
  cast:{code:R`squares = []
for n in range(1, 5):
    squares.append(n * n)
print(squares)`, task:'Cast it. Change it to cubes (n * n * n).'},
  bug:{broken:R`squares = []
for n in range(1, 5):
    squares = [n * n]
print(squares)`, task:'Only [16] survives. Each round replaces the list. Append instead.',
    cases:[{inputs:[],tests:[['squares is [1, 4, 9, 16]','g.get("squares")==[1,4,9,16]']]}],
    sol:R`squares = []
for n in range(1, 5):
    squares.append(n * n)
print(squares)`, wrong:[R`squares = []
for n in range(1, 5):
    squares = [n * n]
print(squares)`]},
  write:{prompt:'Ask `How many? ` and build a list `multiples` of the first that many multiples of 3 (3, 6, 9 ...). Print the list.',
    starter:R`count = int(input("How many? "))
`,
    inputs:['4'],
    cases:[{inputs:['4'],tests:[['4 gives [3, 6, 9, 12]','lines[-1]=="[3, 6, 9, 12]"'],['Appends in a loop','".append(" in src']]},{inputs:['1'],tests:[['1 gives [3]','lines[-1]=="[3]"']]},{inputs:['0'],tests:[['0 gives []','lines[-1]=="[]"']]}],
    sol:R`count = int(input("How many? "))
multiples = []
for n in range(1, count + 1):
    multiples.append(n * 3)
print(multiples)`,
    wrong:[R`count = int(input("How many? "))
multiples = []
for n in range(count):
    multiples.append(n * 3)
print(multiples)`, R`count = int(input("How many? "))
print([3, 6, 9, 12])`],
    hints:['Create the empty list before the loop.','Loop n from 1 to count and append n * 3.','Print the list after the loop.','count = int(input("How many? "))\nmultiples = []\nfor n in range(1, count + 1):\n    multiples.append(n * 3)\nprint(multiples)']},
  power:{can:['Collect results into a new list','Avoid replacing the list inside the loop'],
    expand:'Build a list of the first 10 square numbers, then the first 10 powers of 2.',
    where:'Collecting results is how most data processing starts.',
    next:'Next: collect only the items that qualify.'},
  codex:{title:'Building lists',body:'result = [] before the loop, result.append(x) inside the loop.',snip:R`result = []
for n in nums:
    result.append(n)`}
},
{
  id:'r4-13', realm:4, n:13, title:'Filtering into a new list',
  teaches:['filter-list'], requires:['build-list'],
  story:`"Not every crate is worth keeping," Hopper says. "Keep only the ones that pass the test." She pins a rule to the conveyor belt.`,
  concept:{
    html:`Combine the **build** pattern with an **if** to keep only matching items:\n\n\`\`\`\nhot = []\nfor t in temps:\n    if t >= 30:\n        hot.append(t)\n\`\`\`\n\nThe original list is unchanged; \`hot\` is a new, smaller list. Use \`len(hot)\` to count matches.`,
    analogy:`A sieve that lets only the right items fall into a new bowl.`,
    example:R`temps = [18, 25, 31, 22, 35]
hot = []
for t in temps:
    if t >= 30:
        hot.append(t)
print(hot)`},
  predict:{code:R`words = ["fire", "ice", "fireball"]
out = []
for w in words:
    if "fire" in w:
        out.append(w)
print(out)`, q:'What prints?', opts:["['fire', 'fireball']","['fire']","['ice']"], ans:0,
    why:'"fire" is in "fire" and in "fireball", but not in "ice".'},
  cast:{code:R`temps = [18, 25, 31, 22, 35]
hot = []
for t in temps:
    if t >= 30:
        hot.append(t)
print(hot)`, task:'Cast it. Change the limit to 25.'},
  bug:{broken:R`temps = [18, 25, 31]
hot = []
for t in temps:
    hot.append(t)
print(hot)`, task:'hot should only hold temperatures of 30 or more. Add the filter.',
    cases:[{inputs:[],tests:[['hot is [31]','g.get("hot")==[31]']]}],
    sol:R`temps = [18, 25, 31]
hot = []
for t in temps:
    if t >= 30:
        hot.append(t)
print(hot)`, wrong:[R`temps = [18, 25, 31]
hot = []
for t in temps:
    hot.append(t)
print(hot)`]},
  write:{prompt:'Ask `Limit: ` (whole number). Build `passed`, the scores **at or above** the limit, from `scores`, then print the list.',
    starter:R`scores = [72, 95, 60, 88, 45]
limit = int(input("Limit: "))
`,
    inputs:['70'],
    cases:[{inputs:['70'],tests:[['70 keeps 72, 95, 88','lines[-1]=="[72, 95, 88]"'],['Appends in a loop','".append(" in src']]},{inputs:['0'],tests:[['0 keeps all','lines[-1]=="[72, 95, 60, 88, 45]"']]},{inputs:['100'],tests:[['100 keeps none','lines[-1]=="[]"']]},{inputs:['88'],tests:[['88 is included','lines[-1]=="[95, 88]"']]}],
    sol:R`scores = [72, 95, 60, 88, 45]
limit = int(input("Limit: "))
passed = []
for s in scores:
    if s >= limit:
        passed.append(s)
print(passed)`,
    wrong:[R`scores = [72, 95, 60, 88, 45]
limit = int(input("Limit: "))
passed = []
for s in scores:
    if s > limit:
        passed.append(s)
print(passed)`, R`scores = [72, 95, 60, 88, 45]
limit = int(input("Limit: "))
print(scores)`],
    hints:['Start with passed = [].','Loop over scores; if s >= limit: append it.','Print passed after the loop.','scores = [72, 95, 60, 88, 45]\nlimit = int(input("Limit: "))\npassed = []\nfor s in scores:\n    if s >= limit:\n        passed.append(s)\nprint(passed)']},
  power:{can:['Create a filtered copy of any list','Count matches with len()'],
    expand:'Filter a list of words to those longer than 4 letters.',
    where:'"Orders over $100", "unread emails" and "failed tests" are all filters.',
    next:'Next: finding where an item is, and how often.'},
  codex:{title:'Filtering lists',body:'Start empty, loop, if it qualifies append it. The original stays unchanged.',snip:R`keep = []
for x in data:
    if x > 0:
        keep.append(x)`}
},
{
  id:'r4-14', realm:4, n:14, title:'Searching a list: index and count',
  teaches:['list-search'], requires:['filter-list'],
  story:`"Where did the lamp go?" "How many coins have we got?" Hopper doesn't want to count by hand. Two methods answer in a word.`,
  concept:{
    html:`Two search helpers:\n\n- \`items.count(x)\` is **how many times** x appears\n- \`items.index(x)\` is the **position of the first** x\n\n\`\`\`\nlog = ["ok", "fail", "ok"]\nprint(log.count("ok"))     # 2\nprint(log.index("fail"))   # 1\n\`\`\`\n\n\`index\` raises a **ValueError** if the item is not there. Guard with \`in\` first.`,
    analogy:`Asking the stall-keeper: "how many do you have?" and "which shelf is it on?"`,
    example:R`log = ["ok", "fail", "ok"]
print(log.count("ok"))
if "fail" in log:
    print(log.index("fail"))`},
  predict:{code:R`log = ["ok", "fail", "ok"]
print(log.count("ok"), log.index("fail"))`, q:'What prints?', opts:['2 1','1 2','2 0'], ans:0,
    why:'ok appears twice. fail first appears at index 1.'},
  cast:{code:R`log = ["ok", "fail", "ok"]
print(log.count("ok"))
if "fail" in log:
    print(log.index("fail"))`, task:'Cast it. Search for "crash" instead.'},
  bug:{broken:R`log = ["ok", "fail", "ok"]
print(log.index("crash"))`, task:'index crashes when the item is missing. Print the position if found, otherwise `Not found`.',
    cases:[{inputs:[],tests:[['Prints Not found','lines==["Not found"]']]}],
    sol:R`log = ["ok", "fail", "ok"]
if "crash" in log:
    print(log.index("crash"))
else:
    print("Not found")`, wrong:[R`log = ["ok", "fail", "ok"]
print(log.index("crash"))`]},
  write:{prompt:'Ask `Word: `. Print `<word>: N times` (using `count`). If the word is in the list also print `First at: ` and the index, otherwise print `Not found`.',
    starter:R`log = ["ok", "fail", "ok", "ok", "fail"]
word = input("Word: ")
`,
    inputs:['ok'],
    cases:[{inputs:['ok'],tests:[['ok: 3 times then First at: 0','lines[-2:]==["ok: 3 times","First at: 0"]']]},{inputs:['fail'],tests:[['fail: 2 times then First at: 1','lines[-2:]==["fail: 2 times","First at: 1"]']]},{inputs:['crash'],tests:[['crash: 0 times then Not found','lines[-2:]==["crash: 0 times","Not found"]']]}],
    sol:R`log = ["ok", "fail", "ok", "ok", "fail"]
word = input("Word: ")
print(f"{word}: {log.count(word)} times")
if word in log:
    print("First at:", log.index(word))
else:
    print("Not found")`,
    wrong:[R`log = ["ok", "fail", "ok", "ok", "fail"]
word = input("Word: ")
print(f"{word}: {log.count(word)} times")
print("First at:", log.index(word))`, R`log = ["ok", "fail", "ok", "ok", "fail"]
word = input("Word: ")
print(f"{word}: 3 times")
print("First at: 0")`],
    hints:['count(word) gives how many times.','Only use index(word) if word in log.','print(f"{word}: {log.count(word)} times")','log = ["ok", "fail", "ok", "ok", "fail"]\nword = input("Word: ")\nprint(f"{word}: {log.count(word)} times")\nif word in log:\n    print("First at:", log.index(word))\nelse:\n    print("Not found")']},
  power:{can:['Count occurrences','Find a first position safely'],
    expand:'Report how many "fail" entries a log has and print an alarm over 5.',
    where:'Log analysis, vote counts and checking whether something has been seen before.',
    next:'Next: sorting.'},
  codex:{title:'count and index',body:'list.count(x) counts. list.index(x) is the first position (ValueError if absent).',snip:R`log.count("ok")
log.index("fail")`}
},
{
  id:'r4-15', realm:4, n:15, title:'Sorting: sort() versus sorted()',
  teaches:['sorting'], requires:['list-search'],
  story:`"Best seller first," Hopper says, shoving a chaotic list at you. "Put them in order." Python gives you two ways, and one of them has a famous trap.`,
  concept:{
    html:`Two ways to sort:\n\n- \`sorted(items)\` returns a **new** sorted list, original untouched\n- \`items.sort()\` sorts **in place** and returns \`None\`\n\n\`\`\`\nnums = [3, 1, 2]\nprint(sorted(nums))   # [1, 2, 3]\nprint(nums)           # [3, 1, 2]  unchanged\nnums.sort()\nprint(nums)           # [1, 2, 3]\n\`\`\`\n\nAdd \`reverse=True\` for biggest first. **The trap:** \`x = nums.sort()\` makes \`x\` equal to \`None\` because sort() returns nothing.\n\nText sorts alphabetically, but capitals sort before lowercase.`,
    analogy:`sorted = photocopy then tidy the copy. sort = tidy the original.`,
    example:R`nums = [3, 1, 2]
print(sorted(nums))
print(sorted(nums, reverse=True))
print(nums)`},
  predict:{code:R`nums = [3, 1, 2]
result = nums.sort()
print(result)`, q:'What prints?', opts:['[1, 2, 3]','None','[3, 1, 2]'], ans:1,
    why:'sort() changes the list in place and returns None, so result is None.'},
  cast:{code:R`nums = [3, 1, 2]
print(sorted(nums))
print(sorted(nums, reverse=True))
print(nums)`, task:'Cast it. Notice nums itself is never changed.'},
  bug:{broken:R`scores = [72, 95, 60]
ranked = scores.sort()
print(ranked)`, task:'ranked prints None. Use the sorting tool that RETURNS a list.',
    cases:[{inputs:[],tests:[['ranked is [60, 72, 95]','g.get("ranked")==[60,72,95]']]}],
    sol:R`scores = [72, 95, 60]
ranked = sorted(scores)
print(ranked)`, wrong:[R`scores = [72, 95, 60]
ranked = scores.sort()
print(ranked)`]},
  write:{prompt:'Create `ranked` from `scores` sorted **highest first** WITHOUT changing `scores`. Print `Top: ` and the best score, then print `ranked`.',
    starter:R`scores = [72, 95, 60, 88]
`,
    cases:[{inputs:[],tests:[['ranked high to low','g.get("ranked")==[95,88,72,60]'],['scores unchanged','g.get("scores")==[72,95,60,88]'],['Prints Top then the list','lines==["Top: 95","[95, 88, 72, 60]"]']]}],
    sol:R`scores = [72, 95, 60, 88]
ranked = sorted(scores, reverse=True)
print("Top:", ranked[0])
print(ranked)`,
    wrong:[R`scores = [72, 95, 60, 88]
scores.sort(reverse=True)
ranked = scores
print("Top:", ranked[0])
print(ranked)`, R`scores = [72, 95, 60, 88]
ranked = sorted(scores)
print("Top:", ranked[0])
print(ranked)`],
    hints:['sorted(scores, reverse=True) returns a new list.','Do not use scores.sort(), it changes scores.','The best score is ranked[0].','scores = [72, 95, 60, 88]\nranked = sorted(scores, reverse=True)\nprint("Top:", ranked[0])\nprint(ranked)']},
  power:{can:['Sort without destroying the original','Avoid the sort() returns None trap'],
    expand:'Sort a list of words alphabetically, then by reverse order.',
    where:'Leaderboards, price comparisons, alphabetical lists and newest-first feeds.',
    next:'Next: totals, highs, lows and averages.'},
  codex:{title:'Sorting',body:'sorted(x) returns a new list. x.sort() sorts in place and returns None. reverse=True for descending.',snip:R`ranked = sorted(scores, reverse=True)`}
},
{
  id:'r4-16', realm:4, n:16, title:'sum, min, max and averages',
  teaches:['list-stats'], requires:['sorting'],
  story:`"The week's takings," Hopper says. She wants the total, the best day, the worst day and the average, and she wants them without a loop. "There are built-in spells for that."`,
  concept:{
    html:`Python has built-in functions for the common questions about a list of numbers:\n\n- \`sum(nums)\` adds them up\n- \`max(nums)\` biggest, \`min(nums)\` smallest\n- \`len(nums)\` how many\n- **average** = \`sum(nums) / len(nums)\`\n\n\`\`\`\nnums = [4, 8, 6]\nprint(sum(nums), max(nums), min(nums))\nprint(sum(nums) / len(nums))   # 6.0\n\`\`\`\n\nAn **empty list** crashes \`max\`, \`min\` and the average (division by zero), so check \`if nums:\` first.`,
    analogy:`A till that totals the day automatically.`,
    example:R`nums = [4, 8, 6]
print(sum(nums), max(nums), min(nums))
print(sum(nums) / len(nums))`},
  predict:{code:R`nums = [2, 4, 6]
print(sum(nums) / len(nums))`, q:'What prints?', opts:['4.0','12','4'], ans:0,
    why:'sum is 12, len is 3, and / always gives a float: 4.0.'},
  cast:{code:R`nums = [4, 8, 6]
print(sum(nums), max(nums), min(nums))
print(sum(nums) / len(nums))`, task:'Cast it. Add a number and recast.'},
  bug:{broken:R`nums = [4, 8, 6, 10]
print(sum(nums) / 3)`, task:'The average of FOUR numbers is wrong because 3 is typed in by hand. Use len().',
    cases:[{inputs:[],tests:[['Prints 7.0','out.strip()=="7.0"'],['Uses len','"len(" in src']]}],
    sol:R`nums = [4, 8, 6, 10]
print(sum(nums) / len(nums))`, wrong:[R`nums = [4, 8, 6, 10]
print(sum(nums) / 3)`, R`nums = [4, 8, 6, 10]
print(7.0)`]},
  write:{prompt:'Ask `How many? `, then read that many numbers (`Number: `) into a list. Print `Total: `, `Highest: `, `Lowest: ` and `Average: ` (2 decimals) using `sum`, `max`, `min`.',
    starter:R`count = int(input("How many? "))
nums = []
`,
    inputs:['3','4','8','6'],
    cases:[{inputs:['3','4','8','6'],tests:[['Stats for 4 8 6','[l for l in lines if l.startswith(("Total","Highest","Lowest","Average"))]==["Total: 18","Highest: 8","Lowest: 4","Average: 6.00"]'],['Uses sum max min','"sum(" in src and "max(" in src and "min(" in src']]},{inputs:['2','10','15'],tests:[['Stats for 10 15','[l for l in lines if l.startswith(("Total","Highest","Lowest","Average"))]==["Total: 25","Highest: 15","Lowest: 10","Average: 12.50"]']]}],
    sol:R`count = int(input("How many? "))
nums = []
for i in range(count):
    nums.append(int(input("Number: ")))
print("Total:", sum(nums))
print("Highest:", max(nums))
print("Lowest:", min(nums))
print(f"Average: {sum(nums) / len(nums):.2f}")`,
    wrong:[R`count = int(input("How many? "))
nums = []
for i in range(count):
    nums.append(int(input("Number: ")))
print("Total:", sum(nums))
print("Highest:", max(nums))
print("Lowest:", min(nums))
print(f"Average: {sum(nums) / count + 1:.2f}")`, R`count = int(input("How many? "))
nums = []
for i in range(count):
    nums.append(int(input("Number: ")))
print("Total:", sum(nums))
print("Highest:", min(nums))
print("Lowest:", max(nums))
print(f"Average: {sum(nums) / len(nums):.2f}")`],
    hints:['Loop count times, appending int(input("Number: ")).','Use sum(nums), max(nums), min(nums).','Average is sum(nums) / len(nums), formatted with :.2f.','count = int(input("How many? "))\nnums = []\nfor i in range(count):\n    nums.append(int(input("Number: ")))\nprint("Total:", sum(nums))\nprint("Highest:", max(nums))\nprint("Lowest:", min(nums))\nprint(f"Average: {sum(nums) / len(nums):.2f}")']},
  power:{can:['Summarise a list in one line each','Compute an average correctly'],
    expand:'Guard against an empty list so the average prints "No data".',
    where:'Dashboards, gradebooks, budgets and test statistics all start with these four numbers.',
    next:'Next: a tour of the other handy list methods.'},
  codex:{title:'sum / min / max',body:'sum(), min(), max(), len(). Average = sum / len. Empty lists crash min/max/average.',snip:R`avg = sum(nums) / len(nums)`}
},
{
  id:'r4-17', realm:4, n:17, title:'extend, reverse, clear: more list tools',
  teaches:['list-methods'], requires:['list-stats'],
  story:`Hopper opens a drawer of odd tools: a gluing clamp, a flipper, a bag-emptier. "You'll use these less than append," she says, "but when you need them, you need them."`,
  concept:{
    html:`More list tools:\n\n- \`a.extend(b)\` adds **every item of b** onto a\n- \`a + b\` makes a **new** list joining the two\n- \`a.reverse()\` flips a in place\n- \`a.clear()\` empties it\n\n\`\`\`\na = [1, 2]\na.extend([3, 4])\nprint(a)    # [1, 2, 3, 4]\n\`\`\`\n\n**Common mistake:** \`a.append([3, 4])\` adds the whole list as **one** item: \`[1, 2, [3, 4]]\`. Use \`extend\` to merge.`,
    analogy:`extend = pour one bag into another. append = drop the whole bag in as a single item.`,
    example:R`a = [1, 2]
a.extend([3, 4])
print(a)
a.reverse()
print(a)`},
  predict:{code:R`a = [1, 2]
a.append([3, 4])
print(a)`, q:'What prints?', opts:['[1, 2, [3, 4]]','[1, 2, 3, 4]','[1, 2]'], ans:0,
    why:'append adds its argument as ONE item, so the whole list [3, 4] becomes a nested item.'},
  cast:{code:R`a = [1, 2]
a.extend([3, 4])
print(a)
a.reverse()
print(a)
print(a + [9])`, task:'Cast it. Try a.clear() then print(a).'},
  bug:{broken:R`party = ["Ada"]
new = ["Bo", "Cy"]
party.append(new)
print(party)`, task:'The party contains a list inside a list. Merge the new members in properly.',
    cases:[{inputs:[],tests:[['party is Ada, Bo, Cy','g.get("party")==["Ada","Bo","Cy"]']]}],
    sol:R`party = ["Ada"]
new = ["Bo", "Cy"]
party.extend(new)
print(party)`, wrong:[R`party = ["Ada"]
new = ["Bo", "Cy"]
party.append(new)
print(party)`]},
  write:{prompt:'Merge `recruits` into `party` using `extend`, then `reverse` the party and print it.',
    starter:R`party = ["Ada"]
recruits = ["Bo", "Cy"]
`,
    cases:[{inputs:[],tests:[['party is Cy, Bo, Ada','g.get("party")==["Cy","Bo","Ada"]'],['Prints it','lines==["[\'Cy\', \'Bo\', \'Ada\']"]'],['Uses extend and reverse','".extend(" in src and ".reverse(" in src']]}],
    sol:R`party = ["Ada"]
recruits = ["Bo", "Cy"]
party.extend(recruits)
party.reverse()
print(party)`,
    wrong:[R`party = ["Ada"]
recruits = ["Bo", "Cy"]
party.append(recruits)
party.reverse()
print(party)`, R`party = ["Ada"]
recruits = ["Bo", "Cy"]
party.extend(recruits)
print(party)`],
    hints:['party.extend(recruits) merges the two.','party.reverse() flips it in place.','Print party at the end.','party = ["Ada"]\nrecruits = ["Bo", "Cy"]\nparty.extend(recruits)\nparty.reverse()\nprint(party)']},
  power:{can:['Merge lists correctly','Flip or empty a list in place'],
    expand:'Combine three lists into one using + and compare with extend.',
    where:'Merging results from several sources is everywhere in data work.',
    next:'Next: the copy trap.'},
  codex:{title:'List tools',body:'extend merges items, append adds one thing. reverse() flips, clear() empties.',snip:R`a.extend(b)
a.reverse()`}
},
{
  id:'r4-18', realm:4, n:18, title:'Copying lists: the aliasing trap',
  teaches:['copy-list'], requires:['list-methods'],
  story:`Hopper pins a label on your satchel, then another on the same satchel. "Two labels, one bag," she says. "Change the bag through either label and *both* see it. This surprise ruins many programmers' afternoons."`,
  concept:{
    html:`\`b = a\` does **not** copy a list. It gives the **same list a second name**.\n\n\`\`\`\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)    # [1, 2, 3, 4]  (a changed too!)\n\`\`\`\n\nTo make a real, independent copy:\n\n- \`b = a.copy()\`\n- \`b = a[:]\` (slice of everything)\n- \`b = list(a)\`\n\nThis only matters for **mutable** things like lists. Numbers and text are safe to reassign.`,
    analogy:`Two keys to the same locker versus a duplicate locker.`,
    example:R`a = [1, 2, 3]
b = a.copy()
b.append(4)
print(a)
print(b)`},
  predict:{code:R`a = [1, 2, 3]
b = a
b.append(4)
print(a)`, q:'What prints?', opts:['[1, 2, 3]','[1, 2, 3, 4]','[4]'], ans:1,
    why:'a and b are the same list under two names, so the append shows up through both.'},
  cast:{code:R`a = [1, 2, 3]
b = a.copy()
b.append(4)
print(a)
print(b)`, task:'Cast it. Then change b = a.copy() to b = a and cast again.'},
  bug:{broken:R`items = ["rope", "map"]
backup = items
items.append("torch")
print(backup)`, task:'The backup should stay ["rope", "map"], but it grew too. Make a real copy.',
    cases:[{inputs:[],tests:[['backup unchanged','g.get("backup")==["rope","map"]'],['items grew','g.get("items")==["rope","map","torch"]']]}],
    sol:R`items = ["rope", "map"]
backup = items.copy()
items.append("torch")
print(backup)`, wrong:[R`items = ["rope", "map"]
backup = items
items.append("torch")
print(backup)`]},
  write:{prompt:'Make `backup`, an independent copy of `items`. Then append `"torch"` to `items`. Print `items` and then `backup`.',
    starter:R`items = ["rope", "map"]
`,
    cases:[{inputs:[],tests:[['items grew','g.get("items")==["rope","map","torch"]'],['backup is the original','g.get("backup")==["rope","map"]'],['Prints both','lines==["[\'rope\', \'map\', \'torch\']","[\'rope\', \'map\']"]']]}],
    sol:R`items = ["rope", "map"]
backup = items.copy()
items.append("torch")
print(items)
print(backup)`,
    wrong:[R`items = ["rope", "map"]
backup = items
items.append("torch")
print(items)
print(backup)`, R`items = ["rope", "map"]
items.append("torch")
backup = items.copy()
print(items)
print(backup)`],
    hints:['Copy BEFORE you change items.','backup = items.copy()','Then items.append("torch") and print both.','items = ["rope", "map"]\nbackup = items.copy()\nitems.append("torch")\nprint(items)\nprint(backup)']},
  power:{can:['Spot and avoid the aliasing bug','Make independent copies'],
    expand:'Try the same experiment with a list of lists and notice a shallow copy still shares the inner lists.',
    where:'Aliasing bugs cause some of the weirdest "who changed my data?" problems in real code.',
    next:'Next: lists inside lists.'},
  codex:{title:'Copying lists',body:'b = a shares one list. Use a.copy(), a[:] or list(a) for a real copy.',snip:R`backup = items.copy()`}
},
{
  id:'r4-19', realm:4, n:19, title:'Nested lists: grids and tables',
  teaches:['nested-list'], requires:['copy-list'],
  story:`The Bazaar floor is a grid of stalls: rows and columns. "A list can hold other lists," Hopper says. "That's how you describe a **table**."`,
  concept:{
    html:`A list of lists is a **table** (a grid). Each inner list is a row.\n\n\`\`\`\ngrid = [[1, 2, 3],\n        [4, 5, 6]]\nprint(grid[1][2])     # 6  (row 1, column 2)\n\`\`\`\n\nFirst index picks the **row**, second picks the **column**. Loop through rows, then through each row:\n\n\`\`\`\nfor row in grid:\n    for x in row:\n        print(x)\n\`\`\`\n\nOr work on a whole row: \`sum(row)\`.`,
    analogy:`A spreadsheet: rows down, columns across.`,
    example:R`grid = [[1, 2, 3], [4, 5, 6]]
print(grid[1][2])
for row in grid:
    print(sum(row))`},
  predict:{code:R`grid = [[1, 2], [3, 4]]
print(grid[0][1])`, q:'What prints?', opts:['2','3','1'], ans:0,
    why:'Row 0 is [1, 2]; column 1 of that row is 2.'},
  cast:{code:R`grid = [[1, 2, 3], [4, 5, 6]]
print(grid[1][2])
for row in grid:
    print(sum(row))`, task:'Cast it. Print grid[0] to see a whole row.'},
  bug:{broken:R`grid = [[1, 2, 3], [4, 5, 6]]
print(grid[2][1])`, task:'We want the 5 (row 1, column 1). Fix the indexes.',
    cases:[{inputs:[],tests:[['Prints 5','out.strip()=="5"'],['Uses two indexes','"grid[" in src']]}],
    sol:R`grid = [[1, 2, 3], [4, 5, 6]]
print(grid[1][1])`, wrong:[R`grid = [[1, 2, 3], [4, 5, 6]]
print(grid[2][1])`, R`grid = [[1, 2, 3], [4, 5, 6]]
print(5)`]},
  write:{prompt:'Loop over the rows of `grid` and print `Row 1: total`, `Row 2: total`, ... (use `enumerate` from 1 and `sum`).',
    starter:R`grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
`,
    cases:[{inputs:[],tests:[['Row totals','lines==["Row 1: 6","Row 2: 15","Row 3: 24"]'],['Loops over grid','"grid" in src and "for" in src']]}],
    sol:R`grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
for i, row in enumerate(grid, 1):
    print(f"Row {i}: {sum(row)}")`,
    wrong:[R`grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print("Row 1: 6")
print("Row 2: 15")
print("Row 3: 24")`, R`grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
for i, row in enumerate(grid):
    print(f"Row {i}: {sum(row)}")`],
    hints:['Loop with enumerate(grid, 1) to get the row number.','Each row is a list, so sum(row) is its total.','print(f"Row {i}: {sum(row)}")','grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nfor i, row in enumerate(grid, 1):\n    print(f"Row {i}: {sum(row)}")']},
  power:{can:['Model tables and grids','Index row then column','Loop through rows'],
    expand:'Print the column totals instead of the row totals.',
    where:'Spreadsheets, game boards, image pixels and CSV data are all grids.',
    next:'Next: tuples, the fixed bundle.'},
  codex:{title:'Nested lists',body:'grid[row][col]. A list of lists is a table. Loop rows, then items.',snip:R`for row in grid:
    print(sum(row))`}
},
{
  id:'r4-20', realm:4, n:20, title:'Tuples: fixed bundles',
  teaches:['tuples'], requires:['nested-list'],
  story:`Some things should never change: a map coordinate, a date, a colour. Hopper seals a brass tube. "This one's a **tuple**. Once packed it can't be altered."`,
  concept:{
    html:`A **tuple** is like a list that **cannot be changed**. Use parentheses:\n\n\`\`\`\npoint = (3, 4)\nprint(point[0])      # 3\n\`\`\`\n\n- Same indexing and slicing as a list\n- **Immutable**: \`point[0] = 9\` raises a **TypeError**\n- One-item tuple needs a trailing comma: \`(5,)\`\n- Use tuples for data that belongs together and should stay fixed: coordinates, RGB colours, (name, age) records.\n\nTo "change" one, make a new tuple.`,
    analogy:`A sealed envelope: you can read it but not edit what's inside.`,
    example:R`point = (3, 4)
print(point[0], point[1])
print(len(point))`},
  predict:{code:R`point = (3, 4)
print(point[1])`, q:'What prints?', opts:['3','4','(3, 4)'], ans:1,
    why:'Tuples index just like lists: index 1 is 4.'},
  cast:{code:R`point = (3, 4)
point[0] = 9`, task:'Cast this on purpose: tuples refuse to change. Read the TypeError.', expectError:true},
  bug:{broken:R`point = (3, 4)
point[0] = 9
print(point)`, task:'You cannot edit a tuple. Build a NEW tuple (9, 4) instead.',
    cases:[{inputs:[],tests:[['point is (9, 4)','g.get("point")==(9,4)']]}],
    sol:R`point = (3, 4)
point = (9, 4)
print(point)`, wrong:[R`point = (3, 4)
point[0] = 9
print(point)`]},
  write:{prompt:'Create a tuple `home` holding the numbers `35.2` and `-80.7`. Print `Lat: 35.2` and `Lon: -80.7` using its indexes.',
    starter:R`# make the tuple, then print with indexes
`,
    cases:[{inputs:[],tests:[['home is the tuple','g.get("home")==(35.2,-80.7)'],['Prints both','lines==["Lat: 35.2","Lon: -80.7"]'],['Uses indexes','"home[0]" in src and "home[1]" in src']]}],
    sol:R`home = (35.2, -80.7)
print("Lat:", home[0])
print("Lon:", home[1])`,
    wrong:[R`home = [35.2, -80.7]
print("Lat:", home[0])
print("Lon:", home[1])`, R`home = (35.2, -80.7)
print("Lat: 35.2")
print("Lon: -80.7")`],
    hints:['A tuple uses parentheses, not brackets.','home = (35.2, -80.7)','Print "Lat:", home[0] and "Lon:", home[1].','home = (35.2, -80.7)\nprint("Lat:", home[0])\nprint("Lon:", home[1])']},
  power:{can:['Make fixed bundles of data','Know when a tuple beats a list'],
    expand:'Store an RGB colour as a tuple and print each channel.',
    where:'Coordinates, colours, database rows and function results are naturally tuples.',
    next:'Next: unpacking, pulling a tuple apart into names.'},
  codex:{title:'Tuples',body:'(a, b) is an unchangeable list-like bundle. One item needs a trailing comma (5,).',snip:R`point = (3, 4)
print(point[0])`}
},
{
  id:'r4-21', realm:4, n:21, title:'Unpacking and swapping',
  teaches:['unpack'], requires:['tuples'],
  story:`"Reaching into a tuple by number is clumsy," Hopper says. She pours the brass tube out into two cups. "**Unpack** it into names and read it like a sentence."`,
  concept:{
    html:`**Unpacking** assigns the pieces of a tuple (or list) to names in one line:\n\n\`\`\`\npoint = (3, 4)\nx, y = point\nprint(x, y)     # 3 4\n\`\`\`\n\nThe number of names must match the number of items or you get a **ValueError**.\n\nThis gives the famous **swap**:\n\n\`\`\`\na, b = b, a\n\`\`\`\n\nNo temporary variable needed. Python builds the right-hand tuple first, then unpacks it.`,
    analogy:`Pouring a bag of marbles into labelled cups.`,
    example:R`a, b = 1, 2
a, b = b, a
print(a, b)`},
  predict:{code:R`a, b = 1, 2
a, b = b, a
print(a, b)`, q:'What prints?', opts:['1 2','2 1','2 2'], ans:1,
    why:'The right-hand pair (2, 1) is built first, then assigned back to a and b.'},
  cast:{code:R`point = (3, 4)
x, y = point
print(x, y)
a, b = 1, 2
a, b = b, a
print(a, b)`, task:'Cast it. Try unpacking a three-item tuple into two names and read the error.'},
  bug:{broken:R`rgb = (255, 128, 0)
r, g = rgb
print(r, g)`, task:'ValueError: too many values to unpack. There are three channels; unpack into three names.',
    cases:[{inputs:[],tests:[['Prints 255 128 0','out.strip()=="255 128 0"']]}],
    sol:R`rgb = (255, 128, 0)
r, g, b = rgb
print(r, g, b)`, wrong:[R`rgb = (255, 128, 0)
r, g = rgb
print(r, g)`]},
  write:{prompt:'Swap the values of `first` and `second` using one line of tuple unpacking, then print `first` and `second` separated by a space.',
    starter:R`first = "Ada"
second = "Bo"
`,
    cases:[{inputs:[],tests:[['Swapped','g.get("first")=="Bo" and g.get("second")=="Ada"'],['Prints Bo Ada','lines==["Bo Ada"]'],['Swaps in one line','re.search(r"first\\s*,\\s*second\\s*=\\s*second\\s*,\\s*first", src) is not None']]}],
    sol:R`first = "Ada"
second = "Bo"
first, second = second, first
print(first, second)`,
    wrong:[R`first = "Ada"
second = "Bo"
first = second
second = first
print(first, second)`, R`first = "Bo"
second = "Ada"
print(first, second)`],
    hints:['Python can swap with one line.','first, second = second, first','Then print(first, second).','first = "Ada"\nsecond = "Bo"\nfirst, second = second, first\nprint(first, second)']},
  power:{can:['Unpack tuples into names','Swap two values in one line'],
    expand:'Unpack a (name, age, city) tuple into three variables and print a sentence.',
    where:'Unpacking is everywhere in real Python: function returns, loops, config and data records.',
    next:'Next: pairs of lists with zip.'},
  codex:{title:'Unpacking',body:'x, y = pair splits a tuple into names. a, b = b, a swaps. Counts must match.',snip:R`x, y = (3, 4)
a, b = b, a`}
},
{
  id:'r4-22', realm:4, n:22, title:'Lists of pairs and zip',
  teaches:['zip'], requires:['unpack','enumerate'],
  story:`Two scrolls sit on the counter: one of names, one of prices. "Read them together," Hopper says, and ties them with a zipper made of brass thread.`,
  concept:{
    html:`\`zip(a, b)\` walks two lists **side by side**, handing you one pair at a time:\n\n\`\`\`\nnames = ["Ada", "Bo"]\nscores = [95, 80]\nfor name, score in zip(names, scores):\n    print(name, score)\n\`\`\`\n\nIt stops at the **shorter** list. A list of pairs also unpacks in a loop:\n\n\`\`\`\npairs = [("Ada", 95), ("Bo", 80)]\nfor name, score in pairs:\n    print(name, score)\n\`\`\``,
    analogy:`A zipper pairing up the teeth of two sides.`,
    example:R`names = ["Ada", "Bo"]
scores = [95, 80]
for name, score in zip(names, scores):
    print(f"{name}: {score}")`},
  predict:{code:R`a = [1, 2, 3]
b = ["x", "y"]
for n, s in zip(a, b):
    print(n, s)`, q:'How many lines print?', opts:['2','3','5'], ans:0,
    why:'zip stops when the shorter list (2 items) runs out.'},
  cast:{code:R`names = ["Ada", "Bo"]
scores = [95, 80]
for name, score in zip(names, scores):
    print(f"{name}: {score}")`, task:'Cast it. Add a third name only and recast.'},
  bug:{broken:R`names = ["Ada", "Bo"]
scores = [95, 80]
for name, score in names:
    print(f"{name}: {score}")`, task:'ValueError: you are unpacking each NAME, not a pair. Walk both lists together.',
    cases:[{inputs:[],tests:[['Prints both','lines==["Ada: 95","Bo: 80"]']]}],
    sol:R`names = ["Ada", "Bo"]
scores = [95, 80]
for name, score in zip(names, scores):
    print(f"{name}: {score}")`, wrong:[R`names = ["Ada", "Bo"]
scores = [95, 80]
for name, score in names:
    print(f"{name}: {score}")`]},
  write:{prompt:'Print each `item` with its `price` as `rope costs $4` etc., using `zip`.',
    starter:R`items = ["rope", "map", "torch"]
prices = [4, 9, 3]
`,
    cases:[{inputs:[],tests:[['Three lines','lines==["rope costs $4","map costs $9","torch costs $3"]'],['Uses zip','"zip(" in src']]}],
    sol:R`items = ["rope", "map", "torch"]
prices = [4, 9, 3]
for item, price in zip(items, prices):
    print(f"{item} costs $@{price}")`,
    wrong:[R`items = ["rope", "map", "torch"]
prices = [4, 9, 3]
for i in range(3):
    print(f"{items[i]} costs $@{prices[i]}")`, R`items = ["rope", "map", "torch"]
prices = [4, 9, 3]
for item in items:
    print(f"{item} costs $4")`],
    hints:['for item, price in zip(items, prices):','The f-string: f"{item} costs $@{price}"','Remember the $ is just a character; the braces hold the variable.','items = ["rope", "map", "torch"]\nprices = [4, 9, 3]\nfor item, price in zip(items, prices):\n    print(f"{item} costs $@{price}")']},
  power:{can:['Walk two lists together','Loop over a list of pairs'],
    expand:'Build a total cost by zipping quantities with prices.',
    where:'Combining columns of data (names with scores, dates with sales) uses zip.',
    next:'Next: dictionaries, look things up by name instead of position.'},
  codex:{title:'zip',body:'zip(a, b) pairs items side by side and stops at the shorter list.',snip:R`for x, y in zip(a, b):
    print(x, y)`}
}
);
