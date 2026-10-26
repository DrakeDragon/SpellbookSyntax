// REALM 1 — CANTRIPS: VALUES & VARIABLES (24 lessons)
LESSONS.push(
{
  id:'r1-01', realm:1, n:1, title:'Variables: labeled jars',
  teaches:['variables'], requires:['calc','strings','print'],
  story:`The lantern burns steady. Sudo hops onto a shelf of jars. "Spells forget everything the moment they finish," he says. "Unless you *store* things. A **variable** is a jar with a label. Put a value in, take it out later."`,
  concept:{
    html:`A **variable** stores a value under a name:\n\n\`mana = 50\`\n\nThe \`=\` sign here means **store**, not "equals". The name goes on the left, the value on the right.\n\nLater, \`print(mana)\` shows \`50\`. No quotes around the name: quotes would print the word itself.`,
    analogy:`A jar with a label. The label is the variable name; what's inside is the value.`,
    example:R`mana = 50
print(mana)`},
  predict:{code:R`mana = 50
print(mana)`, q:'What prints?', opts:['mana','50','Nothing'], ans:1,
    why:'print(mana) looks inside the jar named mana and shows its value, 50.'},
  cast:{code:R`hero = "Ember"
print(hero)`, task:'Cast it. Change the name stored in hero and cast again.'},
  bug:{broken:R`mana = 50
print("mana")`, task:'Sudo wants the **value** of mana (50) printed, not the word. Fix it.',
    cases:[{inputs:[],tests:[['Prints 50','out.strip()=="50"']]}],
    sol:R`mana = 50
print(mana)`, wrong:[R`mana = 50
print("mana")`]},
  write:{prompt:'Create a variable called `spell` holding the text `Fireball`, then print it.',
    starter:R`# make the variable, then print it
`,
    cases:[{inputs:[],tests:[['Variable spell is "Fireball"','g.get("spell")=="Fireball"'],['Prints Fireball','lines==["Fireball"]']]}],
    sol:R`spell = "Fireball"
print(spell)`,
    wrong:[R`print("Fireball")`],
    hints:['A variable is made with name = value.','The value is text, so it needs quotes. The name does not.','spell = "..."\nprint(...)','spell = "Fireball"\nprint(spell)']},
  power:{can:['Store a value and reuse it','Read a program that uses variables'],
    expand:'Store your name, favorite color and age in three variables and print each.',
    where:'Every program stores things: scores, names, prices, settings. Variables are the backbone of code.',
    next:'Next: rules for naming your jars.'},
  codex:{title:'Variables',body:'name = value stores a value. print(name) shows it. No quotes around the variable name.',snip:R`mana = 50
print(mana)`}
},
{
  id:'r1-02', realm:1, n:2, title:'Naming rules and snake_case',
  teaches:['naming'], requires:['variables'],
  story:`"Jar labels," says Sudo, "must follow the Academy rules. No spaces, no starting with a number. And please, for the love of all things shiny, make them *readable*."`,
  concept:{
    html:`Variable names can use **letters, digits and underscores**, but:\n- no spaces\n- can't start with a digit\n- are case-sensitive (\`Gold\` and \`gold\` differ)\n\nThe Python style is **snake_case**: lowercase words joined with underscores, like \`player_name\`.\n\nPick names that explain themselves. \`gold_coins\` beats \`g\`.`,
    analogy:`Like file names: no spaces, readable, and you can find them later.`,
    example:R`player_name = "Mira"
player_level = 1
print(player_name)
print(player_level)`},
  predict:{code:'', q:'Which of these is a valid variable name?', opts:['2fast','fire_ball','fire ball'], ans:1,
    why:'Names cannot start with a digit or contain spaces. fire_ball is valid snake_case.'},
  cast:{code:R`player_name = "Mira"
player_level = 1
print(player_name)
print(player_level)`, task:'Cast it. Then rename the variables to something else (keep valid names).'},
  bug:{broken:R`1st_spell = "Spark"
print(1st_spell)`, task:'This name breaks a naming rule. Rename it so the spell prints `Spark`.',
    cases:[{inputs:[],tests:[['Prints Spark','out.strip()=="Spark"']]}],
    sol:R`first_spell = "Spark"
print(first_spell)`, wrong:[R`1st_spell = "Spark"
print(1st_spell)`]},
  write:{prompt:'Create `player_name` = `Mira` and `player_level` = `1`. Print both, name first, each on its own line.',
    starter:R`# two variables, two prints
`,
    cases:[{inputs:[],tests:[['player_name is Mira','g.get("player_name")=="Mira"'],['player_level is 1','g.get("player_level")==1'],['Prints Mira then 1','lines==["Mira","1"]']]}],
    sol:R`player_name = "Mira"
player_level = 1
print(player_name)
print(player_level)`,
    wrong:[R`name = "Mira"
level = 1
print(name)
print(level)`],
    hints:['Use the exact variable names shown.','The name is text (quotes). The level is a number (no quotes).','player_name = "Mira"\nplayer_level = ...','player_name = "Mira"\nplayer_level = 1\nprint(player_name)\nprint(player_level)']},
  power:{can:['Name variables clearly and correctly','Spot invalid names instantly'],
    expand:'Rename every variable in an old spell to a clearer name.',
    where:'Good names are the number one thing separating readable code from a mess. Teams enforce this.',
    next:'Next: changing the value inside a jar.'},
  codex:{title:'Naming & snake_case',body:'Letters, digits, underscores. No spaces; can\'t start with a digit. Use readable snake_case.',snip:R`player_name = "Mira"`}
},
{
  id:'r1-03', realm:1, n:3, title:'Changing a variable',
  teaches:['reassign'], requires:['variables'],
  story:`"Jars aren't permanent," says Sudo, dumping one out. "You can replace what's inside. Better: you can use the *old* value to work out the *new* one. That's how health bars go down."`,
  concept:{
    html:`You can **reassign** a variable by storing a new value:\n\n\`hp = 10\` then \`hp = 7\` leaves 7 in the jar.\n\nThe cool part: the right side can use the old value:\n\n\`hp = hp - 3\` means "take hp, subtract 3, store the result back in hp."\n\nPython does the right side first, then stores it.`,
    analogy:`Taking money out of a wallet and putting the smaller amount back.`,
    example:R`gold = 100
gold = gold - 30
print(gold)`},
  predict:{code:R`hp = 10
hp = 7
print(hp)`, q:'What prints?', opts:['10','7','17'], ans:1,
    why:'The second assignment replaces the first. The jar now holds 7.'},
  cast:{code:R`gold = 100
gold = gold - 30
print(gold)`, task:'Cast it. Then spend another 20 gold and print again.'},
  bug:{broken:R`hp = 20
hp - 5
print(hp)`, task:'Sudo wants hp reduced by 5 so it prints 15. The subtraction is not being stored. Fix it.',
    cases:[{inputs:[],tests:[['Prints 15','out.strip()=="15"']]}],
    sol:R`hp = 20
hp = hp - 5
print(hp)`, wrong:[R`hp = 20
hp - 5
print(hp)`]},
  write:{prompt:'Start with `gold = 100`. Spend 30 gold by reassigning `gold`. Print gold.',
    starter:R`gold = 100
`,
    cases:[{inputs:[],tests:[['gold ends up 70','g.get("gold")==70'],['Prints 70','lines==["70"]'],['Uses gold itself to calculate','"gold - 30" in src.replace("  "," ")  or "gold-30" in src']]}],
    sol:R`gold = 100
gold = gold - 30
print(gold)`,
    wrong:[R`gold = 100
gold = 70
print(gold)`],
    hints:['Use the old value of gold to compute the new one.','gold = gold - 30','gold = gold - ...\nprint(...)','gold = 100\ngold = gold - 30\nprint(gold)']},
  power:{can:['Update a value as a program runs','Model things that change: health, score, balance'],
    expand:'Simulate a day of spending: start with money and subtract three purchases.',
    where:'Counters, balances, scores and inventories all rely on updating a variable from its old value.',
    next:'Next: the two kinds of numbers.'},
  codex:{title:'Reassigning',body:'Storing again replaces the old value. x = x - 3 uses the old value to build the new one.',snip:R`hp = hp - 3`}
},
{
  id:'r1-04', realm:1, n:4, title:'Integers and floats',
  teaches:['numbers'], requires:['reassign'],
  story:`"Numbers come in two flavors," says Sudo, "like potions: whole and fizzy. **Integers** are whole. **Floats** have a decimal point. Python treats them differently, so keep an eye on the dot."`,
  concept:{
    html:`Python has two main number types:\n- **int**: whole numbers like \`7\`, \`-3\`, \`1000\`\n- **float**: numbers with a decimal point like \`7.0\`, \`3.14\`, \`-0.5\`\n\nA decimal point makes it a float, even \`7.0\`.\n\nUse ints for counting things (lives, items). Use floats for measuring (prices, distances).`,
    analogy:`Counting apples (whole) versus weighing flour (decimal).`,
    example:R`lives = 3
price = 4.5
print(lives)
print(price)`},
  predict:{code:R`print(7)
print(7.0)`, q:'What prints?', opts:['7 and 7','7 and 7.0','7.0 and 7.0'], ans:1,
    why:'7 is an int and prints as 7. 7.0 is a float and keeps its decimal.'},
  cast:{code:R`lives = 3
price = 4.5
print(lives)
print(price)
print(lives * price)`, task:'Cast it. Then change lives to 5.'},
  write:{prompt:'Store `price = 4.5` and `count = 3`. Print the total cost (price times count).',
    starter:R`# store both, then print the total
`,
    cases:[{inputs:[],tests:[['price is 4.5','g.get("price")==4.5'],['count is 3','g.get("count")==3'],['Prints 13.5','lines==["13.5"]']]}],
    sol:R`price = 4.5
count = 3
print(price * count)`,
    wrong:[R`price = 4.5
count = 3
print(price + count)`],
    hints:['Two variables first, then one print.','Multiply with *.','price = 4.5\ncount = 3\nprint(...)','price = 4.5\ncount = 3\nprint(price * count)']},
  power:{can:['Choose between whole numbers and decimals','Do math with mixed number types'],
    expand:'Store the price and quantity of three items and print each line total.',
    where:'Prices, measurements and scores all use these types in every real program.',
    next:'Next: all four arithmetic operations, including division.'},
  codex:{title:'int vs float',body:'int = whole number. float = has a decimal point (even 7.0). Counting uses int, measuring uses float.',snip:R`lives = 3
price = 4.5`}
},
{
  id:'r1-05', realm:1, n:5, title:'Add, subtract, multiply, divide',
  teaches:['arith'], requires:['numbers'],
  story:`"Time for the fourth operation," says Sudo. "Division. It has one quirk, and the Academy exam *loves* it: division **always** gives a float. Always. Even when it divides evenly."`,
  concept:{
    html:`The four basics: \`+\` add, \`-\` subtract, \`*\` multiply, \`/\` divide.\n\nThe quirk: **\`/\` always returns a float**. So \`10 / 2\` is \`5.0\`, not \`5\`.\n\nYou can use variables in any calculation: \`total = a + b\`.`,
    analogy:`Division is a measuring jug: even if it comes out whole, it reports in decimals.`,
    example:R`print(10 / 2)
print(7 / 2)`},
  predict:{code:R`print(10 / 2)`, q:'What prints?', opts:['5','5.0','2'], ans:1,
    why:'Division with / always gives a float, so 10 / 2 prints 5.0.'},
  cast:{code:R`a = 12
b = 5
print(a + b)
print(a - b)
print(a * b)
print(a / b)`, task:'Cast it. Change a and b and predict each answer first.'},
  bug:{broken:R`print(5 * 2)`, task:'Sudo wants `5 divided by 2` to print 2.5. Fix the operator.',
    cases:[{inputs:[],tests:[['Prints 2.5','out.strip()=="2.5"']]}],
    sol:R`print(5 / 2)`, wrong:[R`print(5 * 2)`]},
  write:{prompt:'Store `a = 80`, `b = 90`, `c = 100`. Store their average in `avg` and print it.',
    starter:R`# store a, b, c, then avg
`,
    cases:[{inputs:[],tests:[['avg is 90.0','g.get("avg")==90.0'],['Prints 90.0','lines==["90.0"]']]}],
    sol:R`a = 80
b = 90
c = 100
avg = (a + b + c) / 3
print(avg)`,
    wrong:[R`a = 80
b = 90
c = 100
avg = a + b + c / 3
print(avg)`],
    hints:['Add all three, then divide by 3.','Wrap the sum in parentheses before dividing.','avg = (a + b + c) / ...','avg = (a + b + c) / 3']},
  power:{can:['Do any basic arithmetic in a program','Remember that division returns a float'],
    expand:'Compute the average of five test scores.',
    where:'Averages, rates and percentages are the bread and butter of data work.',
    next:'Next: the two handy division cousins, // and %.'},
  codex:{title:'Arithmetic',body:'+ - * / do math. Division / always gives a float (10 / 2 is 5.0). Use parentheses to group.',snip:R`avg = (a + b + c) / 3`}
},
{
  id:'r1-06', realm:1, n:6, title:'Whole division and remainders: // and %',
  teaches:['divmod'], requires:['arith'],
  story:`"Dividing treasure among adventurers," Sudo sighs. "You can't give someone 2.4 swords. You need to know how many *whole* each gets, and what's *left over*. Meet two operators the sword-sharers love."`,
  concept:{
    html:`Two more operators:\n- \`//\` **floor division**: how many whole times it fits. \`17 // 5\` is \`3\`.\n- \`%\` **remainder** (modulo): what is left over. \`17 % 5\` is \`2\`.\n\nThink: 17 sweets shared among 5 kids is 3 each, with 2 left over.\n\nA classic use: turning minutes into hours and minutes.`,
    analogy:`Dealing cards to players: \`//\` is cards per player, \`%\` is cards left in the deck.`,
    example:R`print(17 // 5)
print(17 % 5)`},
  predict:{code:R`print(17 // 5)
print(17 % 5)`, q:'What prints?', opts:['3 and 2','3.4 and 2','2 and 3'], ans:0,
    why:'17 holds 5 whole three times (//), with 2 left over (%).'},
  cast:{code:R`total_minutes = 135
print(total_minutes // 60)
print(total_minutes % 60)`, task:'Cast it. What do the two numbers mean? Try 200 minutes.'},
  bug:{broken:R`print(17 // 5)`, task:'Sudo wants the **remainder** of 17 shared among 5 (the answer is 2). Fix it.',
    cases:[{inputs:[],tests:[['Prints 2','out.strip()=="2"']]}],
    sol:R`print(17 % 5)`, wrong:[R`print(17 // 5)`]},
  write:{prompt:'`total_minutes = 135` is set. Print the whole hours, then the leftover minutes (two lines). Use `//` and `%`.',
    starter:R`total_minutes = 135
`,
    cases:[{inputs:[],tests:[['Prints 2 then 15','lines==["2","15"]'],['Uses // and %','"//" in src and "%" in src']]}],
    sol:R`total_minutes = 135
print(total_minutes // 60)
print(total_minutes % 60)`,
    wrong:[R`total_minutes = 135
print(2)
print(15)`],
    hints:['Hours are whole 60s. Leftover is the remainder.','// 60 for hours, % 60 for minutes.','print(total_minutes // 60)\nprint(...)','print(total_minutes // 60)\nprint(total_minutes % 60)']},
  power:{can:['Split quantities into whole parts and leftovers','Convert minutes to hours and minutes'],
    expand:'Convert 100000 seconds into days, hours, minutes and seconds.',
    where:'Time, money, pagination and even checking if a number is even (n % 2) all use these.',
    next:'Next: powers and which operation goes first.'},
  codex:{title:'// and %',body:'// is how many whole times; % is what is left. 17 // 5 is 3, 17 % 5 is 2.',snip:R`print(135 // 60)
print(135 % 60)`}
},
{
  id:'r1-07', realm:1, n:7, title:'Powers and order of operations',
  teaches:['power-order'], requires:['divmod'],
  story:`"Which goes first?" Sudo scribbles on a chalkboard. "2 plus 3 times 4. Python has *opinions* here, the same ones your old math teacher had. And if you disagree, you use brackets."`,
  concept:{
    html:`\`**\` means **power**: \`2 ** 3\` is 8 (2 × 2 × 2).\n\n**Order of operations** (like school maths):\n1. parentheses \`( )\`\n2. powers \`**\`\n3. \`*  /  //  %\`\n4. \`+  -\`\n\nSo \`2 + 3 * 4\` is \`14\`, not \`20\`. Use parentheses to force your own order: \`(2 + 3) * 4\` is \`20\`.`,
    analogy:`Parentheses are VIP lanes: whatever is inside gets calculated first.`,
    example:R`print(2 + 3 * 4)
print((2 + 3) * 4)
print(2 ** 3)`},
  predict:{code:R`print(2 + 3 * 4)`, q:'What prints?', opts:['20','14','24'], ans:1,
    why:'Multiplication happens before addition: 3 * 4 = 12, then 2 + 12 = 14.'},
  cast:{code:R`print(2 + 3 * 4)
print((2 + 3) * 4)
print(2 ** 3)`, task:'Cast it. Then predict `(1 + 2) ** 3` before running it.'},
  bug:{broken:R`print(10 - 2 * 3)`, task:'Sudo wants `10 minus 2`, **then** times 3 (the answer is 24). Add parentheses.',
    cases:[{inputs:[],tests:[['Prints 24','out.strip()=="24"'],['Uses parentheses','"(" in src.replace("print(","")']]}],
    sol:R`print((10 - 2) * 3)`, wrong:[R`print(10 - 2 * 3)`]},
  write:{prompt:'Print the result of `(8 + 4) * 2 ** 3` using that exact structure (parentheses and a power).',
    starter:R`# calculate it, don't type the answer
`,
    cases:[{inputs:[],tests:[['Prints 96','out.strip()=="96"'],['Uses ** and parentheses','"**" in src and src.count("(")>=2']]}],
    sol:R`print((8 + 4) * 2 ** 3)`,
    wrong:[R`print(96)`],
    hints:['Power first, then multiply the bracket result.','print((8 + 4) * ...)','print((8 + 4) * 2 ...)','print((8 + 4) * 2 ** 3)']},
  power:{can:['Predict how Python evaluates a calculation','Force the order you want with parentheses'],
    expand:'Write a compound-interest style calculation using ** and check it by hand.',
    where:'Formulas in finance, physics and games depend on the right order of operations.',
    next:'Next: shorter ways to update variables.'},
  codex:{title:'Order & powers',body:'** is power. Order: parentheses, powers, * / // %, then + -. Use parentheses to control it.',snip:R`print((2 + 3) * 4)
print(2 ** 3)`}
},
{
  id:'r1-08', realm:1, n:8, title:'Shortcuts: +=, -=, *=',
  teaches:['augassign'], requires:['reassign','power-order'],
  story:`"You keep writing the variable name twice," Sudo notes, unimpressed. "Wizards are lazy. Lazy is good. There's a shortcut."`,
  concept:{
    html:`Instead of \`score = score + 3\` you can write \`score += 3\`.\n\nThe same trick works for the other operators:\n- \`+=\` add\n- \`-=\` subtract\n- \`*=\` multiply\n- \`/=\` divide\n\nShorter, clearer, and everyone in the industry uses it.`,
    analogy:`"Add 3 to my score" versus "set my score to my score plus 3". Same thing, shorter sentence.`,
    example:R`score = 5
score += 3
score *= 2
print(score)`},
  predict:{code:R`score = 5
score += 3
score *= 2
print(score)`, q:'What prints?', opts:['16','13','11'], ans:0,
    why:'5 + 3 = 8, then 8 * 2 = 16.'},
  cast:{code:R`score = 5
score += 3
score *= 2
print(score)`, task:'Cast it. Then add a -= line.'},
  bug:{broken:R`xp = 40
xp =+ 10
print(xp)`, task:'Sudo wants xp to go up by 10 (it should print 50). The operator is backwards. Fix it.',
    cases:[{inputs:[],tests:[['Prints 50','out.strip()=="50"']]}],
    sol:R`xp = 40
xp += 10
print(xp)`, wrong:[R`xp = 40
xp =+ 10
print(xp)`]},
  write:{prompt:'Start with `mana = 100`. Use `-=` to spend 35, then `+=` to regain 10. Print mana.',
    starter:R`mana = 100
`,
    cases:[{inputs:[],tests:[['Prints 75','lines==["75"]'],['Uses -= and +=','"-=" in src and "+=" in src']]}],
    sol:R`mana = 100
mana -= 35
mana += 10
print(mana)`,
    wrong:[R`mana = 100
mana = 75
print(mana)`],
    hints:['Two shortcut lines, one for spending, one for regaining.','mana -= 35','mana -= 35\nmana += ...','mana = 100\nmana -= 35\nmana += 10\nprint(mana)']},
  power:{can:['Update variables with the standard shortcuts','Read other people\'s += code'],
    expand:'Simulate a shop: start with gold, buy two items and sell one.',
    where:'Counters and running totals use += in nearly every real program.',
    next:'Next: asking Python what type something is.'},
  codex:{title:'Shortcuts',body:'x += 3 is x = x + 3. Also -=, *=, /=.',snip:R`score += 3`}
},
{
  id:'r1-09', realm:1, n:9, title:'type() and the type zoo',
  teaches:['types'], requires:['numbers','strings'],
  story:`"Everything in Python has a **type**," Sudo says, unrolling a chart of creatures. "Whole numbers, decimals, text. Mixing them up is the *number one* cause of bugs in the realm. So learn to ask: *what are you?*"`,
  concept:{
    html:`Every value has a **type**. So far:\n- \`int\` whole numbers\n- \`float\` decimals\n- \`str\` text (string)\n\n\`type(x)\` tells you what a value is. \`type(5)\` shows \`<class 'int'>\`, \`type("5")\` shows \`<class 'str'>\`.\n\nNotice: \`5\` and \`"5"\` are **different things**. One is a number, the other is text.`,
    analogy:`Every item in a shop has a department label: food, tools, toys. Type is the label.`,
    example:R`print(type(5))
print(type(5.0))
print(type("5"))`},
  predict:{code:R`print(type("5"))`, q:'What prints?', opts:["<class 'int'>","<class 'str'>","<class 'float'>"], ans:1,
    why:'"5" is in quotes, so it is a string of text, not a number.'},
  cast:{code:R`print(type(5))
print(type(5.0))
print(type("5"))`, task:'Cast it. Try type() on your own values.'},
  write:{prompt:'Store `a = 7`, `b = 7.0`, `c = "7"`. Print the type of each (three lines, in order a, b, c).',
    starter:R`# store three values, then print their types
`,
    cases:[{inputs:[],tests:[['Prints int, float, str types','lines==["<class \'int\'>","<class \'float\'>","<class \'str\'>"]'],['Uses type()','"type(" in src']]}],
    sol:R`a = 7
b = 7.0
c = "7"
print(type(a))
print(type(b))
print(type(c))`,
    wrong:[R`a = 7
b = 7
c = 7
print(type(a))
print(type(b))
print(type(c))`],
    hints:['Three variables, three prints.','7 is int; 7.0 is float; "7" is str.','a = 7\nb = 7.0\nc = ...','a = 7\nb = 7.0\nc = "7"\nprint(type(a))\nprint(type(b))\nprint(type(c))']},
  power:{can:['Identify what kind of value you are working with','Spot number-versus-text confusion'],
    expand:'Check the type of 3 / 1, 3 // 1, and "3" + "1". Predict first.',
    where:'Checking types is the first debugging step for a huge number of real-world bugs.',
    next:'Next: converting between types on purpose.'},
  codex:{title:'type()',body:'Every value has a type: int, float, str. type(x) tells you. 5 and "5" are different.',snip:R`print(type("5"))`}
},
{
  id:'r1-10', realm:1, n:10, title:'Converting: int(), float(), str()',
  teaches:['convert'], requires:['types'],
  story:`"Types don't mix by magic," Sudo warns. "Adding text to a number gets you a **TypeError**, the book's way of saying 'I refuse'. The fix? Convert. Politely turn one into the other."`,
  concept:{
    html:`Convert between types on purpose:\n- \`int("12")\` turns text into a whole number (12)\n- \`float("3.5")\` turns text into a decimal (3.5)\n- \`str(12)\` turns a number into text ("12")\n\nWithout converting, \`"12" + 1\` crashes with a **TypeError**: Python won't guess whether you meant math or joining.`,
    analogy:`A currency exchange desk: you can't spend dollars in a euro shop until you convert.`,
    example:R`print(int("12") + 3)
print(float("3.5") + 1)
print(str(12) + "!")`},
  predict:{code:R`print(int("12") + 3)`, q:'What prints?', opts:['123','15','TypeError'], ans:1,
    why:'int("12") becomes the number 12, so 12 + 3 is 15.'},
  cast:{code:R`print(int("12") + 3)
print(float("3.5") + 1)
print(str(12) + "!")`, task:'Cast it. Change the numbers and see what happens.'},
  bug:{broken:R`age = "12"
print(age + 1)`, task:'This crashes with a TypeError. Convert so it prints 13.',
    cases:[{inputs:[],tests:[['Prints 13','out.strip()=="13"']]}],
    sol:R`age = "12"
print(int(age) + 1)`, wrong:[R`age = "12"
print(age + 1)`]},
  write:{prompt:'`text = "40"` and `bonus = 2` are set. Print `text` converted to a number, times `bonus`.',
    starter:R`text = "40"
bonus = 2
`,
    cases:[{inputs:[],tests:[['Prints 80','lines==["80"]'],['Uses int()','re.search(r"\\bint\\(",src)']]}],
    sol:R`text = "40"
bonus = 2
print(int(text) * bonus)`,
    wrong:[R`text = "40"
bonus = 2
print(text * bonus)`],
    hints:['Convert the text first, then multiply.','int(text) * bonus','print(int(...) * ...)','print(int(text) * bonus)']},
  power:{can:['Convert text to numbers and back','Fix the most common TypeError'],
    expand:'Convert "3.75" to a float and "8" to an int, then add them.',
    where:'Data from files, forms and the web arrives as text. Converting it is daily work.',
    next:'Next: joining text together and repeating it.'},
  codex:{title:'Converting types',body:'int("12") text to whole number, float("3.5") text to decimal, str(12) number to text.',snip:R`print(int("12") + 3)`}
},
{
  id:'r1-11', realm:1, n:11, title:'Joining and repeating text',
  teaches:['concat'], requires:['convert'],
  story:`"Strings can do arithmetic too," says Sudo, "but only a *polite* kind. Add two strings and they stick together. Multiply one by a number and it repeats. Mix a string and a number? Back to the converter."`,
  concept:{
    html:`With strings:\n- \`+\` **joins** them: \`"Fire" + "ball"\` is \`Fireball\`\n- \`*\` **repeats** them: \`"Ha" * 3\` is \`HaHaHa\`\n\nBut you cannot join text and a number directly. \`"Level " + 5\` is a TypeError. Convert first: \`"Level " + str(5)\`.`,
    analogy:`Gluing words together, or using a photocopier for the same word.`,
    example:R`print("Fire" + "ball")
print("Ha" * 3)`},
  predict:{code:R`print("Fire" + "ball")
print("Ha" * 3)`, q:'What prints?', opts:['Fireball and HaHaHa','Fire ball and Ha 3','Error'], ans:0,
    why:'+ glues strings with no space. * repeats a string.'},
  cast:{code:R`print("Fire" + "ball")
print("Ha" * 3)
print("Level " + str(5))`, task:'Cast it. Then make a line of 30 dashes.'},
  bug:{broken:R`level = 5
print("Level " + level)`, task:'TypeError! Fix it so it prints `Level 5`.',
    cases:[{inputs:[],tests:[['Prints Level 5','out.strip()=="Level 5"']]}],
    sol:R`level = 5
print("Level " + str(level))`, wrong:[R`level = 5
print("Level " + level)`]},
  write:{prompt:'Print a banner: a line of 20 `=` characters, a line `SPELLBOOK`, and another line of 20 `=` characters. Make the lines using repetition.',
    starter:R`# use * to repeat the =
`,
    cases:[{inputs:[],tests:[['Prints 20 =, SPELLBOOK, 20 =','lines==["="*20,"SPELLBOOK","="*20]'],['Uses * to repeat','"*" in src']]}],
    sol:R`print("=" * 20)
print("SPELLBOOK")
print("=" * 20)`,
    wrong:[R`print("====================")
print("SPELLBOOK")
print("====================")`],
    hints:['Repeat = twenty times using *.','print("=" * 20)','print("=" * 20)\nprint(...)','print("=" * 20)\nprint("SPELLBOOK")\nprint("=" * 20)']},
  power:{can:['Build text from pieces','Draw simple banners and dividers'],
    expand:'Build a simple text-based health bar like [#####-----] using repetition.',
    where:'Reports, logs and UIs all assemble text from parts.',
    next:'Next: an even nicer way to mix text and values, f-strings.'},
  codex:{title:'Join & repeat',body:'+ joins strings, * repeats. You cannot add a number to text without str().',snip:R`print("=" * 20)`}
},
{
  id:'r1-12', realm:1, n:12, title:'f-strings: spell text with blanks',
  teaches:['fstring'], requires:['concat','variables'],
  story:`"Joining and converting is clunky," Sudo admits. "So the mages invented a shortcut: write the sentence, and leave *blanks*. Put the jar names in curly brackets. Python fills them in."`,
  concept:{
    html:`An **f-string** puts values into text. Put an \`f\` before the opening quote, and variable names in \`{ }\`:\n\n\`name = "Mira"\`\n\`print(f"Hello, {name}!")\` prints \`Hello, Mira!\`\n\nNo \`str()\` needed. You can put whole calculations in the braces too: \`{hp * 2}\`.\n\nForget the \`f\` and Python prints the curly brackets literally.`,
    analogy:`A mail-merge letter: "Dear {name}" gets filled for each person.`,
    example:R`name = "Mira"
level = 3
print(f"{name} is level {level}")`},
  predict:{code:R`name = "Mira"
level = 3
print(f"{name} is level {level}")`, q:'What prints?', opts:['Mira is level 3','{name} is level {level}','name is level level'], ans:0,
    why:'The f in front makes Python fill in the values inside the curly brackets.'},
  cast:{code:R`name = "Mira"
level = 3
print(f"{name} is level {level}")`, task:'Cast it. Add a {level * 10} to the sentence.'},
  bug:{broken:R`name = "Mira"
print("Hello, {name}!")`, task:'It prints the curly brackets. Fix it so it prints `Hello, Mira!`.',
    cases:[{inputs:[],tests:[['Prints Hello, Mira!','out.strip()=="Hello, Mira!"']]}],
    sol:R`name = "Mira"
print(f"Hello, {name}!")`, wrong:[R`name = "Mira"
print("Hello, {name}!")`]},
  write:{prompt:'`hero = "Ember"` and `hp = 42` are set. Use an f-string to print: `Ember has 42 HP`.',
    starter:R`hero = "Ember"
hp = 42
`,
    cases:[{inputs:[],tests:[['Prints Ember has 42 HP','out.strip()=="Ember has 42 HP"'],['Uses an f-string','"f\\"" in src or "f\'" in src'],['Uses {hero} and {hp}','"{hero}" in src and "{hp}" in src']]}],
    sol:R`hero = "Ember"
hp = 42
print(f"{hero} has {hp} HP")`,
    wrong:[R`hero = "Ember"
hp = 42
print("Ember has 42 HP")`],
    hints:['Put an f before the opening quote.','Variable names go inside { }.','print(f"{hero} has ...")','print(f"{hero} has {hp} HP")']},
  power:{can:['Insert any value into a sentence','Produce receipts, labels and messages'],
    expand:'Print a receipt line: item, price and quantity, all from variables.',
    where:'f-strings are the standard way professionals build messages and logs in Python.',
    next:'Next: letting the player type something in.'},
  codex:{title:'f-strings',body:'f"Hello {name}" fills in variables. Put f before the quote and names in { }.',snip:R`print(f"{name} is level {level}")`}
},
{
  id:'r1-13', realm:1, n:13, title:'input(): asking questions',
  teaches:['input'], requires:['fstring'],
  story:`"Time your spells *listened*," Sudo says. "So far you've talked *at* the book. **input()** lets the player talk *back*. Their answer lands in a variable, ready to use."`,
  concept:{
    html:`\`input("question")\` shows the question, **waits** for the player to type, and gives back what they typed.\n\n\`name = input("Hero name: ")\`\n\nSave the answer in a variable so you can use it. In this game, type the answers into the **Inputs** box, one per line. Each \`input()\` uses the next line.`,
    analogy:`A shopkeeper asking "What can I get you?" and writing down your reply.`,
    example:R`name = input("Hero name: ")
print("Welcome,", name)`},
  predict:{code:R`name = input("Name your hero: ")
print("Welcome,", name)`, inputs:['Ada'], q:'The player types Ada. What is the LAST line printed?',
    opts:['Welcome, Ada','Welcome, name','Welcome,'], ans:0,
    why:'The answer Ada is stored in name, and print shows it.'},
  cast:{code:R`name = input("Name your hero: ")
print("Welcome,", name)`, inputs:['Ada'], task:'Cast it. Change the Inputs box to a different name and cast again.'},
  bug:{broken:R`name = input("Name: ")
print("Hail, name!")`, task:'It prints the word name. Fix it so it prints `Hail, ` plus the actual name.',
    cases:[{inputs:['Mira'],tests:[['Prints Hail, Mira!','lines[-1]=="Hail, Mira!"']]},{inputs:['Zed'],tests:[['Prints Hail, Zed!','lines[-1]=="Hail, Zed!"']]}],
    sol:R`name = input("Name: ")
print(f"Hail, {name}!")`, wrong:[R`name = input("Name: ")
print("Hail, name!")`], inputs:['Mira']},
  write:{prompt:'Ask for a hero name with `input()`, then print `Hail, ` followed by the name and `!`.',
    starter:R`# ask, then greet
`,
    inputs:['Mira'],
    cases:[{inputs:['Mira'],tests:[['Greets Mira','lines[-1]=="Hail, Mira!"']]},{inputs:['Ember'],tests:[['Greets Ember','lines[-1]=="Hail, Ember!"'],['Uses input()','"input(" in src']]}],
    sol:R`name = input("Hero name: ")
print(f"Hail, {name}!")`,
    wrong:[R`print("Hail, Mira!")`],
    hints:['Store the answer from input() in a variable.','Then print with an f-string using that variable.','name = input("...")\nprint(f"Hail, ...")','name = input("Hero name: ")\nprint(f"Hail, {name}!")']},
  power:{can:['Make interactive programs','Use what the user types'],
    expand:'Ask for two things (name and favorite spell) and print a sentence with both.',
    where:'Every form, command line tool and chatbot starts with taking input.',
    next:'Next: the trap in input(). It always gives back text.'},
  codex:{title:'input()',body:'input("question") waits for the player and returns their answer as text. Store it in a variable.',snip:R`name = input("Hero name: ")`}
},
{
  id:'r1-14', realm:1, n:14, title:'input() is always text',
  teaches:['input-text'], requires:['input','convert'],
  story:`"Here's the trap that has eaten a thousand apprentices," says Sudo gravely. "Whatever the player types, even *42*, arrives as **text**. Not a number. Text. Convert it or suffer."`,
  concept:{
    html:`\`input()\` **always** returns a string, even if the player types digits.\n\n\`n = input("Number: ")\` with \`5\` typed gives the *text* \`"5"\`.\n\nSo \`n + n\` is \`"55"\` (joined text), not \`10\`.\n\nTo do math, convert: \`n = int(input("Number: "))\`. Wrapping \`input\` inside \`int\` is the standard pattern.`,
    analogy:`Spoken numbers written on paper: "5" is just a symbol until you decide to count with it.`,
    example:R`n = int(input("Number: "))
print(n + n)`},
  predict:{code:R`n = input("Number: ")
print(n + n)`, inputs:['5'], q:'The player types 5. What is the LAST line printed?', opts:['10','55','Error'], ans:1,
    why:'input() gives the text "5". Adding text to text joins it: "55".'},
  cast:{code:R`n = int(input("Number: "))
print(n + n)`, inputs:['5'], task:'Cast it. Then remove int(...) and see the difference.'},
  bug:{broken:R`age = input("Age: ")
print("Next year:", age + 1)`, task:'TypeError! Fix it so it prints `Next year: 13` when the player types 12.',
    cases:[{inputs:['12'],tests:[['Prints Next year: 13','lines[-1]=="Next year: 13"']]},{inputs:['40'],tests:[['Prints Next year: 41','lines[-1]=="Next year: 41"']]}],
    sol:R`age = int(input("Age: "))
print("Next year:", age + 1)`, wrong:[R`age = input("Age: ")
print("Next year:", age + 1)`], inputs:['12']},
  write:{prompt:'Ask for the player\'s age, then print `Next year you will be ` followed by their age plus one.',
    starter:R`# ask, convert, add one
`,
    inputs:['12'],
    cases:[{inputs:['12'],tests:[['Works for 12','lines[-1]=="Next year you will be 13"']]},{inputs:['40'],tests:[['Works for 40','lines[-1]=="Next year you will be 41"'],['Uses int()','re.search(r"\\bint\\(",src)']]}],
    sol:R`age = int(input("Age: "))
print(f"Next year you will be {age + 1}")`,
    wrong:[R`age = input("Age: ")
print(f"Next year you will be {age}1")`],
    hints:['Convert the answer to an int.','int(input(...))','age = int(input("Age: "))\nprint(...)','age = int(input("Age: "))\nprint(f"Next year you will be {age + 1}")']},
  power:{can:['Take numeric input safely','Avoid the most common beginner input bug'],
    expand:'Ask for two numbers and print their sum and product.',
    where:'Forms, command-line tools and data imports all deliver text you must convert.',
    next:'Next: handy number helpers: round, abs, min and max.'},
  codex:{title:'input() is text',body:'input() always returns a string. Use int(input(...)) or float(input(...)) for math.',snip:R`age = int(input("Age: "))`}
},
{
  id:'r1-15', realm:1, n:15, title:'round(), abs(), min(), max()',
  teaches:['helpers'], requires:['arith'],
  story:`"Python comes with a free toolbox," Sudo says, kicking open a drawer. "Little helper spells you don't have to write yourself. Four of the handiest: round off, flip to positive, smallest, biggest."`,
  concept:{
    html:`Built-in helpers:\n- \`round(x)\` rounds to the nearest whole number. \`round(3.7)\` is \`4\`\n- \`abs(x)\` removes the minus sign. \`abs(-5)\` is \`5\`\n- \`min(a, b, c)\` the smallest\n- \`max(a, b, c)\` the largest\n\nYou pass them values inside parentheses, just like \`print\`.`,
    analogy:`Calculator buttons you press instead of working it out by hand.`,
    example:R`print(round(3.7))
print(abs(-5))
print(max(3, 9, 4))`},
  predict:{code:R`print(round(3.7))
print(abs(-5))
print(max(3, 9, 4))`, q:'What prints?', opts:['4, 5, 9','3, -5, 4','4, -5, 3'], ans:0,
    why:'round(3.7)=4, abs(-5)=5, max(3,9,4)=9.'},
  cast:{code:R`print(round(3.7))
print(abs(-5))
print(min(3, 9, 4))
print(max(3, 9, 4))`, task:'Cast it. Try them with your own numbers.'},
  write:{prompt:'`damage = -12` and `heal = 7.6` are set. Print `abs(damage)`, then `round(heal)`, then the max of `3, 11, 7`. Three lines.',
    starter:R`damage = -12
heal = 7.6
`,
    cases:[{inputs:[],tests:[['Prints 12, 8, 11','lines==["12","8","11"]'],['Uses abs, round and max','"abs(" in src and "round(" in src and "max(" in src']]}],
    sol:R`damage = -12
heal = 7.6
print(abs(damage))
print(round(heal))
print(max(3, 11, 7))`,
    wrong:[R`damage = -12
heal = 7.6
print(12)
print(8)
print(11)`],
    hints:['Three prints, one helper in each.','abs(damage), round(heal), max(3, 11, 7)','print(abs(damage))\nprint(round(...))','print(abs(damage))\nprint(round(heal))\nprint(max(3, 11, 7))']},
  power:{can:['Use built-in helper functions','Clean up numbers quickly'],
    expand:'Find the biggest and smallest of five scores and the gap between them.',
    where:'Min, max, rounding and absolute value show up in every data and game calculation.',
    next:'Next: why decimals sometimes look weird, and how to handle money.'},
  codex:{title:'Helper functions',body:'round(x), abs(x), min(a, b, ...), max(a, b, ...) are built in.',snip:R`print(max(3, 9, 4))`}
},
{
  id:'r1-16', realm:1, n:16, title:'Float surprises and money',
  teaches:['float-money'], requires:['helpers'],
  story:`"Prepare to be betrayed by mathematics," Sudo says. "Computers store decimals in binary. Some decimals *can't be stored exactly*. So 0.1 plus 0.2 isn't quite 0.3. Not a bug in the book. A fact of the universe."`,
  concept:{
    html:`Computers store decimal numbers as tiny approximations. So \`0.1 + 0.2\` prints \`0.30000000000000004\`.\n\nIt is not a bug, just how binary works. The fix for display: **round** the result.\n\n\`round(0.1 + 0.2, 2)\` gives \`0.3\`. The second number is how many decimal places to keep.\n\nFor real money in big systems, professionals use special tools, but rounding is fine for learning and small scripts.`,
    analogy:`Writing 1/3 as 0.333: close enough to use, but never exact.`,
    example:R`print(0.1 + 0.2)
print(round(0.1 + 0.2, 2))`},
  predict:{code:R`print(0.1 + 0.2)`, q:'What does Python print?', opts:['0.3','0.30000000000000004','Error'], ans:1,
    why:'0.1 and 0.2 cannot be stored exactly in binary, so a tiny error shows up.'},
  cast:{code:R`print(0.1 + 0.2)
print(round(0.1 + 0.2, 2))
print(1.1 * 3)`, task:'Cast it. Round the last line to 2 places.'},
  bug:{broken:R`print(1.1 * 3)`, task:'Sudo wants this to look like 3.3. Round it to one place.',
    cases:[{inputs:[],tests:[['Prints 3.3','out.strip()=="3.3"'],['Uses round()','"round(" in src']]}],
    sol:R`print(round(1.1 * 3, 1))`, wrong:[R`print(1.1 * 3)`]},
  write:{prompt:'Store `total = 0.1 + 0.2`. Print the total rounded to 2 decimal places.',
    starter:R`# store, round, print
`,
    cases:[{inputs:[],tests:[['Prints 0.3','out.strip()=="0.3"'],['Uses round() with 2 places','"round(" in src and "2)" in src']]}],
    sol:R`total = 0.1 + 0.2
print(round(total, 2))`,
    wrong:[R`total = 0.1 + 0.2
print(total)`],
    hints:['round takes the number and how many decimal places.','round(total, 2)','print(round(..., 2))','total = 0.1 + 0.2\nprint(round(total, 2))']},
  power:{can:['Explain why decimals look strange','Round results for display'],
    expand:'Add up three prices like 19.99 and show the total rounded.',
    where:'Every language has this quirk. Knowing it protects you in finance and data work.',
    next:'Next: two errors you will meet often, close up.'},
  codex:{title:'Float quirks',body:'Decimals are stored approximately: 0.1 + 0.2 is 0.30000000000000004. Use round(x, 2) for display.',snip:R`print(round(0.1 + 0.2, 2))`}
},
{
  id:'r1-17', realm:1, n:17, title:'NameError and TypeError up close',
  teaches:['nameerror-typeerror'], requires:['float-money','convert'],
  story:`"Two monsters you'll meet every single day," Sudo says, pulling out a bestiary. "**NameError**: you used a jar that doesn't exist. **TypeError**: you mixed things that don't mix. Learn their faces and they stop being scary."`,
  concept:{
    html:`**NameError** means Python met a name it doesn't know. Causes: a typo, a wrong capital, or using a variable *before* creating it.\n\n**TypeError** means you combined types that don't mix, like text plus a number.\n\nDebug routine:\n1. Read the last line.\n2. Note the line number.\n3. Look at the names and types on that line.`,
    analogy:`NameError: asking for a jar nobody labeled. TypeError: trying to pour soup into a keyhole.`,
    example:R`hp = 10
print(hP)`},
  predict:{code:R`hp = 10
print(hP)`, q:'What error does this give?', opts:['NameError','TypeError','SyntaxError'], ans:0,
    why:'hP (capital P) is a different name from hp, so Python does not know it.'},
  cast:{code:R`hp = 10
print(hp)
print(hP)`, task:'Cast it on purpose and read the error.', expectError:true},
  bug:{broken:R`mana = 30
print(Mana)`, task:'NameError! Fix the typo so it prints 30.',
    cases:[{inputs:[],tests:[['Prints 30','out.strip()=="30"']]}],
    sol:R`mana = 30
print(mana)`, wrong:[R`mana = 30
print(Mana)`]},
  write:{prompt:'This spell has **two** bugs (a typo and a type mix). Fix both so it prints `60`.',
    starter:R`gold = 50
bonus = "10"
total = gold + bonus
print(totl)`,
    cases:[{inputs:[],tests:[['Prints 60','out.strip()=="60"'],['Converts the text','re.search(r"\\bint\\(",src)']]}],
    sol:R`gold = 50
bonus = "10"
total = gold + int(bonus)
print(total)`,
    wrong:[R`gold = 50
bonus = 10
total = gold + bonus
print(total)`],
    hints:['One bug is a misspelled name. The other adds a number to text.','Fix print(totl) and convert bonus with int().','total = gold + int(...)\nprint(...)','gold = 50\nbonus = "10"\ntotal = gold + int(bonus)\nprint(total)']},
  power:{can:['Diagnose NameError and TypeError quickly','Use a repeatable debug routine'],
    expand:'Write three tiny programs, each with a different bug, and swap with a friend to fix.',
    where:'These two errors are the most common in Python projects of every size.',
    next:'Next: debugging by printing values to see what is going on.'},
  codex:{title:'NameError & TypeError',body:'NameError: unknown name (typo or not created yet). TypeError: types do not mix (text + number).',snip:R`print(hP)   # NameError`}
},
{
  id:'r1-18', realm:1, n:18, title:'Debugging with print',
  teaches:['debug-print'], requires:['nameerror-typeerror','fstring'],
  story:`"When the spell misbehaves," Sudo says, "don't guess. **Look**. Print the jar contents mid-spell. The truth is usually about three prints away."`,
  concept:{
    html:`When code gives a surprising answer, **print the values** at each step to see where it goes wrong.\n\nA clear way: \`print(f"DEBUG hp = {hp}")\`. The label tells you what you are looking at.\n\nMethod: predict the answer, print the middle steps, find where reality differs from your prediction. That is where the bug lives.`,
    analogy:`A detective checking each room instead of guessing which one holds the clue.`,
    example:R`a = 4
b = 5
avg = a + b / 2
print(f"DEBUG avg = {avg}")`},
  predict:{code:R`a = 4
b = 5
avg = a + b / 2
print(avg)`, q:'What prints?', opts:['4.5','6.5','9'], ans:1,
    why:'Division happens first: 5 / 2 = 2.5, then 4 + 2.5 = 6.5. That is probably not the average!'},
  cast:{code:R`a = 4
b = 5
print(f"DEBUG a = {a}")
print(f"DEBUG b = {b}")
avg = a + b / 2
print(f"DEBUG avg = {avg}")`, task:'Cast it. Find which calculation is wrong, then fix it.'},
  bug:{broken:R`a = 4
b = 5
avg = a + b / 2
print(avg)`, task:'Sudo wants the average of 4 and 5 (4.5). Find the order-of-operations bug.',
    cases:[{inputs:[],tests:[['Prints 4.5','out.strip()=="4.5"']]}],
    sol:R`a = 4
b = 5
avg = (a + b) / 2
print(avg)`, wrong:[R`a = 4
b = 5
avg = a + b / 2
print(avg)`]},
  write:{prompt:'`hp` is calculated for you. Add ONE line using an f-string so the output is exactly `DEBUG hp = 28` (use the variable, not typed 28).',
    starter:R`hp = 20
hp -= 6
hp *= 2
`,
    cases:[{inputs:[],tests:[['Prints DEBUG hp = 28','out.strip()=="DEBUG hp = 28"'],['Uses {hp} in an f-string','"{hp}" in src']]}],
    sol:R`hp = 20
hp -= 6
hp *= 2
print(f"DEBUG hp = {hp}")`,
    wrong:[R`hp = 20
hp -= 6
hp *= 2
print("DEBUG hp = 28")`],
    hints:['Add one print at the bottom.','Use an f-string with {hp}.','print(f"DEBUG hp = ...")','print(f"DEBUG hp = {hp}")']},
  power:{can:['Find bugs by inspecting values','Use debug prints with clear labels'],
    expand:'Write a 4-step calculation with a deliberate bug, then debug it with prints.',
    where:'Print debugging is used by beginners and veterans alike. Sometimes it is the fastest tool there is.',
    next:'Next: assigning several variables in one line, and swapping.'},
  codex:{title:'Debugging with print',body:'Print values at each step with a label. Compare to your prediction. The mismatch shows the bug.',snip:R`print(f"DEBUG hp = {hp}")`}
},
{
  id:'r1-19', realm:1, n:19, title:'Multiple assignment and swapping',
  teaches:['multi-assign'], requires:['reassign'],
  story:`"Two jars, swap contents," Sudo challenges. "Pour A into B... and the contents of B are gone. Classic. Python has a trick to do it in one breath."`,
  concept:{
    html:`You can assign several variables at once:\n\n\`a, b = 1, 2\`\n\nThat makes swapping easy:\n\n\`a, b = b, a\`\n\nPython builds both new values *first*, then stores them, so nothing gets overwritten too early.`,
    analogy:`Two people switching seats at the same moment instead of one standing in the other's chair.`,
    example:R`a, b = 1, 2
a, b = b, a
print(a, b)`},
  predict:{code:R`a, b = 1, 2
a, b = b, a
print(a, b)`, q:'What prints?', opts:['1 2','2 1','2 2'], ans:1,
    why:'The swap exchanges the values: a becomes 2 and b becomes 1.'},
  cast:{code:R`left = "sword"
right = "shield"
left, right = right, left
print(left, right)`, task:'Cast it. Then add a third variable and rotate all three.'},
  bug:{broken:R`a = 1
b = 2
a = b
b = a
print(a, b)`, task:'This swap loses a value (it prints 2 2). Fix it so it prints `2 1`.',
    cases:[{inputs:[],tests:[['Prints 2 1','out.strip()=="2 1"']]}],
    sol:R`a = 1
b = 2
a, b = b, a
print(a, b)`, wrong:[R`a = 1
b = 2
a = b
b = a
print(a, b)`]},
  write:{prompt:'`left = "sword"` and `right = "shield"` are set. Swap them with ONE line, then print `left` and `right` on two lines.',
    starter:R`left = "sword"
right = "shield"
`,
    cases:[{inputs:[],tests:[['Prints shield then sword','lines==["shield","sword"]'],['Swaps in one line','"left,right=right,left" in src.replace(" ","")']]}],
    sol:R`left = "sword"
right = "shield"
left, right = right, left
print(left)
print(right)`,
    wrong:[R`left = "shield"
right = "sword"
print(left)
print(right)`],
    hints:['Python can assign to two names at once.','left, right = right, left','left, right = ...\nprint(left)','left, right = right, left\nprint(left)\nprint(right)']},
  power:{can:['Swap values cleanly','Assign several variables at once'],
    expand:'Rotate three variables a, b, c so a gets b, b gets c, c gets a.',
    where:'Swapping is everywhere: sorting, game turns, shuffling, data cleanup.',
    next:'Next: naming values that should never change.'},
  codex:{title:'Multiple assignment',body:'a, b = 1, 2 assigns both. a, b = b, a swaps them safely.',snip:R`a, b = b, a`}
},
{
  id:'r1-20', realm:1, n:20, title:'Constants and naming intent',
  teaches:['constants'], requires:['multi-assign','naming'],
  story:`"That 1.08 in your spell," Sudo squints. "What *is* it? In three months you won't know either. Give it a name. A **loud** name, so nobody changes it by accident."`,
  concept:{
    html:`A **constant** is a value that should not change. Python has no lock, so we use a **convention**: ALL_CAPS names, like \`TAX_RATE = 0.08\`.\n\nA bare number in the middle of code is called a **magic number**. Nobody knows what it means. Naming it makes the code explain itself and lets you change it in one place.`,
    analogy:`A "DO NOT TOUCH" label on a switch.`,
    example:R`TAX_RATE = 0.08
price = 100
print(price * (1 + TAX_RATE))`},
  predict:{code:'', q:'Which line follows the convention for a constant?', opts:['max_hp = 100','MAX_HP = 100','MaxHp = 100'], ans:1,
    why:'ALL_CAPS with underscores signals "this value is a constant, do not change it."'},
  cast:{code:R`TAX_RATE = 0.08
price = 100
print(price * (1 + TAX_RATE))`, task:'Cast it. Change TAX_RATE once and see the result update.'},
  bug:{broken:R`print(100 * 1.08)`, task:'The 1.08 is a magic number. Introduce a constant named `TAX_FACTOR` set to 1.08 and use it. It must still print 108.0.',
    cases:[{inputs:[],tests:[['Prints 108.0','out.strip()=="108.0"'],['Defines TAX_FACTOR','g.get("TAX_FACTOR")==1.08'],['Uses the constant in the print','"TAX_FACTOR" in src.split("print")[-1]']]}],
    sol:R`TAX_FACTOR = 1.08
print(100 * TAX_FACTOR)`, wrong:[R`print(100 * 1.08)`]},
  write:{prompt:'Create the constant `TAX_RATE = 0.08` and `price = 50`. Print the total price including tax.',
    starter:R`# constant, price, then total
`,
    cases:[{inputs:[],tests:[['Prints 54.0','out.strip()=="54.0"'],['TAX_RATE is 0.08','g.get("TAX_RATE")==0.08'],['Uses the constant in a calculation','"TAX_RATE" in src.split("print")[-1]']]}],
    sol:R`TAX_RATE = 0.08
price = 50
print(price + price * TAX_RATE)`,
    wrong:[R`price = 50
print(price + price * 0.08)`],
    hints:['Make the constant, then use it in the print.','price + price * TAX_RATE','TAX_RATE = 0.08\nprice = 50\nprint(...)','TAX_RATE = 0.08\nprice = 50\nprint(price + price * TAX_RATE)']},
  power:{can:['Remove magic numbers from code','Change a rule in one place instead of ten'],
    expand:'Rewrite an earlier spell so every important number is a named constant.',
    where:'Config values, rates, limits and thresholds are always named constants in real software.',
    next:'Next: making large numbers and money look professional.'},
  codex:{title:'Constants',body:'ALL_CAPS names mark values that should not change. Replace magic numbers with named constants.',snip:R`TAX_RATE = 0.08`}
},
{
  id:'r1-21', realm:1, n:21, title:'Formatting numbers: commas and decimals',
  teaches:['format-num'], requires:['fstring','float-money'],
  story:`"1250000 gold," Sudo reads aloud. "Is that one million? Twelve million? Ten seconds of counting zeros. Let the spell *format* it for humans."`,
  concept:{
    html:`Inside an f-string's braces, add \`:\` and a **format**:\n- \`{n:,}\` adds **commas**: \`1250000\` becomes \`1,250,000\`\n- \`{x:.2f}\` shows exactly **2 decimal places**: \`19.5\` becomes \`19.50\`\n\nThe number stays the same; only the display changes. This is how money should always be shown.`,
    analogy:`The same number written on a casual note versus a polished price tag.`,
    example:R`gold = 1250000
price = 19.5
print(f"Gold: {gold:,}")
print(f"Price: $@{price:.2f}")`},
  predict:{code:R`print(f"{1234567:,}")
print(f"{3.14159:.2f}")`, q:'What prints?', opts:['1,234,567 and 3.14','1234567 and 3.14159','1,234,567 and 3'], ans:0,
    why:':, adds thousand separators and :.2f keeps two decimal places.'},
  cast:{code:R`gold = 1250000
price = 19.5
print(f"Gold: {gold:,}")
print(f"Price: $@{price:.2f}")`, task:'Cast it. Change gold to a billion.'},
  bug:{broken:R`print(f"Total: {4.5}")`, task:'Money should show two decimals. Sudo wants `Total: 4.50`. Fix the f-string.',
    cases:[{inputs:[],tests:[['Prints Total: 4.50','out.strip()=="Total: 4.50"']]}],
    sol:R`print(f"Total: {4.5:.2f}")`, wrong:[R`print(f"Total: {4.5}")`]},
  write:{prompt:'`gold = 1250000` and `price = 19.5` are set. Print `Gold: 1,250,000` and `Price: $19.50` using f-string formatting.',
    starter:R`gold = 1250000
price = 19.5
`,
    cases:[{inputs:[],tests:[['Prints Gold: 1,250,000','lines[0]=="Gold: 1,250,000"'],['Prints Price: $19.50','lines[1]=="Price: $19.50"'],['Uses format specs','":," in src and ":.2f" in src']]}],
    sol:R`gold = 1250000
price = 19.5
print(f"Gold: {gold:,}")
print(f"Price: $@{price:.2f}")`,
    wrong:[R`gold = 1250000
price = 19.5
print("Gold: 1,250,000")
print("Price: $19.50")`],
    hints:['Format specs go after a colon inside the braces.','{gold:,} and {price:.2f}','print(f"Gold: {gold:,}")\nprint(...)','print(f"Gold: {gold:,}")\nprint(f"Price: $@{price:.2f}")']},
  power:{can:['Show money and big numbers professionally','Control exactly how many decimals appear'],
    expand:'Print a receipt with three items, aligned and with two decimals each.',
    where:'Every invoice, report and dashboard formats numbers like this.',
    next:'Next: the shape of a good program: input, process, output.'},
  codex:{title:'Number formatting',body:'f"{n:,}" adds commas. f"{x:.2f}" keeps 2 decimals. Format changes display, not the value.',snip:R`print(f"Price: $@{price:.2f}")`}
},
{
  id:'r1-22', realm:1, n:22, title:'Program shape: input → process → output',
  teaches:['program-shape'], requires:['input-text','format-num','constants'],
  story:`"Every useful spell has the same skeleton," Sudo says, drawing three boxes. "**Ask**. **Work it out**. **Show the answer**. Once you see this shape, you'll see it everywhere."`,
  concept:{
    html:`Most programs have three parts:\n1. **INPUT** get data from the user\n2. **PROCESS** calculate with it\n3. **OUTPUT** show the result\n\nPlan with comments first, then fill in the code:\n\n\`\`\`\n# INPUT\n# PROCESS\n# OUTPUT\n\`\`\`\n\nThis habit makes big programs feel small.`,
    analogy:`A vending machine: you put in money (input), it does the work (process), a snack drops (output).`,
    example:R`# INPUT
price = float(input("Price: "))
# PROCESS
total = price * 1.1
# OUTPUT
print(f"{total:.2f}")`},
  predict:{code:R`# INPUT
price = float(input("Price: "))
# PROCESS
total = price * 1.1
# OUTPUT
print(f"{total:.2f}")`, inputs:['10'], q:'The player types 10. What is the LAST line printed?', opts:['11.00','11.0','11.000000000000002'], ans:0,
    why:'10 * 1.1 is about 11, and :.2f formats it with exactly two decimals: 11.00.'},
  cast:{code:R`# INPUT
price = float(input("Price: "))
# PROCESS
total = price * 1.1
# OUTPUT
print(f"{total:.2f}")`, inputs:['10'], task:'Cast it. Try other prices in the Inputs box.'},
  bug:{broken:R`miles = input("Miles: ")
km = miles * 1.609
print(f"{km:.2f} km")`, task:'This crashes. Fix the INPUT step so 10 miles prints `16.09 km`.',
    cases:[{inputs:['10'],tests:[['10 miles gives 16.09 km','lines[-1]=="16.09 km"']]},{inputs:['3'],tests:[['3 miles gives 4.83 km','lines[-1]=="4.83 km"']]}],
    sol:R`miles = float(input("Miles: "))
km = miles * 1.609
print(f"{km:.2f} km")`, wrong:[R`miles = input("Miles: ")
km = miles * 1.609
print(f"{km:.2f} km")`], inputs:['10']},
  write:{prompt:'Build a miles-to-kilometers converter: ask for miles, multiply by 1.609, print the result with 2 decimals followed by ` km`. Use INPUT / PROCESS / OUTPUT comments.',
    starter:R`# INPUT

# PROCESS

# OUTPUT
`,
    inputs:['10'],
    cases:[{inputs:['10'],tests:[['10 miles gives 16.09 km','lines[-1]=="16.09 km"']]},{inputs:['3'],tests:[['3 miles gives 4.83 km','lines[-1]=="4.83 km"'],['Uses float(input())','"float(" in src and "input(" in src']]}],
    sol:R`# INPUT
miles = float(input("Miles: "))
# PROCESS
km = miles * 1.609
# OUTPUT
print(f"{km:.2f} km")`,
    wrong:[R`print("16.09 km")`],
    hints:['Convert the input to float first.','km = miles * 1.609 then print with :.2f','miles = float(input(...))\nkm = ...','miles = float(input("Miles: "))\nkm = miles * 1.609\nprint(f"{km:.2f} km")']},
  power:{can:['Plan any small program as input, process, output','Build real converters and calculators'],
    expand:'Build a Celsius-to-Fahrenheit converter in the same shape.',
    where:'This skeleton is the starting point of scripts, apps and data pipelines at every scale.',
    next:'Now put it all together: the Tip Calculator Golem awaits.'},
  codex:{title:'Program shape',body:'Input, process, output. Plan with comments, then fill in code.',snip:R`# INPUT
# PROCESS
# OUTPUT`}
},
{
  id:'r1-23', realm:1, n:23, title:'Boss: The Tip Calculator Golem', kind:'boss',
  teaches:['realm1-boss'], requires:['program-shape','format-num','input-text','nameerror-typeerror'],
  story:`In the Market's back alley a golem made of receipts and coins blocks your way. "TIP," it rumbles. "TOTAL. SPLIT. OR YOU SHALL NOT PASS." Sudo clears his throat. "Three attacks. You've got this."`,
  boss:{name:'The Tip Calculator Golem', hp:5},
  phases:[
    {type:'mcq', code:R`n = input("Number: ")
print(type(n))`, inputs:['5'], q:'The player types 5. What does this print?', opts:["<class 'int'>","<class 'str'>","<class 'float'>"], ans:1,
     why:'input() always returns a string, even when the player types digits.', tags:['r1-14']},
    {type:'write', prompt:'Phase 1: Ask for the bill (a decimal) and the tip percent (a whole number). Print `Tip: $` followed by the tip amount with 2 decimals.',
     starter:R`# INPUT

# PROCESS

# OUTPUT
`,
     inputs:['50','20'],
     cases:[{inputs:['50','20'],tests:[['50 at 20% gives Tip: $10.00','lines[-1]=="Tip: $10.00"']]},{inputs:['80','15'],tests:[['80 at 15% gives Tip: $12.00','lines[-1]=="Tip: $12.00"']]}],
     sol:R`bill = float(input("Bill: "))
percent = int(input("Tip percent: "))
tip = bill * percent / 100
print(f"Tip: $@{tip:.2f}")`,
     wrong:[R`print("Tip: $10.00")`],
     hints:['Two inputs: bill as float, percent as int.','tip = bill * percent / 100','bill = float(input(...))\npercent = ...','bill = float(input("Bill: "))\npercent = int(input("Tip percent: "))\ntip = bill * percent / 100\nprint(f"Tip: $@{tip:.2f}")'], tags:['r1-13','r1-14','r1-21']},
    {type:'write', prompt:'Phase 2: Also print the total (bill + tip) and ask how many people split it. Print three lines: `Tip: $...`, `Total: $...`, `Each pays: $...`.',
     starter:R`bill = float(input("Bill: "))
percent = int(input("Tip percent: "))
tip = bill * percent / 100
print(f"Tip: $@{tip:.2f}")
# now add the total and the split
`,
     inputs:['50','20','2'],
     cases:[{inputs:['50','20','2'],tests:[['Prints Tip, Total and Each pays lines','[l for l in lines if l.startswith(("Tip:","Total:","Each pays:"))]==["Tip: $10.00","Total: $60.00","Each pays: $30.00"]']]},{inputs:['90','10','3'],tests:[['Works for 90, 10%, 3 people','[l for l in lines if l.startswith(("Tip:","Total:","Each pays:"))]==["Tip: $9.00","Total: $99.00","Each pays: $33.00"]']]}],
     sol:R`bill = float(input("Bill: "))
percent = int(input("Tip percent: "))
tip = bill * percent / 100
print(f"Tip: $@{tip:.2f}")
total = bill + tip
print(f"Total: $@{total:.2f}")
people = int(input("People: "))
print(f"Each pays: $@{total / people:.2f}")`,
     wrong:[R`bill = float(input("Bill: "))
percent = int(input("Tip percent: "))
tip = bill * percent / 100
print(f"Tip: $@{tip:.2f}")
print("Total: $60.00")
print("Each pays: $30.00")`],
     hints:['total = bill + tip, then ask for people.','Each pays = total / people','people = int(input(...))\nprint(f"Each pays: ...")','bill = float(input("Bill: "))\npercent = int(input("Tip percent: "))\ntip = bill * percent / 100\nprint(f"Tip: $@{tip:.2f}")\ntotal = bill + tip\nprint(f"Total: $@{total:.2f}")\npeople = int(input("People: "))\nprint(f"Each pays: $@{total / people:.2f}")'], tags:['r1-05','r1-12','r1-21','r1-22']},
    {type:'mcq', code:R`gold = 50
bonus = "10"
print(gold + bonus)`, q:'What happens?', opts:['Prints 60','Prints 5010','TypeError'], ans:2,
     why:'You cannot add a number to text. Convert with int(bonus) first.', tags:['r1-10','r1-17']}
  ],
  power:{can:['Build a complete interactive calculator','Combine input, conversion, math and formatting'],
    expand:'Add a rounding step so the total is always rounded up to the next dollar.',
    where:'This is exactly the kind of tool small businesses and personal finance scripts are made of.',
    next:'One more gate: a Gap Check proves your foundations are solid before Realm 2.'},
  codex:{title:'Realm 1 boss',body:'You built a full input, process, output calculator with formatting.',snip:R`print(f"Each pays: $@{total / people:.2f}")`}
},
{
  id:'r1-24', realm:1, n:24, title:'Gap Check: the Cantrip Trial', kind:'gap', passPct:80,
  teaches:['realm1-gap'], requires:['realm1-boss'],
  story:`Ada the rune-smith hands you a slate. "Before I teach you to make your spells *decide* things," she says, "answer these. No tricks. Just what you've learned. Eighty percent and the door opens."`,
  phases:[
    {type:'mcq', code:R`name = "Mira"
level = 3
print(f"{name} is level {level}")`, q:'What prints?', opts:['Mira is level 3','{name} is level {level}','name is level level'], ans:0, why:'The f makes Python fill in the variables.', tags:['r1-12']},
    {type:'mcq', q:'What type does input() always return?', opts:['int','str','float'], ans:1, why:'input() always gives text.', tags:['r1-14']},
    {type:'mcq', code:R`print(17 % 5)`, q:'What prints?', opts:['3','2','3.4'], ans:1, why:'% gives the remainder: 17 = 3*5 + 2.', tags:['r1-06']},
    {type:'mcq', code:R`hp = 10
print(hP)`, q:'What happens?', opts:['Prints 10','NameError','TypeError'], ans:1, why:'hP is not the same name as hp.', tags:['r1-17','r0-07']},
    {type:'mcq', code:R`score = 5
score += 3
score *= 2
print(score)`, q:'What prints?', opts:['16','13','11'], ans:0, why:'5+3=8, then 8*2=16.', tags:['r1-08']},
    {type:'mcq', code:R`print(int("3") + 4)`, q:'What prints?', opts:['34','7','TypeError'], ans:1, why:'int("3") makes the number 3, so 3 + 4 = 7.', tags:['r1-10']},
    {type:'mcq', code:R`print(type(3.0))`, q:'What prints?', opts:["<class 'int'>","<class 'float'>","<class 'str'>"], ans:1, why:'3.0 has a decimal point, so it is a float.', tags:['r1-04','r1-09']},
    {type:'mcq', q:'Which is a valid variable name?', opts:['my-score','my_score','my score'], ans:1, why:'Letters, digits and underscores only. No hyphens or spaces.', tags:['r1-02']},
    {type:'mcq', code:R`print(0.1 + 0.2)`, q:'Why does this print 0.30000000000000004?', opts:['Python is broken','Decimals are stored as tiny approximations','Python rounds badly'], ans:1, why:'Binary cannot store some decimals exactly.', tags:['r1-16']},
    {type:'mcq', code:R`print(2 + 3 * 4)`, q:'What prints?', opts:['20','14','24'], ans:1, why:'Multiplication goes before addition.', tags:['r1-07']},
    {type:'write', pts:2, prompt:'Final trial: ask for a number of seconds (whole number) and print `X min Y sec`. For 125 seconds print `2 min 5 sec`.',
     starter:R`# INPUT

# PROCESS

# OUTPUT
`,
     inputs:['125'],
     cases:[{inputs:['125'],tests:[['125 seconds gives 2 min 5 sec','lines[-1]=="2 min 5 sec"']]},{inputs:['600'],tests:[['600 seconds gives 10 min 0 sec','lines[-1]=="10 min 0 sec"']]}],
     sol:R`seconds = int(input("Seconds: "))
minutes = seconds // 60
left = seconds % 60
print(f"{minutes} min {left} sec")`,
     wrong:[R`print("2 min 5 sec")`],
     hints:['Whole minutes use //, the leftover seconds use %.','minutes = seconds // 60','seconds = int(input(...))\nminutes = ...','seconds = int(input("Seconds: "))\nminutes = seconds // 60\nleft = seconds % 60\nprint(f"{minutes} min {left} sec")'], tags:['r1-06','r1-14','r1-12']}
  ],
  power:{can:['Prove you can read, predict and write Realm 1 spells','Move on with a solid foundation'],
    expand:'Revisit any lesson tagged in your Training Grounds, then retake the trial.',
    where:'Gap checks mirror how professionals review fundamentals before taking on bigger work.',
    next:'Realm 2: making your spells decide with if and else (coming in Stage 2).'},
  codex:{title:'Cantrip Trial passed',body:'You have solid foundations in variables, types, input and output.',snip:R`print(f"{minutes} min {left} sec")`}
}
);
