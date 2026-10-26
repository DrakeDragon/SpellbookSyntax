// REALM 2 — RUNES OF CHOICE: if / else / logic (22 lessons) — part A (lessons 1-11)
LESSONS.push(
{
  id:'r2-01', realm:2, n:1, title:'True and False',
  teaches:['booleans'], requires:['realm1-gap'],
  story:`Past the Market lies Crossroads Hollow, where every path splits in two. Ada the rune-smith taps a stone gate with two glowing symbols: one lit, one dark. "Every choice in code boils down to one of these," she says. "**True** or **False**. Yes or no. Learn them and your spells can finally *decide*."`,
  concept:{
    html:`Python has a special value type for yes/no answers: a **boolean**. There are exactly two booleans:\n\n\`True\` and \`False\`\n\nTwo rules:\n- They are **not** text, so no quotes.\n- The first letter is **capital**. \`true\` is not the same thing.\n\nYou can store them like any value: \`has_key = True\`. Their type is \`bool\`.`,
    analogy:`A light switch. It is either on or off, nothing in between.`,
    example:R`has_key = True
print(has_key)
print(type(has_key))`},
  predict:{code:R`alive = True
print(alive)`, q:'What prints?', opts:['True','true','"True" with quotes'], ans:0,
    why:'print shows the boolean value True. It is capitalised, and print never adds quotes.'},
  cast:{code:R`has_key = True
has_torch = False
print(has_key)
print(has_torch)
print(type(has_key))`, task:'Cast it. Flip the True and False values and cast again.'},
  bug:{broken:R`alive = true
print(alive)`, task:'Python says something is not defined. Fix the boolean so it prints True.',
    cases:[{inputs:[],tests:[['Prints True','out.strip()=="True"'],['alive is the real boolean True','g.get("alive") is True']]}],
    sol:R`alive = True
print(alive)`, wrong:[R`alive = true
print(alive)`, R`alive = "True"
print(alive)`]},
  write:{prompt:'Create `has_key` set to `True` and `has_torch` set to `False`. Print both, one per line.',
    starter:R`# make two booleans, then print them
`,
    cases:[{inputs:[],tests:[['has_key is True','g.get("has_key") is True'],['has_torch is False','g.get("has_torch") is False'],['Prints True then False','lines==["True","False"]']]}],
    sol:R`has_key = True
has_torch = False
print(has_key)
print(has_torch)`,
    wrong:[R`has_key = "True"
has_torch = "False"
print(has_key)
print(has_torch)`, R`print(True)
print(False)`],
    hints:['No quotes around True and False.','has_key = True on the first line.','has_torch = False, then two prints.','has_key = True\nhas_torch = False\nprint(has_key)\nprint(has_torch)']},
  power:{can:['Store yes/no answers as True and False','Spot the difference between True and "True"'],
    expand:'Make three booleans about your day (has_coffee, is_raining, is_weekend) and print them.',
    where:'Settings, checkboxes, permissions and "is this user logged in?" are all booleans.',
    next:'Next: ask Python questions that produce True or False.'},
  codex:{title:'Booleans',body:'True and False are the two boolean values. Capital first letter, no quotes. Type is bool.',snip:R`has_key = True
print(has_key)`}
},
{
  id:'r2-02', realm:2, n:2, title:'Comparison operators',
  teaches:['comparison'], requires:['booleans'],
  story:`"But where do True and False come from?" you ask. Ada grins and slides a stone between two pans of a brass scale. "From **questions**. Is this bigger? Is that equal? The scale answers yes or no, and Python does the same."`,
  concept:{
    html:`A **comparison** asks a question and gives back a boolean.\n\n- \`>\` greater than\n- \`<\` less than\n- \`>=\` greater than or equal\n- \`<=\` less than or equal\n- \`==\` equal to\n- \`!=\` not equal to\n\n\`10 >= 10\` is \`True\`. \`3 != 3\` is \`False\`. In \`>=\` the \`>\` comes first, then \`=\`.`,
    analogy:`A balance scale: it only ever answers "does this hold, yes or no?"`,
    example:R`print(5 > 3)
print(5 == 6)
print(5 != 6)`},
  predict:{code:R`print(10 >= 10)`, q:'What prints?', opts:['True','False','10'], ans:0,
    why:'>= means greater than OR equal. 10 is equal to 10, so the answer is True.'},
  cast:{code:R`mana = 40
print(mana > 30)
print(mana == 40)
print(mana != 40)
print(mana <= 39)`, task:'Cast it. Change mana to 30 and predict each line before casting.'},
  bug:{broken:R`mana = 30
print(mana => 30)`, task:'Is mana at least 30? The comparison is spelled wrong. Fix it so it prints True.',
    cases:[{inputs:[],tests:[['Prints True','out.strip()=="True"']]}],
    sol:R`mana = 30
print(mana >= 30)`, wrong:[R`mana = 30
print(mana => 30)`, R`mana = 30
print(mana > 30)`]},
  write:{prompt:'`hp` is already `12`. Create a variable `is_low` that is `True` when hp is less than 20. Then print `is_low`.',
    starter:R`hp = 12
# make is_low, then print it
`,
    cases:[{inputs:[],tests:[['is_low is True','g.get("is_low") is True'],['Prints True','lines==["True"]'],['Uses a comparison','"<" in src']]}],
    sol:R`hp = 12
is_low = hp < 20
print(is_low)`,
    wrong:[R`hp = 12
print(True)`, R`hp = 12
is_low = hp > 20
print(is_low)`],
    hints:['A comparison like hp < 20 gives a boolean you can store.','is_low = hp < 20','Then print(is_low).','hp = 12\nis_low = hp < 20\nprint(is_low)']},
  power:{can:['Ask Python yes/no questions about numbers','Store the answer in a variable'],
    expand:'Compare your age to 18, 21 and 65 and print the three results.',
    where:'Every "is the balance enough?" or "is the score high?" check in software starts with a comparison.',
    next:'Next: the classic trap of = versus ==.'},
  codex:{title:'Comparisons',body:'> < >= <= == != each give True or False.',snip:R`print(5 >= 5)
print(5 != 6)`}
},
{
  id:'r2-03', realm:2, n:3, title:'= versus ==',
  teaches:['assign-vs-equal'], requires:['comparison'],
  story:`Sudo points at two chalk marks on the gatepost: \`=\` and \`==\`. "Beginners and professionals both mix these up. One *stores*. The other *asks*. Mix them and the gate stays shut."`,
  concept:{
    html:`Two different jobs:\n\n- \`=\` **assigns**: \`gold = 40\` puts 40 in the jar.\n- \`==\` **compares**: \`gold == 40\` asks "is it 40?" and gives \`True\` or \`False\`.\n\nRead \`=\` aloud as "becomes" and \`==\` as "is equal to".\n\nA single \`=\` inside a question is a mistake Python will usually stop you on.`,
    analogy:`Writing a label on a jar versus peeking inside to check what the label says.`,
    example:R`gold = 40
print(gold == 40)
print(gold == 50)`},
  predict:{code:R`x = 5
print(x == 5)
print(x == 6)`, q:'What prints?', opts:['5 then 6','True then False','False then True'], ans:1,
    why:'x holds 5. Asking x == 5 is True, and x == 6 is False.'},
  cast:{code:R`secret = "moon"
guess = "moon"
print(guess == secret)`, task:'Cast it. Change guess to something else and cast again.'},
  bug:{broken:R`gold = 40
print(gold = 40)`, task:'The code tries to store inside print(). Make it ask if gold equals 40 and print True.',
    cases:[{inputs:[],tests:[['Prints True','out.strip()=="True"'],['Uses ==','"==" in src']]}],
    sol:R`gold = 40
print(gold == 40)`, wrong:[R`gold = 40
print(gold = 40)`, R`gold = 40
print("True")`]},
  write:{prompt:'Ask the player for a password with `input`, then print `True` if it equals `open sesame` and `False` otherwise (print the comparison itself).',
    starter:R`# ask, compare, print the result
`,
    inputs:['open sesame'],
    cases:[{inputs:['open sesame'],tests:[['Correct password prints True','lines[-1]=="True"']]},{inputs:['letmein'],tests:[['Wrong password prints False','lines[-1]=="False"']]}],
    sol:R`guess = input("Password: ")
print(guess == "open sesame")`,
    wrong:[R`guess = input("Password: ")
print(True)`, R`guess = input("Password: ")
print(guess)`],
    hints:['Store the answer from input() in a variable.','Compare it with == to the exact text.','print(guess == "open sesame")','guess = input("Password: ")\nprint(guess == "open sesame")']},
  power:{can:['Tell assigning from comparing','Check whether input matches a secret'],
    expand:'Check if a typed number equals your lucky number.',
    where:'Passwords, PINs, answers in quizzes and codes in forms are all equality checks.',
    next:'Next: use the answer to choose what happens, with if.'},
  codex:{title:'= vs ==',body:'= stores a value. == asks if two values are equal and gives True or False.',snip:R`gold = 40
print(gold == 40)`}
},
{
  id:'r2-04', realm:2, n:4, title:'if: run code only sometimes',
  teaches:['if'], requires:['assign-vs-equal','indent'],
  story:`The gate hums. "Now the good part," Ada says. She writes a rune on the stone: *if the guest is friendly, open.* The gate opens only when the question comes back True. "That's an **if**. A spell that can say *no*."`,
  concept:{
    html:`An \`if\` runs its indented block **only when** the condition is True.\n\n\`\`\`\nif hp < 5:\n    print("Danger!")\n\`\`\`\n\nThree things to remember:\n1. The line ends with a **colon** \`:\`\n2. The block below is **indented** 4 spaces\n3. When the condition is False, Python skips the whole block and moves on`,
    analogy:`A bouncer: if you are on the list, you walk through. If not, the door is simply skipped.`,
    example:R`hp = 3
if hp < 5:
    print("Danger!")
print("Done")`},
  predict:{code:R`hp = 3
if hp < 5:
    print("Danger!")
print("Done")`, q:'What prints?', opts:['Danger! then Done','Only Done','Only Danger!'], ans:0,
    why:'3 < 5 is True so the indented line runs. "Done" is not indented, so it always runs.'},
  cast:{code:R`hp = 3
if hp < 5:
    print("Danger!")
print("Done")`, task:'Cast it. Change hp to 50 and cast again. What disappears?'},
  bug:{broken:R`hp = 3
if hp < 5
    print("Danger!")`, task:'The if line is missing something at the end. Fix it so Danger! prints.',
    cases:[{inputs:[],tests:[['Prints Danger!','lines==["Danger!"]'],['Has an if','re.search(r"^if\\b", src, re.M) is not None']]}],
    sol:R`hp = 3
if hp < 5:
    print("Danger!")`, wrong:[R`hp = 3
if hp < 5
    print("Danger!")`, R`hp = 3
print("Danger!")`]},
  write:{prompt:'Ask for the player\'s mana as a whole number. If it is less than `10`, print `Low mana`. Otherwise print nothing extra.',
    starter:R`# ask for mana, then use an if
`,
    inputs:['5'],
    cases:[{inputs:['5'],tests:[['5 mana prints Low mana','"Low mana" in lines']]},{inputs:['50'],tests:[['50 mana prints nothing extra','"Low mana" not in lines']]}],
    sol:R`mana = int(input("Mana: "))
if mana < 10:
    print("Low mana")`,
    wrong:[R`mana = int(input("Mana: "))
print("Low mana")`, R`mana = int(input("Mana: "))
if mana > 10:
    print("Low mana")`],
    hints:['Convert input to an int first.','if mana < 10: with a colon.','Indent the print by 4 spaces.','mana = int(input("Mana: "))\nif mana < 10:\n    print("Low mana")']},
  power:{can:['Run code only when a condition is True','Write a correctly indented block'],
    expand:'Add a second if that prints "Full mana" when mana equals 100.',
    where:'Warnings, alerts, discounts and error messages all start as a lonely if.',
    next:'Next: give the False case its own path with else.'},
  codex:{title:'if',body:'if condition: runs the indented block only when the condition is True.',snip:R`if hp < 5:
    print("Danger!")`}
},
{
  id:'r2-05', realm:2, n:5, title:'else: the other path',
  teaches:['else'], requires:['if'],
  story:`"A gate that only opens is half a gate," Ada says. She adds a second rune beneath the first. "*Otherwise,* slam shut." Now the gate reacts both ways.`,
  concept:{
    html:`\`else\` gives the **False** case its own block. Exactly one of the two blocks runs.\n\n\`\`\`\nif age >= 18:\n    print("Enter")\nelse:\n    print("Turn back")\n\`\`\`\n\n\`else\` has **no condition** of its own. It lines up with its \`if\` and ends with a colon.`,
    analogy:`A fork in the road: you take exactly one path, never both and never neither.`,
    example:R`age = 16
if age >= 18:
    print("Enter")
else:
    print("Turn back")`},
  predict:{code:R`age = 16
if age >= 18:
    print("Enter")
else:
    print("Turn back")`, q:'What prints?', opts:['Enter','Turn back','Both'], ans:1,
    why:'16 >= 18 is False, so the else block runs instead.'},
  cast:{code:R`age = 16
if age >= 18:
    print("Enter")
else:
    print("Turn back")`, task:'Cast it. Set age to 18 and cast again.'},
  bug:{broken:R`age = 16
if age >= 18:
    print("Enter")
else age < 18:
    print("Turn back")`, task:'else never takes a condition. Fix the code so it prints Turn back.',
    cases:[{inputs:[],tests:[['Prints Turn back','lines==["Turn back"]']]}],
    sol:R`age = 16
if age >= 18:
    print("Enter")
else:
    print("Turn back")`, wrong:[R`age = 16
if age >= 18:
    print("Enter")
else age < 18:
    print("Turn back")`, R`age = 16
print("Enter")`]},
  write:{prompt:'Ask for age (whole number). Print `Enter` if it is 18 or more, otherwise `Turn back`.',
    starter:R`# if / else on the age
`,
    inputs:['20'],
    cases:[{inputs:['20'],tests:[['20 prints Enter','lines[-1]=="Enter"']]},{inputs:['18'],tests:[['18 prints Enter','lines[-1]=="Enter"']]},{inputs:['9'],tests:[['9 prints Turn back','lines[-1]=="Turn back"']]}],
    sol:R`age = int(input("Age: "))
if age >= 18:
    print("Enter")
else:
    print("Turn back")`,
    wrong:[R`age = int(input("Age: "))
if age > 18:
    print("Enter")
else:
    print("Turn back")`, R`age = int(input("Age: "))
print("Enter")`],
    hints:['Two outcomes means if plus else.','if age >= 18: ... else: ...','Both lines inside need 4 spaces.','age = int(input("Age: "))\nif age >= 18:\n    print("Enter")\nelse:\n    print("Turn back")']},
  power:{can:['Give every decision two outcomes','Guarantee that exactly one block runs'],
    expand:'Make a coin-flip checker: print "Heads wins" if a typed word equals heads, else "Tails wins".',
    where:'Login success vs failure, pass vs fail, open vs closed: all if/else.',
    next:'Next: more than two paths, with elif.'},
  codex:{title:'if / else',body:'else runs when the if condition was False. No condition after else, just a colon.',snip:R`if ok:
    print("yes")
else:
    print("no")`}
},
{
  id:'r2-06', realm:2, n:6, title:'elif: many paths, order matters',
  teaches:['elif'], requires:['else'],
  story:`The gate gets greedy. Ada chalks three runes: *healthy, hurt, critical.* "Real choices have more than two outcomes," she says. "Python checks them **top to bottom** and stops at the first match. So the order is part of the spell."`,
  concept:{
    html:`\`elif\` (else-if) adds more conditions between \`if\` and \`else\`.\n\n\`\`\`\nif hp >= 70:\n    print("Healthy")\nelif hp >= 30:\n    print("Hurt")\nelse:\n    print("Critical")\n\`\`\`\n\nPython tests each condition **in order** and runs only the **first** True one. Put the most specific or highest checks first.`,
    analogy:`A sorting chute with doors: the first door your item fits through is the one it uses.`,
    example:R`hp = 45
if hp >= 70:
    print("Healthy")
elif hp >= 30:
    print("Hurt")
else:
    print("Critical")`},
  predict:{code:R`hp = 45
if hp >= 70:
    print("Healthy")
elif hp >= 30:
    print("Hurt")
else:
    print("Critical")`, q:'What prints?', opts:['Healthy','Hurt','Critical'], ans:1,
    why:'45 fails the first check, passes the second, and Python stops there.'},
  cast:{code:R`hp = 45
if hp >= 70:
    print("Healthy")
elif hp >= 30:
    print("Hurt")
else:
    print("Critical")`, task:'Cast it. Try hp values 80, 30 and 5.'},
  bug:{broken:R`hp = int(input("HP: "))
if hp >= 30:
    print("Hurt")
elif hp >= 70:
    print("Healthy")
else:
    print("Critical")`, task:'80 HP should be Healthy but prints Hurt. The checks are in the wrong order. Fix it.',
    cases:[{inputs:['80'],tests:[['80 is Healthy','lines[-1]=="Healthy"']]},{inputs:['45'],tests:[['45 is Hurt','lines[-1]=="Hurt"']]},{inputs:['10'],tests:[['10 is Critical','lines[-1]=="Critical"']]}],
    sol:R`hp = int(input("HP: "))
if hp >= 70:
    print("Healthy")
elif hp >= 30:
    print("Hurt")
else:
    print("Critical")`, wrong:[R`hp = int(input("HP: "))
if hp >= 30:
    print("Hurt")
elif hp >= 70:
    print("Healthy")
else:
    print("Critical")`]},
  write:{prompt:'Ask for a score. Print `Gold` if 90 or more, `Silver` if 70 or more, `Bronze` if 50 or more, otherwise `None`.',
    starter:R`# if / elif / elif / else
`,
    inputs:['95'],
    cases:[{inputs:['95'],tests:[['95 is Gold','lines[-1]=="Gold"']]},{inputs:['70'],tests:[['70 is Silver','lines[-1]=="Silver"']]},{inputs:['55'],tests:[['55 is Bronze','lines[-1]=="Bronze"']]},{inputs:['20'],tests:[['20 is None','lines[-1]=="None"']]}],
    sol:R`score = int(input("Score: "))
if score >= 90:
    print("Gold")
elif score >= 70:
    print("Silver")
elif score >= 50:
    print("Bronze")
else:
    print("None")`,
    wrong:[R`score = int(input("Score: "))
if score >= 50:
    print("Bronze")
elif score >= 70:
    print("Silver")
elif score >= 90:
    print("Gold")
else:
    print("None")`, R`score = int(input("Score: "))
if score >= 90:
    print("Gold")
if score >= 70:
    print("Silver")
`],
    hints:['Check the highest score first.','if score >= 90, then elif >= 70, then elif >= 50.','Finish with else for everything below 50.','score = int(input("Score: "))\nif score >= 90:\n    print("Gold")\nelif score >= 70:\n    print("Silver")\nelif score >= 50:\n    print("Bronze")\nelse:\n    print("None")']},
  power:{can:['Handle any number of outcomes','Order conditions so the right one wins'],
    expand:'Add a "Platinum" tier at 100.',
    where:'Grading, shipping tiers, tax brackets, ticket prices and HTTP status handling all use elif ladders.',
    next:'Next: combine questions with and, or and not.'},
  codex:{title:'elif',body:'elif adds extra conditions. Only the first True branch runs, so put checks in the right order.',snip:R`if a:
    ...
elif b:
    ...
else:
    ...`}
},
{
  id:'r2-07', realm:2, n:7, title:'and, or, not',
  teaches:['and-or-not'], requires:['elif'],
  story:`Two guards flank the next door. "Show a badge **and** a pass," says one. "Or give a password," says the other. Ada nods. "Real rules combine questions. Python has three little words for it."`,
  concept:{
    html:`Combine booleans with words:\n\n- \`a and b\` is True only if **both** are True\n- \`a or b\` is True if **at least one** is True\n- \`not a\` flips True to False and False to True\n\nExample: \`level >= 5 and gold >= 100\` needs both to hold.`,
    analogy:`and = both keys must turn. or = either key works. not = a mirror that flips the answer.`,
    example:R`has_key = True
has_map = False
print(has_key and has_map)
print(has_key or has_map)
print(not has_map)`},
  predict:{code:R`has_key = True
has_map = False
print(has_key and has_map)
print(has_key or has_map)
print(not has_map)`, q:'What prints (in order)?', opts:['True, True, True','False, True, True','False, False, False'], ans:1,
    why:'and needs both (False). or needs one (True). not False is True.'},
  cast:{code:R`level = 6
gold = 80
print(level >= 5 and gold >= 100)
print(level >= 5 or gold >= 100)
print(not level >= 5)`, task:'Cast it. Change gold to 120 and recast. Which lines changed?'},
  bug:{broken:R`level = 6
gold = 80
print(level >= 5 or gold >= 100)`, task:'The shop needs BOTH level 5+ and 100+ gold. With 80 gold it should print False. Fix it.',
    cases:[{inputs:[],tests:[['Prints False','out.strip()=="False"']]}],
    sol:R`level = 6
gold = 80
print(level >= 5 and gold >= 100)`, wrong:[R`level = 6
gold = 80
print(level >= 5 or gold >= 100)`, R`level = 6
gold = 80
print(True)`]},
  write:{prompt:'Ask for a level and then gold (both whole numbers). Print `True` if level is at least 5 **and** gold is at least 100, otherwise `False`. Print the combined comparison itself.',
    starter:R`# two inputs, one combined condition
`,
    inputs:['5','100'],
    cases:[{inputs:['5','100'],tests:[['5/100 prints True','lines[-1]=="True"']]},{inputs:['5','50'],tests:[['5/50 prints False','lines[-1]=="False"']]},{inputs:['3','200'],tests:[['3/200 prints False','lines[-1]=="False"']]}],
    sol:R`level = int(input("Level: "))
gold = int(input("Gold: "))
print(level >= 5 and gold >= 100)`,
    wrong:[R`level = int(input("Level: "))
gold = int(input("Gold: "))
print(level >= 5 or gold >= 100)`, R`level = int(input("Level: "))
gold = int(input("Gold: "))
print(level >= 5)`],
    hints:['Two inputs, two ints.','Combine two comparisons with and.','print(level >= 5 and gold >= 100)','level = int(input("Level: "))\ngold = int(input("Gold: "))\nprint(level >= 5 and gold >= 100)']},
  power:{can:['Require several conditions at once','Accept one of several conditions','Flip a condition with not'],
    expand:'Add a third condition: has_membership must be True too.',
    where:'Login rules, shipping eligibility, search filters and security checks combine many conditions.',
    next:'Next: what happens when and/or/not mix, and how parentheses save you.'},
  codex:{title:'and / or / not',body:'and needs both True. or needs at least one True. not flips a boolean.',snip:R`print(a and b)
print(a or b)
print(not a)`}
},
{
  id:'r2-08', realm:2, n:8, title:'Combining conditions and parentheses',
  teaches:['parentheses-logic'], requires:['and-or-not'],
  story:`Ada draws a rule on the slate: *"Pass holders get in free if they are children or seniors."* She frowns. "Say that aloud to ten people, get ten different meanings. Python has a firm order, and **parentheses** let you say exactly what you mean."`,
  concept:{
    html:`When conditions mix, Python goes in this order:\n\n1. \`not\`\n2. \`and\`\n3. \`or\`\n\nSo \`True or False and False\` is \`True\` (the \`and\` goes first). Wrap a part in **parentheses** to force your meaning:\n\n\`(True or False) and False\` is \`False\`.\n\nWhen unsure, add parentheses. They cost nothing and make the rule readable.`,
    analogy:`Maths again: multiplication before addition. and is the "multiply", or is the "add". Parentheses override.`,
    example:R`print(True or False and False)
print((True or False) and False)`},
  predict:{code:R`print(True or False and False)
print((True or False) and False)`, q:'What prints?', opts:['True then True','True then False','False then False'], ans:1,
    why:'First line: and goes first (False and False = False), then True or False = True. Second: parentheses make the or go first, then True and False = False.'},
  cast:{code:R`age = 70
has_pass = False
print(has_pass and (age < 12 or age >= 65))
print(has_pass and age < 12 or age >= 65)`, task:'Cast it. The two lines look alike but give different answers. Why?'},
  bug:{broken:R`age = int(input("Age: "))
has_pass = input("Pass (yes/no): ") == "yes"
if has_pass and age < 12 or age >= 65:
    print("Free")
else:
    print("Pay")`, task:'A 70-year-old WITHOUT a pass slips in free. Passes are required for everyone. Fix the grouping.',
    cases:[{inputs:['70','no'],tests:[['70 without pass pays','lines[-1]=="Pay"']]},{inputs:['70','yes'],tests:[['70 with pass is free','lines[-1]=="Free"']]},{inputs:['8','yes'],tests:[['8 with pass is free','lines[-1]=="Free"']]},{inputs:['30','yes'],tests:[['30 with pass pays','lines[-1]=="Pay"']]}],
    sol:R`age = int(input("Age: "))
has_pass = input("Pass (yes/no): ") == "yes"
if has_pass and (age < 12 or age >= 65):
    print("Free")
else:
    print("Pay")`, wrong:[R`age = int(input("Age: "))
has_pass = input("Pass (yes/no): ") == "yes"
if has_pass and age < 12 or age >= 65:
    print("Free")
else:
    print("Pay")`]},
  write:{prompt:'Ask for age, then ask `Member (yes/no)`. Print `Discount` if the person is a member **and** is either under 18 or 60+. Otherwise print `Full price`.',
    starter:R`# age, then member, then one grouped condition
`,
    inputs:['10','yes'],
    cases:[{inputs:['10','yes'],tests:[['10 member gets Discount','lines[-1]=="Discount"']]},{inputs:['65','yes'],tests:[['65 member gets Discount','lines[-1]=="Discount"']]},{inputs:['30','yes'],tests:[['30 member pays full price','lines[-1]=="Full price"']]},{inputs:['65','no'],tests:[['65 non-member pays full price','lines[-1]=="Full price"']]},{inputs:['10','no'],tests:[['10 non-member pays full price','lines[-1]=="Full price"']]}],
    sol:R`age = int(input("Age: "))
member = input("Member (yes/no): ") == "yes"
if member and (age < 18 or age >= 60):
    print("Discount")
else:
    print("Full price")`,
    wrong:[R`age = int(input("Age: "))
member = input("Member (yes/no): ") == "yes"
if member and age < 18 or age >= 60:
    print("Discount")
else:
    print("Full price")`, R`age = int(input("Age: "))
member = input("Member (yes/no): ") == "yes"
if age < 18 or age >= 60:
    print("Discount")
else:
    print("Full price")`],
    hints:['Membership is required; the age part is "either-or".','Put the either-or part in parentheses.','member and (age < 18 or age >= 60)','age = int(input("Age: "))\nmember = input("Member (yes/no): ") == "yes"\nif member and (age < 18 or age >= 60):\n    print("Discount")\nelse:\n    print("Full price")']},
  power:{can:['Predict how mixed conditions evaluate','Use parentheses to say exactly what you mean'],
    expand:'Write the rule for a free museum day: kids under 12 OR seniors 65+, but only on Sunday.',
    where:'Business rules (pricing, permissions, eligibility) are full of grouped conditions. This is where costly bugs hide.',
    next:'Next: Python treats empty things as False. Truthiness.'},
  codex:{title:'Grouping logic',body:'Order: not, then and, then or. Use parentheses to be explicit.',snip:R`if member and (age < 18 or age >= 60):`}
},
{
  id:'r2-09', realm:2, n:9, title:'Truthiness: empty means false',
  teaches:['truthiness'], requires:['parentheses-logic'],
  story:`A tiny door asks for no password at all. It only wants to know: *did you bring anything?* Ada nods. "Python counts nothing as **False** and something as **True**. Handy, once you know the rule."`,
  concept:{
    html:`In an \`if\`, Python doesn't need an exact True or False. It treats some values as **falsy** (count as False):\n\n- \`0\` and \`0.0\`\n- \`""\` (empty text)\n- \`None\` (coming soon)\n- empty collections (later realms)\n\nEverything else is **truthy**. So:\n\n\`if name:\` means "if name isn't empty".\n\nSee it directly with \`bool(value)\`.`,
    analogy:`An empty jar reads as "nothing here". Anything inside counts as "something".`,
    example:R`print(bool(""))
print(bool("Ada"))
print(bool(0))
print(bool(5))`},
  predict:{code:R`name = ""
if name:
    print("Hello " + name)
else:
    print("Nameless")`, q:'What prints?', opts:['Hello ','Nameless','Nothing'], ans:1,
    why:'An empty string is falsy, so the else branch runs.'},
  cast:{code:R`print(bool(""))
print(bool("Ada"))
print(bool(0))
print(bool(5))`, task:'Cast it. Add print(bool(" ")) - is a single space empty?'},
  bug:{broken:R`name = input("Name: ")
if name == True:
    print("Hello, " + name)
else:
    print("Hello, stranger")`, task:'Even with a real name it says stranger (text is never == True). Use truthiness instead.',
    cases:[{inputs:['Ada'],tests:[['Ada gets Hello, Ada','lines[-1]=="Hello, Ada"']]},{inputs:[''],tests:[['Empty gets Hello, stranger','lines[-1]=="Hello, stranger"']]}],
    sol:R`name = input("Name: ")
if name:
    print("Hello, " + name)
else:
    print("Hello, stranger")`, wrong:[R`name = input("Name: ")
if name == True:
    print("Hello, " + name)
else:
    print("Hello, stranger")`]},
  write:{prompt:'Ask for a quest name. If something was typed, print `Quest: ` followed by the name. If nothing was typed, print `No quest`. Use truthiness (no `==`).',
    starter:R`# truthiness, no ==
`,
    inputs:['Dragon'],
    cases:[{inputs:['Dragon'],tests:[['Dragon prints Quest: Dragon','lines[-1]=="Quest: Dragon"'],['No == or != used','"==" not in src and "!=" not in src']]},{inputs:[''],tests:[['Empty prints No quest','lines[-1]=="No quest"']]}],
    sol:R`quest = input("Quest: ")
if quest:
    print("Quest: " + quest)
else:
    print("No quest")`,
    wrong:[R`quest = input("Quest: ")
print("Quest: " + quest)`, R`quest = input("Quest: ")
if quest != "":
    print("Quest: " + quest)
else:
    print("No quest")`],
    hints:['An if on its own tests whether the text is non-empty.','if quest:','else: handles the empty case.','quest = input("Quest: ")\nif quest:\n    print("Quest: " + quest)\nelse:\n    print("No quest")']},
  power:{can:['Treat empty and zero as False in an if','Use bool() to check what Python thinks'],
    expand:'Ask for a nickname; if empty, fall back to the player name.',
    where:'"Was anything entered?" is the most common check in any form or tool. This idiom is everywhere in real Python.',
    next:'Next: check whether something is inside something else with in.'},
  codex:{title:'Truthiness',body:'0, empty text and None act as False in an if. Everything else acts as True.',snip:R`if name:
    print(name)`}
},
{
  id:'r2-10', realm:2, n:10, title:'in and not in',
  teaches:['membership'], requires:['truthiness'],
  story:`"Is the word *fire* hiding inside *firebolt*?" Ada asks the stone. It glows. "That question is so common Python gave it its own word: **in**."`,
  concept:{
    html:`\`in\` asks "is this piece inside that thing?" and returns a boolean.\n\n\`"fire" in "firebolt"\` is \`True\`.\n\`"ice" in "firebolt"\` is \`False\`.\n\n\`not in\` is the opposite. It is case-sensitive, and it also works with collections you'll meet in Realm 4.`,
    analogy:`Looking for a word inside a sentence with your finger.`,
    example:R`spell = "firebolt"
print("fire" in spell)
print("ice" not in spell)`},
  predict:{code:R`print("fire" in "firebolt")
print("Fire" in "firebolt")`, q:'What prints?', opts:['True then True','True then False','False then False'], ans:1,
    why:'"fire" is inside "firebolt". "Fire" with a capital F is different text, so False.'},
  cast:{code:R`word = "moonlight"
print("moon" in word)
print("sun" in word)
print("sun" not in word)`, task:'Cast it. Try other words.'},
  bug:{broken:R`spell = input("Spell: ")
if spell in "fire":
    print("Fire family")
else:
    print("Other")`, task:'It asks the question backwards. "firebolt" should print Fire family. Fix the order.',
    cases:[{inputs:['firebolt'],tests:[['firebolt is Fire family','lines[-1]=="Fire family"']]},{inputs:['icebolt'],tests:[['icebolt is Other','lines[-1]=="Other"']]}],
    sol:R`spell = input("Spell: ")
if "fire" in spell:
    print("Fire family")
else:
    print("Other")`, wrong:[R`spell = input("Spell: ")
if spell in "fire":
    print("Fire family")
else:
    print("Other")`]},
  write:{prompt:'Ask for one letter. Print `vowel` if it is inside `"aeiou"`, otherwise `consonant`.',
    starter:R`# use "in"
`,
    inputs:['e'],
    cases:[{inputs:['e'],tests:[['e is a vowel','lines[-1]=="vowel"']]},{inputs:['u'],tests:[['u is a vowel','lines[-1]=="vowel"']]},{inputs:['z'],tests:[['z is a consonant','lines[-1]=="consonant"']]}],
    sol:R`letter = input("Letter: ")
if letter in "aeiou":
    print("vowel")
else:
    print("consonant")`,
    wrong:[R`letter = input("Letter: ")
if letter == "a":
    print("vowel")
else:
    print("consonant")`, R`letter = input("Letter: ")
print("vowel")`],
    hints:['The letters to search live in the text "aeiou".','if letter in "aeiou":','else prints consonant.','letter = input("Letter: ")\nif letter in "aeiou":\n    print("vowel")\nelse:\n    print("consonant")']},
  power:{can:['Search for a piece of text inside another','Check one of several letters with one line'],
    expand:'Check if an email contains "@".',
    where:'Searching, filtering and validating text (email must contain @, a URL must contain https) rely on in.',
    next:'Next: comparing text safely: capitals and stray spaces.'},
  codex:{title:'in / not in',body:'"a" in text asks if a piece is inside. not in is the opposite. Case-sensitive.',snip:R`if "@" in email:
    print("Looks like an email")`}
},
{
  id:'r2-11', realm:2, n:11, title:'Comparing text safely: lower() and strip()',
  teaches:['text-compare'], requires:['membership'],
  story:`A player types "YES". Another types "yes ". A third types "Yes". To a human, all the same. To the gate: three different strangers. "Clean the input first," Ada says, handing you two tiny tools.`,
  concept:{
    html:`Text comparison is **exact**: \`"Yes" == "yes"\` is False, and so is \`"yes " == "yes"\` (a trailing space).\n\nTwo text tools (called **methods**, a dot after the value) fix that:\n\n- \`.lower()\` makes all letters lowercase\n- \`.strip()\` removes spaces at both ends\n\nChain them: \`answer.strip().lower() == "yes"\`. The original text is not changed; you get a cleaned copy.`,
    analogy:`A bouncer who first removes your hat and sunglasses before checking your face against the photo.`,
    example:R`answer = "  YES "
print(answer.strip().lower() == "yes")`},
  predict:{code:R`answer = "Yes"
print(answer == "yes")
print(answer.lower() == "yes")`, q:'What prints?', opts:['True then True','False then True','False then False'], ans:1,
    why:'"Yes" differs from "yes" until .lower() cleans it.'},
  cast:{code:R`answer = "  YES "
print(answer.strip().lower() == "yes")
print(answer == "yes")`, task:'Cast it. Try your own messy versions of "yes".'},
  bug:{broken:R`answer = input("Continue? ")
if answer == "yes":
    print("Onward")
else:
    print("Retreat")`, task:'Players typing "YES" or "Yes" are told to retreat. Make the check forgiving.',
    cases:[{inputs:['YES'],tests:[['YES continues','lines[-1]=="Onward"']]},{inputs:['yes'],tests:[['yes continues','lines[-1]=="Onward"']]},{inputs:['no'],tests:[['no retreats','lines[-1]=="Retreat"']]}],
    sol:R`answer = input("Continue? ")
if answer.lower() == "yes":
    print("Onward")
else:
    print("Retreat")`, wrong:[R`answer = input("Continue? ")
if answer == "yes":
    print("Onward")
else:
    print("Retreat")`, R`answer = input("Continue? ")
print("Onward")`]},
  write:{prompt:'Ask for the password. Accept `moonlight` in any capitalisation and with spaces around it: print `Access granted`. Anything else prints `Access denied`.',
    starter:R`# clean first, then compare
`,
    inputs:[' MoonLight '],
    cases:[{inputs:[' MoonLight '],tests:[['Messy moonlight is accepted','lines[-1]=="Access granted"']]},{inputs:['moonlight'],tests:[['Clean moonlight is accepted','lines[-1]=="Access granted"']]},{inputs:['sunlight'],tests:[['sunlight is denied','lines[-1]=="Access denied"']]}],
    sol:R`password = input("Password: ")
if password.strip().lower() == "moonlight":
    print("Access granted")
else:
    print("Access denied")`,
    wrong:[R`password = input("Password: ")
if password.lower() == "moonlight":
    print("Access granted")
else:
    print("Access denied")`, R`password = input("Password: ")
if password == "moonlight":
    print("Access granted")
else:
    print("Access denied")`],
    hints:['Use both .strip() and .lower() on the input.','password.strip().lower() == "moonlight"','Print one of the two messages.','password = input("Password: ")\nif password.strip().lower() == "moonlight":\n    print("Access granted")\nelse:\n    print("Access denied")']},
  power:{can:['Compare text without being fooled by capitals or spaces','Chain two methods'],
    expand:'Accept "y", "yes" and "YES " as agreement (hint: use in on a short text like "yes").',
    where:'Every real form cleans input first: emails, usernames, search boxes and commands.',
    next:'Next: a special value meaning "nothing here yet": None.'},
  codex:{title:'Cleaning text',body:'.lower() lowercases, .strip() trims spaces. Clean before you compare.',snip:R`answer.strip().lower() == "yes"`}
}
);
