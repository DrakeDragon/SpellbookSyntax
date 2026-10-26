// REALM 3 — LOOPS OF REPETITION — part C (lessons 19-26)
LESSONS.push(
{
  id:'r3-19', realm:3, n:19, title:'Off-by-one errors',
  teaches:['off-by-one'], requires:['loop-else'],
  story:`A fence runs along the corridor wall. Ada counts the posts: five. "And the sections between them?" "...Five?" you guess. "Four." She smiles. "This tiny slip, one too many or one too few, is the most famous bug in programming. Meet the **off-by-one**."`,
  concept:{
    html:`An **off-by-one error** means your loop runs one time too many or too few. Common causes:\n\n- Forgetting that \`range(1, 10)\` **stops before 10**. Use \`range(1, 11)\` to include 10.\n- Starting at 0 when you meant 1\n- Using \`<\` when you meant \`<=\` (and the reverse)\n- The fence-post rule: N posts make N - 1 sections\n\nHabit: **test the smallest case** (1 round, 0 rounds) and the **last value** every time.`,
    analogy:`Fence posts and sections: counting one but meaning the other leaves you a post short.`,
    example:R`posts = 4
print("Posts:", posts)
print("Sections:", posts - 1)`},
  predict:{code:R`for i in range(5):
    print(i)`, q:'What is the LAST number printed?', opts:['5','4','0'], ans:1,
    why:'range(5) gives 0, 1, 2, 3, 4. It stops before 5.'},
  cast:{code:R`posts = 4
print("Posts:", posts)
print("Sections:", posts - 1)`, task:'Cast it. How many sections does a fence with 10 posts have?'},
  bug:{broken:R`total = 0
for n in range(1, 10):
    total += n
print(total)`, task:'The sum of 1 to 10 should be 55 but it prints 45. A number is missing. Fix the range.',
    cases:[{inputs:[],tests:[['Prints 55','out.strip()=="55"']]}],
    sol:R`total = 0
for n in range(1, 11):
    total += n
print(total)`, wrong:[R`total = 0
for n in range(1, 10):
    total += n
print(total)`, R`total = 0
for n in range(0, 10):
    total += n
print(total)`]},
  write:{prompt:'Ask for `Start: ` (whole number). Count down from that number **down to and including 1** with a `for` loop and `range`, then print `Liftoff!`.',
    starter:R`start = int(input("Start: "))
`,
    inputs:['3'],
    cases:[{inputs:['3'],tests:[['3,2,1,Liftoff!','[l for l in lines if l.isdigit() or l=="Liftoff!"]==["3","2","1","Liftoff!"]'],['Uses for and range','re.search(r"^for\\b", src, re.M) is not None and "range(" in src']]},{inputs:['1'],tests:[['1 then Liftoff!','[l for l in lines if l.isdigit() or l=="Liftoff!"]==["1","Liftoff!"]']]},{inputs:['5'],tests:[['5 down to 1','[l for l in lines if l.isdigit() or l=="Liftoff!"]==["5","4","3","2","1","Liftoff!"]']]}],
    sol:R`start = int(input("Start: "))
for n in range(start, 0, -1):
    print(n)
print("Liftoff!")`,
    wrong:[R`start = int(input("Start: "))
for n in range(start, 1, -1):
    print(n)
print("Liftoff!")`, R`start = int(input("Start: "))
for n in range(start, 0):
    print(n)
print("Liftoff!")`],
    hints:['A countdown needs a negative step of -1.','range(start, 0, -1) stops BEFORE 0, so it includes 1.','Print Liftoff! after the loop.','start = int(input("Start: "))\nfor n in range(start, 0, -1):\n    print(n)\nprint("Liftoff!")']},
  power:{can:['Spot and fix the classic off-by-one','Choose range stops correctly'],
    expand:'Re-check three of your earlier loops using the 0, 1 and last-value test.',
    where:'Off-by-one bugs have crashed rockets and billing systems. Testing the edges is a professional habit.',
    next:'Next: learn to trace a loop by hand, before you run it.'},
  codex:{title:'Off-by-one',body:'range stops before the end. Test 0, 1 and the last value. N posts make N-1 sections.',snip:R`range(1, 11)   # 1..10`}
},
{
  id:'r3-20', realm:3, n:20, title:'Tracing a loop by hand',
  teaches:['trace-loops'], requires:['off-by-one'],
  story:`"Before you ever run a spell," Ada says, taking a piece of chalk, "you should be able to run it **in your head**. Draw a table: one row per round, one column per variable. It is the best debugging tool there is."`,
  concept:{
    html:`A **trace table** tracks each variable round by round:\n\n\`\`\`\ntotal = 0\nfor n in range(1, 4):\n    total += n * 2\n\`\`\`\n\n| round | n | total after |\n|---|---|---|\n| 1 | 1 | 2 |\n| 2 | 2 | 6 |\n| 3 | 3 | 12 |\n\nWhen a loop surprises you, add a \`print\` inside it to see the same table printed by the computer. Also watch where variables are **reset**: setting \`total = 0\` *inside* the loop wipes the memory each round.`,
    analogy:`A running scoreboard: update it after every round and the story of the game is right there.`,
    example:R`total = 0
for n in range(1, 4):
    total += n * 2
    print("n =", n, "total =", total)`},
  predict:{code:R`total = 0
for n in range(1, 4):
    total += n * 2
print(total)`, q:'Fill in the trace table in your head. What prints?', opts:['6','12','2'], ans:1,
    why:'Round 1 adds 2, round 2 adds 4, round 3 adds 6: 2 + 4 + 6 = 12.'},
  cast:{code:R`total = 0
for n in range(1, 4):
    total += n * 2
    print("n =", n, "total =", total)
print(total)`, task:'Cast it. This is the trace table printed by the computer.'},
  bug:{broken:R`for n in range(1, 5):
    total = 0
    total += n
    print(f"n={n} total={total}")`, task:'The running total should grow (1, 3, 6, 10) but resets every round. Fix where `total` starts.',
    cases:[{inputs:[],tests:[['Running total','lines==["n=1 total=1","n=2 total=3","n=3 total=6","n=4 total=10"]']]}],
    sol:R`total = 0
for n in range(1, 5):
    total += n
    print(f"n={n} total={total}")`, wrong:[R`for n in range(1, 5):
    total = 0
    total += n
    print(f"n={n} total={total}")`]},
  write:{prompt:'A treasure starts at 1 gold and **doubles** each day for 5 days. Print `Day 1: 2` through `Day 5: 32` (one line per day), using a loop and an accumulator that you multiply.',
    starter:R`gold = 1
`,
    cases:[{inputs:[],tests:[['Five doubling days','lines==["Day 1: 2","Day 2: 4","Day 3: 8","Day 4: 16","Day 5: 32"]'],['Uses a loop','re.search(r"\\b(for|while)\\b", src) is not None']]}],
    sol:R`gold = 1
for day in range(1, 6):
    gold *= 2
    print(f"Day {day}: {gold}")`,
    wrong:[R`gold = 0
for day in range(1, 6):
    gold *= 2
    print(f"Day {day}: {gold}")`, R`print("Day 1: 2")
print("Day 2: 4")
print("Day 3: 8")
print("Day 4: 16")
print("Day 5: 32")`],
    hints:['Start gold at 1 and loop 5 times.','gold *= 2 doubles it each day.','Print after doubling so Day 1 shows 2.','gold = 1\nfor day in range(1, 6):\n    gold *= 2\n    print(f"Day {day}: {gold}")']},
  power:{can:['Predict a loop result on paper','Use print as a trace tool'],
    expand:'Trace a loop by hand first, then run it to check yourself, three times this week.',
    where:'Debuggers, code reviews and technical interviews all test your ability to trace code.',
    next:'Next: keep asking until the answer is valid.'},
  codex:{title:'Tracing',body:'Write a table of variables per round. Add prints inside loops to see the table. Beware resetting inside the loop.',snip:R`print("n =", n, "total =", total)`}
},
{
  id:'r3-21', realm:3, n:21, title:'Asking until the answer is valid',
  teaches:['ask-until-valid'], requires:['trace-loops','menu-loop','validate-if'],
  story:`The great door speaks: "STATE YOUR AGE." You type "banana". "NO." You type "-5". "NO." You finally type "30". "ENTER." Sudo whispers: "Doors like that never give up. Neither should your programs."`,
  concept:{
    html:`Combine validation with a loop: **keep asking until the answer is valid**.\n\n\`\`\`\nwhile True:\n    text = input("Age: ")\n    if text.isdigit() and 1 <= int(text) <= 120:\n        break\n    print("Try again")\nprint("Age saved:", text)\n\`\`\`\n\nNotice the order in the condition: \`text.isdigit() and ...\`. Python stops at the first False part, so \`int(text)\` is **never reached** for text like "banana" and cannot crash.\n\nThis is the standard pattern for any input from a human.`,
    analogy:`A door that keeps saying "no, try again" until you give the right key.`,
    example:R`while True:
    text = input("Age: ")
    if text.isdigit() and 1 <= int(text) <= 120:
        break
    print("Try again")
print("Age saved:", text)`},
  predict:{code:R`text = "abc"
print(text.isdigit() and int(text) > 5)`, q:'What prints?', opts:['False','ValueError','True'], ans:0,
    why:'text.isdigit() is False, so Python stops there and never runs int("abc"). The whole condition is False.'},
  cast:{code:R`while True:
    text = input("Age: ")
    if text.isdigit() and 1 <= int(text) <= 120:
        break
    print("Try again")
print("Age saved:", text)`, task:'Cast it with these lines in the Inputs box: abc, 200, 30', inputs:['abc','200','30']},
  bug:{broken:R`while True:
    text = input("Age: ")
    if 1 <= int(text) <= 120:
        break
    print("Try again")
print("Age saved:", text)`, task:'Typing abc crashes with a ValueError instead of saying Try again. Check isdigit() first.',
    cases:[{inputs:['abc','30'],tests:[['abc then 30','[l for l in lines if l=="Try again" or l.startswith("Age saved")]==["Try again","Age saved: 30"]']]},{inputs:['30'],tests:[['30 straight away','[l for l in lines if l=="Try again" or l.startswith("Age saved")]==["Age saved: 30"]']]}],
    sol:R`while True:
    text = input("Age: ")
    if text.isdigit() and 1 <= int(text) <= 120:
        break
    print("Try again")
print("Age saved:", text)`, wrong:[R`while True:
    text = input("Age: ")
    if 1 <= int(text) <= 120:
        break
    print("Try again")
print("Age saved:", text)`]},
  write:{prompt:'Keep asking `Age: ` until the player types whole digits between 1 and 120 inclusive. Print `Try again` after each bad answer. When valid, print `Age saved: ` and the age.',
    starter:R`# loop until valid
`,
    inputs:['abc','-5','200','30'],
    cases:[{inputs:['abc','-5','200','30'],tests:[['Three bad then 30','[l for l in lines if l=="Try again" or l.startswith("Age saved")]==["Try again"]*3+["Age saved: 30"]']]},{inputs:['25'],tests:[['25 straight away','[l for l in lines if l=="Try again" or l.startswith("Age saved")]==["Age saved: 25"]']]},{inputs:['0','121','1'],tests:[['0 and 121 rejected, 1 accepted','[l for l in lines if l=="Try again" or l.startswith("Age saved")]==["Try again","Try again","Age saved: 1"]']]},{inputs:['120'],tests:[['120 accepted','[l for l in lines if l=="Try again" or l.startswith("Age saved")]==["Age saved: 120"]']]}],
    sol:R`while True:
    text = input("Age: ")
    if text.isdigit() and 1 <= int(text) <= 120:
        break
    print("Try again")
print("Age saved:", text)`,
    wrong:[R`text = input("Age: ")
if text.isdigit() and 1 <= int(text) <= 120:
    print("Age saved:", text)
else:
    print("Try again")`, R`while True:
    text = input("Age: ")
    if text.isdigit() and int(text) <= 120:
        break
    print("Try again")
print("Age saved:", text)`],
    hints:['Use while True: and ask inside the loop.','Valid means: text.isdigit() and 1 <= int(text) <= 120. If valid, break.','If not valid, print Try again and the loop repeats.','while True:\n    text = input("Age: ")\n    if text.isdigit() and 1 <= int(text) <= 120:\n        break\n    print("Try again")\nprint("Age saved:", text)']},
  power:{can:['Never crash on bad input again','Loop until a valid answer arrives'],
    expand:'Make a reusable pattern for a menu choice that must be 1, 2 or 3.',
    where:'Signup forms, ATM keypads and command-line tools all keep asking until the answer is valid.',
    next:'Next: simulate the real world with random loops.'},
  codex:{title:'Ask until valid',body:'while True: ask; if valid: break; else say Try again. Put isdigit() first in the condition.',snip:R`while True:
    text = input("> ")
    if text.isdigit():
        break`}
},
{
  id:'r3-22', realm:3, n:22, title:'Simulations: dice, coins and probability',
  teaches:['simulation'], requires:['ask-until-valid','random','accumulator'],
  story:`Ada flicks a coin and it lands on edge, glowing. "Want to know how likely something is? Don't solve it with maths. **Simulate** it: do it a thousand times and count."`,
  concept:{
    html:`A **simulation** runs a random event many times and counts the outcomes:\n\n\`\`\`\nimport random\nheads = 0\nfor i in range(1000):\n    if random.randint(0, 1) == 1:\n        heads += 1\nprint("Heads:", heads)\n\`\`\`\n\nYou will get something close to 500, but rarely **exactly** 500. That wobble is real randomness. The more rounds you run, the closer the share gets to the true probability.\n\nPattern: **random event + loop + accumulator.**`,
    analogy:`Throwing a die a thousand times and tallying: the pattern appears on its own.`,
    example:R`import random
sixes = 0
for i in range(600):
    if random.randint(1, 6) == 6:
        sixes += 1
print("Sixes:", sixes)`},
  predict:{q:'You flip a fair coin 10,000 times and count heads. What do you expect?', opts:['About 5000, usually a little off','Exactly 5000 every time','About 100'], ans:0,
    why:'Chance averages out near half but almost never lands on exactly half.'},
  cast:{code:R`import random
sixes = 0
for i in range(600):
    if random.randint(1, 6) == 6:
        sixes += 1
print("Sixes:", sixes)`, task:'Cast it several times. How close to 100 does it stay?'},
  bug:{broken:R`import random
sixes = 0
for i in range(600):
    roll = random.randint(1, 5)
    if roll == 6:
        sixes += 1
print("Sixes:", sixes)`, task:'No sixes ever show up! The die is missing a side. Fix the roll.',
    cases:[{inputs:[],tests:[['Roughly 100 sixes (30-200)','30 <= g.get("sixes", 0) <= 200'],['Prints Sixes:','lines[-1]=="Sixes: "+str(g.get("sixes"))']]}],
    sol:R`import random
sixes = 0
for i in range(600):
    roll = random.randint(1, 6)
    if roll == 6:
        sixes += 1
print("Sixes:", sixes)`, wrong:[R`import random
sixes = 0
for i in range(600):
    roll = random.randint(1, 5)
    if roll == 6:
        sixes += 1
print("Sixes:", sixes)`]},
  write:{prompt:'Flip a coin 100 times (`random.randint(0, 1)`: 1 is heads, 0 is tails). Count `heads` and `tails` in variables and print `Heads: ` and `Tails: ` on two lines.',
    starter:R`import random
heads = 0
tails = 0
`,
    cases:[{inputs:[],tests:[['Heads + tails is 100','g.get("heads",0) + g.get("tails",0) == 100'],['Both counts are plausible (20-80)','20 <= g.get("heads",0) <= 80'],['Prints both counts','"Heads: "+str(g.get("heads")) in lines and "Tails: "+str(g.get("tails")) in lines'],['Uses randint in a loop','"randint" in src and re.search(r"\\bfor\\b|\\bwhile\\b", src) is not None']]}],
    sol:R`import random
heads = 0
tails = 0
for i in range(100):
    if random.randint(0, 1) == 1:
        heads += 1
    else:
        tails += 1
print("Heads:", heads)
print("Tails:", tails)`,
    wrong:[R`heads = 50
tails = 50
print("Heads:", heads)
print("Tails:", tails)`, R`import random
heads = 0
tails = 0
for i in range(100):
    if random.randint(0, 1) == 1:
        heads += 1
print("Heads:", heads)
print("Tails:", tails)`],
    hints:['Loop 100 times.','Inside, flip with random.randint(0, 1) and add to heads or tails.','Print both counts after the loop.','import random\nheads = 0\ntails = 0\nfor i in range(100):\n    if random.randint(0, 1) == 1:\n        heads += 1\n    else:\n        tails += 1\nprint("Heads:", heads)\nprint("Tails:", tails)']},
  power:{can:['Estimate probabilities by simulation','Combine random, loops and counting'],
    expand:'Roll two dice 1000 times and count how often the total is 7. Compare with 2.',
    where:'Monte Carlo simulation is used in finance, engineering, game balancing and science.',
    next:'Next: slow things down with time.sleep for drama.'},
  codex:{title:'Simulation',body:'Repeat a random event many times and count outcomes. Expect close to, not exactly, the true share.',snip:R`for i in range(1000):
    if random.randint(1, 6) == 6:
        sixes += 1`}
},
{
  id:'r3-23', realm:3, n:23, title:'Pacing output with time.sleep',
  teaches:['sleep'], requires:['simulation'],
  story:`Torches in the last hall light one at a time, with a breath between each. "Drama," says Sudo, "is mostly timing." Ada hands you the final trick of the realm: a pause.`,
  concept:{
    html:`\`time.sleep(seconds)\` pauses your program. Like \`random\`, it lives in a module you must import:\n\n\`\`\`\nimport time\n\nfor n in range(3, 0, -1):\n    print(n)\n    time.sleep(1)\nprint("Liftoff!")\n\`\`\`\n\nYou can pass decimals: \`time.sleep(0.5)\` is half a second.\n\n**In the Spellbook** long pauses are shortened so lessons stay snappy. On your own computer the full time passes. Use it for countdowns, typing effects, rate-limiting and polite delays when talking to websites.`,
    analogy:`A drumbeat between lines of a story.`,
    example:R`import time

for n in range(3, 0, -1):
    print(n)
    time.sleep(1)
print("Liftoff!")`},
  predict:{q:'What does time.sleep(2) do?', opts:['Pauses the program for about 2 seconds','Prints 2','Repeats the program twice'], ans:0,
    why:'sleep simply waits. Nothing else changes.'},
  cast:{code:R`import time

for n in range(3, 0, -1):
    print(n)
    time.sleep(1)
print("Liftoff!")`, task:'Cast it. In the Spellbook the pauses are shortened.'},
  bug:{broken:R`for n in range(3, 0, -1):
    print(n)
    time.sleep(1)
print("Liftoff!")`, task:'NameError: time is not defined. Bring the toolkit in first.',
    cases:[{inputs:[],tests:[['Counts 3 2 1 Liftoff!','lines==["3","2","1","Liftoff!"]'],['Imports time','re.search(r"^import time\\b", src, re.M) is not None']]}],
    sol:R`import time
for n in range(3, 0, -1):
    print(n)
    time.sleep(1)
print("Liftoff!")`, wrong:[R`for n in range(3, 0, -1):
    print(n)
    time.sleep(1)
print("Liftoff!")`]},
  write:{prompt:'Print `Lighting torches...`, then for torch 1 to 3 print `Torch N lit` and pause half a second after each. Finish with `Hall lit!`.',
    starter:R`import time
`,
    cases:[{inputs:[],tests:[['Correct lines','lines==["Lighting torches...","Torch 1 lit","Torch 2 lit","Torch 3 lit","Hall lit!"]'],['Uses time.sleep','re.search(r"sleep\\(", src) is not None']]}],
    sol:R`import time
print("Lighting torches...")
for n in range(1, 4):
    print(f"Torch {n} lit")
    time.sleep(0.5)
print("Hall lit!")`,
    wrong:[R`print("Lighting torches...")
for n in range(1, 4):
    print(f"Torch {n} lit")
print("Hall lit!")`, R`import time
print("Lighting torches...")
for n in range(1, 3):
    print(f"Torch {n} lit")
    time.sleep(0.5)
print("Hall lit!")`],
    hints:['Print the opening line first.','Loop n over 1 to 3 and print f"Torch {n} lit", then time.sleep(0.5).','Print Hall lit! after the loop.','import time\nprint("Lighting torches...")\nfor n in range(1, 4):\n    print(f"Torch {n} lit")\n    time.sleep(0.5)\nprint("Hall lit!")']},
  power:{can:['Add pauses and pacing to a program','Import a second module'],
    expand:'Print a message one character at a time with a 0.05 second pause (use end="").',
    where:'Retry delays, rate limits when calling web services, progress effects and animations.',
    next:'Final test of the realm: the Boss of the Endless Corridor.'},
  codex:{title:'time.sleep',body:'import time, then time.sleep(seconds) pauses the program. Decimals allowed.',snip:R`import time
time.sleep(0.5)`}
},
{
  id:'r3-24', realm:3, n:24, title:'Boss: The Endless Corridor', kind:'boss',
  teaches:['realm3-boss'], requires:['sleep','nested-loops','ask-until-valid','accumulator','off-by-one','patterns'],
  story:`The torches blaze. The corridor lengthens, a hundred doors stretching to a single point. At the end stands the **Warden of Repetition**, a hulking figure that moves in perfect cycles. "AGAIN," it booms. "AND AGAIN. AND AGAIN. AND..." Sudo grins. "It only knows one trick. We know several."`,
  boss:{name:'The Endless Corridor', hp:5},
  phases:[
    {type:'mcq', code:R`count = 0
for i in range(3):
    for j in range(2):
        count += 1
print(count)`, q:'Round 1: What prints?', opts:['5','6','3'], ans:1,
     why:'The inner loop runs 2 times for each of 3 outer rounds: 3 x 2 = 6.', tags:['r3-14']},
    {type:'write', prompt:'Round 2 (FizzBuzz): For `n` from 1 to 15 print `Fizz` if divisible by 3, `Buzz` if divisible by 5, `FizzBuzz` if divisible by both, otherwise the number.',
     starter:R`for n in range(1, 16):
`,
     cases:[{inputs:[],tests:[['FizzBuzz 1 to 15','lines==["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]']]}],
     sol:R`for n in range(1, 16):
    if n % 15 == 0:
        print("FizzBuzz")
    elif n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")
    else:
        print(n)`,
     wrong:[R`for n in range(1, 16):
    if n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")
    elif n % 15 == 0:
        print("FizzBuzz")
    else:
        print(n)`, R`for n in range(1, 16):
    print(n)`],
     hints:['Check divisible by both (15) first.','Then 3, then 5, then print the number.','if n % 15 == 0 ... elif n % 3 == 0 ... elif n % 5 == 0 ... else: print(n)','for n in range(1, 16):\n    if n % 15 == 0:\n        print("FizzBuzz")\n    elif n % 3 == 0:\n        print("Fizz")\n    elif n % 5 == 0:\n        print("Buzz")\n    else:\n        print(n)'], tags:['r2-06','r3-04','r3-11']},
    {type:'mcq', code:R`for i in range(1, 4):
    print(i)`, q:'Round 3: What is the LAST number printed?', opts:['3','4','1'], ans:0,
     why:'range(1, 4) stops before 4: it gives 1, 2, 3.', tags:['r3-05','r3-19']},
    {type:'write', prompt:'Round 4: Ask `Number: ` (a positive whole number). Using a `while` loop, add up its digits and print `Digit sum: ` and the answer. (Hint: `% 10` gives the last digit, `// 10` removes it.)',
     starter:R`n = int(input("Number: "))
total = 0
`,
     inputs:['123'],
     cases:[{inputs:['123'],tests:[['123 gives 6','lines[-1]=="Digit sum: 6"']]},{inputs:['9'],tests:[['9 gives 9','lines[-1]=="Digit sum: 9"']]},{inputs:['1000'],tests:[['1000 gives 1','lines[-1]=="Digit sum: 1"']]},{inputs:['999'],tests:[['999 gives 27','lines[-1]=="Digit sum: 27"']]}],
     sol:R`n = int(input("Number: "))
total = 0
while n > 0:
    total += n % 10
    n //= 10
print("Digit sum:", total)`,
     wrong:[R`n = int(input("Number: "))
total = 0
total += n % 10
print("Digit sum:", total)`, R`n = int(input("Number: "))
total = 0
while n > 0:
    total += n % 10
    n //= 10
print("Digit sum:", n)`],
     hints:['Loop while n is above 0.','Add n % 10 to total, then drop the last digit with n //= 10.','Print total after the loop.','n = int(input("Number: "))\ntotal = 0\nwhile n > 0:\n    total += n % 10\n    n //= 10\nprint("Digit sum:", total)'], tags:['r3-01','r3-09','r1-06']},
    {type:'mcq', code:R`n = 10
while n > 0:
    n -= 3
print(n)`, q:'Round 5: What prints?', opts:['0','-2','1'], ans:1,
     why:'n goes 10, 7, 4, 1, then -2. At -2 the condition fails and the loop ends.', tags:['r3-01','r3-20']}
  ],
  power:{can:['Combine nested loops, accumulators, while loops and arithmetic','Predict loops on paper'],
    expand:'Add a seventh test of your own: print only the multiples of 7 below 100 in a nested pattern.',
    where:'FizzBuzz and digit sums are favourite interview warm-ups. You can now solve both from scratch.',
    next:'A real-world mission waits: a password checker and a multiplication-table maker.'},
  codex:{title:'Realm 3 boss',body:'You wield while, for, range, break, continue and nested loops with confidence.',snip:R`while n > 0:
    total += n % 10
    n //= 10`}
},
{
  id:'r3-25', realm:3, n:25, title:'Real-World Mission: Password Checker and Times Tables',
  teaches:['mission3'], requires:['realm3-boss'],
  story:`Past the Warden, a two-person office: a teacher and a security officer wait with problems only loops can solve. The teacher needs times tables for her class. The officer needs a tool that tells staff when a password is weak. Ada stays by the door. "Real work again. Do both."`,
  concept:{
    html:`**Mission brief, part 1: Times table maker.** Ask for a number and print its table from 1 to 10 in the format \`7 x 3 = 21\`.\n\n**Part 2: Password checker.** A password is **Strong** only if it:\n- has **8 or more characters** (\`len(password)\`)\n- contains at least one **digit** (\`ch.isdigit()\`)\n- contains at least one **uppercase letter** (\`ch.isupper()\`)\n\nWalk through the password with a loop and **flags** (lesson 12). Check the rules in order and name the first one that fails.\n\nTwo new methods: \`"A".isupper()\` is True, \`"a".isupper()\` is False; \`"7".isdigit()\` is True.`,
    analogy:`The teacher's tool is a loop with f-strings. The officer's tool is a flag search plus a guard chain.`,
    example:R`n = 7
for k in range(1, 4):
    print(f"{n} x {k} = {n * k}")`},
  predict:{code:R`print("A".isupper(), "a".isupper(), "7".isdigit())`, q:'What prints?', opts:['True False True','False True False','True True True'], ans:0,
    why:'Capital A is uppercase, lowercase a is not, and "7" is a digit.'},
  cast:{code:R`n = 7
for k in range(1, 11):
    print(f"{n} x {k} = {n * k}")`, task:'Cast it, then change n to 12.'},
  bug:{broken:R`n = int(input("Table of: "))
for k in range(1, 10):
    print(f"{n} x {k} = {n * k}")`, task:'The teacher says the 10 line is missing from the table. Fix the range.',
    cases:[{inputs:['7'],tests:[['7 times table, 1 to 10','lines[1:]==["7 x "+str(k)+" = "+str(7*k) for k in range(1,11)]']]},{inputs:['3'],tests:[['3 times table','lines[1:]==["3 x "+str(k)+" = "+str(3*k) for k in range(1,11)]']]}],
    sol:R`n = int(input("Table of: "))
for k in range(1, 11):
    print(f"{n} x {k} = {n * k}")`, wrong:[R`n = int(input("Table of: "))
for k in range(1, 10):
    print(f"{n} x {k} = {n * k}")`]},
  write:{prompt:'Build the password checker. Ask `Password: `. If shorter than 8 print `Weak: needs 8+ characters`; else if no digit print `Weak: needs a digit`; else if no uppercase letter print `Weak: needs an uppercase letter`; otherwise `Strong`.',
    starter:R`password = input("Password: ")
`,
    inputs:['Abcdefg1'],
    cases:[{inputs:['Abc12'],tests:[['Too short','lines[-1]=="Weak: needs 8+ characters"']]},{inputs:['abc'],tests:[['Short and no digit: length first','lines[-1]=="Weak: needs 8+ characters"']]},{inputs:['abcdefgh'],tests:[['No digit','lines[-1]=="Weak: needs a digit"']]},{inputs:['abcdefg1'],tests:[['No uppercase','lines[-1]=="Weak: needs an uppercase letter"']]},{inputs:['Abcdefg1'],tests:[['Strong','lines[-1]=="Strong"'],['Uses a loop','re.search(r"\\bfor\\b", src) is not None']]},{inputs:['ABCDEFG1'],tests:[['Uppercase with digit is Strong','lines[-1]=="Strong"']]}],
    sol:R`password = input("Password: ")
has_digit = False
has_upper = False
for ch in password:
    if ch.isdigit():
        has_digit = True
    if ch.isupper():
        has_upper = True
if len(password) < 8:
    print("Weak: needs 8+ characters")
elif not has_digit:
    print("Weak: needs a digit")
elif not has_upper:
    print("Weak: needs an uppercase letter")
else:
    print("Strong")`,
    wrong:[R`password = input("Password: ")
has_digit = False
for ch in password:
    if ch.isdigit():
        has_digit = True
if len(password) < 8:
    print("Weak: needs 8+ characters")
elif not has_digit:
    print("Weak: needs a digit")
else:
    print("Strong")`, R`password = input("Password: ")
has_digit = False
has_upper = False
for ch in password:
    if ch.isdigit():
        has_digit = True
    if ch.isupper():
        has_upper = True
if not has_digit:
    print("Weak: needs a digit")
elif len(password) < 8:
    print("Weak: needs 8+ characters")
elif not has_upper:
    print("Weak: needs an uppercase letter")
else:
    print("Strong")`],
    hints:['Loop through the characters with two flags: has_digit and has_upper.','After the loop use a guard chain: length first, then digit, then uppercase.','len(password) < 8 gives the first weak case; else is Strong.','password = input("Password: ")\nhas_digit = False\nhas_upper = False\nfor ch in password:\n    if ch.isdigit():\n        has_digit = True\n    if ch.isupper():\n        has_upper = True\nif len(password) < 8:\n    print("Weak: needs 8+ characters")\nelif not has_digit:\n    print("Weak: needs a digit")\nelif not has_upper:\n    print("Weak: needs an uppercase letter")\nelse:\n    print("Strong")']},
  power:{can:['Generate formatted tables with loops','Check passwords against real rules','Combine flags, loops and guard clauses'],
    expand:'Add rules: needs a lowercase letter, and a special symbol like ! or #. Then ask repeatedly until the password is Strong.',
    where:'Both tools are genuine: teaching resources and security checks on signup forms are built exactly this way.',
    next:'One last gap check before the Apprentice Seal.'},
  codex:{title:'Mission: tools',body:'Times tables are a loop with an f-string. Password rules are flags set in a loop, then a guard chain.',snip:R`print(f"{n} x {k} = {n * k}")`}
},
{
  id:'r3-26', realm:3, n:26, title:'Gap Check: the Apprentice Seal', kind:'gap', passPct:80,
  teaches:['realm3-gap'], requires:['mission3'],
  story:`The Warden crumbles to dust. Ada steps forward holding a glowing seal. "The Apprentice Seal is earned, not given. One last slate: loops, ranges and everything before. Eighty percent and it is yours."`,
  phases:[
    {type:'mcq', code:R`n = 3
while n > 0:
    n -= 1
print(n)`, q:'What prints?', opts:['3','1','0'], ans:2, why:'The loop ends when n reaches 0.', tags:['r3-01']},
    {type:'mcq', code:R`for i in range(2, 8, 2):
    print(i)`, q:'What prints?', opts:['2, 4, 6 on separate lines','2, 4, 6, 8','2, 3, 4, 5, 6, 7'], ans:0, why:'Start 2, step 2, stop before 8: 2, 4, 6.', tags:['r3-05']},
    {type:'mcq', code:R`for n in range(5):
    if n == 3:
        break
    print(n)`, q:'What prints?', opts:['0 1 2 3','0 1 2','0 1 2 4'], ans:1, why:'break stops the loop when n is 3, before it prints.', tags:['r3-07']},
    {type:'mcq', code:R`for n in range(5):
    if n % 2 == 0:
        continue
    print(n)`, q:'What prints?', opts:['0 2 4','1 3','1 2 3 4'], ans:1, why:'Even numbers are skipped; only 1 and 3 print.', tags:['r3-08']},
    {type:'mcq', code:R`total = 0
for n in range(4):
    total += n
print(total)`, q:'What prints?', opts:['10','6','4'], ans:1, why:'0 + 1 + 2 + 3 = 6.', tags:['r3-09']},
    {type:'mcq', code:R`for i in range(3):
    print(i, end="-")`, q:'What prints?', opts:['0-1-2-','0 1 2','-0-1-2'], ans:0, why:'end="-" puts a dash after each item instead of a new line.', tags:['r3-15']},
    {type:'mcq', code:R`for n in range(3):
    if n == 5:
        break
else:
    print("no break")`, q:'What prints?', opts:['Nothing','no break','Error'], ans:1, why:'The loop finishes without ever hitting break, so the else runs.', tags:['r3-18']},
    {type:'mcq', code:R`n = 1
while n < 5:
    print(n)`, q:'What happens?', opts:['Prints 1 to 4','Prints 1 forever (until stopped)','Prints nothing'], ans:1, why:'n never changes, so the loop never ends.', tags:['r3-03']},
    {type:'mcq', q:'Which line gives a whole number from 1 to 6, both included?', opts:['random.randint(1, 6)','random.randint(0, 6)','random.random(1, 6)'], ans:0, why:'randint includes both ends.', tags:['r3-16']},
    {type:'mcq', q:'What does break do inside a loop?', opts:['Skips to the next round','Ends the loop immediately','Crashes the program'], ans:1, why:'break leaves the loop. continue skips just one round.', tags:['r3-07','r3-08']},
    {type:'write', pts:2, prompt:'Final trial: ask `Up to: ` and add up all the **odd** numbers from 1 to that number (inclusive). Print `Odd total: ` and the sum.',
     starter:R`top = int(input("Up to: "))
`,
     inputs:['10'],
     cases:[{inputs:['10'],tests:[['10 gives 25','lines[-1]=="Odd total: 25"']]},{inputs:['1'],tests:[['1 gives 1','lines[-1]=="Odd total: 1"']]},{inputs:['7'],tests:[['7 gives 16','lines[-1]=="Odd total: 16"']]},{inputs:['0'],tests:[['0 gives 0','lines[-1]=="Odd total: 0"']]}],
     sol:R`top = int(input("Up to: "))
total = 0
for n in range(1, top + 1):
    if n % 2 == 1:
        total += n
print("Odd total:", total)`,
     wrong:[R`top = int(input("Up to: "))
total = 0
for n in range(1, top + 1):
    total += n
print("Odd total:", total)`, R`top = int(input("Up to: "))
total = 0
for n in range(1, top):
    if n % 2 == 1:
        total += n
print("Odd total:", total)`],
     hints:['Start total at 0 and loop 1 to top inclusive.','Only add n when n % 2 == 1.','Print after the loop.','top = int(input("Up to: "))\ntotal = 0\nfor n in range(1, top + 1):\n    if n % 2 == 1:\n        total += n\nprint("Odd total:", total)'], tags:['r3-09','r3-11','r3-19']}
  ],
  power:{can:['Repeat, count, search, filter and simulate with loops','Write programs that decide AND repeat'],
    expand:'Build your own mini-game from scratch: a number-guessing game with limited tries.',
    where:'Decisions plus loops are the core of nearly every program. You have the full beginner toolkit.',
    next:'Stage 3 begins: Realm 4 (Treasure Chests: lists and tuples) is on the way.'},
  codex:{title:'Apprentice Seal',body:'You can store, decide and repeat. The foundations of programming are yours.',snip:R`for n in range(1, top + 1):
    if n % 2 == 1:
        total += n`}
}
);
