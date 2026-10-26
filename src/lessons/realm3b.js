// REALM 3 — LOOPS OF REPETITION — part B (lessons 10-18)
LESSONS.push(
{
  id:'r3-10', realm:3, n:10, title:'Tracking the highest and lowest',
  teaches:['minmax'], requires:['accumulator'],
  story:`In the second hall, five chests sit in a row, each marked with a number of gold. "Which holds the most?" Ada asks. "You can't hold them all in your head. Keep a **champion** and replace it whenever something beats it."`,
  concept:{
    html:`To find the biggest value in a stream of numbers, keep a variable for the best so far:\n\n\`\`\`\nbest = first number\nfor each next number n:\n    if n > best:\n        best = n\n\`\`\`\n\n**Important:** start \`best\` with the **first real value**, not 0. If every number is negative, a starting 0 would "win" wrongly.\n\nThe lowest is the same with \`<\`.`,
    analogy:`A "king of the hill" game: the current champion stays until someone beats them.`,
    example:R`best = int(input("Number: "))
for i in range(2):
    n = int(input("Number: "))
    if n > best:
        best = n
print("Highest:", best)`},
  predict:{code:R`best = 0
for n in range(-5, -1):
    if n > best:
        best = n
print(best)`, q:'We meant to find the highest of -5, -4, -3, -2. What prints?', opts:['-2','0','-5'], ans:1,
    why:'No negative number is bigger than the starting 0, so best stays 0. Start from the first real value instead.'},
  cast:{code:R`best = int(input("Number: "))
for i in range(2):
    n = int(input("Number: "))
    if n > best:
        best = n
print("Highest:", best)`, task:'Cast it with three numbers (one per line) in the Inputs box.', inputs:['4','9','2']},
  bug:{broken:R`lowest = 0
for i in range(3):
    n = int(input("Number: "))
    if n < lowest:
        lowest = n
print("Lowest:", lowest)`, task:'With 5, 8, 6 the lowest should be 5 but it prints 0. Start with the first number instead of 0.',
    cases:[{inputs:['5','8','6'],tests:[['Lowest of 5 8 6 is 5','lines[-1]=="Lowest: 5"']]},{inputs:['9','3','7'],tests:[['Lowest of 9 3 7 is 3','lines[-1]=="Lowest: 3"']]}],
    sol:R`lowest = int(input("Number: "))
for i in range(2):
    n = int(input("Number: "))
    if n < lowest:
        lowest = n
print("Lowest:", lowest)`, wrong:[R`lowest = 0
for i in range(3):
    n = int(input("Number: "))
    if n < lowest:
        lowest = n
print("Lowest:", lowest)`]},
  write:{prompt:'Read **five** numbers (ask `Number: ` each time). Print `Highest: ` and `Lowest: ` on two lines.',
    starter:R`first = int(input("Number: "))
`,
    inputs:['3','9','4','1','7'],
    cases:[{inputs:['3','9','4','1','7'],tests:[['Highest 9','"Highest: 9" in lines'],['Lowest 1','"Lowest: 1" in lines']]},{inputs:['-5','-2','-9','-1','-7'],tests:[['Negatives: highest -1','"Highest: -1" in lines'],['Negatives: lowest -9','"Lowest: -9" in lines']]},{inputs:['4','4','4','4','4'],tests:[['All equal','"Highest: 4" in lines and "Lowest: 4" in lines']]}],
    sol:R`first = int(input("Number: "))
highest = first
lowest = first
for i in range(4):
    n = int(input("Number: "))
    if n > highest:
        highest = n
    if n < lowest:
        lowest = n
print("Highest:", highest)
print("Lowest:", lowest)`,
    wrong:[R`highest = 0
lowest = 0
for i in range(5):
    n = int(input("Number: "))
    if n > highest:
        highest = n
    if n < lowest:
        lowest = n
print("Highest:", highest)
print("Lowest:", lowest)`, R`first = int(input("Number: "))
highest = first
for i in range(4):
    n = int(input("Number: "))
    if n > highest:
        highest = n
print("Highest:", highest)
print("Lowest:", first)`],
    hints:['Start both highest and lowest with the first number.','Loop 4 more times, updating each when beaten.','Print both after the loop.','first = int(input("Number: "))\nhighest = first\nlowest = first\nfor i in range(4):\n    n = int(input("Number: "))\n    if n > highest:\n        highest = n\n    if n < lowest:\n        lowest = n\nprint("Highest:", highest)\nprint("Lowest:", lowest)']},
  power:{can:['Track the champion in a stream of values','Avoid the "start at 0" trap'],
    expand:'Also track which round the highest number came in.',
    where:'Highest score, lowest price, hottest day and peak traffic are all max/min tracking.',
    next:'Next: only count the items that qualify, filtering with if.'},
  codex:{title:'Max and min',body:'Keep the best so far. Start from the first real value, not 0. Replace when beaten.',snip:R`if n > best:
    best = n`}
},
{
  id:'r3-11', realm:3, n:11, title:'Filtering: loop plus if',
  teaches:['filter-loop'], requires:['minmax'],
  story:`The chests in the third hall hold a mix of coins and curses. "Only add the real gold," Ada says, tapping the lid. "Combine the loop with an **if** and you can pick out exactly what you want."`,
  concept:{
    html:`Put an \`if\` inside a loop to act only on items that qualify:\n\n\`\`\`\ntotal = 0\nfor n in range(1, 11):\n    if n % 2 == 0:\n        total += n\nprint(total)\n\`\`\`\n\nThe loop visits every item; the \`if\` decides which ones count. You can also count matches (\`count += 1\`) instead of summing.`,
    analogy:`A sieve: everything passes through the loop, but only what fits gets kept.`,
    example:R`total = 0
for n in range(1, 11):
    if n % 2 == 0:
        total += n
print(total)`},
  predict:{code:R`count = 0
for n in range(1, 8):
    if n % 3 == 0:
        count += 1
print(count)`, q:'What prints?', opts:['2','3','7'], ans:0,
    why:'Between 1 and 7 only 3 and 6 are multiples of 3.'},
  cast:{code:R`total = 0
for n in range(1, 11):
    if n % 2 == 0:
        total += n
print(total)`, task:'Cast it. Change the condition to only add odd numbers (n % 2 == 1).'},
  bug:{broken:R`count = 0
for i in range(3):
    n = int(input("Number: "))
    count += 1
print("Evens:", count)`, task:'It counts every number, not just the even ones. Add the filter.',
    cases:[{inputs:['2','3','4'],tests:[['2 3 4 has 2 evens','lines[-1]=="Evens: 2"']]},{inputs:['1','3','5'],tests:[['1 3 5 has 0 evens','lines[-1]=="Evens: 0"']]}],
    sol:R`count = 0
for i in range(3):
    n = int(input("Number: "))
    if n % 2 == 0:
        count += 1
print("Evens:", count)`, wrong:[R`count = 0
for i in range(3):
    n = int(input("Number: "))
    count += 1
print("Evens:", count)`]},
  write:{prompt:'Read five numbers (ask `Number: ` each time). Add up **only the positive ones** and print `Positive total: ` and the sum.',
    starter:R`total = 0
`,
    inputs:['4','-2','7','-1','3'],
    cases:[{inputs:['4','-2','7','-1','3'],tests:[['Total 14','lines[-1]=="Positive total: 14"']]},{inputs:['-1','-2','-3','-4','-5'],tests:[['All negative gives 0','lines[-1]=="Positive total: 0"']]},{inputs:['0','5','0','5','0'],tests:[['Zeros ignored','lines[-1]=="Positive total: 10"']]}],
    sol:R`total = 0
for i in range(5):
    n = int(input("Number: "))
    if n > 0:
        total += n
print("Positive total:", total)`,
    wrong:[R`total = 0
for i in range(5):
    n = int(input("Number: "))
    total += n
print("Positive total:", total)`, R`total = 0
for i in range(5):
    n = int(input("Number: "))
    if n >= 0:
        total += n + 1
print("Positive total:", total)`],
    hints:['Loop five times, reading a number each time.','Only add when n > 0.','Print the total after the loop.','total = 0\nfor i in range(5):\n    n = int(input("Number: "))\n    if n > 0:\n        total += n\nprint("Positive total:", total)']},
  power:{can:['Filter inside a loop','Sum or count only matching items'],
    expand:'Count how many numbers are over 100 out of ten you type in.',
    where:'"Total of paid invoices", "count of failed tests" and "average of valid readings" are all filtered loops.',
    next:'Next: searching with a flag, the "did I find it?" pattern.'},
  codex:{title:'Filtering loops',body:'An if inside a loop picks which items count. Sum them or count them.',snip:R`for n in data:
    if n > 0:
        total += n`}
},
{
  id:'r3-12', realm:3, n:12, title:'Searching with a flag',
  teaches:['flag-search'], requires:['filter-loop'],
  story:`"Is there a seven hiding anywhere in this number?" Ada asks. You can't tell until you've looked at every digit. "Plant a flag before you search. If you find one, **raise it.** When the loop ends, check the flag."`,
  concept:{
    html:`A **flag** is a boolean that remembers whether something happened during a loop.\n\n\`\`\`\nfound = False\nfor ch in text:\n    if ch == "7":\n        found = True\nif found:\n    print("Lucky")\nelse:\n    print("Unlucky")\n\`\`\`\n\nStart as \`False\`, flip to \`True\` when you spot it, **never set it back to False inside the loop** (that erases what you found). Decide after the loop ends.`,
    analogy:`A lookout waving a flag. Once the flag is up, it stays up.`,
    example:R`text = "1737"
found = False
for ch in text:
    if ch == "7":
        found = True
print(found)`},
  predict:{code:R`found = False
for n in range(1, 6):
    if n == 4:
        found = True
print(found)`, q:'What prints?', opts:['True','False','4'], ans:0,
    why:'When n reaches 4 the flag flips to True and nothing flips it back.'},
  cast:{code:R`text = "1737"
found = False
for ch in text:
    if ch == "7":
        found = True
print(found)`, task:'Cast it. Change the text to "1234".'},
  bug:{broken:R`text = input("Number: ")
found = False
for ch in text:
    if ch == "7":
        found = True
    else:
        found = False
print("Lucky" if found else "Unlucky")`, task:'771 should be Lucky but is called Unlucky. The flag is switched back off. Fix it.',
    cases:[{inputs:['771'],tests:[['771 is Lucky','lines[-1]=="Lucky"']]},{inputs:['123'],tests:[['123 is Unlucky','lines[-1]=="Unlucky"']]},{inputs:['177'],tests:[['177 is Lucky','lines[-1]=="Lucky"']]}],
    sol:R`text = input("Number: ")
found = False
for ch in text:
    if ch == "7":
        found = True
print("Lucky" if found else "Unlucky")`, wrong:[R`text = input("Number: ")
found = False
for ch in text:
    if ch == "7":
        found = True
    else:
        found = False
print("Lucky" if found else "Unlucky")`]},
  write:{prompt:'Ask for a whole number of 2 or more. Check every possible divisor from 2 up to (but not including) the number. Print `Prime` if none divides it evenly, otherwise `Not prime`. Use a flag.',
    starter:R`n = int(input("Number: "))
`,
    inputs:['7'],
    cases:[{inputs:['7'],tests:[['7 is Prime','lines[-1]=="Prime"']]},{inputs:['8'],tests:[['8 is Not prime','lines[-1]=="Not prime"']]},{inputs:['2'],tests:[['2 is Prime','lines[-1]=="Prime"']]},{inputs:['91'],tests:[['91 is Not prime (7 x 13)','lines[-1]=="Not prime"']]},{inputs:['97'],tests:[['97 is Prime','lines[-1]=="Prime"']]}],
    sol:R`n = int(input("Number: "))
is_prime = True
for d in range(2, n):
    if n % d == 0:
        is_prime = False
if is_prime:
    print("Prime")
else:
    print("Not prime")`,
    wrong:[R`n = int(input("Number: "))
is_prime = True
for d in range(2, n):
    is_prime = n % d != 0
if is_prime:
    print("Prime")
else:
    print("Not prime")`, R`n = int(input("Number: "))
print("Prime")`],
    hints:['Start is_prime = True.','Loop d from 2 up to n - 1; if n % d == 0 set is_prime = False.','Check the flag after the loop.','n = int(input("Number: "))\nis_prime = True\nfor d in range(2, n):\n    if n % d == 0:\n        is_prime = False\nif is_prime:\n    print("Prime")\nelse:\n    print("Not prime")']},
  power:{can:['Remember whether something happened in a loop','Write the classic prime check'],
    expand:'Add a break so the loop stops at the first divisor found.',
    where:'"Did any test fail?", "was any field blank?" and "does the list contain a duplicate?" are flag searches.',
    next:'Next: menus that run until the player quits.'},
  codex:{title:'Flag pattern',body:'Start the flag False. Flip it to True when found. Never reset inside the loop. Check it after.',snip:R`found = False
for x in data:
    if x == target:
        found = True`}
},
{
  id:'r3-13', realm:3, n:13, title:'Menu loops with while True',
  teaches:['menu-loop'], requires:['flag-search','validate-if'],
  story:`A talking door in the fourth hall demands commands. "ATTACK. HEAL. QUIT." It keeps asking until you say the last word. "Programs like this," says Sudo, "loop **until the player chooses to leave**."`,
  concept:{
    html:`Menus and game loops often run **forever on purpose** and use \`break\` to leave:\n\n\`\`\`\nwhile True:\n    cmd = input("> ")\n    if cmd == "quit":\n        print("Goodbye")\n        break\n    elif cmd == "attack":\n        print("You strike!")\n    else:\n        print("Unknown command")\n\`\`\`\n\n\`while True\` is always True, so the only way out is \`break\`. Put the quit check clearly in the loop so it can always end.\n\nTip: in the Spellbook, type each command on its own line in the Inputs box.`,
    analogy:`A vending machine screen that keeps taking orders until someone presses Done.`,
    example:R`while True:
    cmd = input("> ")
    if cmd == "quit":
        print("Goodbye")
        break
    elif cmd == "attack":
        print("You strike!")
    else:
        print("Unknown command")`},
  predict:{code:R`n = 0
while True:
    n += 1
    if n == 3:
        break
print(n)`, q:'What prints?', opts:['3','0','It never stops'], ans:0,
    why:'while True keeps going until break, which fires when n reaches 3.'},
  cast:{code:R`while True:
    cmd = input("> ")
    if cmd == "quit":
        print("Goodbye")
        break
    elif cmd == "attack":
        print("You strike!")
    else:
        print("Unknown command")`, task:'Cast it with a few commands (one per line) ending with quit in the Inputs box.', inputs:['attack','dance','quit']},
  bug:{broken:R`while True:
    cmd = input("> ")
    if cmd == "quit":
        print("Goodbye")`, task:'quit prints Goodbye but the menu keeps asking. Add what is missing so it leaves the loop.',
    cases:[{inputs:['quit'],tests:[['quit prints Goodbye and stops','lines[-1]=="Goodbye"']]}],
    sol:R`while True:
    cmd = input("> ")
    if cmd == "quit":
        print("Goodbye")
        break`, wrong:[R`while True:
    cmd = input("> ")
    if cmd == "quit":
        print("Goodbye")`]},
  write:{prompt:'Build the command loop. Keep asking `> `. `attack` prints `You strike!`, `heal` prints `You heal.`, `quit` prints `Goodbye` and ends, anything else prints `Unknown command`.',
    starter:R`print("Commands: attack, heal, quit")
`,
    inputs:['attack','heal','quit'],
    cases:[{inputs:['attack','heal','quit'],tests:[['attack, heal, quit','[l for l in lines if l in ("You strike!","You heal.","Unknown command","Goodbye")]==["You strike!","You heal.","Goodbye"]']]},{inputs:['attack','dance','quit'],tests:[['unknown command handled','[l for l in lines if l in ("You strike!","You heal.","Unknown command","Goodbye")]==["You strike!","Unknown command","Goodbye"]']]},{inputs:['quit'],tests:[['immediate quit','[l for l in lines if l in ("You strike!","You heal.","Unknown command","Goodbye")]==["Goodbye"]']]}],
    sol:R`print("Commands: attack, heal, quit")
while True:
    cmd = input("> ")
    if cmd == "quit":
        print("Goodbye")
        break
    elif cmd == "attack":
        print("You strike!")
    elif cmd == "heal":
        print("You heal.")
    else:
        print("Unknown command")`,
    wrong:[R`print("Commands: attack, heal, quit")
cmd = input("> ")
if cmd == "attack":
    print("You strike!")
elif cmd == "quit":
    print("Goodbye")`, R`print("Commands: attack, heal, quit")
while True:
    cmd = input("> ")
    if cmd == "attack":
        print("You strike!")
    elif cmd == "heal":
        print("You heal.")
    else:
        print("Unknown command")`],
    hints:['Use while True: and ask for the command inside.','if quit: print Goodbye and break; elif attack ...; elif heal ...; else unknown.','The break is what lets the loop end.','print("Commands: attack, heal, quit")\nwhile True:\n    cmd = input("> ")\n    if cmd == "quit":\n        print("Goodbye")\n        break\n    elif cmd == "attack":\n        print("You strike!")\n    elif cmd == "heal":\n        print("You heal.")\n    else:\n        print("Unknown command")']},
  power:{can:['Build a command loop with a clear exit','Handle unknown commands gracefully'],
    expand:'Add a "stats" command that prints the player\'s HP, and make attack lower an enemy HP counter.',
    where:'Every text game, shell, chatbot and CLI tool uses a loop like this.',
    next:'Next: loops inside loops.'},
  codex:{title:'Menu loops',body:'while True: runs until break. Always provide a clear quit path.',snip:R`while True:
    cmd = input("> ")
    if cmd == "quit":
        break`}
},
{
  id:'r3-14', realm:3, n:14, title:'Nested loops',
  teaches:['nested-loops'], requires:['menu-loop'],
  story:`The corridor now branches into rows and columns of identical doors. "Every row has many doors," says Ada. "To visit them all, put a loop **inside** a loop. The inner one spins fully for every step of the outer."`,
  concept:{
    html:`A loop inside a loop is called **nested**. The inner loop runs **completely** for each round of the outer loop.\n\n\`\`\`\nfor row in range(2):\n    for col in range(3):\n        print(row, col)\n\`\`\`\n\nThat prints 2 x 3 = **6** lines: row 0 with columns 0, 1, 2, then row 1 with columns 0, 1, 2. Think of a clock: the minute hand loops fully for each step of the hour hand.`,
    analogy:`A clock: the minute hand makes a full circle for every hour tick.`,
    example:R`for row in range(2):
    for col in range(3):
        print(row, col)`},
  predict:{code:R`for i in range(2):
    for j in range(3):
        print("x")`, q:'How many times does x print?', opts:['5','6','3'], ans:1,
    why:'The inner loop runs 3 times for each of the 2 outer rounds: 2 x 3 = 6.'},
  cast:{code:R`for row in range(2):
    for col in range(3):
        print(row, col)`, task:'Cast it. Change the ranges to 3 and 2.'},
  bug:{broken:R`for a in range(1, 3):
    for b in range(1, 4):
        print(f"{b}-{a}")`, task:'The pairs should read a-b (1-1, 1-2, 1-3, 2-1 ...) but they come out backwards. Fix the print.',
    cases:[{inputs:[],tests:[['Pairs in a-b order','lines==["1-1","1-2","1-3","2-1","2-2","2-3"]']]}],
    sol:R`for a in range(1, 3):
    for b in range(1, 4):
        print(f"{a}-{b}")`, wrong:[R`for a in range(1, 3):
    for b in range(1, 4):
        print(f"{b}-{a}")`]},
  write:{prompt:'Use nested loops to print every pair `a-b` where `a` goes 1 to 3 and `b` goes 1 to 2: `1-1`, `1-2`, `2-1`, `2-2`, `3-1`, `3-2`.',
    starter:R`# outer loop: a. inner loop: b.
`,
    cases:[{inputs:[],tests:[['All six pairs in order','lines==["1-1","1-2","2-1","2-2","3-1","3-2"]'],['Two for loops','len(re.findall(r"\\bfor\\b", src))>=2']]}],
    sol:R`for a in range(1, 4):
    for b in range(1, 3):
        print(f"{a}-{b}")`,
    wrong:[R`for a in range(1, 4):
    for b in range(1, 3):
        print(f"{b}-{a}")`, R`for a in range(1, 4):
    print(f"{a}-1")
    print(f"{a}-2")`],
    hints:['Outer loop: a from 1 to 3. Inner loop: b from 1 to 2.','range(1, 4) and range(1, 3).','Print f"{a}-{b}" in the inner loop.','for a in range(1, 4):\n    for b in range(1, 3):\n        print(f"{a}-{b}")']},
  power:{can:['Combine every item of one set with every item of another','Predict how many times an inner loop runs'],
    expand:'Print every time on a clock: hours 0-2 with minutes 0, 15, 30, 45.',
    where:'Grids, tables, game boards, image pixels and comparing every pair of items all use nested loops.',
    next:'Next: draw shapes with nested loops.'},
  codex:{title:'Nested loops',body:'The inner loop completes for every round of the outer loop. Total rounds = outer x inner.',snip:R`for row in range(3):
    for col in range(4):
        ...`}
},
{
  id:'r3-15', realm:3, n:15, title:'Patterns and grids',
  teaches:['patterns'], requires:['nested-loops'],
  story:`Ada draws a staircase in the dust with stars. "Shapes are just loops that print without a newline. One new trick and you can draw **anything** in text."`,
  concept:{
    html:`By default \`print\` ends each call with a new line. Change that with \`end=""\`:\n\n\`\`\`\nfor i in range(3):\n    print("*", end="")\nprint()\n\`\`\`\n\nThat prints \`***\` on one line; the lone \`print()\` afterwards moves to the next line.\n\nA triangle uses a nested loop: the **inner** loop prints one row, then a bare \`print()\` ends the row.\n\nShortcut: \`"*" * 3\` makes \`***\`.`,
    analogy:`Typing letters on a typewriter and pressing Enter only at the end of each row.`,
    example:R`for row in range(1, 4):
    for col in range(row):
        print("*", end="")
    print()`},
  predict:{code:R`for i in range(3):
    print("*", end="")
print()`, q:'What prints?', opts:['*** on one line','* on three lines','3'], ans:0,
    why:'end="" stops print from starting a new line, so the stars stay together.'},
  cast:{code:R`for row in range(1, 4):
    for col in range(row):
        print("*", end="")
    print()`, task:'Cast it. Change 4 to 6 for a taller triangle.'},
  bug:{broken:R`for row in range(1, 4):
    for col in range(row):
        print("*", end="")`, task:'The rows run together in one long line. Add what ends each row.',
    cases:[{inputs:[],tests:[['Three rows','lines==["*","**","***"]']]}],
    sol:R`for row in range(1, 4):
    for col in range(row):
        print("*", end="")
    print()`, wrong:[R`for row in range(1, 4):
    for col in range(row):
        print("*", end="")`]},
  write:{prompt:'Ask for the height `N`. Draw an **upside-down** triangle: the first row has `N` stars, the next one fewer, down to 1 star.',
    starter:R`n = int(input("Height: "))
`,
    inputs:['3'],
    cases:[{inputs:['3'],tests:[['Height 3','lines[1:]==["***","**","*"]']]},{inputs:['1'],tests:[['Height 1','lines[1:]==["*"]']]},{inputs:['4'],tests:[['Height 4','lines[1:]==["****","***","**","*"]']]}],
    sol:R`n = int(input("Height: "))
for row in range(n, 0, -1):
    for col in range(row):
        print("*", end="")
    print()`,
    wrong:[R`n = int(input("Height: "))
for row in range(1, n + 1):
    for col in range(row):
        print("*", end="")
    print()`, R`n = int(input("Height: "))
for row in range(n, 0, -1):
    print("*" * n)`],
    hints:['Row lengths go n, n-1, ..., 1. Use a negative step.','for row in range(n, 0, -1): and an inner loop for the stars.','After the inner loop use a bare print() to end the row.','n = int(input("Height: "))\nfor row in range(n, 0, -1):\n    for col in range(row):\n        print("*", end="")\n    print()']},
  power:{can:['Print rows and shapes in text','Use end="" and a closing print()'],
    expand:'Print a pyramid with spaces in front, or a number triangle (1, 12, 123).',
    where:'Text tables, progress bars, ASCII art, console reports and board games all draw with loops.',
    next:'Next: randomness. Dice, loot and surprises.'},
  codex:{title:'Patterns',body:'print(x, end="") stays on the line; print() ends it. Nested loops draw grids.',snip:R`for col in range(3):
    print("*", end="")
print()`}
},
{
  id:'r3-16', realm:3, n:16, title:'Randomness: import random',
  teaches:['random','import'], requires:['patterns'],
  story:`The corridor doors flicker open at random. "Chance," Ada says, "is how games stay fresh. Python keeps a bag of useful spell-books called **modules**. One of them rolls the dice. To use it you must first **import** it."`,
  concept:{
    html:`Python comes with ready-made toolkits called **modules**. Bring one in with \`import\`, **at the top**:\n\n\`\`\`\nimport random\n\nroll = random.randint(1, 6)\nprint(roll)\n\`\`\`\n\n- \`random.randint(a, b)\` gives a whole number from \`a\` to \`b\`, **both included**\n- Without the \`import\` you get \`NameError: name 'random' is not defined\`\n\nEvery run can give a different answer; that is the point.`,
    analogy:`Borrowing a toolbox from a shared shelf: import takes it down, then random.randint is the tool inside.`,
    example:R`import random

roll = random.randint(1, 6)
print("You rolled", roll)`},
  predict:{code:R`import random
roll = random.randint(1, 6)
print(1 <= roll <= 6)`, q:'What prints?', opts:['True','False','It changes every run'], ans:0,
    why:'The roll can be different each time but it is always between 1 and 6, so the check is always True.'},
  cast:{code:R`import random

for i in range(3):
    print("You rolled", random.randint(1, 6))`, task:'Cast it a few times. Do the numbers change?'},
  bug:{broken:R`roll = random.randint(1, 6)
print(1 <= roll <= 6)`, task:'NameError! The random toolkit was never brought in. Add the missing line at the top.',
    cases:[{inputs:[],tests:[['Prints True','out.strip()=="True"'],['Imports random','re.search(r"^import random\\b", src, re.M) is not None']]}],
    sol:R`import random
roll = random.randint(1, 6)
print(1 <= roll <= 6)`, wrong:[R`roll = random.randint(1, 6)
print(1 <= roll <= 6)`]},
  write:{prompt:'Roll a 20-sided die with `random.randint`. Store it in `roll` and print `Roll: ` followed by the number.',
    starter:R`# import first
`,
    cases:[{inputs:[],tests:[['Roll is between 1 and 20','1 <= g.get("roll", 0) <= 20'],['Prints Roll: and the number','lines==["Roll: "+str(g.get("roll"))]'],['Uses randint(1, 20)','re.search(r"randint\\(\\s*1\\s*,\\s*20\\s*\\)", src) is not None']]}],
    sol:R`import random

roll = random.randint(1, 20)
print("Roll:", roll)`,
    wrong:[R`roll = 20
print("Roll:", roll)`, R`import random
roll = random.randint(1, 6)
print("Roll:", roll)`],
    hints:['Start with import random.','roll = random.randint(1, 20)','print("Roll:", roll)','import random\nroll = random.randint(1, 20)\nprint("Roll:", roll)']},
  power:{can:['Import a module','Roll random whole numbers in a range'],
    expand:'Roll two dice and print their sum. Look up random.choice for later.',
    where:'Games, simulations, sampling, test data, shuffling quiz questions and more.',
    next:'Next: put loops, input and random together into a guessing game.'},
  codex:{title:'import random',body:'import random once at the top. random.randint(a, b) gives a whole number from a to b inclusive.',snip:R`import random
print(random.randint(1, 6))`}
},
{
  id:'r3-17', realm:3, n:17, title:'Guessing-game logic',
  teaches:['guess-logic'], requires:['random','menu-loop'],
  story:`At the heart of the Endless Corridor hangs a sealed door and a voice: "Guess my number." Each wrong guess earns a hint. "This," says Sudo, "is the shape of a hundred games. Loop, compare, hint, repeat."`,
  concept:{
    html:`A guessing game is a loop with three jobs:\n\n1. **Ask** for a guess\n2. **Compare** it to the secret and give a hint\n3. **Stop** when it matches (and count the tries)\n\n\`\`\`\nsecret = 7\nattempts = 0\nwhile True:\n    guess = int(input("Guess: "))\n    attempts += 1\n    if guess < secret:\n        print("Too low")\n    elif guess > secret:\n        print("Too high")\n    else:\n        print("You got it!")\n        break\n\`\`\`\n\nHere the secret is fixed so you can test it. Later swap in \`random.randint\` to make a real game.`,
    analogy:`"Warmer, colder" hide-and-seek: each clue narrows the search.`,
    example:R`secret = 7
while True:
    guess = int(input("Guess: "))
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
    else:
        print("You got it!")
        break`},
  predict:{code:R`secret = 7
guess = 9
if guess < secret:
    print("Too low")
elif guess > secret:
    print("Too high")
else:
    print("You got it!")`, q:'What prints?', opts:['Too low','Too high','You got it!'], ans:1,
    why:'9 is bigger than the secret 7, so the hint is Too high.'},
  cast:{code:R`secret = 7
while True:
    guess = int(input("Guess: "))
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
    else:
        print("You got it!")
        break`, task:'Cast it with guesses 3, 9, 7 (one per line).', inputs:['3','9','7']},
  bug:{broken:R`secret = 7
guess = int(input("Guess: "))
if guess < secret:
    print("Too high")
elif guess > secret:
    print("Too low")
else:
    print("You got it!")`, task:'The hints are swapped: a guess of 3 says Too high. Fix them.',
    cases:[{inputs:['3'],tests:[['3 is Too low','lines[-1]=="Too low"']]},{inputs:['9'],tests:[['9 is Too high','lines[-1]=="Too high"']]},{inputs:['7'],tests:[['7 wins','lines[-1]=="You got it!"']]}],
    sol:R`secret = 7
guess = int(input("Guess: "))
if guess < secret:
    print("Too low")
elif guess > secret:
    print("Too high")
else:
    print("You got it!")`, wrong:[R`secret = 7
guess = int(input("Guess: "))
if guess < secret:
    print("Too high")
elif guess > secret:
    print("Too low")
else:
    print("You got it!")`]},
  write:{prompt:'The secret is 7. Keep asking `Guess: `, print `Too low` / `Too high`, and on a correct guess print `You got it!` then `Attempts: ` and the number of guesses, then stop.',
    starter:R`secret = 7
attempts = 0
`,
    inputs:['3','9','7'],
    cases:[{inputs:['3','9','7'],tests:[['Low, high, win','[l for l in lines if l in ("Too low","Too high","You got it!") or l.startswith("Attempts:")]==["Too low","Too high","You got it!","Attempts: 3"]']]},{inputs:['7'],tests:[['Win first try','[l for l in lines if l in ("Too low","Too high","You got it!") or l.startswith("Attempts:")]==["You got it!","Attempts: 1"]']]},{inputs:['10','8','7'],tests:[['Two highs then win','[l for l in lines if l in ("Too low","Too high","You got it!") or l.startswith("Attempts:")]==["Too high","Too high","You got it!","Attempts: 3"]']]}],
    sol:R`secret = 7
attempts = 0
while True:
    guess = int(input("Guess: "))
    attempts += 1
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
    else:
        print("You got it!")
        print("Attempts:", attempts)
        break`,
    wrong:[R`secret = 7
attempts = 0
guess = int(input("Guess: "))
attempts += 1
if guess == secret:
    print("You got it!")
    print("Attempts:", attempts)
else:
    print("Too low")`, R`secret = 7
attempts = 0
while True:
    guess = int(input("Guess: "))
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
    else:
        print("You got it!")
        print("Attempts:", attempts)
        break`],
    hints:['Loop forever, asking for a guess and adding 1 to attempts.','Hint with if / elif; in the else (correct) print both lines and break.','attempts += 1 must happen every round, before the checks.','secret = 7\nattempts = 0\nwhile True:\n    guess = int(input("Guess: "))\n    attempts += 1\n    if guess < secret:\n        print("Too low")\n    elif guess > secret:\n        print("Too high")\n    else:\n        print("You got it!")\n        print("Attempts:", attempts)\n        break']},
  power:{can:['Build a complete loop-compare-hint game','Count attempts'],
    expand:'Replace secret = 7 with random.randint(1, 100), and give up after 7 tries.',
    where:'The same structure drives login retries, quiz games, number puzzles and many CLI tools.',
    next:'Next: a loop with an else clause.'},
  codex:{title:'Guessing game',body:'Ask, compare, hint, count, break when right.',snip:R`while True:
    guess = int(input("Guess: "))
    attempts += 1`}
},
{
  id:'r3-18', realm:3, n:18, title:'Loop else: did the loop finish without break?',
  teaches:['loop-else'], requires:['guess-logic','flag-search'],
  story:`"There's a neater way to say *'I searched everywhere and found nothing',*" Ada whispers. She tacks an \`else\` to the end of the loop. "It only fires if the loop **ran to the end** without a break."`,
  concept:{
    html:`A loop can have an \`else\` block. It runs **only if the loop finished normally**, without hitting \`break\`.\n\n\`\`\`\nfor n in range(20, 31):\n    if n % 11 == 0:\n        print("Found", n)\n        break\nelse:\n    print("None found")\n\`\`\`\n\nThe \`else\` lines up with the \`for\`, **not** with the \`if\`. It replaces the flag from the last lesson for search loops. Rare in beginner code but common in professional code.`,
    analogy:`"If you reach the end of the hall without finding the door, then say: no door."`,
    example:R`for n in range(20, 31):
    if n % 11 == 0:
        print("Found", n)
        break
else:
    print("None found")`},
  predict:{code:R`for d in range(2, 7):
    if 7 % d == 0:
        print("divisor", d)
        break
else:
    print("no divisor")`, q:'What prints?', opts:['divisor 7','no divisor','Nothing'], ans:1,
    why:'No number from 2 to 6 divides 7, so break never fires and the else block runs.'},
  cast:{code:R`for n in range(20, 31):
    if n % 11 == 0:
        print("Found", n)
        break
else:
    print("None found")`, task:'Cast it. Change the range to 23 to 32.'},
  bug:{broken:R`n = int(input("Number: "))
for d in range(2, n):
    if n % d == 0:
        print("Not prime")
        break
    else:
        print("Prime")`, task:'It prints Prime again and again (the else is attached to the if). Line the else up with the for.',
    cases:[{inputs:['9'],tests:[['9 only says Not prime','[l for l in lines if l in ("Prime","Not prime")]==["Not prime"]']]},{inputs:['7'],tests:[['7 says Prime once','[l for l in lines if l in ("Prime","Not prime")]==["Prime"]']]}],
    sol:R`n = int(input("Number: "))
for d in range(2, n):
    if n % d == 0:
        print("Not prime")
        break
else:
    print("Prime")`, wrong:[R`n = int(input("Number: "))
for d in range(2, n):
    if n % d == 0:
        print("Not prime")
        break
    else:
        print("Prime")`]},
  write:{prompt:'Ask for `Low: ` and `High: `. Search from Low to High (inclusive) for a multiple of 11. Print `Found ` and the number and stop at the first one. If there is none print `None found`. Use `for ... else` (no flag, no True/False).',
    starter:R`low = int(input("Low: "))
high = int(input("High: "))
`,
    inputs:['20','30'],
    cases:[{inputs:['20','30'],tests:[['20-30 finds 22','lines[-1]=="Found 22"'],['No True/False flag','"True" not in src and "False" not in src'],['Has break and an else at the loop level','"break" in src and re.search(r"^else:", src, re.M) is not None']]},{inputs:['23','32'],tests:[['23-32 none','lines[-1]=="None found"']]},{inputs:['11','11'],tests:[['11-11 finds 11','lines[-1]=="Found 11"']]},{inputs:['1','100'],tests:[['stops at first (11)','lines[-1]=="Found 11"']]}],
    sol:R`low = int(input("Low: "))
high = int(input("High: "))
for n in range(low, high + 1):
    if n % 11 == 0:
        print("Found", n)
        break
else:
    print("None found")`,
    wrong:[R`low = int(input("Low: "))
high = int(input("High: "))
found = False
for n in range(low, high + 1):
    if n % 11 == 0:
        print("Found", n)
        found = True
        break
if not found:
    print("None found")`, R`low = int(input("Low: "))
high = int(input("High: "))
for n in range(low, high):
    if n % 11 == 0:
        print("Found", n)
        break
else:
    print("None found")`],
    hints:['Loop n from low to high inclusive: range(low, high + 1).','Inside: if n % 11 == 0: print and break.','Put else: at the same indent as for (column 0).','low = int(input("Low: "))\nhigh = int(input("High: "))\nfor n in range(low, high + 1):\n    if n % 11 == 0:\n        print("Found", n)\n        break\nelse:\n    print("None found")']},
  power:{can:['Use for/else for clean search loops','Spot where else belongs (loop, not if)'],
    expand:'Rewrite the prime checker from lesson 12 with for/else.',
    where:'Search with a "not found" fallback, retry loops and validation are neat with loop-else.',
    next:'Next: the most common bug in all of programming, off-by-one.'},
  codex:{title:'Loop else',body:'else after a loop runs only if the loop did NOT break. Line it up with the for/while.',snip:R`for x in data:
    if x == target:
        break
else:
    print("not found")`}
}
);
