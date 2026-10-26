// REALM 2 — RUNES OF CHOICE — part B (lessons 12-22)
LESSONS.push(
{
  id:'r2-12', realm:2, n:12, title:'None: the value for "nothing yet"',
  teaches:['none'], requires:['text-compare'],
  story:`In a corner of the hollow stands an empty pedestal with a sign: *Reserved for a hero.* Ada taps it. "Not zero. Not empty text. Just... **nothing yet**. Python has a value for exactly that."`,
  concept:{
    html:`\`None\` is Python's way to say "no value here yet".\n\n- It is not \`0\` and not \`""\`; it is its own thing.\n- Check for it with \`is None\` (or \`is not None\`).\n- It is falsy (an empty slot).\n\nUse it when a variable exists but has nothing meaningful yet, like a party member slot before anyone joins.`,
    analogy:`An empty seat with a "reserved" sign. The seat exists. Nobody is sitting in it.`,
    example:R`ally = None
print(ally)
print(ally is None)
ally = "Pip"
print(ally is None)`},
  predict:{code:R`result = None
print(result)
print(result is None)`, q:'What prints?', opts:['None then True','Nothing, then True','0 then False'], ans:0,
    why:'print shows the word None. And result really is None, so the check is True.'},
  cast:{code:R`ally = None
print(ally)
print(ally is None)
ally = "Pip"
print(ally is None)`, task:'Cast it. Notice how filling the slot changes the check.'},
  bug:{broken:R`shield = none
print(shield is None)`, task:'Python cannot find a name. None has a capital N. Fix it so this prints True.',
    cases:[{inputs:[],tests:[['Prints True','out.strip()=="True"'],['shield is None','g.get("shield", 1) is None']]}],
    sol:R`shield = None
print(shield is None)`, wrong:[R`shield = none
print(shield is None)`, R`shield = "None"
print(shield is None)`]},
  write:{prompt:'Create `ally` set to `None`. If `ally is None`, print `No ally yet`; otherwise print `Ally: ` plus the ally.',
    starter:R`# ally = ...
`,
    cases:[{inputs:[],tests:[['ally is None','g.get("ally", 1) is None'],['Prints No ally yet','lines==["No ally yet"]'],['Uses is None','re.search(r"is None", src) is not None']]}],
    sol:R`ally = None
if ally is None:
    print("No ally yet")
else:
    print("Ally: " + ally)`,
    wrong:[R`print("No ally yet")`, R`ally = ""
if ally == "":
    print("No ally yet")
else:
    print("Ally: " + ally)`],
    hints:['Start with ally = None.','Check with if ally is None:','else shows "Ally: " + ally.','ally = None\nif ally is None:\n    print("No ally yet")\nelse:\n    print("Ally: " + ally)']},
  power:{can:['Represent "no value yet"','Check it correctly with is None'],
    expand:'Make three party slots set to None and fill one in.',
    where:'APIs, databases and functions all use None for "not found" or "no result". You will see it constantly.',
    next:'Next: ifs inside ifs, and when to keep logic flat.'},
  codex:{title:'None',body:'None means no value yet. Check with is None. It is not 0 and not empty text.',snip:R`if ally is None:
    print("Recruit someone")`}
},
{
  id:'r2-13', realm:2, n:13, title:'Nested ifs',
  teaches:['nested-if'], requires:['none'],
  story:`The vault of Crossroads Hollow has two locks, one inside the other. Ada demonstrates: first the outer gate asks your level, and only if you pass it does the inner lock ask for the key. "An if can live **inside** an if."`,
  concept:{
    html:`You can put an \`if\` inside another \`if\`'s block. Each level of nesting adds **4 more spaces**.\n\n\`\`\`\nif level >= 5:\n    if key == "yes":\n        print("Vault opens")\n    else:\n        print("Find the key")\nelse:\n    print("Too low level")\n\`\`\`\n\nThe inner question is only asked if the outer one passed. Nest when one question only makes sense after another. Often \`and\` or a flat \`elif\` ladder is simpler.`,
    analogy:`Matryoshka dolls: you only open the inner one if you opened the outer.`,
    example:R`level = 7
key = "no"
if level >= 5:
    if key == "yes":
        print("Vault opens")
    else:
        print("Find the key")
else:
    print("Too low level")`},
  predict:{code:R`hp = 20
has_potion = True
if hp < 30:
    if has_potion:
        print("Drink")
    else:
        print("Flee")
else:
    print("Fight")`, q:'What prints?', opts:['Drink','Flee','Fight'], ans:0,
    why:'hp < 30 is True, so we step inside. has_potion is True, so Drink.'},
  cast:{code:R`level = 7
key = "no"
if level >= 5:
    if key == "yes":
        print("Vault opens")
    else:
        print("Find the key")
else:
    print("Too low level")`, task:'Cast it. Try level 2, then level 7 with key "yes".'},
  bug:{broken:R`level = int(input("Level: "))
key = input("Key (yes/no): ")
if level >= 5:
    if key == "yes":
        print("Vault opens")
else:
    print("Find the key")`, task:'Level 7 with no key prints nothing, and level 2 says "Find the key". The `else` is lined up with the wrong `if`. Fix the nesting.',
    cases:[{inputs:['7','yes'],tests:[['7 with key opens','lines[-1]=="Vault opens"']]},{inputs:['7','no'],tests:[['7 without key finds key','lines[-1]=="Find the key"']]},{inputs:['2','yes'],tests:[['2 is too low','lines[-1]=="Too low level"']]}],
    sol:R`level = int(input("Level: "))
key = input("Key (yes/no): ")
if level >= 5:
    if key == "yes":
        print("Vault opens")
    else:
        print("Find the key")
else:
    print("Too low level")`, wrong:[R`level = int(input("Level: "))
key = input("Key (yes/no): ")
if level >= 5:
    if key == "yes":
        print("Vault opens")
else:
    print("Find the key")`]},
  write:{prompt:'Ask for `HP` (whole number) and `Potion (yes/no)`. If HP is below 30: with a potion print `Drink`, without one print `Flee`. If HP is 30 or more print `Fight`. Use a nested if.',
    starter:R`# outer: hp check. inner: potion check
`,
    inputs:['20','yes'],
    cases:[{inputs:['20','yes'],tests:[['Low hp + potion drinks','lines[-1]=="Drink"']]},{inputs:['20','no'],tests:[['Low hp, no potion flees','lines[-1]=="Flee"']]},{inputs:['80','yes'],tests:[['High hp fights','lines[-1]=="Fight"']]},{inputs:['80','no'],tests:[['High hp fights without potion','lines[-1]=="Fight"']]}],
    sol:R`hp = int(input("HP: "))
potion = input("Potion (yes/no): ")
if hp < 30:
    if potion == "yes":
        print("Drink")
    else:
        print("Flee")
else:
    print("Fight")`,
    wrong:[R`hp = int(input("HP: "))
potion = input("Potion (yes/no): ")
if hp < 30 and potion == "yes":
    print("Drink")
else:
    print("Fight")`, R`hp = int(input("HP: "))
potion = input("Potion (yes/no): ")
print("Fight")`],
    hints:['The outer if checks hp < 30.','Inside that block, check the potion.','The outer else prints Fight.','hp = int(input("HP: "))\npotion = input("Potion (yes/no): ")\nif hp < 30:\n    if potion == "yes":\n        print("Drink")\n    else:\n        print("Flee")\nelse:\n    print("Fight")']},
  power:{can:['Ask a second question only after the first passes','Keep else lined up with the right if'],
    expand:'Add a third layer: only drink the potion if it is not poisoned.',
    where:'Multi-step rules (account exists, then password correct, then not locked) use nested decisions.',
    next:'Next: shrink a simple if/else into one line.'},
  codex:{title:'Nested if',body:'An if inside an if block. Each level is indented 4 more spaces. else belongs to the if at the same indent.',snip:R`if a:
    if b:
        ...`}
},
{
  id:'r2-14', realm:2, n:14, title:'One-line if (ternary)',
  teaches:['ternary'], requires:['nested-if'],
  story:`"Sometimes a choice is so small it deserves a single line," Ada says, folding a four-line rune into one clean stroke. "Read it like English: *this, if that, else the other.*"`,
  concept:{
    html:`When an if/else only picks a value, you can write it on **one line**:\n\n\`status = "Alive" if hp > 0 else "Fallen"\`\n\nPattern: \`value_if_true if condition else value_if_false\`.\n\nIt always needs the \`else\`. Use it for simple picks; for longer logic keep the normal form.`,
    analogy:`A coin with two faces where the condition decides which face lands up.`,
    example:R`hp = 0
status = "Alive" if hp > 0 else "Fallen"
print(status)`},
  predict:{code:R`hp = 12
status = "Alive" if hp > 0 else "Fallen"
print(status)`, q:'What prints?', opts:['Alive','Fallen','12'], ans:0,
    why:'hp > 0 is True, so the first value is chosen.'},
  cast:{code:R`hp = 0
status = "Alive" if hp > 0 else "Fallen"
print(status)`, task:'Cast it. Change hp to 5 and recast.'},
  bug:{broken:R`hp = 0
status = "Alive" if hp > 0
print(status)`, task:'A one-line if always needs an else. Fix it so it prints Fallen.',
    cases:[{inputs:[],tests:[['Prints Fallen','out.strip()=="Fallen"']]}],
    sol:R`hp = 0
status = "Alive" if hp > 0 else "Fallen"
print(status)`, wrong:[R`hp = 0
status = "Alive" if hp > 0
print(status)`, R`hp = 0
status = "Alive"
print(status)`]},
  write:{prompt:'Ask for HP (whole number). In **one line** set `status` to `Alive` if HP is above 0, else `Fallen`, then print it.',
    starter:R`# one-line if, then print
`,
    inputs:['5'],
    cases:[{inputs:['5'],tests:[['5 is Alive','lines[-1]=="Alive"'],['Uses a one-line if','any(" if " in l and " else " in l for l in src.splitlines())']]},{inputs:['0'],tests:[['0 is Fallen','lines[-1]=="Fallen"']]},{inputs:['-3'],tests:[['-3 is Fallen','lines[-1]=="Fallen"']]}],
    sol:R`hp = int(input("HP: "))
status = "Alive" if hp > 0 else "Fallen"
print(status)`,
    wrong:[R`hp = int(input("HP: "))
if hp > 0:
    status = "Alive"
else:
    status = "Fallen"
print(status)`, R`hp = int(input("HP: "))
status = "Alive"
print(status)`],
    hints:['Pattern: value if condition else value.','status = "Alive" if hp > 0 else "Fallen"','Then print(status).','hp = int(input("HP: "))\nstatus = "Alive" if hp > 0 else "Fallen"\nprint(status)']},
  power:{can:['Choose between two values in one line','Read ternary expressions in other people\'s code'],
    expand:'Pick "even" or "odd" for a number using % 2.',
    where:'Labels, default values and display text in apps are set with one-liners like this constantly.',
    next:'Next: protect your program from bad input.'},
  codex:{title:'One-line if',body:'value_if_true if condition else value_if_false. Needs the else.',snip:R`label = "Yes" if ok else "No"`}
},
{
  id:'r2-15', realm:2, n:15, title:'Validating input with if',
  teaches:['validate-if'], requires:['ternary','text-compare'],
  story:`A traveller hands the gate a scroll that says *"forty"* where a number should be. The gate shudders and collapses with a ValueError. Ada sighs. "Never trust what people type. **Check it first.**"`,
  concept:{
    html:`\`int("forty")\` crashes with a \`ValueError\`. Validate **before** converting.\n\n\`.isdigit()\` is True only when the text is all digits (no letters, no minus sign, not empty):\n\n\`"42".isdigit()\` is \`True\`\n\`"4x".isdigit()\` is \`False\`\n\`"".isdigit()\` is \`False\`\n\nPattern:\n\n\`\`\`\ntext = input("Age: ")\nif text.isdigit():\n    age = int(text)\nelse:\n    print("Please type digits")\n\`\`\``,
    analogy:`A security scanner at the door that checks a package before it gets inside.`,
    example:R`text = "42"
if text.isdigit():
    print(int(text) + 1)
else:
    print("Digits only")`},
  predict:{code:R`print("42".isdigit(), "4x".isdigit(), "".isdigit())`, q:'What prints?', opts:['True False False','True True False','True False True'], ans:0,
    why:'Only text made entirely of digits counts. "4x" has a letter, and empty text has no digits at all.'},
  cast:{code:R`text = "forty"
if text.isdigit():
    print(int(text) + 1)
else:
    print("Digits only")`, task:'Cast it. Change text to "40" and recast.'},
  bug:{broken:R`text = input("Gold to spend: ")
gold = int(text)
print("Spending " + str(gold))`, task:'Typing "forty" crashes it. Check the input first; if it is not digits print `Numbers only`.',
    cases:[{inputs:['40'],tests:[['40 prints Spending 40','lines[-1]=="Spending 40"']]},{inputs:['forty'],tests:[['forty prints Numbers only','lines[-1]=="Numbers only"']]}],
    sol:R`text = input("Gold to spend: ")
if text.isdigit():
    gold = int(text)
    print("Spending " + str(gold))
else:
    print("Numbers only")`, wrong:[R`text = input("Gold to spend: ")
gold = int(text)
print("Spending " + str(gold))`]},
  write:{prompt:'Ask for `Age: `. If it is not digits print `Please type digits`. Otherwise if the number is over 120 print `Not a real age`. Otherwise print `Age saved: ` plus the age.',
    starter:R`age_text = input("Age: ")
`,
    inputs:['25'],
    cases:[{inputs:['25'],tests:[['25 is saved','lines[-1]=="Age saved: 25"']]},{inputs:['abc'],tests:[['abc is rejected','lines[-1]=="Please type digits"']]},{inputs:[''],tests:[['empty is rejected','lines[-1]=="Please type digits"']]},{inputs:['-4'],tests:[['-4 is rejected','lines[-1]=="Please type digits"']]},{inputs:['200'],tests:[['200 is not real','lines[-1]=="Not a real age"']]}],
    sol:R`age_text = input("Age: ")
if not age_text.isdigit():
    print("Please type digits")
elif int(age_text) > 120:
    print("Not a real age")
else:
    print("Age saved: " + age_text)`,
    wrong:[R`age_text = input("Age: ")
age = int(age_text)
print("Age saved: " + str(age))`, R`age_text = input("Age: ")
if age_text.isdigit():
    print("Age saved: " + age_text)
else:
    print("Please type digits")`],
    hints:['Check .isdigit() before ever calling int().','if not age_text.isdigit(): ... elif int(age_text) > 120: ... else: ...','Order matters: digits first, range second.','age_text = input("Age: ")\nif not age_text.isdigit():\n    print("Please type digits")\nelif int(age_text) > 120:\n    print("Not a real age")\nelse:\n    print("Age saved: " + age_text)']},
  power:{can:['Stop bad input before it crashes your program','Check digits, then range'],
    expand:'Validate a PIN: exactly 4 digits (hint: len() comes later; try .isdigit() and a few comparisons).',
    where:'Every form, command line tool and API needs validation. Unvalidated input is behind many real bugs.',
    next:'Next: the sneaky bugs hiding on the boundary.'},
  codex:{title:'Validation',body:'Check input before converting. text.isdigit() is True for whole numbers like 42, False for -4, 4x or empty.',snip:R`if text.isdigit():
    n = int(text)`}
},
{
  id:'r2-16', realm:2, n:16, title:'Edge cases: the boundary bugs',
  teaches:['edge-cases'], requires:['validate-if'],
  story:`A merchant demands: "Seniors, 65 and over, get a discount." A clerk wrote *over 65*. A man turns up on his 65th birthday and is turned away. Ada winces. "Bugs love the **edges**."`,
  concept:{
    html:`Most decision bugs live exactly **on the boundary**: the value where the rule flips. Test these:\n\n- the boundary itself (65)\n- one below (64) and one above (66)\n- zero, negative and empty\n\nWatch \`>\` versus \`>=\`: "over 65" is \`> 65\`; "65 or older" is \`>= 65\`. The English matters.`,
    analogy:`Walking along a fence: if there is a hole, it is at the corners and joints, not in the middle of a board.`,
    example:R`age = 65
print(age > 65)
print(age >= 65)`},
  predict:{code:R`age = 13
if age > 13:
    print("Teen")
else:
    print("Child")`, q:'The ticket says teens are 13 and older. What does this print for 13?', opts:['Teen','Child','Nothing'], ans:1,
    why:'13 > 13 is False, so a 13-year-old is treated as a child. The boundary is wrong: it needs >=.'},
  cast:{code:R`for_age = 65
print(for_age > 65)
print(for_age >= 65)`, task:'Cast it. The boundary age is the one that tells > and >= apart.'},
  bug:{broken:R`age = int(input("Age: "))
if age > 65:
    print("Senior discount")
else:
    print("Regular price")`, task:'Seniors are 65 AND older, but 65-year-olds pay full price. Fix the boundary.',
    cases:[{inputs:['65'],tests:[['65 gets the discount','lines[-1]=="Senior discount"']]},{inputs:['64'],tests:[['64 pays regular','lines[-1]=="Regular price"']]},{inputs:['66'],tests:[['66 gets the discount','lines[-1]=="Senior discount"']]}],
    sol:R`age = int(input("Age: "))
if age >= 65:
    print("Senior discount")
else:
    print("Regular price")`, wrong:[R`age = int(input("Age: "))
if age > 65:
    print("Senior discount")
else:
    print("Regular price")`, R`age = int(input("Age: "))
if age >= 64:
    print("Senior discount")
else:
    print("Regular price")`]},
  write:{prompt:'Ticket prices by age: under 5 is `Free`, under 13 is `Child`, under 65 is `Adult`, 65 and over is `Senior`. Read the age and print the category.',
    starter:R`age = int(input("Age: "))
`,
    inputs:['30'],
    cases:[{inputs:['4'],tests:[['4 is Free','lines[-1]=="Free"']]},{inputs:['5'],tests:[['5 is Child','lines[-1]=="Child"']]},{inputs:['12'],tests:[['12 is Child','lines[-1]=="Child"']]},{inputs:['13'],tests:[['13 is Adult','lines[-1]=="Adult"']]},{inputs:['64'],tests:[['64 is Adult','lines[-1]=="Adult"']]},{inputs:['65'],tests:[['65 is Senior','lines[-1]=="Senior"']]}],
    sol:R`age = int(input("Age: "))
if age < 5:
    print("Free")
elif age < 13:
    print("Child")
elif age < 65:
    print("Adult")
else:
    print("Senior")`,
    wrong:[R`age = int(input("Age: "))
if age <= 5:
    print("Free")
elif age <= 13:
    print("Child")
elif age <= 65:
    print("Adult")
else:
    print("Senior")`, R`age = int(input("Age: "))
if age < 5:
    print("Free")
elif age < 12:
    print("Child")
elif age < 65:
    print("Adult")
else:
    print("Senior")`],
    hints:['Four categories means if, elif, elif, else.','"Under 5" is < 5; the next check is < 13; then < 65.','Test 4, 5, 12, 13, 64 and 65 in your head.','age = int(input("Age: "))\nif age < 5:\n    print("Free")\nelif age < 13:\n    print("Child")\nelif age < 65:\n    print("Adult")\nelse:\n    print("Senior")']},
  power:{can:['Spot off-by-one boundary mistakes','Pick a set of test values that proves a rule'],
    expand:'Pick the three most dangerous test inputs for any rule you write.',
    where:'Professional testers and developers always test at the boundaries. It is where real money and safety bugs hide.',
    next:'Next: plan a decision on paper before you code it with flowcharts.'},
  codex:{title:'Edge cases',body:'Test the boundary, one below and one above. > versus >= decides who is included.',snip:R`# test 64, 65, 66`}
},
{
  id:'r2-17', realm:2, n:17, title:'Flowcharts: plan the decision first',
  teaches:['flowchart'], requires:['edge-cases'],
  story:`Ada pins a map to the wall: boxes and arrows, Yes and No. "Master builders don't start with code," she says. "They start with a **picture of the decision**. Then the code nearly writes itself."`,
  concept:{
    html:`A **flowchart** (or a few plain-English lines) lays out decisions before you code:\n\n\`\`\`\nSTART\n  Ask for temperature\n  temp <= 0?  YES -> Freezing\n  temp < 20?  YES -> Cool\n  otherwise   -> Warm\n\`\`\`\n\nEach question becomes an \`if\` or \`elif\`, in the order they appear. "otherwise" becomes \`else\`. Write the plan as **comments** first, then fill in code beneath each one.`,
    analogy:`A road map before a trip. It is cheaper to find a wrong turn on paper than on the road.`,
    example:R`# ask for temperature
temp = 20
# <= 0 ? Freezing
# < 20  ? Cool
# otherwise Warm
if temp <= 0:
    print("Freezing")
elif temp < 20:
    print("Cool")
else:
    print("Warm")`},
  predict:{code:R`temp = 20
if temp <= 0:
    print("Freezing")
elif temp < 20:
    print("Cool")
else:
    print("Warm")`, q:'What prints?', opts:['Freezing','Cool','Warm'], ans:2,
    why:'20 <= 0 is False and 20 < 20 is False, so we reach the otherwise branch.'},
  cast:{code:R`# PLAN
# ask for temperature
# <= 0? Freezing
# < 20? Cool
# otherwise Warm
temp = int(input("Temp: "))
if temp <= 0:
    print("Freezing")
elif temp < 20:
    print("Cool")
else:
    print("Warm")`, task:'Cast it with a few temperatures in the Inputs box.', inputs:['12']},
  bug:{broken:R`temp = int(input("Temp: "))
if temp < 0:
    print("Freezing")
elif temp < 20:
    print("Cool")
else:
    print("Warm")`, task:'The plan says "temp <= 0 means Freezing" but the code says < 0. Bring the code in line with the plan.',
    cases:[{inputs:['0'],tests:[['0 is Freezing','lines[-1]=="Freezing"']]},{inputs:['-5'],tests:[['-5 is Freezing','lines[-1]=="Freezing"']]},{inputs:['19'],tests:[['19 is Cool','lines[-1]=="Cool"']]},{inputs:['20'],tests:[['20 is Warm','lines[-1]=="Warm"']]}],
    sol:R`temp = int(input("Temp: "))
if temp <= 0:
    print("Freezing")
elif temp < 20:
    print("Cool")
else:
    print("Warm")`, wrong:[R`temp = int(input("Temp: "))
if temp < 0:
    print("Freezing")
elif temp < 20:
    print("Cool")
else:
    print("Warm")`]},
  write:{prompt:'Plan: ask for the hours parked. `<= 1` hour is `Free`. `<= 3` hours is `Fee: $5`. Anything longer is `Fee: $12`. Write the plan as comments, then the code.',
    starter:R`# PLAN:
# ask for hours
# <= 1 -> Free
# <= 3 -> Fee: $5
# otherwise -> Fee: $12
`,
    inputs:['2'],
    cases:[{inputs:['0'],tests:[['0 hours is Free','lines[-1]=="Free"']]},{inputs:['1'],tests:[['1 hour is Free','lines[-1]=="Free"']]},{inputs:['2'],tests:[['2 hours is $5','lines[-1]=="Fee: $5"']]},{inputs:['3'],tests:[['3 hours is $5','lines[-1]=="Fee: $5"']]},{inputs:['4'],tests:[['4 hours is $12','lines[-1]=="Fee: $12"']]}],
    sol:R`# PLAN:
# ask for hours
# <= 1 -> Free
# <= 3 -> Fee: $5
# otherwise -> Fee: $12
hours = int(input("Hours: "))
if hours <= 1:
    print("Free")
elif hours <= 3:
    print("Fee: $5")
else:
    print("Fee: $12")`,
    wrong:[R`hours = int(input("Hours: "))
if hours < 1:
    print("Free")
elif hours < 3:
    print("Fee: $5")
else:
    print("Fee: $12")`, R`hours = int(input("Hours: "))
print("Free")`],
    hints:['Each line of the plan becomes one branch.','if hours <= 1 ... elif hours <= 3 ... else ...','Keep the plan comments at the top.','hours = int(input("Hours: "))\nif hours <= 1:\n    print("Free")\nelif hours <= 3:\n    print("Fee: $5")\nelse:\n    print("Fee: $12")']},
  power:{can:['Turn a plan into an if/elif ladder','Use comments as a plan'],
    expand:'Sketch a flowchart for your own morning routine decisions, then code the first three.',
    where:'Engineers, analysts and designers all plan logic visually before building. It prevents costly rework.',
    next:'Next: a Python shortcut for range checks: chained comparisons.'},
  codex:{title:'Flowcharts',body:'Plan the decision in plain steps or comments first. Each question becomes an if/elif, "otherwise" becomes else.',snip:R`# plan
# question? -> result`}
},
{
  id:'r2-18', realm:2, n:18, title:'Chained comparisons: between two values',
  teaches:['chained-compare'], requires:['flowchart'],
  story:`"Is the dial between zero and one hundred?" Ada asks. Most languages make you say it twice. Python lets you say it the way a human would, **in one breath**.`,
  concept:{
    html:`Python lets you chain comparisons the way you write them in maths:\n\n\`0 <= score <= 100\`\n\nmeans "score is at least 0 **and** at most 100". It replaces \`score >= 0 and score <= 100\`.\n\nWatch out: \`score >= 0 or score <= 100\` is always True (every number satisfies one side). Range checks need **and** (or a chain).`,
    analogy:`A measuring tape with two marks: is the thing between them?`,
    example:R`score = 85
print(0 <= score <= 100)
print(0 <= 150 <= 100)`},
  predict:{code:R`print(1 < 5 < 10)
print(1 < 15 < 10)`, q:'What prints?', opts:['True then True','True then False','False then False'], ans:1,
    why:'5 is between 1 and 10. 15 is more than 1 but not less than 10.'},
  cast:{code:R`month = 7
print(1 <= month <= 12)
month = 13
print(1 <= month <= 12)`, task:'Cast it. Try month = 0.'},
  bug:{broken:R`score = int(input("Score: "))
if score >= 0 or score <= 100:
    print("Valid")
else:
    print("Out of range")`, task:'A score of 150 says Valid. `or` is the wrong word for a range. Fix it.',
    cases:[{inputs:['150'],tests:[['150 is out of range','lines[-1]=="Out of range"']]},{inputs:['-1'],tests:[['-1 is out of range','lines[-1]=="Out of range"']]},{inputs:['50'],tests:[['50 is valid','lines[-1]=="Valid"']]},{inputs:['100'],tests:[['100 is valid','lines[-1]=="Valid"']]}],
    sol:R`score = int(input("Score: "))
if 0 <= score <= 100:
    print("Valid")
else:
    print("Out of range")`, wrong:[R`score = int(input("Score: "))
if score >= 0 or score <= 100:
    print("Valid")
else:
    print("Out of range")`]},
  write:{prompt:'Ask for a month number. Using a **chained comparison**, print `Valid month` if it is 1 to 12, otherwise `Not a month`.',
    starter:R`month = int(input("Month: "))
`,
    inputs:['7'],
    cases:[{inputs:['7'],tests:[['7 is valid','lines[-1]=="Valid month"'],['Uses a chain','re.search(r"\\d+\\s*<=?\\s*\\w+\\s*<=?\\s*\\d+", src) is not None']]},{inputs:['1'],tests:[['1 is valid','lines[-1]=="Valid month"']]},{inputs:['12'],tests:[['12 is valid','lines[-1]=="Valid month"']]},{inputs:['0'],tests:[['0 is not a month','lines[-1]=="Not a month"']]},{inputs:['13'],tests:[['13 is not a month','lines[-1]=="Not a month"']]}],
    sol:R`month = int(input("Month: "))
if 1 <= month <= 12:
    print("Valid month")
else:
    print("Not a month")`,
    wrong:[R`month = int(input("Month: "))
if month >= 1 and month <= 12:
    print("Valid month")
else:
    print("Not a month")`, R`month = int(input("Month: "))
if month >= 1 or month <= 12:
    print("Valid month")
else:
    print("Not a month")`],
    hints:['A chain looks like 1 <= month <= 12.','if 1 <= month <= 12:','Valid month in the if, Not a month in the else.','month = int(input("Month: "))\nif 1 <= month <= 12:\n    print("Valid month")\nelse:\n    print("Not a month")']},
  power:{can:['Check a value sits between two limits cleanly','Spot the "or instead of and" range bug'],
    expand:'Check that an hour is 0-23 and that a minute is 0-59.',
    where:'Range checks are everywhere: ages, percentages, dates, temperatures, sensor readings.',
    next:'Next: tidy your decisions with guard clauses (reject bad input first).'},
  codex:{title:'Chained comparisons',body:'a <= x <= b checks x is between a and b. Use and (not or) when writing it out in full.',snip:R`if 0 <= score <= 100:`}
},
{
  id:'r2-19', realm:2, n:19, title:'Guard clauses: reject bad cases first',
  teaches:['guard-clauses'], requires:['chained-compare'],
  story:`Ada shows a tower of nested ifs leaning like a sad pagoda. "Too deep. Hard to read." She rebuilds it flat: **check what could go wrong first**, one problem per line, and leave the happy path for last.`,
  concept:{
    html:`A **guard clause** deals with bad or special cases **first**, so the good case sits at the end, easy to see.\n\nInstead of a nested pyramid:\n\n\`\`\`\nif level < 5:\n    print("Level too low")\nelif key != "yes":\n    print("Need a key")\nelse:\n    print("Door opens")\n\`\`\`\n\nOrder matters: the first guard that matches wins. Check the most basic failures first. (Later, with functions, you'll guard with \`return\`.)`,
    analogy:`Airport security: problems are caught at the first checkpoint, so you do not get far before being turned back.`,
    example:R`level = 3
key = "yes"
if level < 5:
    print("Level too low")
elif key != "yes":
    print("Need a key")
else:
    print("Door opens")`},
  predict:{code:R`qty = 0
if qty <= 0:
    print("Invalid quantity")
elif qty > 9:
    print("Too many")
else:
    print("Bought " + str(qty))`, q:'What prints?', opts:['Invalid quantity','Too many','Bought 0'], ans:0,
    why:'The first guard catches qty = 0 before anything else is tried.'},
  cast:{code:R`level = 3
key = "yes"
if level < 5:
    print("Level too low")
elif key != "yes":
    print("Need a key")
else:
    print("Door opens")`, task:'Cast it. Try level 7 with key "no", then level 7 with "yes".'},
  bug:{broken:R`qty = int(input("Quantity: "))
gold = int(input("Gold: "))
if qty * 10 <= gold:
    print("Bought " + str(qty))
elif qty <= 0:
    print("Invalid quantity")
else:
    print("Not enough gold")`, task:'Buying -5 items says "Bought -5". The invalid-quantity guard must come first. Fix the order.',
    cases:[{inputs:['-5','50'],tests:[['-5 is invalid','lines[-1]=="Invalid quantity"']]},{inputs:['0','50'],tests:[['0 is invalid','lines[-1]=="Invalid quantity"']]},{inputs:['3','50'],tests:[['3 are bought','lines[-1]=="Bought 3"']]},{inputs:['9','50'],tests:[['9 is too expensive','lines[-1]=="Not enough gold"']]}],
    sol:R`qty = int(input("Quantity: "))
gold = int(input("Gold: "))
if qty <= 0:
    print("Invalid quantity")
elif qty * 10 > gold:
    print("Not enough gold")
else:
    print("Bought " + str(qty))`, wrong:[R`qty = int(input("Quantity: "))
gold = int(input("Gold: "))
if qty * 10 <= gold:
    print("Bought " + str(qty))
elif qty <= 0:
    print("Invalid quantity")
else:
    print("Not enough gold")`]},
  write:{prompt:'Ask for `Level` (whole number) and `Key (yes/no)`. Use guard clauses with if/elif/else only (no nested ifs). If level is below 5 print `Level too low`. Otherwise if the key is not `yes` print `Need a key`. Otherwise print `Door opens`.',
    starter:R`level = int(input("Level: "))
key = input("Key (yes/no): ")
`,
    inputs:['7','yes'],
    cases:[{inputs:['7','yes'],tests:[['7/yes opens','lines[-1]=="Door opens"'],['No nested if','re.search(r"^\\s+if\\b", src, re.M) is None']]},{inputs:['7','no'],tests:[['7/no needs a key','lines[-1]=="Need a key"']]},{inputs:['2','no'],tests:[['2/no is too low first','lines[-1]=="Level too low"']]},{inputs:['2','yes'],tests:[['2/yes is too low','lines[-1]=="Level too low"']]}],
    sol:R`level = int(input("Level: "))
key = input("Key (yes/no): ")
if level < 5:
    print("Level too low")
elif key != "yes":
    print("Need a key")
else:
    print("Door opens")`,
    wrong:[R`level = int(input("Level: "))
key = input("Key (yes/no): ")
if key != "yes":
    print("Need a key")
elif level < 5:
    print("Level too low")
else:
    print("Door opens")`, R`level = int(input("Level: "))
key = input("Key (yes/no): ")
if level >= 5:
    if key == "yes":
        print("Door opens")
    else:
        print("Need a key")
else:
    print("Level too low")`],
    hints:['Check the most basic failure (level) first.','if level < 5: ... elif key != "yes": ... else: ...','The happy path (Door opens) goes in else.','level = int(input("Level: "))\nkey = input("Key (yes/no): ")\nif level < 5:\n    print("Level too low")\nelif key != "yes":\n    print("Need a key")\nelse:\n    print("Door opens")']},
  power:{can:['Flatten nested checks into a readable chain','Order checks so the right message wins'],
    expand:'Add a third guard: players banned from the vault print `Banned` before anything else.',
    where:'Professional code is full of early checks: "if not logged in", "if file missing", "if amount invalid". This keeps the main path readable.',
    next:'Next: a real-world mission, a working shipping-cost calculator.'},
  codex:{title:'Guard clauses',body:'Check failure cases first with if/elif, put the happy path in else. Flat beats deeply nested.',snip:R`if bad:
    ...
elif also_bad:
    ...
else:
    ...`}
},
{
  id:'r2-20', realm:2, n:20, title:'Real-World Mission: Shipping Calculator',
  teaches:['mission2'], requires:['guard-clauses','format-num'],
  story:`A Crossroads merchant bursts in, parcels in both arms. "I sell enchanted candles online and I'm hand-calculating shipping on every order!" Ada nods at you. "This one's real work, apprentice. Build what she needs."`,
  concept:{
    html:`**Mission brief.** Shipping rules for a small shop:\n\n- Orders of **$50 or more** ship free\n- Otherwise by weight: **up to 1 kg** is $4.99, **up to 5 kg** is $9.99, **heavier** is $19.99\n\nYou already have everything: float input, if/elif/else, and formatted output with \`f"{x:.2f}"\`.\n\nThe free-shipping check goes **first**, because it overrides weight. Then the weight ladder, lightest first.`,
    analogy:`A shop's price list translated into an if/elif chain.`,
    example:R`weight = 3.0
total = 20.0
if total >= 50:
    cost = 0
elif weight <= 1:
    cost = 4.99
elif weight <= 5:
    cost = 9.99
else:
    cost = 19.99
print(f"Shipping: $@{cost:.2f}")`},
  predict:{code:R`weight = 8.0
total = 60.0
if total >= 50:
    cost = 0
elif weight <= 1:
    cost = 4.99
else:
    cost = 19.99
print(f"Shipping: $@{cost:.2f}")`, q:'What prints?', opts:['Shipping: $19.99','Shipping: $0.00','Shipping: $4.99'], ans:1,
    why:'The order total is 60, which is 50 or more, so free shipping wins before weight is considered.'},
  cast:{code:R`weight = float(input("Weight (kg): "))
total = float(input("Order total: "))
if total >= 50:
    cost = 0
elif weight <= 1:
    cost = 4.99
elif weight <= 5:
    cost = 9.99
else:
    cost = 19.99
print(f"Shipping: $@{cost:.2f}")`, task:'Cast it with a few weights and totals in the Inputs box (one per line).', inputs:['3','20']},
  bug:{broken:R`weight = float(input("Weight (kg): "))
total = float(input("Order total: "))
if total > 50:
    cost = 0
elif weight <= 1:
    cost = 4.99
elif weight <= 5:
    cost = 9.99
else:
    cost = 19.99
print(f"Shipping: $@{cost:.2f}")`, task:'An order of exactly $50 should ship free but is charged. Fix the boundary.',
    cases:[{inputs:['10','50'],tests:[['$50 ships free','lines[-1]=="Shipping: $0.00"']]},{inputs:['10','49.99'],tests:[['$49.99 pays by weight','lines[-1]=="Shipping: $19.99"']]},{inputs:['2','80'],tests:[['$80 ships free','lines[-1]=="Shipping: $0.00"']]}],
    sol:R`weight = float(input("Weight (kg): "))
total = float(input("Order total: "))
if total >= 50:
    cost = 0
elif weight <= 1:
    cost = 4.99
elif weight <= 5:
    cost = 9.99
else:
    cost = 19.99
print(f"Shipping: $@{cost:.2f}")`, wrong:[R`weight = float(input("Weight (kg): "))
total = float(input("Order total: "))
if total > 50:
    cost = 0
elif weight <= 1:
    cost = 4.99
elif weight <= 5:
    cost = 9.99
else:
    cost = 19.99
print(f"Shipping: $@{cost:.2f}")`]},
  write:{prompt:'Build the full tool. Ask `Weight (kg): ` (decimal) then `Order total: ` (decimal). Print `Shipping: $` and the cost with 2 decimals, using the rules above.',
    starter:R`# INPUT

# PROCESS

# OUTPUT
`,
    inputs:['3','20'],
    cases:[{inputs:['0.5','20'],tests:[['0.5kg/$20 is 4.99','lines[-1]=="Shipping: $4.99"']]},{inputs:['1','20'],tests:[['1kg/$20 is 4.99','lines[-1]=="Shipping: $4.99"']]},{inputs:['3','20'],tests:[['3kg/$20 is 9.99','lines[-1]=="Shipping: $9.99"']]},{inputs:['5','49.99'],tests:[['5kg/$49.99 is 9.99','lines[-1]=="Shipping: $9.99"']]},{inputs:['6','20'],tests:[['6kg/$20 is 19.99','lines[-1]=="Shipping: $19.99"']]},{inputs:['10','50'],tests:[['$50 ships free','lines[-1]=="Shipping: $0.00"']]}],
    sol:R`weight = float(input("Weight (kg): "))
total = float(input("Order total: "))
if total >= 50:
    cost = 0
elif weight <= 1:
    cost = 4.99
elif weight <= 5:
    cost = 9.99
else:
    cost = 19.99
print(f"Shipping: $@{cost:.2f}")`,
    wrong:[R`weight = float(input("Weight (kg): "))
total = float(input("Order total: "))
if weight <= 1:
    cost = 4.99
elif weight <= 5:
    cost = 9.99
else:
    cost = 19.99
print(f"Shipping: $@{cost:.2f}")`, R`weight = float(input("Weight (kg): "))
total = float(input("Order total: "))
if total > 50:
    cost = 0
elif weight < 1:
    cost = 4.99
elif weight < 5:
    cost = 9.99
else:
    cost = 19.99
print(f"Shipping: $@{cost:.2f}")`],
    hints:['Free shipping is checked first.','Then up to 1kg, then up to 5kg, then else.','Use <= for "up to" and >= 50 for free.','weight = float(input("Weight (kg): "))\ntotal = float(input("Order total: "))\nif total >= 50:\n    cost = 0\nelif weight <= 1:\n    cost = 4.99\nelif weight <= 5:\n    cost = 9.99\nelse:\n    cost = 19.99\nprint(f"Shipping: $@{cost:.2f}")']},
  power:{can:['Turn real shop rules into a working tool','Combine input, decisions and formatted output'],
    expand:'Add an international option: a second input that adds $15 when the country is not "us".',
    where:'This is a genuine small-business script. Rule tables like this power checkout systems and quote tools.',
    next:'Next: the Gatekeeper waits with five riddles.'},
  codex:{title:'Mission: shipping',body:'Rules from the real world become if/elif chains. The overriding rule (free shipping) goes first.',snip:R`if total >= 50:
    cost = 0`}
},
{
  id:'r2-21', realm:2, n:21, title:'Boss: The Gatekeeper\'s Riddles', kind:'boss',
  teaches:['realm2-boss'], requires:['mission2','guard-clauses','ternary','truthiness','and-or-not'],
  story:`At the far end of Crossroads Hollow stands a towering gate carved like a face. Its stone lips part. "FIVE RIDDLES," it rumbles. "ANSWER, OR TURN BACK." Sudo whispers, "Think before you choose. Every riddle is just a decision."`,
  boss:{name:'The Gatekeeper', hp:5},
  phases:[
    {type:'mcq', code:R`print(not (3 > 2 and 1 > 2))`, q:'Riddle 1: What prints?', opts:['True','False','Error'], ans:0,
     why:'3 > 2 is True, 1 > 2 is False, so the and is False. not False is True.', tags:['r2-07','r2-08']},
    {type:'write', prompt:'Riddle 2: Ask `Username: ` then `Password: `. If the username (ignoring capitals and spaces) is `ada` and the password is exactly `rune42`, print `Welcome, Ada`. If only the username is right, print `Wrong password`. Otherwise print `Unknown user`.',
     starter:R`username = input("Username: ")
password = input("Password: ")
`,
     inputs:['ada','rune42'],
     cases:[{inputs:['ada','rune42'],tests:[['Right login welcomes Ada','lines[-1]=="Welcome, Ada"']]},{inputs:['  ADA ','rune42'],tests:[['Messy username still works','lines[-1]=="Welcome, Ada"']]},{inputs:['ada','nope'],tests:[['Right user, wrong password','lines[-1]=="Wrong password"']]},{inputs:['bob','rune42'],tests:[['Wrong user','lines[-1]=="Unknown user"']]}],
     sol:R`username = input("Username: ")
password = input("Password: ")
if username.strip().lower() == "ada":
    if password == "rune42":
        print("Welcome, Ada")
    else:
        print("Wrong password")
else:
    print("Unknown user")`,
     wrong:[R`username = input("Username: ")
password = input("Password: ")
if username == "ada" and password == "rune42":
    print("Welcome, Ada")
else:
    print("Unknown user")`, R`username = input("Username: ")
password = input("Password: ")
print("Welcome, Ada")`],
     hints:['Clean the username with strip().lower().','Check the username first, then the password inside.','Three outcomes: Welcome, Wrong password, Unknown user.','username = input("Username: ")\npassword = input("Password: ")\nif username.strip().lower() == "ada":\n    if password == "rune42":\n        print("Welcome, Ada")\n    else:\n        print("Wrong password")\nelse:\n    print("Unknown user")'], tags:['r2-11','r2-13']},
    {type:'mcq', code:R`pack = ""
if pack:
    print("Carry on")
else:
    print("Empty")`, q:'Riddle 3: What prints?', opts:['Carry on','Empty','Nothing'], ans:1,
     why:'Empty text is falsy, so the else block runs.', tags:['r2-09']},
    {type:'write', prompt:'Riddle 4: Ask for a whole number. Print `positive` if it is above zero, `negative` if below zero, and `zero` if it is exactly zero.',
     starter:R`n = int(input("Number: "))
`,
     inputs:['5'],
     cases:[{inputs:['5'],tests:[['5 is positive','lines[-1]=="positive"']]},{inputs:['-3'],tests:[['-3 is negative','lines[-1]=="negative"']]},{inputs:['0'],tests:[['0 is zero','lines[-1]=="zero"']]}],
     sol:R`n = int(input("Number: "))
if n > 0:
    print("positive")
elif n < 0:
    print("negative")
else:
    print("zero")`,
     wrong:[R`n = int(input("Number: "))
if n > 0:
    print("positive")
else:
    print("negative")`, R`n = int(input("Number: "))
print("positive")`],
     hints:['Three outcomes means if, elif, else.','Zero is neither above nor below.','if n > 0 ... elif n < 0 ... else zero.','n = int(input("Number: "))\nif n > 0:\n    print("positive")\nelif n < 0:\n    print("negative")\nelse:\n    print("zero")'], tags:['r2-06','r2-16']},
    {type:'mcq', code:R`x = 10
if x > 5:
    print("A")
elif x > 8:
    print("B")`, q:'Riddle 5: What prints?', opts:['A','B','A then B'], ans:0,
     why:'Only the first True branch runs. x > 5 matches, so elif is skipped.', tags:['r2-06']}
  ],
  power:{can:['Combine comparisons, logic, text cleaning and nested decisions','Predict complex branching by hand'],
    expand:'Write your own riddle gate: ask a question, accept three valid answers in any capitalisation.',
    where:'Login flows, form checks and rule engines are made of exactly these pieces.',
    next:'A Gap Check ensures every rune holds before Realm 3.'},
  codex:{title:'Realm 2 boss',body:'You decided with if/elif/else, combined conditions, cleaned text and nested checks.',snip:R`if name.strip().lower() == "ada":
    ...`}
},
{
  id:'r2-22', realm:2, n:22, title:'Gap Check: the Crossroads Trial', kind:'gap', passPct:80,
  teaches:['realm2-gap'], requires:['realm2-boss'],
  story:`Beyond the gate lies an endless corridor. Ada stops you at the threshold with another slate. "Loops are next. Before you run into the corridor, prove your decisions are solid. Eighty percent."`,
  phases:[
    {type:'mcq', q:'Which operator asks "are these equal?"', opts:['=','==','=>'], ans:1, why:'= stores a value. == compares.', tags:['r2-03']},
    {type:'mcq', code:R`n = 15
if n > 20:
    print("big")
elif n > 10:
    print("medium")
else:
    print("small")`, q:'What prints?', opts:['big','small','medium'], ans:2, why:'15 fails the first check and passes the second.', tags:['r2-06']},
    {type:'mcq', code:R`print(True and not False)`, q:'What prints?', opts:['False','True','Error'], ans:1, why:'not False is True, and True and True is True.', tags:['r2-07']},
    {type:'mcq', code:R`print(True or False and False)`, q:'What prints?', opts:['False','Error','True'], ans:2, why:'and runs before or: False and False is False, then True or False is True.', tags:['r2-08']},
    {type:'mcq', code:R`print(bool("0"))`, q:'What prints?', opts:['True','False','0'], ans:0, why:'"0" is non-empty text, which is truthy. Only the number 0 and empty text are falsy.', tags:['r2-09']},
    {type:'mcq', code:R`print("ice" in "slice")`, q:'What prints?', opts:['False','True','ice'], ans:1, why:'"ice" is hiding at the end of "slice".', tags:['r2-10']},
    {type:'mcq', code:R`print(" Yes ".strip().lower() == "yes")`, q:'What prints?', opts:['False','True','Error'], ans:1, why:'strip removes the spaces and lower fixes the capital.', tags:['r2-11']},
    {type:'mcq', code:R`result = None
print(result is None, result == 0)`, q:'What prints?', opts:['True True','False False','True False'], ans:2, why:'None is its own value. It is None but it is not equal to 0.', tags:['r2-12']},
    {type:'mcq', code:R`print("A" if 3 > 5 else "B")`, q:'What prints?', opts:['A','B','Error'], ans:1, why:'3 > 5 is False, so the else value B is chosen.', tags:['r2-14']},
    {type:'mcq', code:R`print(0 <= 150 <= 100)`, q:'What prints?', opts:['True','False','Error'], ans:1, why:'150 is not at most 100, so the chain fails.', tags:['r2-18']},
    {type:'write', pts:2, prompt:'Final trial: ask for a year. Print `Leap year` if it is divisible by 4, except years divisible by 100 are not leap unless they are also divisible by 400. Otherwise print `Not a leap year`.',
     starter:R`year = int(input("Year: "))
`,
     inputs:['2024'],
     cases:[{inputs:['2024'],tests:[['2024 is leap','lines[-1]=="Leap year"']]},{inputs:['1900'],tests:[['1900 is not leap','lines[-1]=="Not a leap year"']]},{inputs:['2000'],tests:[['2000 is leap','lines[-1]=="Leap year"']]},{inputs:['2023'],tests:[['2023 is not leap','lines[-1]=="Not a leap year"']]}],
     sol:R`year = int(input("Year: "))
if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0):
    print("Leap year")
else:
    print("Not a leap year")`,
     wrong:[R`year = int(input("Year: "))
if year % 4 == 0:
    print("Leap year")
else:
    print("Not a leap year")`, R`year = int(input("Year: "))
if year % 4 == 0 and year % 100 != 0:
    print("Leap year")
else:
    print("Not a leap year")`],
     hints:['Divisible by 4 uses year % 4 == 0.','The exception: divisible by 100 does not count unless also by 400.','year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)','year = int(input("Year: "))\nif year % 4 == 0 and (year % 100 != 0 or year % 400 == 0):\n    print("Leap year")\nelse:\n    print("Not a leap year")'], tags:['r2-08','r2-07','r1-06']}
  ],
  power:{can:['Make programs choose between paths','Combine, group, clean and validate conditions'],
    expand:'Revisit anything in your Training Grounds and retake the trial.',
    where:'Decision logic is the heart of all software. You can now write rules, checks and gates.',
    next:'Realm 3: make your spells repeat with loops.'},
  codex:{title:'Crossroads Trial passed',body:'You can compare, combine, nest and validate. Your spells can finally decide.',snip:R`if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0):`}
}
);
