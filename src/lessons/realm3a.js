// REALM 3 — LOOPS OF REPETITION (26 lessons) — part A (lessons 1-9)
LESSONS.push(
{
  id:'r3-01', realm:3, n:1, title:'while: repeat while something is true',
  teaches:['while'], requires:['realm2-gap'],
  story:`Beyond the gate, the Endless Corridor stretches into the dark, lined with unlit torches. Sudo sighs. "Lighting them one by one would take forever. Teach the spell to do the same thing again and again."\n\nAda lifts a finger. "That's a **loop**. Let's start with the simplest: **while**."`,
  concept:{
    html:`A \`while\` loop repeats its indented block **as long as** its condition stays True.\n\n\`\`\`\ncount = 3\nwhile count > 0:\n    print(count)\n    count = count - 1\nprint("Liftoff")\n\`\`\`\n\nPython checks the condition, runs the block, checks again, and so on. When the condition turns False, the loop ends and the code below it continues.\n\nIt looks like \`if\`, but an \`if\` runs once; a \`while\` runs again and again.`,
    analogy:`"While the kettle is cold, keep waiting." Check, act, check again.`,
    example:R`count = 3
while count > 0:
    print(count)
    count = count - 1
print("Liftoff")`},
  predict:{code:R`count = 3
while count > 0:
    print(count)
    count = count - 1
print("Liftoff")`, q:'What prints?', opts:['3 2 1 Liftoff','1 2 3 Liftoff','3 2 1 0 Liftoff'], ans:0,
    why:'It prints 3, 2, 1. When count reaches 0 the condition (0 > 0) is False, so the loop stops before printing 0.'},
  cast:{code:R`count = 3
while count > 0:
    print(count)
    count = count - 1
print("Liftoff")`, task:'Cast it. Change the starting count to 5 and cast again.'},
  bug:{broken:R`torches = 3
if torches > 0:
    print("Torch lit")
    torches = torches - 1`, task:'Three torches need lighting but only one is lit. An `if` runs once. Use a loop instead.',
    cases:[{inputs:[],tests:[['Prints Torch lit three times','lines==["Torch lit"]*3'],['Uses while','re.search(r"^while\\b", src, re.M) is not None']]}],
    sol:R`torches = 3
while torches > 0:
    print("Torch lit")
    torches = torches - 1`, wrong:[R`torches = 3
if torches > 0:
    print("Torch lit")
    torches = torches - 1`, R`print("Torch lit")
print("Torch lit")
print("Torch lit")`]},
  write:{prompt:'Ask for a starting number. Count down to 1 using a `while` loop, then print `Go!`.',
    starter:R`start = int(input("Start: "))
`,
    inputs:['3'],
    cases:[{inputs:['3'],tests:[['3 counts 3,2,1 then Go!','[l for l in lines if l.isdigit() or l=="Go!"]==["3","2","1","Go!"]'],['Uses while','re.search(r"^while\\b", src, re.M) is not None']]},{inputs:['5'],tests:[['5 counts down fully','[l for l in lines if l.isdigit() or l=="Go!"]==["5","4","3","2","1","Go!"]']]}],
    sol:R`start = int(input("Start: "))
while start > 0:
    print(start)
    start = start - 1
print("Go!")`,
    wrong:[R`start = int(input("Start: "))
print(start)
print("Go!")`, R`start = int(input("Start: "))
while start > 1:
    print(start)
    start = start - 1
print("Go!")`],
    hints:['Loop while the number is above zero.','while start > 0: print it, then subtract 1.','The line printing Go! is NOT indented, so it runs once after the loop.','start = int(input("Start: "))\nwhile start > 0:\n    print(start)\n    start = start - 1\nprint("Go!")']},
  power:{can:['Repeat code while a condition holds','Count down to a stop point'],
    expand:'Make a countdown that counts by 2s: 10, 8, 6, 4, 2.',
    where:'Retry logic, polling a server, game loops and timers all start from a while.',
    next:'Next: counters, the variable that makes loops work.'},
  codex:{title:'while',body:'while condition: repeats the block as long as the condition is True. Change something inside the loop or it never stops.',snip:R`while count > 0:
    print(count)
    count = count - 1`}
},
{
  id:'r3-02', realm:3, n:2, title:'Counters: the heartbeat of a loop',
  teaches:['counters'], requires:['while'],
  story:`The first torch flares and the corridor shivers. "Every loop has a heartbeat," Ada says, pointing at a number carved on the wall that ticks upward. "A **counter**: start it, check it, change it."`,
  concept:{
    html:`Most \`while\` loops follow a recipe:\n\n1. **Start** a counter: \`n = 1\`\n2. **Check** it in the condition: \`while n <= 3:\`\n3. **Change** it in the body: \`n += 1\`\n\nIf you forget step 3 the loop never ends. If you start or check wrongly you get one too many or too few rounds.`,
    analogy:`A turnstile click-counter at a gate: start at zero, click once per person, stop at the limit.`,
    example:R`n = 1
while n <= 3:
    print("Step", n)
    n += 1`},
  predict:{code:R`n = 1
while n <= 3:
    print("Step", n)
    n += 1`, q:'How many lines print?', opts:['2','3','4'], ans:1,
    why:'n runs 1, 2, 3. When n becomes 4 the check (4 <= 3) fails.'},
  cast:{code:R`n = 1
while n <= 3:
    print("Step", n)
    n += 1`, task:'Cast it. Change 3 to 5 in the condition.'},
  bug:{broken:R`n = 0
while n <= 3:
    print(n)
    n += 1`, task:'It should count 1, 2, 3 but starts at 0 and prints 0, 1, 2, 3. Fix the start value.',
    cases:[{inputs:[],tests:[['Prints 1, 2, 3','lines==["1","2","3"]']]}],
    sol:R`n = 1
while n <= 3:
    print(n)
    n += 1`, wrong:[R`n = 0
while n <= 3:
    print(n)
    n += 1`, R`n = 1
while n < 3:
    print(n)
    n += 1`]},
  write:{prompt:'Ask `How many torches? ` (whole number). Light them one at a time with a counter, printing `Torch 1`, `Torch 2`, and so on.',
    starter:R`total = int(input("How many torches? "))
`,
    inputs:['3'],
    cases:[{inputs:['3'],tests:[['3 torches','[l for l in lines if l.startswith("Torch ")]==["Torch 1","Torch 2","Torch 3"]']]},{inputs:['1'],tests:[['1 torch','[l for l in lines if l.startswith("Torch ")]==["Torch 1"]']]},{inputs:['0'],tests:[['0 torches prints none','[l for l in lines if l.startswith("Torch ")]==[]']]}],
    sol:R`total = int(input("How many torches? "))
n = 1
while n <= total:
    print("Torch", n)
    n += 1`,
    wrong:[R`total = int(input("How many torches? "))
n = 0
while n < total:
    print("Torch", n)
    n += 1`, R`total = int(input("How many torches? "))
print("Torch 1")`],
    hints:['Start a counter at 1.','while n <= total:','Print "Torch", n and add 1 each time.','total = int(input("How many torches? "))\nn = 1\nwhile n <= total:\n    print("Torch", n)\n    n += 1']},
  power:{can:['Build the start, check, change loop recipe','Run a loop a chosen number of times'],
    expand:'Print a rune number for each of 10 runes, but start at 100.',
    where:'Pagination, progress counters and retry attempts all use a counter.',
    next:'Next: what happens when the loop never stops, and how to escape.'},
  codex:{title:'Counters',body:'Start it, check it in the while condition, change it inside the loop.',snip:R`n = 1
while n <= 3:
    n += 1`}
},
{
  id:'r3-03', realm:3, n:3, title:'Infinite loops and how to escape',
  teaches:['infinite-loop'], requires:['counters'],
  story:`A torch ahead burns green. Beyond it the corridor loops back on itself. Sudo grabs your sleeve. "That's a trap. A loop whose condition **never** turns False. Don't worry, even masters write one by accident."`,
  concept:{
    html:`An **infinite loop** never ends because the condition stays True forever, usually because you forgot to change the counter.\n\n\`\`\`\nfuel = 3\nwhile fuel > 0:\n    print("Burning")      # fuel never changes!\n\`\`\`\n\nYou will write one by accident, everybody does. In the Spellbook, a loop that runs too long or prints too much is stopped for you with a **timeout** message. On your own computer you stop one with **Ctrl+C**.\n\nThe cure: ask "what changes inside the loop so the condition eventually turns False?"`,
    analogy:`A hamster wheel with no exit: the hamster is working hard but never arrives anywhere.`,
    example:R`fuel = 3
while fuel > 0:
    print("Burning")
    fuel = fuel - 1`},
  predict:{code:R`fuel = 3
while fuel > 0:
    print("Burning")`, q:'What happens when this runs?', opts:['Prints Burning 3 times','Prints Burning forever until Python stops it','Prints nothing'], ans:1,
    why:'fuel never changes, so fuel > 0 is always True. The loop never ends.'},
  cast:{code:R`fuel = 3
while fuel > 0:
    print("Burning")`, task:'Cast this runaway spell on purpose. The Spellbook will stop it safely. Read the message it gives you.', expectError:true},
  bug:{broken:R`fuel = 3
while fuel > 0:
    print("Burning")`, task:'This loop never ends. Make fuel go down each round so it prints Burning exactly 3 times.',
    cases:[{inputs:[],tests:[['Prints Burning three times','lines==["Burning"]*3']]}],
    sol:R`fuel = 3
while fuel > 0:
    print("Burning")
    fuel = fuel - 1`, wrong:[R`fuel = 3
while fuel > 0:
    print("Burning")
    fuel = fuel + 1`, R`fuel = 3
while fuel > 0:
    print("Burning")`]},
  write:{prompt:'`hp` starts at 100. While `hp > 0`, take 25 damage and print `HP: ` followed by the new hp. It should end after printing `HP: 0`.',
    starter:R`hp = 100
`,
    cases:[{inputs:[],tests:[['Prints HP 75, 50, 25, 0','lines==["HP: 75","HP: 50","HP: 25","HP: 0"]']]}],
    sol:R`hp = 100
while hp > 0:
    hp -= 25
    print("HP:", hp)`,
    wrong:[R`hp = 100
while hp > 0:
    print("HP:", hp)`, R`hp = 100
while hp > 0:
    hp -= 30
    print("HP:", hp)`],
    hints:['The loop condition is hp > 0.','Inside the loop, subtract 25 so the condition can become False.','Print after subtracting to show the new value.','hp = 100\nwhile hp > 0:\n    hp -= 25\n    print("HP:", hp)']},
  power:{can:['Recognise an infinite loop','Always ask what changes inside the loop','Read a timeout message calmly'],
    expand:'Write a loop on purpose that you would need Ctrl+C for, then fix it.',
    where:'Hung programs and frozen apps are often loops that never ended. Spotting them is a core debugging skill.',
    next:'Next: the loop that counts for you, for and range().'},
  codex:{title:'Infinite loops',body:'If nothing changes the condition, the loop never ends. Change a variable in the body. Stop a runaway with Ctrl+C.',snip:R`# inside the loop, change something
fuel = fuel - 1`}
},
{
  id:'r3-04', realm:3, n:4, title:'for and range(): let Python count for you',
  teaches:['for-range'], requires:['infinite-loop'],
  story:`"Counters work," Ada says, "but writing start, check and change every time is tedious. Most of the time you know **how many** times you want something. For that there's a tidier spell."`,
  concept:{
    html:`\`for\` with \`range()\` repeats a block a set number of times and handles the counter for you:\n\n\`\`\`\nfor i in range(3):\n    print("Spark", i)\n\`\`\`\n\n\`range(3)\` gives \`0, 1, 2\`: it **starts at 0** and stops **before** 3. The variable \`i\` takes each value in turn.\n\nUse \`for\` when you know how many rounds. Use \`while\` when you repeat until something happens.`,
    analogy:`A conveyor belt that hands you the numbers one at a time.`,
    example:R`for i in range(3):
    print("Spark", i)`},
  predict:{code:R`for i in range(3):
    print(i)`, q:'What prints?', opts:['1 2 3','0 1 2','0 1 2 3'], ans:1,
    why:'range(3) starts at 0 and stops before 3.'},
  cast:{code:R`for i in range(3):
    print("Spark", i)`, task:'Cast it. Change 3 to 5.'},
  bug:{broken:R`for i range(5):
    print("Spark")`, task:'The for line is missing a word. Fix it so Spark prints 5 times.',
    cases:[{inputs:[],tests:[['Prints Spark 5 times','lines==["Spark"]*5']]}],
    sol:R`for i in range(5):
    print("Spark")`, wrong:[R`for i range(5):
    print("Spark")`, R`print("Spark")`]},
  write:{prompt:'Ask `How many sparks? ` (whole number). Use a `for` loop to print `Spark` that many times.',
    starter:R`times = int(input("How many sparks? "))
`,
    inputs:['3'],
    cases:[{inputs:['3'],tests:[['3 sparks','[l for l in lines if l=="Spark"]==["Spark"]*3'],['Uses for','re.search(r"^for\\b", src, re.M) is not None']]},{inputs:['0'],tests:[['0 sparks prints none','[l for l in lines if l=="Spark"]==[]']]}],
    sol:R`times = int(input("How many sparks? "))
for i in range(times):
    print("Spark")`,
    wrong:[R`times = int(input("How many sparks? "))
print("Spark")`, R`times = int(input("How many sparks? "))
n = 0
while n < times:
    print("Spark")
    n += 1`],
    hints:['Use range(times) to repeat that many times.','for i in range(times):','Print Spark inside the indented block.','times = int(input("How many sparks? "))\nfor i in range(times):\n    print("Spark")']},
  power:{can:['Repeat code an exact number of times','Use the loop variable i'],
    expand:'Print your name 10 times, numbering each line.',
    where:'Batch jobs, generating many items and repeating checks all use for + range.',
    next:'Next: choose where range starts, stops and how big the steps are.'},
  codex:{title:'for + range',body:'for i in range(n): repeats n times with i = 0 ... n-1. range stops BEFORE the end number.',snip:R`for i in range(3):
    print(i)`}
},
{
  id:'r3-05', realm:3, n:5, title:'range(start, stop, step)',
  teaches:['range-step'], requires:['for-range'],
  story:`"Zero is not always where you want to begin," says Ada, handing you a ruler with a movable cap. "range can start anywhere, stop anywhere, and skip ahead by any step, even backwards."`,
  concept:{
    html:`\`range\` takes up to three numbers:\n\n- \`range(stop)\`: 0 up to stop - 1\n- \`range(start, stop)\`: start up to stop - 1\n- \`range(start, stop, step)\`: jumps by step\n\nThe **stop is never included**.\n\n\`range(1, 6)\` gives 1 2 3 4 5\n\`range(0, 10, 2)\` gives 0 2 4 6 8\n\`range(5, 0, -1)\` gives 5 4 3 2 1 (a negative step counts down)`,
    analogy:`Stairs: choose the first step, the last (excluded) step, and how many you climb at a time.`,
    example:R`for n in range(2, 10, 3):
    print(n)`},
  predict:{code:R`for n in range(2, 10, 3):
    print(n)`, q:'What prints?', opts:['2 5 8','2 5 8 11','3 6 9'], ans:0,
    why:'Start at 2, add 3 each time (2, 5, 8). The next one would be 11, which is past the stop.'},
  cast:{code:R`for n in range(5, 0, -1):
    print(n)`, task:'Cast it. Change the step to -2.'},
  bug:{broken:R`for n in range(1, 10):
    print(n)`, task:'Sudo wants 1 to 10 inclusive, but 10 is missing. Fix the stop value.',
    cases:[{inputs:[],tests:[['Prints 1 to 10','lines==[str(i) for i in range(1, 11)]']]}],
    sol:R`for n in range(1, 11):
    print(n)`, wrong:[R`for n in range(1, 10):
    print(n)`, R`for n in range(10):
    print(n)`]},
  write:{prompt:'Print the multiples of 5 from 5 to 50 (inclusive), one per line, using `range` with three numbers.',
    starter:R`# range(start, stop, step)
`,
    cases:[{inputs:[],tests:[['Prints 5, 10 ... 50','lines==[str(i) for i in range(5, 51, 5)]'],['Uses a 3-number range','re.search(r"range\\([^)]*,[^)]*,[^)]*\\)", src) is not None']]}],
    sol:R`for n in range(5, 51, 5):
    print(n)`,
    wrong:[R`for n in range(5, 50, 5):
    print(n)`, R`for n in range(1, 51):
    if n % 5 == 0:
        print(n)`],
    hints:['Start 5, step 5.','The stop must be one step past 50, so 51 works.','for n in range(5, 51, 5):','for n in range(5, 51, 5):\n    print(n)']},
  power:{can:['Count from anywhere to anywhere','Skip by any step','Count backwards'],
    expand:'Print only the odd numbers 1 to 99. Then print 10 down to 0 by twos.',
    where:'Pagination, schedules (every 15 minutes), sampling data and countdowns.',
    next:'Next: loop over letters in text.'},
  codex:{title:'range',body:'range(start, stop, step). Stop is excluded. Negative step counts down.',snip:R`range(1, 11)      # 1..10
range(0, 10, 2)   # 0,2,4,6,8
range(5, 0, -1)   # 5,4,3,2,1`}
},
{
  id:'r3-06', realm:3, n:6, title:'Looping over text, and len()',
  teaches:['loop-text','len'], requires:['range-step'],
  story:`Letters glow in the corridor wall: R-U-N-E. "A word is a row of letters," Ada says. "A for loop can walk along it one letter at a time. And **len()** counts how many there are."`,
  concept:{
    html:`A \`for\` loop can walk through text, one character at a time:\n\n\`\`\`\nfor ch in "rune":\n    print(ch)\n\`\`\`\n\nThe loop variable (\`ch\`) is each character in order, including spaces.\n\n\`len(text)\` tells you how many characters there are: \`len("rune")\` is \`4\`.`,
    analogy:`Running your finger along a line of text, saying each letter aloud.`,
    example:R`word = "rune"
for ch in word:
    print(ch)
print(len(word))`},
  predict:{code:R`for ch in "hi!":
    print(ch)`, q:'What prints?', opts:['hi!','h, i, ! on three lines','3'], ans:1,
    why:'The loop gives one character per round: h, then i, then !.'},
  cast:{code:R`word = "rune"
for ch in word:
    print(ch)
print(len(word))`, task:'Cast it. Change the word.'},
  bug:{broken:R`word = input("Word: ")
for ch in word:
    print(word)`, task:'It should print each letter, but it prints the whole word every time. Fix the print.',
    cases:[{inputs:['Ada'],tests:[['Prints A, d, a','lines[1:]==["A","d","a"]']]}],
    sol:R`word = input("Word: ")
for ch in word:
    print(ch)`, wrong:[R`word = input("Word: ")
for ch in word:
    print(word)`]},
  write:{prompt:'Ask for a word. Print each letter on its own line, then print `Letters: ` followed by how many letters it has.',
    starter:R`word = input("Word: ")
`,
    inputs:['Ada'],
    cases:[{inputs:['Ada'],tests:[['Letters then count','lines[1:]==list(inputs[0])+["Letters: "+str(len(inputs[0]))]']]},{inputs:['rune'],tests:[['Works for rune','lines[1:]==list(inputs[0])+["Letters: "+str(len(inputs[0]))]']]}],
    sol:R`word = input("Word: ")
for ch in word:
    print(ch)
print("Letters:", len(word))`,
    wrong:[R`word = input("Word: ")
print(word)
print("Letters:", len(word))`, R`word = input("Word: ")
for ch in word:
    print(ch)`],
    hints:['for ch in word: walks through the letters.','Print ch inside the loop.','After the loop (not indented) print the length.','word = input("Word: ")\nfor ch in word:\n    print(ch)\nprint("Letters:", len(word))']},
  power:{can:['Process text one character at a time','Count characters with len()'],
    expand:'Print each letter of your name with its position number.',
    where:'Spell checkers, text parsers, password rules and file readers all walk through text.',
    next:'Next: escape a loop early with break.'},
  codex:{title:'Looping over text',body:'for ch in text: gives one character at a time. len(text) is how many characters.',snip:R`for ch in "rune":
    print(ch)`}
},
{
  id:'r3-07', realm:3, n:7, title:'break: leave the loop early',
  teaches:['break'], requires:['loop-text'],
  story:`A door gleams halfway down the corridor. "No need to walk the whole hall once you've found it," Sudo says. "When you've got what you came for, **break** out."`,
  concept:{
    html:`\`break\` ends the loop **immediately** and continues with the code after it.\n\n\`\`\`\nfor n in range(1, 100):\n    if n * n > 50:\n        print(n)\n        break\n\`\`\`\n\nThis finds the first \`n\` whose square is over 50 (it's 8) and stops, instead of checking all 99.\n\nTypical pattern: **search, then break when found**.`,
    analogy:`Looking for your keys through the house: once you find them you stop searching.`,
    example:R`for n in range(1, 100):
    if n * n > 50:
        print(n)
        break`},
  predict:{code:R`for n in range(5):
    if n == 3:
        break
    print(n)`, q:'What prints?', opts:['0 1 2','0 1 2 3','0 1 2 3 4'], ans:0,
    why:'When n reaches 3, break ends the loop before the print.'},
  cast:{code:R`for n in range(1, 100):
    if n * n > 50:
        print(n)
        break`, task:'Cast it. Change 50 to 200.'},
  bug:{broken:R`for n in range(1, 100):
    if n * n > 50:
        print(n)`, task:'It prints every number from 8 up, not just the first. Add the missing keyword so it stops at the first.',
    cases:[{inputs:[],tests:[['Prints only 8','lines==["8"]']]}],
    sol:R`for n in range(1, 100):
    if n * n > 50:
        print(n)
        break`, wrong:[R`for n in range(1, 100):
    if n * n > 50:
        print(n)`]},
  write:{prompt:'Ask for a `Limit: `. Find the **first** number from 1 upward whose square is **greater than** the limit, print it, and stop.',
    starter:R`limit = int(input("Limit: "))
`,
    inputs:['50'],
    cases:[{inputs:['50'],tests:[['50 gives 8','lines[-1]=="8"'],['Prints one number only','len(lines)==2'],['Uses break','"break" in src']]},{inputs:['100'],tests:[['100 gives 11','lines[-1]=="11"']]},{inputs:['1'],tests:[['1 gives 2','lines[-1]=="2"']]}],
    sol:R`limit = int(input("Limit: "))
for n in range(1, 1000):
    if n * n > limit:
        print(n)
        break`,
    wrong:[R`limit = int(input("Limit: "))
for n in range(1, 1000):
    if n * n > limit:
        print(n)`, R`limit = int(input("Limit: "))
for n in range(1, 1000):
    if n * n >= limit:
        print(n)
        break`],
    hints:['Loop n from 1 upward.','If n * n > limit: print and break.','Use a big stop such as 1000.','limit = int(input("Limit: "))\nfor n in range(1, 1000):\n    if n * n > limit:\n        print(n)\n        break']},
  power:{can:['Stop a loop the moment you find what you need','Write search loops'],
    expand:'Find the first number over 100 that is divisible by both 7 and 11.',
    where:'Searching records, finding the first match and stopping on an error all use break.',
    next:'Next: skip one round without stopping, with continue.'},
  codex:{title:'break',body:'break ends the loop at once. Great for search: find it, then stop.',snip:R`for n in range(100):
    if found:
        break`}
},
{
  id:'r3-08', realm:3, n:8, title:'continue: skip this round',
  teaches:['continue'], requires:['break'],
  story:`Some torches in the corridor are already lit. "Skip those," Ada says. "Don't stop the whole walk. Just **move on to the next one**."`,
  concept:{
    html:`\`continue\` skips the **rest of the current round** and jumps to the next one. The loop keeps going.\n\n\`\`\`\nfor n in range(1, 6):\n    if n == 3:\n        continue\n    print(n)\n\`\`\`\n\nThis prints 1 2 4 5. \`break\` leaves the loop; \`continue\` only skips one round.`,
    analogy:`Walking a shop aisle and walking past one item without stopping the whole shop trip.`,
    example:R`for n in range(1, 6):
    if n == 3:
        continue
    print(n)`},
  predict:{code:R`for n in range(1, 6):
    if n == 3:
        continue
    print(n)`, q:'What prints?', opts:['1 2 4 5','1 2','1 2 3 4 5'], ans:0,
    why:'On the round where n is 3, continue skips the print. The loop carries on with 4 and 5.'},
  cast:{code:R`for n in range(1, 6):
    if n == 3:
        continue
    print(n)`, task:'Cast it. Skip a different number.'},
  bug:{broken:R`for n in range(1, 6):
    if n == 3:
        break
    print(n)`, task:'It should skip 3 and carry on to print 4 and 5, but it stops entirely. Fix it.',
    cases:[{inputs:[],tests:[['Prints 1 2 4 5','lines==["1","2","4","5"]']]}],
    sol:R`for n in range(1, 6):
    if n == 3:
        continue
    print(n)`, wrong:[R`for n in range(1, 6):
    if n == 3:
        break
    print(n)`]},
  write:{prompt:'Print 1 to 10 but **skip the multiples of 3**. Use `continue`.',
    starter:R`for n in range(1, 11):
`,
    cases:[{inputs:[],tests:[['Prints 1 2 4 5 7 8 10','lines==["1","2","4","5","7","8","10"]'],['Uses continue','"continue" in src']]}],
    sol:R`for n in range(1, 11):
    if n % 3 == 0:
        continue
    print(n)`,
    wrong:[R`for n in range(1, 11):
    if n % 3 != 0:
        print(n)`, R`for n in range(1, 11):
    print(n)`],
    hints:['A multiple of 3 has n % 3 == 0.','Inside the loop: if n % 3 == 0: continue','Then print(n).','for n in range(1, 11):\n    if n % 3 == 0:\n        continue\n    print(n)']},
  power:{can:['Skip unwanted rounds without ending the loop','Tell break and continue apart'],
    expand:'Print 1 to 20 skipping every even number.',
    where:'Skipping blank lines, bad records and already-processed items in real data jobs.',
    next:'Next: accumulators, adding things up as you loop.'},
  codex:{title:'continue',body:'continue skips the rest of this round and starts the next. break ends the whole loop.',snip:R`if skip:
    continue`}
},
{
  id:'r3-09', realm:3, n:9, title:'Accumulators: add things up',
  teaches:['accumulator'], requires:['continue','augassign'],
  story:`The last torch of the first hall is a bank: gold coins spill from an urn, one at a time. "A loop's best trick," Ada says, "is **remembering** what it has seen. Start a total at zero and add to it every round."`,
  concept:{
    html:`An **accumulator** is a variable you build up inside a loop:\n\n\`\`\`\ntotal = 0\nfor n in range(1, 6):\n    total += n\nprint(total)\n\`\`\`\n\nRecipe:\n1. Set it to a starting value **before** the loop (\`0\` for sums)\n2. Update it **inside** the loop\n3. Use the result **after** the loop (not indented)\n\nThe same pattern builds products, counts and joined text.`,
    analogy:`A piggy bank: start empty, drop in a coin every round, count it when you are done.`,
    example:R`total = 0
for n in range(1, 6):
    total += n
print(total)`},
  predict:{code:R`total = 0
for n in range(1, 5):
    total += n * 2
print(total)`, q:'What prints?', opts:['20','10','12'], ans:0,
    why:'n runs 1 to 4: 2 + 4 + 6 + 8 = 20.'},
  cast:{code:R`total = 0
for n in range(1, 6):
    total += n
print(total)`, task:'Cast it. Change range(1, 6) to range(1, 101).'},
  bug:{broken:R`total = 0
for n in range(1, 6):
    total = n
print(total)`, task:'The total should be 15 but it keeps only the last number. Add to the total instead of replacing it.',
    cases:[{inputs:[],tests:[['Prints 15','out.strip()=="15"']]}],
    sol:R`total = 0
for n in range(1, 6):
    total += n
print(total)`, wrong:[R`total = 0
for n in range(1, 6):
    total = n
print(total)`]},
  write:{prompt:'Ask `Up to: ` and add all the whole numbers from 1 to that number. Print `Total: ` and the sum. Use a loop (not a formula).',
    starter:R`top = int(input("Up to: "))
`,
    inputs:['4'],
    cases:[{inputs:['4'],tests:[['4 gives 10','lines[-1]=="Total: 10"'],['Uses a loop','re.search(r"\\b(for|while)\\b", src) is not None']]},{inputs:['100'],tests:[['100 gives 5050','lines[-1]=="Total: 5050"']]},{inputs:['0'],tests:[['0 gives 0','lines[-1]=="Total: 0"']]}],
    sol:R`top = int(input("Up to: "))
total = 0
for n in range(1, top + 1):
    total += n
print("Total:", total)`,
    wrong:[R`top = int(input("Up to: "))
print("Total:", top * (top + 1) // 2)`, R`top = int(input("Up to: "))
total = 0
for n in range(1, top):
    total += n
print("Total:", total)`],
    hints:['Start total at 0 before the loop.','Loop n from 1 to top inclusive: range(1, top + 1).','total += n inside; print after the loop.','top = int(input("Up to: "))\ntotal = 0\nfor n in range(1, top + 1):\n    total += n\nprint("Total:", total)']},
  power:{can:['Build running totals, counts and products','Use the start, update inside, use after recipe'],
    expand:'Change += to *= and start at 1 to build a factorial (5! = 120).',
    where:'Totals on invoices, scores in games, sums in spreadsheets and statistics all accumulate.',
    next:'Next: tracking the biggest and smallest seen.'},
  codex:{title:'Accumulators',body:'Start the variable before the loop, update it inside, use it after the loop.',snip:R`total = 0
for n in range(1, 6):
    total += n
print(total)`}
}
);
